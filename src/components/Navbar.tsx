"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useWaitlistModal } from "./WaitlistModal";
import TransparentLogo from "./TransparentLogo";

const navLinks = [
  { label: "Vision",   href: "#vision" },
  { label: "Problem",  href: "#problem" },
  { label: "Benefits", href: "#benefits" },
  { label: "Roadmap",  href: "#roadmap" },
  { label: "About",    href: "#about" },
];

function NavLogoMark() {
  return (
    <TransparentLogo
      className="w-8 h-8 object-contain"
    />
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openModal } = useWaitlistModal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? "glass-dark shadow-[0_1px_0_0_rgba(10,37,64,0.08)]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">

            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 group" aria-label="OneJourney Home">
              <NavLogoMark />
              <span className="text-[15px] font-semibold tracking-tight text-[#0A2540]">
                One<span className="text-gradient">Journey</span>
              </span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="relative px-4 py-2 text-sm font-medium text-[rgba(10,37,64,0.60)] hover:text-[#0A2540] transition-colors duration-200 rounded-xl hover:bg-[#EAF4FF] group"
                >
                  {link.label}
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 group-hover:w-4 h-[2px] rounded-full transition-all duration-300"
                    style={{ background: "linear-gradient(90deg, #0077FF, #3399ff)" }}
                  />
                </a>
              ))}
            </div>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  openModal();
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #0077FF 0%, #005acc 100%)",
                  boxShadow: "0 4px 20px rgba(0,119,255,0.30)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 32px rgba(0,119,255,0.55)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,119,255,0.30)"; }}
              >
                Join the Journey
              </motion.button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-[rgba(10,37,64,0.60)] hover:text-[#0A2540] hover:bg-[#EAF4FF] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed top-16 left-0 right-0 z-40 glass-dark md:hidden"
            style={{ borderBottom: "1px solid rgba(10,37,64,0.08)" }}
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="px-4 py-3 text-sm font-medium text-[rgba(10,37,64,0.65)] hover:text-[#0A2540] hover:bg-[#EAF4FF] rounded-xl transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 pb-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    openModal();
                  }}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #0077FF 0%, #005acc 100%)" }}
                >
                  Join the Journey
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
