// Prepara la base de datos (Neon): crea las tablas, el usuario del panel y, en la demo, los datos de ejemplo.
// Uso:  node --env-file=.env.local scripts/db-setup.mjs <usuario> <contraseña> "<Nombre>" [admin|consulta] [--sede=sede2] [--ejemplos]
// La contraseña se guarda cifrada (scrypt con sal); nunca en texto plano.
import { readFile } from "node:fs/promises";
import { randomBytes, scryptSync } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { sampleAdmissions, samplePqrsf } from "../lib/records.ts";

// Opcional: --sede=sede2 para que el usuario solo vea su sede (sin --sede ve todas)
const [username, password, name = "Administrador", role = "admin"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const campus = process.argv.find((a) => a.startsWith("--sede="))?.split("=")[1] ?? null;
const withSamples = process.argv.includes("--ejemplos");
if (!process.env.DATABASE_URL) throw new Error("Falta DATABASE_URL (usa --env-file=.env.local)");
const sql = neon(process.env.DATABASE_URL);

const schema = await readFile(new URL("../lib/server/schema.sql", import.meta.url), "utf8");
for (const stmt of schema.split(";").map((s) => s.replace(/--.*$/gm, "").trim()).filter(Boolean)) {
  await sql.query(stmt);
}
console.log("✓ Tablas listas");

if (username && password) {
  if (password.length < 10) throw new Error("La contraseña debe tener al menos 10 caracteres");
  const salt = randomBytes(16);
  const hash = `scrypt$${salt.toString("base64")}$${scryptSync(password.normalize("NFKC"), salt, 64).toString("base64")}`;
  await sql`INSERT INTO staff (username, name, pass_hash, role, campus) VALUES (${username.toLowerCase()}, ${name}, ${hash}, ${role}, ${campus})
    ON CONFLICT (username) DO UPDATE SET name = EXCLUDED.name, pass_hash = EXCLUDED.pass_hash, role = EXCLUDED.role, campus = EXCLUDED.campus`;
  console.log(`✓ Usuario del panel: ${username.toLowerCase()} (${role}${campus ? `, solo ${campus}` : ", todas las sedes"})`);
}

if (withSamples) {
  for (const a of sampleAdmissions()) {
    await sql`INSERT INTO admissions (id, created_at, lang, campus, guardian, phone, grade, message, status, notes, sample)
      VALUES (${a.id.replace("HG-2027-", "HG-2027-E")}, ${a.createdAt}, ${a.lang}, ${a.campus}, ${a.guardian}, ${a.phone}, ${a.grade}, ${a.message},
        ${a.status}, ${JSON.stringify(a.notes)}::jsonb, true) ON CONFLICT (id) DO UPDATE SET campus = EXCLUDED.campus`;
  }
  for (const p of samplePqrsf()) {
    await sql`INSERT INTO pqrsf (id, created_at, lang, campus, type, name, email, phone, student, grade, subject, description, attachment,
        urgent, priority, status, answer, answered_at, sample)
      VALUES (${p.id.replace("PQRSF-2026-", "PQRSF-2026-E")}, ${p.createdAt}, ${p.lang}, ${p.campus}, ${p.type}, ${p.name}, ${p.email}, ${p.phone},
        ${p.student}, ${p.grade}, ${p.subject}, ${p.description}, ${p.attachment}, ${p.urgent}, ${p.priority}, ${p.status},
        ${p.answer}, ${p.answeredAt ?? null}, true) ON CONFLICT (id) DO UPDATE SET campus = EXCLUDED.campus`;
  }
  console.log("✓ Datos de ejemplo cargados");
}
