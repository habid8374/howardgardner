"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, FlaskConical, Globe, LogOut, RotateCcw } from "lucide-react";
import {
  DEMO_PASSWORD, adminLang, loginGuard, pqrsfAlert, resetDemo, session, snapshot, subscribeDemo, type Admission, type Pqrsf,
} from "@/lib/demo-store";
import { adminDict, type AdminDict } from "@/lib/dictionaries/admin";
import AdmissionsPanel from "./AdmissionsPanel";
import PqrsfPanel from "./PqrsfPanel";

/* Panel del colegio — DEMO, en español e inglés.
   La "clave" es solo para la demostración: no es seguridad real.
   En producción: acceso con usuario y contraseña por persona, roles y registro de actividad. */

type Lang = "es" | "en";

function useDemoData() {
  const raw = useSyncExternalStore(
    subscribeDemo,
    // snapshot() siembra los ejemplos la primera vez y devuelve texto (estable entre renders)
    () => `${snapshot("admissions") ?? "[]"}\u0000${snapshot("pqrsf") ?? "[]"}`,
    () => null
  );
  return useMemo(() => {
    if (raw === null) return null;
    const [a, p] = raw.split("\u0000");
    return { admissions: JSON.parse(a) as Admission[], pqrsf: JSON.parse(p) as Pqrsf[] };
  }, [raw]);
}

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

function Login({ a, lang }: { a: AdminDict; lang: Lang }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <main className="flex min-h-svh items-center justify-center bg-ink px-4 py-16">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const wait = loginGuard.lockedFor();
          if (wait > 0) return setError(a.locked(Math.ceil(wait / 1000)));
          if (value === DEMO_PASSWORD) {
            loginGuard.reset();
            session.open();
            return;
          }
          const left = loginGuard.fail();
          setValue("");
          setError(left > 0 ? a.attemptsLeft(left) : a.locked(60));
        }}
        className="w-full max-w-md rounded-[28px] bg-paper p-8 text-ink sm:p-10"
      >
        <div className="flex items-start justify-between gap-4">
          <Image src="/howard_gardner_logo_sin_fondo.png" alt="" width={56} height={54} className="h-14 w-auto" />
          <LangToggle lang={lang} label={a.language} />
        </div>
        <h1 className="h-display mt-6 text-[2rem]">{a.title}</h1>
        <p className="mt-2 text-muted">{a.loginLead}</p>

        <p className="mt-6 flex items-start gap-3 rounded-xl border border-gold/50 bg-gold-soft/40 px-4 py-3 text-sm text-ink">
          <FlaskConical size={18} className="mt-0.5 flex-none" aria-hidden />
          <span>{a.loginDemo} <strong className="font-mono">{DEMO_PASSWORD}</strong></span>
        </p>

        <label htmlFor="clave" className="mt-6 block text-sm font-semibold">{a.password}</label>
        <input
          id="clave"
          type="password"
          autoComplete="current-password"
          value={value}
          maxLength={64}
          onChange={(e) => { setValue(e.target.value); setError(null); }}
          aria-invalid={!!error}
          aria-describedby={error ? "e-clave" : undefined}
          className="mt-2 block min-h-12 w-full rounded-xl border border-ink/20 bg-white px-4 text-base outline-none focus:border-navy focus:shadow-[0_0_0_3px_rgba(18,36,90,0.15)]"
        />
        {error && <p id="e-clave" role="alert" className="mt-1.5 text-sm font-medium text-red-700">{error}</p>}
        <button type="submit" className="btn btn-primary mt-6 w-full">{a.enter}</button>
        <Link href={`/${lang}`} className="link mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-navy">{a.backToSite}</Link>
      </form>
    </main>
  );
}

export default function AdminApp() {
  const open = useSyncExternalStore(subscribeDemo, session.isOpen, () => false);
  const lang = useSyncExternalStore(subscribeDemo, adminLang.get, () => "es" as Lang);
  const data = useDemoData();
  const [tab, setTab] = useState<"admisiones" | "pqrsf">("admisiones");
  const a = adminDict[lang];

  // Si se llega desde el pie de página en inglés (/admin?lang=en), el panel abre en inglés
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl === "en" || fromUrl === "es") adminLang.set(fromUrl);
  }, []);

  // El idioma del documento sigue al del panel (lectores de pantalla, traductores)
  useEffect(() => {
    document.documentElement.lang = lang === "es" ? "es-CO" : "en";
  }, [lang]);

  if (!open) return <Login a={a} lang={lang} />;
  if (!data) return <main className="min-h-svh bg-paper" />;

  const newAdmissions = data.admissions.filter((r) => r.status === "nueva").length;
  const now = new Date();
  const alerts = data.pqrsf.map((p) => pqrsfAlert(p, now).level);
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
            <button type="button" onClick={session.close} aria-label={a.logout} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-white/80 hover:bg-white/10 sm:px-4">
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
        </nav>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8">
        <p className="mb-6 flex items-start gap-3 rounded-xl border border-gold/50 bg-gold-soft/40 px-4 py-3 text-sm text-ink">
          <FlaskConical size={18} className="mt-0.5 flex-none" aria-hidden />
          <span>{a.demoBanner}</span>
        </p>

        {tab === "admisiones"
          ? <AdmissionsPanel rows={data.admissions} a={a} lang={lang} />
          : <PqrsfPanel rows={data.pqrsf} a={a} lang={lang} />}

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>{a.demoFooter}</p>
          <button
            type="button"
            onClick={() => window.confirm(a.resetConfirm) && resetDemo()}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/20 px-4 font-semibold text-ink hover:bg-paper-2"
          >
            <RotateCcw size={16} aria-hidden /> {a.reset}
          </button>
        </div>
      </main>
    </div>
  );
}
