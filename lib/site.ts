/* Configuración central del sitio.
   Cambiar SITE_URL aquí cuando se compre el dominio propio
   (se actualiza automáticamente en SEO, sitemap, robots y JSON-LD). */
export const SITE_URL = "https://howardgardner.vercel.app";
export const SITE_NAME = "Howard Gardner Bilingual School";
export const LEGAL_NAME = "Howard Gardner De Sabanalarga S.A.S.";
export const NIT = "900.419.545-7";

/* Un solo número y un solo canal principal en todo el sitio. */
export const PHONE_DISPLAY = "301 202 8756";
export const PHONE_E164 = "+573012028756";
export const TEL_HREF = `tel:${PHONE_E164}`;

export const ADDRESS = {
  street: "Calle 12 #34 B-2",
  city: "Sabanalarga",
  region: "Atlántico",
  country: "CO",
};
export const ADDRESS_LINE = `${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.region}`;
/* TODO(CLIENTE): reemplazar por el enlace del perfil de Google del colegio. */
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`Howard Gardner Bilingual School, ${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.region}, Colombia`);
export const MAPS_EMBED =
  "https://maps.google.com/maps?q=" +
  encodeURIComponent(`Howard Gardner Bilingual School, ${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.region}, Colombia`) +
  "&z=16&output=embed";

/* Imagen principal del inicio (escritorio y celular). Cambiar aquí. */
export const HERO_IMAGE = {
  src: "/patio.jpg",
  alt: "Patio arborizado y zonas de juego del colegio Howard Gardner en Sabanalarga",
};

export const HOURS = "Lunes a viernes, 7:00 a. m. – 5:00 p. m.";

export const SOCIAL = {
  instagram: "https://www.instagram.com/howard_gardner_sabanalarga",
  instagramHandle: "@howard_gardner_sabanalarga",
  facebook: "https://www.facebook.com/gardneristaoficial",
};

export function waLink(message: string) {
  return `https://wa.me/${PHONE_E164.replace("+", "")}?text=${encodeURIComponent(message)}`;
}

export const WA_ADMISIONES = waLink(
  "Hola, quiero información sobre inscripciones 2027 en Howard Gardner Bilingual School."
);
export const WA_VISITA = waLink(
  "Hola, quiero agendar una visita al colegio Howard Gardner Bilingual School."
);
