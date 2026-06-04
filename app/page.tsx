import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Rector from "@/components/Rector";
import Story from "@/components/Story";
import Stats from "@/components/Stats";
import Achievements from "@/components/Achievements";
import Bilingual from "@/components/Bilingual";
import Academic from "@/components/Academic";
import Propuesta from "@/components/Propuesta";
import Gallery from "@/components/Gallery";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Rector />
        <Story />
        <Stats />
        <Achievements />
        <Bilingual />
        <Academic />
        <Propuesta />
        <Gallery />
        <Features />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
