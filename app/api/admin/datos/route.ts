import { audit, listAdmissions, listCampuses, listPqrsf } from "@/lib/server/db";
import { allowed, clientIp, fail, json, requireStaff } from "@/lib/server/http";
import { seedSamples } from "@/lib/server/seed";

/* Todos los registros para el panel (requiere sesión). */
export async function GET(req: Request) {
  const user = await requireStaff(req);
  if (user instanceof Response) return user;
  try {
    // Cada área solo se envía si el usuario tiene permiso para verla
    const [admissions, pqrsf, campuses] = await Promise.all([
      allowed(user, { area: "admisiones", level: "ver" }) ? listAdmissions(user) : [],
      allowed(user, { area: "pqrsf", level: "ver" }) ? listPqrsf(user) : [],
      listCampuses(),
    ]);
    // El correo interno de avisos de cada sede solo lo ve quien administra sedes
    const safe = allowed(user, { area: "sedes" }) ? campuses : campuses.map((c) => ({ ...c, notifyEmail: "" }));
    return json({ admissions, pqrsf, campuses: safe });
  } catch (err) {
    return fail(err, "datos");
  }
}

/* Solo en la demo: restaura los datos de ejemplo (no borra los registros reales). */
export async function DELETE(req: Request) {
  if (process.env.DEMO_MODE !== "1") return json({ error: "forbidden" }, 403);
  const user = await requireStaff(req, { write: true, need: { area: "usuarios" } });
  if (user instanceof Response) return user;
  try {
    await seedSamples();
    await audit(user.username, "restaurar_ejemplos", "", clientIp(req));
    return json({ ok: true });
  } catch (err) {
    return fail(err, "restaurar");
  }
}
