import { notFound } from "next/navigation";
import { isLang, LOCALES } from "@/lib/i18n";
import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt = "Howard Gardner Bilingual School · Sabanalarga";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return ogImage(lang, "home");
}
