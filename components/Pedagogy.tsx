"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLightbox, type Slide } from "./Lightbox";

const slides: Slide[] = [
  { src: "/historia1.jpg", alt: "Howard Gardner, creador de la teoría de las inteligencias múltiples" },
  { src: "/historia9.jpg", alt: "¿Quién es? Nació en 1943 en Pensilvania" },
  { src: "/historia8.jpg", alt: "¿En quién se inspiró? Piaget, Erikson y Bruner" },
  { src: "/historia7.jpg", alt: "Su principal aporte: la teoría de las inteligencias múltiples (1983)" },
  { src: "/historia6.jpg", alt: "¿Cuántos tipos de inteligencia existen? Ocho tipos" },
  { src: "/historia5.jpg", alt: "Inteligencias lingüística, lógico-matemática y espacial" },
  { src: "/historia4.jpg", alt: "Inteligencias corporal, musical e interpersonal" },
  { src: "/historia3.jpg", alt: "Inteligencias intrapersonal y naturalista" },
  { src: "/historia2.jpg", alt: "Feliz cumpleaños 82, Howard Gardner" },
];

const intelligences = [
  "Lingüística", "Lógico-matemática", "Espacial", "Corporal",
  "Musical", "Interpersonal", "Intrapersonal", "Naturalista",
];

export default function Pedagogy() {
  const { open, dialog } = useLightbox(slides);

  return (
    <section id="pedagogia" className="section bg-paper">
      <div className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow text-navy">Nuestra pedagogía</p>
          <h2 className="h-section mt-5 text-ink">Ocho maneras de ser inteligente.</h2>
          <p className="lead mt-6 max-w-xl text-muted">
            Llevamos el nombre del psicólogo de Harvard Howard Gardner, que en 1983 propuso la
            teoría de las inteligencias múltiples. Por eso no medimos a todos con la misma regla:
            buscamos el talento de cada estudiante y lo trabajamos.
          </p>

          <ol className="mt-10 grid grid-cols-2 gap-x-8 border-t border-line sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {intelligences.map((name, i) => (
              <li key={name} className="border-b border-line py-4">
                <span className="text-xs font-bold text-navy/60">0{i + 1}</span>
                <p className="mt-1 font-[family-name:var(--font-display)] text-lg text-ink">{name}</p>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() => open(0)}
            className="btn btn-ghost on-light mt-10 text-ink"
          >
            Conocer a Howard Gardner <ArrowUpRight size={18} aria-hidden />
          </button>
        </div>

        <button
          type="button"
          onClick={() => open(0)}
          aria-label="Abrir la serie ¿Quién es Howard Gardner? (9 láminas)"
          className="photo-frame lift relative mx-auto block aspect-[4/5] w-full max-w-[460px] cursor-zoom-in overflow-hidden rounded-[28px]"
        >
          <Image
            src="/historia1.jpg"
            alt="Retrato de Howard Gardner, creador de la teoría de las inteligencias múltiples"
            fill
            sizes="(min-width: 1024px) 460px, 90vw"
            className="object-cover"
          />
        </button>
      </div>
      {dialog}
    </section>
  );
}
