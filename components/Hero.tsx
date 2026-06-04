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
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="inicio"
      className="relative flex items-center"
      style={{
        minHeight: "100vh",
        paddingTop: "80px",
        overflow: "hidden",
        isolation: "isolate",
        background:
          "linear-gradient(135deg, #050530 0%, #0d0d5a 35%, #13136b 65%, #1a1a85 100%)",
      }}
    >
      {/* Soft decorative glows */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,215,0,0.10), transparent 70%)",
          filter: "blur(40px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "10%",
          width: 460,
          height: 460,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(41,41,176,0.35), transparent 70%)",
          filter: "blur(40px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* Faint grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          opacity: 0.035,
          backgroundImage:
            "linear-gradient(rgba(255,215,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
        }}
      />

      {/* ── Content grid ── */}
      <div
        className="relative w-full mx-auto px-6 py-16 grid items-center gap-12 lg:gap-8"
        style={{ maxWidth: "1150px", zIndex: 10, gridTemplateColumns: "1fr" }}
      >
        <div className="grid items-center gap-12 lg:gap-10 lg:grid-cols-2">

          {/* Left — text */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mb-5"
              style={{ filter: "drop-shadow(0 8px 28px rgba(255,215,0,0.4))" }}
            >
              <Image
                src="/howard_gardner_logo_sin_fondo.png"
                alt="Howard Gardner Bilingual School Logo"
                width={96}
                height={96}
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full mb-6 px-4 py-2 text-xs font-semibold tracking-wider uppercase"
              style={{
                background: "rgba(255,215,0,0.12)",
                border: "1px solid rgba(255,215,0,0.4)",
                color: "#FFD700",
              }}
            >
              <Trophy size={13} />
              #1 ICFES Municipal 2025 · A+ Excelencia
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-black leading-none mb-3"
              style={{ fontSize: "clamp(2.6rem, 6vw, 4.5rem)", color: "#fff" }}
            >
              Howard <span style={{ color: "#FFD700" }}>Gardner</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="font-light tracking-widest uppercase mb-2"
              style={{ fontSize: "clamp(0.8rem, 1.6vw, 1.05rem)", color: "rgba(255,255,255,0.7)" }}
            >
              Bilingual School
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.34 }}
              className="font-medium italic mb-6"
              style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.05rem)", color: "#FFD700" }}
            >
              &quot;Your Vision Is Our Inspiration&quot;
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex items-center gap-2 mb-9 justify-center lg:justify-start"
              style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}
            >
              <MapPin size={14} style={{ color: "#FFD700", flexShrink: 0 }} />
              Calle 12 #34 B-2, Sabanalarga, Atlántico
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.48 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start"
            >
              <motion.a
                href="#admisiones"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 font-bold rounded-xl no-underline"
                style={{
                  background: "#FFD700",
                  color: "#13136b",
                  padding: "0.9rem 1.9rem",
                  boxShadow: "0 4px 24px rgba(255,215,0,0.45)",
                  fontSize: "0.98rem",
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
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  padding: "0.9rem 1.9rem",
                  border: "2px solid rgba(255,255,255,0.25)",
                  fontSize: "0.98rem",
                }}
              >
                <Trophy size={18} />
                Ver logros
              </motion.a>
            </motion.div>
          </div>

          {/* Right — contained carousel card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full" style={{ maxWidth: "380px" }}>
              {/* Card frame */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  aspectRatio: "4 / 5",
                  background: "#0a0a3a",
                  border: "1px solid rgba(255,215,0,0.3)",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
                }}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ position: "absolute", inset: 0 }}
                  >
                    <Image
                      src={slides[current]}
                      alt="Howard Gardner Bilingual School"
                      fill
                      sizes="(max-width: 1024px) 90vw, 380px"
                      className="object-cover"
                      priority={current === 0}
                      quality={90}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Imagen ${i + 1}`}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? 24 : 8,
                      height: 8,
                      background: i === current ? "#FFD700" : "rgba(255,255,255,0.3)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:block"
        style={{ zIndex: 20, color: "rgba(255,255,255,0.3)", fontSize: "1.4rem" }}
      >
        ↓
      </motion.div>
    </section>
  );
}
