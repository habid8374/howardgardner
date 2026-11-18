import "server-only";
import { NextResponse } from "next/server";
import { currentUser } from "./auth";
import type { Perms, StaffUser } from "@/lib/records";

export const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });

export function clientIp(req: Request) {
  return (req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "local").trim().slice(0, 64);
}

/* Protección CSRF para peticiones que cambian datos: deben venir del mismo sitio.
   (Además la cookie de sesión es SameSite=Strict.) */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return req.headers.get("sec-fetch-site") === "same-origin";
  try {
    const host = new URL(origin).host;
    return host === new URL(req.url).host || host === req.headers.get("host");
  } catch {
    return false;
  }
}

type Need =
  | { area: "admisiones" | "pqrsf"; level: "ver" | "gestionar" }
  | { area: "sedes" | "usuarios" | "exportar" };

/** ¿El usuario tiene este permiso? */
export function allowed(user: StaffUser, need: Need) {
  if (need.area === "admisiones" || need.area === "pqrsf") {
    const v = user.perms[need.area];
    return need.level === "ver" ? v === "ver" || v === "gestionar" : v === "gestionar";
  }
  return user.perms[need.area as keyof Perms] === true;
}

/** Exige sesión válida y, si se indica, un permiso. `write` además exige que la petición venga del mismo sitio (CSRF). */
export async function requireStaff(req: Request, opts: { write?: boolean; need?: Need } = {}): Promise<StaffUser | Response> {
  if (opts.write && !sameOrigin(req)) return json({ error: "origin" }, 403);
  const user = await currentUser();
  if (!user) return json({ error: "auth" }, 401);
  if (opts.need && !allowed(user, opts.need)) return json({ error: "forbidden" }, 403);
  return user;
}

/** Errores: se registran en el servidor con un código; al usuario solo le llega el código (OWASP A10). */
export function fail(err: unknown, where: string) {
  const ref = Math.random().toString(36).slice(2, 10);
  console.error(`[${where}] ref=${ref}`, err);
  return json({ error: "server", ref }, 500);
}
