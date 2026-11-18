import { admissionPatch } from "@/lib/server/validate";
import { audit, canAccess, getAdmissionRow, sql, toAdmission } from "@/lib/server/db";
import { clientIp, fail, json, requireStaff } from "@/lib/server/http";
import type { HistoryEntry, Note } from "@/lib/records";

/* Cambiar el estado de una preinscripción o agregarle una nota (requiere rol administrador). */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireStaff(req, { write: true });
  if (user instanceof Response) return user;
  try {
    const { id } = await params;
    const parsed = admissionPatch.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: "invalid" }, 400);
    const row = await getAdmissionRow(id);
    if (!row || !canAccess(user, row.campus)) return json({ error: "notfound" }, 404);

    const at = new Date().toISOString();
    const { status, note } = parsed.data;
    const history: HistoryEntry[] = status && status !== row.status ? [{ at, field: "status", value: status, by: user.name }] : [];
    const notes: Note[] = note ? [{ at, text: note, by: user.name }] : [];

    const rows = await sql`
      UPDATE admissions SET
        status = COALESCE(${status ?? null}, status),
        notes = notes || ${JSON.stringify(notes)}::jsonb,
        history = history || ${JSON.stringify(history)}::jsonb
      WHERE id = ${id} RETURNING *`;
    await audit(user.username, status ? `admision_estado:${status}` : "admision_nota", id, clientIp(req));
    return json(toAdmission(rows[0] as Parameters<typeof toAdmission>[0]));
  } catch (err) {
    return fail(err, "admision_patch");
  }
}
