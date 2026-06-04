"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";

const navItems = [
  {
    label: "Quiénes Somos",
    href: "#nosotros",
    children: [
      { label: "Historia",                           href: "#historia" },
      { label: "Misión, Visión y Valores",           href: "#mision" },
      { label: "Símbolos Institucionales",           href: "#simbolos" },
    ],
  },
  {
    label: "Propuesta Educativa",
    href: "#propuesta",
    children: [
      { label: "Preescolar",        href: "#preescolar" },
      { label: "Primaria",          href: "#primaria" },
      { label: "Básica Secundaria", href: "#secundaria" },
      { label: "Media Académica",   href: "#media" },
    ],
  },
  { label: "Bilingüismo",         href: "#bilinguismo",  children: [] },
  { label: "Admisiones",          href: "#admisiones",   children: [] },
  { label: "Preguntas Frecuentes",href: "#preguntas",    children: [] },
];

/* ── Desktop dropdown item ── */
function NavItem({
  item,
  scrolled,
}: {
  item: (typeof navItems)[0];
  scrolled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const leave = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  const hasChildren = item.children.length > 0;

  return (
    <li
      className="relative"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <a
        href={item.href}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors duration-200 whitespace-nowrap"
        style={{ color: open ? "#FFD700" : "rgba(255,255,255,0.85)" }}
      >
        {item.label}
        {hasChildren && (
          <ChevronDown
            size={13}
            style={{
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              opacity: 0.7,
            }}
          />
        )}
      </a>

      {/* Gold underline indicator */}
      <AnimatePresence>
        {open && (
          <motion.span
            layoutId="nav-indicator"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "absolute",
              bottom: 0,
              left: "12px",
              right: "12px",
              height: "2px",
              background: "#FFD700",
              borderRadius: "2px",
            }}
          />
        )}
      </AnimatePresence>

      {/* Dropdown — sin contenedor, floating links */}
      <AnimatePresence>
        {open && hasChildren && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-0 list-none m-0 p-0 flex flex-col"
            style={{
              minWidth: "210px",
              paddingTop: "10px",
              zIndex: 100,
            }}
          >
            {/* Thin gold rule at top */}
            <li aria-hidden style={{ height: "2px", background: "#FFD700", borderRadius: "2px", marginBottom: "4px" }} />

            {item.children.map((child, i) => (
              <motion.li
                key={child.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.15 }}
              >
                <a
                  href={child.href}
                  className="block px-3 py-2 text-sm font-medium no-underline transition-colors duration-150 whitespace-nowrap"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    background: "rgba(13,13,90,0.94)",
                    backdropFilter: "blur(12px)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#FFD700";
                    (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "18px";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.9)";
                    (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "12px";
                  }}
                >
                  {child.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ── Main Navbar ── */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => setScrolled(window.scrollY > 60), { passive: true });
  }

  return (
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        // Transparente sobre el hero; navy sólido al hacer scroll.
        background: scrolled
          ? "rgba(13,13,90,0.98)"
          : "linear-gradient(180deg, rgba(8,8,40,0.45) 0%, rgba(8,8,40,0) 100%)",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div
        className="max-w-6xl mx-auto px-6 flex items-center justify-between"
        style={{ height: scrolled ? "64px" : "76px", transition: "height 0.3s" }}
      >
        {/* Brand */}
        <a href="#inicio" className="flex items-center gap-3 no-underline flex-shrink-0">
          <Image
            src="/howard_gardner_logo_sin_fondo.png"
            alt="Howard Gardner Bilingual School"
            width={46}
            height={46}
            className="object-contain"
            style={{ filter: "drop-shadow(0 2px 6px rgba(255,215,0,0.4))" }}
          />
          <div className="flex flex-col leading-tight">
            <span style={{ color: "#fff", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.06em" }}>
              HOWARD GARDNER
            </span>
            <span style={{ color: "#FFD700", fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Bilingual School · Sabanalarga
            </span>
          </div>
        </a>

        {/* Desktop menu */}
        <ul className="hidden lg:flex items-center gap-0 list-none m-0 p-0">
          {navItems.map((item) => (
            <NavItem key={item.href} item={item} scrolled={scrolled} />
          ))}
          <li>
            <a
              href="#admisiones"
              className="ml-3 px-4 py-2 rounded-lg text-sm font-bold no-underline transition-all duration-200 whitespace-nowrap"
              style={{
                background: "#FFD700",
                color: "#13136b",
                boxShadow: "0 2px 12px rgba(255,215,0,0.35)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 20px rgba(255,215,0,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 12px rgba(255,215,0,0.35)";
              }}
            >
              Inscríbete
            </a>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className="lg:hidden text-white p-2 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: "rgba(8,8,62,0.99)", borderTop: "1px solid rgba(255,215,0,0.15)", overflow: "hidden" }}
            className="lg:hidden"
          >
            <ul className="list-none m-0 p-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  {item.children.length > 0 ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.href ? null : item.href)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-left"
                        style={{ color: "rgba(255,255,255,0.85)", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                      >
                        {item.label}
                        <ChevronDown
                          size={14}
                          style={{
                            transition: "transform 0.2s",
                            transform: mobileExpanded === item.href ? "rotate(180deg)" : "rotate(0deg)",
                            color: "#FFD700",
                          }}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === item.href && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="list-none m-0 pl-4 overflow-hidden"
                          >
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <a
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="block px-4 py-2.5 text-sm no-underline"
                                  style={{ color: "rgba(255,255,255,0.65)", borderLeft: "2px solid rgba(255,215,0,0.3)" }}
                                >
                                  {child.label}
                                </a>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 rounded-lg text-sm font-medium no-underline"
                      style={{ color: "rgba(255,255,255,0.85)" }}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <a
                  href="#admisiones"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-bold no-underline text-center mt-2"
                  style={{ background: "#FFD700", color: "#13136b" }}
                >
                  Inscríbete 2026
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
