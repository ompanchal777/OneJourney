/**
 * CinematicIntro — Light Theme Premium Opening
 *
 * Scene timeline:
 *   Scene 1 (0–1s)   — Clean white canvas, sapphire particles rise, logo appears
 *   Scene 2 (1–2s)   — SVG bridge draws itself in sapphire blue
 *   Scene 3 (2–3s)   — "Every Journey Begins With One Step." (Deep Sapphire)
 *   Scene 4 (3–4s)   — Full brand identity on white
 *   Scene 5 (4–5s)   — Elegant fade to the landing page
 *
 * Fixed bugs:
 *   ✅ No hasRun.current guard (React Strict Mode safe)
 *   ✅ No internal visible state (parent AnimatePresence owns exit)
 *   ✅ onComplete() called directly from timer
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TransparentLogo from "./TransparentLogo";

interface CinematicIntroProps {
  onComplete: () => void;
}

/* ─── Stable particle positions (no Math.random — avoids hydration mismatch) ─ */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${6 + (i * 4.6 + 8) % 86}%`,
  bottom: `${(i * 6.3 + 4) % 35}%`,
  size: 2 + (i % 4) * 1,
  duration: 6 + (i % 5),
  delay: (i * 0.6) % 4.5,
  alt: i % 3 === 0,
}));

/* ─── Bridge SVG ────────────────────────────────────────── */
function BridgeSVG({ draw }: { draw: boolean }) {
  return (
    <svg viewBox="0 0 200 100" fill="none" className="w-full h-full" aria-hidden="true">
      {/* Road deck */}
      <motion.line x1="0" y1="72" x2="200" y2="72"
        stroke="#0077FF" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={draw ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: "easeInOut", delay: 0.05 }}
      />
      {/* Left tower */}
      <motion.path d="M 55 72 L 55 20 M 49 26 L 61 26"
        stroke="#0A2540" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={draw ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
      />
      {/* Right tower */}
      <motion.path d="M 145 72 L 145 20 M 139 26 L 151 26"
        stroke="#0A2540" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={draw ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.55 }}
      />
      {/* Left cable */}
      <motion.path d="M 8 70 Q 55 14 100 38" stroke="#0077FF" strokeWidth="1.8"
        strokeLinecap="round" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={draw ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
      />
      {/* Right cable */}
      <motion.path d="M 192 70 Q 145 14 100 38" stroke="#0077FF" strokeWidth="1.8"
        strokeLinecap="round" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={draw ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, ease: "easeOut", delay: 0.85 }}
      />
      {/* Suspender cables */}
      {[28, 50, 72, 128, 150, 172].map((x, i) => (
        <motion.line key={x}
          x1={x} y1={72} x2={x} y2={i < 3 ? [56, 42, 50][i] : [50, 42, 56][i - 3]}
          stroke="#0077FF" strokeWidth="1" strokeOpacity="0.35"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={draw ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: "easeOut", delay: 1.05 + i * 0.07 }}
        />
      ))}
      {/* Travelling dot */}
      {draw && (
        <motion.circle r="3.5" fill="#0077FF"
          initial={{ cx: 0, cy: 72, opacity: 0 }}
          animate={{ cx: 200, cy: 72, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.1, ease: "easeInOut", delay: 1.5 }}
          style={{ filter: "drop-shadow(0 0 5px rgba(0,119,255,0.60))" }}
        />
      )}
    </svg>
  );
}

/* ─── Logo Mark ─────────────────────────────────────────── */
function LogoMark({ size = 60 }: { size?: number }) {
  return (
    <div className="relative flex-shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Outer rotating sapphire ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full"
        style={{
          border: "2px solid transparent",
          borderTopColor: "rgba(0,119,255,0.60)",
          borderRightColor: "rgba(0,119,255,0.20)",
        }}
      />
      {/* Inner pulse glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,119,255,0.18) 0%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />
      {/* Logo image — gently floating wrapper */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-[78%] h-[78%] flex items-center justify-center"
      >
        <TransparentLogo
          className="w-full h-full object-contain"
          style={{
            filter: "drop-shadow(0 6px 18px rgba(0,119,255,0.35))"
          }}
        />
      </motion.div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [scene, setScene] = useState<1 | 2 | 3 | 4 | 5>(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setScene(2), 950));
    timers.push(setTimeout(() => setScene(3), 2100));
    timers.push(setTimeout(() => setScene(4), 3200));
    timers.push(setTimeout(() => setScene(5), 4200));
    timers.push(setTimeout(() => onComplete(), 5000));

    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      key="cinematic-intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: "#FFFFFF" }}
    >
      {/* ── Hero glow — exact spec gradient ── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="glow-orb w-[640px] h-[640px] breathing-glow"
          style={{
            background: "radial-gradient(circle, rgba(0,119,255,0.18) 0%, rgba(0,119,255,0.08) 45%, transparent 75%)",
            filter: "blur(0px)",
          }}
        />
      </div>
      {/* Secondary glow — bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 glow-orb w-[500px] h-[240px] breathe-slow pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(0,119,255,0.10) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* ── Sapphire particles on white ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <div key={p.id} className="absolute rounded-full"
            style={{
              left: p.left,
              bottom: p.bottom,
              width: p.size,
              height: p.size,
              background:
                p.id % 4 === 0 ? "rgba(0,119,255,0.70)"
                : p.id % 4 === 1 ? "rgba(0,102,224,0.50)"
                : p.id % 4 === 2 ? "rgba(0,119,255,0.35)"
                : "rgba(10,37,64,0.20)",
              boxShadow: p.size > 3 ? "0 0 8px rgba(0,119,255,0.35)" : undefined,
              animation: `${p.alt ? "particle-float-alt" : "particle-float"} ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Subtle top border line ── */}
      <div className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(90deg, transparent, #0077FF 40%, #3399ff 60%, transparent)" }} />

      {/* ══ SCENE 1 + 2 — Logo + Bridge ══ */}
      <AnimatePresence>
        {(scene === 1 || scene === 2) && (
          <motion.div key="s12"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute flex flex-col items-center gap-8"
          >
            <motion.div initial={{ opacity: 0, scale: 0.72, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              <LogoMark size={72} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="w-[260px] sm:w-[330px]" style={{ height: 110 }}>
              <BridgeSVG draw={scene === 2} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ SCENE 3 — Headline ══ */}
      <AnimatePresence>
        {scene === 3 && (
          <motion.div key="s3"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="absolute text-center px-8 max-w-2xl"
          >
            <p className="text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-tight leading-[1.15]"
              style={{ color: "#0A2540" }}>
              Every Journey Begins
              <br />
              <span style={{
                background: "linear-gradient(135deg, #0077FF, #3399ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                With One Step.
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ SCENE 4 — Full brand identity ══ */}
      <AnimatePresence>
        {scene === 4 && (
          <motion.div key="s4"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute flex flex-col items-center gap-5 text-center"
          >
            {/* Logo with glow ring */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-36 h-36 rounded-full breathe-pulse"
                style={{
                  background: "radial-gradient(circle, rgba(0,119,255,0.18) 0%, rgba(0,119,255,0.06) 55%, transparent 75%)",
                  filter: "blur(0px)",
                }} />
              <LogoMark size={76} />
            </div>

            {/* Wordmark */}
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-3xl sm:text-4xl font-bold uppercase"
              style={{ color: "#0A2540", letterSpacing: "0.14em" }}>
              ONE{" "}
              <span style={{
                background: "linear-gradient(135deg, #0077FF, #3399ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                JOURNEY
              </span>
            </motion.p>

            {/* Tagline */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="flex items-center gap-3">
              {["Connect.", "Guide.", "Grow."].map((word, i) => (
                <span key={word}>
                  <span style={{
                    color: "#5B6B7A",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}>
                    {word}
                  </span>
                  {i < 2 && (
                    <span style={{ color: "rgba(10,37,64,0.15)", marginLeft: 8 }}>·</span>
                  )}
                </span>
              ))}
            </motion.div>

            {/* Divider */}
            <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.40 }}
              className="w-14 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0,119,255,0.40), transparent)" }} />

            {/* Coming Soon badge */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.52 }}>
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{
                  background: "#EAF4FF",
                  border: "1px solid rgba(0,119,255,0.22)",
                  color: "#0077FF",
                }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "#22C55E", boxShadow: "0 0 5px rgba(34,197,94,0.5)" }} />
                Coming Soon
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ SCENE 5 — Fade out ══ */}
      <AnimatePresence>
        {scene === 5 && (
          <motion.div key="s5"
            initial={{ opacity: 1 }} animate={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="absolute flex flex-col items-center gap-6">
            <LogoMark size={76} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="rounded-full transition-all duration-500"
            style={{
              width:  scene === s ? 22 : 5,
              height: 5,
              background: scene === s
                ? "#0077FF"
                : "rgba(10,37,64,0.12)",
            }}
          />
        ))}
      </div>

      {/* Bottom subtle tagline */}
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-20 text-[11px] font-medium uppercase tracking-[0.20em]"
        style={{ color: "#8A94A6" }}
      >
        Connecting learners everywhere
      </motion.p>
    </motion.div>
  );
}
