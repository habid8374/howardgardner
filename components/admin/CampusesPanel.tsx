"use client";

import { useState } from "react";
import { MapPin, Pencil, Phone, Plus, Mail } from "lucide-react";
import { ApiError, CAMPUS_STATUSES, campusesApi, campusName, type Admission, type Campus, type CampusStatus, type Pqrsf } from "@/lib/records";
import type { AdminDict } from "@/lib/dictionaries/admin";
import { Drawer, input } from "./ui";

type Lang = "es" | "en";

const EMPTY: Campus = {
  id: "", nameEs: "", nameEn: "", status: "soon", address: "", city: "", phone: "", whatsapp: "", email: "",
  hoursEs: "", hoursEn: "", grades: "", mapsUrl: "", notifyEmail: "", noteEs: "", noteEn: "", sort: 0,
};

const STATUS_TONE: Record<CampusStatus, string> = {
  open: "bg-[#e3f4ea] text-[#0f6b3a]",
  soon: "bg-gold-soft text-ink",
  hidden: "bg-paper-2 text-muted",
};

/* Sedes: lista en tarjetas y formulario en un panel lateral (crear y editar). */
export default function CampusesPanel({ campuses, admissions, pqrsf, a: d, lang }: {
  campuses: Campus[]; admissions: Admission[]; pqrsf: Pqrsf[]; a: AdminDict; lang: Lang;
}) {
  const s = d.settings;
  const [edit, setEdit] = useState<{ value: Campus; isNew: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bad, setBad] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const open = (c: Campus | null) => { setError(null); setBad([]); setEdit(c ? { value: { ...c }, isNew: false } : { value: { ...EMPTY, sort: campuses.length }, isNew: true }); };
  const set = <K extends keyof Campus>(k: K, v: Campus[K]) => setEdit((e) => (e ? { ...e, value: { ...e.value, [k]: v } } : e));

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setBusy(true); setError(null); setBad([]);
    try {
      await campusesApi.save(edit.value, edit.isNew);
      setEdit(null);
    } catch (err) {
      const code = err instanceof ApiError ? String(err.data.error ?? "") : "";
      setBad(err instanceof ApiError && Array.isArray(err.data.fields) ? (err.data.fields as string[]) : []);
      setError((s.errors as Record<string, string>)[code] ?? s.errors.generic);
    } finally {
      setBusy(false);
    }
  }

  const field = (k: keyof Campus, label: string, opts: { help?: string; type?: string; wide?: boolean; area?: boolean; max?: number; disabled?: boolean } = {}) => (
    <label className={`block ${opts.wide ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-semibold">{label}</span>
      {opts.area ? (
        <textarea
          value={String(edit?.value[k] ?? "")} onChange={(ev) => set(k, ev.target.value as never)} rows={3} maxLength={opts.max ?? 400}
          aria-invalid={bad.includes(k)} className={`${input} mt-2 py-3 ${bad.includes(k) ? "!border-red-600" : ""}`}
        />
      ) : (
        <input
          type={opts.type ?? "text"} value={String(edit?.value[k] ?? "")} disabled={opts.disabled}
          onChange={(ev) => set(k, (opts.type === "number" ? Number(ev.target.value) : ev.target.value) as never)}
          maxLength={opts.max ?? 150} aria-invalid={bad.includes(k)}
          className={`${input} mt-2 disabled:opacity-60 ${bad.includes(k) ? "!border-red-600" : ""}`}
        />
      )}
      {opts.help && <span className="mt-1 block text-xs text-muted">{opts.help}</span>}
    </label>
  );

  return (
    <section aria-labelledby="t-sedes">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 id="t-sedes" className="h-display text-[2.2rem] leading-tight">{s.campusesTitle}</h1>
          <p className="mt-1 max-w-2xl text-muted">{s.campusesLead}</p>
        </div>
        <button type="button" onClick={() => open(null)} className="btn btn-primary !min-h-11 !text-sm"><Plus size={16} aria-hidden /> {s.newCampus}</button>
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {campuses.map((c) => (
          <li key={c.id} className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-line">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-muted">{c.id}</p>
                <h2 className="mt-1 text-lg font-bold">{campusName(c, lang)}</h2>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_TONE[c.status]}`}>{s.statuses[c.status]}</span>
            </div>
            <ul className="mt-4 flex flex-col gap-1.5 text-sm text-muted">
              <li className="flex items-center gap-2"><MapPin size={14} aria-hidden /> {[c.address, c.city].filter(Boolean).join(", ") || "—"}</li>
              <li className="flex items-center gap-2"><Phone size={14} aria-hidden /> {c.phone || "—"}</li>
              <li className="flex items-center gap-2"><Mail size={14} aria-hidden /> {c.notifyEmail || "—"}</li>
            </ul>
            <p className="mt-4 text-xs font-semibold text-navy">
              {s.records(admissions.filter((r) => r.campus === c.id).length, pqrsf.filter((r) => r.campus === c.id).length)}
            </p>
            <button type="button" onClick={() => open(c)} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-ink/20 px-4 text-sm font-semibold hover:bg-paper-2">
              <Pencil size={14} aria-hidden /> {s.editCampus}
            </button>
          </li>
        ))}
      </ul>

      <Drawer open={!!edit} onClose={() => setEdit(null)} title={edit?.isNew ? s.newCampus : `${s.editCampus} · ${edit?.value.nameEs ?? ""}`} closeLabel={s.cancel}>
        {edit && (
          <form onSubmit={onSave} className="flex flex-col gap-6" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {field("id", s.f.id, { help: s.f.idHelp, disabled: !edit.isNew, max: 30 })}
              <label className="block">
                <span className="text-sm font-semibold">{s.f.status}</span>
                <select value={edit.value.status} onChange={(e) => set("status", e.target.value as CampusStatus)} className={`${input} mt-2`}>
                  {CAMPUS_STATUSES.map((st) => <option key={st} value={st}>{s.statuses[st]}</option>)}
                </select>
                <span className="mt-1 block text-xs text-muted">{s.statusHelp[edit.value.status]}</span>
              </label>
              {field("nameEs", s.f.nameEs, { max: 80 })}
              {field("nameEn", s.f.nameEn, { max: 80 })}
              {field("address", s.f.address)}
              {field("city", s.f.city, { max: 80 })}
              {field("phone", s.f.phone, { type: "tel", max: 20 })}
              {field("whatsapp", s.f.whatsapp, { type: "tel", max: 20 })}
              {field("hoursEs", s.f.hoursEs, { max: 120 })}
              {field("hoursEn", s.f.hoursEn, { max: 120 })}
              {field("grades", s.f.grades, { max: 120 })}
              {field("email", s.f.email, { type: "email", max: 254 })}
              {field("mapsUrl", s.f.mapsUrl, { wide: true, type: "url", max: 500 })}
              {field("notifyEmail", s.f.notifyEmail, { wide: true, type: "email", help: s.f.notifyHelp, max: 254 })}
              {field("noteEs", s.f.noteEs, { wide: true, area: true })}
              {field("noteEn", s.f.noteEn, { wide: true, area: true })}
              {field("sort", s.f.sort, { type: "number", max: 2 })}
            </div>
            {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</p>}
            <div className="sticky bottom-0 -mx-4 flex gap-3 border-t border-line bg-paper px-4 py-3 sm:-mx-6 sm:px-6">
              <button type="submit" disabled={busy} className="btn btn-primary !min-h-11 !text-sm disabled:opacity-70">{busy ? d.loading : s.save}</button>
              <button type="button" onClick={() => setEdit(null)} className="btn btn-ghost on-light !min-h-11 !text-sm text-ink">{s.cancel}</button>
            </div>
          </form>
        )}
      </Drawer>
    </section>
  );
}
