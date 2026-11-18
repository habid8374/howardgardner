"use client";

import { useMemo, useState } from "react";
import { Download, MessageCircle, Phone, Search } from "lucide-react";
import { ADMISSION_STATUSES, admissionsStore, downloadCsv, formatDate, type Admission, type AdmissionStatus } from "@/lib/demo-store";
import type { AdminDict } from "@/lib/dictionaries/admin";
import { Badge, Drawer, InfoGrid, Kpi, SampleTag, input } from "./ui";

type Lang = "es" | "en";
const IN_PROCESS: AdmissionStatus[] = ["contactada", "visita", "evaluacion"];

const toPhone = (p: string) => {
  const digits = p.replace(/\D/g, "");
  return digits.startsWith("57") ? digits : `57${digits}`;
};

export default function AdmissionsPanel({ rows, a: d, lang }: { rows: Admission[]; a: AdminDict; lang: Lang }) {
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
        (!term || [r.id, r.guardian, r.phone].some((v) => v.toLowerCase().includes(term)))
    );
  }, [rows, q, status, grade]);

  const current = rows.find((r) => r.id === openId) ?? null;

  function exportCsv() {
    downloadCsv(
      `${a.csvName}-${new Date().toISOString().slice(0, 10)}.csv`,
      a.csv,
      filtered.map((r) => [
        r.id, formatDate(r.createdAt, lang, true), r.guardian, r.phone, r.grade, a.statuses[r.status],
        d.langNames[r.lang], r.message, r.notes.map((n) => n.text).join(" | "),
      ])
    );
  }

  const kpi = (s: AdmissionStatus | "") => () => setStatus(status === s ? "" : s);

  return (
    <section aria-labelledby="t-admisiones">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 id="t-admisiones" className="h-display text-[2.2rem] text-ink">{a.title}</h1>
          <p className="mt-1 text-muted">{a.lead}</p>
        </div>
        <button type="button" onClick={exportCsv} className="btn btn-primary !min-h-11 !text-sm">
          <Download size={16} aria-hidden /> {d.download} ({filtered.length})
        </button>
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
              {[a.cols.id, a.cols.date, a.cols.guardian, a.cols.phone, a.cols.grade, a.cols.status, ""].map((h, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-line transition-colors hover:bg-paper">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{r.id}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(r.createdAt, lang)}</td>
                <td className="px-4 py-3 font-semibold">{r.guardian}{r.sample && <SampleTag label={d.sample} />}</td>
                <td className="whitespace-nowrap px-4 py-3">{r.phone}</td>
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
                <p className="font-semibold">{r.guardian}{r.sample && <SampleTag label={d.sample} />}</p>
                <Badge status={r.status} label={a.statuses[r.status]} />
              </div>
              <p className="mt-1 text-sm text-muted">{r.grade} · {r.phone}</p>
              <p className="mt-1 font-mono text-xs text-muted">{r.id} · {formatDate(r.createdAt, lang)}</p>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="py-10 text-center text-muted">{d.noResults}</li>}
      </ul>

      <Drawer open={!!current} onClose={() => { setOpenId(null); setNote(""); }} title={current?.id ?? ""} closeLabel={d.close}>
        {current && (
          <div className="flex flex-col gap-8">
            <InfoGrid
              items={[
                [a.detail.guardian, current.guardian],
                [a.detail.phone, current.phone],
                [a.detail.grade, current.grade],
                [a.detail.received, formatDate(current.createdAt, lang, true)],
                [a.detail.formLang, d.langNames[current.lang]],
                [a.detail.message, current.message, true],
              ]}
            />

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
                onChange={(e) => admissionsStore.update(current.id, { status: e.target.value as AdmissionStatus })}
                className={`${input} mt-2`}
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
                    <p className="mt-1 text-xs text-muted">{formatDate(n.at, lang, true)}</p>
                  </li>
                ))}
              </ul>
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!note.trim()) return;
                  admissionsStore.update(current.id, { notes: [...current.notes, { at: new Date().toISOString(), text: note.trim() }] });
                  setNote("");
                }}
              >
                <label className="flex-1">
                  <span className="sr-only">{d.newNote}</span>
                  <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={d.notePlaceholder} className={input} />
                </label>
                <button type="submit" className="btn btn-primary !min-h-11 !px-5 !text-sm">{d.add}</button>
              </form>
            </div>
          </div>
        )}
      </Drawer>
    </section>
  );
}
