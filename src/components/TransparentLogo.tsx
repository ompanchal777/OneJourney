/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

interface TransparentLogoProps {
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

export default function TransparentLogo({
  className = "",
  style = {},
  alt = "OneJourney Logo",
}: TransparentLogoProps) {
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

          const maxVal = Math.max(r, g, b);
          const minVal = Math.min(r, g, b);
          const diff = maxVal - minVal;

          if (maxVal > 210 && diff < 20) {
            data[i + 3] = 0;
          } else if (maxVal > 180 && diff < 25) {
            const factor = (255 - maxVal) / (255 - 180);
            data[i + 3] = Math.round(data[i + 3] * factor);
          } else {
            const intensity = Math.max(g, b);
            data[i]     = Math.round(r * 0.15);
            data[i + 1] = Math.round(intensity * 0.47);
            data[i + 2] = intensity;
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setLogoSrc(canvas.toDataURL("image/png"));
      } catch (e) {
        console.error("TransparentLogo: canvas processing failed", e);
        setLogoSrc("/logo.png");
      }
    };
    img.onerror = () => setLogoSrc("/logo.png");
  }, []);

  if (!logoSrc) {
    return (
      <div
        className={className}
        style={{ ...style, width: style.width, height: style.height }}
      />
    );
  }

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={className}
      style={{
        imageRendering: "high-quality" as React.CSSProperties["imageRendering"],
        ...style,
      }}
    />
  );
}
