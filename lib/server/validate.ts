import "server-only";
import { z } from "zod";
import {
  CAMPUS_STATUSES, ADMISSION_STATUSES, GUARDIAN_DOC_TYPES, RELATIONS, SECTORS, SOURCES, STUDENT_DOC_TYPES, ageAt, ALLOWED_FILE_TYPES, LIMITS, MAX_FILE_MB, PQRSF_STATUSES, PQRSF_TYPES, PRIORITIES, clean,
} from "@/lib/records";

/* Validación en el servidor de TODO lo que llega (OWASP A05/A06). La del navegador es solo ayuda. */
const text = (max: number, min = 0) =>
  z.string().transform((v) => clean(v, max)).pipe(z.string().min(min).max(max));

const lang = z.enum(["es", "en"]);
const campus = z.string().trim().regex(/^[a-z0-9-]{2,30}$/);

const docNumber = z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{4,20}$/);
const phone = (min: number) => text(LIMITS.phone, min).refine((v) => v === "" || /^[0-9+()\s-]{7,}$/.test(v));
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((v) => {
  const age = ageAt(v);
  return age !== null && age >= 2 && age <= 21; // de Prejardín a 11°, con margen
});

/* Preinscripción formal: aspirante, procedencia, acudiente(s). Todo se valida aquí, en el servidor. */
export const admissionInput = z.object({
  lang,
  campus,
  grade: text(LIMITS.grade, 1),
  student: z.object({
    firstNames: text(60, 2), lastNames: text(60, 2),
    docType: z.enum(STUDENT_DOC_TYPES), docNumber,
    birthDate: isoDate, sex: z.enum(["F", "M"]), nationality: text(40, 2),
  }).strict(),
  previous: z.object({
    firstTime: z.boolean(),
    school: text(120), city: text(80), sector: z.enum(["", ...SECTORS]), lastGrade: text(LIMITS.grade), reason: text(300),
  }).strict().refine((p) => p.firstTime || (p.school.length >= 3 && p.city.length >= 2 && p.lastGrade.length >= 1)),
  guardianName: text(LIMITS.name, 5),
  phone: phone(7),
  guardian: z.object({
    relation: z.enum(RELATIONS), docType: z.enum(GUARDIAN_DOC_TYPES), docNumber,
    email: text(LIMITS.email).pipe(z.email()), address: text(150, 5), city: text(80, 2),
  }).strict(),
  second: z.object({ name: text(LIMITS.name), relation: z.enum(["", ...RELATIONS]), phone: phone(0) }).strict(),
  siblings: text(150),
  source: z.enum(["", ...SOURCES]),
  message: text(LIMITS.message).default(""),
  consent: z.literal(true),
  truth: z.literal(true),
  website: z.string().max(200).optional(), // trampa para robots
}).strict();

export const pqrsfInput = z.object({
  lang,
  campus,
  type: z.enum(PQRSF_TYPES as [string, ...string[]]),
  name: text(LIMITS.name, 3),
  email: text(LIMITS.email).pipe(z.email()),
  phone: text(LIMITS.phone).refine((v) => v === "" || /^[0-9+()\s-]+$/.test(v)),
  student: text(LIMITS.name),
  grade: text(LIMITS.grade),
  subject: text(LIMITS.subject, 3),
  description: text(LIMITS.description, 20),
  urgent: z.boolean(),
  consent: z.literal(true),
  website: z.string().max(200).optional(),
});

export const lookupInput = z.object({
  id: z.string().trim().toUpperCase().regex(/^PQRSF-\d{4}-\d{4,6}$/),
  email: text(LIMITS.email).pipe(z.email()),
});

export const loginInput = z.object({
  username: text(60, 1).transform((v) => v.toLowerCase()),
  password: z.string().min(1).max(128),
});

export const admissionPatch = z.object({
  status: z.enum(ADMISSION_STATUSES as [string, ...string[]]).optional(),
  note: text(LIMITS.note, 1).optional(),
}).strict();

export const pqrsfPatch = z.object({
  status: z.enum(PQRSF_STATUSES as [string, ...string[]]).optional(),
  priority: z.enum(PRIORITIES as [string, ...string[]]).optional(),
  answer: text(LIMITS.answer).optional(),
  note: text(LIMITS.note, 1).optional(),
}).strict();

/* Adjuntos: se revisa el contenido real del archivo (firma), no solo la extensión o el tipo que dice el navegador. */
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
export function sniffType(buf: Uint8Array): string | null {
  const b = (i: number) => buf[i];
  if (b(0) === 0x25 && b(1) === 0x50 && b(2) === 0x44 && b(3) === 0x46) return "application/pdf";        // %PDF
  if (b(0) === 0xff && b(1) === 0xd8 && b(2) === 0xff) return "image/jpeg";
  if (b(0) === 0x89 && b(1) === 0x50 && b(2) === 0x4e && b(3) === 0x47) return "image/png";
  if (b(0) === 0x52 && b(1) === 0x49 && b(2) === 0x46 && b(3) === 0x46 && b(8) === 0x57 && b(9) === 0x45 && b(10) === 0x42 && b(11) === 0x50) return "image/webp";
  return null;
}
export const EXT: Record<string, string> = { "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export { ALLOWED_FILE_TYPES };

/* ── Configuración ── */
const opt = (max: number) => text(max).default("");
export const campusInput = z.object({
  id: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{2,30}$/),
  nameEs: text(80, 2),
  nameEn: opt(80),
  status: z.enum(CAMPUS_STATUSES as [string, ...string[]]),
  address: opt(150), city: opt(80),
  phone: opt(20).refine((v) => v === "" || /^[0-9+()\s-]+$/.test(v)),
  whatsapp: opt(20).refine((v) => v === "" || /^[0-9+()\s-]+$/.test(v)),
  email: opt(254).refine((v) => v === "" || z.email().safeParse(v).success),
  hoursEs: opt(120), hoursEn: opt(120),
  grades: opt(120),
  mapsUrl: opt(500).refine((v) => v === "" || /^https:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/.test(v)),
  notifyEmail: opt(254).refine((v) => v === "" || z.email().safeParse(v).success),
  noteEs: opt(400), noteEn: opt(400),
  sort: z.number().int().min(0).max(99).default(0),
}).strict();

const access = z.enum(["none", "ver", "gestionar"]);
export const permsInput = z.object({
  admisiones: access, pqrsf: access, exportar: z.boolean(), sedes: z.boolean(), usuarios: z.boolean(),
}).strict();

/* Contraseña: mínimo 10 caracteres (ASVS V6), sin máximo bajo */
const password = z.string().min(10).max(128);
export const staffCreate = z.object({
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9._-]{3,40}$/),
  name: text(80, 3),
  password,
  campus: campus.nullable(),
  perms: permsInput,
  active: z.boolean().default(true),
}).strict(); // campos no previstos (p. ej. "superuser") se rechazan: sin asignación masiva
export const staffUpdate = z.object({
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9._-]{3,40}$/).optional(),
  name: text(80, 3),
  password: z.union([password, z.literal("")]).optional(),
  campus: campus.nullable(),
  perms: permsInput,
  active: z.boolean(),
}).strict();
