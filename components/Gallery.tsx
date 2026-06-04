"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

const photos = [
  { src: "/hero1.jpeg", alt: "Primeros lugares ICFES por áreas" },
  { src: "/hero2.jpeg", alt: "Líderes en bilingüismo en Sabanalarga" },
  { src: "/hero3.jpeg", alt: "Entre los 100 mejores colegios del Atlántico" },
  { src: "/hero4.jpeg", alt: "+13 puntos en las pruebas ICFES" },
  { src: "/hero5.jpeg", alt: "Primer lugar ranking municipal ICFES 2025" },
  { src: "/hero6.jpeg", alt: "El mejor colegio de Sabanalarga" },
];

export default function Gallery() {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Auto-advance featured photo
  useEffect(() => {
    if (lightbox !== null) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [lightbox]);

  const next = useCallback(() => {
    setLightbox((prev) => (prev === null ? null : (prev + 1) % photos.length));
  }, []);
  const prev = useCallback(() => {
    setLightbox((p) => (p === null ? null : (p - 1 + photos.length) % photos.length));
  }, []);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, next, prev]);

  return (
    <section id="galeria" style={{ background: "#fff", padding: "5rem 1.5rem" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block rounded-full text-xs font-bold uppercase tracking-widest px-4 py-1.5 mb-4"
            style={{ background: "rgba(255,215,0,0.14)", color: "#a07800" }}
          >
            Galería
          </span>
          <h2
            className="font-extrabold mb-3"
            style={{ fontSize: "clamp(1.8rem,4vw,2.75rem)", color: "#13136b", lineHeight: 1.2 }}
          >
            Momentos que nos <span style={{ color: "#1e1e8f" }}>enorgullecen</span>
          </h2>
          <p className="max-w-xl mx-auto m-0" style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.75 }}>
            Reconocimientos y logros que reflejan el compromiso de nuestra comunidad educativa.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, i) => (
            <motion.button
              key={photo.src}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -5 }}
              onClick={() => setLightbox(i)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
              style={{
                aspectRatio: "4 / 5",
                border: "1px solid rgba(30,30,143,0.1)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                padding: 0,
                background: "#0a0a3a",
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(180deg, transparent 50%, rgba(8,8,62,0.85) 100%)" }}
              >
                <span className="text-white text-xs font-medium text-left" style={{ lineHeight: 1.4 }}>
                  {photo.alt}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ background: "rgba(5,5,40,0.92)", zIndex: 200, backdropFilter: "blur(8px)" }}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              aria-label="Cerrar"
              className="absolute top-5 right-5 rounded-full flex items-center justify-center transition-all"
              style={{ width: 44, height: 44, background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", cursor: "pointer" }}
            >
              <X size={22} />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Anterior"
              className="absolute left-3 sm:left-6 rounded-full flex items-center justify-center transition-all"
              style={{ width: 48, height: 48, background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", cursor: "pointer" }}
            >
              <ChevronLeft size={26} />
            </button>

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
              style={{ width: "min(90vw, 480px)", aspectRatio: "4 / 5" }}
            >
              <Image
                src={photos[lightbox].src}
                alt={photos[lightbox].alt}
                fill
                sizes="480px"
                className="object-contain rounded-xl"
              />
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Siguiente"
              className="absolute right-3 sm:right-6 rounded-full flex items-center justify-center transition-all"
              style={{ width: 48, height: 48, background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", cursor: "pointer" }}
            >
              <ChevronRight size={26} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
