/* Resultados — momento tipográfico: la A+ a gran escala.
   Fuentes: piezas oficiales del colegio (noviembre 2026), Índice de
   Clasificación del ICFES 2026 y Ranking Milton Ochoa. */
import type { Dict } from "@/lib/dictionaries";

export default function Results({ t }: { t: Dict }) {
  const r = t.results;
  return (
    <section id="resultados" className="section bg-paper">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="eyebrow text-navy">{r.eyebrow}</p>
            <h2 className="h-section mt-5 text-ink">{r.title}</h2>
            <p className="lead mt-6 max-w-md text-muted">{r.lead}</p>

            <div className="mt-10 flex items-end gap-5" role="img" aria-label={r.bigAria}>
              <span className="h-display text-navy" style={{ fontSize: "clamp(7.5rem, 18vw, 14rem)", lineHeight: 0.8 }} aria-hidden>
                A+
              </span>
              <span className="pb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted" aria-hidden>
                {r.bigLabel[0]}<br />{r.bigLabel[1]}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
              {r.facts.map((f) => (
                <li key={f.t} className="bg-paper p-7">
                  <p className="h-display text-[2.6rem] text-navy">{f.n}</p>
                  <h3 className="mt-3 text-base font-bold text-ink">{f.t}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{f.d}</p>
                </li>
              ))}
            </ul>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">{r.areasTitle}</h3>
              <p className="mt-2 text-[0.95rem] text-muted">{r.areasLead}</p>
              <table className="mt-4 w-full border-collapse text-left">
                <caption className="sr-only">{r.areasCaption}</caption>
                <thead className="sr-only">
                  <tr><th scope="col">{r.areaCol}</th><th scope="col">{r.placeCol}</th></tr>
                </thead>
                <tbody>
                  {r.areas.map((a) => (
                    <tr key={a.area} className="border-b border-line">
                      <th scope="row" className="py-4 font-[family-name:var(--font-display)] text-xl font-normal text-ink">{a.area}</th>
                      <td className="py-4 text-right">
                        <span className={`inline-flex min-w-24 justify-center rounded-full px-3 py-1 text-sm font-bold ${a.first ? "bg-gold text-ink" : "bg-paper-2 text-ink"}`}>
                          {a.place}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
