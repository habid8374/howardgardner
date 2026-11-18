"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, FlaskConical, LogOut, RotateCcw } from "lucide-react";
import { DEMO_PASSWORD, resetDemo, session, snapshot, subscribeDemo, type Admission, type Pqrsf } from "@/lib/demo-store";
import AdmissionsPanel from "./AdmissionsPanel";
import PqrsfPanel from "./PqrsfPanel";

/* Panel del colegio — DEMO.
   La "clave" es solo para la demostración: no es seguridad real.
   En producción: acceso con usuario y contraseña por persona, roles y registro de actividad. */

function useDemoData() {
  const raw = useSyncExternalStore(
    subscribeDemo,
    // snapshot() siembra los ejemplos la primera vez y devuelve el texto guardado (estable)
    () => `${snapshot("admissions") ?? "[]"}\u0000${snapshot("pqrsf") ?? "[]"}`,
    () => null
  );
  return useMemo(() => {
    if (raw === null) return null;
    const [a, p] = raw.split("\u0000");
    return { admissions: JSON.parse(a) as Admission[], pqrsf: JSON.parse(p) as Pqrsf[] };
  }, [raw]);
}

function Login() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  return (
    <main className="flex min-h-svh items-center justify-center bg-ink px-4 py-16">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim() === DEMO_PASSWORD) session.open();
          else setError(true);
        }}
        className="w-full max-w-md rounded-[28px] bg-paper p-8 text-ink sm:p-10"
      >
        <Image src="/howard_gardner_logo_sin_fondo.png" alt="" width={56} height={54} className="h-14 w-auto" />
        <h1 className="h-display mt-6 text-[2rem]">Panel del colegio</h1>
        <p className="mt-2 text-muted">Preinscripciones y PQRSF de Howard Gardner Bilingual School.</p>

        <p className="mt-6 flex items-start gap-3 rounded-xl border border-gold/50 bg-gold-soft/40 px-4 py-3 text-sm text-ink">
          <FlaskConical size={18} className="mt-0.5 flex-none" aria-hidden />
          <span>
            Demostración. Clave de prueba: <strong className="font-mono">{DEMO_PASSWORD}</strong>
          </span>
        </p>

        <label htmlFor="clave" className="mt-6 block text-sm font-semibold">Clave</label>
        <input
          id="clave"
          type="password"
          autoComplete="current-password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          aria-invalid={error}
          aria-describedby={error ? "e-clave" : undefined}
          className="mt-2 block min-h-12 w-full rounded-xl border border-ink/20 bg-white px-4 text-base outline-none focus:border-navy focus:shadow-[0_0_0_3px_rgba(18,36,90,0.15)]"
        />
        {error && <p id="e-clave" className="mt-1.5 text-sm font-medium text-red-700">Clave incorrecta.</p>}
        <button type="submit" className="btn btn-primary mt-6 w-full">Entrar</button>
        <Link href="/es" className="link mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-navy">← Volver al sitio</Link>
      </form>
    </main>
  );
}

export default function AdminApp() {
  const open = useSyncExternalStore(subscribeDemo, session.isOpen, () => false);
  const data = useDemoData();
  const [tab, setTab] = useState<"admisiones" | "pqrsf">("admisiones");

  if (!open) return <Login />;
  if (!data) return <main className="min-h-svh bg-paper" />;

  const newAdmissions = data.admissions.filter((a) => a.status === "nueva").length;
  const openPqrsf = data.pqrsf.filter((p) => p.status === "radicada" || p.status === "en_tramite").length;

  return (
    <div className="min-h-svh bg-paper">
      <header className="sticky top-0 z-30 bg-ink text-white">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-8">
          <Image src="/howard_gardner_logo_sin_fondo.png" alt="" width={36} height={35} className="h-9 w-auto" />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-bold">Panel del colegio</p>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold">Howard Gardner · Demo</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Link href="/es" target="_blank" rel="noopener" className="hidden min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-white/80 hover:bg-white/10 sm:inline-flex">
              <ExternalLink size={16} aria-hidden /> Ver sitio
            </Link>
            <button type="button" onClick={session.close} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-white/80 hover:bg-white/10">
              <LogOut size={16} aria-hidden /> Salir
            </button>
          </div>
        </div>
        <nav aria-label="Secciones del panel" className="mx-auto flex max-w-[1400px] gap-1 px-4 sm:px-8">
          {([
            ["admisiones", "Preinscripciones", newAdmissions],
            ["pqrsf", "PQRSF", openPqrsf],
          ] as const).map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-current={tab === key ? "page" : undefined}
              className={`inline-flex min-h-12 items-center gap-2 border-b-2 px-4 text-sm font-semibold transition-colors ${
                tab === key ? "border-gold text-white" : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              {label}
              {count > 0 && <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-ink">{count}</span>}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8">
        <p className="mb-6 flex items-start gap-3 rounded-xl border border-gold/50 bg-gold-soft/40 px-4 py-3 text-sm text-ink">
          <FlaskConical size={18} className="mt-0.5 flex-none" aria-hidden />
          <span>
            Demostración: los registros marcados como <em>ejemplo</em> son ficticios. Lo que se envíe desde los formularios del sitio en
            este navegador aparece aquí al instante.
          </span>
        </p>

        {tab === "admisiones" ? <AdmissionsPanel rows={data.admissions} /> : <PqrsfPanel rows={data.pqrsf} />}

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>Los datos de esta demo viven solo en este navegador.</p>
          <button
            type="button"
            onClick={() => window.confirm("¿Restablecer la demo? Se borran los envíos de prueba y vuelven los datos de ejemplo.") && resetDemo()}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/20 px-4 font-semibold text-ink hover:bg-paper-2"
          >
            <RotateCcw size={16} aria-hidden /> Restablecer demo
          </button>
        </div>
      </main>
    </div>
  );
}

