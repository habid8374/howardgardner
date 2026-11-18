"use client";

import { useCallback, useEffect, useState } from "react";
import { KeyRound, Lock, Pencil, Plus, ShieldCheck, UserX } from "lucide-react";
import {
  ApiError, PERM_PRESETS, campusName, formatDate, staffApi, subscribeDemo,
  type Access, type Campus, type Perms, type StaffInput, type StaffRow, type StaffUser,
} from "@/lib/records";
import type { AdminDict } from "@/lib/dictionaries/admin";
import { Drawer, input } from "./ui";

type Lang = "es" | "en";
type Preset = keyof typeof PERM_PRESETS;
const PRESETS = Object.keys(PERM_PRESETS) as Preset[];
const AREAS = ["admisiones", "pqrsf"] as const;
const FLAGS = ["exportar", "sedes", "usuarios"] as const;
const ACCESS: Access[] = ["none", "ver", "gestionar"];

const samePerms = (a: Perms, b: Perms) => (Object.keys(a) as (keyof Perms)[]).every((k) => a[k] === b[k]);
const presetOf = (p: Perms): Preset | "custom" => PRESETS.find((k) => samePerms(PERM_PRESETS[k], p)) ?? "custom";

/** Contraseña aleatoria legible (sin letras que se confundan). Se genera en el navegador con crypto. */
function genPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const buf = new Uint32Array(14);
  crypto.getRandomValues(buf);
  return Array.from(buf, (n) => chars[n % chars.length]).join("").replace(/(.{5})(.{4})(.{5})/, "$1-$2-$3");
}

type Form = StaffInput & { username: string; original?: string };

export default function UsersPanel({ me, campuses, a: d, lang }: { me: StaffUser; campuses: Campus[]; a: AdminDict; lang: Lang }) {
  const s = d.settings;
  const [users, setUsers] = useState<StaffRow[] | null>(null);
  const [edit, setEdit] = useState<{ value: Form; isNew: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bad, setBad] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => staffApi.list().then((r) => setUsers(r.users)).catch(() => setUsers([])), []);
  useEffect(() => {
    // Sincroniza con la API al abrir la pestaña y tras cada cambio
    load();
    return subscribeDemo(load);
  }, [load]);

  const cName = (id: string | null) => (id ? campusName(campuses.find((c) => c.id === id) ?? { nameEs: id, nameEn: "" }, lang) : s.u.allCampuses);

  const openNew = () => {
    setError(null); setBad([]);
    setEdit({ isNew: true, value: { username: "", name: "", password: genPassword(), campus: null, perms: { ...PERM_PRESETS.coordinacion }, active: true } });
  };
  const openEdit = (u: StaffRow) => {
    setError(null); setBad([]);
    setEdit({ isNew: false, value: { username: u.username, original: u.username, name: u.name, password: "", campus: u.campus, perms: { ...u.perms }, active: u.active } });
  };
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setEdit((e) => (e ? { ...e, value: { ...e.value, [k]: v } } : e));
  const setPerm = <K extends keyof Perms>(k: K, v: Perms[K]) =>
    setEdit((e) => (e ? { ...e, value: { ...e.value, perms: { ...e.value.perms, [k]: v } } } : e));

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setBusy(true); setError(null); setBad([]);
    const v = edit.value;
    try {
      if (edit.isNew) await staffApi.save(v);
      else await staffApi.save({ username: v.username, name: v.name, password: v.password ?? "", campus: v.campus, perms: v.perms, active: v.active }, v.original);
      setEdit(null);
    } catch (err) {
      const code = err instanceof ApiError ? String(err.data.error ?? "") : "";
      setBad(err instanceof ApiError && Array.isArray(err.data.fields) ? (err.data.fields as string[]) : []);
      setError((s.errors as Record<string, string>)[code] ?? s.errors.generic);
    } finally {
      setBusy(false);
    }
  }

  const summary = (p: Perms) => {
    const preset = presetOf(p);
    if (preset !== "custom") return s.presets[preset];
    return AREAS.filter((k) => p[k] !== "none").map((k) => `${s.areas[k]}: ${s.access[p[k]]}`).join(" · ") || s.access.none;
  };

  const v = edit?.value;
  const preset = v ? presetOf(v.perms) : "custom";
  const isSelf = !!v && !edit?.isNew && v.original === me.username;
  const adminPerm = !!v && (v.perms.sedes || v.perms.usuarios);

  return (
    <section aria-labelledby="t-usuarios">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 id="t-usuarios" className="h-display text-[2.2rem] leading-tight">{s.usersTitle}</h1>
          <p className="mt-1 max-w-2xl text-muted">{s.usersLead}</p>
        </div>
        <button type="button" onClick={openNew} className="btn btn-primary !min-h-11 !text-sm"><Plus size={16} aria-hidden /> {s.newUser}</button>
      </div>

      {/* Celular: una tarjeta por usuario */}
      <ul className="mt-6 flex flex-col gap-3 md:hidden">
        {users === null && <li className="text-muted">{d.loading}</li>}
        {users?.map((u) => {
          const locked = u.superuser && !me.superuser;
          return (
            <li key={u.username} className={`rounded-2xl bg-white p-4 ring-1 ring-line ${u.active ? "" : "opacity-60"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold leading-snug">
                    {u.name}{u.username === me.username && <span className="ml-1.5 text-xs font-normal text-muted">({s.u.you})</span>}
                  </p>
                  <p className="font-mono text-xs text-muted">{u.username}</p>
                </div>
                {u.superuser && <span className="inline-flex flex-none items-center gap-1 rounded-full bg-navy px-2 py-0.5 text-[11px] font-bold text-white"><Lock size={11} aria-hidden /> {s.u.superuser}</span>}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <div><dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">{s.u.campus}</dt><dd>{cName(u.campus)}</dd></div>
                <div><dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">{s.u.perms}</dt><dd className="flex items-center gap-1">{u.perms.usuarios && <ShieldCheck size={13} className="text-navy" aria-hidden />}{summary(u.perms)}</dd></div>
                <div className="col-span-2"><dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">{s.u.lastLogin}</dt><dd className="text-muted">{u.lastLogin ? formatDate(u.lastLogin, lang, true) : s.u.never}{!u.active && ` · ${s.u.inactive}`}</dd></div>
              </dl>
              {!locked && (
                <button type="button" onClick={() => openEdit(u)} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-ink/20 text-sm font-semibold text-navy">
                  <Pencil size={14} aria-hidden /> {s.editUser}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* Computador: tabla */}
      <div className="mt-8 hidden overflow-x-auto rounded-2xl bg-white ring-1 ring-line md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-2 text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3 font-bold">{s.u.name}</th>
              <th className="px-4 py-3 font-bold">{s.u.campus}</th>
              <th className="px-4 py-3 font-bold">{s.u.perms}</th>
              <th className="px-4 py-3 font-bold">{s.u.lastLogin}</th>
              <th className="px-4 py-3"><span className="sr-only">{s.editUser}</span></th>
            </tr>
          </thead>
          <tbody>
            {users === null && <tr><td colSpan={5} className="px-4 py-6 text-muted">{d.loading}</td></tr>}
            {users?.map((u) => (
              <tr key={u.username} className={`border-t border-line ${u.active ? "" : "opacity-60"}`}>
                <td className="px-4 py-3">
                  <p className="font-semibold">{u.name}{u.username === me.username && <span className="ml-2 text-xs font-normal text-muted">({s.u.you})</span>}{u.superuser && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-navy px-2 py-0.5 text-[11px] font-bold text-white" title={s.u.superuserHelp}><Lock size={11} aria-hidden /> {s.u.superuser}</span>}</p>
                  <p className="font-mono text-xs text-muted">{u.username}</p>
                </td>
                <td className="px-4 py-3">{cName(u.campus)}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    {u.perms.usuarios && <ShieldCheck size={14} className="text-navy" aria-hidden />}
                    {summary(u.perms)}
                  </span>
                  {!u.active && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-paper-2 px-2 py-0.5 text-xs font-bold text-muted"><UserX size={12} aria-hidden /> {s.u.inactive}</span>}
                </td>
                <td className="px-4 py-3 text-muted">{u.lastLogin ? formatDate(u.lastLogin, lang, true) : s.u.never}</td>
                <td className="px-4 py-3 text-right">
                  {u.superuser && !me.superuser ? (
                    <span className="inline-flex min-h-11 items-center gap-2 px-3 text-xs text-muted" title={s.u.superuserHelp}><Lock size={14} aria-hidden /> {s.u.superuser}</span>
                  ) : (
                    <button type="button" onClick={() => openEdit(u)} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-semibold text-navy hover:bg-paper-2">
                      <Pencil size={14} aria-hidden /> {s.editUser}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer open={!!edit} onClose={() => setEdit(null)} title={edit?.isNew ? s.newUser : `${s.editUser} · ${v?.name ?? ""}`} closeLabel={s.cancel}>
        {edit && v && (
          <form onSubmit={onSave} className="flex flex-col gap-6" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold">{s.u.name}</span>
                <input value={v.name} onChange={(e) => set("name", e.target.value)} maxLength={80} aria-invalid={bad.includes("name")} className={`${input} mt-2 ${bad.includes("name") ? "!border-red-600" : ""}`} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">{s.u.username}</span>
                <input
                  value={v.username} autoCapitalize="none" autoComplete="off" maxLength={40}
                  onChange={(e) => set("username", e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""))}
                  aria-invalid={bad.includes("username")} className={`${input} mt-2 font-mono disabled:opacity-60 ${bad.includes("username") ? "!border-red-600" : ""}`}
                />
                <span className="mt-1 block text-xs text-muted">{s.u.usernameHelp}</span>
              </label>
              <label className="block">
                <span className="text-sm font-semibold">{edit.isNew ? s.u.password : s.u.newPassword}</span>
                <span className="mt-2 flex gap-2">
                  <input
                    value={v.password ?? ""} onChange={(e) => set("password", e.target.value)} autoComplete="new-password" maxLength={128}
                    aria-invalid={bad.includes("password")} className={`${input} font-mono ${bad.includes("password") ? "!border-red-600" : ""}`}
                  />
                  <button type="button" onClick={() => set("password", genPassword())} className="inline-flex min-h-11 flex-none items-center gap-1.5 rounded-xl border border-ink/20 px-3 text-sm font-semibold hover:bg-paper-2">
                    <KeyRound size={14} aria-hidden /> {s.u.generate}
                  </button>
                </span>
                <span className="mt-1 block text-xs text-muted">{s.u.passwordHelp}</span>
              </label>
            </div>

            <fieldset>
              <legend className="text-sm font-semibold">{s.u.profile}</legend>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {PRESETS.map((k) => (
                  <button
                    key={k} type="button"
                    onClick={() => { setEdit((e) => (e ? { ...e, value: { ...e.value, perms: { ...PERM_PRESETS[k] }, campus: PERM_PRESETS[k].sedes || PERM_PRESETS[k].usuarios ? null : e.value.campus } } : e)); }}
                    aria-pressed={preset === k}
                    className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${preset === k ? "border-navy bg-navy text-white" : "border-ink/20 hover:border-navy"}`}
                  >
                    <span className="block font-bold">{s.presets[k]}</span>
                    <span className={`mt-0.5 block text-xs ${preset === k ? "text-white/75" : "text-muted"}`}>{s.presetHelp[k]}</span>
                  </button>
                ))}
              </div>
              {preset === "custom" && <p className="mt-2 text-xs font-semibold text-navy">{s.presets.custom}</p>}
            </fieldset>

            <fieldset className="rounded-2xl bg-white p-4 ring-1 ring-line">
              <legend className="px-1 text-sm font-semibold">{s.u.perms}</legend>
              <div className="flex flex-col gap-3">
                {AREAS.map((k) => (
                  <label key={k} className="flex items-center justify-between gap-3">
                    <span className="text-sm">{s.areas[k]}</span>
                    <select value={v.perms[k]} onChange={(e) => setPerm(k, e.target.value as Access)} className={`${input} !w-auto`}>
                      {ACCESS.map((x) => <option key={x} value={x}>{s.access[x]}</option>)}
                    </select>
                  </label>
                ))}
                {FLAGS.map((k) => {
                  const lock = isSelf && k === "usuarios";
                  return (
                    <label key={k} className="flex min-h-11 items-center justify-between gap-3 border-t border-line pt-3">
                      <span className="text-sm">{s.areas[k]}</span>
                      <input
                        type="checkbox" checked={v.perms[k]} disabled={lock}
                        onChange={(e) => {
                          const on = e.target.checked;
                          setPerm(k, on);
                          if (on && (k === "sedes" || k === "usuarios")) set("campus", null);
                        }}
                        className="h-5 w-5 accent-[var(--navy)] disabled:opacity-50"
                      />
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold">{s.u.campus}</span>
                <select
                  value={v.campus ?? ""} disabled={adminPerm}
                  onChange={(e) => set("campus", e.target.value || null)} className={`${input} mt-2 disabled:opacity-60`}
                >
                  <option value="">{s.u.allCampuses}</option>
                  {campuses.filter((c) => c.status !== "hidden" || c.id === v.campus).map((c) => <option key={c.id} value={c.id}>{campusName(c, lang)}</option>)}
                </select>
                {adminPerm && <span className="mt-1 block text-xs text-muted">{s.errors.admin_all_campuses}</span>}
              </label>
              <label className="flex items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-line">
                <input type="checkbox" checked={v.active} disabled={isSelf} onChange={(e) => set("active", e.target.checked)} className="mt-0.5 h-5 w-5 accent-[var(--navy)] disabled:opacity-50" />
                <span>
                  <span className="block text-sm font-semibold">{s.u.active}</span>
                  <span className="mt-0.5 block text-xs text-muted">{s.u.activeHelp}</span>
                </span>
              </label>
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

