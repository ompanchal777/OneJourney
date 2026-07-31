"use client";

import { motion } from "framer-motion";
import { HelpCircle, Globe, Shuffle, Swords } from "lucide-react";

const problems = [
  { icon: <HelpCircle size={22} />, title: "Doubts Remain Unresolved",
    description: "Students leave classrooms with unanswered questions. Without access to a peer who truly gets it, confusion compounds — silently.",
    accent: "#0077FF", bg: "#EAF4FF", border: "rgba(0,119,255,0.15)" },
  { icon: <Globe size={22} />, title: "Learning Becomes Isolated",
    description: "Study sessions become solo struggles. Knowledge stays locked inside individual minds instead of flowing freely through communities.",
    accent: "#0066dd", bg: "#e0efff", border: "rgba(0,102,221,0.15)" },
  { icon: <Shuffle size={22} />, title: "Everyone Learns Differently",
    description: "One lecture style fails thousands of students. Rigid formats ignore the reality that understanding is deeply personal and contextual.",
    accent: "#3399ff", bg: "#eaf4ff", border: "rgba(51,153,255,0.15)" },
  { icon: <Swords size={22} />, title: "Competition Over Collaboration",
    description: "Traditional systems pit students against each other. Rankings, grades, and curves reward hoarding knowledge instead of sharing it.",
    accent: "#005acc", bg: "#dce9ff", border: "rgba(0,90,204,0.15)" },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const cardVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProblemSection() {
  return (
    <section id="problem" className="relative py-32 px-6 lg:px-8 overflow-hidden" style={{ background: "#f7faff" }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full breathe-slow"
          style={{ background: "radial-gradient(circle, rgba(0,119,255,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full breathing-glow"
          style={{ background: "radial-gradient(circle, rgba(0,119,255,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section label */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="flex justify-center mb-6">
          <span className="section-badge">The Problem</span>
        </motion.div>

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl xl:text-[56px] font-bold leading-[1.1] tracking-tight text-[#0A2540] mb-5">
            Learning shouldn&apos;t stop{" "}
            <span className="text-gradient">when class ends.</span>
          </h2>
          <p className="text-base lg:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(10,37,64,0.55)" }}>
            The way we learn today is broken. Here&apos;s what students face every
            single day — problems that classrooms alone can&apos;t fix.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-60px" }} className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {problems.map((item) => (
            <motion.div key={item.title} variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
              className="group relative rounded-2xl p-7 overflow-hidden cursor-default transition-all duration-300"
              style={{
                background: "#ffffff",
                border: `1px solid ${item.border}`,
                boxShadow: "0 2px 12px rgba(10,37,64,0.06), 0 8px 32px rgba(10,37,64,0.04)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(10,37,64,0.10), 0 16px 48px rgba(10,37,64,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(10,37,64,0.06), 0 8px 32px rgba(10,37,64,0.04)"; }}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(90deg, ${item.accent}, transparent)` }} />

              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: item.bg, border: `1px solid ${item.border}`, color: item.accent }}>
                  {item.icon}
                </div>
                <h3 className="text-[17px] font-bold text-[#0A2540] mb-3 leading-snug">{item.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "rgba(10,37,64,0.55)" }}>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
