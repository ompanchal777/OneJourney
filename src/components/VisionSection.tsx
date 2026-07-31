"use client";

import { motion } from "framer-motion";
import { Heart, Cpu, ArrowRight } from "lucide-react";

const pillars = [
  { icon: <Heart size={14} />, text: "Human Connection" },
  { icon: <Cpu size={14} />, text: "AI as a Guide" },
  { icon: <ArrowRight size={14} />, text: "Always Evolving" },
];

export default function VisionSection() {
  return (
    <section id="vision" className="relative py-32 px-6 lg:px-8 overflow-hidden bg-white">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full breathing-glow"
          style={{ background: "radial-gradient(ellipse, rgba(0,119,255,0.07) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(10,37,64,0.08), transparent)" }} />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — Text */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mb-6">
              <span className="section-badge">Our Vision</span>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-[#0A2540] mb-7">
              A community where every student can{" "}
              learn, teach,{" "}and grow.
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base lg:text-lg leading-relaxed mb-8" style={{ color: "rgba(10,37,64,0.60)" }}>
              We believe learning is inherently social. The moment a student
              explains a concept to another, they both grow. Our platform is built
              around this truth — that knowledge multiplies when it&apos;s shared, not stored.
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm lg:text-base leading-relaxed mb-10" style={{ color: "rgba(10,37,64,0.50)" }}>
              AI doesn&apos;t replace the human connection here — it amplifies it.
              It helps you find the right peer, bridges language gaps, and surfaces
              the right context at the right moment. The relationship remains deeply human.
            </motion.p>

            {/* Pillars */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3">
              {pillars.map((p) => (
                <span key={p.text}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-default"
                  style={{
                    color: "#0A2540",
                    background: "#f7faff",
                    border: "1px solid rgba(10,37,64,0.10)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#EAF4FF";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,119,255,0.25)";
                    (e.currentTarget as HTMLElement).style.color = "#0077FF";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#f7faff";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(10,37,64,0.10)";
                    (e.currentTarget as HTMLElement).style.color = "#0A2540";
                  }}
                >
                  <span style={{ color: "#0077FF" }}>{p.icon}</span>
                  {p.text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — Quote card */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative">

            <div className="relative rounded-3xl pt-10 px-10 pb-24 overflow-hidden"
              style={{ background: "#ffffff", border: "1px solid rgba(10,37,64,0.08)", boxShadow: "0 4px 32px rgba(10,37,64,0.08), 0 16px 64px rgba(10,37,64,0.05)" }}>
              {/* Soft accent top-right */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full breathe-slow"
                style={{ background: "radial-gradient(circle, rgba(0,119,255,0.08) 0%, transparent 70%)", filter: "blur(30px)" }} />
              {/* Sapphire gradient stripe */}
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl"
                style={{ background: "linear-gradient(90deg, #0077FF, #66b3ff, transparent)" }} />

              <div className="relative z-10">
                <div className="text-7xl font-serif leading-none mb-4 select-none" style={{ color: "rgba(0,119,255,0.20)" }}>&ldquo;</div>
                <p className="text-xl lg:text-2xl font-semibold text-[#0A2540] leading-[1.5]">
                  When one student teaches another, both understand
                  it deeper than any lecture ever could.
                </p>
              </div>
            </div>

            {/* Mission card — top right */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-5 -right-5 rounded-2xl p-4"
              style={{ background: "#fff", border: "1px solid rgba(0,119,255,0.18)", boxShadow: "0 4px 20px rgba(0,119,255,0.12)" }}>
              <p className="text-sm font-bold text-[#0A2540]">Our Mission</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(10,37,64,0.55)" }}>Empower Every Student.</p>
            </motion.div>

            {/* Goal card — bottom left */}
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 rounded-2xl p-4"
              style={{ background: "#fff", border: "1px solid rgba(10,37,64,0.10)", boxShadow: "0 4px 20px rgba(10,37,64,0.10)" }}>
              <p className="text-sm font-bold text-[#0A2540]">Our Goal</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(10,37,64,0.50)" }}>Learning Without Limits.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
