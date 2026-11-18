/* Niveles de formación según el sistema educativo colombiano (MEN).
   TODO(CLIENTE): confirmar grados ofrecidos y edades de ingreso. */
import type { Dict } from "@/lib/dictionaries";

export default function Levels({ t }: { t: Dict }) {
  const l = t.levels;
  return (
    <section id="niveles" className="section bg-paper-2">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow text-navy">{l.eyebrow}</p>
            <h2 className="h-section mt-5 text-ink">{l.title}</h2>
          </div>
          <p className="lead max-w-sm text-muted">{l.lead}</p>
        </div>

        <ol className="mt-14 border-t border-ink/15">
          {l.items.map((item, i) => (
            <li
              key={item.id}
              id={item.id}
              className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-b border-ink/15 py-8 md:grid-cols-[80px_1.1fr_1.6fr_auto] md:items-baseline md:gap-x-10"
            >
              <span className="h-display text-2xl text-navy/50 md:text-3xl">0{i + 1}</span>
              <div>
                <h3 className="h-display text-[clamp(1.6rem,2.6vw,2.2rem)] text-ink">{item.name}</h3>
                <p className="mt-1 text-sm font-semibold text-navy">{item.grades}</p>
              </div>
              <p className="col-start-2 text-[1.02rem] leading-relaxed text-muted md:col-start-auto">{item.desc}</p>
              <span className="col-start-2 inline-flex w-fit rounded-full border border-ink/20 px-3 py-1 text-sm font-semibold text-ink md:col-start-auto">
                {item.ages}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
