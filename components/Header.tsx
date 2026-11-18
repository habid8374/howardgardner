"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import { TEL_HREF, PHONE_DISPLAY, WA_ADMISIONES } from "@/lib/site";

const NAV = [
  { href: "#resultados", label: "Resultados" },
  { href: "#niveles", label: "Niveles" },
  { href: "#bilinguismo", label: "Bilingüismo" },
  { href: "#pedagogia", label: "Pedagogía" },
  { href: "#admisiones", label: "Admisiones" },
    { href: "#visitanos", label: "Visítanos" },
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
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        <a href="#inicio" className="flex min-h-11 items-center gap-3 no-underline" aria-label="Howard Gardner Bilingual School, inicio">
          <Image src="/howard_gardner_logo_sin_fondo.png" alt="" width={42} height={40} className="h-10 w-auto" />
          <span className="flex flex-col whitespace-nowrap leading-none">
            <span className="text-[0.95rem] font-extrabold tracking-[0.08em]">HOWARD GARDNER</span>
            <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold">Bilingual School</span>
          </span>
        </a>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="link inline-flex min-h-11 items-center px-3 text-[0.92rem] font-medium text-white/85 hover:text-white">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href={TEL_HREF} className="link hidden min-h-11 items-center gap-2 whitespace-nowrap px-2 text-sm font-semibold text-white/85 2xl:inline-flex">
            <Phone size={15} aria-hidden /> {PHONE_DISPLAY}
          </a>
          <a href={WA_ADMISIONES} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-11 !px-5 !text-sm">
            Inscripciones 2026
          </a>
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex h-12 w-12 items-center justify-center rounded-full xl:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div
        id="menu-movil"
        hidden={!open}
        className="xl:hidden"
        style={{ height: "calc(100dvh - 72px)", background: "var(--ink)" }}
      >
        <nav aria-label="Menú móvil" className="wrap flex h-full flex-col justify-between pb-8 pt-4">
          <ul>
            {NAV.map((n) => (
              <li key={n.href} className="border-b border-white/10">
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center font-[family-name:var(--font-display)] text-2xl text-white"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
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
