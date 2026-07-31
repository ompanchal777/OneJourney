"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import CinematicIntro from "@/components/CinematicIntro";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VisionSection from "@/components/VisionSection";
import ProblemSection from "@/components/ProblemSection";
import BenefitsSection from "@/components/BenefitsSection";
import FeatureGridSection from "@/components/FeatureGridSection";
import RoadmapSection from "@/components/RoadmapSection";
import CTASection from "@/components/CTASection";
import WaitlistSection from "@/components/WaitlistSection";
import Footer from "@/components/Footer";
import WaitlistModal, { WaitlistModalProvider } from "@/components/WaitlistModal";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  // Stable callback — won't change between renders
  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <WaitlistModalProvider>
      {/*
        Cinematic intro overlay.
        AnimatePresence handles the exit animation when introComplete → true
        and this component is removed from the tree.
      */}
      <AnimatePresence mode="wait">
        {!introComplete && (
          <CinematicIntro key="intro" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/*
        Main landing page.
        Fades in AFTER the intro's exit animation completes.
        mode="wait" ensures the intro fully exits before this mounts.
      */}
      <AnimatePresence mode="wait">
        {introComplete && (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <main className="bg-white min-h-screen">
              <Navbar />
              <HeroSection />
              <ProblemSection />
              <VisionSection />
              <BenefitsSection />
              <FeatureGridSection />
              <RoadmapSection />

              {/* About anchor */}
              <div id="about" className="min-h-[1px]" />

              <CTASection />
              <WaitlistSection />
              <Footer />
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waitlist popup modal */}
      <WaitlistModal />
    </WaitlistModalProvider>
  );
}
