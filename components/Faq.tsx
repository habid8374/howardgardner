import { Plus } from "lucide-react";
import { ADDRESS_LINE, HOURS, PHONE_DISPLAY } from "@/lib/site";

/* Solo respuestas con datos confirmados en el sitio actual.
   TODO(CLIENTE): agregar requisitos, uniformes, transporte, jornada y
   alimentación cuando el colegio los entregue (ver PENDIENTES.md). */
export const faqs = [
  {
    q: "¿Dónde queda el colegio?",
    a: `En la ${ADDRESS_LINE}. Puedes ver el mapa y pedir indicaciones en la sección Visítanos.`,
  },
  {
    q: "¿Qué grados ofrecen?",
    a: "Desde preescolar (Prejardín, Jardín y Transición) hasta grado 11°: Básica Primaria, Básica Secundaria y Media Académica.",
  },
  {
    q: "¿El colegio es bilingüe?",
    a: "Sí. Somos la única institución bilingüe de Sabanalarga y el inglés hace parte de la formación desde preescolar.",
  },
  {
    q: "¿Qué significa que el colegio sea A+?",
    a: "Estar en la categoría A+ según el ICFES significa que la institución (no un estudiante de forma individual) se encuentra en el nivel de desempeño más alto de todo el país en las Pruebas Saber 11°. Somos el único colegio de Sabanalarga en esta categoría según el Índice de Clasificación del ICFES 2026.",
  },
  {
    q: "¿Cómo les ha ido en las Pruebas Saber 11°?",
    a: "En el Índice de Clasificación del ICFES 2026 ocupamos el primer puesto de Sabanalarga y el puesto 88 entre 553 instituciones del Atlántico. En 2026 también ocupamos el puesto 71 entre 540 colegios evaluados del departamento. En 2025 fuimos primeros del municipio con 297 puntos de puntaje global.",
  },
  {
    q: "¿Qué es Oxford Quality?",
    a: "Oficialmente formamos parte de Oxford Quality, en alianza con Oxford University Press. Para nuestros estudiantes significa aprender inglés con recursos confiables de calidad internacional.",
  },
  {
    q: "¿Cómo inscribo a mi hijo o hija para 2027?",
    a: `Escríbenos por WhatsApp o llámanos al ${PHONE_DISPLAY}. Te contamos los requisitos, los costos y agendamos una visita al colegio.`,
  },
  {
    q: "¿Cuál es el horario de atención?",
    a: `${HOURS}.`,
  },
];

export default function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="preguntas" className="section bg-paper">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div>
          <p className="eyebrow text-navy">Preguntas frecuentes</p>
          <h2 className="h-section mt-5 text-ink">Lo que más nos preguntan las familias.</h2>
        </div>

        <div className="border-t border-line">
          {faqs.map((f, i) => (
            <details key={f.q} className="faq group border-b border-line" open={i === 0}>
              <summary className="flex min-h-16 items-center justify-between gap-6 py-5 text-left">
                <h3 className="text-[1.12rem] font-bold text-ink">{f.q}</h3>
                <span className="faq-icon flex h-9 w-9 flex-none items-center justify-center rounded-full border border-ink/20 text-ink">
                  <Plus size={18} aria-hidden />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-[1.02rem] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </section>
  );
}
