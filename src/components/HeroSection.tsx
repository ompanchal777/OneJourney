"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import HeroIllustration from "./HeroIllustration";
import { useWaitlistModal } from "./WaitlistModal";

const fadeUpVariant = {
  hidden:  { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function HeroSection() {
  const { openModal } = useWaitlistModal();
  const handleScroll = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-white">

      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full breathing-glow"
          style={{
            width: 700, height: 700,
            top: "-20%", left: "-10%",
            background: "radial-gradient(circle, rgba(0,119,255,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute rounded-full breathe-slow"
          style={{
            width: 500, height: 500,
            top: "-5%", right: "-8%",
            background: "radial-gradient(circle, rgba(0,119,255,0.06) 0%, transparent 70%)",
            filter: "blur(100px)",
            animationDelay: "3s",
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full breathing-glow"
          style={{
            width: 800, height: 300,
            background: "radial-gradient(ellipse, rgba(234,244,255,0.8) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(10,37,64,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(10,37,64,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-96px)]">

          {/* Left — Text */}
          <div className="flex flex-col justify-center">

            {/* Badge */}
            <motion.div custom={0.1} variants={fadeUpVariant} initial="hidden" animate="visible" className="inline-flex items-center gap-2 w-fit mb-8">
              <span className="section-badge">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0077FF", boxShadow: "0 0 6px rgba(0,119,255,0.6)" }} />
                Now in Early Access
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 custom={0.2} variants={fadeUpVariant} initial="hidden" animate="visible"
              className="text-5xl lg:text-6xl xl:text-[68px] font-bold leading-[1.08] tracking-tight mb-6"
            >
              <span className="text-gradient-dark block">Built for</span>
              <span className="text-gradient-dark block">Curious Minds.</span>
              <span className="block mt-1">
                <span className="text-gradient">Powered by</span>
              </span>
              <span className="text-gradient block">Collaboration.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p custom={0.35} variants={fadeUpVariant} initial="hidden" animate="visible"
              className="text-base lg:text-lg leading-relaxed max-w-[500px] mb-10"
              style={{ color: "rgba(10,37,64,0.60)" }}
            >
              Learn beyond classrooms with real-time collaboration, AI-powered
              guidance, and a community where every student can{" "}
              teach, learn, and grow{" "}
              together.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div custom={0.5} variants={fadeUpVariant} initial="hidden" animate="visible"
              className="flex flex-col sm:flex-row gap-4"
            >
              {/* Primary */}
              <motion.button
                onClick={() => handleScroll("#vision")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #0077FF 0%, #005acc 100%)",
                  boxShadow: "0 4px 24px rgba(0,119,255,0.35)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 40px rgba(0,119,255,0.55)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,119,255,0.35)"; }}
              >
                <span className="relative z-10">Explore Vision</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>

              {/* Secondary */}
              <motion.button
                onClick={() => openModal()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                id="join-waitlist-btn"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{
                  color: "#0A2540",
                  background: "#EAF4FF",
                  border: "1px solid rgba(0,119,255,0.20)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#d9ecff";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,119,255,0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#EAF4FF";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,119,255,0.20)";
                }}
              >
                Join Waitlist
                <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(0,119,255,0.15)", border: "1px solid rgba(0,119,255,0.25)" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#0077FF" }} />
                </span>
              </motion.button>
            </motion.div>

          </div>

          {/* Right — Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Ambient glow behind illustration */}
            <div
              className="absolute top-1/2 left-1/2 w-[360px] h-[360px] rounded-full breathing-glow"
              style={{
                background: "radial-gradient(circle, rgba(0,119,255,0.12) 0%, transparent 65%)",
                filter: "blur(60px)",
                transform: "translate(-50%, -50%)",
              }}
            />
            <HeroIllustration />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: "rgba(10,37,64,0.35)" }}>Scroll</p>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown size={16} style={{ color: "rgba(10,37,64,0.35)" }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
