"use client";

import { motion } from "framer-motion";
import { MapPin, GraduationCap, Trophy } from "lucide-react";
import ShieldLogo from "./ShieldLogo";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #050530 0%, #13136b 35%, #1e1e8f 60%, #2929b0 85%, #13136b 100%)",
        paddingTop: "80px",
      }}
    >
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,215,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 rounded-full opacity-20 blur-3xl"
          style={{ width: 500, height: 500, background: "radial-gradient(circle, #FFD700, transparent)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 rounded-full opacity-10 blur-3xl"
          style={{ width: 400, height: 400, background: "radial-gradient(circle, #2929b0, transparent)" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full mb-8 px-4 py-2 text-xs font-semibold tracking-widest uppercase"
          style={{
            background: "rgba(255,215,0,0.12)",
            border: "1px solid rgba(255,215,0,0.35)",
            color: "#FFD700",
          }}
        >
          <Trophy size={13} />
          #1 Ranking ICFES Municipal 2025 · Categoría A+ Excelencia
        </motion.div>

        {/* Floating shield */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 12px 40px rgba(255,215,0,0.5))" }}
          >
            <ShieldLogo size={130} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-black leading-none mb-2"
          style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)", color: "#fff" }}
        >
          Howard{" "}
          <span style={{ color: "#FFD700" }}>Gardner</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-light tracking-widest uppercase mb-2"
          style={{ fontSize: "clamp(0.85rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.65)" }}
        >
          Bilingual School
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-medium italic mb-6"
          style={{ fontSize: "clamp(0.9rem, 2vw, 1.1rem)", color: "#FFD700" }}
        >
          &quot;Your Vision Is Our Inspiration&quot;
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex items-center justify-center gap-2 mb-10"
          style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}
        >
          <MapPin size={14} style={{ color: "#FFD700" }} />
          Calle 12 #34 B-2, Sabanalarga, Atlántico, Colombia
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="#admisiones"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 font-bold rounded-xl no-underline"
            style={{
              background: "#FFD700",
              color: "#13136b",
              padding: "0.95rem 2rem",
              boxShadow: "0 4px 24px rgba(255,215,0,0.45)",
              fontSize: "1rem",
            }}
          >
            <GraduationCap size={18} />
            Inscripciones 2026
          </motion.a>

          <motion.a
            href="#logros"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl no-underline"
            style={{
              background: "transparent",
              color: "#fff",
              padding: "0.95rem 2rem",
              border: "2px solid rgba(255,255,255,0.3)",
              fontSize: "1rem",
            }}
          >
            <Trophy size={18} />
            Ver nuestros logros
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ color: "rgba(255,255,255,0.3)", fontSize: "1.5rem" }}
      >
        ↓
      </motion.div>
    </section>
  );
}
