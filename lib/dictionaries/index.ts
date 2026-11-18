import type { Lang, PageKey } from "@/lib/i18n";
import { es, type Dict } from "./es";
import { en } from "./en";

const dictionaries: Record<Lang, Dict> = { es, en };

export function getDictionary(lang: Lang): Dict {
  return dictionaries[lang];
}

export type { Dict };
export type NavItem = { label: string; page: PageKey; hash?: string };
export type NavGroup = { label: string; page: PageKey; items: NavItem[] };
