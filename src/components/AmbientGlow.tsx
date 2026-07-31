/**
 * AmbientGlow — Reusable breathing glow blob component
 *
 * Renders a cinematic radial-gradient blob that slowly breathes.
 * Place this as an absolute-positioned sibling inside a relative container.
 *
 * Props:
 *   color      — CSS color string (default: '#0077FF')
 *   size       — diameter in px (default: 400)
 *   opacity    — base opacity 0–1 (default: 0.12)
 *   duration   — breathing cycle in seconds (default: 10)
 *   blur       — blur radius in px (default: 120)
 *   className  — additional Tailwind / CSS classes
 *   delay      — animation delay in seconds (default: 0)
 */

"use client";

interface AmbientGlowProps {
  color?: string;
  size?: number;
  opacity?: number;
  duration?: number;
  blur?: number;
  className?: string;
  delay?: number;
  variant?: "normal" | "slow" | "pulse";
}

export default function AmbientGlow({
  color = "#0077FF",
  size = 400,
  opacity = 0.12,
  duration = 10,
  blur = 120,
  className = "",
  delay = 0,
  variant = "normal",
}: AmbientGlowProps) {
  const animClass =
    variant === "slow"
      ? "breathe-slow"
      : variant === "pulse"
      ? "breathe-pulse"
      : "breathing-glow";

  return (
    <div
      className={`absolute pointer-events-none rounded-full ${animClass} ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        filter: `blur(${blur}px)`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        willChange: "transform, opacity",
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden="true"
    />
  );
}
