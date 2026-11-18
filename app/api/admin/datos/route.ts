import { audit, listAdmissions, listPqrsf } from "@/lib/server/db";
import { clientIp, fail, json, requireStaff } from "@/lib/server/http";
import { seedSamples } from "@/lib/server/seed";

/* Todos los registros para el panel (requiere sesión). */
export async function GET(req: Request) {
  const user = await requireStaff(req);
  if (user instanceof Response) return user;
  try {
    const [admissions, pqrsf] = await Promise.all([listAdmissions(user), listPqrsf(user)]);
    return json({ admissions, pqrsf });
  } catch (err) {
    return fail(err, "datos");
  }
}

/* Solo en la demo: restaura los datos de ejemplo (no borra los registros reales). */
export async function DELETE(req: Request) {
  if (process.env.DEMO_MODE !== "1") return json({ error: "forbidden" }, 403);
  const user = await requireStaff(req, { write: true });
  if (user instanceof Response) return user;
  try {
    await seedSamples();
    await audit(user.username, "restaurar_ejemplos", "", clientIp(req));
    return json({ ok: true });
  } catch (err) {
    return fail(err, "restaurar");
  }
}
