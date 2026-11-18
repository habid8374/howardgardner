import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { href, OG_LOCALE, type Lang, type PageKey } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

/* Las imágenes para compartir salen de opengraph-image.tsx (una tarjeta por página e idioma).
   Metadatos por página e idioma, con hreflang para que Google
   entienda que /es/admisiones y /en/admissions son la misma página. */
export function pageMetadata(lang: Lang, page: PageKey): Metadata {
  const t = getDictionary(lang);
  const m = t.meta.pages[page];
  const description = m.description || t.meta.description;
  const path = href(lang, page);
  const title = page === "home" ? { absolute: m.title } : m.title;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: { "es-CO": href("es", page), en: href("en", page), "x-default": href("es", page) },
    },
    openGraph: {
      title: page === "home" ? m.title : `${m.title} | ${t.meta.siteName}`,
      description,
      url: `${SITE_URL}${path}`,
      siteName: t.meta.siteName,
      locale: OG_LOCALE[lang],
      alternateLocale: [OG_LOCALE[lang === "es" ? "en" : "es"]],
      type: "website",
    },
    twitter: { card: "summary_large_image", title: m.title, description },
  };
}
