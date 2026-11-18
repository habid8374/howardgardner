import { checkLogin, currentUser, endSession, startSession } from "@/lib/server/auth";
import { loginInput } from "@/lib/server/validate";
import { audit } from "@/lib/server/db";
import { clientIp, fail, json, sameOrigin } from "@/lib/server/http";
import { attempts, clear, hit, lockedFor } from "@/lib/server/rate";

const MAX = 5;             // intentos fallidos por usuario
const WINDOW = 15 * 60;    // en 15 minutos
const LOCK = 15 * 60;      // bloqueo de 15 minutos
const DEMO = process.env.DEMO_MODE === "1";

/* ¿Hay sesión? */
export async function GET() {
  try {
    return json({ user: await currentUser(), demo: DEMO });
  } catch (err) {
    return fail(err, "sesion");
  }
}

/* Iniciar sesión con usuario y contraseña. Bloqueo progresivo por usuario y por IP (OWASP A07). */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "origin" }, 403);
  try {
    const parsed = loginInput.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: "invalid" }, 400);
    const { username, password } = parsed.data;
    const ip = clientIp(req);
    const userKey = `login:u:${username}`;
    const ipKey = `login:ip:${ip}`;

    const wait = Math.max(await lockedFor(userKey), await lockedFor(ipKey));
    if (wait) return json({ error: "locked", wait }, 429);

    const user = await checkLogin(username, password);
    if (!user) {
      const w = Math.max(await hit(userKey, MAX, WINDOW, LOCK), await hit(ipKey, 20, WINDOW, LOCK));
      await audit(username, "login_fallido", "", ip);
      if (w) return json({ error: "locked", wait: w }, 429);
      return json({ error: "credentials", left: Math.max(0, MAX - (await attempts(userKey))) }, 401);
    }

    await clear(userKey);
    await startSession(user);
    await audit(user.username, "login", "", ip);
    return json({ user });
  } catch (err) {
    return fail(err, "login");
  }
}

/* Cerrar sesión */
export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return json({ error: "origin" }, 403);
  const user = await currentUser().catch(() => null);
  await endSession();
  if (user) await audit(user.username, "logout", "", clientIp(req));
  return json({ ok: true });
}
