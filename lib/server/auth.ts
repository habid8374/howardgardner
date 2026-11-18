import "server-only";
import { createHmac, randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { sql } from "./db";
import type { StaffUser } from "@/lib/records";

/* Acceso al panel (OWASP A01, A04, A07):
   - Contraseñas con scrypt y sal por usuario; comparación en tiempo constante.
   - Sesión en cookie HttpOnly + Secure + SameSite=Strict, firmada con HMAC y con vencimiento (8 h).
   - Cada petición del panel vuelve a verificar la sesión y el usuario en la base de datos. */
const scrypt = promisify(_scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
const COOKIE = "hg_staff";
const TTL_S = 8 * 60 * 60;

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET no configurado");
  return s;
}

export async function hashPassword(pw: string) {
  const salt = randomBytes(16);
  const key = await scrypt(pw.normalize("NFKC"), salt, 64);
  return `scrypt$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(pw: string, stored: string) {
  const [alg, saltB64, keyB64] = stored.split("$");
  if (alg !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64");
  const got = await scrypt(pw.normalize("NFKC"), Buffer.from(saltB64, "base64"), expected.length);
  return got.length === expected.length && timingSafeEqual(got, expected);
}

/* Hash de relleno: un usuario inexistente tarda lo mismo que uno real (no revela qué usuarios existen). */
const DUMMY = "scrypt$AAAAAAAAAAAAAAAAAAAAAA==$" + Buffer.alloc(64).toString("base64");

export async function checkLogin(username: string, password: string): Promise<StaffUser | null> {
  const rows = (await sql`SELECT username, name, role, campus, pass_hash FROM staff WHERE username = ${username}`) as (StaffUser & { pass_hash: string })[];
  const row = rows[0];
  const ok = await verifyPassword(password, row?.pass_hash ?? DUMMY);
  return ok && row ? { username: row.username, name: row.name, role: row.role, campus: row.campus ?? null } : null;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export async function startSession(user: StaffUser) {
  const payload = Buffer.from(
    JSON.stringify({ u: user.username, exp: Math.floor(Date.now() / 1000) + TTL_S, n: randomBytes(8).toString("hex") })
  ).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: TTL_S,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

/** Usuario de la sesión actual, verificado contra la base de datos; null si no hay sesión válida. */
export async function currentUser(): Promise<StaffUser | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, mac] = raw.split(".");
  if (!payload || !mac) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  let data: { u?: string; exp?: number };
  try { data = JSON.parse(Buffer.from(payload, "base64url").toString()); } catch { return null; }
  if (!data.u || !data.exp || data.exp < Date.now() / 1000) return null;
  const rows = (await sql`SELECT username, name, role, campus FROM staff WHERE username = ${data.u}`) as StaffUser[];
  return rows[0] ? { ...rows[0], campus: rows[0].campus ?? null } : null;
}
