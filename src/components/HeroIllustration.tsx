"use client";

import { motion } from "framer-motion";
import { Brain, MessageSquare, Users, Sparkles, BookOpen } from "lucide-react";
import TransparentLogo from "./TransparentLogo";

interface FloatingCardProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  className?: string;
  delay?: number;
  floatDuration?: number;
}

function FloatingCard({ icon, label, value, className = "", delay = 0, floatDuration = 5 }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute rounded-2xl p-3.5 ${className}`}
      style={{
        background: "#fff",
        border: "1px solid rgba(10,37,64,0.08)",
        boxShadow: "0 4px 24px rgba(10,37,64,0.10), 0 1px 4px rgba(10,37,64,0.06)",
      }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay }}
        className="flex items-center gap-3"
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#EAF4FF", border: "1px solid rgba(0,119,255,0.20)" }}
        >
          <div style={{ color: "#0077FF" }}>{icon}</div>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider leading-none mb-0.5" style={{ color: "rgba(10,37,64,0.45)" }}>
            {label}
          </p>
          {value && <p className="text-[13px] font-normal leading-none text-[#0A2540]">{value}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

function GlowingNode({ cx, cy, r = 4, color = "#0077FF", delay = 0 }: { cx: number; cy: number; r?: number; color?: string; delay?: number }) {
  return (
    <motion.circle
      cx={cx} cy={cy} r={r}
      fill={color}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
    />
  );
}

function AnimatedLine({ x1, y1, x2, y2, delay = 0, color = "#0077FF" }: { x1: number; y1: number; x2: number; y2: number; delay?: number; color?: string }) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth="1" strokeOpacity="0.20" strokeDasharray="4 6"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
    />
  );
}

export default function HeroIllustration() {
  return (
    <div className="relative w-full h-[520px] lg:h-[600px] flex items-center justify-center">
      {/* Central breathing glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[280px] h-[280px] rounded-full breathing-glow"
          style={{ background: "radial-gradient(circle, rgba(0,119,255,0.12) 0%, transparent 70%)", filter: "blur(50px)" }}
        />
      </div>

      {/* SVG Lines + Nodes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 520" fill="none" preserveAspectRatio="xMidYMid meet">
        <AnimatedLine x1={250} y1={200} x2={140} y2={130} delay={0.5} color="#0077FF" />
        <AnimatedLine x1={250} y1={200} x2={360} y2={120} delay={0.7} color="#3399ff" />
        <AnimatedLine x1={250} y1={200} x2={120} y2={300} delay={0.9} color="#0077FF" />
        <AnimatedLine x1={250} y1={200} x2={390} y2={290} delay={1.1} color="#3399ff" />
        <AnimatedLine x1={250} y1={200} x2={240} y2={360} delay={1.3} color="#66b3ff" />
        <AnimatedLine x1={140} y1={130} x2={360} y2={120} delay={1.5} color="#0077FF" />
        <AnimatedLine x1={120} y1={300} x2={240} y2={360} delay={1.7} color="#3399ff" />
        <AnimatedLine x1={390} y1={290} x2={240} y2={360} delay={1.9} color="#66b3ff" />

        <GlowingNode cx={250} cy={200} r={6} color="#0077FF" delay={0} />
        <GlowingNode cx={140} cy={130} r={4} color="#3399ff" delay={0.4} />
        <GlowingNode cx={360} cy={120} r={4} color="#66b3ff" delay={0.8} />
        <GlowingNode cx={120} cy={300} r={3.5} color="#0077FF" delay={1.2} />
        <GlowingNode cx={390} cy={290} r={3.5} color="#3399ff" delay={0.6} />
        <GlowingNode cx={240} cy={360} r={4} color="#66b3ff" delay={1.0} />

        <motion.circle
          cx={250} cy={200} r={24} fill="none"
          stroke="#0077FF" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="6 8"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "250px 200px" }}
        />
      </svg>

      {/* Central Hub — logo perfectly centered among the floating cards */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-10"
        style={{ top: "38.5%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        {/* Outer slowly-rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 110, height: 110,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            border: "1.5px solid transparent",
            borderTopColor: "rgba(0,119,255,0.55)",
            borderRightColor: "rgba(0,119,255,0.15)",
          }}
        />
        {/* Pulsing glow behind logo */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 90, height: 90,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(0,119,255,0.22) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />
        {/* Logo image — gently floating wrapper */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 flex items-center justify-center"
          style={{ width: 88, height: 88 }}
        >
          <TransparentLogo
            className="w-full h-full object-contain"
            style={{
              filter: "drop-shadow(0 8px 24px rgba(0,119,255,0.35))"
            }}
          />
        </motion.div>
      </motion.div>

      {/* Floating Cards */}
      <FloatingCard icon={<Sparkles size={16} />}     label="Launch Status" value="Coming Soon"  className="top-4 right-4 lg:right-8 w-[158px]"     delay={0.9}  floatDuration={4.5} />
      <FloatingCard icon={<MessageSquare size={16} />} label="Waitlist Open" value="Join Free"    className="top-8 left-4 lg:left-8 w-[150px]"        delay={0.6}  floatDuration={5.5} />
      <FloatingCard icon={<BookOpen size={16} />}      label="Mission"       value="Empower All" className="bottom-24 right-2 lg:right-6 w-[152px]"   delay={0.75} floatDuration={5}   />
      <FloatingCard icon={<Users size={16} />}         label="Peer Matching" value="Instant"      className="top-[42%] left-0 lg:-left-4 w-[148px]"  delay={1.4}  floatDuration={4.8} />
      <FloatingCard icon={<Brain size={16} />}         label="For Everyone"  value="Free to Join" className="bottom-32 left-2 lg:left-4 w-[155px]"    delay={1.2}  floatDuration={6}   />

      {/* Ambient rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full pointer-events-none" style={{ border: "1px solid rgba(0,119,255,0.15)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full pointer-events-none" style={{ border: "1px solid rgba(0,119,255,0.08)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ border: "1px solid rgba(0,119,255,0.05)" }} />
    </div>
  );
}
