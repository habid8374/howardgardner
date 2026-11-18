"use client";

import Image from "next/image";
import { useLightbox, type Slide } from "./Lightbox";
import { SOCIAL } from "@/lib/site";

const photos: Slide[] = [
  { src: "/a-plus-2026.jpg", alt: "Noviembre de buenas noticias: somos el único colegio en categoría A+ en Sabanalarga según el ICFES 2026" },
  { src: "/ranking-icfes-2026.jpg", alt: "Ranking municipal por Índice de Clasificación del ICFES 2026: Howard Gardner en el primer puesto de Sabanalarga" },
  { src: "/sabias-que-2026.jpg", alt: "En 2026 ocupamos el puesto 71 entre 540 colegios del Atlántico y el 88 entre 553 según el Índice ICFES" },
  { src: "/inscripciones-2027.jpg", alt: "Inscripciones y matrículas abiertas 2027: 16 años educando con calidad y excelencia" },
  { src: "/hero2.jpeg", alt: "Primer lugar del ranking municipal ICFES 2025 con 297 puntos y categoría A+" },
  { src: "/hero6.jpeg", alt: "Primeros lugares 2025 en Matemáticas, Ciencias Sociales y Lectura Crítica" },
  { src: "/hero1.jpeg", alt: "El mejor colegio de Sabanalarga según el Ranking Milton Ochoa, categoría A+ 2025" },
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
            <h2 className="h-section mt-5 text-ink">Buenas noticias para compartir en familia.</h2>
          </div>
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center font-semibold text-navy">
            Síguenos en Instagram {SOCIAL.instagramHandle} →
          </a>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {photos.map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                onClick={() => open(i)}
                aria-label={`Ampliar: ${p.alt}`}
                className="photo-frame lift relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-ink"
              >
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 280px, 50vw" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {dialog}
    </section>
  );
}
