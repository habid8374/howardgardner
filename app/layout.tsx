import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins-var",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Howard Gardner Bilingual School | Sabanalarga, Atlántico",
    template: "%s | Howard Gardner Bilingual School",
  },
  description:
    "#1 en el ranking ICFES municipal 2025 con 297 puntos, categoría A+ Excelencia. Institución bilingüe líder en Sabanalarga, Atlántico. Inscripciones abiertas 2026.",
  keywords: [
    "colegio bilingüe sabanalarga",
    "howard gardner sabanalarga",
    "mejor colegio sabanalarga",
    "icfes 2025 atlántico",
    "colegio bilingüe atlántico",
    "bilingual school colombia",
    "inscripciones 2026 sabanalarga",
    "educación bilingüe",
  ],
  authors: [{ name: "Howard Gardner Bilingual School" }],
  creator: "Howard Gardner Bilingual School",
  publisher: "Howard Gardner Bilingual School",
  category: "education",
  applicationName: "Howard Gardner Bilingual School",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon_256.png",
    apple: "/favicon_256.png",
  },
  openGraph: {
    title: "Howard Gardner Bilingual School | #1 ICFES Municipal 2025",
    description:
      "#1 en el ranking ICFES municipal 2025 · Categoría A+ Excelencia · Institución bilingüe en Sabanalarga, Atlántico. Inscripciones 2026 abiertas.",
    url: SITE_URL,
    siteName: "Howard Gardner Bilingual School",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/patio.jpg",
        width: 1080,
        height: 608,
        alt: "Campus del Howard Gardner Bilingual School en Sabanalarga, Atlántico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Howard Gardner Bilingual School | #1 ICFES Municipal 2025",
    description:
      "Institución bilingüe líder en Sabanalarga, Atlántico. Categoría A+ Excelencia. Inscripciones 2026 abiertas.",
    images: ["/patio.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#13136b",
  width: "device-width",
  initialScale: 1,
};

/* Datos estructurados (JSON-LD) — ayuda a Google a mostrar el colegio
   como una organización educativa con ubicación, contacto y redes. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Howard Gardner Bilingual School",
  alternateName: "Howard Gardner De Sabanalarga S.A.S.",
  url: SITE_URL,
  logo: `${SITE_URL}/howard_gardner_logo_sin_fondo.png`,
  image: `${SITE_URL}/patio.jpg`,
  description:
    "Institución educativa bilingüe en Sabanalarga, Atlántico. #1 en el ranking ICFES municipal 2025, categoría A+ Excelencia.",
  slogan: "Your Vision Is Our Inspiration",
  telephone: "+57 301 202 8756",
  taxID: "900.419.545-7",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle 12 #34 B-2",
    addressLocality: "Sabanalarga",
    addressRegion: "Atlántico",
    addressCountry: "CO",
  },
  areaServed: "Sabanalarga, Atlántico, Colombia",
  sameAs: [
    "https://www.instagram.com/howard_gardner_sabanalarga",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
