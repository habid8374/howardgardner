// Recorre las páginas del sitio (español e inglés) y verifica que no haya enlaces rotos:
// rutas internas que respondan 200 y anclas (#seccion) que existan en su página.
// Uso: npm run build && npm start (en otra terminal) && npm run test:links
// Opcional: BASE_URL=https://howardgardner.vercel.app npm run test:links
const BASE = process.env.BASE_URL || "http://localhost:3000";

const pages = [
  "/es", "/es/nosotros", "/es/aprendizaje", "/es/reconocimientos", "/es/admisiones", "/es/contacto", "/es/politica-de-datos",
  "/en", "/en/about", "/en/learning", "/en/achievements", "/en/admissions", "/en/contact", "/en/privacy-policy",
];
const files = ["/robots.txt", "/sitemap.xml", "/llms.txt"];
let failures = 0;
const fail = (msg) => { console.error(`✗ ${msg}`); failures++; };

// La raíz debe redirigir a un idioma
const root = await fetch(BASE + "/", { redirect: "manual" });
if (![307, 308].includes(root.status)) fail(`/ debería redirigir a /es o /en (respondió ${root.status})`);
else console.log(`✓ / → ${root.headers.get("location")}`);

const html = {};
for (const p of [...pages, ...files]) {
  const res = await fetch(BASE + p);
  if (!res.ok) { fail(`${p} → ${res.status}`); continue; }
  console.log(`✓ ${p}`);
  if (pages.includes(p)) html[p] = await res.text();
}

const idsOf = (body) => new Set([...body.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const checked = new Map();

for (const [page, body] of Object.entries(html)) {
  const hrefs = new Set([...body.matchAll(/<a[^>]+href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&")));
  for (const link of hrefs) {
    if (link === "#" || link === "") { fail(`${page}: enlace vacío`); continue; }
    if (!link.startsWith("/") && !link.startsWith("#")) continue; // externos
    const [path, hash] = link.split("#");
    const target = path || page;
    if (!html[target]) {
      if (!checked.has(target)) checked.set(target, (await fetch(BASE + target)).status);
      if (checked.get(target) !== 200) fail(`${page}: ${link} → ${checked.get(target)}`);
      continue;
    }
    if (hash && !idsOf(html[target]).has(hash)) fail(`${page}: ancla sin destino ${link}`);
  }
}

if (failures) { console.error(`\n${failures} problema(s) encontrado(s).`); process.exit(1); }
console.log("\nSin enlaces rotos.");
