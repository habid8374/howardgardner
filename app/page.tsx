import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Results from "@/components/Results";
import Levels from "@/components/Levels";
import Bilingual from "@/components/Bilingual";
import Pedagogy from "@/components/Pedagogy";
import Rector from "@/components/Rector";
import Gallery from "@/components/Gallery";
import Admissions from "@/components/Admissions";
import Faq from "@/components/Faq";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <Results />
        <Levels />
        <Bilingual />
        <Pedagogy />
        <Rector />
        <Gallery />
        <Admissions />
        <Faq />
        <Visit />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
