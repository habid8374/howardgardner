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

/* ── Sedes: los datos viven en la base de datos y se editan desde el panel (pestaña Sedes) ── */
type MapsInput = { nameEs: string; address: string; city: string; mapsUrl: string };
export function campusMaps(c: MapsInput) {
  if (!c.address) return { url: c.mapsUrl || null, embed: null };
  const q = `Howard Gardner Bilingual School ${c.nameEs}, ${c.address}, ${c.city}, Colombia`;
  return {
    url: c.mapsUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q),
    embed: "https://maps.google.com/maps?q=" + encodeURIComponent(q) + "&z=16&output=embed",
  };
}
export const telHref = (phone: string) => `tel:+57${phone.replace(/\D/g, "").replace(/^57(?=\d{10}$)/, "")}`;
export function waLinkTo(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.length === 10 ? "57" + digits : digits}?text=${encodeURIComponent(message)}`;
}

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
