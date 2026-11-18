import Hero from "@/components/Hero";
import Results from "@/components/Results";
import Levels from "@/components/Levels";
import Bilingual from "@/components/Bilingual";
import Pedagogy from "@/components/Pedagogy";
import Gallery from "@/components/Gallery";
import AdmissionsBand from "@/components/AdmissionsBand";
import Visit from "@/components/Visit";
import { isLang, type Lang } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { publicCampuses } from "@/lib/server/db";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  return isLang(lang) ? pageMetadata(lang, "home") : {};
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = (await params).lang as Lang;
  const t = getDictionary(lang);
  const campuses = await publicCampuses();
  return (
    <>
      <Hero lang={lang} t={t} />
      <Results t={t} />
      <Levels t={t} />
      <Bilingual t={t} />
      <Pedagogy t={{ pedagogy: t.pedagogy, viewer: t.viewer }} />
      <Gallery lang={lang} t={{ gallery: t.gallery, viewer: t.viewer }} limit={4} />
      <AdmissionsBand lang={lang} t={t} />
      <Visit t={t} lang={lang} campuses={campuses} />
    </>
  );
}
