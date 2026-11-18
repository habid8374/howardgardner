"use client";

import Image from "next/image";
import Link from "next/link";
import { useLightbox } from "./Lightbox";
import { SOCIAL } from "@/lib/site";
import { href, type Lang } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";

/* Orden: lo más reciente primero. Los textos alternativos están en los diccionarios. */
const SRC = [
  "/a-plus-2026.jpg",
  "/family-day-2026.jpg",
  "/ranking-icfes-2026.jpg",
  "/family-day-2026-4.jpg",
  "/sabias-que-2026.jpg",
  "/family-day-2026-1.jpg",
  "/inscripciones-2027.jpg",
  "/family-day-2026-6.jpg",
  "/hero2.jpeg",
  "/hero6.jpeg",
  "/hero1.jpeg",
  "/hero5.jpeg",
];

export default function Gallery({
  lang, t, limit,
}: {
  lang: Lang; t: Pick<Dict, "gallery" | "viewer">; limit?: number;
}) {
  const g = t.gallery;
  const all = SRC.map((src, i) => ({ src, alt: g.items[i] }));
  const photos = limit ? all.slice(0, limit) : all;
  const { open, dialog } = useLightbox(photos, t.viewer);

  return (
    <section id="noticias" className="section bg-paper">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow text-navy">{g.eyebrow}</p>
            <h2 className="h-section mt-5 text-ink">{g.title}</h2>
          </div>
          {limit ? (
            <Link href={href(lang, "achievements", "noticias")} className="link inline-flex min-h-11 items-center font-semibold text-navy">
              {g.seeAll} →
            </Link>
          ) : (
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center font-semibold text-navy">
              {g.instagram} {SOCIAL.instagramHandle} →
            </a>
          )}
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {photos.map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                onClick={() => open(i)}
                aria-label={`${g.enlarge}: ${p.alt}`}
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
