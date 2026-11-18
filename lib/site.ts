/* Configuración central del sitio (datos que no cambian con el idioma).
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

const MAPS_QUERY = `Howard Gardner Bilingual School, ${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.region}, Colombia`;
/* TODO(CLIENTE): reemplazar por el enlace del perfil de Google del colegio. */
export const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(MAPS_QUERY);
export const MAPS_EMBED = "https://maps.google.com/maps?q=" + encodeURIComponent(MAPS_QUERY) + "&z=16&output=embed";

/* ── Sedes ──
   La sede principal usa los datos de arriba. La nueva sede está "próximamente":
   TODO(CLIENTE): dirección, teléfono, horario, grados y fecha de apertura de la nueva sede. */
export type CampusInfo = {
  id: "principal" | "sede2";
  status: "open" | "soon";
  address: string | null;
  mapsUrl: string | null;
  mapsEmbed: string | null;
  phoneDisplay: string;
  telHref: string;
};
export const CAMPUSES: CampusInfo[] = [
  { id: "principal", status: "open", address: ADDRESS_LINE, mapsUrl: MAPS_URL, mapsEmbed: MAPS_EMBED, phoneDisplay: PHONE_DISPLAY, telHref: TEL_HREF },
  { id: "sede2", status: "soon", address: null, mapsUrl: null, mapsEmbed: null, phoneDisplay: PHONE_DISPLAY, telHref: TEL_HREF },
];

/* Imagen principal del inicio (escritorio y celular). Cambiar aquí. */
export const HERO_IMAGE_SRC = "/patio.jpg";

export const SOCIAL = {
  instagram: "https://www.instagram.com/howard_gardner_sabanalarga",
  instagramHandle: "@howard_gardner_sabanalarga",
  facebook: "https://www.facebook.com/gardneristaoficial",
};

export function waLink(message: string) {
  return `https://wa.me/${PHONE_E164.replace("+", "")}?text=${encodeURIComponent(message)}`;
}
