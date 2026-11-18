import { staffUpdate } from "@/lib/server/validate";
import { audit, getCampus, sql } from "@/lib/server/db";
import { hashPassword } from "@/lib/server/auth";
import { clientIp, fail, json, requireStaff } from "@/lib/server/http";
import { getStaff, otherUserAdmins, permsProblem } from "@/lib/server/settings";

/* Editar un usuario: nombre, sede, permisos, activo y, si se escribe, una contraseña nueva.
   Reglas: nadie se desactiva ni se quita a sí mismo el permiso de usuarios, y siempre queda
   al menos un usuario activo que pueda administrar usuarios. Los usuarios no se borran: se desactivan. */
export async function PATCH(req: Request, { params }: { params: Promise<{ username: string }> }) {
  const user = await requireStaff(req, { write: true, need: { area: "usuarios" } });
  if (user instanceof Response) return user;
  try {
    const { username } = await params;
    const current = await getStaff(username);
    if (!current) return json({ error: "notfound" }, 404);
    const parsed = staffUpdate.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: "invalid", fields: parsed.error.issues.map((i) => i.path.join(".")) }, 400);
    const d = parsed.data;
    const problem = permsProblem(d.perms, d.campus);
    if (problem) return json({ error: problem }, 400);
    if (d.campus && !(await getCampus(d.campus))) return json({ error: "invalid", fields: ["campus"] }, 400);

    const self = username === user.username;
    if (self && (!d.active || !d.perms.usuarios)) return json({ error: "self_lockout" }, 409);
    const losesAdmin = current.active && current.perms.usuarios && (!d.active || !d.perms.usuarios);
    if (losesAdmin && (await otherUserAdmins(username)) === 0) return json({ error: "last_admin" }, 409);

    const hash = d.password ? await hashPassword(d.password) : null;
    await sql`UPDATE staff SET name = ${d.name}, campus = ${d.campus}, perms = ${JSON.stringify(d.perms)}::jsonb, active = ${d.active},
        pass_hash = COALESCE(${hash}, pass_hash), updated_at = now()
      WHERE username = ${username}`;
    // Si se desactiva, también se limpian sus bloqueos de acceso
    if (!d.active) await sql`DELETE FROM rate_limits WHERE key = ${`login:u:${username}`}`;
    await audit(user.username, hash ? "usuario_editado_clave" : "usuario_editado", username, clientIp(req));
    return json(await getStaff(username));
  } catch (err) {
    return fail(err, "usuario_editar");
  }
}
