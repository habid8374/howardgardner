"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

/* Carrusel "¿Quién fue Howard Gardner?" — infografías 1080x1350 (4:5).
   El texto está incrustado en cada imagen; `label` es solo para accesibilidad.
   Orden de visualización (cambia el arreglo para reordenar). */
const slides = [
  { src: "/historia1.jpg", label: "Howard Gardner, creador de la teoría de las inteligencias múltiples" },
  { src: "/historia9.jpg", label: "¿Quién es? Nació en 1943 en Pensilvania" },
  { src: "/historia8.jpg", label: "¿En quién se inspiró? Piaget, Erikson y Bruner" },
  { src: "/historia7.jpg", label: "Su principal aporte: la teoría de las inteligencias múltiples (1983)" },
  { src: "/historia6.jpg", label: "¿Cuántos tipos de inteligencia existen? — 8 tipos" },
  { src: "/historia5.jpg", label: "Inteligencias lingüística (1), lógico-matemática (2) y espacial (3)" },
  { src: "/historia4.jpg", label: "Inteligencias corporal (4), musical (5) e interpersonal (6)" },
  { src: "/historia3.jpg", label: "Inteligencias intrapersonal (7) y naturalista (8)" },
  { src: "/historia2.jpg", label: "Feliz cumpleaños 82 — Howard Gardner" },
];

export default function Story() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(0);

  const go = useCallback((next: number, d: number) => {
    setDir(d);
    setIndex((next + slides.length) % slides.length);
  }, []);

  const prev = useCallback(() => go(index - 1, -1), [index, go]);
  const next = useCallback(() => go(index + 1, 1), [index, go]);

  // Auto-advance
  useEffect(() => {
    const t = setInterval(() => go(index + 1, 1), 5500);
    return () => clearInterval(t);
  }, [index, go]);

  // Keyboard nav
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev]);

  return (
    <section id="historia" style={{ background: "#f7f8fc", padding: "5rem 1.5rem" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span
            className="inline-block rounded-full text-xs font-bold uppercase tracking-widest px-4 py-1.5 mb-4"
            style={{ background: "rgba(255,215,0,0.14)", color: "#a07800" }}
          >
            Nuestra Inspiración
          </span>
          <h2
            className="font-extrabold mb-3"
            style={{ fontSize: "clamp(1.8rem,4vw,2.75rem)", color: "#13136b", lineHeight: 1.2 }}
          >
            ¿Quién fue <span style={{ color: "#1e1e8f" }}>Howard Gardner</span>?
          </h2>
          <p className="max-w-xl mx-auto m-0" style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.75 }}>
            El psicólogo y su teoría de las inteligencias múltiples — el legado que da
            nombre, identidad y filosofía pedagógica a nuestro colegio.
          </p>
        </motion.div>

        {/* Carousel widget (cuadro) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden mx-auto"
          style={{
            maxWidth: 480,
            background: "#0a0a3a",
            boxShadow: "0 24px 60px rgba(19,19,107,0.28)",
            border: "1px solid rgba(255,215,0,0.18)",
          }}
        >
          {/* Image stage — 4:5 exacto, object-cover sin recorte */}
          <div className="relative" style={{ aspectRatio: "4 / 5", overflow: "hidden" }}>
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir > 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir > 0 ? -60 : 60 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) next();
                  else if (info.offset.x > 60) prev();
                }}
                className="absolute inset-0"
                style={{ cursor: "grab" }}
              >
                <Image
                  src={slides[index].src}
                  alt={slides[index].label}
                  fill
                  sizes="(max-width: 768px) 90vw, 480px"
                  className="object-cover select-none pointer-events-none"
                  draggable={false}
                  priority={index === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Page counter badge */}
            <div
              className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-bold"
              style={{ background: "rgba(8,8,62,0.6)", backdropFilter: "blur(6px)", color: "#FFD700", zIndex: 6 }}
            >
              {index + 1} / {slides.length}
            </div>

            {/* Prev arrow */}
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute top-1/2 -translate-y-1/2 left-3 flex items-center justify-center rounded-full transition-all"
              style={{
                width: 46, height: 46,
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff", cursor: "pointer", zIndex: 5,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#FFD700"; (e.currentTarget as HTMLButtonElement).style.color = "#13136b"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.18)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next arrow */}
            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center rounded-full transition-all"
              style={{
                width: 46, height: 46,
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff", cursor: "pointer", zIndex: 5,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#FFD700"; (e.currentTarget as HTMLButtonElement).style.color = "#13136b"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.18)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </motion.div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > index ? 1 : -1)}
              aria-label={`Ir a la lámina ${i + 1}`}
              className="rounded-full transition-all"
              style={{
                width: i === index ? 26 : 9,
                height: 9,
                background: i === index ? "#FFD700" : "rgba(19,19,107,0.25)",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
