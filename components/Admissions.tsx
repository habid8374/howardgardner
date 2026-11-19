"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, MessageCircle, Phone, Send } from "lucide-react";
import {
  ALLOWED_FILE_TYPES, ApiError, GUARDIAN_DOC_TYPES, LIMITS, MAX_FILE_MB, RELATIONS, SECTORS, SOURCES, STUDENT_DOC_TYPES,
  admissionsStore, ageAt, type CampusOption, type GuardianDocType, type Relation, type StudentDocType,
} from "@/lib/records";
import { TEL_HREF, PHONE_DISPLAY, waLink } from "@/lib/site";
import { href, type Lang } from "@/lib/i18n";
import type { CampusFormText, Dict } from "@/lib/dictionaries";

/* Proceso de admisión + preinscripción formal en 4 pasos:
   1) aspirante (identificación), 2) procedencia escolar, 3) acudiente, 4) documentos opcionales y autorización.
   Se envía al servidor (/api/admisiones), que vuelve a validar todo; los adjuntos van a almacenamiento privado.
   No se piden datos sensibles (salud, discapacidad, etnia): se tratan en la matrícula con autorización especial.
   TODO(CLIENTE): confirmar campos y documentos con el colegio. */

type Form = {
  campus: string; grade: string;
  firstNames: string; lastNames: string; docType: StudentDocType | ""; docNumber: string; birthDate: string; sex: "F" | "M" | ""; nationality: string;
  firstTime: boolean; school: string; city: string; sector: "" | (typeof SECTORS)[number]; lastGrade: string; reason: string;
  guardianName: string; relation: Relation | ""; gDocType: GuardianDocType | ""; gDocNumber: string; phone: string; email: string; address: string; gCity: string;
  secondName: string; secondRelation: Relation | ""; secondPhone: string;
  siblings: string; source: "" | (typeof SOURCES)[number]; message: string;
  consent: boolean; truth: boolean;
};
type Key = keyof Form | "documento" | "boletin";
type Errors = Partial<Record<Key, string>>;

const EMPTY: Form = {
  campus: "", grade: "", firstNames: "", lastNames: "", docType: "", docNumber: "", birthDate: "", sex: "", nationality: "",
  firstTime: false, school: "", city: "", sector: "", lastGrade: "", reason: "",
  guardianName: "", relation: "", gDocType: "CC", gDocNumber: "", phone: "", email: "", address: "", gCity: "",
  secondName: "", secondRelation: "", secondPhone: "", siblings: "", source: "", message: "", consent: false, truth: false,
};

const DOC_RE = /^[A-Za-z0-9-]{4,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneOk = (v: string) => v.replace(/\D/g, "").length >= 7;

export default function Admissions({ lang, t, campuses }: { lang: Lang; t: Pick<Dict, "admissions" | "demo"> & { campuses: CampusFormText }; campuses: CampusOption[] }) {
  const a = t.admissions;
  const f = a.form;
  const c = t.campuses;
  const [v, setV] = useState<Form>({ ...EMPTY, nationality: f.student.nationalityDefault });
  const [files, setFiles] = useState<{ documento: File | null; boletin: File | null }>({ documento: null, boletin: null });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<{ id: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [netError, setNetError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof Form>(k: K, val: Form[K]) => { setV((s) => ({ ...s, [k]: val })); setErrors((e) => ({ ...e, [k]: undefined })); };

  // Enlace "Preinscribirme para esta sede" (?sede=...): deja la sede elegida
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("sede");
    if (s && campuses.some((x) => x.id === s)) setV((p) => ({ ...p, campus: s }));
  }, [campuses]);

  // Al recibir la confirmación, llevar la vista a la tarjeta con el número de solicitud
  useEffect(() => {
    if (sent) document.getElementById("preinscripcion")?.scrollIntoView({ block: "start" });
  }, [sent]);

  const age = v.birthDate ? ageAt(v.birthDate) : null;

  /* Validación de cada paso (el servidor vuelve a validar todo) */
  function check(n: number): Errors {
    const e: Errors = {};
    const req = (k: keyof Form, ok: boolean, msg = f.errors.required) => { if (!ok) e[k] = msg; };
    if (n === 0) {
      req("campus", campuses.some((x) => x.id === v.campus), c.error);
      req("grade", !!v.grade, f.errors.grade);
      req("firstNames", v.firstNames.trim().length >= 2);
      req("lastNames", v.lastNames.trim().length >= 2);
      req("docType", !!v.docType);
      req("docNumber", DOC_RE.test(v.docNumber.trim()), f.errors.doc);
      req("birthDate", age !== null && age >= 2 && age <= 21, f.errors.birth);
      req("sex", !!v.sex);
      req("nationality", v.nationality.trim().length >= 2);
    }
    if (n === 1 && !v.firstTime) {
      req("school", v.school.trim().length >= 3);
      req("city", v.city.trim().length >= 2);
      req("lastGrade", !!v.lastGrade);
    }
    if (n === 2) {
      req("guardianName", v.guardianName.trim().length >= 5, f.errors.name);
      req("relation", !!v.relation);
      req("gDocType", !!v.gDocType);
      req("gDocNumber", DOC_RE.test(v.gDocNumber.trim()), f.errors.doc);
      req("phone", phoneOk(v.phone), f.errors.phone);
      req("email", EMAIL_RE.test(v.email.trim()), f.errors.email);
      req("address", v.address.trim().length >= 5);
      req("gCity", v.gCity.trim().length >= 2);
      if (v.secondPhone && !phoneOk(v.secondPhone)) e.secondPhone = f.errors.phone;
    }
    if (n === 3) {
      for (const k of ["documento", "boletin"] as const) {
        const file = files[k];
        if (file && (!ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_MB * 1024 * 1024)) e[k] = f.errors.file;
      }
      req("consent", v.consent, f.errors.consent);
      req("truth", v.truth, f.errors.truth);
    }
    return e;
  }

  const focusFirstError = () => requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
  const goTo = (n: number) => {
    setStep(n);
    requestAnimationFrame(() => document.getElementById("preinscripcion")?.scrollIntoView({ block: "start", behavior: "smooth" }));
  };

  function next() {
    const e = check(step);
    setErrors(e);
    if (Object.keys(e).length) return focusFirstError();
    goTo(step + 1);
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (step < 3) return next();
    // Revisar todos los pasos antes de enviar
    for (let n = 0; n <= 3; n++) {
      const e = check(n);
      if (Object.keys(e).length) { setErrors(e); if (n !== step) goTo(n); return focusFirstError(); }
    }
    const datos = {
      lang, campus: v.campus, grade: v.grade,
      student: { firstNames: v.firstNames, lastNames: v.lastNames, docType: v.docType, docNumber: v.docNumber.trim(), birthDate: v.birthDate, sex: v.sex, nationality: v.nationality },
      previous: { firstTime: v.firstTime, school: v.firstTime ? "" : v.school, city: v.firstTime ? "" : v.city, sector: v.firstTime ? "" : v.sector, lastGrade: v.firstTime ? "" : v.lastGrade, reason: v.firstTime ? "" : v.reason },
      guardianName: v.guardianName, phone: v.phone,
      guardian: { relation: v.relation, docType: v.gDocType, docNumber: v.gDocNumber.trim(), email: v.email.trim(), address: v.address, city: v.gCity },
      second: { name: v.secondName, relation: v.secondRelation, phone: v.secondPhone },
      siblings: v.siblings, source: v.source, message: v.message, consent: v.consent, truth: v.truth,
      website: String(new FormData(ev.currentTarget).get("website") || ""),
    };
    const body = new FormData();
    body.set("datos", JSON.stringify(datos));
    if (files.documento) body.set("documento", files.documento);
    if (files.boletin) body.set("boletin", files.boletin);

    setBusy(true);
    setNetError(null);
    try {
      setSent(await admissionsStore.add(body));
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 0;
      if (status === 413 || status === 415) {
        const k = (err as ApiError).data.fields as string[] | undefined;
        setErrors({ [(k?.[0] as Key) ?? "documento"]: f.errors.file });
      } else setNetError(status === 429 ? t.demo.rateError : status === 400 ? f.errors.server : t.demo.sendError);
    } finally {
      setBusy(false);
    }
  }

  const waText = (id: string) =>
    `${f.waIntro}\n${f.waNumber}: ${id}\n${c.label}: ${campuses.find((x) => x.id === v.campus)?.name ?? v.campus}\n${f.waStudent}: ${v.firstNames} ${v.lastNames}\n${f.waGrade}: ${v.grade}\n${f.waName}: ${v.guardianName}\n${f.waPhone}: ${v.phone}`;

  const field =
    "mt-2 block w-full min-h-12 rounded-xl border border-ink/20 bg-white px-4 text-base text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-navy focus:shadow-[0_0_0_3px_rgba(18,36,90,0.15)] aria-[invalid=true]:border-red-600";
  const err = (k: Key) => errors[k] && <p id={`e-${k}`} className="mt-1.5 text-sm font-medium text-red-700">{errors[k]}</p>;
  const aria = (k: Key) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `e-${k}` : undefined });

  const input = (k: keyof Form, label: string, opts: { type?: string; auto?: string; max?: number; wide?: boolean; help?: string; placeholder?: string; inputMode?: "tel" | "email" | "text" } = {}) => (
    <div className={opts.wide ? "sm:col-span-2" : ""}>
      <label htmlFor={`p-${k}`} className="text-sm font-semibold">{label}</label>
      <input
        id={`p-${k}`} type={opts.type ?? "text"} autoComplete={opts.auto ?? "off"} maxLength={opts.max ?? 120} placeholder={opts.placeholder}
        inputMode={opts.inputMode} value={String(v[k] ?? "")} onChange={(e) => set(k, e.target.value as never)} className={field} {...aria(k)}
      />
      {opts.help && <p className="mt-1 text-xs text-muted">{opts.help}</p>}
      {err(k)}
    </div>
  );
  const select = (k: keyof Form, label: string, options: [string, string][], opts: { wide?: boolean; placeholder?: string } = {}) => (
    <div className={opts.wide ? "sm:col-span-2" : ""}>
      <label htmlFor={`p-${k}`} className="text-sm font-semibold">{label}</label>
      <select id={`p-${k}`} value={String(v[k] ?? "")} onChange={(e) => set(k, e.target.value as never)} className={field} {...aria(k)}>
        <option value="">{opts.placeholder ?? "—"}</option>
        {options.map(([val, txt]) => <option key={val} value={val}>{txt}</option>)}
      </select>
      {err(k)}
    </div>
  );

  const totalSteps = f.steps.length;

  return (
    <section id="proceso" className="doodle-bg section bg-ink text-white">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
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
            <CheckCircle2 size={40} className="text-[#108043]" aria-hidden />
            <h3 className="h-display mt-5 text-[1.9rem]">{f.successTitle}</h3>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-muted">{f.successNumber}</p>
            <p className="h-display mt-1 text-[2.4rem] text-navy">{sent.id}</p>
            <p className="mt-4 text-muted">{f.successBody}</p>
            <p className="mt-4 flex gap-3 rounded-xl bg-paper-2 px-4 py-3 text-sm text-ink"><FileText size={18} className="mt-0.5 flex-none text-navy" aria-hidden /> {f.successDocs}</p>
            <div className="mt-8 flex flex-col gap-3">
              <a href={waLink(waText(sent.id))} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
                <MessageCircle size={18} aria-hidden /> {f.continueWa}
              </a>
              <button type="button" onClick={() => { setSent(null); setV({ ...EMPTY, nationality: f.student.nationalityDefault }); setFiles({ documento: null, boletin: null }); setStep(0); }} className="btn btn-ghost on-light w-full text-ink">
                {f.another}
              </button>
            </div>
          </div>
        ) : (
          <form
            id="preinscripcion"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            className="scroll-mt-24 rounded-[28px] bg-paper p-5 text-ink sm:p-10"
            aria-labelledby="form-titulo"
          >
            <h3 id="form-titulo" className="h-display text-[1.9rem]">{f.title}</h3>
            <p className="mt-2 text-muted">{f.lead}</p>

            {/* Pasos */}
            <ol className="mt-6 grid grid-cols-4 gap-2" aria-label={f.stepLabel.replace("{n}", String(step + 1)).replace("{t}", String(totalSteps))}>
              {f.steps.map((s, i) => (
                <li key={s} className="flex flex-col gap-1.5">
                  <span className={`h-1.5 rounded-full ${i <= step ? "bg-gold" : "bg-ink/10"}`} />
                  <span className={`text-[11px] font-semibold sm:text-xs ${i === step ? "text-navy" : "text-muted"}`} aria-current={i === step ? "step" : undefined}>{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-muted">{f.required}</p>

            {/* Trampa para robots (OWASP A06) */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
              <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>

            {step === 0 && (
              <fieldset className="mt-6">
                <legend className="text-lg font-bold text-navy">{f.student.title}</legend>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {select("campus", c.labelInterest + " *", campuses.map((s) => [s.id, s.name + (s.soon ? ` (${c.soonTag.toLowerCase()})` : "")]), { placeholder: c.placeholder })}
                  {select("grade", f.grade, f.grades.map((g) => [g, g]), { placeholder: f.gradePlaceholder })}
                  {input("firstNames", f.student.firstNames, { auto: "off", max: 60 })}
                  {input("lastNames", f.student.lastNames, { auto: "off", max: 60 })}
                  {select("docType", f.student.docType, STUDENT_DOC_TYPES.map((d) => [d, f.docTypes[d]]))}
                  {input("docNumber", f.student.docNumber, { max: 20, help: f.student.docHelp })}
                  <div>
                    <label htmlFor="p-birthDate" className="text-sm font-semibold">{f.student.birthDate}</label>
                    <input id="p-birthDate" type="date" value={v.birthDate} onChange={(e) => set("birthDate", e.target.value)} className={field} {...aria("birthDate")}
                      max={new Date().toISOString().slice(0, 10)} />
                    {age !== null && age >= 0 && <p className="mt-1 text-xs font-semibold text-navy">{f.student.age.replace("{n}", String(age))}</p>}
                    {err("birthDate")}
                  </div>
                  {select("sex", f.student.sex, [["F", f.student.sexes.F], ["M", f.student.sexes.M]])}
                  {input("nationality", f.student.nationality, { max: 40 })}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset className="mt-6">
                <legend className="text-lg font-bold text-navy">{f.previous.title}</legend>
                <label className="mt-4 flex items-start gap-3 rounded-xl bg-white p-4 text-sm ring-1 ring-line">
                  <input type="checkbox" checked={v.firstTime} onChange={(e) => set("firstTime", e.target.checked)} className="mt-0.5 h-5 w-5 flex-none accent-[var(--navy)]" />
                  <span className="font-semibold">{f.previous.firstTime}</span>
                </label>
                {!v.firstTime && (
                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {input("school", f.previous.school, { wide: true })}
                    {input("city", f.previous.city, { max: 80 })}
                    {select("sector", f.previous.sector, SECTORS.map((s) => [s, f.previous.sectors[s]]))}
                    {select("lastGrade", f.previous.lastGrade, f.grades.map((g) => [g, g]))}
                    {input("reason", f.previous.reason, { wide: true, max: 300 })}
                  </div>
                )}
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className="mt-6">
                <legend className="text-lg font-bold text-navy">{f.guardian.title}</legend>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {input("guardianName", f.guardian.name, { auto: "name", max: LIMITS.name, wide: true })}
                  {select("relation", f.guardian.relation, RELATIONS.map((r) => [r, f.relations[r]]))}
                  {select("gDocType", f.guardian.docType, GUARDIAN_DOC_TYPES.map((d) => [d, f.guardianDocTypes[d]]))}
                  {input("gDocNumber", f.guardian.docNumber, { max: 20 })}
                  {input("phone", f.guardian.phone, { type: "tel", auto: "tel", inputMode: "tel", max: LIMITS.phone })}
                  {input("email", f.guardian.email, { type: "email", auto: "email", inputMode: "email", max: LIMITS.email, wide: true })}
                  {input("address", f.guardian.address, { auto: "street-address", max: 150 })}
                  {input("gCity", f.guardian.city, { max: 80 })}
                </div>
                <details className="mt-6 rounded-xl bg-white p-4 ring-1 ring-line" open={!!(v.secondName || v.secondPhone)}>
                  <summary className="cursor-pointer text-sm font-bold text-navy">{f.guardian.second}</summary>
                  <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {input("secondName", f.guardian.secondName, { max: LIMITS.name, wide: true })}
                    {select("secondRelation", f.guardian.secondRelation, RELATIONS.map((r) => [r, f.relations[r]]))}
                    {input("secondPhone", f.guardian.secondPhone, { type: "tel", inputMode: "tel", max: LIMITS.phone })}
                  </div>
                </details>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {input("siblings", f.extra.siblings, { wide: true, max: 150, placeholder: f.extra.siblingsPlaceholder })}
                  {select("source", f.extra.source, SOURCES.map((s) => [s, f.extra.sources[s]]), { wide: true })}
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset className="mt-6">
                <legend className="text-lg font-bold text-navy">{f.docs.title}</legend>
                <p className="mt-1 text-sm text-muted">{f.docs.help}</p>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  {(["documento", "boletin"] as const).map((k) => (
                    <div key={k} className="rounded-xl bg-white p-4 ring-1 ring-line">
                      <label htmlFor={`p-${k}`} className="text-sm font-semibold">{f.docs[k]}</label>
                      <input
                        id={`p-${k}`} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" {...aria(k)}
                        onChange={(e) => { setFiles((s) => ({ ...s, [k]: e.target.files?.[0] ?? null })); setErrors((x) => ({ ...x, [k]: undefined })); }}
                        className="mt-2 block w-full text-sm text-muted file:mr-4 file:min-h-11 file:cursor-pointer file:rounded-full file:border-0 file:bg-paper-2 file:px-5 file:font-semibold file:text-ink"
                      />
                      {err(k)}
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <label htmlFor="p-message" className="text-sm font-semibold">{f.extra.message}</label>
                  <textarea id="p-message" rows={3} maxLength={LIMITS.message} value={v.message} onChange={(e) => set("message", e.target.value)} className={`${field} py-3`} />
                </div>

                {/* Resumen */}
                <div className="mt-6 rounded-xl bg-paper-2 p-4 text-sm">
                  <p className="font-bold text-navy">{f.summary}</p>
                  <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
                    <div><dt className="inline text-muted">{f.waStudent}: </dt><dd className="inline font-semibold">{v.firstNames} {v.lastNames}</dd></div>
                    <div><dt className="inline text-muted">{f.waGrade}: </dt><dd className="inline font-semibold">{v.grade}</dd></div>
                    <div><dt className="inline text-muted">{c.label}: </dt><dd className="inline font-semibold">{campuses.find((x) => x.id === v.campus)?.name}</dd></div>
                    <div><dt className="inline text-muted">{f.waName}: </dt><dd className="inline font-semibold">{v.guardianName}</dd></div>
                  </dl>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                    <input type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-1 h-5 w-5 flex-none accent-[var(--navy)]" {...aria("consent")} />
                    <span>
                      {f.consent[0]}
                      <Link href={href(lang, "privacy")} className="font-semibold text-navy underline underline-offset-2">{f.consent[1]}</Link>
                      {f.consent[2]}
                    </span>
                  </label>
                  {err("consent")}
                  <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                    <input type="checkbox" checked={v.truth} onChange={(e) => set("truth", e.target.checked)} className="mt-1 h-5 w-5 flex-none accent-[var(--navy)]" {...aria("truth")} />
                    <span>{f.truth}</span>
                  </label>
                  {err("truth")}
                </div>
              </fieldset>
            )}

            {netError && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{netError}</p>}

            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <button type="button" onClick={() => { setErrors({}); goTo(step - 1); }} className="btn btn-ghost on-light flex-none text-ink">
                  <ArrowLeft size={18} aria-hidden /> <span className="hidden sm:inline">{f.back}</span>
                </button>
              )}
              {step < 3 ? (
                <button type="submit" className="btn btn-primary flex-1">
                  {f.next} <ArrowRight size={18} aria-hidden />
                </button>
              ) : (
                <button type="submit" disabled={busy} aria-busy={busy} className="btn btn-primary flex-1 disabled:opacity-70">
                  <Send size={18} aria-hidden /> {busy ? t.demo.sending : f.submit}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
