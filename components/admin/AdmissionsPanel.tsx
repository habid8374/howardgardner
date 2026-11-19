"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Download, MessageCircle, Paperclip, Phone, Search } from "lucide-react";
import { ADMISSION_STATUSES, LIMITS, admissionsStore, ageAt, clean, formatDate, type Admission, type AdmissionStatus } from "@/lib/records";
import { downloadXlsx } from "@/lib/xlsx-export";

const save = (p: Promise<unknown>, msg: string) => p.catch(() => window.alert(msg));
import type { AdminDict } from "@/lib/dictionaries/admin";
import { Badge, Drawer, HistoryList, InfoGrid, Kpi, SampleTag, input } from "./ui";

type Lang = "es" | "en";
const IN_PROCESS: AdmissionStatus[] = ["contactada", "visita", "evaluacion"];

const toPhone = (p: string) => {
  const digits = p.replace(/\D/g, "");
  return digits.startsWith("57") ? digits : `57${digits}`;
};

export default function AdmissionsPanel({ rows, a: d, lang, userName, campusLabel, campusNames, canEdit, canExport }: { rows: Admission[]; a: AdminDict; lang: Lang; userName: string; campusLabel: string | null; campusNames: Record<string, string>; canEdit: boolean; canExport: boolean }) {
  const a = d.admissions;
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | AdmissionStatus>("");
  const [grade, setGrade] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const grades = useMemo(() => Array.from(new Set(rows.map((r) => r.grade))), [rows]);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!status || r.status === status) &&
        (!grade || r.grade === grade) &&
        (!term || [r.id, r.guardian, r.phone, r.studentName, r.studentDoc].some((v) => (v ?? "").toLowerCase().includes(term)))
    );
  }, [rows, q, status, grade]);

  // Mismo documento del aspirante en más de una preinscripción: posible duplicado
  const dupes = useMemo(() => {
    const count = new Map<string, number>();
    for (const r of rows) if (r.studentDoc) count.set(r.studentDoc, (count.get(r.studentDoc) ?? 0) + 1);
    return new Set([...count].filter(([, n]) => n > 1).map(([k]) => k));
  }, [rows]);
  const isDupe = (r: Admission) => !!r.studentDoc && dupes.has(r.studentDoc);
  const ageOf = (r: Admission) => (r.details.student?.birthDate ? ageAt(r.details.student.birthDate) : null);

  const current = rows.find((r) => r.id === openId) ?? null;

  function exportCsv() {
    const now = new Date();
    const widths = [17, 19, 16, 12, 28, 14, 16, 13, 7, 11, 28, 16, 12, 26, 13, 16, 15, 28, 28, 16, 22, 36, 40];
    return downloadXlsx({
      filename: `${a.csvName}-${now.toISOString().slice(0, 10)}.xlsx`,
      sheet: a.sheet,
      title: campusLabel ? `${a.reportTitle} · ${campusLabel}` : a.reportTitle,
      meta: `${d.xlsx.meta(formatDate(now.toISOString(), lang, true), userName, filtered.length)}${filtered.length !== rows.length ? ` (${d.xlsx.filtered})` : ""}`,
      summary: d.xlsx.summaryAdmissions(filtered.length, filtered.filter((r) => r.status === "nueva").length, filtered.filter((r) => r.status === "matriculado").length),
      columns: a.csv.map((header, i) => ({ header, width: widths[i], wrap: [10, 18, 20, 21, 22].includes(i), date: i === 1 ? "datetime" : i === 7 ? "date" : undefined, center: [3, 5, 8, 9].includes(i) })),
      rows: filtered.map((r) => {
        const s = r.details.student; const p = r.details.previous; const g = r.details.guardian;
        return [
          r.id, new Date(r.createdAt), campusNames[r.campus] ?? r.campus, r.grade, r.studentName,
          s ? a.docTypes[s.docType] ?? s.docType : "", r.studentDoc, s?.birthDate ? new Date(s.birthDate + "T00:00:00") : null, ageOf(r) ?? "",
          s ? a.sexes[s.sex] ?? s.sex : "", p?.firstTime ? a.f.firstTime : p?.school ?? "", p?.city ?? "", p?.lastGrade ?? "",
          r.guardian, g ? a.relations[g.relation] ?? g.relation : "", g ? `${g.docType} ${g.docNumber}` : "", r.phone, g?.email ?? "",
          g ? [g.address, g.city].filter(Boolean).join(", ") : "", a.statuses[r.status],
          r.files.map((x) => a.f[x.kind]).join(", "), r.message,
          r.notes.map((n) => `${formatDate(n.at, lang)}: ${n.text}${n.by ? ` (${n.by})` : ""}`).join("\n"),
        ];
      }),
      tone: (ri, ci) => {
        if (ci === 0) return "strong";
        if (ci === 6 && isDupe(filtered[ri])) return "warning";
        if (ci !== 19) return undefined;
        const s = filtered[ri].status;
        return s === "nueva" ? "soft" : s === "admitido" || s === "matriculado" ? "ok" : s === "no_admitido" ? "danger" : undefined;
      },
      footer: { ...d.xlsx },
    });
  }

  const kpi = (s: AdmissionStatus | "") => () => setStatus(status === s ? "" : s);

  return (
    <section aria-labelledby="t-admisiones">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 id="t-admisiones" className="h-display text-[2.2rem] text-ink">{a.title}</h1>
          <p className="mt-1 text-muted">{a.lead}</p>
        </div>
        {canExport && <button type="button" onClick={exportCsv} className="btn btn-primary !min-h-11 !text-sm">
          <Download size={16} aria-hidden /> {d.download} ({filtered.length})
        </button>}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label={a.kpis.total} value={rows.length} />
        <Kpi label={a.kpis.new} value={rows.filter((r) => r.status === "nueva").length} tone="warn" onClick={kpi("nueva")} active={status === "nueva"} />
        <Kpi label={a.kpis.inProcess} value={rows.filter((r) => IN_PROCESS.includes(r.status)).length} />
        <Kpi label={a.kpis.enrolled} value={rows.filter((r) => r.status === "matriculado").length} tone="ok" onClick={kpi("matriculado")} active={status === "matriculado"} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 ring-1 ring-line md:grid-cols-[1.6fr_1fr_1fr]">
        <label className="relative">
          <span className="sr-only">{d.search}</span>
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={a.searchPlaceholder} className={`${input} pl-10`} />
        </label>
        <label>
          <span className="sr-only">{d.status}</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as AdmissionStatus | "")} className={input}>
            <option value="">{a.allStatuses}</option>
            {ADMISSION_STATUSES.map((s) => <option key={s} value={s}>{a.statuses[s]}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">{a.cols.grade}</span>
          <select value={grade} onChange={(e) => setGrade(e.target.value)} className={input}>
            <option value="">{a.allGrades}</option>
            {grades.map((g) => <option key={g}>{g}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-4 hidden overflow-x-auto rounded-2xl bg-white ring-1 ring-line md:block">
        <table className="w-full min-w-[760px] text-left text-[0.92rem]">
          <thead className="bg-paper-2 text-xs uppercase tracking-[0.1em] text-muted">
            <tr>
              {[a.cols.id, a.cols.date, a.cols.student, a.cols.guardian, a.cols.grade, a.cols.status, ""].map((h, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-line transition-colors hover:bg-paper">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{r.id}<span className="mt-0.5 block font-sans text-[11px] text-muted">{campusNames[r.campus]}</span></td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(r.createdAt, lang)}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold">{r.studentName || "—"}</span>{r.sample && <SampleTag label={d.sample} />}
                  <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                    {r.studentDoc}{ageOf(r) !== null && ` · ${ageOf(r)} ${a.f.years}`}
                    {isDupe(r) && <span title={a.duplicateHelp} className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-1.5 font-semibold text-ink"><AlertTriangle size={11} aria-hidden /> {a.duplicate}</span>}
                    {r.files.length > 0 && <Paperclip size={12} aria-label={a.sections.docs} />}
                  </span>
                </td>
                <td className="px-4 py-3">{r.guardian}<span className="mt-0.5 block whitespace-nowrap text-xs text-muted">{r.phone}</span></td>
                <td className="px-4 py-3">{r.grade}</td>
                <td className="px-4 py-3"><Badge status={r.status} label={a.statuses[r.status]} /></td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => setOpenId(r.id)} className="inline-flex min-h-10 items-center rounded-full px-4 font-semibold text-navy hover:bg-paper-2">{d.view}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="px-4 py-10 text-center text-muted">{d.noResults}</p>}
      </div>

      <ul className="mt-4 flex flex-col gap-3 md:hidden">
        {filtered.map((r) => (
          <li key={r.id}>
            <button type="button" onClick={() => setOpenId(r.id)} className="w-full rounded-2xl bg-white p-4 text-left ring-1 ring-line active:bg-paper">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{r.studentName || r.guardian}{r.sample && <SampleTag label={d.sample} />}</p>
                <Badge status={r.status} label={a.statuses[r.status]} />
              </div>
              <p className="mt-1 text-sm text-muted">{r.grade}{ageOf(r) !== null && ` · ${ageOf(r)} ${a.f.years}`} · {r.guardian} · {r.phone}</p>
              {isDupe(r) && <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold-soft px-2 text-xs font-semibold"><AlertTriangle size={11} aria-hidden /> {a.duplicate}</p>}
              <p className="mt-1 font-mono text-xs text-muted">{r.id} · {formatDate(r.createdAt, lang)} · {campusNames[r.campus]}</p>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="py-10 text-center text-muted">{d.noResults}</li>}
      </ul>

      <Drawer open={!!current} onClose={() => { setOpenId(null); setNote(""); }} title={current ? `${current.id} · ${current.studentName || current.guardian}` : ""} closeLabel={d.close}>
        {current && (() => {
          const s = current.details.student; const p = current.details.previous; const g = current.details.guardian; const s2 = current.details.second;
          const age = ageOf(current);
          const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
            <section><h3 className="mb-3 border-b border-line pb-2 text-sm font-bold uppercase tracking-[0.12em] text-navy">{title}</h3>{children}</section>
          );
          return (
          <div className="flex flex-col gap-8">
            {isDupe(current) && <p className="flex items-start gap-2 rounded-xl bg-gold-soft/60 px-4 py-3 text-sm"><AlertTriangle size={16} className="mt-0.5 flex-none" aria-hidden /> {a.duplicateHelp}</p>}
            <InfoGrid
              items={[
                [d.campus, campusNames[current.campus]],
                [a.detail.grade, current.grade],
                [a.detail.received, formatDate(current.createdAt, lang, true)],
                [a.detail.formLang, d.langNames[current.lang]],
              ]}
            />
            <Section title={a.sections.student}>
              <InfoGrid items={[
                [a.f.name, current.studentName, true],
                [a.f.doc, s ? `${a.docTypes[s.docType] ?? s.docType} ${s.docNumber}` : current.studentDoc],
                [a.f.birth, s?.birthDate ? `${formatDate(s.birthDate + "T12:00:00", lang)}${age !== null ? ` · ${age} ${a.f.years}` : ""}` : ""],
                [a.f.sex, s ? a.sexes[s.sex] ?? s.sex : ""],
                [a.f.nationality, s?.nationality ?? ""],
              ]} />
            </Section>
            <Section title={a.sections.previous}>
              {p?.firstTime ? <p className="text-sm">{a.f.firstTime}</p> : (
                <InfoGrid items={[
                  [a.f.school, p?.school ?? "", true],
                  [a.f.city, p?.city ?? ""],
                  [a.f.sector, p?.sector ? a.sectors[p.sector] : ""],
                  [a.f.lastGrade, p?.lastGrade ?? ""],
                  [a.f.reason, p?.reason ?? "", true],
                ]} />
              )}
            </Section>
            <Section title={a.sections.guardian}>
              <InfoGrid items={[
                [a.f.name, current.guardian, true],
                [a.f.relation, g ? a.relations[g.relation] ?? g.relation : ""],
                [a.f.doc, g ? `${a.docTypes[g.docType] ?? g.docType} ${g.docNumber}` : ""],
                [a.detail.phone, current.phone],
                [a.f.email, g?.email ? <a href={`mailto:${g.email}`} className="text-navy underline">{g.email}</a> : ""],
                [a.f.address, g?.address ?? ""],
                [a.f.gCity, g?.city ?? ""],
              ]} />
            </Section>
            {s2?.name && (
              <Section title={a.sections.second}>
                <InfoGrid items={[[a.f.name, s2.name], [a.f.relation, s2.relation ? a.relations[s2.relation] : ""], [a.detail.phone, s2.phone]]} />
              </Section>
            )}
            <Section title={a.sections.other}>
              <InfoGrid items={[
                [a.f.siblings, current.details.siblings ?? ""],
                [a.f.source, current.details.source ? a.sources[current.details.source] ?? current.details.source : ""],
                [a.detail.message, current.message, true],
              ]} />
            </Section>
            <Section title={a.sections.docs}>
              {current.files.length === 0 ? <p className="text-sm text-muted">{a.f.noDocs}</p> : (
                <ul className="flex flex-col gap-2">
                  {current.files.map((x) => (
                    <li key={x.kind}>
                      <a href={admissionsStore.fileUrl(current.id, x.kind)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-navy ring-1 ring-line hover:bg-paper-2">
                        <Paperclip size={14} aria-hidden /> {a.f[x.kind]} · {x.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <div className="grid grid-cols-2 gap-3">
              <a href={`tel:+${toPhone(current.phone)}`} className="btn btn-ghost on-light !min-h-11 !text-sm text-ink"><Phone size={16} aria-hidden /> {d.call}</a>
              <a
                href={`https://wa.me/${toPhone(current.phone)}?text=${encodeURIComponent(a.waGreeting(current.guardian, current.id))}`}
                target="_blank" rel="noopener noreferrer"
                className="btn !min-h-11 bg-[#108043] !text-sm text-white"
              >
                <MessageCircle size={16} aria-hidden /> WhatsApp
              </a>
            </div>

            <label className="block">
              <span className="text-sm font-semibold">{d.status}</span>
              <select
                value={current.status}
                onChange={(e) => save(admissionsStore.update(current.id, { status: e.target.value as AdmissionStatus }), d.saveError)}
                disabled={!canEdit}
                className={`${input} mt-2 disabled:opacity-70`}
              >
                {ADMISSION_STATUSES.map((s) => <option key={s} value={s}>{a.statuses[s]}</option>)}
              </select>
            </label>

            <div>
              <h3 className="text-sm font-semibold">{d.notes}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {current.notes.length === 0 && <li className="text-sm text-muted">{d.noNotes}</li>}
                {current.notes.map((n, i) => (
                  <li key={i} className="rounded-xl bg-white p-3 text-sm ring-1 ring-line">
                    <p>{n.text}</p>
                    <p className="mt-1 text-xs text-muted">{formatDate(n.at, lang, true)}{n.by ? ` · ${d.noteBy} ${n.by}` : ""}</p>
                  </li>
                ))}
              </ul>
              {canEdit && <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!note.trim()) return;
                  save(admissionsStore.update(current.id, { note: clean(note, LIMITS.note) }), d.saveError);
                  setNote("");
                }}
              >
                <label className="flex-1">
                  <span className="sr-only">{d.newNote}</span>
                  <input value={note} maxLength={LIMITS.note} onChange={(e) => setNote(e.target.value)} placeholder={d.notePlaceholder} className={input} />
                </label>
                <button type="submit" className="btn btn-primary !min-h-11 !px-5 !text-sm">{d.add}</button>
              </form>}
            </div>

            <HistoryList
              entries={current.history}
              title={d.history}
              empty={d.noHistory}
              lang={lang}
              describe={(e) => `${d.status} → ${a.statuses[e.value as AdmissionStatus] ?? e.value}`}
            />
          </div>
          );
        })()}
      </Drawer>
    </section>
  );
}
