import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "../globals.css";

/* Panel del colegio (demo). Diseño propio, sin el menú público. Solo en español. */
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz", "SOFT"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Panel del colegio (demo) | Howard Gardner Bilingual School",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon_256.png" },
};

export const viewport: Viewport = { themeColor: "#0c1631", width: "device-width", initialScale: 1 };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="admin-body">{children}</body>
    </html>
  );
}
