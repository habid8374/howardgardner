/* Niveles de formación según el sistema educativo colombiano (MEN).
   TODO(CLIENTE): confirmar grados ofrecidos y edades de ingreso. */
const levels = [
  {
    id: "preescolar",
    name: "Preescolar",
    grades: "Prejardín, Jardín y Transición",
    ages: "3 a 5 años",
    desc: "Primeros pasos en un ambiente bilingüe donde el juego y la exploración despiertan la curiosidad de cada niño.",
  },
  {
    id: "primaria",
    name: "Básica Primaria",
    grades: "1° a 5°",
    ages: "6 a 10 años",
    desc: "Bases sólidas en lectura, escritura, matemáticas e inglés, con pensamiento crítico y valores desde temprano.",
  },
  {
    id: "secundaria",
    name: "Básica Secundaria",
    grades: "6° a 9°",
    ages: "11 a 14 años",
    desc: "Profundización en todas las áreas con enfoque bilingüe y experimental, preparando el paso a la media.",
  },
  {
    id: "media",
    name: "Media Académica",
    grades: "10° y 11°",
    ages: "15 a 17 años",
    desc: "Preparación para las Pruebas Saber 11° y orientación para la universidad y la vida profesional.",
  },
];

export default function Levels() {
  return (
    <section id="niveles" className="section bg-paper-2">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow text-navy">Propuesta educativa</p>
            <h2 className="h-section mt-5 text-ink">Cuatro niveles, un mismo camino bilingüe.</h2>
          </div>
          <p className="lead max-w-sm text-muted">
            Un proceso continuo desde los tres años hasta el grado 11°, con el mismo equipo y la misma filosofía.
          </p>
        </div>

        <ol className="mt-14 border-t border-ink/15">
          {levels.map((l, i) => (
            <li
              key={l.id}
              id={l.id}
              className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-b border-ink/15 py-8 md:grid-cols-[80px_1.1fr_1.6fr_auto] md:items-baseline md:gap-x-10"
            >
              <span className="h-display text-2xl text-navy/50 md:text-3xl">0{i + 1}</span>
              <div>
                <h3 className="h-display text-[clamp(1.6rem,2.6vw,2.2rem)] text-ink">{l.name}</h3>
                <p className="mt-1 text-sm font-semibold text-navy">{l.grades}</p>
              </div>
              <p className="col-start-2 text-[1.02rem] leading-relaxed text-muted md:col-start-auto">{l.desc}</p>
              <span className="col-start-2 inline-flex w-fit rounded-full border border-ink/20 px-3 py-1 text-sm font-semibold text-ink md:col-start-auto">
                {l.ages}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
