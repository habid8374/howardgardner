import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import About from "@/components/About";
import Rector from "@/components/Rector";
import Levels from "@/components/Levels";
import Bilingual from "@/components/Bilingual";
import Pedagogy from "@/components/Pedagogy";
import Results from "@/components/Results";
import Gallery from "@/components/Gallery";
import Admissions from "@/components/Admissions";
import Faq from "@/components/Faq";
import Visit from "@/components/Visit";
import Privacy from "@/components/Privacy";
import Pqrsf from "@/components/Pqrsf";
import CookiePolicy from "@/components/CookiePolicy";
import { LOCALES, PAGES, SUBPAGES, isLang, pageFromSlug, type Lang } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => SUBPAGES.map((key) => ({ lang, page: PAGES[key][lang] })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[page]">) {
  const { lang, page } = await params;
  if (!isLang(lang)) return {};
  const key = pageFromSlug(lang, page);
  return key ? pageMetadata(lang, key) : {};
}

export default async function SubPage({ params }: PageProps<"/[lang]/[page]">) {
  const { lang: rawLang, page } = await params;
  const lang = rawLang as Lang;
  const key = pageFromSlug(lang, page);
  if (!key) notFound();
  const t = getDictionary(lang);
  const viewer = t.viewer;

  switch (key) {
    case "about":
      return (
        <>
          <PageHeader {...t.pageHeaders.about} />
          <About t={t} />
          <Rector t={t} />
        </>
      );
    case "learning":
      return (
        <>
          <PageHeader {...t.pageHeaders.learning} />
          <Levels t={t} />
          <Bilingual t={t} />
          <Pedagogy t={{ pedagogy: t.pedagogy, viewer }} />
        </>
      );
    case "achievements":
      return (
        <>
          <PageHeader {...t.pageHeaders.achievements} />
          <Results t={t} />
          <Gallery lang={lang} t={{ gallery: t.gallery, viewer }} />
        </>
      );
    case "admissions":
      return (
        <>
          <PageHeader {...t.pageHeaders.admissions} />
          <Admissions lang={lang} t={{ admissions: t.admissions, demo: t.demo, campuses: t.campuses }} />
          <Faq t={t} />
        </>
      );
    case "contact":
      return (
        <>
          <PageHeader {...t.pageHeaders.contact} />
          <Visit t={t} lang={lang} />
        </>
      );
    case "pqrsf":
      return (
        <>
          <PageHeader {...t.pageHeaders.pqrsf} />
          <Pqrsf lang={lang} t={{ pqrsf: t.pqrsf, demo: t.demo, grades: t.admissions.form.grades, campuses: t.campuses }} />
        </>
      );
    case "cookies":
      return <CookiePolicy lang={lang} t={t} />;
    case "privacy":
      return <Privacy lang={lang} t={t} />;
    default:
      notFound();
  }
}
