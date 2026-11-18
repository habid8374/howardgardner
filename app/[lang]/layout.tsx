import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Manrope } from "next/font/google";
import ConsentAnalytics from "@/components/ConsentAnalytics";
import CookieBanner from "@/components/CookieBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { SITE_URL, SITE_NAME, LEGAL_NAME, NIT, PHONE_E164, ADDRESS, SOCIAL } from "@/lib/site";
import { HTML_LANG, LOCALES, href, isLang } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import "../globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz", "SOFT"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.pages.home.title, template: `%s | ${SITE_NAME}` },
    description: t.meta.description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    category: "education",
    icons: {
      icon: [
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
  };
}

export const viewport: Viewport = { themeColor: "#0c1631", width: "device-width", initialScale: 1 };

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);

  /* Datos estructurados — el colegio como organización educativa y negocio local. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["School", "LocalBusiness"],
    "@id": `${SITE_URL}/#colegio`,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: `${SITE_URL}${href(lang, "home")}`,
    logo: `${SITE_URL}/howard_gardner_logo_sin_fondo.png`,
    image: `${SITE_URL}/patio.jpg`,
    description: t.meta.description,
    slogan: "Your Vision Is Our Inspiration",
    telephone: PHONE_E164,
    taxID: NIT,
    openingHours: "Mo-Fr 07:00-17:00",
    inLanguage: HTML_LANG[lang],
    availableLanguage: ["es", "en"],
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.region,
      addressCountry: ADDRESS.country,
    },
    areaServed: "Sabanalarga, Atlántico, Colombia",
    sameAs: [SOCIAL.instagram, SOCIAL.facebook],
    award:
      lang === "es"
        ? [
            "Categoría A+ Índice de Clasificación ICFES 2026 (único en Sabanalarga)",
            "Primer puesto municipal Índice de Clasificación ICFES 2026",
            "Primer lugar municipal Pruebas Saber 11° 2025 (297 puntos)",
            "Oxford Quality (Oxford University Press)",
          ]
        : [
            "A+ rating, 2026 ICFES school index (the only one in Sabanalarga)",
            "First in town, 2026 ICFES school index",
            "First in town, Saber 11° 2025 (overall score 297)",
            "Oxford Quality (Oxford University Press)",
          ],
  };

  return (
    <html lang={HTML_LANG[lang]} className={`${fraunces.variable} ${manrope.variable}`} data-scroll-behavior="smooth">
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:font-bold focus:text-ink"
        >
          {t.common.skip}
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <Header lang={lang} t={{ nav: t.nav, common: t.common, wa: t.wa }} />
        <main id="contenido">{children}</main>
        <Footer lang={lang} t={t} />
        <WhatsAppFloat t={t} />
        <CookieBanner lang={lang} t={t.cookies} />
        <ConsentAnalytics />
      </body>
    </html>
  );
}
