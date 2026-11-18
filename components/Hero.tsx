import { HERO_IMAGE_SRC, waLink } from "@/lib/site";
import { href, type Lang } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";
import HeroCarousel, { type HeroSlide } from "./HeroCarousel";

// Carrusel principal: noticias del colegio (inscripciones, Family Day, A+, Oxford) y la presentación institucional.
// Los textos son HTML real en los dos idiomas; la pieza de redes acompaña, no reemplaza al texto.
export default function Hero({ lang, t }: { lang: Lang; t: Dict }) {
  const h = t.hero;
  const [enroll, family, aPlus, oxford] = h.slides;
  const enrollHref = href(lang, "admissions");

  const slides: HeroSlide[] = [
    {
      ...enroll,
      kind: "piece",
      primary: { label: enroll.cta, href: enrollHref },
      secondary: { label: t.common.whatsapp, href: waLink(t.wa.admissions), external: true },
    },
    {
      ...family,
      kind: "photo",
      position: "62% 40%",
      primary: { label: family.cta, href: href(lang, "achievements", "noticias") },
      secondary: { label: t.common.enroll, href: enrollHref },
    },
    {
      ...aPlus,
      kind: "piece",
      primary: { label: aPlus.cta, href: href(lang, "achievements", "resultados") },
      secondary: { label: t.common.enroll, href: enrollHref },
    },
    {
      ...oxford,
      kind: "piece",
      primary: { label: oxford.cta, href: href(lang, "learning", "bilinguismo") },
      secondary: { label: t.common.enroll, href: enrollHref },
    },
    {
      id: "colegio",
      kind: "photo",
      eyebrow: h.eyebrow,
      title: h.title,
      lead: h.lead,
      image: HERO_IMAGE_SRC,
      alt: h.photoAlt,
      primary: { label: t.common.visit, href: waLink(t.wa.visit), external: true },
      secondary: { label: t.common.enroll, href: enrollHref },
    },
  ];

  return <HeroCarousel h1={h.h1} slides={slides} stats={h.stats} labels={h.carousel} />;
}
