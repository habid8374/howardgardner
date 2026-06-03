import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins-var",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Howard Gardner Bilingual School | Sabanalarga, Atlántico",
  description:
    "#1 en el ranking ICFES municipal 2025 con 297 puntos, categoría A+ Excelencia. La única institución bilingüe en Sabanalarga, Atlántico.",
  keywords:
    "colegio bilingüe sabanalarga, howard gardner, icfes 2025, mejor colegio atlántico, bilingual school",
  icons: {
    icon: "/favicon_256.png",
    apple: "/favicon_256.png",
  },
  openGraph: {
    title: "Howard Gardner Bilingual School",
    description: "#1 ICFES Municipal 2025 · Categoría A+ · Sabanalarga, Atlántico",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/howard_gardner_logo_sin_fondo.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
