import "server-only";
import { sql } from "./db";
import { sampleAdmissions, samplePqrsf } from "@/lib/records";

/* Datos de ejemplo (ficticios) para que el panel de la demo no se vea vacío.
   Solo se usan con DEMO_MODE=1. */
export async function seedSamples() {
  await sql`DELETE FROM admissions WHERE sample = true`;
  await sql`DELETE FROM pqrsf WHERE sample = true`;
  for (const a of sampleAdmissions()) {
    await sql`INSERT INTO admissions (id, created_at, lang, campus, guardian, phone, grade, message, status, notes, sample)
      VALUES (${a.id.replace("HG-2027-", "HG-2027-E")}, ${a.createdAt}, ${a.lang}, ${a.campus}, ${a.guardian}, ${a.phone}, ${a.grade}, ${a.message},
        ${a.status}, ${JSON.stringify(a.notes)}::jsonb, true)
      ON CONFLICT (id) DO UPDATE SET campus = EXCLUDED.campus`;
  }
  for (const p of samplePqrsf()) {
    await sql`INSERT INTO pqrsf (id, created_at, lang, campus, type, name, email, phone, student, grade, subject, description, attachment,
        urgent, priority, status, answer, answered_at, sample)
      VALUES (${p.id.replace("PQRSF-2026-", "PQRSF-2026-E")}, ${p.createdAt}, ${p.lang}, ${p.campus}, ${p.type}, ${p.name}, ${p.email}, ${p.phone},
        ${p.student}, ${p.grade}, ${p.subject}, ${p.description}, ${p.attachment}, ${p.urgent}, ${p.priority}, ${p.status},
        ${p.answer}, ${p.answeredAt ?? null}, true)
      ON CONFLICT (id) DO UPDATE SET campus = EXCLUDED.campus`;
  }
}
