"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useWaitlistModal } from "./WaitlistModal";

export default function CTASection() {
  const { openModal } = useWaitlistModal();
  const handleScroll = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative py-32 px-6 lg:px-8 overflow-hidden bg-white">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full breathing-glow"
          style={{ background: "radial-gradient(ellipse, rgba(0,119,255,0.08) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full breathe-slow"
          style={{ background: "radial-gradient(circle, rgba(0,119,255,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full breathe-pulse"
          style={{ background: "radial-gradient(circle, rgba(0,119,255,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
        {/* Border lines */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(10,37,64,0.08), transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(10,37,64,0.08), transparent)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden text-center px-8 py-20 lg:px-20 lg:py-24"
          style={{
            background: "linear-gradient(135deg, #EAF4FF 0%, #ffffff 50%, #EAF4FF 100%)",
            border: "1px solid rgba(0,119,255,0.18)",
            boxShadow: "0 8px 48px rgba(0,119,255,0.10), 0 2px 12px rgba(10,37,64,0.06)",
          }}
        >
          {/* Sapphire gradient stripe top */}
          <div className="absolute top-0 left-0 right-0 h-[4px] rounded-t-3xl"
            style={{ background: "linear-gradient(90deg, #0077FF, #66b3ff, #0077FF)" }} />
          {/* Corner glows */}
          <div className="absolute top-0 left-0 w-48 h-48 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,119,255,0.10) 0%, transparent 70%)", filter: "blur(30px)" }} />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,119,255,0.10) 0%, transparent 70%)", filter: "blur(30px)" }} />

          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: `linear-gradient(rgba(10,37,64,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(10,37,64,0.5) 1px, transparent 1px)`, backgroundSize: "48px 48px" }} />

          <div className="relative z-10">
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-8">
              <span className="section-badge">
                <Sparkles size={12} />
                The journey is just beginning
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl lg:text-5xl xl:text-[58px] font-bold leading-[1.08] tracking-tight text-[#0A2540] mb-7">
              Ready to change the way{" "}
              <span className="text-gradient">students learn?</span>
            </motion.h2>

            {/* Subtext */}
            <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base lg:text-lg max-w-xl mx-auto leading-relaxed mb-12" style={{ color: "rgba(10,37,64,0.60)" }}>
              Join thousands of early members who believe education should be
              collaborative, accessible, and deeply human. Your spot is waiting.
            </motion.p>

            {/* CTA buttons */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button onClick={openModal}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-white overflow-hidden w-full sm:w-auto transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #0077FF 0%, #005acc 100%)",
                  boxShadow: "0 4px 28px rgba(0,119,255,0.40)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 44px rgba(0,119,255,0.65)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 28px rgba(0,119,255,0.40)"; }}
              >
                <span className="relative z-10">Join Waitlist</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>

              <motion.button onClick={() => handleScroll("#vision")}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold w-full sm:w-auto transition-all duration-300"
                style={{ color: "#0A2540", background: "white", border: "1px solid rgba(10,37,64,0.15)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,119,255,0.30)";
                  (e.currentTarget as HTMLElement).style.background = "#EAF4FF";
                  (e.currentTarget as HTMLElement).style.color = "#0077FF";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(10,37,64,0.15)";
                  (e.currentTarget as HTMLElement).style.background = "white";
                  (e.currentTarget as HTMLElement).style.color = "#0A2540";
                }}
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Trust indicator */}
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: 0.7 }}
              className="text-xs mt-8" style={{ color: "rgba(10,37,64,0.38)" }}>
              Free to join · No credit card required · Always student-first
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
