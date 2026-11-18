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
  status: PqrsfStatus;
  answer: string;
  notes: Note[];
  sample?: boolean;
};

export const ADMISSION_STATUS: Record<AdmissionStatus, string> = {
  nueva: "Nueva",
  contactada: "Contactada",
  visita: "Visita agendada",
  evaluacion: "En evaluación",
  admitido: "Admitido",
  no_admitido: "No admitido",
  matriculado: "Matriculado",
};

export const PQRSF_STATUS: Record<PqrsfStatus, string> = {
  radicada: "Radicada",
  en_tramite: "En trámite",
  respondida: "Respondida",
  cerrada: "Cerrada",
};

export const PQRSF_TYPE: Record<PqrsfType, string> = {
  peticion: "Petición",
  queja: "Queja",
  reclamo: "Reclamo",
  sugerencia: "Sugerencia",
  felicitacion: "Felicitación",
};

/* Plazo de referencia en días hábiles. TODO(CLIENTE): validar con el abogado del colegio. */
export const PQRSF_DAYS = 15;

const KEYS = { admissions: "hg-demo-admisiones", pqrsf: "hg-demo-pqrsf", session: "hg-demo-sesion" };

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

export function pqrsfDue(p: Pick<Pqrsf, "createdAt">) {
  return addBusinessDays(new Date(p.createdAt), PQRSF_DAYS);
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

function samplePqrsf(): Pqrsf[] {
  const rows: [PqrsfType, string, string, PqrsfStatus, number][] = [
    ["peticion", "Solicitud de certificado de estudios", "Necesito un certificado de estudios para un trámite.", "radicada", 1],
    ["sugerencia", "Horario de la cafetería", "Sugerimos ampliar el horario de la cafetería en el descanso.", "en_tramite", 6],
    ["queja", "Demora en la salida", "La entrega de los niños a la salida se demoró varios días.", "en_tramite", 13],
    ["felicitacion", "Felicitaciones por el A+", "Felicitaciones a todo el equipo por la categoría A+.", "respondida", 8],
    ["reclamo", "Cobro duplicado", "En el extracto aparece un cobro repetido.", "cerrada", 20],
  ];
  return rows.map(([type, subject, description, status, ago], i) => ({
    id: `PQRSF-2026-${String(i + 1).padStart(4, "0")}`,
    createdAt: daysAgo(ago, 10 + i),
    lang: "es",
    type, subject, description, status,
    name: `Acudiente de ejemplo ${i + 1}`,
    email: `acudiente${i + 1}@ejemplo.com`,
    phone: `300 000 01${i}`,
    student: `Estudiante de ejemplo ${i + 1}`,
    grade: ["2°", "5°", "Transición", "11°", "8°"][i],
    attachment: i === 4 ? "extracto.pdf" : "",
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
  list: () => read<Pqrsf>(KEYS.pqrsf, samplePqrsf),
  add(input: Omit<Pqrsf, "id" | "createdAt" | "status" | "notes" | "answer">) {
    const list = this.list();
    const row: Pqrsf = { ...input, id: nextId("PQRSF-2026", list), createdAt: new Date().toISOString(), status: "radicada", answer: "", notes: [] };
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
    if (kind === "admissions") admissionsStore.list(); else pqrsfStore.list();
    return localStorage.getItem(kind === "admissions" ? KEYS.admissions : KEYS.pqrsf);
  } catch {
    return null;
  }
}

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
