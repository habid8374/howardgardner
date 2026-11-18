import "server-only";
import { revalidatePath } from "next/cache";
import { sql } from "./db";
import type { Campus, Perms, StaffRow } from "@/lib/records";
import { NO_PERMS } from "@/lib/records";

/* ── Sedes ── */
export async function upsertCampus(c: Campus, isNew: boolean) {
  if (isNew) {
    await sql`INSERT INTO campuses (id, name_es, name_en, status, address, city, phone, whatsapp, email, hours_es, hours_en, grades,
        maps_url, notify_email, note_es, note_en, sort)
      VALUES (${c.id}, ${c.nameEs}, ${c.nameEn}, ${c.status}, ${c.address}, ${c.city}, ${c.phone}, ${c.whatsapp}, ${c.email},
        ${c.hoursEs}, ${c.hoursEn}, ${c.grades}, ${c.mapsUrl}, ${c.notifyEmail}, ${c.noteEs}, ${c.noteEn}, ${c.sort})`;
  } else {
    await sql`UPDATE campuses SET name_es = ${c.nameEs}, name_en = ${c.nameEn}, status = ${c.status}, address = ${c.address},
        city = ${c.city}, phone = ${c.phone}, whatsapp = ${c.whatsapp}, email = ${c.email}, hours_es = ${c.hoursEs},
        hours_en = ${c.hoursEn}, grades = ${c.grades}, maps_url = ${c.mapsUrl}, notify_email = ${c.notifyEmail},
        note_es = ${c.noteEs}, note_en = ${c.noteEn}, sort = ${c.sort}, updated_at = now()
      WHERE id = ${c.id}`;
  }
  // El sitio público muestra las sedes: se regenera en la siguiente visita
  revalidatePath("/[lang]", "layout");
}

/* ── Usuarios ── */
type StaffDbRow = {
  username: string; name: string; campus: string | null; perms: Partial<Perms> | null; active: boolean;
  last_login: string | Date | null; created_at: string | Date; superuser: boolean;
};
const toRow = (r: StaffDbRow): StaffRow => ({
  username: r.username, name: r.name, campus: r.campus ?? null, perms: { ...NO_PERMS, ...(r.perms ?? {}) }, active: r.active, superuser: r.superuser,
  lastLogin: r.last_login ? new Date(r.last_login).toISOString() : null, createdAt: new Date(r.created_at).toISOString(),
});

export async function listStaff(): Promise<StaffRow[]> {
  const rows = (await sql`SELECT username, name, campus, perms, active, superuser, last_login, created_at FROM staff ORDER BY superuser DESC, active DESC, name`) as StaffDbRow[];
  return rows.map(toRow);
}

export async function getStaff(username: string): Promise<StaffRow | null> {
  const rows = (await sql`SELECT username, name, campus, perms, active, superuser, last_login, created_at FROM staff WHERE username = ${username}`) as StaffDbRow[];
  return rows[0] ? toRow(rows[0]) : null;
}

/** Cuántos usuarios activos, distintos de `except`, pueden administrar usuarios. */
export async function otherUserAdmins(except: string) {
  const rows = (await sql`SELECT count(*)::int AS n FROM staff WHERE active AND username <> ${except} AND (perms->>'usuarios')::boolean IS TRUE`) as { n: number }[];
  return rows[0]?.n ?? 0;
}

/* Reglas de permisos (se validan en el servidor, no solo en la pantalla):
   - Administrar sedes o usuarios exige ver todas las sedes.
   - Quien no ve un área no puede exportarla: "exportar" solo tiene sentido con algún acceso. */
export function permsProblem(perms: Perms, campus: string | null): string | null {
  if ((perms.sedes || perms.usuarios) && campus) return "admin_all_campuses";
  if (perms.exportar && perms.admisiones === "none" && perms.pqrsf === "none") return "export_without_access";
  return null;
}
