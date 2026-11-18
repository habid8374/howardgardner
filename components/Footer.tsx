import Image from "next/image";
import Link from "next/link";
import { LEGAL_NAME, NIT, ADDRESS_LINE, PHONE_DISPLAY, TEL_HREF, SOCIAL } from "@/lib/site";

const links = [
  { href: "/#resultados", label: "Resultados ICFES" },
  { href: "/#niveles", label: "Niveles" },
  { href: "/#bilinguismo", label: "Bilingüismo" },
  { href: "/#pedagogia", label: "Pedagogía" },
  { href: "/#admisiones", label: "Admisiones 2027" },
  { href: "/#preguntas", label: "Preguntas frecuentes" },
];

export default function Footer() {
  return (
    <footer className="bg-ink pb-10 pt-20 text-white">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/#inicio" className="inline-flex items-center gap-3">
              <Image src="/howard_gardner_logo_sin_fondo.png" alt="" width={52} height={50} className="h-12 w-auto" />
              <span className="flex flex-col leading-none">
                <span className="font-extrabold tracking-[0.08em]">HOWARD GARDNER</span>
                <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">Bilingual School</span>
              </span>
            </Link>
            <p className="h-display mt-8 max-w-sm text-[1.7rem] leading-tight text-white/90">
              Your Vision Is Our Inspiration.
            </p>
          </div>

          <nav aria-label="Pie de página">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">El colegio</p>
            <ul className="mt-5 flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link inline-flex min-h-11 items-center text-white/75 hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Contacto</p>
            <ul className="mt-5 flex flex-col text-white/75">
              <li className="py-2.5">{ADDRESS_LINE}</li>
              <li><a href={TEL_HREF} className="link inline-flex min-h-11 items-center">{PHONE_DISPLAY}</a></li>
              <li><a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center">Instagram</a></li>
              <li><a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center">Facebook</a></li>
              <li><Link href="/politica-de-datos" className="link inline-flex min-h-11 items-center">Política de Tratamiento de Datos</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {LEGAL_NAME} · NIT {NIT}</p>
          <a
            href="https://axentiatechnologies.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-white/55 transition-colors hover:text-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/axentia_icon_solo_A.ico" alt="" width={18} height={18} />
            Sitio por <strong className="font-semibold text-white/80">Axentia Technologies</strong>
          </a>
        </div>
      </div>
    </footer>
  );
}
