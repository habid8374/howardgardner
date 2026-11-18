"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, Clock, X } from "lucide-react";
import { formatDate, type DueLevel, type HistoryEntry, type PqrsfPriority } from "@/lib/records";

export const input =
  "block min-h-11 w-full rounded-xl border border-ink/15 bg-white px-3.5 text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-navy focus:shadow-[0_0_0_3px_rgba(18,36,90,0.12)]";

type Tone = "default" | "alert" | "warn" | "ok";

export function Kpi({ label, value, tone = "default", onClick, active }: { label: string; value: number | string; tone?: Tone; onClick?: () => void; active?: boolean }) {
  const color = { default: "text-navy", alert: "text-red-700", warn: "text-amber-700", ok: "text-emerald-700" }[tone];
  const ring = active ? "ring-2 ring-navy" : "ring-1 ring-line";
  const body = (
    <>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className={`h-display mt-2 text-[2.4rem] leading-none ${color}`}>{value}</p>
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} aria-pressed={active} className={`lift rounded-2xl bg-white p-5 text-left ${ring}`}>{body}</button>
  ) : (
    <div className={`rounded-2xl bg-white p-5 ${ring}`}>{body}</div>
  );
}

const TONES: Record<string, string> = {
  nueva: "bg-gold text-ink",
  contactada: "bg-sky-100 text-sky-900",
  visita: "bg-indigo-100 text-indigo-900",
  evaluacion: "bg-amber-100 text-amber-900",
  admitido: "bg-emerald-100 text-emerald-900",
  no_admitido: "bg-zinc-200 text-zinc-700",
  matriculado: "bg-emerald-700 text-white",
  radicada: "bg-gold text-ink",
  en_tramite: "bg-sky-100 text-sky-900",
  respondida: "bg-emerald-100 text-emerald-900",
  cerrada: "bg-zinc-200 text-zinc-700",
};

export function Badge({ status, label }: { status: string; label: string }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${TONES[status] ?? "bg-paper-2 text-ink"}`}>{label}</span>;
}

const PRIORITY_TONE: Record<PqrsfPriority, string> = {
  alta: "border-red-300 bg-red-50 text-red-800",
  media: "border-amber-300 bg-amber-50 text-amber-900",
  baja: "border-zinc-300 bg-white text-zinc-700",
};
const PRIORITY_DOT: Record<PqrsfPriority, string> = { alta: "bg-red-600", media: "bg-amber-500", baja: "bg-zinc-400" };

export function PriorityBadge({ priority, label }: { priority: PqrsfPriority; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-bold ${PRIORITY_TONE[priority]}`}>
      <span className={`h-2 w-2 rounded-full ${PRIORITY_DOT[priority]}`} aria-hidden />
      {label}
    </span>
  );
}

/* Alerta de plazo: vencida (rojo), vence hoy (rojo claro), vence pronto (ámbar), a tiempo (verde). */
const DUE_TONE: Record<DueLevel, string> = {
  vencida: "bg-red-600 text-white",
  hoy: "bg-red-100 text-red-800",
  pronto: "bg-amber-100 text-amber-900",
  a_tiempo: "bg-emerald-50 text-emerald-800",
  cerrada: "text-muted",
};

export function DueBadge({ level, label }: { level: DueLevel; label: string }) {
  if (level === "cerrada") return <span className="text-xs text-muted">—</span>;
  const Icon = level === "vencida" || level === "hoy" ? AlertTriangle : Clock;
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${DUE_TONE[level]}`}>
      <Icon size={12} aria-hidden /> {label}
    </span>
  );
}

export function SampleTag({ label }: { label: string }) {
  return <span className="ml-2 rounded-full border border-ink/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-muted">{label}</span>;
}

/* Panel lateral con <dialog>: foco atrapado, Escape cierra, clic en el fondo cierra. */
export function Drawer({ open, onClose, title, closeLabel, children }: { open: boolean; onClose: () => void; title: string; closeLabel: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={title}
      className="admin-drawer m-0 ml-auto h-dvh max-h-dvh w-full max-w-full bg-paper p-0 text-ink sm:max-w-[560px]"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="h-display line-clamp-2 text-xl leading-tight sm:text-2xl">{title}</h2>
          <button type="button" onClick={onClose} aria-label={closeLabel} className="flex h-11 w-11 flex-none items-center justify-center rounded-full hover:bg-paper-2">
            <X size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-5 sm:px-6 sm:pt-6">{children}</div>
      </div>
    </dialog>
  );
}

/** Historial de cambios de una solicitud (OWASP A09: registro de eventos). */
export function HistoryList({ entries, title, empty, describe, lang }: {
  entries?: HistoryEntry[]; title: string; empty: string; describe: (e: HistoryEntry) => string; lang: "es" | "en";
}) {
  const list = [...(entries ?? [])].reverse();
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {list.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{empty}</p>
      ) : (
        <ol className="mt-3 border-l-2 border-line pl-4">
          {list.map((e, i) => (
            <li key={i} className="relative pb-3 text-sm">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-navy" aria-hidden />
              <p>{describe(e)}</p>
              <p className="text-xs text-muted">{formatDate(e.at, lang, true)}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/** Lista de datos; los elementos con wide=true ocupan toda la fila. */
export function InfoGrid({ items }: { items: [string, React.ReactNode, boolean?][] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map(([k, v, wide]) => (
        <div key={k} className={wide ? "sm:col-span-2" : undefined}>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{k}</dt>
          <dd className="mt-1 whitespace-pre-line break-words text-[0.98rem]">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
