"use client";

import { motion } from "framer-motion";
import {
  Users, Brain, MessageSquare, BookOpen,
  BarChart2, Layers, Bell, Video,
} from "lucide-react";

const features = [
  { icon: <Users size={20} />, title: "Study Rooms",
    description: "Real-time peer rooms by topic, language, and level. Drop in and learn together.", accent: "#0077FF" },
  { icon: <Brain size={20} />, title: "AI Mentor",
    description: "Context-aware AI that bridges gaps when no peer is online. Learns how you think.", accent: "#0066dd" },
  { icon: <MessageSquare size={20} />, title: "Doubt Threads",
    description: "Post questions. Get answers from real students, ranked by quality, not popularity.", accent: "#3399ff" },
  { icon: <BookOpen size={20} />, title: "Shared Notes",
    description: "Collaborative note-taking with version history, highlights, and community additions.", accent: "#005acc" },
  { icon: <BarChart2 size={20} />, title: "Learning Analytics",
    description: "See your strengths and blind spots. Track how understanding deepens over time.", accent: "#0077FF" },
  { icon: <Layers size={20} />, title: "Concept Maps",
    description: "Visual knowledge graphs built from your learning sessions, automatically.", accent: "#0066dd" },
  { icon: <Bell size={20} />, title: "Smart Alerts",
    description: "Get notified when a peer is studying your topic. Never miss a learning moment.", accent: "#3399ff" },
  { icon: <Video size={20} />, title: "Micro Lectures",
    description: "Students teaching students — short, focused, peer-recorded lesson clips.", accent: "#005acc" },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

export default function FeatureGridSection() {
  return (
    <section id="features" className="relative py-32 px-6 lg:px-8 overflow-hidden bg-white">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full breathing-glow"
          style={{ background: "radial-gradient(ellipse, rgba(0,119,255,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }} className="text-center mb-5">
          <span className="section-badge">Features</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-[#0A2540] mb-5">
            Every tool you need,{" "}
            <span className="text-gradient">built for learners.</span>
          </h2>
          <p className="text-base lg:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(10,37,64,0.55)" }}>
            Not a feature dump — every tool is deliberately designed around
            how students actually learn.
          </p>
        </motion.div>

        {/* Feature grid — 1 col mobile / 2 col tablet / 4 col desktop, all equal size */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <motion.div key={f.title} variants={cardVariants}
              className="group relative rounded-2xl p-6 cursor-default overflow-hidden transition-all duration-300 flex flex-col"
              style={{ background: "#fff", border: "1px solid rgba(10,37,64,0.07)", boxShadow: "0 2px 12px rgba(10,37,64,0.05)" }}
              whileHover={{ y: -5, boxShadow: "0 8px 32px rgba(10,37,64,0.09)", transition: { duration: 0.3 } }}
            >
              {/* Top accent on hover */}
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(90deg, ${f.accent}, transparent)` }} />
              {/* Hover background wash */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: "linear-gradient(135deg, rgba(234,244,255,0.6) 0%, rgba(255,255,255,0) 100%)" }} />

              <div className="relative z-10 flex flex-col flex-grow">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{ background: "#EAF4FF", border: "1px solid rgba(0,119,255,0.18)", color: f.accent }}>
                  {f.icon}
                </div>
                <h3 className="text-[15px] font-bold text-[#0A2540] mb-2 group-hover:text-[#0077FF] transition-colors duration-300">
                  {f.title}
                </h3>
                <p className="text-[13px] leading-relaxed flex-grow" style={{ color: "rgba(10,37,64,0.55)" }}>
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
