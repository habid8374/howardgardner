import "server-only";
import { neon } from "@neondatabase/serverless";
import type { Admission, CampusId, HistoryEntry, Note, Pqrsf, StaffUser } from "@/lib/records";

/* Conexión a Neon (Postgres). Todas las consultas van parametrizadas con la plantilla sql`...`
   (OWASP A05: nunca se concatena texto del usuario dentro del SQL). */
const url = process.env.DATABASE_URL;
export const sql = neon(url ?? "postgres://invalid");
export const dbReady = Boolean(url);

type AdmissionRow = {
  id: string; created_at: string | Date; lang: "es" | "en"; campus: CampusId; guardian: string; phone: string; grade: string;
  message: string; status: Admission["status"]; notes: Note[]; history: HistoryEntry[]; sample: boolean;
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
export const canAccess = (user: StaffUser, campus: string) => !user.campus || user.campus === campus;
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
