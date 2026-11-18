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
    q: "¿Cómo les fue en las Pruebas Saber 11° 2025?",
    a: "Obtuvimos el primer lugar del municipio con 297 puntos de puntaje global y categoría A+ en el Ranking Milton Ochoa 2025. Quedamos en el puesto 74 de 542 instituciones del Atlántico.",
  },
  {
    q: "¿Cómo inscribo a mi hijo o hija para 2026?",
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
