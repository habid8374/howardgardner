import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Achievements from "@/components/Achievements";
import Bilingual from "@/components/Bilingual";
import Academic from "@/components/Academic";
import Gallery from "@/components/Gallery";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Achievements />
        <Bilingual />
        <Academic />
        <Gallery />
        <Features />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
