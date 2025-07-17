"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import EnhancedBackground from "./components/EnhancedBackground";
import About from "./components/About";
import Contact from "./components/Contact";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // 3 detik
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#0d0d2b] via-black to-[#1a1a40]">
        {/* Galaxy Stars */}
        <div className="absolute w-full h-full overflow-hidden">
          <div className="w-full h-full animate-[spin_60s_linear_infinite] bg-[url('/stars.png')] bg-cover opacity-20" />
        </div>

        {/* Center Loading Text */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white animate-pulse">
            Welcome to the Galaxy 🌌
          </h1>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Starry Background Layer */}
      <EnhancedBackground />

      {/* Main Content */}
      <main
        className="relative z-[1] bg-transparent text-white font-sans scroll-smooth overflow-x-hidden"
        style={{
          scrollSnapType: "y mandatory",
          minHeight: "100vh",
        }}
      >
        {/* Page Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 space-y-36 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ scrollSnapAlign: "start" }}
          >
            <Header />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ scrollSnapAlign: "start" }}
          >
            <Hero />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "anticipate" }}
            style={{ scrollSnapAlign: "start" }}
          >
            <Projects />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "anticipate" }}
            style={{ scrollSnapAlign: "start" }}
          >
            <About />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "anticipate" }}
            style={{ scrollSnapAlign: "start" }}
          >
            <Contact />
          </motion.div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
