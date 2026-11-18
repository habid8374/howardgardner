/* Reportes en Excel (.xlsx) con la imagen del colegio: logo, encabezado azul, tabla con filtros,
   colores por prioridad o alerta, pie con los datos del colegio y aviso de confidencialidad.
   ExcelJS se carga solo al hacer clic (no pesa en el resto del panel).
   Los textos se guardan como texto, nunca como fórmulas: no hay inyección de fórmulas (OWASP). */
import { ADDRESS_LINE, LEGAL_NAME, NIT, PHONE_DISPLAY, SITE_URL } from "@/lib/site";

export type XlsxColumn = { header: string; width: number; wrap?: boolean; date?: "date" | "datetime"; center?: boolean };
export type CellTone = "danger" | "warning" | "soft" | "ok" | "strong";
export type XlsxReport = {
  filename: string;
  sheet: string;
  title: string;            // "Reporte de PQRSF"
  meta: string;             // "Generado el … · por … · 6 registros"
  summary?: string;         // línea de resumen (opcional)
  columns: XlsxColumn[];
  rows: (string | number | Date | null)[][];
  tone?: (row: number, col: number) => CellTone | undefined;
  footer: { confidential: string; confidentialShort: string; generated: string; page: string; of: string };
};

const INK = "FF0C1631";
const NAVY = "FF12245A";
const GOLD = "FFE3B23C";
const PAPER = "FFF7F4EC";
const LINE = "FFDDD5C3";
const MUTED = "FF5A6278";
const TONES: Record<CellTone, { fill?: string; font: string; bold?: boolean }> = {
  danger: { fill: "FFFDE2E1", font: "FFB42318", bold: true },
  warning: { fill: "FFFFF1D6", font: "FF93370D", bold: true },
  soft: { fill: "FFEEF2FB", font: NAVY },
  ok: { fill: "FFE3F4EA", font: "FF0F6B3A" },
  strong: { font: INK, bold: true },
};

async function logoBase64() {
  const res = await fetch("/logo-excel.png");
  const bytes = new Uint8Array(await res.arrayBuffer());
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

export async function downloadXlsx(r: XlsxReport) {
  const { default: ExcelJS } = await import("exceljs");
  const wb = new ExcelJS.Workbook();
  wb.creator = "Howard Gardner Bilingual School";
  wb.created = new Date();
  const ws = wb.addWorksheet(r.sheet, {
    properties: { tabColor: { argb: GOLD } },
    views: [{ state: "frozen", ySplit: 6, showGridLines: false }],
    pageSetup: {
      orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0,
      margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.6, header: 0.2, footer: 0.25 },
      printTitlesRow: "6:6",
    },
    headerFooter: {
      oddFooter: `&L&8${LEGAL_NAME} · ${r.footer.confidentialShort}&C&8${r.footer.page} &P ${r.footer.of} &N&R&8&D`,
    },
  });

  const n = r.columns.length;
  ws.columns = r.columns.map((c) => ({ width: c.width }));
  const last = ws.getColumn(n).letter;
  const band = (row: number, height: number, argb: string) => {
    ws.getRow(row).height = height;
    for (let c = 1; c <= n; c++) ws.getCell(row, c).fill = { type: "pattern", pattern: "solid", fgColor: { argb } };
  };

  // ── Encabezado institucional (filas 1 a 4) ──
  band(1, 30, INK); band(2, 22, INK); band(3, 20, INK); band(4, 4, GOLD); ws.getRow(5).height = 10;
  ws.mergeCells(`B1:${last}1`);
  ws.mergeCells(`B2:${last}2`);
  ws.mergeCells(`B3:${last}3`);
  Object.assign(ws.getCell("B1"), {
    value: "HOWARD GARDNER BILINGUAL SCHOOL",
    font: { name: "Calibri", size: 16, bold: true, color: { argb: "FFFFFFFF" } },
    alignment: { vertical: "bottom", indent: 1 },
  });
  Object.assign(ws.getCell("B2"), {
    value: r.title,
    font: { name: "Calibri", size: 12, bold: true, color: { argb: GOLD } },
    alignment: { vertical: "middle", indent: 1 },
  });
  Object.assign(ws.getCell("B3"), {
    value: r.summary ? `${r.meta}   ·   ${r.summary}` : r.meta,
    font: { name: "Calibri", size: 9, color: { argb: "FFD5DAE6" } },
    alignment: { vertical: "top", indent: 1 },
  });
  try {
    const img = wb.addImage({ base64: await logoBase64(), extension: "png" });
    ws.addImage(img, { tl: { col: 0.25, row: 0.15 }, ext: { width: 66, height: 63 }, editAs: "oneCell" });
  } catch {}

  // ── Tabla (encabezado en la fila 6) ──
  const head = ws.getRow(6);
  head.height = 30;
  r.columns.forEach((c, i) => {
    const cell = head.getCell(i + 1);
    cell.value = c.header;
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
    cell.alignment = { vertical: "middle", horizontal: c.center ? "center" : "left", wrapText: true, indent: c.center ? 0 : 1 };
    cell.border = { bottom: { style: "medium", color: { argb: GOLD } } };
  });

  const thin = { style: "thin" as const, color: { argb: LINE } };
  r.rows.forEach((values, ri) => {
    const row = ws.getRow(7 + ri);
    values.forEach((v, ci) => {
      const col = r.columns[ci];
      const cell = row.getCell(ci + 1);
      cell.value = v === null || v === "" ? null : v;
      if (col.date && v instanceof Date) cell.numFmt = col.date === "date" ? "dd/mm/yyyy" : "dd/mm/yyyy hh:mm";
      cell.font = { name: "Calibri", size: 10, color: { argb: INK } };
      cell.alignment = { vertical: "top", wrapText: !!col.wrap, horizontal: col.center ? "center" : "left", indent: col.center ? 0 : 1 };
      cell.border = { bottom: thin, left: thin, right: thin };
      if (ri % 2 === 1) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: PAPER } };
      const t = r.tone?.(ri, ci);
      if (t) {
        const s = TONES[t];
        cell.font = { name: "Calibri", size: 10, bold: !!s.bold, color: { argb: s.font } };
        if (s.fill) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: s.fill } };
      }
    });
  });
  if (r.rows.length) ws.autoFilter = { from: { row: 6, column: 1 }, to: { row: 6 + r.rows.length, column: n } };

  // ── Pie del documento ──
  let f = 7 + r.rows.length + 1;
  band(f, 3, GOLD);
  f += 1;
  const foot = (text: string, opts: { bold?: boolean; italic?: boolean; color?: string; size?: number } = {}) => {
    ws.mergeCells(`A${f}:${last}${f}`);
    Object.assign(ws.getCell(`A${f}`), {
      value: text,
      font: { name: "Calibri", size: opts.size ?? 9, bold: opts.bold, italic: opts.italic, color: { argb: opts.color ?? MUTED } },
      alignment: { vertical: "middle", wrapText: true, indent: 1 },
    });
    ws.getRow(f).height = 16;
    f++;
  };
  foot(`${LEGAL_NAME} · NIT ${NIT}`, { bold: true, color: INK, size: 10 });
  foot(`${ADDRESS_LINE} · ${PHONE_DISPLAY} · ${SITE_URL.replace("https://", "")}`);
  foot(r.footer.confidential, { italic: true });
  foot(r.footer.generated, { italic: true });

  const buf = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: r.filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
