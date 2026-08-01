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



export default function HeroIllustration() {
  return (
    <div className="relative w-full h-[520px] lg:h-[600px] flex items-center justify-center">

      {/* Central breathing glow — always at true center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[280px] h-[280px] rounded-full breathing-glow"
          style={{ background: "radial-gradient(circle, rgba(0,119,255,0.12) 0%, transparent 70%)", filter: "blur(50px)" }}
        />
      </div>

      {/* Central Hub — logo at true center via flex (not absolute top/left) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex items-center justify-center"
      >
        {/* Pulsing glow behind logo */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 200, height: 200,
            background: "radial-gradient(circle, rgba(0,119,255,0.20) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        {/* Logo image — gently floating */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 flex items-center justify-center"
          style={{ width: 240, height: 240 }}
        >
          <TransparentLogo
            className="w-full h-full object-contain"
            style={{ filter: "drop-shadow(0 10px 32px rgba(0,119,255,0.45))" }}
          />
        </motion.div>
      </motion.div>

      {/* Floating Cards — absolutely positioned around the center */}
      <FloatingCard icon={<Sparkles size={16} />}     label="Launch Status" value="Coming Soon"  className="top-4 right-4 lg:right-8 w-[158px]"     delay={0.9}  floatDuration={4.5} />
      <FloatingCard icon={<MessageSquare size={16} />} label="Waitlist Open" value="Join Free"    className="top-8 left-4 lg:left-8 w-[150px]"        delay={0.6}  floatDuration={5.5} />
      <FloatingCard icon={<BookOpen size={16} />}      label="Mission"       value="Empower All" className="bottom-24 right-2 lg:right-6 w-[152px]"   delay={0.75} floatDuration={5}   />
      <FloatingCard icon={<Users size={16} />}         label="Peer Matching" value="Instant"      className="top-[42%] left-0 lg:-left-4 w-[148px]"  delay={1.4}  floatDuration={4.8} />
      <FloatingCard icon={<Brain size={16} />}         label="For Everyone"  value="Free to Join" className="bottom-32 left-2 lg:left-4 w-[155px]"    delay={1.2}  floatDuration={6}   />

      {/* Ambient rings at true center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full pointer-events-none" style={{ border: "1px solid rgba(0,119,255,0.12)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full pointer-events-none" style={{ border: "1px solid rgba(0,119,255,0.07)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full pointer-events-none" style={{ border: "1px solid rgba(0,119,255,0.04)" }} />
    </div>
  );
}
