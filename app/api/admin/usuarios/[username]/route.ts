import { staffUpdate } from "@/lib/server/validate";
import { audit, getCampus, sql } from "@/lib/server/db";
import { hashPassword, startSession } from "@/lib/server/auth";
import { clientIp, fail, json, requireStaff } from "@/lib/server/http";
import { getStaff, otherUserAdmins, permsProblem } from "@/lib/server/settings";
import { weakPassword } from "@/lib/server/password";

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

    // La cuenta de soporte (superusuario) solo la edita otro superusuario
    if (current.superuser && !user.superuser) return json({ error: "superuser_protected" }, 403);

    // Cambio de nombre de usuario (opcional)
    const newName = d.username && d.username !== username ? d.username : null;
    if (newName && (await getStaff(newName))) return json({ error: "exists" }, 409);

    const self = username === user.username;
    if (self && (!d.active || !d.perms.usuarios)) return json({ error: "self_lockout" }, 409);
    const losesAdmin = current.active && current.perms.usuarios && (!d.active || !d.perms.usuarios);
    if (losesAdmin && (await otherUserAdmins(username)) === 0) return json({ error: "last_admin" }, 409);

    if (d.password && weakPassword(d.password, newName ?? username)) return json({ error: "weak_password", fields: ["password"] }, 400);
    const hash = d.password ? await hashPassword(d.password) : null;
    await sql`UPDATE staff SET username = ${newName ?? username}, name = ${d.name}, campus = ${d.campus}, perms = ${JSON.stringify(d.perms)}::jsonb,
        active = ${d.active}, pass_hash = COALESCE(${hash}, pass_hash), updated_at = now(),
        -- Clave nueva, usuario nuevo o cuenta desactivada: se cierran sus sesiones abiertas (OWASP ASVS V7)
        session_version = session_version + CASE WHEN ${!!hash || !!newName || (!d.active && current.active)} THEN 1 ELSE 0 END
      WHERE username = ${username}`;
    if (newName) {
      await audit(user.username, `usuario_renombrado:${username}`, newName, clientIp(req));
      // Si se renombró a sí mismo, se renueva su sesión con el nuevo usuario
      if (self) await startSession({ ...user, username: newName });
    } else if (self && hash) {
      // Cambió su propia clave: sus otras sesiones se cierran y esta continúa con una sesión nueva
      await startSession(user);
    }
    // Si se desactiva, también se limpian sus bloqueos de acceso
    if (!d.active) await sql`DELETE FROM rate_limits WHERE key = ${`login:u:${username}`}`;
    await audit(user.username, hash ? "usuario_editado_clave" : "usuario_editado", username, clientIp(req));
    return json(await getStaff(newName ?? username));
  } catch (err) {
    return fail(err, "usuario_editar");
  }
}
