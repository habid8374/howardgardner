"use client";

import { useSyncExternalStore } from "react";
import { MapPin } from "lucide-react";
import { consent, parseConsent } from "@/lib/consent";

/* El mapa de Google pone cookies de terceros: solo se carga con permiso. */
export default function MapEmbed({ src, title, blocked, loadLabel }: { src: string; title: string; blocked: string; loadLabel: string }) {
  const raw = useSyncExternalStore(consent.subscribe, consent.snapshot, () => "");
  const current = parseConsent(raw);

  if (current?.maps) {
    return <iframe src={src} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />;
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-gold">
        <MapPin size={24} aria-hidden />
      </span>
      <p className="max-w-xs text-[0.95rem] text-muted">{blocked}</p>
      <button
        type="button"
        onClick={() => consent.set({ maps: true, stats: current?.stats ?? false })}
        className="btn btn-ghost on-light !min-h-11 !text-sm text-ink"
      >
        {loadLabel}
      </button>
    </div>
  );
}
