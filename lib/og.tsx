/* eslint-disable @next/next/no-img-element -- ImageResponse (Satori) solo entiende <img>, no next/image */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getDictionary } from "@/lib/dictionaries";
import type { Lang, PageKey } from "@/lib/i18n";

/* Tarjetas para compartir (Open Graph / WhatsApp / Facebook / X): 1200×630,
   una por página e idioma. Se generan al compilar, no en cada visita. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/jpeg";

const dir = join(process.cwd(), "assets/og");
const file = (name: string) => readFile(join(dir, name));
const dataUrl = async (name: string, mime: string) => `data:${mime};base64,${(await file(name)).toString("base64")}`;

const PHOTO: Record<PageKey, string> = {
  home: "home", about: "about", learning: "learning", achievements: "achievements",
  admissions: "admissions", contact: "contact", pqrsf: "pqrsf", privacy: "legal", cookies: "legal",
};

const INK = "#0c1631";
const GOLD = "#e3b23c";

function texts(lang: Lang, page: PageKey): { eyebrow: string; title: [string, string, string] } {
  const t = getDictionary(lang);
  if (page === "home") {
    const [a, b, c] = t.hero.title;
    return { eyebrow: t.hero.eyebrow, title: [a, b, c] };
  }
  if (page === "privacy" || page === "cookies") {
    const [eyebrow, title] = t.og.legal[page];
    return { eyebrow, title: [title, "", ""] };
  }
  const h = t.pageHeaders[page];
  return { eyebrow: h.eyebrow, title: [h.title, "", ""] };
}

/* Divide [antes, resaltado, después] en palabras; la puntuación pegada no lleva espacio antes. */
function words(title: [string, string, string]) {
  const out: { text: string; gold: boolean; glue: boolean }[] = [];
  title.forEach((part, idx) => {
    const tokens = part.split(/\s+/).filter(Boolean);
    tokens.forEach((text) => out.push({ text, gold: idx === 1, glue: false }));
    if (out.length && /\S$/.test(part) && title[idx + 1] && /^[.,;:!?]/.test(title[idx + 1])) out[out.length - 1].glue = true;
  });
  return out;
}

export async function ogImage(lang: Lang, page: PageKey) {
  const t = getDictionary(lang);
  const { eyebrow, title } = texts(lang, page);
  const [fraunces, manrope500, manrope700, doodles, logo, photo] = await Promise.all([
    file("fraunces-500.woff"), file("manrope-500.woff"), file("manrope-700.woff"),
    dataUrl("doodles.png", "image/png"), dataUrl("logo.png", "image/png"),
    dataUrl(`photo-${PHOTO[page]}.jpg`, "image/jpeg"),
  ]);
  const long = title.join("").length > 42;

  const png = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: INK, color: "white", fontFamily: "Manrope", position: "relative" }}>
        {/* Fondo de dibujos, igual que en el sitio */}
        <img src={doodles} width={1280} height={720} alt="" style={{ position: "absolute", left: -40, top: -40, opacity: 0.09 }} />
        {/* Brillo dorado */}
        <div style={{ position: "absolute", left: -220, bottom: -260, width: 620, height: 620, borderRadius: 9999, background: "radial-gradient(closest-side, rgba(227,178,60,0.22), rgba(227,178,60,0))" }} />

        {/* Columna de texto */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 720, padding: "56px 0 52px 64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img src={logo} width={74} height={71} alt="" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 2 }}>HOWARD GARDNER</span>
              <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 5, color: GOLD }}>BILINGUAL SCHOOL</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, maxWidth: 620, color: GOLD, fontSize: 19, fontWeight: 700, letterSpacing: 3.5, textTransform: "uppercase" }}>
              <div style={{ width: 36, height: 2, background: GOLD, opacity: 0.7 }} />
              {eyebrow}
            </div>
            {/* Palabra por palabra: Satori no mezcla bien colores dentro de una línea */}
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 20, fontFamily: "Fraunces", fontSize: long ? 58 : 70, lineHeight: 1.06, letterSpacing: -1, paddingRight: 24 }}>
              {words(title).map((w, i) => (
                <span key={i} style={{ color: w.gold ? GOLD : "white", marginRight: w.glue ? 0 : "0.24em" }}>{w.text}</span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingRight: 24 }}>
            {t.og.badges.map((b, i) => (
              <div key={b} style={{ display: "flex", alignItems: "center", height: 36, padding: "0 14px", borderRadius: 999, fontSize: 15, fontWeight: 700,
                ...(i === 0 ? { background: GOLD, color: INK } : { border: "1.5px solid rgba(255,255,255,0.35)", color: "white" }) }}>
                {b}
              </div>
            ))}
          </div>
        </div>

        {/* Foto a sangre, fundida con el azul */}
        <div style={{ position: "absolute", right: 0, top: 0, width: 480, height: 630, display: "flex" }}>
          <img src={photo} width={480} height={630} alt="" />
          <div style={{ position: "absolute", left: 0, top: 0, width: 160, height: 630, background: `linear-gradient(90deg, ${INK}, rgba(12,22,49,0))` }} />
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 500, style: "normal" },
        { name: "Manrope", data: manrope500, weight: 500, style: "normal" },
        { name: "Manrope", data: manrope700, weight: 700, style: "normal" },
      ],
    },
  );
  // JPEG: pesa ~6 veces menos que el PNG, para que WhatsApp y Facebook muestren la vista previa
  const { default: sharp } = await import("sharp");
  const jpg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { "Content-Type": "image/jpeg" } });
}
