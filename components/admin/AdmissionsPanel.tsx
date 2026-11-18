"use client";

import { useMemo, useState } from "react";
import { Download, MessageCircle, Phone, Search } from "lucide-react";
import {
  ADMISSION_STATUS, admissionsStore, downloadCsv, formatDate,
  type Admission, type AdmissionStatus,
} from "@/lib/demo-store";
import { Badge, Drawer, InfoGrid, Kpi, SampleTag, input } from "./ui";

const STATUSES = Object.keys(ADMISSION_STATUS) as AdmissionStatus[];
const IN_PROCESS: AdmissionStatus[] = ["contactada", "visita", "evaluacion"];

const toPhone = (p: string) => {
  const digits = p.replace(/\D/g, "");
  return digits.startsWith("57") ? digits : `57${digits}`;
};

export default function AdmissionsPanel({ rows }: { rows: Admission[] }) {
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
      `preinscripciones-${new Date().toISOString().slice(0, 10)}.csv`,
      ["N.° solicitud", "Fecha", "Acudiente", "Teléfono", "Grado", "Estado", "Idioma", "Mensaje", "Notas internas"],
      filtered.map((r) => [
        r.id, formatDate(r.createdAt, "es", true), r.guardian, r.phone, r.grade, ADMISSION_STATUS[r.status],
        r.lang === "en" ? "Inglés" : "Español", r.message, r.notes.map((n) => n.text).join(" | "),
      ])
    );
  }

  return (
    <section aria-labelledby="t-admisiones">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 id="t-admisiones" className="h-display text-[2.2rem] text-ink">Preinscripciones 2027</h1>
          <p className="mt-1 text-muted">Solicitudes recibidas desde el formulario de admisiones.</p>
        </div>
        <button type="button" onClick={exportCsv} className="btn btn-primary !min-h-11 !text-sm">
          <Download size={16} aria-hidden /> Descargar Excel ({filtered.length})
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Total" value={rows.length} />
        <Kpi label="Nuevas sin atender" value={rows.filter((r) => r.status === "nueva").length} tone="warn" />
        <Kpi label="En proceso" value={rows.filter((r) => IN_PROCESS.includes(r.status)).length} />
        <Kpi label="Matriculados" value={rows.filter((r) => r.status === "matriculado").length} tone="ok" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 ring-1 ring-line md:grid-cols-[1.6fr_1fr_1fr]">
        <label className="relative">
          <span className="sr-only">Buscar</span>
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre, teléfono o número" className={`${input} pl-10`} />
        </label>
        <label>
          <span className="sr-only">Estado</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as AdmissionStatus | "")} className={input}>
            <option value="">Todos los estados</option>
            {STATUSES.map((s) => <option key={s} value={s}>{ADMISSION_STATUS[s]}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Grado</span>
          <select value={grade} onChange={(e) => setGrade(e.target.value)} className={input}>
            <option value="">Todos los grados</option>
            {grades.map((g) => <option key={g}>{g}</option>)}
          </select>
        </label>
      </div>

      {/* Tabla en escritorio */}
      <div className="mt-4 hidden overflow-hidden rounded-2xl bg-white ring-1 ring-line md:block">
        <table className="w-full text-left text-[0.92rem]">
          <thead className="bg-paper-2 text-xs uppercase tracking-[0.1em] text-muted">
            <tr>
              {["N.°", "Fecha", "Acudiente", "Teléfono", "Grado", "Estado", ""].map((h) => <th key={h} scope="col" className="px-4 py-3 font-bold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-line transition-colors hover:bg-paper">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{r.id}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(r.createdAt)}</td>
                <td className="px-4 py-3 font-semibold">{r.guardian}{r.sample && <SampleTag />}</td>
                <td className="whitespace-nowrap px-4 py-3">{r.phone}</td>
                <td className="px-4 py-3">{r.grade}</td>
                <td className="px-4 py-3"><Badge status={r.status} label={ADMISSION_STATUS[r.status]} /></td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => setOpenId(r.id)} className="inline-flex min-h-10 items-center rounded-full px-4 font-semibold text-navy hover:bg-paper-2">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="px-4 py-10 text-center text-muted">No hay solicitudes con esos filtros.</p>}
      </div>

      {/* Tarjetas en celular */}
      <ul className="mt-4 flex flex-col gap-3 md:hidden">
        {filtered.map((r) => (
          <li key={r.id}>
            <button type="button" onClick={() => setOpenId(r.id)} className="w-full rounded-2xl bg-white p-4 text-left ring-1 ring-line active:bg-paper">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{r.guardian}{r.sample && <SampleTag />}</p>
                <Badge status={r.status} label={ADMISSION_STATUS[r.status]} />
              </div>
              <p className="mt-1 text-sm text-muted">{r.grade} · {r.phone}</p>
              <p className="mt-1 font-mono text-xs text-muted">{r.id} · {formatDate(r.createdAt)}</p>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="py-10 text-center text-muted">No hay solicitudes con esos filtros.</li>}
      </ul>

      <Drawer open={!!current} onClose={() => { setOpenId(null); setNote(""); }} title={current?.id ?? ""}>
        {current && (
          <div className="flex flex-col gap-8">
            <InfoGrid
              items={[
                ["Acudiente", current.guardian],
                ["Teléfono", current.phone],
                ["Grado de interés", current.grade],
                ["Recibida", formatDate(current.createdAt, "es", true)],
                ["Idioma del formulario", current.lang === "en" ? "Inglés" : "Español"],
                ["Mensaje", current.message],
              ]}
            />

            <div className="grid grid-cols-2 gap-3">
              <a href={`tel:+${toPhone(current.phone)}`} className="btn btn-ghost on-light !min-h-11 !text-sm text-ink"><Phone size={16} aria-hidden /> Llamar</a>
              <a
                href={`https://wa.me/${toPhone(current.phone)}?text=${encodeURIComponent(`Hola, ${current.guardian}. Le escribimos de Howard Gardner Bilingual School por su preinscripción ${current.id}.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="btn !min-h-11 bg-[#1fa855] !text-sm text-white"
              >
                <MessageCircle size={16} aria-hidden /> WhatsApp
              </a>
            </div>

            <label className="block">
              <span className="text-sm font-semibold">Estado</span>
              <select
                value={current.status}
                onChange={(e) => admissionsStore.update(current.id, { status: e.target.value as AdmissionStatus })}
                className={`${input} mt-2`}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{ADMISSION_STATUS[s]}</option>)}
              </select>
            </label>

            <div>
              <h3 className="text-sm font-semibold">Notas internas</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {current.notes.length === 0 && <li className="text-sm text-muted">Sin notas todavía.</li>}
                {current.notes.map((n, i) => (
                  <li key={i} className="rounded-xl bg-white p-3 text-sm ring-1 ring-line">
                    <p>{n.text}</p>
                    <p className="mt-1 text-xs text-muted">{formatDate(n.at, "es", true)}</p>
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
                  <span className="sr-only">Nueva nota</span>
                  <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej.: Se agendó visita para el martes" className={input} />
                </label>
                <button type="submit" className="btn btn-primary !min-h-11 !px-5 !text-sm">Agregar</button>
              </form>
            </div>
          </div>
        )}
      </Drawer>
    </section>
  );
}
