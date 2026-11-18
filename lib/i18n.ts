/* Idiomas y rutas del sitio.
   Cada página tiene su dirección traducida: /es/admisiones ↔ /en/admissions. */

export const LOCALES = ["es", "en"] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = "es";

export function isLang(value: string | undefined): value is Lang {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export const PAGES = {
  home: { es: "", en: "" },
  about: { es: "nosotros", en: "about" },
  learning: { es: "aprendizaje", en: "learning" },
  achievements: { es: "reconocimientos", en: "achievements" },
  admissions: { es: "admisiones", en: "admissions" },
  contact: { es: "contacto", en: "contact" },
  privacy: { es: "politica-de-datos", en: "privacy-policy" },
} as const;

export type PageKey = keyof typeof PAGES;
export const SUBPAGES = (Object.keys(PAGES) as PageKey[]).filter((k) => k !== "home");

/** Ruta interna de una página en un idioma, con ancla opcional. */
export function href(lang: Lang, page: PageKey, hash?: string) {
  const slug = PAGES[page][lang];
  return `/${lang}${slug ? `/${slug}` : ""}${hash ? `#${hash}` : ""}`;
}

export function pageFromSlug(lang: Lang, slug: string): PageKey | undefined {
  return SUBPAGES.find((k) => PAGES[k][lang] === slug);
}

/** Dada una ruta (/es/admisiones), devuelve la página a la que corresponde. */
export function pageFromPath(pathname: string): PageKey {
  const [, maybeLang, slug] = pathname.split("/");
  if (!isLang(maybeLang) || !slug) return "home";
  return pageFromSlug(maybeLang, slug) ?? "home";
}

export const HTML_LANG: Record<Lang, string> = { es: "es-CO", en: "en" };
export const OG_LOCALE: Record<Lang, string> = { es: "es_CO", en: "en_US" };
