import type { MetadataRoute } from "next";

/* Manifiesto web: nombre e íconos cuando se agrega el sitio a la pantalla de inicio. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Howard Gardner Bilingual School",
    short_name: "Howard Gardner",
    description: "Colegio bilingüe en Sabanalarga, Atlántico. Bilingual school in Sabanalarga, Colombia.",
    start_url: "/es",
    display: "browser",
    background_color: "#f7f4ec",
    theme_color: "#0c1631",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
