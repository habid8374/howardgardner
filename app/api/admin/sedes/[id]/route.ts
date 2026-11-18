import { campusInput } from "@/lib/server/validate";
import { audit, getCampus, sql } from "@/lib/server/db";
import { clientIp, fail, json, requireStaff } from "@/lib/server/http";
import { upsertCampus } from "@/lib/server/settings";
import type { Campus } from "@/lib/records";

/* Editar una sede (permiso: administrar sedes). El identificador no cambia: los registros quedan ligados a él.
   Las sedes no se borran: se ocultan, para no perder el historial de sus solicitudes. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireStaff(req, { write: true, need: { area: "sedes" } });
  if (user instanceof Response) return user;
  try {
    const { id } = await params;
    const current = await getCampus(id);
    if (!current) return json({ error: "notfound" }, 404);
    const parsed = campusInput.safeParse({ ...(await req.json().catch(() => ({}))), id });
    if (!parsed.success) return json({ error: "invalid", fields: parsed.error.issues.map((i) => i.path.join(".")) }, 400);

    // No dejar el sitio sin ninguna sede visible
    if (parsed.data.status === "hidden" && current.status !== "hidden") {
      const rows = (await sql`SELECT count(*)::int AS n FROM campuses WHERE status <> 'hidden' AND id <> ${id}`) as { n: number }[];
      if (!rows[0]?.n) return json({ error: "last_visible" }, 409);
    }
    await upsertCampus(parsed.data as Campus, false);
    await audit(user.username, `sede_editada:${parsed.data.status}`, id, clientIp(req));
    return json(await getCampus(id));
  } catch (err) {
    return fail(err, "sede_editar");
  }
}
