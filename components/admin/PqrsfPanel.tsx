"use client";

import { useMemo, useState } from "react";
import { Download, Paperclip, Search } from "lucide-react";
import {
  PQRSF_DAYS, PQRSF_STATUS, PQRSF_TYPE, businessDaysBetween, downloadCsv, formatDate, pqrsfDue, pqrsfStore,
  type Pqrsf, type PqrsfStatus, type PqrsfType,
} from "@/lib/demo-store";
import { Badge, Drawer, InfoGrid, Kpi, SampleTag, input } from "./ui";

const STATUSES = Object.keys(PQRSF_STATUS) as PqrsfStatus[];
const TYPES = Object.keys(PQRSF_TYPE) as PqrsfType[];
const isOpen = (p: Pqrsf) => p.status === "radicada" || p.status === "en_tramite";

/** Días hábiles que faltan (negativo = vencida). */
function remaining(p: Pqrsf, now: Date) {
  return businessDaysBetween(now, pqrsfDue(p));
}

function DueChip({ p, now }: { p: Pqrsf; now: Date }) {
  if (!isOpen(p)) return <span className="text-xs text-muted">—</span>;
  const left = remaining(p, now);
  if (left < 0) return <span className="whitespace-nowrap rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-800">Vencida hace {-left} d</span>;
  if (left <= 3) return <span className="whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">Faltan {left} d</span>;
  return <span className="whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">Faltan {left} d</span>;
}

export default function PqrsfPanel({ rows }: { rows: Pqrsf[] }) {
  const [now] = useState(() => new Date());
  const [q, setQ] = useState("");
  const [type, setType] = useState<"" | PqrsfType>("");
  const [status, setStatus] = useState<"" | PqrsfStatus | "abiertas">("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [answerDraft, setAnswerDraft] = useState<{ id: string; text: string } | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!type || r.type === type) &&
        (!status || (status === "abiertas" ? isOpen(r) : r.status === status)) &&
        (!term || [r.id, r.name, r.subject, r.email].some((v) => v.toLowerCase().includes(term)))
    );
  }, [rows, q, type, status]);

  const open = rows.filter(isOpen);
  const overdue = open.filter((p) => remaining(p, now) < 0).length;
  const soon = open.filter((p) => { const l = remaining(p, now); return l >= 0 && l <= 3; }).length;
  const current = rows.find((r) => r.id === openId) ?? null;
  const answer = answerDraft && current && answerDraft.id === current.id ? answerDraft.text : current?.answer ?? "";

  function exportCsv() {
    downloadCsv(
      `pqrsf-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Radicado", "Fecha", "Tipo", "Asunto", "Descripción", "Acudiente", "Correo", "Teléfono", "Estudiante", "Grado", "Adjunto", "Estado", "Fecha límite", "Respuesta"],
      filtered.map((r) => [
        r.id, formatDate(r.createdAt, "es", true), PQRSF_TYPE[r.type], r.subject, r.description, r.name, r.email, r.phone,
        r.student, r.grade, r.attachment, PQRSF_STATUS[r.status], formatDate(pqrsfDue(r).toISOString()), r.answer,
      ])
    );
  }

  return (
    <section aria-labelledby="t-pqrsf">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 id="t-pqrsf" className="h-display text-[2.2rem] text-ink">PQRSF</h1>
          <p className="mt-1 text-muted">Peticiones, quejas, reclamos, sugerencias y felicitaciones. Plazo de referencia: {PQRSF_DAYS} días hábiles.</p>
        </div>
        <button type="button" onClick={exportCsv} className="btn btn-primary !min-h-11 !text-sm">
          <Download size={16} aria-hidden /> Descargar Excel ({filtered.length})
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Abiertas" value={open.length} />
        <Kpi label="Vencidas" value={overdue} tone={overdue ? "alert" : "default"} />
        <Kpi label="Vencen en 3 días" value={soon} tone={soon ? "warn" : "default"} />
        <Kpi label="Respondidas o cerradas" value={rows.length - open.length} tone="ok" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 ring-1 ring-line md:grid-cols-[1.6fr_1fr_1fr]">
        <label className="relative">
          <span className="sr-only">Buscar</span>
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por radicado, nombre, asunto o correo" className={`${input} pl-10`} />
        </label>
        <label>
          <span className="sr-only">Tipo</span>
          <select value={type} onChange={(e) => setType(e.target.value as PqrsfType | "")} className={input}>
            <option value="">Todos los tipos</option>
            {TYPES.map((t) => <option key={t} value={t}>{PQRSF_TYPE[t]}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Estado</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as PqrsfStatus | "" | "abiertas")} className={input}>
            <option value="">Todos los estados</option>
            <option value="abiertas">Solo abiertas</option>
            {STATUSES.map((s) => <option key={s} value={s}>{PQRSF_STATUS[s]}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-4 hidden overflow-hidden rounded-2xl bg-white ring-1 ring-line md:block">
        <table className="w-full text-left text-[0.92rem]">
          <thead className="bg-paper-2 text-xs uppercase tracking-[0.1em] text-muted">
            <tr>
              {["Radicado", "Fecha", "Tipo", "Asunto", "Estado", "Plazo", ""].map((h) => <th key={h} scope="col" className="px-4 py-3 font-bold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-line transition-colors hover:bg-paper">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{r.id}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(r.createdAt)}</td>
                <td className="px-4 py-3">{PQRSF_TYPE[r.type]}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{r.subject}{r.sample && <SampleTag />}</p>
                  <p className="text-xs text-muted">{r.name}</p>
                </td>
                <td className="px-4 py-3"><Badge status={r.status} label={PQRSF_STATUS[r.status]} /></td>
                <td className="px-4 py-3"><DueChip p={r} now={now} /></td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => setOpenId(r.id)} className="inline-flex min-h-10 items-center rounded-full px-4 font-semibold text-navy hover:bg-paper-2">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="px-4 py-10 text-center text-muted">No hay solicitudes con esos filtros.</p>}
      </div>

      <ul className="mt-4 flex flex-col gap-3 md:hidden">
        {filtered.map((r) => (
          <li key={r.id}>
            <button type="button" onClick={() => setOpenId(r.id)} className="w-full rounded-2xl bg-white p-4 text-left ring-1 ring-line active:bg-paper">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{r.subject}{r.sample && <SampleTag />}</p>
                <Badge status={r.status} label={PQRSF_STATUS[r.status]} />
              </div>
              <p className="mt-1 text-sm text-muted">{PQRSF_TYPE[r.type]} · {r.name}</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="font-mono text-xs text-muted">{r.id}</p>
                <DueChip p={r} now={now} />
              </div>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="py-10 text-center text-muted">No hay solicitudes con esos filtros.</li>}
      </ul>

      <Drawer open={!!current} onClose={() => { setOpenId(null); setAnswerDraft(null); }} title={current?.id ?? ""}>
        {current && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge status={current.status} label={PQRSF_STATUS[current.status]} />
              <span className="rounded-full bg-paper-2 px-2.5 py-1 text-xs font-bold">{PQRSF_TYPE[current.type]}</span>
              <DueChip p={current} now={now} />
            </div>
            <InfoGrid
              items={[
                ["Asunto", current.subject],
                ["Radicada", formatDate(current.createdAt, "es", true)],
                ["Descripción", current.description],
                ["Acudiente", current.name],
                ["Correo", current.email],
                ["Teléfono", current.phone],
                ["Estudiante", current.student ? `${current.student}${current.grade ? ` · ${current.grade}` : ""}` : ""],
                ["Fecha límite", formatDate(pqrsfDue(current).toISOString())],
                ["Adjunto", current.attachment ? <span className="inline-flex items-center gap-1"><Paperclip size={14} aria-hidden /> {current.attachment}</span> : ""],
              ]}
            />

            <label className="block">
              <span className="text-sm font-semibold">Estado</span>
              <select
                value={current.status}
                onChange={(e) => pqrsfStore.update(current.id, { status: e.target.value as PqrsfStatus })}
                className={`${input} mt-2`}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{PQRSF_STATUS[s]}</option>)}
              </select>
            </label>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                pqrsfStore.update(current.id, { answer: answer.trim(), status: answer.trim() ? "respondida" : current.status });
                setAnswerDraft(null);
              }}
            >
              <label className="block">
                <span className="text-sm font-semibold">Respuesta al acudiente</span>
                <span className="mt-1 block text-xs text-muted">Se muestra cuando el acudiente consulta su radicado en el sitio.</span>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswerDraft({ id: current.id, text: e.target.value })}
                  rows={5}
                  className={`${input} mt-2 py-3`}
                />
              </label>
              <button type="submit" className="btn btn-primary mt-3 !min-h-11 !text-sm">Guardar y marcar como respondida</button>
            </form>
          </div>
        )}
      </Drawer>
    </section>
  );
}
