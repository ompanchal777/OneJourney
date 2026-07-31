"use client";

import { motion } from "framer-motion";
import { Twitter, Github, Linkedin, Mail } from "lucide-react";
import { useWaitlistModal } from "./WaitlistModal";
import TransparentLogo from "./TransparentLogo";

const quickLinks = [
  { label: "Vision",   href: "#vision" },
  { label: "Problem",  href: "#problem" },
  { label: "Benefits", href: "#benefits" },
  { label: "Roadmap",  href: "#roadmap" },
  { label: "About",    href: "#about" },
];
const socialLinks = [
  { icon: <Twitter size={15} />,  href: "#", label: "Twitter" },
  { icon: <Github size={15} />,   href: "#", label: "GitHub" },
  { icon: <Linkedin size={15} />, href: "#", label: "LinkedIn" },
  { icon: <Mail size={15} />,     href: "#", label: "Email" },
];

const handleScroll = (e: React.MouseEvent, href: string) => {
  e.preventDefault();
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Footer() {
  const { openModal } = useWaitlistModal();
  return (
    <footer>
      {/* Main footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
        style={{ background: "#f7faff", borderTop: "1px solid rgba(10,37,64,0.08)" }}
      >
        {/* Top glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(0,119,255,0.25), transparent)" }} />
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full breathing-glow"
            style={{ background: "radial-gradient(ellipse, rgba(0,119,255,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="md:col-span-1">
              <a href="/" className="flex items-center gap-2.5 w-fit mb-5" aria-label="OneJourney Home">
                <TransparentLogo
                  className="w-8 h-8 object-contain"
                />
                <span className="text-[15px] font-semibold tracking-tight text-[#0A2540]">
                  One<span className="text-gradient">Journey</span>
                </span>
              </a>
              <p className="text-[13px] leading-relaxed mb-5" style={{ color: "rgba(10,37,64,0.50)" }}>
                A platform where students connect, collaborate, and learn beyond the limits of the classroom.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-2">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} aria-label={s.label}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                    style={{ border: "1px solid rgba(10,37,64,0.10)", color: "rgba(10,37,64,0.45)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,119,255,0.30)";
                      (e.currentTarget as HTMLElement).style.background = "#EAF4FF";
                      (e.currentTarget as HTMLElement).style.color = "#0077FF";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(10,37,64,0.10)";
                      (e.currentTarget as HTMLElement).style.background = "";
                      (e.currentTarget as HTMLElement).style.color = "rgba(10,37,64,0.45)";
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-4" style={{ color: "rgba(10,37,64,0.40)" }}>Navigation</p>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} onClick={(e) => handleScroll(e, link.href)}
                      className="text-[13px] transition-colors duration-200"
                      style={{ color: "rgba(10,37,64,0.58)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#0077FF"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(10,37,64,0.58)"; }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-4" style={{ color: "rgba(10,37,64,0.40)" }}>Resources</p>
              <ul className="space-y-3">
                {["Blog", "Changelog", "Privacy Policy", "Terms of Service"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[13px] transition-colors duration-200"
                      style={{ color: "rgba(10,37,64,0.58)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#0077FF"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(10,37,64,0.58)"; }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA column */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-4" style={{ color: "rgba(10,37,64,0.40)" }}>Get Started</p>
              <p className="text-[13px] leading-relaxed mb-5" style={{ color: "rgba(10,37,64,0.50)" }}>
                Join our early access community. Limited spots.
              </p>
              <button onClick={(e) => { e.preventDefault(); openModal(); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #0077FF 0%, #005acc 100%)",
                  boxShadow: "0 4px 16px rgba(0,119,255,0.28)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,119,255,0.50)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,119,255,0.28)"; }}
              >
                Join the Waitlist
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(10,37,64,0.07)" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px]" style={{ color: "rgba(10,37,64,0.38)" }}>
              © 2024 OneJourney. Built with purpose.
            </p>
            <p className="text-[12px]" style={{ color: "rgba(10,37,64,0.38)" }}>
              Student-first · Always free to join · No credit card required
            </p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
