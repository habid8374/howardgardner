import { pqrsfPatch } from "@/lib/server/validate";
import { audit, getPqrsfRow, sql, toPqrsf } from "@/lib/server/db";
import { clientIp, fail, json, requireStaff } from "@/lib/server/http";
import { mailAnswer } from "@/lib/server/mail";
import type { HistoryEntry, Note } from "@/lib/records";

/* Cambiar prioridad, estado, respuesta o agregar una nota a una PQRSF (requiere rol administrador).
   Al guardar una respuesta, la PQRSF pasa a "respondida" y se le envía por correo a la familia. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireStaff(req, { write: true });
  if (user instanceof Response) return user;
  try {
    const { id } = await params;
    const parsed = pqrsfPatch.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: "invalid" }, 400);
    const row = await getPqrsfRow(id);
    if (!row) return json({ error: "notfound" }, 404);

    const at = new Date().toISOString();
    const d = parsed.data;
    const answered = d.answer !== undefined && d.answer !== "" && d.answer !== row.answer;
    const status = answered ? "respondida" : d.status;
    const history: HistoryEntry[] = [];
    if (d.priority && d.priority !== row.priority) history.push({ at, field: "priority", value: d.priority, by: user.name });
    if (status && status !== row.status) history.push({ at, field: "status", value: status, by: user.name });
    if (answered) history.push({ at, field: "answer", value: "", by: user.name });
    const notes: Note[] = d.note ? [{ at, text: d.note, by: user.name }] : [];

    const rows = await sql`
      UPDATE pqrsf SET
        priority = COALESCE(${d.priority ?? null}, priority),
        status = COALESCE(${status ?? null}, status),
        answer = COALESCE(${d.answer ?? null}, answer),
        answered_at = CASE WHEN ${answered} THEN now() ELSE answered_at END,
        notes = notes || ${JSON.stringify(notes)}::jsonb,
        history = history || ${JSON.stringify(history)}::jsonb
      WHERE id = ${id} RETURNING *`;
    const p = toPqrsf(rows[0] as Parameters<typeof toPqrsf>[0]);
    await audit(user.username, answered ? "pqrsf_respuesta" : "pqrsf_cambio", id, clientIp(req));
    if (answered && !p.sample) await mailAnswer(p);
    return json(p);
  } catch (err) {
    return fail(err, "pqrsf_patch");
  }
}
