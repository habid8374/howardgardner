"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export const input =
  "block min-h-11 w-full rounded-xl border border-ink/15 bg-white px-3.5 text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-navy focus:shadow-[0_0_0_3px_rgba(18,36,90,0.12)]";

export function Kpi({ label, value, tone = "default", hint }: { label: string; value: number | string; tone?: "default" | "alert" | "warn" | "ok"; hint?: string }) {
  const color = { default: "text-navy", alert: "text-red-700", warn: "text-amber-700", ok: "text-emerald-700" }[tone];
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-line">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className={`h-display mt-2 text-[2.4rem] leading-none ${color}`}>{value}</p>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </div>
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

export function SampleTag() {
  return <span className="ml-2 rounded-full border border-ink/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-muted">ejemplo</span>;
}

/* Panel lateral con <dialog>: foco atrapado, Escape cierra, clic en el fondo cierra. */
export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
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
      className="admin-drawer m-0 ml-auto h-dvh max-h-dvh w-full max-w-[560px] bg-paper p-0 text-ink"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
          <h2 className="h-display text-2xl">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-paper-2">
            <X size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </dialog>
  );
}

export function InfoGrid({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k} className={k === "Descripción" || k === "Mensaje" ? "sm:col-span-2" : undefined}>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{k}</dt>
          <dd className="mt-1 whitespace-pre-line break-words text-[0.98rem]">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
