"use client";

import { useEffect, useState } from "react";

interface TransparentLogoProps {
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

export default function TransparentLogo({ className = "", style = {}, alt = "OneJourney Logo" }: TransparentLogoProps) {
  const [logoSrc, setLogoSrc] = useState<string>("");

  useEffect(() => {
    const img = new Image();
    img.src = "/logo.png";
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // 1. Transparency detection:
          // Background pixels are bright (max value > 210) and desaturated (low difference between channels)
          const maxVal = Math.max(r, g, b);
          const minVal = Math.min(r, g, b);
          const diff = maxVal - minVal;

          if (maxVal > 210 && diff < 20) {
            data[i + 3] = 0; // Fully transparent
          } else if (maxVal > 180 && diff < 25) {
            // Smooth transition for edges
            const factor = (255 - maxVal) / (255 - 180);
            data[i + 3] = Math.round(data[i + 3] * factor);
          } else {
            // 2. Color shift to premium Sapphire Blue theme (#0077FF):
            const intensity = Math.max(g, b);
            
            data[i] = Math.round(r * 0.15);              // Red (low)
            data[i + 1] = Math.round(intensity * 0.47);  // Green (approx 47%)
            data[i + 2] = intensity;                     // Blue (full intensity)
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setLogoSrc(canvas.toDataURL("image/png"));
      } catch (e) {
        console.error("Error processing logo transparency & color shift", e);
        // Fallback to original image if anything goes wrong
        setLogoSrc("/logo.png");
      }
    };
    img.onerror = () => {
      setLogoSrc("/logo.png");
    };
  }, []);

  if (!logoSrc) {
    // Return a placeholder or render nothing until loaded to avoid layout shifts
    return <div className={className} style={{ ...style, width: style.width, height: style.height }} />;
  }

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={className}
      style={style}
    />
  );
}
