import { lookupInput } from "@/lib/server/validate";
import { sql, toPqrsf } from "@/lib/server/db";
import { clientIp, fail, json, sameOrigin } from "@/lib/server/http";
import { hit } from "@/lib/server/rate";
import type { PqrsfPublic } from "@/lib/records";

/* Consulta del acudiente: exige número de radicado + el correo con que se radicó (OWASP A01:
   nadie puede ver la solicitud de otra familia adivinando números). Mismo mensaje si no existe
   o si el correo no coincide, y límite de consultas por IP. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "origin" }, 403);
  try {
    const parsed = lookupInput.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: "notfound" }, 404);

    const wait = await hit(`lookup:${clientIp(req)}`, 20, 600);
    if (wait) return json({ error: "rate", wait }, 429);

    const rows = await sql`SELECT * FROM pqrsf WHERE id = ${parsed.data.id} AND lower(email) = lower(${parsed.data.email})`;
    if (!rows[0]) return json({ error: "notfound" }, 404);
    const p = toPqrsf(rows[0] as Parameters<typeof toPqrsf>[0]);
    const pub: PqrsfPublic = {
      id: p.id, createdAt: p.createdAt, lang: p.lang, campus: p.campus, type: p.type, name: p.name, subject: p.subject, description: p.description,
      priority: p.priority, status: p.status, answer: p.answer, answeredAt: p.answeredAt, student: p.student, grade: p.grade,
      email: p.email, phone: p.phone, attachment: p.attachment, urgent: p.urgent, notes: [], // las notas internas no salen
    };
    return json(pub);
  } catch (err) {
    return fail(err, "consulta");
  }
}
