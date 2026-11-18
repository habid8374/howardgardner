"use client";

import Image from "next/image";
import { useLightbox, type Slide } from "./Lightbox";
import { SOCIAL } from "@/lib/site";

const photos: Slide[] = [
  { src: "/hero2.jpeg", alt: "Primer lugar del ranking municipal ICFES 2025 con 297 puntos y categoría A+" },
  { src: "/hero1.jpeg", alt: "El mejor colegio de Sabanalarga según el Ranking Milton Ochoa, categoría A+ 2025" },
  { src: "/hero6.jpeg", alt: "Primeros lugares en Matemáticas, Ciencias Sociales y Lectura Crítica" },
  { src: "/hero4.jpeg", alt: "Entre los 100 mejores colegios del Atlántico, puesto 74 de 542" },
  { src: "/hero3.jpeg", alt: "Trece puntos más que en 2024 en las pruebas ICFES" },
  { src: "/hero5.jpeg", alt: "Líderes en bilingüismo en Sabanalarga" },
];

export default function Gallery() {
  const { open, dialog } = useLightbox(photos);

  return (
    <section id="logros" className="section bg-paper">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow text-navy">Comunidad</p>
            <h2 className="h-section mt-5 text-ink">Un año para celebrar en familia.</h2>
          </div>
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center font-semibold text-navy">
            Síguenos en Instagram {SOCIAL.instagramHandle} →
          </a>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {photos.map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                onClick={() => open(i)}
                aria-label={`Ampliar: ${p.alt}`}
                className="photo-frame lift relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-ink"
              >
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 380px, 50vw" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {dialog}
    </section>
  );
}
