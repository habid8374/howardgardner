"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { consent, parseConsent } from "@/lib/consent";
import { href, type Lang } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";

type Props = { lang: Lang; t: Dict["cookies"] };

function Switch({ checked, onChange, disabled, label }: { checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-7 w-12 flex-none rounded-full transition-colors duration-200 disabled:opacity-60 ${checked ? "bg-navy" : "bg-ink/20"}`}
    >
      <span
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
        style={{ left: 4, transform: checked ? "translateX(20px)" : "none", transitionTimingFunction: "var(--ease-out)" }}
      />
    </button>
  );
}

/* Aviso de cookies: aparece en la primera visita y cuando se abre desde el pie de página. */
export default function CookieBanner({ lang, t }: Props) {
  const raw = useSyncExternalStore(consent.subscribe, consent.snapshot, () => "server");
  const current = raw === "server" ? null : parseConsent(raw);
  const [reopened, setReopened] = useState(false);
  const [settings, setSettings] = useState(false);
  const [maps, setMaps] = useState(true);
  const [stats, setStats] = useState(true);

  useEffect(
    () =>
      consent.onOpen(() => {
        const c = consent.get();
        setMaps(c?.maps ?? true);
        setStats(c?.stats ?? true);
        setSettings(true);
        setReopened(true);
      }),
    []
  );

  const visible = raw !== "server" && (current === null || reopened);
  if (!visible) return null;

  const choose = (choice: { maps: boolean; stats: boolean }) => {
    consent.set(choice);
    setReopened(false);
    setSettings(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookies-titulo"
      className="cookie-banner fixed inset-x-3 bottom-[88px] z-[60] rounded-3xl bg-paper p-5 text-ink shadow-[0_24px_60px_-20px_rgba(12,22,49,0.55)] ring-1 ring-black/5 sm:p-6 md:inset-x-auto md:bottom-6 md:left-6 md:max-w-[440px]"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ink text-gold">
          <Cookie size={20} aria-hidden />
        </span>
        <div>
          <h2 id="cookies-titulo" className="h-display text-[1.35rem]">{t.title}</h2>
          <p className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">
            {t.body}{" "}
            <Link href={href(lang, "cookies")} className="font-semibold text-navy underline underline-offset-2">{t.policy}</Link>
          </p>
        </div>
      </div>

      {settings && (
        <ul className="mt-4 flex flex-col divide-y divide-line rounded-2xl border border-line bg-white">
          {(["necessary", "maps", "stats"] as const).map((k) => (
            <li key={k} className="flex items-start justify-between gap-4 p-3.5">
              <div>
                <p className="text-sm font-bold">{t.categories[k].t}</p>
                <p className="mt-0.5 text-[0.82rem] leading-snug text-muted">{t.categories[k].d}</p>
                {k === "necessary" && <p className="mt-1 text-xs font-semibold text-navy">{t.always}</p>}
              </div>
              {k === "necessary" ? (
                <Switch checked disabled label={t.categories[k].t} />
              ) : (
                <Switch
                  checked={k === "maps" ? maps : stats}
                  onChange={k === "maps" ? setMaps : setStats}
                  label={t.categories[k].t}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {settings ? (
          <button type="button" onClick={() => choose({ maps, stats })} className="btn btn-primary col-span-2 !min-h-11 !text-sm">
            {t.save}
          </button>
        ) : (
          <>
            <button type="button" onClick={() => choose({ maps: true, stats: true })} className="btn btn-primary !min-h-11 !px-3 !text-sm">
              {t.acceptAll}
            </button>
            <button type="button" onClick={() => choose({ maps: false, stats: false })} className="btn btn-ghost on-light !min-h-11 !px-3 !text-sm text-ink">
              {t.necessaryOnly}
            </button>
            <button type="button" onClick={() => setSettings(true)} className="link col-span-2 inline-flex min-h-11 items-center justify-center text-sm font-semibold text-navy">
              {t.configure}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
