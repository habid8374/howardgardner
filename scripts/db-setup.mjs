// Prepara la base de datos (Neon): crea las tablas, el usuario del panel y, en la demo, los datos de ejemplo.
// Uso:  node --env-file=.env.local scripts/db-setup.mjs <usuario> <contraseña> "<Nombre>" [--perfil=rectoria|coordinacion|consulta] [--sede=sede2] [--superusuario] [--ejemplos]
// Lo normal es crear y editar usuarios desde el panel (pestaña Usuarios); este script sirve para el primer usuario.
// La contraseña se guarda cifrada (scrypt con sal); nunca en texto plano.
import { readFile } from "node:fs/promises";
import { randomBytes, scryptSync } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { sampleAdmissions, samplePqrsf } from "../lib/records.ts";

// Opcional: --sede=sede2 para que el usuario solo vea su sede (sin --sede ve todas)
const [username, password, name = "Administrador", role = "admin"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const campus = process.argv.find((a) => a.startsWith("--sede="))?.split("=")[1] ?? null;
// Opcional: --perfil=rectoria|coordinacion|consulta (por defecto: rectoría si ve todas las sedes, coordinación si tiene sede)
const PRESETS = {
  rectoria: { admisiones: "gestionar", pqrsf: "gestionar", exportar: true, sedes: true, usuarios: true },
  coordinacion: { admisiones: "gestionar", pqrsf: "gestionar", exportar: true, sedes: false, usuarios: false },
  consulta: { admisiones: "ver", pqrsf: "ver", exportar: false, sedes: false, usuarios: false },
};
const superuser = process.argv.includes("--superusuario"); // cuenta de soporte de Axentia
const perfil = process.argv.find((a) => a.startsWith("--perfil="))?.split("=")[1] ?? (campus ? "coordinacion" : "rectoria");
if (!PRESETS[perfil]) throw new Error("Perfil no válido: " + perfil);
const withSamples = process.argv.includes("--ejemplos");
if (!process.env.DATABASE_URL) throw new Error("Falta DATABASE_URL (usa --env-file=.env.local)");
const sql = neon(process.env.DATABASE_URL);

const schema = await readFile(new URL("../lib/server/schema.sql", import.meta.url), "utf8");
for (const stmt of schema.split(";").map((s) => s.replace(/--.*$/gm, "").trim()).filter(Boolean)) {
  await sql.query(stmt);
}
console.log("✓ Tablas listas");

// Sedes iniciales (solo si la tabla está vacía). Después se administran desde el panel.
const [{ n: campusCount }] = await sql`SELECT count(*)::int AS n FROM campuses`;
if (!campusCount) {
  await sql`INSERT INTO campuses (id, name_es, name_en, status, address, city, phone, whatsapp, hours_es, hours_en, grades, sort)
    VALUES ('principal', 'Sede principal', 'Main campus', 'open', 'Calle 12 #34 B-2', 'Sabanalarga, Atlántico', '301 202 8756', '301 202 8756',
      'Lunes a viernes, 7:00 a. m. – 5:00 p. m.', 'Monday to Friday, 7:00 a.m. – 5:00 p.m.', 'Prejardín a grado 11°', 0)`;
  await sql`INSERT INTO campuses (id, name_es, name_en, status, note_es, note_en, sort)
    VALUES ('sede2', 'Nueva sede', 'New campus', 'soon',
      'Estamos preparando la apertura de una nueva sede de Howard Gardner. Preinscríbete desde ya y te avisamos primero cuando abramos inscripciones.',
      'We are getting ready to open a new Howard Gardner campus. Pre-register now and you will be the first to know when enrollment opens.', 1)`;
  console.log("✓ Sedes iniciales creadas");
}

// Usuarios creados antes de los permisos: quien ve todas las sedes queda como rectoría; quien tiene sede, como coordinación
await sql`UPDATE staff SET perms = '{"admisiones":"gestionar","pqrsf":"gestionar","exportar":true,"sedes":true,"usuarios":true}'::jsonb
  WHERE perms = '{}'::jsonb AND campus IS NULL`;
await sql`UPDATE staff SET perms = '{"admisiones":"gestionar","pqrsf":"gestionar","exportar":true,"sedes":false,"usuarios":false}'::jsonb
  WHERE perms = '{}'::jsonb AND campus IS NOT NULL`;

if (username && password) {
  if (password.length < 10) throw new Error("La contraseña debe tener al menos 10 caracteres");
  const salt = randomBytes(16);
  const hash = `scrypt$${salt.toString("base64")}$${scryptSync(password.normalize("NFKC"), salt, 64).toString("base64")}`;
  const perms = JSON.stringify(PRESETS[perfil]);
  await sql`INSERT INTO staff (username, name, pass_hash, role, campus, perms, superuser) VALUES (${username.toLowerCase()}, ${name}, ${hash}, ${role}, ${superuser ? null : campus}, ${perms}::jsonb, ${superuser})
    ON CONFLICT (username) DO UPDATE SET name = EXCLUDED.name, pass_hash = EXCLUDED.pass_hash, campus = EXCLUDED.campus, perms = EXCLUDED.perms, superuser = EXCLUDED.superuser, active = true`;
  await sql`INSERT INTO audit_log (actor, action, target) VALUES ('script', ${superuser ? "superusuario_creado" : "usuario_creado"}, ${username.toLowerCase()})`;
  console.log(`✓ Usuario del panel: ${username.toLowerCase()} (${perfil}${campus ? `, solo ${campus}` : ", todas las sedes"})`);
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
