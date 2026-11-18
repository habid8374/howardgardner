"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Download, FileDown, Flag, Paperclip, Search } from "lucide-react";
import { downloadPqrsfPdf } from "@/lib/pqrsf-pdf";
import { downloadXlsx } from "@/lib/xlsx-export";
import {
  LIMITS, PQRSF_STATUSES, PQRSF_TYPES, PRIORITIES, PRIORITY_DAYS, byUrgency, clean, formatDate, pqrsfAlert, pqrsfDue, pqrsfStore,
  type Pqrsf, type PqrsfPriority, type PqrsfStatus, type PqrsfType,
} from "@/lib/records";
import type { AdminDict } from "@/lib/dictionaries/admin";
import { Badge, DueBadge, Drawer, HistoryList, InfoGrid, Kpi, PriorityBadge, SampleTag, input } from "./ui";

const save = (p: Promise<unknown>, msg: string) => p.catch(() => window.alert(msg));

type Lang = "es" | "en";
type StatusFilter = "" | PqrsfStatus | "abiertas" | "urgentes" | "vencidas";

export default function PqrsfPanel({ rows, a: d, lang, userName, campusLabel }: { rows: Pqrsf[]; a: AdminDict; lang: Lang; userName: string; campusLabel: string | null }) {
  const a = d.pqrsf;
  const [now] = useState(() => new Date());
  const [q, setQ] = useState("");
  const [type, setType] = useState<"" | PqrsfType>("");
  const [priority, setPriority] = useState<"" | PqrsfPriority>("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [answerDraft, setAnswerDraft] = useState<{ id: string; text: string } | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);

  const withAlert = useMemo(() => rows.map((r) => ({ r, alert: pqrsfAlert(r, now) })), [rows, now]);
  const count = (level: string) => withAlert.filter((x) => x.alert.level === level).length;
  const overdue = count("vencida"), today = count("hoy"), soon = count("pronto");
  const open = withAlert.filter((x) => x.alert.level !== "cerrada").length;

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return withAlert
      .filter(({ r, alert }) => {
        if (type && r.type !== type) return false;
        if (priority && r.priority !== priority) return false;
        if (status === "abiertas" && alert.level === "cerrada") return false;
        if (status === "urgentes" && !["vencida", "hoy", "pronto"].includes(alert.level)) return false;
        if (status === "vencidas" && alert.level !== "vencida") return false;
        if (status && !["abiertas", "urgentes", "vencidas"].includes(status) && r.status !== status) return false;
        return !term || [r.id, r.name, r.subject, r.email].some((v) => v.toLowerCase().includes(term));
      })
      .sort((x, y) => byUrgency(now)(x.r, y.r));
  }, [withAlert, q, type, priority, status, now]);

  const current = rows.find((r) => r.id === openId) ?? null;
  const currentAlert = current ? pqrsfAlert(current, now) : null;
  const answer = answerDraft && current && answerDraft.id === current.id ? answerDraft.text : current?.answer ?? "";

  function exportCsv() {
    const now = new Date();
    const widths = [18, 21, 18, 13, 11, 30, 48, 26, 30, 15, 24, 10, 20, 15, 15, 22, 48];
    const levels = filtered.map(({ alert }) => alert.level);
    const count = (l: string) => levels.filter((x) => x === l).length;
    return downloadXlsx({
      filename: `${a.csvName}-${now.toISOString().slice(0, 10)}.xlsx`,
      sheet: a.sheet,
      title: campusLabel ? `${a.reportTitle} · ${campusLabel}` : a.reportTitle,
      meta: `${d.xlsx.meta(formatDate(now.toISOString(), lang, true), userName, filtered.length)}${filtered.length !== rows.length ? ` (${d.xlsx.filtered})` : ""}`,
      summary: d.xlsx.summaryPqrsf(levels.filter((l) => l !== "cerrada").length, count("vencida"), count("hoy"), count("pronto")),
      columns: a.csv.map((header, i) => ({ header, width: widths[i], wrap: [5, 6, 16].includes(i), date: i === 1 ? "datetime" : i === 14 ? "date" : undefined, center: [3, 4, 11, 13].includes(i) })),
      rows: filtered.map(({ r, alert }) => [
        r.id, new Date(r.createdAt), d.campusNames[r.campus], a.types[r.type], a.priorities[r.priority], r.subject, r.description,
        r.name, r.email, r.phone, r.student, r.grade, r.attachment, a.statuses[r.status],
        pqrsfDue(r), alert.level === "cerrada" ? "" : a.due(alert.level, alert.days), r.answer,
      ]),
      tone: (ri, ci) => {
        const { r, alert } = filtered[ri];
        if (ci === 0) return "strong";
        if (ci === 4) return r.priority === "alta" ? "danger" : r.priority === "media" ? "warning" : undefined;
        if (ci === 13) return r.status === "respondida" || r.status === "cerrada" ? "ok" : undefined;
        if (ci === 15) return alert.level === "vencida" || alert.level === "hoy" ? "danger" : alert.level === "pronto" ? "warning" : undefined;
        return undefined;
      },
      footer: { ...d.xlsx },
    });
  }

  const urgentTotal = overdue + today + soon;

  return (
    <section aria-labelledby="t-pqrsf">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 id="t-pqrsf" className="h-display text-[2.2rem] text-ink">{a.title}</h1>
          <p className="mt-1 text-muted">{a.lead}</p>
        </div>
        <button type="button" onClick={exportCsv} className="btn btn-primary !min-h-11 !text-sm">
          <Download size={16} aria-hidden /> {d.download} ({filtered.length})
        </button>
      </div>

      {/* Alerta de plazos */}
      {urgentTotal > 0 && (
        <div role="alert" className="mt-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-3">
            <AlertTriangle size={20} className="mt-0.5 flex-none text-red-600" aria-hidden />
            <span>
              <strong>{[overdue && a.alertOverdue(overdue), today && a.alertToday(today), soon && a.alertSoon(soon)].filter(Boolean).join(" · ")}</strong>
              {". "}{a.alertAction}
            </span>
          </p>
          <button
            type="button"
            onClick={() => setStatus("urgentes")}
            className="inline-flex min-h-11 flex-none items-center justify-center rounded-full bg-red-600 px-5 text-sm font-bold text-white transition-colors hover:bg-red-700"
          >
            {a.showUrgent}
          </button>
        </div>
      )}

      {/* Plazos por prioridad */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5 font-semibold text-ink"><Flag size={14} aria-hidden /> {a.deadlinesTitle}:</span>
        {PRIORITIES.map((p) => (
          <span key={p} className="inline-flex items-center gap-1.5">
            <PriorityBadge priority={p} label={a.priorities[p]} /> {PRIORITY_DAYS[p]} {lang === "es" ? "días hábiles" : "business days"}
          </span>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi label={a.kpis.open} value={open} onClick={() => setStatus(status === "abiertas" ? "" : "abiertas")} active={status === "abiertas"} />
        <Kpi label={a.kpis.overdue} value={overdue} tone={overdue ? "alert" : "default"} onClick={() => setStatus(status === "vencidas" ? "" : "vencidas")} active={status === "vencidas"} />
        <Kpi label={a.kpis.today} value={today} tone={today ? "alert" : "default"} />
        <Kpi label={a.kpis.soon} value={soon} tone={soon ? "warn" : "default"} onClick={() => setStatus(status === "urgentes" ? "" : "urgentes")} active={status === "urgentes"} />
        <Kpi label={a.kpis.done} value={rows.length - open} tone="ok" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 ring-1 ring-line md:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <label className="relative md:col-span-2 xl:col-span-1">
          <span className="sr-only">{d.search}</span>
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={a.searchPlaceholder} className={`${input} pl-10`} />
        </label>
        <label>
          <span className="sr-only">{a.cols.type}</span>
          <select value={type} onChange={(e) => setType(e.target.value as PqrsfType | "")} className={input}>
            <option value="">{a.allTypes}</option>
            {PQRSF_TYPES.map((t) => <option key={t} value={t}>{a.types[t]}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">{a.priority}</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value as PqrsfPriority | "")} className={input}>
            <option value="">{a.allPriorities}</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{a.priorities[p]}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">{d.status}</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} className={input}>
            <option value="">{a.allStatuses}</option>
            <option value="abiertas">{a.onlyOpen}</option>
            <option value="urgentes">{a.onlyUrgent}</option>
            <option value="vencidas">{a.kpis.overdue}</option>
            {PQRSF_STATUSES.map((s) => <option key={s} value={s}>{a.statuses[s]}</option>)}
          </select>
        </label>
      </div>

      {/* Tabla en escritorio */}
      <div className="mt-4 hidden overflow-x-auto rounded-2xl bg-white ring-1 ring-line md:block">
        <table className="w-full min-w-[860px] text-left text-[0.92rem]">
          <thead className="bg-paper-2 text-xs uppercase tracking-[0.1em] text-muted">
            <tr>
              {[a.cols.id, a.cols.type, a.cols.subject, a.cols.priority, a.cols.status, a.cols.due, ""].map((h, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ r, alert }) => (
              <tr
                key={r.id}
                className={`border-t border-line transition-colors hover:bg-paper ${alert.level === "vencida" ? "shadow-[inset_4px_0_0_#dc2626]" : alert.level === "hoy" || alert.level === "pronto" ? "shadow-[inset_4px_0_0_#f59e0b]" : ""}`}
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <p className="font-mono text-xs">{r.id}</p>
                  <p className="text-[11px] text-muted">{d.campusNames[r.campus]}</p>
                  <p className="text-xs text-muted">{formatDate(r.createdAt, lang)}</p>
                </td>
                <td className="px-4 py-3">{a.types[r.type]}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{r.subject}{r.sample && <SampleTag label={d.sample} />}</p>
                  <p className="text-xs text-muted">{r.name}</p>
                </td>
                <td className="px-4 py-3"><PriorityBadge priority={r.priority} label={a.priorities[r.priority]} /></td>
                <td className="px-4 py-3"><Badge status={r.status} label={a.statuses[r.status]} /></td>
                <td className="px-4 py-3">
                  <DueBadge level={alert.level} label={a.due(alert.level, alert.days)} />
                  {alert.level !== "cerrada" && <p className="mt-1 text-xs text-muted">{formatDate(pqrsfDue(r).toISOString(), lang)}</p>}
                </td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => setOpenId(r.id)} className="inline-flex min-h-10 items-center rounded-full px-4 font-semibold text-navy hover:bg-paper-2">{d.view}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="px-4 py-10 text-center text-muted">{d.noResults}</p>}
      </div>

      {/* Tarjetas en celular */}
      <ul className="mt-4 flex flex-col gap-3 md:hidden">
        {filtered.map(({ r, alert }) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => setOpenId(r.id)}
              className={`w-full rounded-2xl bg-white p-4 text-left ring-1 ring-line active:bg-paper ${alert.level === "vencida" ? "border-l-4 border-red-600" : alert.level === "hoy" || alert.level === "pronto" ? "border-l-4 border-amber-500" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{r.subject}{r.sample && <SampleTag label={d.sample} />}</p>
                <Badge status={r.status} label={a.statuses[r.status]} />
              </div>
              <p className="mt-1 text-sm text-muted">{a.types[r.type]} · {r.name}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <PriorityBadge priority={r.priority} label={a.priorities[r.priority]} />
                <DueBadge level={alert.level} label={a.due(alert.level, alert.days)} />
              </div>
              <p className="mt-2 font-mono text-xs text-muted">{r.id} · {d.campusNames[r.campus]}</p>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="py-10 text-center text-muted">{d.noResults}</li>}
      </ul>

      <Drawer open={!!current} onClose={() => { setOpenId(null); setAnswerDraft(null); }} title={current?.id ?? ""} closeLabel={d.close}>
        {current && currentAlert && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge status={current.status} label={a.statuses[current.status]} />
                <span className="rounded-full bg-paper-2 px-2.5 py-1 text-xs font-bold">{a.types[current.type]}</span>
                <PriorityBadge priority={current.priority} label={a.priorities[current.priority]} />
                <DueBadge level={currentAlert.level} label={a.due(currentAlert.level, currentAlert.days)} />
              </div>
              {current.urgent && (
                <p className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
                  <AlertTriangle size={16} aria-hidden /> {a.detail.urgentByParent}
                </p>
              )}
            </div>

            <InfoGrid
              items={[
                [d.campus, d.campusNames[current.campus]],
                [a.detail.subject, current.subject],
                [a.detail.created, formatDate(current.createdAt, lang, true)],
                [a.detail.description, current.description, true],
                [a.detail.name, current.name],
                [a.detail.email, current.email],
                [a.detail.phone, current.phone],
                [a.detail.student, current.student ? `${current.student}${current.grade ? ` · ${current.grade}` : ""}` : ""],
                [a.detail.due, formatDate(pqrsfDue(current).toISOString(), lang)],
                [a.detail.attachment, current.attachment
                  ? current.hasFile
                    ? <a href={pqrsfStore.fileUrl(current.id)} className="inline-flex items-center gap-1 font-semibold text-navy underline underline-offset-2"><Paperclip size={14} aria-hidden /> {current.attachment} · {d.downloadFile}</a>
                    : <span className="inline-flex items-center gap-1"><Paperclip size={14} aria-hidden /> {current.attachment}</span>
                  : ""],
              ]}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold">{a.priority}</span>
                <select
                  value={current.priority}
                  onChange={(e) => save(pqrsfStore.update(current.id, { priority: e.target.value as PqrsfPriority }), d.saveError)}
                  className={`${input} mt-2`}
                >
                  {PRIORITIES.map((p) => <option key={p} value={p}>{a.priorities[p]} · {PRIORITY_DAYS[p]} {lang === "es" ? "días" : "days"}</option>)}
                </select>
                <span className="mt-1.5 block text-xs text-muted">{a.priorityHelp(PRIORITY_DAYS[current.priority])}</span>
              </label>
              <label className="block">
                <span className="text-sm font-semibold">{d.status}</span>
                <select
                  value={current.status}
                  onChange={(e) => save(pqrsfStore.update(current.id, { status: e.target.value as PqrsfStatus }), d.saveError)}
                  className={`${input} mt-2`}
                >
                  {PQRSF_STATUSES.map((s) => <option key={s} value={s}>{a.statuses[s]}</option>)}
                </select>
              </label>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const text = clean(answer, LIMITS.answer);
                save(pqrsfStore.update(current.id, { answer: text }), d.saveError);
                setAnswerDraft(null);
              }}
            >
              <label className="block">
                <span className="text-sm font-semibold">{a.answer}</span>
                <span className="mt-1 block text-xs text-muted">{a.answerHelp}</span>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswerDraft({ id: current.id, text: e.target.value })}
                  rows={5}
                  maxLength={LIMITS.answer}
                  className={`${input} mt-2 py-3`}
                />
              </label>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <button type="submit" className="btn btn-primary !min-h-11 !text-sm">{a.saveAnswer}</button>
                {current.answer && (
                  <button
                    type="button"
                    disabled={pdfBusy}
                    onClick={async () => {
                      setPdfBusy(true);
                      try { await downloadPqrsfPdf(current, lang); } finally { setPdfBusy(false); }
                    }}
                    className="btn btn-ghost on-light !min-h-11 !text-sm text-ink disabled:opacity-70"
                  >
                    <FileDown size={16} aria-hidden /> {pdfBusy ? a.pdfLoading : a.pdf}
                  </button>
                )}
              </div>
            </form>

            <HistoryList
              entries={current.history}
              title={d.history}
              empty={d.noHistory}
              lang={lang}
              describe={(e) =>
                e.field === "answer"
                  ? d.historyAnswer
                  : e.field === "priority"
                    ? `${a.priority} → ${a.priorities[e.value as PqrsfPriority] ?? e.value}`
                    : `${d.status} → ${a.statuses[e.value as PqrsfStatus] ?? e.value}`
              }
            />
          </div>
        )}
      </Drawer>
    </section>
  );
}
