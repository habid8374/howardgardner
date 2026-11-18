/* ─────────────────────────────────────────────────────────────
   ALMACENAMIENTO DE DEMOSTRACIÓN
   Todo se guarda en el navegador (localStorage) de quien prueba la demo.
   No se envía nada a ningún servidor: así la demo no recoge datos
   personales reales. En producción esto se reemplaza por una base de
   datos con acceso protegido (ver PENDIENTES.md).
   ───────────────────────────────────────────────────────────── */

export type AdmissionStatus =
  | "nueva" | "contactada" | "visita" | "evaluacion" | "admitido" | "no_admitido" | "matriculado";

export type PqrsfType = "peticion" | "queja" | "reclamo" | "sugerencia" | "felicitacion";
export type PqrsfStatus = "radicada" | "en_tramite" | "respondida" | "cerrada";
export type PqrsfPriority = "alta" | "media" | "baja";

export type Note = { at: string; text: string };

export type Admission = {
  id: string;            // HG-2027-0001
  createdAt: string;     // ISO
  lang: "es" | "en";
  guardian: string;
  phone: string;
  grade: string;
  message: string;
  status: AdmissionStatus;
  notes: Note[];
  sample?: boolean;
};

export type Pqrsf = {
  id: string;            // PQRSF-2026-0001
  createdAt: string;
  lang: "es" | "en";
  type: PqrsfType;
  name: string;
  email: string;
  phone: string;
  student: string;
  grade: string;
  subject: string;
  description: string;
  attachment: string;    // solo el nombre del archivo en la demo
  urgent: boolean;       // el acudiente la marcó como urgente
  priority: PqrsfPriority;
  status: PqrsfStatus;
  answer: string;
  notes: Note[];
  sample?: boolean;
};

/* Listas de valores. Los textos (español / inglés) están en lib/dictionaries/admin.ts. */
export const ADMISSION_STATUSES: AdmissionStatus[] = ["nueva", "contactada", "visita", "evaluacion", "admitido", "no_admitido", "matriculado"];
export const PQRSF_STATUSES: PqrsfStatus[] = ["radicada", "en_tramite", "respondida", "cerrada"];
export const PQRSF_TYPES: PqrsfType[] = ["peticion", "queja", "reclamo", "sugerencia", "felicitacion"];
export const PRIORITIES: PqrsfPriority[] = ["alta", "media", "baja"];

/* Plazos en días hábiles según la prioridad. El máximo (15) es el plazo de referencia.
   TODO(CLIENTE): validar plazos y criterios de prioridad con el abogado del colegio. */
export const PQRSF_DAYS = 15;
export const PRIORITY_DAYS: Record<PqrsfPriority, number> = { alta: 5, media: 10, baja: 15 };
/* Prioridad inicial según el tipo (el colegio la puede cambiar en el panel). */
export const DEFAULT_PRIORITY: Record<PqrsfType, PqrsfPriority> = {
  queja: "alta", reclamo: "alta", peticion: "media", sugerencia: "baja", felicitacion: "baja",
};
/* Días hábiles restantes a partir de los cuales se alerta "vence pronto". */
export const SOON_DAYS = 2;

const KEYS = { admissions: "hg-demo-admisiones", pqrsf: "hg-demo-pqrsf-v2", session: "hg-demo-sesion", adminLang: "hg-admin-idioma" };

/* ── Fechas ── */
export function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}

export function businessDaysBetween(from: Date, to: Date) {
  const a = new Date(from); a.setHours(0, 0, 0, 0);
  const b = new Date(to); b.setHours(0, 0, 0, 0);
  const sign = b >= a ? 1 : -1;
  let count = 0;
  const d = new Date(sign > 0 ? a : b);
  const end = sign > 0 ? b : a;
  while (d < end) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return count * sign;
}

export function pqrsfDue(p: Pick<Pqrsf, "createdAt" | "priority">) {
  return addBusinessDays(new Date(p.createdAt), PRIORITY_DAYS[p.priority] ?? PQRSF_DAYS);
}

export type DueLevel = "vencida" | "hoy" | "pronto" | "a_tiempo" | "cerrada";
/** Estado del plazo de una PQRSF: vencida, vence hoy, vence pronto, a tiempo o cerrada. */
export function pqrsfAlert(p: Pick<Pqrsf, "createdAt" | "priority" | "status">, now = new Date()): { level: DueLevel; days: number } {
  if (p.status === "respondida" || p.status === "cerrada") return { level: "cerrada", days: 0 };
  const days = businessDaysBetween(now, pqrsfDue(p));
  if (days < 0) return { level: "vencida", days };
  if (days === 0) return { level: "hoy", days };
  if (days <= SOON_DAYS) return { level: "pronto", days };
  return { level: "a_tiempo", days };
}

const PRIORITY_ORDER: Record<PqrsfPriority, number> = { alta: 0, media: 1, baja: 2 };
const LEVEL_ORDER: Record<DueLevel, number> = { vencida: 0, hoy: 1, pronto: 2, a_tiempo: 3, cerrada: 4 };
/** Orden de atención: primero lo vencido y lo más urgente. */
export function byUrgency(now = new Date()) {
  return (a: Pqrsf, b: Pqrsf) => {
    const la = pqrsfAlert(a, now), lb = pqrsfAlert(b, now);
    return LEVEL_ORDER[la.level] - LEVEL_ORDER[lb.level]
      || la.days - lb.days
      || PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      || b.createdAt.localeCompare(a.createdAt);
  };
}

/* ── Datos de ejemplo (ficticios) para que el panel no se vea vacío ── */
function daysAgo(n: number, hour = 9) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
}

function sampleAdmissions(): Admission[] {
  const rows: [string, string, string, AdmissionStatus, number, string][] = [
    ["Familia Ejemplo Uno", "300 000 0001", "Transición", "nueva", 0, "Queremos conocer el colegio."],
    ["Familia Ejemplo Dos", "300 000 0002", "1°", "nueva", 1, ""],
    ["Familia Ejemplo Tres", "300 000 0003", "Prejardín", "contactada", 3, "¿Tienen transporte?"],
    ["Familia Ejemplo Cuatro", "300 000 0004", "6°", "visita", 5, "Viene de otro colegio de Sabanalarga."],
    ["Familia Ejemplo Cinco", "300 000 0005", "10°", "evaluacion", 9, ""],
    ["Familia Ejemplo Seis", "300 000 0006", "Jardín", "admitido", 14, ""],
    ["Familia Ejemplo Siete", "300 000 0007", "3°", "matriculado", 21, ""],
  ];
  return rows.map(([guardian, phone, grade, status, ago, message], i) => ({
    id: `HG-2027-${String(i + 1).padStart(4, "0")}`,
    createdAt: daysAgo(ago, 8 + i),
    lang: "es",
    guardian, phone, grade, message, status,
    notes: status === "nueva" ? [] : [{ at: daysAgo(Math.max(ago - 1, 0), 15), text: "Se llamó a la familia. (ejemplo)" }],
    sample: true,
  }));
}

function businessDaysAgo(n: number, hour = 10) {
  const d = new Date();
  let left = n;
  while (left > 0) {
    d.setDate(d.getDate() - 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) left--;
  }
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function samplePqrsf(): Pqrsf[] {
  // [tipo, prioridad, asunto, descripción, estado, días hábiles atrás, urgente]
  const rows: [PqrsfType, PqrsfPriority, string, string, PqrsfStatus, number, boolean][] = [
    ["queja", "alta", "Demora en la salida", "La entrega de los niños a la salida se demoró varios días.", "en_tramite", 7, false],
    ["peticion", "media", "Solicitud de certificado de estudios", "Necesito un certificado de estudios para un trámite.", "radicada", 10, false],
    ["reclamo", "alta", "Cobro duplicado", "En el extracto aparece un cobro repetido.", "en_tramite", 4, true],
    ["sugerencia", "baja", "Horario de la cafetería", "Sugerimos ampliar el horario de la cafetería en el descanso.", "radicada", 3, false],
    ["felicitacion", "baja", "Felicitaciones por el A+", "Felicitaciones a todo el equipo por la categoría A+.", "respondida", 6, false],
    ["peticion", "media", "Constancia para EPS", "Solicito una constancia de matrícula para la EPS.", "cerrada", 12, false],
  ];
  return rows.map(([type, priority, subject, description, status, ago, urgent], i) => ({
    id: `PQRSF-2026-${String(i + 1).padStart(4, "0")}`,
    createdAt: businessDaysAgo(ago, 9 + i),
    lang: "es",
    type, priority, subject, description, status, urgent,
    name: `Acudiente de ejemplo ${i + 1}`,
    email: `acudiente${i + 1}@ejemplo.com`,
    phone: `300 000 01${i}`,
    student: `Estudiante de ejemplo ${i + 1}`,
    grade: ["2°", "5°", "Transición", "11°", "8°", "3°"][i],
    attachment: i === 2 ? "extracto.pdf" : "",
    answer: status === "respondida" || status === "cerrada" ? "Gracias por escribirnos. Damos respuesta a su solicitud. (ejemplo)" : "",
    notes: [],
    sample: true,
  }));
}

/* ── Lectura y escritura segura ── */
function read<T>(key: string, seed: () => T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T[];
    const data = seed();
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  } catch {
    return seed();
  }
}

function write<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("hg-demo-change"));
  } catch {}
}

function nextId(prefix: string, list: { id: string }[]) {
  const max = list.reduce((m, r) => Math.max(m, Number(r.id.split("-").pop()) || 0), 0);
  return `${prefix}-${String(max + 1).padStart(4, "0")}`;
}

/* ── Preinscripciones ── */
export const admissionsStore = {
  list: () => read<Admission>(KEYS.admissions, sampleAdmissions),
  add(input: Omit<Admission, "id" | "createdAt" | "status" | "notes">) {
    const list = this.list();
    const row: Admission = { ...input, id: nextId("HG-2027", list), createdAt: new Date().toISOString(), status: "nueva", notes: [] };
    write(KEYS.admissions, [row, ...list]);
    return row;
  },
  update(id: string, patch: Partial<Admission>) {
    write(KEYS.admissions, this.list().map((r) => (r.id === id ? { ...r, ...patch } : r)));
  },
};

/* ── PQRSF ── */
export const pqrsfStore = {
  // Registros guardados antes de existir la prioridad: se completa según el tipo.
  list: () =>
    read<Pqrsf>(KEYS.pqrsf, samplePqrsf).map((r) =>
      r.priority ? r : { ...r, urgent: false, priority: DEFAULT_PRIORITY[r.type] }
    ),
  add(input: Omit<Pqrsf, "id" | "createdAt" | "status" | "notes" | "answer" | "priority">) {
    const list = this.list();
    const priority: PqrsfPriority = input.urgent ? "alta" : DEFAULT_PRIORITY[input.type];
    const row: Pqrsf = { ...input, priority, id: nextId("PQRSF-2026", list), createdAt: new Date().toISOString(), status: "radicada", answer: "", notes: [] };
    write(KEYS.pqrsf, [row, ...list]);
    return row;
  },
  find(id: string) {
    const clean = id.trim().toUpperCase();
    return this.list().find((r) => r.id === clean);
  },
  update(id: string, patch: Partial<Pqrsf>) {
    write(KEYS.pqrsf, this.list().map((r) => (r.id === id ? { ...r, ...patch } : r)));
  },
};

/* ── Sesión del panel (solo demostración, no es seguridad real) ── */
export const DEMO_PASSWORD = "colegio2027";
const notify = () => window.dispatchEvent(new Event("hg-demo-change"));
export const session = {
  isOpen: () => { try { return sessionStorage.getItem(KEYS.session) === "1"; } catch { return false; } },
  open: () => { try { sessionStorage.setItem(KEYS.session, "1"); } catch {} notify(); },
  close: () => { try { sessionStorage.removeItem(KEYS.session); } catch {} notify(); },
};

/* ── Suscripción para useSyncExternalStore ── */
export function subscribeDemo(cb: () => void) {
  window.addEventListener("hg-demo-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("hg-demo-change", cb);
    window.removeEventListener("storage", cb);
  };
}

/** Devuelve el texto guardado (estable entre renders); siembra los ejemplos la primera vez. */
export function snapshot(kind: "admissions" | "pqrsf"): string | null {
  try {
    // Texto con los registros ya completados; al ser texto, React lo compara por valor.
    return JSON.stringify(kind === "admissions" ? admissionsStore.list() : pqrsfStore.list());
  } catch {
    return null;
  }
}

/* Idioma del panel (español por defecto). */
export const adminLang = {
  get: (): "es" | "en" => { try { return localStorage.getItem(KEYS.adminLang) === "en" ? "en" : "es"; } catch { return "es"; } },
  set: (lang: "es" | "en") => { try { localStorage.setItem(KEYS.adminLang, lang); } catch {} notify(); },
};

export function resetDemo() {
  try {
    localStorage.removeItem(KEYS.admissions);
    localStorage.removeItem(KEYS.pqrsf);
    window.dispatchEvent(new Event("hg-demo-change"));
  } catch {}
}

/* ── Exportación a Excel (CSV con separador ; y BOM, como lo abre Excel en Colombia) ── */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => {
    const s = String(v ?? "").replace(/\r?\n/g, " ");
    return /[;"]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = "﻿" + [headers, ...rows].map((r) => r.map(esc).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function formatDate(iso: string, lang: "es" | "en" = "es", withTime = false) {
  return new Date(iso).toLocaleDateString(lang === "es" ? "es-CO" : "en-US", {
    day: "numeric", month: "short", year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
}
