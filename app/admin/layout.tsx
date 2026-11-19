import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "../globals.css";
import { SITE_URL } from "@/lib/site";

/* Panel del colegio. Diseño propio, sin el menú público. En español e inglés. */
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz", "SOFT"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Panel del colegio | Howard Gardner Bilingual School",
  description: "Acceso exclusivo del personal: preinscripciones 2027, PQRSF con plazos y alertas, y reportes en Excel.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Panel del colegio · Howard Gardner Bilingual School",
    description: "Acceso exclusivo del personal: preinscripciones 2027, PQRSF con plazos y alertas, y reportes en Excel.",
    url: `${SITE_URL}/admin`,
    siteName: "Howard Gardner Bilingual School",
    locale: "es_CO",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Panel del colegio · Howard Gardner Bilingual School" },
  icons: {
    icon: [
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
};

export const viewport: Viewport = { themeColor: "#0c1631", width: "device-width", initialScale: 1 };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="admin-body">{children}</body>
    </html>
  );
}
