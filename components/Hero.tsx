"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, GraduationCap, Trophy } from "lucide-react";
import Image from "next/image";

const slides = [
  "/hero1.jpeg",
  "/hero2.jpeg",
  "/hero3.jpeg",
  "/hero4.jpeg",
  "/hero5.jpeg",
  "/hero6.jpeg",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="inicio"
      className="relative flex items-center justify-center text-center"
      style={{
        minHeight: "100vh",
        paddingTop: "80px",
        overflow: "hidden",
        isolation: "isolate",
        background: "#0a0a3a",
      }}
    >
      {/* ── Background image carousel ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.3, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
        >
          <Image
            src={slides[current]}
            alt="Howard Gardner Bilingual School"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={current === 0}
            quality={92}
          />
        </motion.div>
      </AnimatePresence>

      {/* Neutral dark scrim — solo para legibilidad, sin tinte azul */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Slide dots */}
      <div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2"
        style={{ zIndex: 20 }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Imagen ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current ? "#FFD700" : "rgba(255,255,255,0.4)",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div
        className="relative max-w-4xl mx-auto px-6 py-16"
        style={{ zIndex: 10 }}
      >
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full mb-7 px-4 py-2 text-xs font-semibold tracking-widest uppercase"
          style={{
            background: "rgba(255,215,0,0.15)",
            border: "1px solid rgba(255,215,0,0.45)",
            color: "#FFD700",
            backdropFilter: "blur(6px)",
          }}
        >
          <Trophy size={13} />
          #1 Ranking ICFES Municipal 2025 · Categoría A+ Excelencia
        </motion.div>

        {/* Floating logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="flex justify-center mb-5"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.55))" }}
          >
            <Image
              src="/howard_gardner_logo_sin_fondo.png"
              alt="Howard Gardner Bilingual School Logo"
              width={140}
              height={140}
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-black leading-none mb-2"
          style={{
            fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
            color: "#fff",
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
          }}
        >
          Howard <span style={{ color: "#FFD700" }}>Gardner</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-light tracking-widest uppercase mb-2"
          style={{
            fontSize: "clamp(0.85rem, 2vw, 1.15rem)",
            color: "rgba(255,255,255,0.85)",
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}
        >
          Bilingual School
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-medium italic mb-6"
          style={{
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
            color: "#FFD700",
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}
        >
          &quot;Your Vision Is Our Inspiration&quot;
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex items-center justify-center gap-2 mb-10"
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "0.875rem",
            textShadow: "0 2px 10px rgba(0,0,0,0.6)",
          }}
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
              boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
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
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              padding: "0.95rem 2rem",
              border: "2px solid rgba(255,255,255,0.35)",
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
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{ zIndex: 20, color: "rgba(255,255,255,0.5)", fontSize: "1.4rem" }}
      >
        ↓
      </motion.div>
    </section>
  );
}
