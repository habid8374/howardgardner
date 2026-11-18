import "server-only";
import { sql } from "./db";

/* Límite de intentos por clave (IP, usuario...) en una ventana de tiempo (OWASP A06/A07).
   Cuenta un intento y devuelve los segundos de espera si se pasó del límite; 0 si puede seguir. */
export async function hit(key: string, max: number, windowS: number, lockS = windowS): Promise<number> {
  const rows = (await sql`
    INSERT INTO rate_limits (key, count, window_start) VALUES (${key}, 1, now())
    ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN rate_limits.window_start < now() - make_interval(secs => ${windowS}) THEN 1 ELSE rate_limits.count + 1 END,
      window_start = CASE WHEN rate_limits.window_start < now() - make_interval(secs => ${windowS}) THEN now() ELSE rate_limits.window_start END,
      locked_until = CASE
        WHEN rate_limits.locked_until > now() THEN rate_limits.locked_until
        WHEN rate_limits.window_start >= now() - make_interval(secs => ${windowS}) AND rate_limits.count + 1 > ${max}
          THEN now() + make_interval(secs => ${lockS})
        ELSE NULL END
    RETURNING EXTRACT(EPOCH FROM (locked_until - now()))::int AS wait
  `) as { wait: number | null }[];
  return Math.max(0, rows[0]?.wait ?? 0);
}

/** Segundos de bloqueo pendientes, sin contar un intento nuevo. */
export async function lockedFor(key: string): Promise<number> {
  const rows = (await sql`SELECT EXTRACT(EPOCH FROM (locked_until - now()))::int AS wait FROM rate_limits WHERE key = ${key}`) as { wait: number | null }[];
  return Math.max(0, rows[0]?.wait ?? 0);
}

/** Intentos fallidos que lleva la clave en la ventana actual. */
export async function attempts(key: string): Promise<number> {
  const rows = (await sql`SELECT count FROM rate_limits WHERE key = ${key}`) as { count: number }[];
  return rows[0]?.count ?? 0;
}

export async function clear(key: string) {
  await sql`DELETE FROM rate_limits WHERE key = ${key}`;
}
