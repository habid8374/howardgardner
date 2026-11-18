import { staffCreate } from "@/lib/server/validate";
import { audit, getCampus, sql } from "@/lib/server/db";
import { hashPassword } from "@/lib/server/auth";
import { clientIp, fail, json, requireStaff } from "@/lib/server/http";
import { getStaff, listStaff, permsProblem } from "@/lib/server/settings";

/* Usuarios del panel (permiso: administrar usuarios). Nunca se devuelven contraseñas ni sus huellas. */
export async function GET(req: Request) {
  const user = await requireStaff(req, { need: { area: "usuarios" } });
  if (user instanceof Response) return user;
  try {
    return json({ users: await listStaff() });
  } catch (err) {
    return fail(err, "usuarios");
  }
}

export async function POST(req: Request) {
  const user = await requireStaff(req, { write: true, need: { area: "usuarios" } });
  if (user instanceof Response) return user;
  try {
    const parsed = staffCreate.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: "invalid", fields: parsed.error.issues.map((i) => i.path.join(".")) }, 400);
    const d = parsed.data;
    const problem = permsProblem(d.perms, d.campus);
    if (problem) return json({ error: problem }, 400);
    if (d.campus && !(await getCampus(d.campus))) return json({ error: "invalid", fields: ["campus"] }, 400);
    if (await getStaff(d.username)) return json({ error: "exists" }, 409);

    const hash = await hashPassword(d.password);
    await sql`INSERT INTO staff (username, name, pass_hash, role, campus, perms, active)
      VALUES (${d.username}, ${d.name}, ${hash}, 'admin', ${d.campus}, ${JSON.stringify(d.perms)}::jsonb, ${d.active})`;
    await audit(user.username, "usuario_creado", d.username, clientIp(req));
    return json(await getStaff(d.username), 201);
  } catch (err) {
    return fail(err, "usuario_crear");
  }
}
