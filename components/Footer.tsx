import Image from "next/image";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import CookiePrefsButton from "./CookiePrefsButton";
import { LEGAL_NAME, NIT, ADDRESS_LINE, PHONE_DISPLAY, TEL_HREF, SOCIAL } from "@/lib/site";
import { href, type Lang, type PageKey } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";

export default function Footer({ lang, t }: { lang: Lang; t: Dict }) {
  const f = t.footer;
  return (
    <footer className="bg-ink pb-10 pt-20 text-white">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href={href(lang, "home")} className="inline-flex items-center gap-3">
              <Image src="/howard_gardner_logo_sin_fondo.png" alt="" width={52} height={50} className="h-12 w-auto" />
              <span className="flex flex-col leading-none">
                <span className="font-extrabold tracking-[0.08em]">HOWARD GARDNER</span>
                <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">Bilingual School</span>
              </span>
            </Link>
            <p className="h-display mt-8 max-w-sm text-[1.7rem] leading-tight text-white/90">Your Vision Is Our Inspiration.</p>
          </div>

          <nav aria-label={f.schoolTitle}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">{f.schoolTitle}</p>
            <ul className="mt-5 flex flex-col">
              {f.links.map((l) => (
                <li key={l.page}>
                  <Link href={href(lang, l.page as PageKey)} className="link inline-flex min-h-11 items-center text-white/75 hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">{f.contactTitle}</p>
            <ul className="mt-5 flex flex-col text-white/75">
              <li className="py-2.5">{ADDRESS_LINE}</li>
              <li><a href={TEL_HREF} className="link inline-flex min-h-11 items-center">{PHONE_DISPLAY}</a></li>
              <li><a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center">Instagram</a></li>
              <li><a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center">Facebook</a></li>
              <li><Link href={href(lang, "privacy")} className="link inline-flex min-h-11 items-center">{f.privacy}</Link></li>
              <li><Link href={href(lang, "cookies")} className="link inline-flex min-h-11 items-center">{f.cookiePolicy}</Link></li>
              <li><CookiePrefsButton label={f.cookiePrefs} className="link inline-flex min-h-11 items-center text-left" /></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {LEGAL_NAME} · NIT {NIT}</p>
          <Link
            href={`/admin?lang=${lang}`}
            prefetch={false}
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-white/25 px-5 text-sm font-semibold text-white/85 transition-colors hover:border-gold hover:text-gold md:self-auto"
          >
            <LockKeyhole size={16} aria-hidden /> {f.admin}
          </Link>
          <a href="https://axentiatechnologies.com" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-white/55 transition-colors hover:text-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/axentia_icon_solo_A.ico" alt="" width={18} height={18} />
            {f.credit} <strong className="font-semibold text-white/80">Axentia Technologies</strong>
          </a>
        </div>
      </div>
    </footer>
  );
}
