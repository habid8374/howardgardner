import { Plus } from "lucide-react";
import type { Dict } from "@/lib/dictionaries";

/* Solo respuestas con datos confirmados.
   TODO(CLIENTE): agregar requisitos, uniformes, transporte, jornada y
   alimentación cuando el colegio los entregue (ver PENDIENTES.md). */
export default function Faq({ t }: { t: Dict }) {
  const f = t.faq;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: f.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };

  return (
    <section id="preguntas" className="section bg-paper">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div>
          <p className="eyebrow text-navy">{f.eyebrow}</p>
          <h2 className="h-section mt-5 text-ink">{f.title}</h2>
        </div>

        <div className="border-t border-line">
          {f.items.map((item, i) => (
            <details key={item.q} className="faq group border-b border-line" open={i === 0}>
              <summary className="flex min-h-16 items-center justify-between gap-6 py-5 text-left">
                <h3 className="text-[1.12rem] font-bold text-ink">{item.q}</h3>
                <span className="faq-icon flex h-9 w-9 flex-none items-center justify-center rounded-full border border-ink/20 text-ink">
                  <Plus size={18} aria-hidden />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-[1.02rem] leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </section>
  );
}
