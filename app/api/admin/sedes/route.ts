import { campusInput } from "@/lib/server/validate";
import { audit, getCampus } from "@/lib/server/db";
import { clientIp, fail, json, requireStaff } from "@/lib/server/http";
import { upsertCampus } from "@/lib/server/settings";
import type { Campus } from "@/lib/records";

/* Crear una sede (permiso: administrar sedes). */
export async function POST(req: Request) {
  const user = await requireStaff(req, { write: true, need: { area: "sedes" } });
  if (user instanceof Response) return user;
  try {
    const parsed = campusInput.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: "invalid", fields: parsed.error.issues.map((i) => i.path.join(".")) }, 400);
    if (await getCampus(parsed.data.id)) return json({ error: "exists" }, 409);
    await upsertCampus(parsed.data as Campus, true);
    await audit(user.username, "sede_creada", parsed.data.id, clientIp(req));
    return json(await getCampus(parsed.data.id), 201);
  } catch (err) {
    return fail(err, "sede_crear");
  }
}
