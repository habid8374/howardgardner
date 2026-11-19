/* ─────────────────────────────────────────────────────────────
   REGISTROS: preinscripciones y PQRSF
   Tipos, plazos y utilidades compartidas entre el navegador y el servidor,
   y las funciones del navegador que hablan con la API (/api/...).
   Los datos viven en la base de datos (Neon); los adjuntos, en Vercel Blob privado.
   ───────────────────────────────────────────────────────────── */

export type AdmissionStatus =
  | "nueva" | "contactada" | "visita" | "evaluacion" | "admitido" | "no_admitido" | "matriculado";

export type PqrsfType = "peticion" | "queja" | "reclamo" | "sugerencia" | "felicitacion";
export type PqrsfStatus = "radicada" | "en_tramite" | "respondida" | "cerrada";
export type PqrsfPriority = "alta" | "media" | "baja";

export type Note = { at: string; text: string; by?: string };
/* Historial de cambios (OWASP A09): se guarda en el servidor con el usuario que hizo cada cambio. */
export type HistoryEntry = { at: string; field: "status" | "priority" | "answer"; value: string; by?: string };

/* Límites de tamaño de cada campo (OWASP ASVS V2: validación de entradas). */
export const LIMITS = {
  name: 100, phone: 20, email: 254, grade: 40, subject: 150, message: 1000,
  description: 3000, answer: 3000, note: 500, filename: 120,
} as const;
export const MAX_FILE_MB = 5;
export const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

/** Quita caracteres de control y recorta al límite. */
export function clean(value: string, max: number) {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

/* ── Sedes: se crean y editan desde el panel (tabla campuses) ── */
export type CampusId = string;
export type CampusStatus = "open" | "soon" | "hidden";
export const CAMPUS_STATUSES: CampusStatus[] = ["open", "soon", "hidden"];
export type Campus = {
  id: CampusId;
  nameEs: string; nameEn: string;
  status: CampusStatus;
  address: string; city: string;
  phone: string; whatsapp: string; email: string;
  hoursEs: string; hoursEn: string;
  grades: string;
  mapsUrl: string;
  notifyEmail: string;          // solo en el panel; nunca se publica
  noteEs: string; noteEn: string;
  sort: number;
};
/** Lo que se publica de una sede en el sitio (sin el correo interno de avisos). */
export type PublicCampus = Omit<Campus, "notifyEmail">;
/** Sede como opción de un formulario público */
export type CampusOption = { id: CampusId; name: string; soon: boolean };
export const campusName = (c: Pick<Campus, "nameEs" | "nameEn">, lang: "es" | "en") => (lang === "en" && c.nameEn) || c.nameEs;

/* ── Permisos del panel ── */
export type Access = "none" | "ver" | "gestionar";
export type Perms = { admisiones: Access; pqrsf: Access; exportar: boolean; sedes: boolean; usuarios: boolean };
export const PERM_PRESETS: Record<"rectoria" | "coordinacion" | "consulta", Perms> = {
  rectoria: { admisiones: "gestionar", pqrsf: "gestionar", exportar: true, sedes: true, usuarios: true },
  coordinacion: { admisiones: "gestionar", pqrsf: "gestionar", exportar: true, sedes: false, usuarios: false },
  consulta: { admisiones: "ver", pqrsf: "ver", exportar: false, sedes: false, usuarios: false },
};
export const NO_PERMS: Perms = { admisiones: "none", pqrsf: "none", exportar: false, sedes: false, usuarios: false };

/* ── Preinscripción formal ──
   Datos que pide un colegio en Colombia para iniciar el proceso de admisión (base para la matrícula
   y el reporte en SIMAT): identificación del aspirante, procedencia escolar y acudiente responsable.
   Datos sensibles (salud, discapacidad, etnia) NO se piden aquí: se tratan en la matrícula, con
   autorización especial (Ley 1581, art. 6), y no pueden condicionar el cupo (Decreto 1421 de 2017). */
export const STUDENT_DOC_TYPES = ["RC", "TI", "CE", "PPT", "PA", "OT"] as const;
export const GUARDIAN_DOC_TYPES = ["CC", "CE", "PPT", "PA"] as const;
export const RELATIONS = ["madre", "padre", "abuelo", "tio", "hermano", "tutor", "otro"] as const;
export const SECTORS = ["privado", "oficial"] as const;
export const SOURCES = ["recomendacion", "redes", "google", "visita", "publicidad", "otro"] as const;
export type StudentDocType = (typeof STUDENT_DOC_TYPES)[number];
export type GuardianDocType = (typeof GUARDIAN_DOC_TYPES)[number];
export type Relation = (typeof RELATIONS)[number];

export type AdmissionDetails = {
  student: {
    firstNames: string; lastNames: string; docType: StudentDocType; docNumber: string;
    birthDate: string;    // AAAA-MM-DD
    sex: "F" | "M"; nationality: string;
  };
  previous: { firstTime: boolean; school: string; city: string; sector: "" | "privado" | "oficial"; lastGrade: string; reason: string };
  guardian: { relation: Relation; docType: GuardianDocType; docNumber: string; email: string; address: string; city: string };
  second: { name: string; relation: "" | Relation; phone: string };
  siblings: string;
  source: string;
};
export type AdmissionFileKind = "documento" | "boletin";
/** Adjunto de una preinscripción (la ruta del archivo nunca sale del servidor) */
export type AdmissionFile = { kind: AdmissionFileKind; name: string };

export type Admission = {
  id: string;            // HG-2027-0001
  createdAt: string;     // ISO
  lang: "es" | "en";
  campus: CampusId;
  guardian: string;      // nombre del acudiente
  phone: string;
  grade: string;
  message: string;
  studentName: string;
  studentDoc: string;
  details: Partial<AdmissionDetails>;
  files: AdmissionFile[];
  status: AdmissionStatus;
  notes: Note[];
  history?: HistoryEntry[];
  sample?: boolean;
};

/** Edad cumplida a una fecha (por defecto, hoy) */
export function ageAt(birthDate: string, at = new Date()) {
  const b = new Date(birthDate + "T00:00:00");
  if (Number.isNaN(b.getTime())) return null;
  let age = at.getFullYear() - b.getFullYear();
  const m = at.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && at.getDate() < b.getDate())) age--;
  return age;
}

export type Pqrsf = {
  id: string;            // PQRSF-2026-0001
  createdAt: string;
  lang: "es" | "en";
  campus: CampusId;
  type: PqrsfType;
  name: string;
  email: string;
  phone: string;
  student: string;
  grade: string;
  subject: string;
  description: string;
  attachment: string;    // nombre original del archivo adjunto
  hasFile?: boolean;     // hay un archivo guardado que el panel puede descargar
  urgent: boolean;       // el acudiente la marcó como urgente
  priority: PqrsfPriority;
  status: PqrsfStatus;
  answer: string;
  answeredAt?: string;   // fecha en que el colegio guardó la respuesta
  notes: Note[];
  history?: HistoryEntry[];
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

export function sampleAdmissions(): Admission[] {
  // [acudiente, parentesco, teléfono, aspirante (nombres, apellidos), sexo, edad, grado, estado, días atrás, colegio de procedencia, mensaje]
  const rows: [string, Relation, string, string, string, "F" | "M", number, string, AdmissionStatus, number, string, string][] = [
    ["Familia Ejemplo Uno", "madre", "300 000 0001", "Sofía", "Ejemplo Uno", "F", 5, "Transición", "nueva", 0, "Jardín Infantil de Ejemplo", "Queremos conocer el colegio."],
    ["Familia Ejemplo Dos", "padre", "300 000 0002", "Mateo", "Ejemplo Dos", "M", 6, "1°", "nueva", 1, "Colegio de Ejemplo A", ""],
    ["Familia Ejemplo Tres", "madre", "300 000 0003", "Valentina", "Ejemplo Tres", "F", 3, "Prejardín", "contactada", 3, "", "¿Tienen transporte?"],
    ["Familia Ejemplo Cuatro", "abuelo", "300 000 0004", "Samuel", "Ejemplo Cuatro", "M", 11, "6°", "visita", 5, "Colegio de Ejemplo B", "Viene de otro colegio de Sabanalarga."],
    ["Familia Ejemplo Cinco", "madre", "300 000 0005", "Isabella", "Ejemplo Cinco", "F", 15, "10°", "evaluacion", 9, "Colegio de Ejemplo C", ""],
    ["Familia Ejemplo Seis", "padre", "300 000 0006", "Emiliano", "Ejemplo Seis", "M", 4, "Jardín", "admitido", 14, "", ""],
    ["Familia Ejemplo Siete", "tutor", "300 000 0007", "Mariana", "Ejemplo Siete", "F", 8, "3°", "matriculado", 21, "Colegio de Ejemplo A", ""],
  ];
  const year = new Date().getFullYear();
  return rows.map(([guardian, relation, phone, first, last, sex, age, grade, status, ago, school, message], i) => {
    const doc = `10${String(48000000 + i * 1111)}`;
    return {
      id: `HG-2027-${String(i + 1).padStart(4, "0")}`,
      createdAt: daysAgo(ago, 8 + i),
      lang: "es",
      campus: (i === 1 || i === 4 ? "sede2" : "principal") as CampusId,
      guardian, phone, grade, message, status,
      studentName: `${first} ${last}`,
      studentDoc: doc,
      details: {
        student: { firstNames: first, lastNames: last, docType: age >= 7 ? "TI" : "RC", docNumber: doc, birthDate: `${year - age - 1}-0${(i % 9) + 1}-1${i}`, sex, nationality: "Colombiana" },
        previous: { firstTime: !school, school, city: school ? "Sabanalarga" : "", sector: school ? "privado" : "", lastGrade: "", reason: "" },
        guardian: { relation, docType: "CC", docNumber: `1000000${i}`, email: `acudiente${i + 1}@ejemplo.com`, address: "Dirección de ejemplo", city: "Sabanalarga" },
        second: { name: "", relation: "", phone: "" },
        siblings: "",
        source: ["recomendacion", "redes", "google", "visita"][i % 4],
      },
      files: [],
      notes: status === "nueva" ? [] : [{ at: daysAgo(Math.max(ago - 1, 0), 15), text: "Se llamó a la familia. (ejemplo)" }],
      sample: true,
    };
  });
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

export function samplePqrsf(): Pqrsf[] {
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
    campus: (i === 3 ? "sede2" : "principal") as CampusId,
    type, priority, subject, description, status, urgent,
    name: `Acudiente de ejemplo ${i + 1}`,
    email: `acudiente${i + 1}@ejemplo.com`,
    phone: `300 000 01${i}`,
    student: `Estudiante de ejemplo ${i + 1}`,
    grade: ["2°", "5°", "Transición", "11°", "8°", "3°"][i],
    attachment: i === 2 ? "extracto.pdf" : "",
    answer: status === "respondida" || status === "cerrada" ? "Gracias por escribirnos. Damos respuesta a su solicitud. (ejemplo)" : "",
    answeredAt: status === "respondida" || status === "cerrada" ? businessDaysAgo(Math.max(ago - 2, 0), 15) : undefined,
    notes: [],
    sample: true,
  }));
}

/* ── API (solo en el navegador) ── */
export class ApiError extends Error {
  status: number;
  data: Record<string, unknown>;
  constructor(status: number, data: Record<string, unknown> = {}) {
    super(`HTTP ${status}`);
    this.status = status;
    this.data = data;
  }
}

async function api<T>(url: string, init: RequestInit = {}): Promise<T> {
  const isForm = init.body instanceof FormData;
  const res = await fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: { ...(isForm || !init.body ? {} : { "Content-Type": "application/json" }), ...(init.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}

/* Avisa al panel que vuelva a cargar los datos */
const notify = () => window.dispatchEvent(new Event("hg-demo-change"));

export type AdmissionPatch = { status?: AdmissionStatus; note?: string };
export type PqrsfPatch = { status?: PqrsfStatus; priority?: PqrsfPriority; answer?: string; note?: string };
/** Lo que ve el acudiente al consultar su radicado (sin datos de otras personas) */
export type PqrsfPublic = Pick<Pqrsf, "id" | "createdAt" | "lang" | "campus" | "type" | "name" | "subject" | "description" | "priority" | "status" | "answer" | "answeredAt" | "student" | "grade" | "email" | "phone" | "attachment" | "urgent" | "notes">;

export const admissionsStore = {
  /** Formulario completo (con adjuntos opcionales) como multipart/form-data */
  add: (form: FormData) => api<{ id: string; createdAt: string; campus: CampusId }>("/api/admisiones", { method: "POST", body: form }),
  fileUrl: (id: string, kind: AdmissionFileKind) => `/api/admin/admisiones/${encodeURIComponent(id)}/adjunto/${kind}`,
  async update(id: string, patch: AdmissionPatch) {
    await api(`/api/admin/admisiones/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(patch) });
    notify();
  },
};

export const pqrsfStore = {
  /** El formulario va completo (con el archivo) como multipart/form-data */
  add: (form: FormData) => api<Pqrsf>("/api/pqrsf", { method: "POST", body: form }),
  find: (id: string, email: string) =>
    api<PqrsfPublic>("/api/pqrsf/consulta", { method: "POST", body: JSON.stringify({ id: id.trim().toUpperCase(), email: email.trim() }) }),
  async update(id: string, patch: PqrsfPatch) {
    await api(`/api/admin/pqrsf/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(patch) });
    notify();
  },
  fileUrl: (id: string) => `/api/admin/pqrsf/${encodeURIComponent(id)}/adjunto`,
};

/* ── Sesión del panel: cookie segura emitida por el servidor ── */
/** campus: null = ve todas las sedes; si tiene sede, solo ve y gestiona la suya. */
export type StaffUser = { username: string; name: string; campus: CampusId | null; perms: Perms; superuser?: boolean };
/** Usuario como lo ve quien administra usuarios */
export type StaffRow = StaffUser & { active: boolean; lastLogin: string | null; createdAt: string };
export type StaffInput = { username?: string; name: string; password?: string; campus: CampusId | null; perms: Perms; active: boolean };
/* El nombre de usuario se puede cambiar al editar (`username` nuevo en el cuerpo). */
export const session = {
  me: () => api<{ user: StaffUser | null; demo: boolean }>("/api/admin/sesion"),
  login: (username: string, password: string) =>
    api<{ user: StaffUser }>("/api/admin/sesion", { method: "POST", body: JSON.stringify({ username, password }) }),
  logout: () => api("/api/admin/sesion", { method: "DELETE" }),
};

export const fetchAll = () => api<{ admissions: Admission[]; pqrsf: Pqrsf[]; campuses: Campus[] }>("/api/admin/datos");

/* ── Configuración: sedes y usuarios ── */
export const campusesApi = {
  save: async (c: Campus, isNew: boolean) => {
    const r = await api<Campus>(isNew ? "/api/admin/sedes" : `/api/admin/sedes/${encodeURIComponent(c.id)}`, { method: isNew ? "POST" : "PATCH", body: JSON.stringify(c) });
    notify();
    return r;
  },
};
export const staffApi = {
  list: () => api<{ users: StaffRow[] }>("/api/admin/usuarios"),
  save: async (u: StaffInput, username?: string) => {
    const r = await api<StaffRow>(username ? `/api/admin/usuarios/${encodeURIComponent(username)}` : "/api/admin/usuarios", { method: username ? "PATCH" : "POST", body: JSON.stringify(u) });
    notify();
    return r;
  },
};
export async function resetDemo() {
  await api("/api/admin/datos", { method: "DELETE" });
  notify();
}

export function subscribeDemo(cb: () => void) {
  window.addEventListener("hg-demo-change", cb);
  return () => window.removeEventListener("hg-demo-change", cb);
}

/* Idioma del panel (español por defecto). */
const ADMIN_LANG_KEY = "hg-admin-idioma";
export const adminLang = {
  get: (): "es" | "en" => { try { return localStorage.getItem(ADMIN_LANG_KEY) === "en" ? "en" : "es"; } catch { return "es"; } },
  set: (lang: "es" | "en") => { try { localStorage.setItem(ADMIN_LANG_KEY, lang); } catch {} window.dispatchEvent(new Event("hg-lang-change")); },
  subscribe: (cb: () => void) => { window.addEventListener("hg-lang-change", cb); return () => window.removeEventListener("hg-lang-change", cb); },
};

export function formatDate(iso: string, lang: "es" | "en" = "es", withTime = false) {
  return new Date(iso).toLocaleDateString(lang === "es" ? "es-CO" : "en-US", {
    day: "numeric", month: "short", year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
}
