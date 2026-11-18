import Image from "next/image";
import type { Dict } from "@/lib/dictionaries";

export default function About({ t }: { t: Dict }) {
  const a = t.about;
  return (
    <section id="historia" className="section bg-paper">
      <div className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow text-navy">{a.eyebrow}</p>
          <h2 className="h-section mt-5 text-ink">{a.title}</h2>
          {a.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="lead mt-6 max-w-xl text-muted">{p}</p>
          ))}
          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-6">
            {a.facts.map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="h-display text-[2.4rem] text-navy">{n}</dd>
                <dd className="mt-1 text-sm leading-snug text-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-8 overflow-hidden rounded-[28px] bg-ink p-10 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-2/3 opacity-20"
            style={{ background: "radial-gradient(closest-side, var(--gold), transparent)" }}
          />
          <Image src="/howard_gardner_logo_sin_fondo.png" alt="" width={300} height={288} className="relative h-auto w-[min(62%,300px)]" />
          <figcaption className="h-display relative text-[clamp(1.5rem,2.4vw,2rem)] text-gold">{a.motto}</figcaption>
        </figure>
      </div>
    </section>
  );
}
