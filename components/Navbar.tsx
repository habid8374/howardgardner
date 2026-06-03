"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ShieldLogo from "./ShieldLogo";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#logros", label: "Logros" },
  { href: "#bilinguismo", label: "Bilingüismo" },
  { href: "#academico", label: "Académico" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        background: scrolled
          ? "rgba(19,19,107,0.97)"
          : "rgba(19,19,107,0.85)",
        backdropFilter: "blur(14px)",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.35)" : "none",
      }}
      className="fixed top-0 w-full z-50 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between"
           style={{ height: scrolled ? "64px" : "76px", transition: "height 0.3s" }}>

        {/* Brand */}
        <a href="#inicio" className="flex items-center gap-3 no-underline">
          <ShieldLogo size={40} />
          <div className="flex flex-col leading-tight">
            <span style={{ color: "#fff", fontWeight: 800, fontSize: "0.92rem", letterSpacing: "0.06em" }}>
              HOWARD GARDNER
            </span>
            <span style={{ color: "#FFD700", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Bilingual School · Sabanalarga
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-3 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.82)" }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = "#FFD700";
                  (e.target as HTMLAnchorElement).style.background = "rgba(255,215,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.82)";
                  (e.target as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#admisiones"
              className="px-4 py-2 rounded-lg text-sm font-bold no-underline transition-all duration-200"
              style={{
                background: "#FFD700",
                color: "#13136b",
                boxShadow: "0 2px 12px rgba(255,215,0,0.35)",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.transform = "translateY(-1px)";
                (e.target as HTMLAnchorElement).style.boxShadow = "0 6px 20px rgba(255,215,0,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.target as HTMLAnchorElement).style.boxShadow = "0 2px 12px rgba(255,215,0,0.35)";
              }}
            >
              Inscríbete
            </a>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden text-white p-2 rounded-lg"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: "rgba(13,13,90,0.98)", borderTop: "1px solid rgba(255,215,0,0.15)" }}
            className="md:hidden overflow-hidden"
          >
            <ul className="list-none m-0 p-4 flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium no-underline"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#admisiones"
                  onClick={() => setOpen(false)}
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
    </motion.nav>
  );
}
