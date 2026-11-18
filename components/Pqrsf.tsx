"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileDown, Search, Send } from "lucide-react";
import { downloadPqrsfPdf } from "@/lib/pqrsf-pdf";
import DemoNote from "./DemoNote";
import { href, type Lang } from "@/lib/i18n";
import type { CampusFormText, Dict } from "@/lib/dictionaries";
import { ALLOWED_FILE_TYPES, ApiError, type CampusOption, LIMITS, MAX_FILE_MB, PQRSF_DAYS, formatDate, pqrsfDue, pqrsfStore, type Pqrsf as Row, type PqrsfPublic, type PqrsfType } from "@/lib/records";

/* PQRSF: se envía al servidor (/api/pqrsf), se guarda en la base de datos y aparece en el panel del colegio (/admin). */

type Props = { lang: Lang; t: { pqrsf: Dict["pqrsf"]; demo: Dict["demo"]; grades: string[]; campuses: CampusFormText }; campuses: CampusOption[] };
type Errors = Partial<Record<"type" | "campus" | "name" | "email" | "subject" | "description" | "consent" | "file", string>>;

const TYPES: PqrsfType[] = ["peticion", "queja", "reclamo", "sugerencia", "felicitacion"];
const days = (s: string) => s.replace("{DAYS}", String(PQRSF_DAYS));

const field =
  "mt-2 block w-full min-h-12 rounded-xl border border-ink/20 bg-white px-4 text-base text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-navy focus:shadow-[0_0_0_3px_rgba(18,36,90,0.15)]";

function Err({ id, msg }: { id: string; msg?: string }) {
  return msg ? <p id={id} className="mt-1.5 text-sm font-medium text-red-700">{msg}</p> : null;
}

export default function Pqrsf({ lang, t, campuses }: Props) {
  const p = t.pqrsf;
  const [type, setType] = useState<PqrsfType | "">("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<{ id: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [netError, setNetError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [lookEmail, setLookEmail] = useState("");
  const [looking, setLooking] = useState(false);
  const [found, setFound] = useState<PqrsfPublic | null | undefined>(undefined);
  const [pdfBusy, setPdfBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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
    if (!campuses.some((x) => x.id === v("sede"))) next.campus = t.campuses.error;
    if (input.name.length < 3) next.name = p.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) next.email = p.errors.email;
    if (input.subject.length < 3) next.subject = p.errors.subject;
    if (input.description.length < 20) next.description = p.errors.description;
    if (d.get("acepta") !== "on") next.consent = p.errors.consent;
    if (file instanceof File && file.size > 0 && (!ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_MB * 1024 * 1024)) {
      next.file = p.errors.file;
    }
    setErrors(next);
    if (Object.keys(next).length) {
      e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    // Se envía el formulario completo (con el adjunto) al servidor
    d.set("lang", lang);
    if (!(file instanceof File) || file.size === 0) d.delete("adjunto");
    setBusy(true);
    setNetError(null);
    try {
      setSent(await pqrsfStore.add(d));
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 0;
      if (status === 413 || status === 415) setErrors({ file: p.errors.file });
      else setNetError(status === 429 ? t.demo.rateError : t.demo.sendError);
      return;
    } finally {
      setBusy(false);
    }
    requestAnimationFrame(() => document.getElementById("pqrsf-ok")?.scrollIntoView({ block: "center" }));
    setType("");
  }

  async function onLookup(e: React.FormEvent) {
    e.preventDefault();
    setLooking(true);
    try {
      setFound(await pqrsfStore.find(query, lookEmail));
    } catch {
      setFound(null);
    } finally {
      setLooking(false);
    }
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

              {/* Trampa para robots (OWASP A06): campo invisible que una persona no llena */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
              </div>
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
                  <label htmlFor="p-sede" className="text-sm font-semibold">{t.campuses.label}</label>
                  <select id="p-sede" name="sede" defaultValue="" className={field} {...aria("campus")}>
                    <option value="" disabled>{t.campuses.placeholder}</option>
                    {campuses.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}{s.soon ? ` (${t.campuses.soonTag.toLowerCase()})` : ""}</option>
                    ))}
                  </select>
                  <Err id="e-campus" msg={errors.campus} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="p-nombre" className="text-sm font-semibold">{p.name}</label>
                  <input id="p-nombre" name="nombre" autoComplete="name" maxLength={LIMITS.name} className={field} {...aria("name")} />
                  <Err id="e-name" msg={errors.name} />
                </div>
                <div>
                  <label htmlFor="p-correo" className="text-sm font-semibold">{p.email}</label>
                  <input id="p-correo" name="correo" type="email" autoComplete="email" maxLength={LIMITS.email} className={field} {...aria("email")} />
                  <Err id="e-email" msg={errors.email} />
                </div>
                <div>
                  <label htmlFor="p-telefono" className="text-sm font-semibold">{p.phone}</label>
                  <input id="p-telefono" name="telefono" type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} className={field} />
                </div>
                <div>
                  <label htmlFor="p-estudiante" className="text-sm font-semibold">{p.student}</label>
                  <input id="p-estudiante" name="estudiante" maxLength={LIMITS.name} className={field} />
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
                  <input id="p-asunto" name="asunto" maxLength={LIMITS.subject} className={field} {...aria("subject")} />
                  <Err id="e-subject" msg={errors.subject} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="p-descripcion" className="text-sm font-semibold">{p.description}</label>
                  <textarea id="p-descripcion" name="descripcion" rows={5} maxLength={LIMITS.description} className={`${field} py-3`} {...aria("description")} />
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
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    {...aria("file")}
                    aria-describedby="h-adjunto"
                    className="mt-2 block w-full text-sm text-muted file:mr-4 file:min-h-11 file:cursor-pointer file:rounded-full file:border-0 file:bg-paper-2 file:px-5 file:font-semibold file:text-ink"
                  />
                  <p id="h-adjunto" className="mt-1.5 text-xs text-muted">{p.attachmentHelp}</p>
                  <Err id="e-file" msg={errors.file} />
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

              {netError && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{netError}</p>}
              <button type="submit" disabled={busy} aria-busy={busy} className="btn btn-primary mt-8 w-full disabled:opacity-70">
                <Send size={18} aria-hidden /> {busy ? t.demo.sending : p.submit}
              </button>
            </form>
          )}
        </div>
      </section>

      <section id="consultar" className="doodle-bg section bg-ink text-white">
        <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
          <div>
            <p className="eyebrow text-gold">{p.lookupEyebrow}</p>
            <h2 className="h-section mt-5">{p.lookupTitle}</h2>
            <p className="mt-5 max-w-md text-white/70">{p.lookupHelp}</p>
          </div>
          <div>
            <form onSubmit={onLookup} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div>
                <label htmlFor="radicado" className="text-sm font-semibold text-white/80">{p.lookupLabel}</label>
                <input
                  id="radicado"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={p.lookupPlaceholder}
                  autoCapitalize="characters"
                  maxLength={30}
                  required
                  className="mt-2 block min-h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-base uppercase text-white outline-none placeholder:normal-case placeholder:text-white/40 focus:border-gold"
                />
              </div>
              <div>
                <label htmlFor="radicado-correo" className="text-sm font-semibold text-white/80">{p.lookupEmail}</label>
                <input
                  id="radicado-correo"
                  type="email"
                  autoComplete="email"
                  value={lookEmail}
                  onChange={(e) => setLookEmail(e.target.value)}
                  maxLength={LIMITS.email}
                  required
                  className="mt-2 block min-h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-base text-white outline-none placeholder:text-white/40 focus:border-gold"
                />
              </div>
              <button type="submit" disabled={looking} aria-busy={looking} className="btn btn-primary disabled:opacity-70">
                <Search size={18} aria-hidden /> {p.lookupButton}
              </button>
            </form>

            <div aria-live="polite">
              {found === null && <p className="mt-6 rounded-xl bg-white/5 px-4 py-3 text-white/80">{p.lookupNotFound}</p>}
              {found && (
                <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
                  {[
                    [p.lookupLabel, found.id],
                    [t.campuses.label, campuses.find((x) => x.id === found.campus)?.name ?? found.campus],
                    [p.lookupStatus, p.statuses[found.status]],
                    [p.lookupPriority, p.priorities[found.priority]],
                    [p.lookupCreated, formatDate(found.createdAt, lang)],
                    found.answer
                      ? [p.lookupAnswered, formatDate(found.answeredAt ?? found.createdAt, lang)]
                      : [p.lookupDue, formatDate(pqrsfDue(found).toISOString(), lang)],
                  ].map(([k, val]) => (
                    <div key={k} className="bg-ink p-5">
                      <dt className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">{k}</dt>
                      <dd className="mt-1 text-lg font-semibold">{val}</dd>
                    </div>
                  ))}
                  {found.answer && (
                    <div className="bg-ink p-5 sm:col-span-2">
                      <dt className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">{p.lookupAnswer}</dt>
                      <dd className="mt-1 text-white/85">{found.answer}</dd>
                      <dd className="mt-5">
                        <button
                          type="button"
                          disabled={pdfBusy}
                          onClick={async () => {
                            setPdfBusy(true);
                            try { await downloadPqrsfPdf(found as Row, lang); } finally { setPdfBusy(false); }
                          }}
                          className="btn btn-primary !min-h-11 !text-sm disabled:opacity-70"
                        >
                          <FileDown size={18} aria-hidden /> {pdfBusy ? p.pdfLoading : p.lookupPdf}
                        </button>
                      </dd>
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
