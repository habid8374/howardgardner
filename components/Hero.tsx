import Image from "next/image";
import Link from "next/link";
import { MessageCircle, MapPin } from "lucide-react";
import { ADDRESS, HERO_IMAGE_SRC, waLink } from "@/lib/site";
import { href, type Lang } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";

const d = (ms: number, rise?: number) => ({ "--d": `${ms}ms`, ...(rise ? { "--rise": `${rise}px` } : {}) }) as React.CSSProperties;

export default function Hero({ lang, t }: { lang: Lang; t: Dict }) {
  const h = t.hero;
  return (
    <section id="inicio" className="relative overflow-hidden bg-ink text-white" style={{ minHeight: "100svh" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full opacity-[0.10]"
        style={{ background: "radial-gradient(closest-side, var(--gold), transparent)" }}
      />

      {/* Celular y tableta: la foto va de fondo, con velo azul para leer el texto */}
      <div aria-hidden className="absolute inset-0 lg:hidden">
        <Image src={HERO_IMAGE_SRC} alt="" fill fetchPriority="high" sizes="100vw" className="object-cover object-[35%_50%]" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(12,22,49,0.45) 0%, rgba(12,22,49,0.62) 35%, rgba(12,22,49,0.88) 70%, rgba(12,22,49,0.97) 100%)" }}
        />
      </div>

      <div className="wrap relative grid min-h-[100svh] grid-cols-1 items-center gap-10 pb-16 pt-[112px] lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <p className="eyebrow text-gold" data-enter style={d(0, 8)}>{h.eyebrow}</p>

          <h1 className="h-display mt-6 text-[clamp(2.6rem,6.4vw,5.4rem)] text-balance" data-enter style={d(60, 18)}>
            {h.title[0]}<em className="not-italic text-gold">{h.title[1]}</em>{h.title[2]}
          </h1>

          <p className="lead mt-6 max-w-[34rem] text-white/75" data-enter style={d(140, 12)}>{h.lead}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row" data-enter style={d(200, 8)}>
            <a href={waLink(t.wa.visit)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <MessageCircle size={18} aria-hidden /> {t.common.visit}
            </a>
            <Link href={href(lang, "admissions")} className="btn btn-ghost">{t.common.enroll}</Link>
          </div>

          <dl className="mt-12 grid max-w-[34rem] grid-cols-3 gap-6 border-t border-white/15 pt-6" data-enter style={d(260, 6)}>
            {h.stats.map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="h-display text-[clamp(1.8rem,3vw,2.4rem)] text-gold">{n}</dd>
                <dd className="mt-1 text-[0.8rem] leading-snug text-white/65">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative hidden lg:block">
          <div data-enter="reveal" style={d(80)} className="photo-frame relative overflow-hidden rounded-[28px] lg:h-[min(660px,calc(100svh-210px))]">
            <Image src={HERO_IMAGE_SRC} alt={h.photoAlt} fill fetchPriority="high" sizes="46vw" className="object-cover object-[30%_50%]" />
          </div>
          <div data-enter style={d(700, 8)} className="absolute -bottom-5 left-8 flex items-center gap-3 rounded-2xl bg-paper px-4 py-3 text-ink shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]">
            <MapPin size={18} className="text-navy" aria-hidden />
            <span className="text-sm font-semibold">{ADDRESS.street}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
