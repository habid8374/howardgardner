"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Phone, Send } from "lucide-react";
import DemoNote from "./DemoNote";
import { ApiError, LIMITS, admissionsStore, type Admission } from "@/lib/records";
import { TEL_HREF, PHONE_DISPLAY, waLink } from "@/lib/site";
import { href, type Lang } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";

/* Proceso de admisión + preinscripción.
   La preinscripción se envía al servidor (/api/admisiones), se guarda en la base de datos
   y aparece en el panel del colegio (/admin).
   TODO(CLIENTE): confirmar pasos reales, documentos requeridos y fechas 2027. */

type Errors = Partial<Record<"name" | "phone" | "grade" | "consent", string>>;

export default function Admissions({ lang, t }: { lang: Lang; t: Pick<Dict, "admissions" | "demo"> }) {
  const a = t.admissions;
  const f = a.form;
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<Admission | null>(null);
  const [busy, setBusy] = useState(false);
  const [netError, setNetError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("nombre") || "").trim();
    const phone = String(data.get("telefono") || "").trim();
    const grade = String(data.get("grado") || "");
    const message = String(data.get("mensaje") || "").trim();
    const consent = data.get("acepta") === "on";

    const next: Errors = {};
    if (name.length < 3) next.name = f.errors.name;
    if (phone.replace(/\D/g, "").length < 7) next.phone = f.errors.phone;
    if (!grade) next.grade = f.errors.grade;
    if (!consent) next.consent = f.errors.consent;
    setErrors(next);
    if (Object.keys(next).length) {
      const first = e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }

    setBusy(true);
    setNetError(null);
    try {
      setSent(await admissionsStore.add({ lang, guardian: name, phone, grade, message, website: String(data.get("website") || "") }));
    } catch (err) {
      setNetError(err instanceof ApiError && err.status === 429 ? t.demo.rateError : t.demo.sendError);
      return;
    } finally {
      setBusy(false);
    }
    requestAnimationFrame(() => document.getElementById("preinscripcion")?.scrollIntoView({ block: "start" }));
  }

  const waText = (r: Admission) =>
    `${f.waIntro}\n${f.waNumber}: ${r.id}\n${f.waName}: ${r.guardian}\n${f.waPhone}: ${r.phone}\n${f.waGrade}: ${r.grade}` +
    (r.message ? `\n${f.waMessage}: ${r.message}` : "") +
    `\n${f.waConsent}`;

  const field =
    "mt-2 block w-full min-h-12 rounded-xl border border-ink/20 bg-white px-4 text-base text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-navy focus:shadow-[0_0_0_3px_rgba(18,36,90,0.15)]";
  const err = (id: string, msg?: string) => msg && <p id={id} className="mt-1.5 text-sm font-medium text-red-700">{msg}</p>;

  return (
    <section id="proceso" className="doodle-bg section bg-ink text-white">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow text-gold">{a.eyebrow}</p>
          <h2 className="h-section mt-5">{a.title}</h2>
          <p className="lead mt-6 max-w-lg text-white/75">{a.lead}</p>

          <ol className="mt-10 flex flex-col">
            {a.steps.map((s, i) => (
              <li key={s.t} className="grid grid-cols-[48px_1fr] gap-4 border-t border-white/12 py-6">
                <span className="h-display text-3xl text-gold">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-bold">{s.t}</h3>
                  <p className="mt-1 text-white/70">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <a href={TEL_HREF} className="link mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-white/85">
            <Phone size={16} aria-hidden /> {a.callPrompt} {PHONE_DISPLAY}
          </a>
        </div>

        {sent ? (
          <div id="preinscripcion" role="status" className="scroll-mt-24 rounded-[28px] bg-paper p-6 text-ink sm:p-10">
            <CheckCircle2 size={40} className="text-[#1fa855]" aria-hidden />
            <h3 className="h-display mt-5 text-[1.9rem]">{f.successTitle}</h3>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-muted">{f.successNumber}</p>
            <p className="h-display mt-1 text-[2.4rem] text-navy">{sent.id}</p>
            <p className="mt-4 text-muted">{f.successBody}</p>
            <div className="mt-8 flex flex-col gap-3">
              <a href={waLink(waText(sent))} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
                <MessageCircle size={18} aria-hidden /> {f.continueWa}
              </a>
              <button type="button" onClick={() => setSent(null)} className="btn btn-ghost on-light w-full text-ink">
                {f.another}
              </button>
            </div>
          </div>
        ) : (
        <form
          id="preinscripcion"
          onSubmit={onSubmit}
          noValidate
          className="scroll-mt-24 rounded-[28px] bg-paper p-6 text-ink sm:p-10"
          aria-labelledby="form-titulo"
        >
          <h3 id="form-titulo" className="h-display text-[1.9rem]">{f.title}</h3>
          <p className="mt-2 text-muted">{f.lead}</p>
          <DemoNote text={t.demo.note} badge={t.demo.badge} />

          <div className="mt-8 flex flex-col gap-5">
            {/* Trampa para robots (OWASP A06): campo invisible que una persona no llena */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
              <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>

            <div>
              <label htmlFor="nombre" className="text-sm font-semibold">{f.name}</label>
              <input id="nombre" name="nombre" autoComplete="name" maxLength={LIMITS.name} className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-nombre" : undefined} />
              {err("e-nombre", errors.name)}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="telefono" className="text-sm font-semibold">{f.phone}</label>
                <input id="telefono" name="telefono" type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} className={field} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "e-telefono" : undefined} />
                {err("e-telefono", errors.phone)}
              </div>
              <div>
                <label htmlFor="grado" className="text-sm font-semibold">{f.grade}</label>
                <select id="grado" name="grado" defaultValue="" className={field} aria-invalid={!!errors.grade} aria-describedby={errors.grade ? "e-grado" : undefined}>
                  <option value="" disabled>{f.gradePlaceholder}</option>
                  {f.grades.map((g) => <option key={g}>{g}</option>)}
                </select>
                {err("e-grado", errors.grade)}
              </div>
            </div>

            <div>
              <label htmlFor="mensaje" className="text-sm font-semibold">{f.message}</label>
              <textarea id="mensaje" name="mensaje" rows={3} maxLength={LIMITS.message} className={`${field} py-3`} />
            </div>

            <div>
              <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                <input type="checkbox" name="acepta" className="mt-1 h-5 w-5 flex-none accent-[var(--navy)]" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "e-acepta" : undefined} />
                <span>
                  {f.consent[0]}
                  <Link href={href(lang, "privacy")} className="font-semibold text-navy underline underline-offset-2">{f.consent[1]}</Link>
                  {f.consent[2]}
                </span>
              </label>
              {err("e-acepta", errors.consent)}
            </div>

            {netError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{netError}</p>}
            <button type="submit" disabled={busy} aria-busy={busy} className="btn btn-primary mt-2 w-full disabled:opacity-70">
              <Send size={18} aria-hidden /> {busy ? t.demo.sending : f.submit}
            </button>
          </div>
        </form>
        )}
      </div>
    </section>
  );
}
