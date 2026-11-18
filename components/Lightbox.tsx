"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type Slide = { src: string; alt: string };

/* Visor accesible con <dialog> nativo: foco atrapado, Escape cierra,
   flechas navegan solo mientras está abierto, deslizar en celular. */
export function useLightbox(slides: Slide[]) {
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  const open = useCallback((i: number) => {
    setIndex(i);
    ref.current?.showModal();
  }, []);
  const close = useCallback(() => ref.current?.close(), []);
  const go = useCallback((d: number) => setIndex((i) => (i + d + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.open) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [go]);

  const dialog = (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label="Visor de imágenes"
      onClick={(e) => e.target === e.currentTarget && close()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="pointer-events-none flex h-full w-full items-center justify-center p-4 sm:p-10">
        <div className="pointer-events-auto relative aspect-[4/5] w-full max-w-[min(520px,calc((100dvh-140px)*0.8))]">
          <Image
            key={slides[index].src}
            src={slides[index].src}
            alt={slides[index].alt}
            fill
            sizes="520px"
            className="rounded-2xl object-contain"
          />
        </div>
      </div>
      <p className="absolute left-1/2 top-6 -translate-x-1/2 text-sm font-semibold text-white/70">
        {index + 1} / {slides.length}
      </p>
      <button type="button" onClick={close} aria-label="Cerrar" className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
        <X size={22} />
      </button>
      <button type="button" onClick={() => go(-1)} aria-label="Imagen anterior" className="absolute bottom-6 left-1/2 flex h-12 w-12 -translate-x-[calc(100%+8px)] items-center justify-center rounded-full bg-white/10 text-white sm:bottom-auto sm:left-6 sm:top-1/2 sm:-translate-x-0 sm:-translate-y-1/2">
        <ChevronLeft size={24} />
      </button>
      <button type="button" onClick={() => go(1)} aria-label="Imagen siguiente" className="absolute bottom-6 left-1/2 flex h-12 w-12 translate-x-2 items-center justify-center rounded-full bg-white/10 text-white sm:bottom-auto sm:left-auto sm:right-6 sm:top-1/2 sm:translate-x-0 sm:-translate-y-1/2">
        <ChevronRight size={24} />
      </button>
    </dialog>
  );

  return { open, dialog };
}
