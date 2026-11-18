import Image from "next/image";
import { MessageCircle, MapPin } from "lucide-react";
import { WA_VISITA, ADDRESS, HERO_IMAGE } from "@/lib/site";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-ink text-white"
      style={{ minHeight: "100svh" }}
    >
      {/* Luz suave del oro del escudo, sin degradados de plantilla */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full opacity-[0.10]"
        style={{ background: "radial-gradient(closest-side, var(--gold), transparent)" }}
      />

      {/* Celular y tableta: la foto va de fondo, con velo azul para leer el texto */}
      <div aria-hidden className="absolute inset-0 lg:hidden">
        <Image src={HERO_IMAGE.src} alt="" fill fetchPriority="high" sizes="100vw" className="object-cover object-[35%_50%]" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(12,22,49,0.45) 0%, rgba(12,22,49,0.62) 35%, rgba(12,22,49,0.88) 70%, rgba(12,22,49,0.97) 100%)" }}
        />
      </div>

      <div className="wrap relative grid min-h-[100svh] grid-cols-1 items-center gap-10 pb-16 pt-[112px] lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-16">
        <div>
          <p className="eyebrow text-gold" data-enter style={{ "--d": "0ms", "--rise": "8px" } as React.CSSProperties}>
            {ADDRESS.city} · Preescolar a 11°
          </p>

          <h1
            className="h-display mt-6 text-[clamp(2.6rem,6.4vw,5.4rem)] text-balance"
            data-enter
            style={{ "--d": "60ms", "--rise": "18px" } as React.CSSProperties}
          >
            El colegio bilingüe <em className="not-italic text-gold">número uno</em> de Sabanalarga.
          </h1>

          <p
            className="lead mt-6 max-w-[34rem] text-white/75"
            data-enter
            style={{ "--d": "140ms", "--rise": "12px" } as React.CSSProperties}
          >
            Único colegio de Sabanalarga en categoría A+ según el Índice de Clasificación
            del ICFES 2026. Hace 16 años formamos niños y jóvenes en español e inglés,
            desde preescolar hasta grado 11°.
          </p>

          <div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            data-enter
            style={{ "--d": "200ms", "--rise": "8px" } as React.CSSProperties}
          >
            <a href={WA_VISITA} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <MessageCircle size={18} aria-hidden /> Agendar una visita
            </a>
            <a href="#admisiones" className="btn btn-ghost">
              Inscripciones 2027
            </a>
          </div>

          <dl
            className="mt-12 grid max-w-[34rem] grid-cols-3 gap-6 border-t border-white/15 pt-6"
            data-enter
            style={{ "--d": "260ms", "--rise": "6px" } as React.CSSProperties}
          >
            {[
              ["A+", "categoría ICFES 2026"],
              ["#1", "en Sabanalarga"],
              ["16", "años educando"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="h-display text-[clamp(1.8rem,3vw,2.4rem)] text-gold">{n}</dd>
                <dd className="mt-1 text-[0.8rem] leading-snug text-white/65">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative hidden lg:block">
          <div data-enter="reveal" style={{ "--d": "80ms" } as React.CSSProperties} className="photo-frame relative aspect-[4/3] overflow-hidden rounded-[28px] lg:aspect-auto lg:h-[min(660px,calc(100svh-210px))]">
            <Image
              src={HERO_IMAGE.src}
              alt={HERO_IMAGE.alt}
              fill
              fetchPriority="high"
              sizes="46vw"
              className="object-cover object-[30%_50%]"
            />
          </div>
          <div data-enter style={{ "--d": "700ms", "--rise": "8px" } as React.CSSProperties} className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-paper px-4 py-3 text-ink shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] sm:left-8">
            <MapPin size={18} className="text-navy" aria-hidden />
            <span className="text-sm font-semibold">{ADDRESS.street}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
