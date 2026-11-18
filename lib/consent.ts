/* Consentimiento de cookies (Ley 1581 de 2012 y guía de la SIC).
   - Necesarias: siempre activas (idioma elegido y esta misma elección).
   - Mapas: el mapa de Google, que pone cookies de terceros. Solo se carga con permiso.
   - Estadísticas: medición anónima de visitas. Solo se activa con permiso.
   La elección se guarda en el navegador de la persona y se puede cambiar desde el pie de página. */

export type Consent = { v: 1; maps: boolean; stats: boolean; at: string };

const KEY = "hg-consent";
const CHANGE = "hg-consent-change";
const OPEN = "hg-consent-open";

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    return c && c.v === 1 ? c : null;
  } catch {
    return null;
  }
}

export const consent = {
  /** Texto estable para useSyncExternalStore ("" = aún no ha elegido). */
  snapshot(): string {
    try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; }
  },
  get: read,
  set(choice: { maps: boolean; stats: boolean }) {
    const value: Consent = { v: 1, ...choice, at: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(value)); } catch {}
    window.dispatchEvent(new Event(CHANGE));
  },
  subscribe(cb: () => void) {
    window.addEventListener(CHANGE, cb);
    window.addEventListener("storage", cb);
    return () => {
      window.removeEventListener(CHANGE, cb);
      window.removeEventListener("storage", cb);
    };
  },
  /** Abre de nuevo el aviso para cambiar la elección. */
  open() { window.dispatchEvent(new Event(OPEN)); },
  onOpen(cb: () => void) {
    window.addEventListener(OPEN, cb);
    return () => window.removeEventListener(OPEN, cb);
  },
};

export function parseConsent(raw: string): Consent | null {
  if (!raw) return null;
  try {
    const c = JSON.parse(raw) as Consent;
    return c && c.v === 1 ? c : null;
  } catch {
    return null;
  }
}
