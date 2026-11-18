"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, FlaskConical, Globe, LogOut, RotateCcw } from "lucide-react";
import {
  ApiError, CAMPUS_IDS, adminLang, fetchAll, pqrsfAlert, resetDemo, session, subscribeDemo, type Admission, type CampusId, type Pqrsf, type StaffUser,
} from "@/lib/records";
import { adminDict, type AdminDict } from "@/lib/dictionaries/admin";
import AdmissionsPanel from "./AdmissionsPanel";
import PqrsfPanel from "./PqrsfPanel";

/* Panel del colegio, en español e inglés.
   Acceso con usuario y contraseña verificados en el servidor; la sesión es una cookie segura.
   Los datos vienen de la base de datos (/api/admin/datos) y se recargan tras cada cambio
   y cada minuto, para ver lo que llega desde el sitio sin recargar la página. */

type Lang = "es" | "en";
type Data = { admissions: Admission[]; pqrsf: Pqrsf[] };
const DEMO_USER = "demo";
const DEMO_PASS = "colegio2027";

function LangToggle({ lang, label, dark }: { lang: Lang; label: string; dark?: boolean }) {
  const other: Lang = lang === "es" ? "en" : "es";
  return (
    <button
      type="button"
      onClick={() => adminLang.set(other)}
      aria-label={`${label}: ${other === "en" ? "English" : "Español"}`}
      title={other === "en" ? "English" : "Español"}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 text-xs font-bold uppercase tracking-wider transition-colors ${
        dark ? "border-white/20 text-white/85 hover:border-white/40 hover:text-white" : "border-ink/20 text-ink hover:bg-paper-2"
      }`}
    >
      <Globe size={15} aria-hidden /> {other}
    </button>
  );
}

function Login({ a, lang, demo, onLogin }: { a: AdminDict; lang: Lang; demo: boolean; onLogin: (u: StaffUser) => void }) {
  const [username, setUsername] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <main className="flex min-h-svh items-center justify-center bg-ink px-4 py-16">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            const { user } = await session.login(username, value);
            onLogin(user);
          } catch (err) {
            setValue("");
            const d = err instanceof ApiError ? err.data : {};
            if (err instanceof ApiError && err.status === 429) setError(a.locked(Number(d.wait) || 60));
            else if (err instanceof ApiError && err.status === 401) setError(a.badLogin(Number(d.left) || 0));
            else setError(a.loginError);
          } finally {
            setBusy(false);
          }
        }}
        className="w-full max-w-md rounded-[28px] bg-paper p-8 text-ink sm:p-10"
      >
        <div className="flex items-start justify-between gap-4">
          <Image src="/howard_gardner_logo_sin_fondo.png" alt="" width={56} height={54} className="h-14 w-auto" />
          <LangToggle lang={lang} label={a.language} />
        </div>
        <h1 className="h-display mt-6 text-[2rem]">{a.title}</h1>
        <p className="mt-2 text-muted">{a.loginLead}</p>

        {demo && (
          <p className="mt-6 flex items-start gap-3 rounded-xl border border-gold/50 bg-gold-soft/40 px-4 py-3 text-sm text-ink">
            <FlaskConical size={18} className="mt-0.5 flex-none" aria-hidden />
            <span>{a.loginDemo} <strong className="font-mono">{DEMO_USER}</strong> · <strong className="font-mono">{DEMO_PASS}</strong></span>
          </p>
        )}

        <label htmlFor="usuario" className="mt-6 block text-sm font-semibold">{a.username}</label>
        <input
          id="usuario"
          autoComplete="username"
          autoCapitalize="none"
          value={username}
          maxLength={60}
          onChange={(e) => { setUsername(e.target.value); setError(null); }}
          required
          className="mt-2 block min-h-12 w-full rounded-xl border border-ink/20 bg-white px-4 text-base outline-none focus:border-navy focus:shadow-[0_0_0_3px_rgba(18,36,90,0.15)]"
        />
        <label htmlFor="clave" className="mt-4 block text-sm font-semibold">{a.password}</label>
        <input
          id="clave"
          type="password"
          autoComplete="current-password"
          value={value}
          maxLength={128}
          required
          onChange={(e) => { setValue(e.target.value); setError(null); }}
          aria-invalid={!!error}
          aria-describedby={error ? "e-clave" : undefined}
          className="mt-2 block min-h-12 w-full rounded-xl border border-ink/20 bg-white px-4 text-base outline-none focus:border-navy focus:shadow-[0_0_0_3px_rgba(18,36,90,0.15)]"
        />
        {error && <p id="e-clave" role="alert" className="mt-1.5 text-sm font-medium text-red-700">{error}</p>}
        <button type="submit" disabled={busy} aria-busy={busy} className="btn btn-primary mt-6 w-full disabled:opacity-70">{busy ? a.loading : a.enter}</button>
        <Link href={`/${lang}`} className="link mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-navy">{a.backToSite}</Link>
      </form>
    </main>
  );
}

export default function AdminApp() {
  const lang = useSyncExternalStore(adminLang.subscribe, adminLang.get, () => "es" as Lang);
  const [auth, setAuth] = useState<{ user: StaffUser | null; demo: boolean } | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<"admisiones" | "pqrsf">("admisiones");
  const [campusPick, setCampusPick] = useState<CampusId | "">("");
  const a = adminDict[lang];
  const user = auth?.user ?? null;

  const load = useCallback(async () => {
    try {
      setData(await fetchAll());
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setAuth((s) => (s ? { ...s, user: null } : s));
    }
  }, []);

  // ¿Ya hay sesión?
  useEffect(() => {
    session.me().then(setAuth).catch(() => setAuth({ user: null, demo: false }));
  }, []);

  // Con sesión: cargar, recargar tras cada cambio y cada minuto
  useEffect(() => {
    if (!user) return;
    // Sincroniza con un sistema externo (la API): es el uso correcto de un efecto
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const off = subscribeDemo(load);
    const t = window.setInterval(load, 60_000);
    return () => { off(); window.clearInterval(t); };
  }, [user, load]);

  // Si se llega desde el pie de página en inglés (/admin?lang=en), el panel abre en inglés
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl === "en" || fromUrl === "es") adminLang.set(fromUrl);
  }, []);

  // El idioma del documento sigue al del panel (lectores de pantalla, traductores)
  useEffect(() => {
    document.documentElement.lang = lang === "es" ? "es-CO" : "en";
  }, [lang]);

  if (!auth) return <main className="min-h-svh bg-ink" />;
  if (!user) return <Login a={a} lang={lang} demo={auth.demo} onLogin={(u) => setAuth({ ...auth, user: u })} />;
  if (!data) return <main className="flex min-h-svh items-center justify-center bg-paper text-muted">{a.loading}</main>;

  // Sede: un usuario de sede solo ve la suya (el servidor ya filtra); quien ve todas puede elegir
  const campus: CampusId | "" = user.campus ?? campusPick;
  const view = campus
    ? { admissions: data.admissions.filter((r) => r.campus === campus), pqrsf: data.pqrsf.filter((r) => r.campus === campus) }
    : data;
  const campusLabel = campus ? a.campusNames[campus] : null;

  const newAdmissions = view.admissions.filter((r) => r.status === "nueva").length;
  const now = new Date();
  const alerts = view.pqrsf.map((p) => pqrsfAlert(p, now).level);
  const pqrsfUrgent = alerts.filter((l) => l === "vencida" || l === "hoy").length;
  const pqrsfOpen = alerts.filter((l) => l !== "cerrada").length;

  const tabs = [
    { key: "admisiones" as const, label: a.tabs.admissions, count: newAdmissions, urgent: false },
    { key: "pqrsf" as const, label: a.tabs.pqrsf, count: pqrsfUrgent || pqrsfOpen, urgent: pqrsfUrgent > 0 },
  ];

  return (
    <div className="min-h-svh bg-paper">
      <header className="sticky top-0 z-30 bg-ink text-white">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-8">
          <Image src="/howard_gardner_logo_sin_fondo.png" alt="" width={36} height={35} className="h-9 w-auto" />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-bold">{a.title}</p>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold">{a.subtitle}</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <LangToggle lang={lang} label={a.language} dark />
            <Link href={`/${lang}`} target="_blank" rel="noopener" className="hidden min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-white/80 hover:bg-white/10 sm:inline-flex">
              <ExternalLink size={16} aria-hidden /> {a.viewSite}
            </Link>
            <button
              type="button"
              onClick={async () => { await session.logout().catch(() => {}); setData(null); setAuth({ ...auth, user: null }); }}
              aria-label={a.logout} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-white/80 hover:bg-white/10 sm:px-4">
              <LogOut size={16} aria-hidden /> <span className="hidden sm:inline">{a.logout}</span>
            </button>
          </div>
        </div>
        <nav aria-label={a.sections} className="mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-4 sm:px-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-current={tab === t.key ? "page" : undefined}
              className={`inline-flex min-h-12 flex-none items-center gap-2 border-b-2 px-4 text-sm font-semibold transition-colors ${
                tab === t.key ? "border-gold text-white" : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${t.urgent ? "bg-red-600 text-white" : "bg-gold text-ink"}`}>{t.count}</span>
              )}
            </button>
          ))}
          <div className="ml-auto flex flex-none items-center gap-2 py-2 pl-4">
            {user.campus ? (
              <span className="rounded-full border border-gold/50 px-3 py-1.5 text-xs font-bold text-gold">{a.campusOnly}: {a.campusNames[user.campus]}</span>
            ) : (
              <label className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <span className="hidden sm:inline">{a.campus}</span>
                <select
                  value={campusPick}
                  onChange={(e) => setCampusPick(e.target.value as CampusId | "")}
                  className="min-h-9 rounded-full border border-white/25 bg-ink px-3 text-sm font-semibold text-white outline-none focus:border-gold"
                >
                  <option value="">{a.campusAll}</option>
                  {CAMPUS_IDS.map((id) => <option key={id} value={id}>{a.campusNames[id]}</option>)}
                </select>
              </label>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8">
        {auth.demo && (
          <p className="mb-6 flex items-start gap-3 rounded-xl border border-gold/50 bg-gold-soft/40 px-4 py-3 text-sm text-ink">
            <FlaskConical size={18} className="mt-0.5 flex-none" aria-hidden />
            <span>{a.demoBanner}</span>
          </p>
        )}

        {tab === "admisiones"
          ? <AdmissionsPanel key={`a-${campus}`} rows={view.admissions} a={a} lang={lang} userName={user.name} campusLabel={campusLabel} />
          : <PqrsfPanel key={`p-${campus}`} rows={view.pqrsf} a={a} lang={lang} userName={user.name} campusLabel={campusLabel} />}

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>{auth.demo ? a.demoFooter : ""} {user.name}</p>
          {auth.demo && user.role === "admin" && <button
            type="button"
            onClick={() => window.confirm(a.resetConfirm) && resetDemo().catch(() => window.alert(a.saveError))}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/20 px-4 font-semibold text-ink hover:bg-paper-2"
          >
            <RotateCcw size={16} aria-hidden /> {a.reset}
          </button>}
        </div>
      </main>
    </div>
  );
}
