"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Globe, Menu, Phone, X } from "lucide-react";
import { WhatsAppIcon } from "./BrandIcons";
import { href, pageFromPath, type Lang } from "@/lib/i18n";
import type { Dict, NavGroup } from "@/lib/dictionaries";
import { PHONE_DISPLAY, TEL_HREF, waLink } from "@/lib/site";

type Props = { lang: Lang; t: Pick<Dict, "nav" | "common" | "wa"> };

function rememberLang(lang: Lang) {
  try {
    document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`;
  } catch {}
}

/* ── Selector de idioma ── */
function LangSwitch({ lang, t, variant }: Props & { variant: "bar" | "menu" }) {
  const page = pageFromPath(usePathname());
  const langs: Lang[] = ["es", "en"];

  if (variant === "bar") {
    // Un solo botón con el otro idioma: ocupa poco y es el patrón más reconocible.
    const other: Lang = lang === "es" ? "en" : "es";
    return (
      <Link
        href={href(other, page)}
        hrefLang={other}
        lang={other}
        onClick={() => rememberLang(other)}
        aria-label={`${t.common.language}: ${t.common.langNames[other]}`}
        title={t.common.langNames[other]}
        className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/20 px-3.5 text-xs font-bold uppercase tracking-wider text-white/85 transition-colors hover:border-white/40 hover:text-white"
      >
        <Globe size={15} aria-hidden /> {other}
      </Link>
    );
  }

  return (
    <div role="group" aria-label={t.common.language} className="grid grid-cols-2 gap-2">
      {langs.map((l) => (
        <Link
          key={l}
          href={href(l, page)}
          hrefLang={l}
          lang={l}
          onClick={() => rememberLang(l)}
          aria-current={l === lang ? "true" : undefined}
          className={`flex min-h-12 items-center justify-center gap-2 rounded-full border text-[0.95rem] font-semibold transition-colors ${
            l === lang ? "border-gold bg-gold text-ink" : "border-white/20 text-white"
          }`}
        >
          <Globe size={16} aria-hidden /> {t.common.langNames[l]}
        </Link>
      ))}
    </div>
  );
}

/* ── Submenú de escritorio ── */
function DesktopGroup({
  group, lang, open, active, onOpen, onClose, onToggle,
}: {
  group: NavGroup; lang: Lang; open: boolean; active: boolean;
  onOpen: () => void; onClose: () => void; onToggle: () => void;
}) {
  const id = `submenu-${group.page}`;

  if (group.items.length === 0) {
    return (
      <li>
        <Link
          href={href(lang, group.page)}
          aria-current={active ? "page" : undefined}
          className={`link inline-flex min-h-11 items-center whitespace-nowrap px-2.5 text-[0.93rem] 2xl:px-3 font-medium transition-colors hover:text-white ${active ? "text-white" : "text-white/80"}`}
        >
          {group.label}
        </Link>
      </li>
    );
  }

  return (
    <li
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && onOpen()}
      onPointerLeave={(e) => e.pointerType === "mouse" && onClose()}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className={`inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[0.93rem] 2xl:px-3 font-medium transition-colors hover:text-white ${
          open || active ? "text-white" : "text-white/80"
        }`}
      >
        {group.label}
        <ChevronDown
          size={15}
          aria-hidden
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "none", color: "var(--gold)" }}
        />
      </button>

      {/* pt-3 hace de puente para que el cursor no cierre el panel al bajar */}
      <div
        id={id}
        className={`absolute left-1/2 top-full z-10 origin-top -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-[180ms] ${
          open ? "visible translate-y-0 scale-100 opacity-100" : "pointer-events-none invisible -translate-y-1 scale-[0.98] opacity-0"
        }`}
        style={{ transitionTimingFunction: "var(--ease-out)" }}
      >
        <ul className="min-w-[264px] rounded-2xl bg-paper p-2 text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] ring-1 ring-black/5">
          {group.items.map((item) => (
            <li key={item.label}>
              <Link
                href={href(lang, item.page, item.hash)}
                onClick={onClose}
                className="flex min-h-11 items-center rounded-xl px-4 text-[0.95rem] font-medium text-ink transition-colors hover:bg-paper-2 focus-visible:bg-paper-2"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

/* ── Grupo del acordeón móvil ── */
function MobileGroup({
  group, lang, expanded, onToggle, onNavigate,
}: {
  group: NavGroup; lang: Lang; expanded: boolean; onToggle: () => void; onNavigate: () => void;
}) {
  const id = `acordeon-${group.page}`;
  const row = "flex min-h-16 w-full items-center justify-between text-left font-[family-name:var(--font-display)] text-[1.45rem] text-white";

  if (group.items.length === 0) {
    return (
      <li className="border-b border-white/10">
        <Link href={href(lang, group.page)} onClick={onNavigate} className={row}>
          {group.label}
        </Link>
      </li>
    );
  }

  return (
    <li className="border-b border-white/10">
      <button type="button" aria-expanded={expanded} aria-controls={id} onClick={onToggle} className={row}>
        <span className={expanded ? "text-gold" : undefined}>{group.label}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15">
          <ChevronDown
            size={18}
            aria-hidden
            className="transition-transform duration-200"
            style={{ transform: expanded ? "rotate(180deg)" : "none" }}
          />
        </span>
      </button>
      <div
        id={id}
        className="grid transition-[grid-template-rows] duration-[240ms]"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr", transitionTimingFunction: "var(--ease-out)" }}
      >
        <ul className="overflow-hidden" inert={!expanded}>
          <li className="pb-3" />
          {group.items.map((item) => (
            <li key={item.label}>
              <Link
                href={href(lang, item.page, item.hash)}
                onClick={onNavigate}
                className="ml-1 flex min-h-12 items-center border-l-2 border-gold/40 pl-5 text-[1.02rem] text-white/80 active:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="pb-4" />
        </ul>
      </div>
    </li>
  );
}

export default function Header({ lang, t }: Props) {
  const pathname = usePathname();
  const currentPage = pageFromPath(pathname);
  const nav = t.nav as NavGroup[];

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLUListElement>(null);

  const openGroup = useCallback((i: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenIndex(i);
  }, []);
  const closeSoon = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenIndex(null), 140);
  }, []);
  const closeAll = useCallback(() => {
    setOpenIndex(null);
    setMobileOpen(false);
    setExpanded(null);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra menús al cambiar de página (ajuste de estado durante el render, sin efecto)
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpenIndex(null);
    setMobileOpen(false);
    setExpanded(null);
  }

  // Escape y clic afuera cierran el submenú de escritorio
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenIndex(null);
    const onDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [openIndex]);

  // Menú móvil: bloquea el fondo, Escape cierra, se cierra al pasar a escritorio
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    const onResize = () => window.innerWidth >= 1280 && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [mobileOpen]);

  const solid = scrolled || mobileOpen || currentPage !== "home";
  const waAdmissions = waLink(t.wa.admissions);

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
      <div className="wrap flex h-[76px] items-center gap-4 xl:max-w-[1360px] xl:px-8 2xl:gap-6">
        <Link href={href(lang, "home")} className="flex min-h-11 flex-none items-center gap-3" aria-label={`${t.common.home}: Howard Gardner Bilingual School`}>
          <Image src="/howard_gardner_logo_sin_fondo.png" alt="" width={44} height={42} className="h-11 w-auto" />
          <span className="flex flex-col whitespace-nowrap leading-none">
            <span className="text-[0.95rem] font-extrabold tracking-[0.08em]">HOWARD GARDNER</span>
            <span className="mt-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-gold">Bilingual School</span>
          </span>
        </Link>

        <nav aria-label={lang === "es" ? "Principal" : "Main"} className="hidden flex-1 justify-center xl:flex">
          <ul ref={navRef} className="flex items-center gap-0.5">
            {nav.map((group, i) => (
              <DesktopGroup
                key={group.page}
                group={group}
                lang={lang}
                open={openIndex === i}
                active={currentPage === group.page}
                onOpen={() => openGroup(i)}
                onClose={closeSoon}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex flex-none items-center gap-2.5 xl:ml-0">
          <div className="hidden md:block">
            <LangSwitch lang={lang} t={t} variant="bar" />
          </div>
          <a href={waAdmissions} target="_blank" rel="noopener noreferrer" className="btn btn-primary hidden !min-h-11 !px-5 !text-sm sm:inline-flex">
            {t.common.enroll}
          </a>
          <button
            type="button"
            className="-mr-2 inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-white/10 xl:hidden"
            aria-label={mobileOpen ? t.common.menuClose : t.common.menuOpen}
            aria-expanded={mobileOpen}
            aria-controls="menu-movil"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Menú de celular y tableta: acordeón */}
      <div id="menu-movil" hidden={!mobileOpen} className="xl:hidden" style={{ height: "calc(100dvh - 76px)", background: "var(--ink)" }}>
        <div className="wrap flex h-full flex-col gap-6 overflow-y-auto pb-8 pt-4">
          <LangSwitch lang={lang} t={t} variant="menu" />

          <nav aria-label={lang === "es" ? "Menú" : "Menu"}>
            <ul className="border-t border-white/10">
              {nav.map((group, i) => (
                <MobileGroup
                  key={group.page}
                  group={group}
                  lang={lang}
                  expanded={expanded === i}
                  onToggle={() => setExpanded(expanded === i ? null : i)}
                  onNavigate={closeAll}
                />
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-3 pt-4">
            <a href={waAdmissions} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
              <WhatsAppIcon size={18} /> {t.common.enroll}
            </a>
            <a href={TEL_HREF} className="btn btn-ghost w-full">
              <Phone size={18} aria-hidden /> {t.common.call} · {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
