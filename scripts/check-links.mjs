// Recorre las páginas internas y verifica que no haya enlaces rotos.
// Uso: npm run build && npm start (en otra terminal) && npm run test:links
// Opcional: BASE_URL=https://howardgardner.vercel.app npm run test:links
const BASE = process.env.BASE_URL || "http://localhost:3000";
const pages = ["/", "/politica-de-datos", "/robots.txt", "/sitemap.xml", "/llms.txt"];
let failures = 0;

const html = {};
for (const p of pages) {
  const res = await fetch(BASE + p);
  if (!res.ok) { console.error(`✗ ${p} → ${res.status}`); failures++; continue; }
  console.log(`✓ ${p}`);
  if (p === "/" || p === "/politica-de-datos") html[p] = await res.text();
}

const ids = new Set([...(html["/"] || "").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

for (const [page, body] of Object.entries(html)) {
  const hrefs = new Set([...body.matchAll(/<a[^>]+href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&")));
  for (const href of hrefs) {
    if (href === "#" || href === "") { console.error(`✗ ${page}: enlace vacío "${href}"`); failures++; continue; }
    if (href.startsWith("#") || href.startsWith("/#")) {
      const id = href.split("#")[1];
      if (!ids.has(id)) { console.error(`✗ ${page}: ancla sin destino ${href}`); failures++; }
      continue;
    }
    if (href.startsWith("/")) {
      const res = await fetch(BASE + href);
      if (!res.ok) { console.error(`✗ ${page}: ${href} → ${res.status}`); failures++; }
    }
  }
}

if (failures) { console.error(`\n${failures} problema(s) encontrado(s).`); process.exit(1); }
console.log("\nSin enlaces rotos.");
