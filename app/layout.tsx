import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  SITE_URL, SITE_NAME, LEGAL_NAME, NIT, PHONE_E164, ADDRESS, SOCIAL, HOURS,
} from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const DESCRIPTION =
  "Colegio bilingüe en Sabanalarga, Atlántico, de preescolar a grado 11°. Único colegio A+ de Sabanalarga y primero del municipio en el Índice de Clasificación del ICFES 2026. Colegio Oxford Quality. Inscripciones y matrículas 2027 abiertas.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Colegio bilingüe en Sabanalarga | Howard Gardner Bilingual School",
    template: "%s | Howard Gardner Bilingual School",
  },
  description: DESCRIPTION,
  keywords: [
    "colegio bilingüe sabanalarga",
    "howard gardner sabanalarga",
    "mejor colegio sabanalarga",
    "icfes 2026 atlántico",
    "colegio bilingüe atlántico",
    "inscripciones 2027 sabanalarga",
    "colegio a+ sabanalarga",
    "oxford quality sabanalarga",
    "preescolar bilingüe sabanalarga",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "education",
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon_256.png", apple: "/favicon_256.png" },
  openGraph: {
    title: "Howard Gardner Bilingual School · Único colegio A+ de Sabanalarga",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "es_CO",
    type: "website",
    images: [{ url: "/patio.jpg", width: 1080, height: 608, alt: "Patio y zonas verdes del colegio Howard Gardner en Sabanalarga" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Howard Gardner Bilingual School · Único colegio A+ de Sabanalarga",
    description: DESCRIPTION,
    images: ["/patio.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#0c1631",
  width: "device-width",
  initialScale: 1,
};

/* Datos estructurados — el colegio como organización educativa y negocio local. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["School", "LocalBusiness"],
  "@id": `${SITE_URL}/#colegio`,
  name: SITE_NAME,
  legalName: LEGAL_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/howard_gardner_logo_sin_fondo.png`,
  image: `${SITE_URL}/patio.jpg`,
  description: DESCRIPTION,
  slogan: "Your Vision Is Our Inspiration",
  telephone: PHONE_E164,
  taxID: NIT,
  openingHours: "Mo-Fr 07:00-17:00",
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS.street,
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.region,
    addressCountry: ADDRESS.country,
  },
  areaServed: "Sabanalarga, Atlántico, Colombia",
  sameAs: [SOCIAL.instagram, SOCIAL.facebook],
  award: [
    "Categoría A+ Índice de Clasificación ICFES 2026 (único en Sabanalarga)",
    "Primer puesto municipal Índice de Clasificación ICFES 2026",
    "Primer lugar municipal Pruebas Saber 11° 2025 (297 puntos)",
    "Oxford Quality (Oxford University Press)",
  ],
  hoursAvailable: HOURS,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={`${fraunces.variable} ${manrope.variable}`} data-scroll-behavior="smooth">
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:font-bold focus:text-ink"
        >
          Saltar al contenido
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
