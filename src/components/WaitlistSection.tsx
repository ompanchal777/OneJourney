"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useWaitlistModal } from "./WaitlistModal";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const { openModal } = useWaitlistModal();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      openModal(email);
    }
  };

  return (
    <section id="waitlist" className="relative py-32 px-6 lg:px-8 overflow-hidden" style={{ background: "#f7faff" }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full breathing-glow"
          style={{ background: "radial-gradient(ellipse, rgba(0,119,255,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.12em] mb-8"
            style={{ background: "#EAF4FF", border: "1px solid rgba(0,119,255,0.22)", color: "#0077FF" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Spots are limited
          </div>

          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-[#0A2540] mb-5">
            Be the first to{" "}
            <span className="text-gradient">join the journey.</span>
          </h2>
          <p className="text-base lg:text-lg leading-relaxed mb-10" style={{ color: "rgba(10,37,64,0.55)" }}>
            Get early access, exclusive updates, and help shape the future
            of collaborative learning.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-5 py-3.5 rounded-xl text-sm text-[#0A2540] placeholder:text-[rgba(10,37,64,0.38)] focus:outline-none transition-all duration-200 bg-white"
              style={{
                border: "1px solid rgba(10,37,64,0.12)",
                boxShadow: "0 2px 8px rgba(10,37,64,0.04)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid rgba(0,119,255,0.45)";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,119,255,0.10), 0 2px 8px rgba(10,37,64,0.04)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(10,37,64,0.12)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(10,37,64,0.04)";
              }}
            />
            <motion.button type="submit"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #0077FF 0%, #005acc 100%)",
                boxShadow: "0 4px 20px rgba(0,119,255,0.35)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 32px rgba(0,119,255,0.60)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,119,255,0.35)"; }}
            >
              Join Waitlist
              <ArrowRight size={15} />
            </motion.button>
          </form>

          {/* Trust note */}
          <p className="text-xs mt-5" style={{ color: "rgba(10,37,64,0.38)" }}>
            No spam. No credit card. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
