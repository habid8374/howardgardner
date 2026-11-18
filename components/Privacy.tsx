import { LEGAL_NAME, NIT, ADDRESS_LINE, PHONE_DISPLAY } from "@/lib/site";
import type { Lang } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";

/* TODO(CLIENTE): validar este texto con el área jurídica del colegio,
   agregar el correo oficial para consultas y la fecha de entrada en vigencia. */
const fill = (s: string) =>
  s.replace("{LEGAL}", LEGAL_NAME).replace("{NIT}", NIT).replace("{ADDRESS}", ADDRESS_LINE).replaceAll("{PHONE}", PHONE_DISPLAY);

export default function Privacy({ t }: { lang: Lang; t: Dict }) {
  const p = t.privacy;
  return (
    <div className="bg-paper pt-[76px]">
      <article className="wrap max-w-3xl py-16 text-[1.02rem] leading-relaxed text-ink">
        <p className="eyebrow text-navy">{p.eyebrow}</p>
        <h1 className="h-section mt-5">{p.title}</h1>
        {p.note && <p className="mt-6 rounded-xl bg-paper-2 px-4 py-3 text-sm text-muted">{p.note}</p>}
        {p.sections.map((s) => (
          <section key={s.h}>
            <h2 className="mt-12 text-2xl font-bold">{s.h}</h2>
            {s.p?.map((x) => <p key={x.slice(0, 20)} className="mt-4">{fill(x)}</p>)}
            {s.list && (
              <ul className="mt-4 list-disc pl-6">
                {s.list.map((x) => <li key={x} className="mt-2">{x}</li>)}
              </ul>
            )}
          </section>
        ))}
      </article>
    </div>
  );
}
