"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLightbox } from "./Lightbox";
import type { Dict } from "@/lib/dictionaries";

const SRC = ["/historia1.jpg", "/historia9.jpg", "/historia8.jpg", "/historia7.jpg", "/historia6.jpg", "/historia5.jpg", "/historia4.jpg", "/historia3.jpg", "/historia2.jpg"];

export default function Pedagogy({ t }: { t: Pick<Dict, "pedagogy" | "viewer"> }) {
  const p = t.pedagogy;
  const { open, dialog } = useLightbox(SRC.map((src, i) => ({ src, alt: p.slides[i] })), t.viewer);

  return (
    <section id="pedagogia" className="section bg-paper">
      <div className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow text-navy">{p.eyebrow}</p>
          <h2 className="h-section mt-5 text-ink">{p.title}</h2>
          <p className="lead mt-6 max-w-xl text-muted">{p.lead}</p>

          <ol className="mt-10 grid grid-cols-2 gap-x-8 border-t border-line sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {p.intelligences.map((name, i) => (
              <li key={name} className="border-b border-line py-4">
                <span className="text-xs font-bold text-navy/60">0{i + 1}</span>
                <p className="mt-1 font-[family-name:var(--font-display)] text-lg text-ink">{name}</p>
              </li>
            ))}
          </ol>

          <button type="button" onClick={() => open(0)} className="btn btn-ghost on-light mt-10 text-ink">
            {p.button} <ArrowUpRight size={18} aria-hidden />
          </button>
        </div>

        <button
          type="button"
          onClick={() => open(0)}
          aria-label={p.openLabel}
          className="photo-frame lift relative mx-auto block aspect-[4/5] w-full max-w-[460px] cursor-zoom-in overflow-hidden rounded-[28px]"
        >
          <Image src="/historia1.jpg" alt={p.imgAlt} fill sizes="(min-width: 1024px) 460px, 90vw" className="object-cover" />
        </button>
      </div>
      {dialog}
    </section>
  );
}
