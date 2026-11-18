import { put } from "@vercel/blob";
import { randomBytes } from "node:crypto";
import { DEFAULT_PRIORITY, pqrsfDue, type PqrsfPriority, type PqrsfType } from "@/lib/records";
import { EXT, MAX_FILE_BYTES, pqrsfInput, sniffType } from "@/lib/server/validate";
import { sql, toPqrsf } from "@/lib/server/db";
import { clientIp, fail, json, sameOrigin } from "@/lib/server/http";
import { hit } from "@/lib/server/rate";
import { mailNewPqrsf } from "@/lib/server/mail";

/* Radicar una PQRSF: formulario multipart con adjunto opcional.
   El adjunto se revisa por su contenido real y se guarda en Vercel Blob PRIVADO
   (solo el panel, con sesión, lo puede descargar). */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "origin" }, 403);
  try {
    const len = Number(req.headers.get("content-length") || 0);
    if (len > MAX_FILE_BYTES + 64 * 1024) return json({ error: "file" }, 413);

    const form = await req.formData().catch(() => null);
    if (!form) return json({ error: "invalid" }, 400);
    const v = (k: string) => String(form.get(k) ?? "");
    const parsed = pqrsfInput.safeParse({
      lang: v("lang"), campus: v("sede"), type: v("tipo"), name: v("nombre"), email: v("correo"), phone: v("telefono"),
      student: v("estudiante"), grade: v("grado"), subject: v("asunto"), description: v("descripcion"),
      urgent: v("urgente") === "on", consent: v("acepta") === "on", website: v("website"),
    });
    if (!parsed.success) return json({ error: "invalid" }, 400);
    const d = parsed.data;

    const wait = await hit(`pqrsf:${clientIp(req)}`, 6, 3600);
    if (wait) return json({ error: "rate", wait }, 429);

    if (d.website) {
      return json({ id: "PQRSF-2026-0000", createdAt: new Date().toISOString(), lang: d.lang, type: d.type, priority: "media", status: "radicada" });
    }

    // Adjunto (opcional)
    let attachment = "";
    let attachmentPath = "";
    const file = form.get("adjunto");
    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_FILE_BYTES) return json({ error: "file" }, 413);
      const buf = new Uint8Array(await file.arrayBuffer());
      const type = sniffType(buf);
      if (!type) return json({ error: "file" }, 415);
      attachment = file.name.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 120) || `adjunto.${EXT[type]}`;
      // Nombre aleatorio en el almacenamiento: no se puede adivinar ni recorrer
      const blob = await put(`pqrsf/${randomBytes(16).toString("hex")}.${EXT[type]}`, Buffer.from(buf), {
        access: "private", contentType: type, addRandomSuffix: false,
      });
      attachmentPath = blob.pathname;
    }

    const type = d.type as PqrsfType;
    const priority: PqrsfPriority = d.urgent ? "alta" : DEFAULT_PRIORITY[type];
    const year = new Date().getFullYear();
    const rows = await sql`
      INSERT INTO pqrsf (id, lang, campus, type, name, email, phone, student, grade, subject, description, attachment, attachment_path, urgent, priority)
      VALUES ('PQRSF-' || ${String(year)} || '-' || lpad(nextval('pqrsf_seq')::text, 4, '0'),
        ${d.lang}, ${d.campus}, ${type}, ${d.name}, ${d.email}, ${d.phone}, ${d.student}, ${d.grade}, ${d.subject}, ${d.description},
        ${attachment}, ${attachmentPath}, ${d.urgent}, ${priority})
      RETURNING *`;
    const row = toPqrsf(rows[0] as Parameters<typeof toPqrsf>[0]);
    await mailNewPqrsf(row, pqrsfDue(row));
    // Al acudiente solo le devolvemos lo necesario para la confirmación
    return json({ id: row.id, createdAt: row.createdAt, lang: row.lang, type: row.type, priority: row.priority, status: row.status, email: row.email }, 201);
  } catch (err) {
    return fail(err, "pqrsf");
  }
}
