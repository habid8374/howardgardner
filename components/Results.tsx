/* Resultados — momento tipográfico: la A+ a gran escala.
   Fuentes: piezas oficiales del colegio (noviembre 2026) e Índice de
   Clasificación del ICFES 2026 / Ranking Milton Ochoa. */

const facts = [
  { n: "#1", t: "En Sabanalarga", d: "Primer puesto municipal por el Índice de Clasificación del ICFES 2026, con índice 0,7783." },
  { n: "71°", t: "En el Atlántico", d: "Entre 540 colegios evaluados en el departamento en 2026." },
  { n: "88°", t: "Índice ICFES departamental", d: "Entre 553 instituciones del Atlántico, según el Índice de Clasificación 2026." },
  { n: "16", t: "Años educando", d: "Formando niños y jóvenes en Sabanalarga desde preescolar hasta grado 11°." },
];

const areas2025 = [
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
            <p className="eyebrow text-navy">Índice de Clasificación ICFES · 2026</p>
            <h2 className="h-section mt-5 text-ink">El único colegio A+ de Sabanalarga.</h2>
            <p className="lead mt-6 max-w-md text-muted">
              La categoría A+ es el nivel de desempeño más alto del país en las Pruebas Saber 11°.
              La otorga el ICFES a la institución, no a un estudiante en particular: es el
              resultado del trabajo de todo el colegio durante varios años.
            </p>

            <div className="mt-10 flex items-end gap-5" aria-label="Categoría A+">
              <span
                className="h-display text-navy"
                style={{ fontSize: "clamp(7.5rem, 18vw, 14rem)", lineHeight: 0.8 }}
                aria-hidden
              >
                A+
              </span>
              <span className="pb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted" aria-hidden>
                categoría<br />ICFES 2026
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
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">Saber 11° 2025 · puesto municipal por área</h3>
              <p className="mt-2 text-[0.95rem] text-muted">
                Primer lugar del municipio con 297 puntos de puntaje global, 13 más que en 2024.
              </p>
              <table className="mt-4 w-full border-collapse text-left">
                <caption className="sr-only">Puesto en el municipio por área en Saber 11° 2025</caption>
                <thead className="sr-only">
                  <tr><th scope="col">Área</th><th scope="col">Puesto</th></tr>
                </thead>
                <tbody>
                  {areas2025.map((a) => (
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
