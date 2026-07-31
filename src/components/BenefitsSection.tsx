"use client";

import { motion } from "framer-motion";
import {
  Users2, Lightbulb, Globe2, TrendingUp,
  MessageCircle, Shield, Zap, Heart,
} from "lucide-react";

const benefits = [
  { icon: <Users2 size={22} />, title: "Peer Learning Rooms",
    description: "Join real-time study sessions with students who share your topic, level, and learning style.", accent: "#0077FF", bg: "#EAF4FF" },
  { icon: <Lightbulb size={22} />, title: "AI-Powered Clarity",
    description: "Stuck on a concept? Our AI surfaces the right explanation, resource, or peer — instantly.", accent: "#0066dd", bg: "#e0efff" },
  { icon: <Globe2 size={22} />, title: "Global Community",
    description: "Our vision is to empower students globally through collaborative learning.", accent: "#3399ff", bg: "#eaf4ff" },
  { icon: <TrendingUp size={22} />, title: "Track Your Growth",
    description: "Visual progress maps show exactly what you know, what's next, and how you're growing.", accent: "#005acc", bg: "#dce9ff" },
  { icon: <MessageCircle size={22} />, title: "Doubt Resolution",
    description: "Get answers from peers and AI within minutes.", accent: "#0077FF", bg: "#EAF4FF" },
  { icon: <Shield size={22} />, title: "Safe Learning Space",
    description: "No judgement zones. Structured mentorship and community guidelines keep it supportive.", accent: "#0066dd", bg: "#e0efff" },
  { icon: <Zap size={22} />, title: "Gamified Milestones",
    description: "Earn recognition for teaching others. The more you give, the more the community celebrates you.", accent: "#3399ff", bg: "#eaf4ff" },
  { icon: <Heart size={22} />, title: "Learn with Empathy",
    description: "Match with peers who remember what it felt like to not understand. Compassion-first approach.", accent: "#005acc", bg: "#dce9ff" },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const cardVariants = {
  hidden:  { opacity: 0, y: 32, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

export default function BenefitsSection() {
  return (
    <section id="benefits" className="relative py-32 px-6 lg:px-8 overflow-hidden" style={{ background: "#f7faff" }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full breathe-slow"
          style={{ background: "radial-gradient(circle, rgba(0,119,255,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full breathing-glow"
          style={{ background: "radial-gradient(circle, rgba(0,119,255,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }} className="text-center mb-5">
          <span className="section-badge">Why OneJourney</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-[#0A2540] mb-5">
            Everything you need to{" "}
            <span className="text-gradient">learn better.</span>
          </h2>
          <p className="text-base lg:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(10,37,64,0.55)" }}>
            Built for the way students actually learn — collaboratively, flexibly,
            and with a little help from the right tools.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b) => (
            <motion.div key={b.title} variants={cardVariants}
              className="group relative rounded-2xl p-6 overflow-hidden cursor-default transition-all duration-300"
              style={{ background: "#fff", border: "1px solid rgba(10,37,64,0.07)", boxShadow: "0 2px 12px rgba(10,37,64,0.05)" }}
              whileHover={{ y: -6, boxShadow: "0 8px 32px rgba(10,37,64,0.10)", transition: { duration: 0.3 } }}
            >
              {/* Accent stripe on hover */}
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(90deg, ${b.accent}, transparent)` }} />

              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                style={{ background: b.bg, border: `1px solid rgba(0,119,255,0.15)`, color: b.accent }}>
                {b.icon}
              </div>
              <h3 className="text-[15px] font-bold text-[#0A2540] mb-2 leading-snug group-hover:text-[#0077FF] transition-colors duration-300">
                {b.title}
              </h3>
              <p className="text-[13px] leading-relaxed" style={{ color: "rgba(10,37,64,0.55)" }}>
                {b.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
