import { put } from "@vercel/blob";
import { randomBytes } from "node:crypto";
import { admissionInput, EXT, MAX_FILE_BYTES, sniffType } from "@/lib/server/validate";
import { campusAccepts, sql, toAdmission } from "@/lib/server/db";
import { clientIp, fail, json, sameOrigin } from "@/lib/server/http";
import { hit } from "@/lib/server/rate";
import { mailNewAdmission } from "@/lib/server/mail";
import type { AdmissionFileKind } from "@/lib/records";

/* Preinscripción formal (multipart/form-data):
   - "datos": los datos del formulario en JSON (aspirante, procedencia, acudiente).
   - "documento" y "boletin": adjuntos opcionales (PDF o imagen, máx. 5 MB), revisados por su contenido real
     y guardados en almacenamiento PRIVADO. Solo el panel, con permiso, los puede descargar. */
const KINDS: AdmissionFileKind[] = ["documento", "boletin"];

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "origin" }, 403);
  try {
    const len = Number(req.headers.get("content-length") || 0);
    if (len > 2 * MAX_FILE_BYTES + 128 * 1024) return json({ error: "file" }, 413);

    const form = await req.formData().catch(() => null);
    if (!form) return json({ error: "invalid" }, 400);
    let raw: unknown = null;
    try { raw = JSON.parse(String(form.get("datos") ?? "")); } catch {}
    const parsed = admissionInput.safeParse(raw);
    if (!parsed.success) return json({ error: "invalid", fields: parsed.error.issues.map((i) => i.path.join(".")) }, 400);
    const d = parsed.data;
    if (!(await campusAccepts(d.campus))) return json({ error: "invalid", fields: ["campus"] }, 400);

    const wait = await hit(`adm:${clientIp(req)}`, 8, 3600);
    if (wait) return json({ error: "rate", wait }, 429);

    // Robot: se responde como si todo saliera bien, pero no se guarda nada
    if (d.website) return json({ id: "HG-2027-0000", createdAt: new Date().toISOString(), campus: d.campus }, 201);

    // Adjuntos opcionales
    const files: { kind: AdmissionFileKind; name: string; path: string }[] = [];
    for (const kind of KINDS) {
      const file = form.get(kind);
      if (!(file instanceof File) || file.size === 0) continue;
      if (file.size > MAX_FILE_BYTES) return json({ error: "file", fields: [kind] }, 413);
      const buf = new Uint8Array(await file.arrayBuffer());
      const type = sniffType(buf);
      if (!type) return json({ error: "file", fields: [kind] }, 415);
      const blob = await put(`admisiones/${randomBytes(16).toString("hex")}.${EXT[type]}`, Buffer.from(buf), {
        access: "private", contentType: type, addRandomSuffix: false,
      });
      const name = file.name.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 120) || `${kind}.${EXT[type]}`;
      files.push({ kind, name, path: blob.pathname });
    }

    const { student: s, previous: p, guardian: g, second, siblings, source } = d;
    const details = { student: s, previous: p, guardian: g, second, siblings, source };
    const studentName = `${s.firstNames} ${s.lastNames}`;
    const rows = await sql`
      INSERT INTO admissions (id, lang, campus, guardian, phone, grade, message, student_name, student_doc, details, files)
      VALUES ('HG-2027-' || lpad(nextval('admissions_seq')::text, 4, '0'), ${d.lang}, ${d.campus}, ${d.guardianName}, ${d.phone},
        ${d.grade}, ${d.message}, ${studentName}, ${s.docNumber}, ${JSON.stringify(details)}::jsonb, ${JSON.stringify(files)}::jsonb)
      RETURNING *`;
    const row = toAdmission(rows[0] as Parameters<typeof toAdmission>[0]);
    await mailNewAdmission(row);
    // A la familia solo le devolvemos lo necesario para la confirmación
    return json({ id: row.id, createdAt: row.createdAt, campus: row.campus }, 201);
  } catch (err) {
    return fail(err, "admisiones");
  }
}
