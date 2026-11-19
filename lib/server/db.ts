import "server-only";
import { neon } from "@neondatabase/serverless";
import type { Admission, AdmissionDetails, AdmissionFileKind, Campus, CampusId, HistoryEntry, Note, Pqrsf, PublicCampus, StaffUser } from "@/lib/records";
import { ADDRESS, PHONE_DISPLAY } from "@/lib/site";

/* Conexión a Neon (Postgres). Todas las consultas van parametrizadas con la plantilla sql`...`
   (OWASP A05: nunca se concatena texto del usuario dentro del SQL). */
const url = process.env.DATABASE_URL;
export const sql = neon(url ?? "postgres://invalid");
export const dbReady = Boolean(url);

type AdmissionRow = {
  id: string; created_at: string | Date; lang: "es" | "en"; campus: CampusId; guardian: string; phone: string; grade: string;
  message: string; status: Admission["status"]; notes: Note[]; history: HistoryEntry[]; sample: boolean;
  student_name: string; student_doc: string; details: Partial<AdmissionDetails>; files: { kind: AdmissionFileKind; name: string; path: string }[];
};
type PqrsfRow = {
  id: string; created_at: string | Date; lang: "es" | "en"; campus: CampusId; type: Pqrsf["type"]; name: string; email: string;
  phone: string; student: string; grade: string; subject: string; description: string; attachment: string;
  attachment_path: string; urgent: boolean; priority: Pqrsf["priority"]; status: Pqrsf["status"]; answer: string;
  answered_at: string | Date | null; notes: Note[]; history: HistoryEntry[]; sample: boolean;
};

const iso = (d: string | Date) => new Date(d).toISOString();

export function toAdmission(r: AdmissionRow): Admission {
  return {
    id: r.id, createdAt: iso(r.created_at), lang: r.lang, campus: r.campus, guardian: r.guardian, phone: r.phone, grade: r.grade,
    message: r.message, status: r.status, notes: r.notes ?? [], history: r.history ?? [], sample: r.sample,
    studentName: r.student_name, studentDoc: r.student_doc, details: r.details ?? {},
    files: (r.files ?? []).map(({ kind, name }) => ({ kind, name })), // la ruta privada no sale del servidor
  };
}

export function toPqrsf(r: PqrsfRow): Pqrsf {
  return {
    id: r.id, createdAt: iso(r.created_at), lang: r.lang, campus: r.campus, type: r.type, name: r.name, email: r.email, phone: r.phone,
    student: r.student, grade: r.grade, subject: r.subject, description: r.description, attachment: r.attachment,
    hasFile: Boolean(r.attachment_path), urgent: r.urgent, priority: r.priority, status: r.status, answer: r.answer,
    answeredAt: r.answered_at ? iso(r.answered_at) : undefined, notes: r.notes ?? [], history: r.history ?? [], sample: r.sample,
  };
}

/* Si el usuario pertenece a una sede, solo recibe los registros de esa sede (control en el servidor, OWASP A01). */
export async function listAdmissions(user: StaffUser) {
  const rows = (user.campus
    ? await sql`SELECT * FROM admissions WHERE campus = ${user.campus} ORDER BY created_at DESC LIMIT 2000`
    : await sql`SELECT * FROM admissions ORDER BY created_at DESC LIMIT 2000`) as AdmissionRow[];
  return rows.map(toAdmission);
}
export async function listPqrsf(user: StaffUser) {
  const rows = (user.campus
    ? await sql`SELECT * FROM pqrsf WHERE campus = ${user.campus} ORDER BY created_at DESC LIMIT 2000`
    : await sql`SELECT * FROM pqrsf ORDER BY created_at DESC LIMIT 2000`) as PqrsfRow[];
  return rows.map(toPqrsf);
}
/** ¿Puede este usuario ver o cambiar un registro de esta sede? */
export const canAccess = (user: StaffUser, campus: CampusId) => !user.campus || user.campus === campus;
export async function getPqrsfRow(id: string) {
  const rows = (await sql`SELECT * FROM pqrsf WHERE id = ${id}`) as PqrsfRow[];
  return rows[0];
}
export async function getAdmissionRow(id: string) {
  const rows = (await sql`SELECT * FROM admissions WHERE id = ${id}`) as AdmissionRow[];
  return rows[0];
}

export async function audit(actor: string, action: string, target = "", ip = "") {
  try { await sql`INSERT INTO audit_log (actor, action, target, ip) VALUES (${actor}, ${action}, ${target}, ${ip})`; } catch {}
}

/* ── Sedes ── */
type CampusRow = {
  id: string; name_es: string; name_en: string; status: Campus["status"]; address: string; city: string; phone: string;
  whatsapp: string; email: string; hours_es: string; hours_en: string; grades: string; maps_url: string; notify_email: string;
  note_es: string; note_en: string; sort: number;
};
export const toCampus = (r: CampusRow): Campus => ({
  id: r.id, nameEs: r.name_es, nameEn: r.name_en, status: r.status, address: r.address, city: r.city, phone: r.phone,
  whatsapp: r.whatsapp, email: r.email, hoursEs: r.hours_es, hoursEn: r.hours_en, grades: r.grades, mapsUrl: r.maps_url,
  notifyEmail: r.notify_email, noteEs: r.note_es, noteEn: r.note_en, sort: r.sort,
});

/* Si la base de datos no responde (por ejemplo, al compilar sin conexión), el sitio muestra la sede principal. */
const FALLBACK: Campus = {
  id: "principal", nameEs: "Sede principal", nameEn: "Main campus", status: "open",
  address: ADDRESS.street, city: `${ADDRESS.city}, ${ADDRESS.region}`, phone: PHONE_DISPLAY, whatsapp: PHONE_DISPLAY, email: "",
  hoursEs: "", hoursEn: "", grades: "", mapsUrl: "", notifyEmail: "", noteEs: "", noteEn: "", sort: 0,
};

export async function listCampuses(): Promise<Campus[]> {
  const rows = (await sql`SELECT * FROM campuses ORDER BY sort, created_at`) as CampusRow[];
  return rows.map(toCampus);
}

/* Quita el correo interno de avisos antes de publicar una sede */
const toPublic = (c: Campus): PublicCampus => {
  const pub: Partial<Campus> = { ...c };
  delete pub.notifyEmail;
  return pub as PublicCampus;
};

/** Sedes visibles en el sitio (sin las ocultas y sin el correo interno de avisos). */
export async function publicCampuses(): Promise<PublicCampus[]> {
  try {
    const list = (await listCampuses()).filter((c) => c.status !== "hidden");
    return (list.length ? list : [FALLBACK]).map(toPublic);
  } catch {
    return [toPublic(FALLBACK)];
  }
}

export async function getCampus(id: string): Promise<Campus | null> {
  const rows = (await sql`SELECT * FROM campuses WHERE id = ${id}`) as CampusRow[];
  return rows[0] ? toCampus(rows[0]) : null;
}

/** ¿Se pueden recibir solicitudes para esta sede? (existe y no está oculta) */
export async function campusAccepts(id: string) {
  const c = await getCampus(id);
  return !!c && c.status !== "hidden";
}
