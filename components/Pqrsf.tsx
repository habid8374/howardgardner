"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Search, Send } from "lucide-react";
import DemoNote from "./DemoNote";
import { href, type Lang } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";
import { PQRSF_DAYS, formatDate, pqrsfDue, pqrsfStore, type Pqrsf as Row, type PqrsfType } from "@/lib/demo-store";

/* PQRSF — demo: se guarda en el navegador y aparece en el panel del colegio (/admin). */

type Props = { lang: Lang; t: { pqrsf: Dict["pqrsf"]; demo: Dict["demo"]; grades: string[] } };
type Errors = Partial<Record<"type" | "name" | "email" | "subject" | "description" | "consent", string>>;

const TYPES: PqrsfType[] = ["peticion", "queja", "reclamo", "sugerencia", "felicitacion"];
const days = (s: string) => s.replace("{DAYS}", String(PQRSF_DAYS));

const field =
  "mt-2 block w-full min-h-12 rounded-xl border border-ink/20 bg-white px-4 text-base text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-navy focus:shadow-[0_0_0_3px_rgba(18,36,90,0.15)]";

function Err({ id, msg }: { id: string; msg?: string }) {
  return msg ? <p id={id} className="mt-1.5 text-sm font-medium text-red-700">{msg}</p> : null;
}

export default function Pqrsf({ lang, t }: Props) {
  const p = t.pqrsf;
  const [type, setType] = useState<PqrsfType | "">("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<Row | null>(null);

  const [query, setQuery] = useState("");
  const [found, setFound] = useState<Row | null | undefined>(undefined);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const v = (k: string) => String(d.get(k) || "").trim();
    const file = d.get("adjunto");
    const input = {
      lang,
      type: type as PqrsfType,
      name: v("nombre"),
      email: v("correo"),
      phone: v("telefono"),
      student: v("estudiante"),
      grade: v("grado"),
      subject: v("asunto"),
      description: v("descripcion"),
      attachment: file instanceof File && file.size > 0 ? file.name : "",
      urgent: d.get("urgente") === "on",
    };

    const next: Errors = {};
    if (!type) next.type = p.errors.type;
    if (input.name.length < 3) next.name = p.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) next.email = p.errors.email;
    if (input.subject.length < 3) next.subject = p.errors.subject;
    if (input.description.length < 20) next.description = p.errors.description;
    if (d.get("acepta") !== "on") next.consent = p.errors.consent;
    setErrors(next);
    if (Object.keys(next).length) {
      e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setSent(pqrsfStore.add(input));
    requestAnimationFrame(() => document.getElementById("pqrsf-ok")?.scrollIntoView({ block: "center" }));
    setType("");
  }

  function onLookup(e: React.FormEvent) {
    e.preventDefault();
    setFound(pqrsfStore.find(query) ?? null);
  }

  const aria = (k: keyof Errors) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `e-${k}` : undefined });

  return (
    <>
      <section id="radicar" className="section bg-paper">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
          <div>
            <p className="eyebrow text-navy">{p.formEyebrow}</p>
            <h2 className="h-section mt-5 text-ink">{p.infoTitle}</h2>
            <ol className="mt-10 flex flex-col">
              {p.info.map((step, i) => (
                <li key={step} className="grid grid-cols-[48px_1fr] gap-4 border-t border-line py-5">
                  <span className="h-display text-3xl text-navy">{i + 1}</span>
                  <p className="text-[1.02rem] text-muted">{days(step)}</p>
                </li>
              ))}
            </ol>
            <ul className="mt-6 flex flex-col gap-2 rounded-2xl bg-paper-2 p-5 text-sm text-muted">
              {TYPES.map((k) => (
                <li key={k}><strong className="text-ink">{p.types[k]}:</strong> {p.typeHelp[k]}</li>
              ))}
            </ul>
          </div>

          {sent ? (
            <div id="pqrsf-ok" role="status" className="scroll-mt-24 rounded-[28px] bg-white p-6 shadow-[0_24px_60px_-30px_rgba(12,22,49,0.35)] ring-1 ring-line sm:p-10">
              <CheckCircle2 size={40} className="text-[#1fa855]" aria-hidden />
              <h3 className="h-display mt-5 text-[1.9rem] text-ink">{p.successTitle}</h3>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-muted">{p.successNumber}</p>
              <p className="h-display mt-1 break-all text-[2.2rem] text-navy">{sent.id}</p>
              <p className="mt-4 text-muted">{days(p.successBody)}</p>
              <button type="button" onClick={() => setSent(null)} className="btn btn-ghost on-light mt-8 w-full text-ink">{p.another}</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate aria-labelledby="pqrsf-titulo" className="rounded-[28px] bg-white p-6 text-ink shadow-[0_24px_60px_-30px_rgba(12,22,49,0.35)] ring-1 ring-line sm:p-10">
              <h3 id="pqrsf-titulo" className="h-display text-[1.9rem]">{p.formTitle}</h3>
              <DemoNote text={t.demo.note} badge={t.demo.badge} />

              <fieldset className="mt-8">
                <legend className="text-sm font-semibold">{p.type}</legend>
                <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" {...aria("type")}>
                  {TYPES.map((k) => (
                    <label
                      key={k}
                      className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm font-semibold transition-colors ${
                        type === k ? "border-navy bg-navy text-white" : "border-ink/20 text-ink hover:border-navy"
                      }`}
                    >
                      <input type="radio" name="tipo" value={k} checked={type === k} onChange={() => setType(k)} className="sr-only" />
                      {p.types[k]}
                    </label>
                  ))}
                </div>
                <Err id="e-type" msg={errors.type} />
              </fieldset>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="p-nombre" className="text-sm font-semibold">{p.name}</label>
                  <input id="p-nombre" name="nombre" autoComplete="name" className={field} {...aria("name")} />
                  <Err id="e-name" msg={errors.name} />
                </div>
                <div>
                  <label htmlFor="p-correo" className="text-sm font-semibold">{p.email}</label>
                  <input id="p-correo" name="correo" type="email" autoComplete="email" className={field} {...aria("email")} />
                  <Err id="e-email" msg={errors.email} />
                </div>
                <div>
                  <label htmlFor="p-telefono" className="text-sm font-semibold">{p.phone}</label>
                  <input id="p-telefono" name="telefono" type="tel" inputMode="tel" autoComplete="tel" className={field} />
                </div>
                <div>
                  <label htmlFor="p-estudiante" className="text-sm font-semibold">{p.student}</label>
                  <input id="p-estudiante" name="estudiante" className={field} />
                </div>
                <div>
                  <label htmlFor="p-grado" className="text-sm font-semibold">{p.grade}</label>
                  <select id="p-grado" name="grado" defaultValue="" className={field}>
                    <option value="">{p.gradePlaceholder}</option>
                    {t.grades.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="p-asunto" className="text-sm font-semibold">{p.subject}</label>
                  <input id="p-asunto" name="asunto" className={field} {...aria("subject")} />
                  <Err id="e-subject" msg={errors.subject} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="p-descripcion" className="text-sm font-semibold">{p.description}</label>
                  <textarea id="p-descripcion" name="descripcion" rows={5} className={`${field} py-3`} {...aria("description")} />
                  <Err id="e-description" msg={errors.description} />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 text-sm leading-relaxed text-ink">
                    <input type="checkbox" name="urgente" aria-describedby="h-urgente" className="mt-1 h-5 w-5 flex-none accent-red-600" />
                    <span>
                      <strong className="font-semibold">{p.urgent}</strong>
                      <span id="h-urgente" className="mt-0.5 block text-muted">{p.urgentHelp}</span>
                    </span>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="p-adjunto" className="text-sm font-semibold">{p.attachment}</label>
                  <input
                    id="p-adjunto"
                    name="adjunto"
                    type="file"
                    accept=".pdf,image/*"
                    aria-describedby="h-adjunto"
                    className="mt-2 block w-full text-sm text-muted file:mr-4 file:min-h-11 file:cursor-pointer file:rounded-full file:border-0 file:bg-paper-2 file:px-5 file:font-semibold file:text-ink"
                  />
                  <p id="h-adjunto" className="mt-1.5 text-xs text-muted">{p.attachmentHelp}</p>
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                  <input type="checkbox" name="acepta" className="mt-1 h-5 w-5 flex-none accent-[var(--navy)]" {...aria("consent")} />
                  <span>
                    {p.consent[0]}
                    <Link href={href(lang, "privacy")} className="font-semibold text-navy underline underline-offset-2">{p.consent[1]}</Link>
                    {p.consent[2]}
                  </span>
                </label>
                <Err id="e-consent" msg={errors.consent} />
              </div>

              <button type="submit" className="btn btn-primary mt-8 w-full">
                <Send size={18} aria-hidden /> {p.submit}
              </button>
            </form>
          )}
        </div>
      </section>

      <section id="consultar" className="section bg-ink text-white">
        <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
          <div>
            <p className="eyebrow text-gold">{p.lookupEyebrow}</p>
            <h2 className="h-section mt-5">{p.lookupTitle}</h2>
          </div>
          <div>
            <form onSubmit={onLookup} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label htmlFor="radicado" className="text-sm font-semibold text-white/80">{p.lookupLabel}</label>
                <input
                  id="radicado"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={p.lookupPlaceholder}
                  autoCapitalize="characters"
                  className="mt-2 block min-h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-base uppercase text-white outline-none placeholder:normal-case placeholder:text-white/40 focus:border-gold"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                <Search size={18} aria-hidden /> {p.lookupButton}
              </button>
            </form>

            <div aria-live="polite">
              {found === null && <p className="mt-6 rounded-xl bg-white/5 px-4 py-3 text-white/80">{p.lookupNotFound}</p>}
              {found && (
                <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
                  {[
                    [p.lookupLabel, found.id],
                    [p.lookupStatus, p.statuses[found.status]],
                    [p.lookupPriority, p.priorities[found.priority]],
                    [p.lookupCreated, formatDate(found.createdAt, lang)],
                    [p.lookupDue, formatDate(pqrsfDue(found).toISOString(), lang)],
                  ].map(([k, val], i) => (
                    <div key={k} className={`bg-ink p-5 ${i === 0 ? "sm:col-span-2" : ""}`}>
                      <dt className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">{k}</dt>
                      <dd className="mt-1 text-lg font-semibold">{val}</dd>
                    </div>
                  ))}
                  {found.answer && (
                    <div className="bg-ink p-5 sm:col-span-2">
                      <dt className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">{p.lookupAnswer}</dt>
                      <dd className="mt-1 text-white/85">{found.answer}</dd>
                    </div>
                  )}
                </dl>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
