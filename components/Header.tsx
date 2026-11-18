"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Menu, X, Phone, Trophy, Layers, Languages, Brain, GraduationCap, MapPin,
} from "lucide-react";
import { TEL_HREF, PHONE_DISPLAY, WA_ADMISIONES } from "@/lib/site";

const NAV = [
  { href: "#resultados", label: "Resultados", Icon: Trophy },
  { href: "#niveles", label: "Niveles", Icon: Layers },
  { href: "#bilinguismo", label: "Bilingüismo", Icon: Languages },
  { href: "#pedagogia", label: "Pedagogía", Icon: Brain },
  { href: "#admisiones", label: "Admisiones", Icon: GraduationCap },
  { href: "#visitanos", label: "Visítanos", Icon: MapPin },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1280 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 text-white"
      style={{
        background: solid ? "rgba(12,22,49,0.96)" : "transparent",
        backdropFilter: solid ? "saturate(140%) blur(12px)" : "none",
        boxShadow: solid ? "0 1px 0 rgba(255,255,255,0.06)" : "none",
        transition: "background-color 250ms ease, box-shadow 250ms ease",
      }}
    >
      <div className="wrap flex h-[76px] items-center gap-8">
        {/* Marca */}
        <a
          href="#inicio"
          className="flex min-h-11 flex-none items-center gap-3"
          aria-label="Howard Gardner Bilingual School, inicio"
        >
          <Image src="/howard_gardner_logo_sin_fondo.png" alt="" width={44} height={42} className="h-11 w-auto" />
          <span className="flex flex-col whitespace-nowrap leading-none">
            <span className="text-[0.95rem] font-extrabold tracking-[0.08em]">HOWARD GARDNER</span>
            <span className="mt-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-gold">Bilingual School</span>
          </span>
        </a>

        {/* Menú de escritorio, centrado en el espacio libre */}
        <nav aria-label="Principal" className="hidden flex-1 justify-center xl:flex">
          <ul className="flex items-center gap-1 2xl:gap-3">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="link inline-flex min-h-11 items-center whitespace-nowrap px-3 text-[0.93rem] font-medium text-white/80 transition-colors hover:text-white"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Acción + botón de menú, siempre juntos a la derecha */}
        <div className="ml-auto flex flex-none items-center gap-2 xl:ml-0">
          <a
            href={WA_ADMISIONES}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary hidden !min-h-11 !px-5 !text-sm sm:inline-flex"
          >
            Inscripciones 2026
          </a>
          <button
            type="button"
            className="-mr-2 inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-white/10 xl:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Menú móvil y tableta */}
      <div
        id="menu-movil"
        hidden={!open}
        className="xl:hidden"
        style={{ height: "calc(100dvh - 76px)", background: "var(--ink)" }}
      >
        <nav aria-label="Menú móvil" className="wrap flex h-full flex-col gap-8 overflow-y-auto pb-8 pt-6">
          <p className="eyebrow text-gold">Explora el colegio</p>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {NAV.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex h-full min-h-[92px] flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors active:bg-white/10"
                >
                  <Icon size={20} className="text-gold" aria-hidden />
                  <span className="font-[family-name:var(--font-display)] text-[1.15rem] leading-tight text-white">{label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-3">
            <a href={WA_ADMISIONES} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
              Inscripciones 2026 por WhatsApp
            </a>
            <a href={TEL_HREF} className="btn btn-ghost w-full">
              <Phone size={18} aria-hidden /> Llamar al {PHONE_DISPLAY}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
