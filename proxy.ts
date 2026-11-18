import { NextResponse, type NextRequest } from "next/server";

/* Envía a cada visitante a /es o /en.
   Prioridad: idioma elegido antes (cookie) → idioma del navegador → español. */
const LOCALES = ["es", "en"];

/* Direcciones del sitio anterior (sin idioma) que tienen equivalente directo. */
const LEGACY: Record<string, string> = {
  "/politica-de-datos": "/es/politica-de-datos",
};

function preferredLang(request: NextRequest) {
  const saved = request.cookies.get("lang")?.value;
  if (saved && LOCALES.includes(saved)) return saved;
  const header = request.headers.get("accept-language") ?? "";
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("en") ? "en" : "es";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;

  const url = request.nextUrl.clone();
  url.pathname = LEGACY[pathname] ?? `/${preferredLang(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Todo excepto archivos internos y archivos con extensión (imágenes, robots.txt, llms.txt…)
  matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
