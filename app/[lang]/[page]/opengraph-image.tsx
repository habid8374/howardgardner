import { notFound } from "next/navigation";
import { isLang, pageFromSlug, LOCALES, PAGES, SUBPAGES } from "@/lib/i18n";
import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt = "Howard Gardner Bilingual School · Sabanalarga";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => SUBPAGES.map((p) => ({ lang, page: PAGES[p][lang] })));
}

export default async function Image({ params }: { params: Promise<{ lang: string; page: string }> }) {
  const { lang, page } = await params;
  if (!isLang(lang)) notFound();
  const key = pageFromSlug(lang, page);
  if (!key) notFound();
  return ogImage(lang, key);
}
