import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OneJourney — Peer-to-Peer Learning Platform",
  description:
    "Learn beyond classrooms with real-time collaboration, AI-powered guidance, and a community where every student can teach, learn, and grow together.",
  keywords: [
    "peer learning",
    "EdTech",
    "AI education",
    "collaborative learning",
    "online education",
  ],
  openGraph: {
    title: "OneJourney — Built for Curious Minds",
    description:
      "A serious EdTech platform powered by real-time collaboration and AI-guided peer learning.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-white text-[#0A2540] overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
