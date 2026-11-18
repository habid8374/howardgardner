import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { LOCALES, PAGES, href, type PageKey } from "@/lib/i18n";

const PRIORITY: Partial<Record<PageKey, number>> = { home: 1, admissions: 0.9, privacy: 0.2 };

export default function sitemap(): MetadataRoute.Sitemap {
  const keys = Object.keys(PAGES) as PageKey[];
  return keys.flatMap((page) =>
    LOCALES.map((lang) => ({
      url: `${SITE_URL}${href(lang, page)}`,
      lastModified: new Date(),
      changeFrequency: page === "privacy" ? ("yearly" as const) : ("weekly" as const),
      priority: PRIORITY[page] ?? 0.7,
      alternates: { languages: { "es-CO": `${SITE_URL}${href("es", page)}`, en: `${SITE_URL}${href("en", page)}` } },
    }))
  );
}
