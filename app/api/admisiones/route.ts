import { admissionInput } from "@/lib/server/validate";
import { campusAccepts, sql, toAdmission } from "@/lib/server/db";
import { clientIp, fail, json, sameOrigin } from "@/lib/server/http";
import { hit } from "@/lib/server/rate";
import { mailNewAdmission } from "@/lib/server/mail";

/* Preinscripción pública: valida, limita envíos por IP, guarda y avisa al colegio. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "origin" }, 403);
  try {
    const body = await req.json().catch(() => null);
    const parsed = admissionInput.safeParse(body);
    if (!parsed.success) return json({ error: "invalid" }, 400);
    const d = parsed.data;
    if (!(await campusAccepts(d.campus))) return json({ error: "invalid" }, 400);

    const wait = await hit(`adm:${clientIp(req)}`, 8, 3600);
    if (wait) return json({ error: "rate", wait }, 429);

    // Robot: se responde como si todo saliera bien, pero no se guarda nada
    if (d.website) return json({ id: "HG-2027-0000", createdAt: new Date().toISOString(), lang: d.lang, campus: d.campus, guardian: d.guardian, phone: d.phone, grade: d.grade, message: "", status: "nueva", notes: [] });

    const rows = await sql`
      INSERT INTO admissions (id, lang, campus, guardian, phone, grade, message)
      VALUES ('HG-2027-' || lpad(nextval('admissions_seq')::text, 4, '0'), ${d.lang}, ${d.campus}, ${d.guardian}, ${d.phone}, ${d.grade}, ${d.message})
      RETURNING *`;
    const row = toAdmission(rows[0] as Parameters<typeof toAdmission>[0]);
    await mailNewAdmission(row);
    return json(row, 201);
  } catch (err) {
    return fail(err, "admisiones");
  }
}
