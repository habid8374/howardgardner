"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Pause, Play } from "lucide-react";

export type HeroSlide = {
  id: string;
  kind: "piece" | "photo"; // pieza de redes (4:5, con texto) o fotografía
  eyebrow: string;
  title: readonly string[]; // [antes, resaltado en oro, después]
  lead: string;
  image: string;
  alt: string;
  position?: string; // encuadre de la foto (object-position)
  primary: { label: string; href: string; external?: boolean };
  secondary: { label: string; href: string; external?: boolean };
};

type Labels = { label: string; slide: string; of: string; prev: string; next: string; pause: string; play: string; goTo: string };

const INTERVAL = 7000; // ms por diapositiva

// Respeta "reducir movimiento": sin avance automático
const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const m = window.matchMedia(reducedQuery);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(reducedQuery).matches;

function Cta({ c, primary }: { c: HeroSlide["primary"]; primary?: boolean }) {
  const cls = `btn ${primary ? "btn-primary" : "btn-ghost"}`;
  if (c.external)
    return (
      <a href={c.href} target="_blank" rel="noopener noreferrer" className={cls}>
        <MessageCircle size={18} aria-hidden /> {c.label}
      </a>
    );
  return <Link href={c.href} className={cls}>{c.label}</Link>;
}

export default function HeroCarousel({
  h1, slides, stats, labels,
}: { h1: string; slides: HeroSlide[]; stats: readonly (readonly string[])[]; labels: Labels }) {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);
  const touchX = useRef<number | null>(null);

  const n = slides.length;
  const go = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);
  const stopped = userPaused || reduced;
  const paused = stopped || hover || focus;

  return (
    <section
      id="inicio"
      aria-roledescription="carousel"
      aria-label={labels.label}
      className="relative overflow-hidden bg-ink text-white"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocus(false); }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      <h1 className="sr-only">{h1}</h1>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 z-0 h-[560px] w-[560px] rounded-full opacity-[0.10]"
        style={{ background: "radial-gradient(closest-side, var(--gold), transparent)" }}
      />

      {/* Celular y tableta: la imagen arriba, a todo el ancho, y se funde con el azul hacia el texto */}
      {slides.map((s, i) => (
        <div key={`bg-${s.id}`} aria-hidden data-active={i === index || undefined} className={`hero-bg absolute inset-x-0 lg:hidden ${s.kind === "piece" ? "top-[64px]" : "top-0"}`}>
          <div className={`relative w-full ${s.kind === "photo" ? "h-[62svh]" : "aspect-[4/5] max-h-[58svh]"}`}>
            <Image
              src={s.image} alt="" fill sizes="100vw"
              fetchPriority={i === 0 ? "high" : "low"} loading={i === 0 ? undefined : "eager"}
              className="object-cover"
              style={{ objectPosition: s.position ?? (s.kind === "photo" ? "35% 50%" : "50% 0%") }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: s.kind === "piece"
                  ? "linear-gradient(180deg, rgba(12,22,49,0) 0%, rgba(12,22,49,0.1) 38%, rgba(12,22,49,0.92) 62%, var(--ink) 78%)"
                  : "linear-gradient(180deg, rgba(12,22,49,0.35) 0%, rgba(12,22,49,0) 18%, rgba(12,22,49,0.1) 45%, rgba(12,22,49,0.8) 72%, var(--ink) 96%)",
              }}
            />
          </div>
        </div>
      ))}

      <div className="wrap relative z-10 flex min-h-[100svh] flex-col pb-[92px] pt-[104px] md:pb-8 lg:pt-[112px]">
        {/* Todas las diapositivas ocupan la misma celda: la altura no salta al cambiar */}
        <div className="grid flex-1 items-end lg:items-center">
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <div
                key={s.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} ${labels.of} ${n}`}
                aria-hidden={!active}
                inert={!active}
                data-active={active || undefined}
                className="hero-slide grid grid-cols-1 items-end gap-8 lg:items-center [grid-area:1/1] lg:grid-cols-[1.05fr_1fr] lg:gap-16"
              >
                <div>
                  <p className="hs-rise eyebrow text-gold" style={{ "--d": "0ms" } as React.CSSProperties}>{s.eyebrow}</p>
                  <h2 className="hs-rise h-display mt-5 text-[clamp(2.4rem,5.6vw,4.8rem)] text-balance" style={{ "--d": "70ms" } as React.CSSProperties}>
                    {s.title[0]}<em className="not-italic text-gold">{s.title[1]}</em>{s.title[2]}
                  </h2>
                  <p className="hs-rise lead mt-4 max-w-[34rem] text-white/80 max-sm:text-[0.98rem] max-sm:leading-relaxed" style={{ "--d": "140ms" } as React.CSSProperties}>{s.lead}</p>
                  <div className="hs-rise mt-6 flex flex-col gap-3 sm:flex-row lg:mt-8" style={{ "--d": "200ms" } as React.CSSProperties}>
                    <Cta c={s.primary} primary />
                    <Cta c={s.secondary} />
                  </div>
                </div>

                {/* Imagen: en escritorio. En celular va de fondo, para que el carrusel quepa en una pantalla */}
                <div className="hs-media relative mx-auto hidden w-full lg:block">
                  <div
                    className={`photo-frame relative overflow-hidden rounded-[24px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10 ${
                      s.kind === "piece"
                        ? "mx-auto aspect-[4/5] lg:h-[min(600px,calc(100svh-250px))] lg:w-auto"
                        : "lg:h-[min(600px,calc(100svh-250px))]"
                    }`}
                  >
                    <Image
                      src={s.image} alt={s.alt} fill
                      sizes={s.kind === "piece" ? "(min-width: 1024px) 480px, 360px" : "46vw"}
                      fetchPriority={i === 0 ? "high" : "low"} loading={i === 0 ? undefined : "eager"}
                      className="object-cover"
                      style={{ objectPosition: s.position ?? (s.kind === "photo" ? "30% 50%" : "center") }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controles + cifras */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-6 border-t border-white/15 pt-4 lg:mt-10 lg:pt-6">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => go(index - 1)} aria-label={labels.prev} className="hero-ctl">
              <ChevronLeft size={20} aria-hidden />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label={labels.next} className="hero-ctl">
              <ChevronRight size={20} aria-hidden />
            </button>
            <button
              type="button" onClick={() => setUserPaused((p) => !p)}
              aria-label={stopped ? labels.play : labels.pause} aria-pressed={userPaused}
              className="hero-ctl"
            >
              {stopped ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
            </button>

            <div className="ml-3 flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id} type="button" onClick={() => go(i)}
                  aria-label={`${labels.goTo} ${i + 1}`} aria-current={i === index || undefined}
                  className="group flex h-11 items-center"
                >
                  <span className={`relative block h-[3px] overflow-hidden rounded-full bg-white/25 transition-[width] duration-300 ${i === index ? "w-12 bg-white/45" : "w-6 group-hover:bg-white/45"}`}>
                    {i === index && (
                      <span
                        key={`${index}-${stopped}`}
                        className="hero-progress absolute inset-y-0 left-0 bg-gold"
                        style={{
                          animationDuration: `${INTERVAL}ms`,
                          animationPlayState: paused ? "paused" : "running",
                          width: stopped ? "100%" : undefined,
                          animationName: stopped ? "none" : undefined,
                        }}
                        onAnimationEnd={() => go(index + 1)}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <p className="sr-only" aria-live={paused ? "polite" : "off"} aria-atomic>
              {labels.slide} {index + 1} {labels.of} {n}: {slides[index].title.join("")}
            </p>
          </div>

          <dl className="hidden grid-cols-3 gap-8 md:grid">
            {stats.map(([num, l]) => (
              <div key={l} className="flex items-baseline gap-2">
                <dt className="sr-only">{l}</dt>
                <dd className="h-display text-[1.7rem] text-gold">{num}</dd>
                <dd className="max-w-[7.5rem] text-[0.78rem] leading-snug text-white/70">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
