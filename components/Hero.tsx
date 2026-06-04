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
      className="relative min-h-screen flex items-center justify-center text-center"
      style={{ paddingTop: "80px", overflow: "hidden", isolation: "isolate" }}
    >
      {/* ── Background image carousel ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        >
          <Image
            src={slides[current]}
            alt="Howard Gardner Bilingual School"
            fill
            className="object-cover object-center"
            priority={current === 0}
            quality={90}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay — más suave para ver bien las fotos */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(180deg, rgba(8,8,62,0.48) 0%, rgba(19,19,107,0.52) 50%, rgba(8,8,62,0.72) 100%)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          opacity: 0.04,
          backgroundImage:
            "linear-gradient(rgba(255,215,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Slide dots */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 20 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current ? "#FFD700" : "rgba(255,255,255,0.35)",
              border: "none",
              cursor: "pointer",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative max-w-4xl mx-auto px-6 py-16" style={{ zIndex: 10 }}>

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full mb-8 px-4 py-2 text-xs font-semibold tracking-widest uppercase"
          style={{
            background: "rgba(255,215,0,0.12)",
            border: "1px solid rgba(255,215,0,0.4)",
            color: "#FFD700",
          }}
        >
          <Trophy size={13} />
          #1 Ranking ICFES Municipal 2025 · Categoría A+ Excelencia
        </motion.div>

        {/* Floating real logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 12px 40px rgba(255,215,0,0.55))" }}
          >
            <Image
              src="/howard_gardner_logo_sin_fondo.png"
              alt="Howard Gardner Bilingual School Logo"
              width={150}
              height={150}
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
          style={{ fontSize: "clamp(0.85rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.7)" }}
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
          style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.875rem" }}
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
              boxShadow: "0 4px 24px rgba(255,215,0,0.5)",
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
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
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
        style={{ zIndex: 20, color: "rgba(255,255,255,0.35)", fontSize: "1.4rem" }}
      >
        ↓
      </motion.div>
    </section>
  );
}
