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
  const photo = await dataUrl(`photo-${PHOTO[page]}.jpg`, "image/jpeg");
  return ogCard({
    eyebrow, title, badges: t.og.badges,
    side: (
      <div style={{ position: "absolute", right: 0, top: 0, width: 480, height: 630, display: "flex" }}>
        <img src={photo} width={480} height={630} alt="" />
        <div style={{ position: "absolute", left: 0, top: 0, width: 160, height: 630, background: `linear-gradient(90deg, ${INK}, rgba(12,22,49,0))` }} />
      </div>
    ),
  });
}

type Card = { eyebrow: string; title: [string, string, string]; badges: readonly string[]; side: React.ReactNode };

/** Tarjeta base: fondo de dibujos, escudo, título y etiquetas a la izquierda; a la derecha, lo que se pase en `side`. */
export async function ogCard({ eyebrow, title, badges, side }: Card) {
  const [fraunces, manrope500, manrope700, doodles, logo] = await Promise.all([
    file("fraunces-500.woff"), file("manrope-500.woff"), file("manrope-700.woff"),
    dataUrl("doodles.png", "image/png"), dataUrl("logo.png", "image/png"),
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
            {badges.map((b, i) => (
              <div key={b} style={{ display: "flex", alignItems: "center", height: 36, padding: "0 14px", borderRadius: 999, fontSize: 15, fontWeight: 700,
                ...(i === 0 ? { background: GOLD, color: INK } : { border: "1.5px solid rgba(255,255,255,0.35)", color: "white" }) }}>
                {b}
              </div>
            ))}
          </div>
        </div>

        {side}
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

/* ── Tarjeta del panel del colegio (/admin): a la derecha, una vista del panel con alertas ── */
const PILL: Record<string, { bg: string; fg: string }> = {
  red: { bg: "#fde2e1", fg: "#b42318" }, amber: { bg: "#fff1d6", fg: "#93370d" },
  green: { bg: "#e3f4ea", fg: "#0f6b3a" }, blue: { bg: "#eef2fb", fg: "#12245a" },
};

function Pill({ tone, children }: { tone: keyof typeof PILL; children: string }) {
  return <div style={{ display: "flex", padding: "3px 10px", borderRadius: 999, fontSize: 13, fontWeight: 700, background: PILL[tone].bg, color: PILL[tone].fg }}>{children}</div>;
}

export async function ogAdmin() {
  const kpis: [string, string, keyof typeof PILL][] = [["4", "Abiertas", "blue"], ["1", "Vencidas", "red"], ["1", "Vence hoy", "amber"], ["2", "Nuevas", "green"]];
  const rows: [string, string, string, keyof typeof PILL][] = [
    ["PQRSF-2026-0003", "Reclamo · Alta", "Vence hoy", "red"],
    ["PQRSF-2026-0001", "Queja · Alta", "Vencida", "red"],
    ["PQRSF-2026-0002", "Petición · Media", "Faltan 3 días", "amber"],
    ["HG-2027-0004", "Preinscripción · 6°", "Nueva", "blue"],
    ["PQRSF-2026-0005", "Felicitación", "Respondida", "green"],
  ];
  return ogCard({
    eyebrow: "Acceso exclusivo del personal",
    title: ["Panel del ", "colegio", "."],
    badges: ["Preinscripciones 2027", "PQRSF con plazos y alertas", "Reportes en Excel"],
    side: (
      <div style={{ position: "absolute", right: 44, top: 74, width: 440, display: "flex", flexDirection: "column", background: "#f7f4ec", borderRadius: 24, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.45)", color: INK }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: INK, padding: "16px 22px", borderBottom: `3px solid ${GOLD}` }}>
          <span style={{ color: "white", fontSize: 17, fontWeight: 700 }}>Panel del colegio</span>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: GOLD, fontSize: 12, fontWeight: 700 }}>PREINSCRIPCIONES</span>
            <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>PQRSF</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, padding: "18px 22px 6px" }}>
          {kpis.map(([n, l, tone]) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", flex: 1, background: "white", borderRadius: 14, padding: "10px 12px", border: "1px solid #ddd5c3" }}>
              <span style={{ fontFamily: "Fraunces", fontSize: 30, color: PILL[tone].fg, lineHeight: 1 }}>{n}</span>
              <span style={{ fontSize: 12, color: "#5a6278", marginTop: 4 }}>{l}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", margin: "12px 22px 22px", background: "white", borderRadius: 14, border: "1px solid #ddd5c3" }}>
          {rows.map(([id, what, alert, tone], i) => (
            <div key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderTop: i ? "1px solid #efeadd" : "none", borderLeft: `4px solid ${tone === "red" ? "#d92d20" : tone === "amber" ? GOLD : "transparent"}` }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{id}</span>
                <span style={{ fontSize: 12, color: "#5a6278" }}>{what}</span>
              </div>
              <Pill tone={tone}>{alert}</Pill>
            </div>
          ))}
        </div>
      </div>
    ),
  });
}
