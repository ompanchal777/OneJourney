import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import zlib from "zlib";

// CRC32 table helper for PNG generation
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let k = n;
  for (let j = 0; j < 8; j++) {
    if (k & 1) {
      k = 0xedb88320 ^ (k >>> 1);
    } else {
      k = k >>> 1;
    }
  }
  crcTable[n] = k;
}

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type: string, data: Buffer): Buffer {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function processPngToBlue(buffer: Buffer): Buffer {
  // Check PNG signature
  if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
    throw new Error("Invalid PNG signature");
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idatBuffers: Buffer[] = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9]; // 6 = RGBA, 2 = RGB
    } else if (type === "IDAT") {
      idatBuffers.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (colorType !== 6 && colorType !== 2) {
    throw new Error("Unsupported color type. Expected RGB or RGBA.");
  }

  const bytesPerPixel = colorType === 6 ? 4 : 3;
  const decompressed = zlib.inflateSync(Buffer.concat(idatBuffers));

  const scanlineLength = 1 + width * bytesPerPixel;
  const outScanlineLength = 1 + width * 4; // Always output RGBA
  const outputData = Buffer.alloc(height * outScanlineLength);
  
  // Track the fully reconstructed previous line
  let prevReconLine = Buffer.alloc(width * bytesPerPixel);

  for (let y = 0; y < height; y++) {
    const scanlineOffset = y * scanlineLength;
    const filterType = decompressed[scanlineOffset];
    const currentLine = Buffer.alloc(width * bytesPerPixel);

    // Reconstruct raw scanline pixels by undoing PNG filters
    for (let i = 0; i < width * bytesPerPixel; i++) {
      const rawByte = decompressed[scanlineOffset + 1 + i];
      const left = i >= bytesPerPixel ? currentLine[i - bytesPerPixel] : 0;
      const up = y > 0 ? prevReconLine[i] : 0;
      const diag = (y > 0 && i >= bytesPerPixel) ? prevReconLine[i - bytesPerPixel] : 0;
      
      let reconByte = rawByte;

      if (filterType === 1) { // Sub
        reconByte = (rawByte + left) & 0xff;
      } else if (filterType === 2) { // Up
        reconByte = (rawByte + up) & 0xff;
      } else if (filterType === 3) { // Average
        reconByte = (rawByte + Math.floor((left + up) / 2)) & 0xff;
      } else if (filterType === 4) { // Paeth
        const p = left + up - diag;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - diag);
        let pr = 0;
        if (pa <= pb && pa <= pc) {
          pr = left;
        } else if (pb <= pc) {
          pr = up;
        } else {
          pr = diag;
        }
        reconByte = (rawByte + pr) & 0xff;
      }

      currentLine[i] = reconByte;
    }

    // Save the fully reconstructed line for the next row
    currentLine.copy(prevReconLine);

    // Process and modify color channels + alpha channel
    const processedLine = Buffer.alloc(width * 4);
    for (let x = 0; x < width; x++) {
      const srcIdx = x * bytesPerPixel;
      const destIdx = x * 4;

      const r = currentLine[srcIdx];
      const g = currentLine[srcIdx + 1];
      const b = currentLine[srcIdx + 2];
      const a = bytesPerPixel === 4 ? currentLine[srcIdx + 3] : 255;

      const maxVal = Math.max(r, g, b);
      const minVal = Math.min(r, g, b);
      const diff = maxVal - minVal;

      if (maxVal > 210 && diff < 20) {
        // Transparent (white background removal)
        processedLine[destIdx] = 0;
        processedLine[destIdx + 1] = 0;
        processedLine[destIdx + 2] = 0;
        processedLine[destIdx + 3] = 0;
      } else if (maxVal > 180 && diff < 25) {
        // Soft edges
        const factor = (255 - maxVal) / 75.0;
        const alpha = Math.max(0, Math.min(255, Math.round(a * factor)));
        
        const intensity = Math.max(g, b);
        processedLine[destIdx]     = Math.round(r * 0.15);
        processedLine[destIdx + 1] = Math.round(intensity * 0.47);
        processedLine[destIdx + 2] = intensity;
        processedLine[destIdx + 3] = alpha;
      } else {
        // Blue shift color mapping
        const intensity = Math.max(g, b);
        processedLine[destIdx]     = Math.round(r * 0.15);
        processedLine[destIdx + 1] = Math.round(intensity * 0.47);
        processedLine[destIdx + 2] = intensity;
        processedLine[destIdx + 3] = a;
      }
    }

    // Write to raw RGBA buffer (no filter byte yet)
    processedLine.copy(outputData, y * width * 4);
  }

  // ── Downsample to 32x32 for standard favicon size ──
  const FAVICON_SIZE = 32;
  const resizedData = Buffer.alloc(FAVICON_SIZE * FAVICON_SIZE * 4);
  for (let y = 0; y < FAVICON_SIZE; y++) {
    const srcY = Math.floor((y * height) / FAVICON_SIZE);
    for (let x = 0; x < FAVICON_SIZE; x++) {
      const srcX = Math.floor((x * width) / FAVICON_SIZE);
      const srcIdx = (srcY * width + srcX) * 4;
      const destIdx = (y * FAVICON_SIZE + x) * 4;

      resizedData[destIdx]     = outputData[srcIdx];
      resizedData[destIdx + 1] = outputData[srcIdx + 1];
      resizedData[destIdx + 2] = outputData[srcIdx + 2];
      resizedData[destIdx + 3] = outputData[srcIdx + 3];
    }
  }

  // Add PNG filter bytes (filter type 0) for each scanline of the 32x32 image
  const favScanlineLength = 1 + FAVICON_SIZE * 4;
  const finalPngData = Buffer.alloc(FAVICON_SIZE * favScanlineLength);
  for (let y = 0; y < FAVICON_SIZE; y++) {
    finalPngData[y * favScanlineLength] = 0; // Filter type 0 (None)
    resizedData.copy(
      finalPngData,
      y * favScanlineLength + 1,
      y * FAVICON_SIZE * 4,
      (y + 1) * FAVICON_SIZE * 4
    );
  }

  // Construct final PNG buffer
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR data (13 bytes)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(FAVICON_SIZE, 0);
  ihdrData.writeUInt32BE(FAVICON_SIZE, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type (RGBA)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = makeChunk("IHDR", ihdrData);

  // IDAT data (Compressed pixel buffer)
  const idatData = zlib.deflateSync(finalPngData);
  const idatChunk = makeChunk("IDAT", idatData);

  // IEND data (0 bytes)
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "logo.png");
    const logoBuffer = fs.readFileSync(filePath);
    
    const processedBuffer = processPngToBlue(logoBuffer);

    return new Response(processedBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("API logo-blue processing failed:", error.message);
    return new Response("Error processing image", { status: 500 });
  }
}
