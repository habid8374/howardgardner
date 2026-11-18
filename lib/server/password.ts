import "server-only";

/* Política de contraseñas (OWASP ASVS 5.0, V6.2):
   - Mínimo 10 caracteres (se valida en validate.ts), sin reglas de composición forzadas.
   - Se rechazan contraseñas de uso común y las que contienen el usuario o palabras obvias del colegio,
     que son las primeras que prueba un atacante. */
const COMMON = new Set([
  "1234567890", "12345678910", "0123456789", "1111111111", "0000000000", "qwertyuiop", "asdfghjkl1", "password12",
  "password123", "contrasena", "contraseña", "contrasena1", "contraseña1", "administrador", "admin12345", "admin123456",
  "iloveyou12", "colombia123", "colombia2026", "colombia2027", "barranquilla", "atlantico123", "bienvenido1", "bienvenido",
  "123456789a", "a123456789", "abc1234567", "qwerty1234", "1q2w3e4r5t", "zaq12wsxcd", "passw0rd12", "superman12",
]);
const SCHOOL_WORDS = ["howard", "gardner", "colegio", "sabanalarga", "bilingual", "gardnerista"];

/** Devuelve un motivo si la contraseña es débil; null si está bien. */
export function weakPassword(password: string, username: string): string | null {
  const p = password.normalize("NFKC").toLowerCase();
  const u = username.toLowerCase();
  if (COMMON.has(p)) return "common";
  if (u.length >= 3 && p.includes(u)) return "username";
  if (SCHOOL_WORDS.some((w) => p.includes(w))) return "school";
  if (/^(.)\1+$/.test(p)) return "repeated";
  if (new Set(p).size < 4) return "low_variety";
  return null;
}
