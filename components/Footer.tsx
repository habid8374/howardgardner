"use client";

import Image from "next/image";
import { InstagramIcon, WhatsAppIcon, FacebookIcon, YouTubeIcon } from "./BrandIcons";

const socials = [
  { href: "https://www.instagram.com/howard_gardner_sabanalarga", label: "Instagram", Icon: InstagramIcon },
  { href: "https://wa.me/573012028756",                          label: "WhatsApp",  Icon: WhatsAppIcon },
  { href: "https://www.facebook.com/share/18oAGhXZjt/",          label: "Facebook",  Icon: FacebookIcon },
  { href: "#",                                                   label: "YouTube",   Icon: YouTubeIcon },
];

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#logros", label: "Logros" },
  { href: "#bilinguismo", label: "Bilingüismo" },
  { href: "#academico", label: "Académico" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

const infoLinks = [
  { href: "#admisiones", label: "Admisiones 2026" },
  { href: "#bilinguismo", label: "Programa Bilingüe" },
  { href: "#logros", label: "Resultados ICFES" },
  { href: "#contacto", label: "Ubicación" },
  { href: "#", label: "Política de Privacidad" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0d0d5a", padding: "3.5rem 1.5rem 1.5rem" }}>
      <div className="max-w-5xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <a href="#inicio" className="flex items-center gap-3 no-underline mb-4">
              <Image
                src="/howard_gardner_logo_sin_fondo.png"
                alt="Howard Gardner Bilingual School"
                width={48}
                height={48}
                className="object-contain"
                style={{ filter: "drop-shadow(0 2px 8px rgba(255,215,0,0.35))" }}
              />
              <div className="flex flex-col leading-tight">
                <span style={{ color: "#fff", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.06em" }}>HOWARD GARDNER</span>
                <span style={{ color: "#FFD700", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>Bilingual School</span>
              </div>
            </a>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 260, margin: 0 }}>
              &quot;Your Vision Is Our Inspiration&quot; — Formando los líderes bilingües del mañana en Sabanalarga, Atlántico.
            </p>

            <div className="flex gap-3 mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center no-underline transition-all"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#FFD700";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#13136b";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  <s.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div>
            <p className="font-bold uppercase tracking-widest text-xs mb-4 m-0" style={{ color: "#FFD700" }}>Navegación</p>
            <ul className="list-none m-0 p-0 flex flex-col gap-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="no-underline text-sm transition-colors" style={{ color: "rgba(255,255,255,0.6)" }}
                    onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#FFD700")}
                    onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)")}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <p className="font-bold uppercase tracking-widest text-xs mb-4 m-0" style={{ color: "#FFD700" }}>Información</p>
            <ul className="list-none m-0 p-0 flex flex-col gap-2">
              {infoLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="no-underline text-sm transition-colors" style={{ color: "rgba(255,255,255,0.6)" }}
                    onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#FFD700")}
                    onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)")}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mb-8">
          <p className="font-bold uppercase tracking-widest text-xs mb-4 m-0" style={{ color: "#FFD700" }}>
            Cómo llegar
          </p>
          <p className="text-xs mb-3 m-0" style={{ color: "rgba(255,255,255,0.5)" }}>
            Calle 12 #34 B-2, Sabanalarga, Atlántico, Colombia
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,215,0,0.18)", height: 240 }}>
            <iframe
              src="https://maps.google.com/maps?q=Calle+12+%2334+B-2,+Sabanalarga,+Atl%C3%A1ntico,+Colombia&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block", filter: "invert(0.85) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Howard Gardner Bilingual School"
            />
          </div>
          <a
            href="https://maps.google.com/maps?q=Calle+12+%2334+B-2,+Sabanalarga,+Atl%C3%A1ntico,+Colombia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 no-underline text-xs mt-2 transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#FFD700"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)"; }}
          >
            Abrir en Google Maps →
          </a>
        </div>

        {/* Bottom */}
        <div
          className="pt-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}
        >
          <p className="m-0">© 2026 Howard Gardner De Sabanalarga S.A.S. · NIT 900.419.545-7 · Todos los derechos reservados.</p>
          <p className="m-0">Categoría <a href="#logros" className="no-underline" style={{ color: "#FFD700" }}>A+ ICFES 2025</a> · #1 Sabanalarga</p>
        </div>

        {/* Powered by Axentia Tech */}
        <div className="flex justify-center mt-6">
          <a
            href="https://axentiatech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 no-underline rounded-full px-4 py-2 transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; }}
          >
            <img
              src="/axentia_icon_solo_A.ico"
              alt="Axentia Tech"
              width={20}
              height={20}
              style={{ objectFit: "contain", display: "block" }}
            />
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.03em" }}>
              Powered by <strong style={{ color: "#FFD700", fontWeight: 700 }}>Axentia Tech</strong>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
