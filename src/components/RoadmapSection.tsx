"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock } from "lucide-react";

const roadmap = [
  {
    number: "01", phase: "Phase 1", title: "Community Learning",
    description: "Launch peer-to-peer study rooms, doubt resolution threads, and student matching.",
    status: "In Progress", active: true,
    statusColor: "#0077FF", statusBg: "rgba(0,119,255,0.10)", statusBorder: "rgba(0,119,255,0.25)",
    items: ["Peer Study Rooms", "Doubt Threads", "Student Matching", "Community Profiles"],
  },
  {
    number: "02", phase: "Phase 2", title: "AI Integration",
    description: "Introduce the AI mentor layer — context-aware, student-tailored guidance.",
    status: "Planned", active: false,
    statusColor: "rgba(10,37,64,0.45)", statusBg: "rgba(10,37,64,0.05)", statusBorder: "rgba(10,37,64,0.15)",
    items: ["AI Mentor Engine", "Concept Maps", "Adaptive Quizzes", "Learning Analytics"],
  },
  {
    number: "03", phase: "Phase 3", title: "Global Expansion",
    description: "Multi-language support, educator dashboards, and institutional partnerships.",
    status: "Future", active: false,
    statusColor: "rgba(10,37,64,0.35)", statusBg: "rgba(10,37,64,0.04)", statusBorder: "rgba(10,37,64,0.10)",
    items: ["Multi-language Support", "Educator Dashboard", "Institution API", "Certification Layer"],
  },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="relative py-32 px-6 lg:px-8 overflow-hidden" style={{ background: "#f7faff" }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-[400px] h-[600px] rounded-full breathing-glow"
          style={{ background: "radial-gradient(ellipse, rgba(0,119,255,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-20 right-0 w-[400px] h-[500px] rounded-full breathe-slow"
          style={{ background: "radial-gradient(ellipse, rgba(0,100,220,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }} className="text-center mb-5">
          <span className="section-badge">Roadmap</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-[#0A2540] mb-5">
            Where we&apos;re going{" "}
            <span className="text-gradient">and how we get there.</span>
          </h2>
          <p className="text-base lg:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(10,37,64,0.55)" }}>
            Transparency is core to who we are. Here&apos;s our full journey, open for everyone to see.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical spine */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden lg:block"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(0,119,255,0.20) 10%, rgba(0,119,255,0.15) 80%, transparent)" }} />

          <div className="space-y-10 lg:space-y-0">
            {roadmap.map((phase, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div key={phase.number}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={`lg:grid lg:grid-cols-2 lg:gap-12 ${!isLeft ? "lg:direction-rtl" : ""}`}
                >
                  {/* Card */}
                  <div className={`relative ${!isLeft ? "lg:col-start-2" : ""}`}>
                    <motion.div
                      className="relative rounded-2xl p-7 overflow-hidden transition-all duration-300"
                      style={{
                        background: "#fff",
                        border: phase.active ? "1px solid rgba(0,119,255,0.20)" : "1px solid rgba(10,37,64,0.07)",
                        boxShadow: phase.active
                          ? "0 4px 24px rgba(0,119,255,0.10), 0 16px 48px rgba(0,119,255,0.06)"
                          : "0 2px 12px rgba(10,37,64,0.05)",
                      }}
                      whileHover={{ y: -4, transition: { duration: 0.3 } }}
                    >
                      {/* Active highlight stripe */}
                      {phase.active && (
                        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                          style={{ background: "linear-gradient(90deg, #0077FF, #66b3ff)" }} />
                      )}
                      {/* Active breathing glow */}
                      {phase.active && (
                        <div className="absolute inset-0 rounded-2xl breathing-glow pointer-events-none"
                          style={{ background: "radial-gradient(ellipse at top, rgba(0,119,255,0.05) 0%, transparent 60%)" }} />
                      )}

                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: "rgba(10,37,64,0.40)" }}>
                              {phase.phase}
                            </p>
                            <h3 className="text-xl font-bold text-[#0A2540]">{phase.title}</h3>
                          </div>
                          <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                            style={{ background: phase.statusBg, border: `1px solid ${phase.statusBorder}`, color: phase.statusColor }}>
                            {phase.active && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: phase.statusColor }} />}
                            {!phase.active && phase.status === "Future" && <Lock size={10} />}
                            {phase.status}
                          </span>
                        </div>

                        <p className="text-[14px] leading-relaxed mb-5" style={{ color: "rgba(10,37,64,0.58)" }}>
                          {phase.description}
                        </p>

                        {/* Feature items */}
                        <ul className="space-y-2">
                          {phase.items.map((item) => (
                            <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(10,37,64,0.65)" }}>
                              {phase.active ? (
                                <CheckCircle2 size={15} style={{ color: "#0077FF", flexShrink: 0 }} />
                              ) : phase.status === "Planned" ? (
                                <Circle size={15} style={{ color: "rgba(10,37,64,0.30)", flexShrink: 0 }} />
                              ) : (
                                <Lock size={13} style={{ color: "rgba(10,37,64,0.25)", flexShrink: 0 }} />
                              )}
                              <span className={phase.active ? "font-medium text-[#0A2540]" : ""}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </div>

                  {/* Timeline node — desktop */}
                  <div className={`hidden lg:flex items-center ${isLeft ? "justify-start" : "justify-end"} ${!isLeft ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                    <div className="relative flex items-center justify-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white z-10 relative"
                        style={{
                          background: phase.active ? "linear-gradient(135deg, #0077FF, #005acc)" : "rgba(10,37,64,0.15)",
                          boxShadow: phase.active ? "0 0 20px rgba(0,119,255,0.40)" : "none",
                          color: phase.active ? "white" : "rgba(10,37,64,0.45)",
                        }}
                      >
                        {phase.number}
                      </div>
                      {phase.active && (
                        <motion.div
                          animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute w-10 h-10 rounded-full"
                          style={{ border: "1px solid rgba(0,119,255,0.4)" }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
