/* Resultados 2025 — un momento tipográfico: el 297 a gran escala. */

const facts = [
  { n: "#1", t: "Ranking municipal ICFES", d: "Primer colegio de Sabanalarga en las Pruebas Saber 11° 2025." },
  { n: "A+", t: "Categoría Excelencia", d: "Según el Ranking Milton Ochoa 2025." },
  { n: "74°", t: "En el Atlántico", d: "Entre los 100 mejores del departamento, de 542 instituciones." },
  { n: "+13", t: "Puntos frente a 2024", d: "Mejora del puntaje global de un año a otro." },
];

const areas = [
  { area: "Matemáticas", puesto: "1.er lugar" },
  { area: "Ciencias Sociales", puesto: "1.er lugar" },
  { area: "Lectura Crítica", puesto: "1.er lugar" },
  { area: "Ciencias Naturales", puesto: "2.º lugar" },
];

export default function Results() {
  return (
    <section id="resultados" className="section bg-paper">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="eyebrow text-navy">Pruebas Saber 11° · 2025</p>
            <h2 className="h-section mt-5 text-ink">Resultados que se pueden verificar.</h2>
            <p className="lead mt-6 max-w-md text-muted">
              Nuestros estudiantes de grado 11° obtuvieron el mejor puntaje global del municipio
              y el primer lugar en Matemáticas, Ciencias Sociales y Lectura Crítica.
            </p>

            <div className="mt-10 flex items-end gap-5" aria-label="Puntaje global: 297">
              <span
                className="h-display text-navy"
                style={{ fontSize: "clamp(7rem, 17vw, 13rem)", lineHeight: 0.8 }}
                aria-hidden
              >
                297
              </span>
              <span className="pb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted" aria-hidden>
                puntaje<br />global
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
              {facts.map((f) => (
                <li key={f.t} className="bg-paper p-7">
                  <p className="h-display text-[2.6rem] text-navy">{f.n}</p>
                  <h3 className="mt-3 text-base font-bold text-ink">{f.t}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{f.d}</p>
                </li>
              ))}
            </ul>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">Puesto municipal por área</h3>
              <table className="mt-4 w-full border-collapse text-left">
                <caption className="sr-only">Puesto en el municipio por área en Saber 11° 2025</caption>
                <thead className="sr-only">
                  <tr><th scope="col">Área</th><th scope="col">Puesto</th></tr>
                </thead>
                <tbody>
                  {areas.map((a) => (
                    <tr key={a.area} className="border-b border-line">
                      <th scope="row" className="py-4 font-[family-name:var(--font-display)] text-xl font-normal text-ink">{a.area}</th>
                      <td className="py-4 text-right">
                        <span
                          className={`inline-flex min-w-24 justify-center rounded-full px-3 py-1 text-sm font-bold ${
                            a.puesto.startsWith("1") ? "bg-gold text-ink" : "bg-paper-2 text-ink"
                          }`}
                        >
                          {a.puesto}
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
