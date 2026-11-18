import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "../globals.css";

/* Panel del colegio (demo). Diseño propio, sin el menú público. En español e inglés. */
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz", "SOFT"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Panel del colegio (demo) | Howard Gardner Bilingual School",
  robots: { index: false, follow: false },
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
