"use client";

import { useSyncExternalStore } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { consent, parseConsent } from "@/lib/consent";

/* Las estadísticas de visitas solo se cargan si la persona lo permitió. */
export default function ConsentAnalytics() {
  const raw = useSyncExternalStore(consent.subscribe, consent.snapshot, () => "");
  if (!parseConsent(raw)?.stats) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
