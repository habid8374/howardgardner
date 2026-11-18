"use client";

import { consent } from "@/lib/consent";

/* Abre de nuevo el aviso de cookies para cambiar la elección. */
export default function CookiePrefsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => consent.open()} className={className}>
      {label}
    </button>
  );
}
