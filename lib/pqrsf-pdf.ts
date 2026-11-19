/* PDF de la respuesta a una PQRSF, en español o inglés.
   Se genera en el navegador (jsPDF se carga solo al hacer clic). */
import { ADDRESS_LINE, LEGAL_NAME, NIT, PHONE_DISPLAY, SITE_NAME, SITE_URL } from "@/lib/site";
import { formatDate, pqrsfDue, type Pqrsf } from "@/lib/records";
import { adminDict } from "@/lib/dictionaries/admin";

type Lang = "es" | "en";

const T = {
  es: {
    title: "Respuesta a su PQRSF",
    intro: "A continuación encontrará la respuesta del colegio a la solicitud radicada en nuestro sitio web.",
    id: "Radicado",
    created: "Fecha de radicación",
    type: "Tipo",
    priority: "Prioridad",
    status: "Estado",
    answered: "Fecha de respuesta",
    due: "Fecha límite",
    name: "Acudiente",
    student: "Estudiante",
    subject: "Asunto",
    request: "Su solicitud",
    answer: "Respuesta del colegio",
    closing: "Atentamente,",
    generated: "Documento generado el",
    page: "Página",
    of: "de",
    file: "respuesta",
  },
  en: {
    title: "Response to your request (PQRSF)",
    intro: "Below is the school's response to the request you submitted on our website.",
    id: "Reference",
    created: "Submitted on",
    type: "Type",
    priority: "Priority",
    status: "Status",
    answered: "Answered on",
    due: "Due date",
    name: "Parent/guardian",
    student: "Student",
    subject: "Subject",
    request: "Your request",
    answer: "School's response",
    closing: "Sincerely,",
    generated: "Document generated on",
    page: "Page",
    of: "of",
    file: "response",
  },
};

const NAVY: [number, number, number] = [18, 36, 90];
const GOLD: [number, number, number] = [227, 178, 60];
const MUTED: [number, number, number] = [90, 98, 120];
const INK: [number, number, number] = [12, 22, 49];

async function loadLogo(): Promise<string | null> {
  try {
    const res = await fetch("/logo-pdf.jpg");
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function downloadPqrsfPdf(p: Pqrsf, lang: Lang) {
  const [{ jsPDF }, logo] = await Promise.all([import("jspdf"), loadLogo()]);
  const t = T[lang];
  const labels = adminDict[lang].pqrsf;
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 20;
  const CW = W - M * 2;
  let y = M;

  const ensure = (needed: number) => {
    if (y + needed > H - 22) {
      doc.addPage();
      y = M;
    }
  };

  /* ── Membrete ── */
  if (logo) doc.addImage(logo, "JPEG", M, y, 22, 21);
  const hx = logo ? M + 27 : M;
  doc.setFont("helvetica", "bold").setFontSize(15).setTextColor(...NAVY);
  doc.text(SITE_NAME, hx, y + 7);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...MUTED);
  doc.text(`${LEGAL_NAME} · NIT ${NIT}`, hx, y + 12.5);
  doc.text(`${ADDRESS_LINE}, Colombia · Tel. ${PHONE_DISPLAY}`, hx, y + 17);
  doc.text(SITE_URL.replace("https://", ""), hx, y + 21.5);
  y += 28;
  doc.setDrawColor(...GOLD).setLineWidth(0.8).line(M, y, W - M, y);
  y += 11;

  /* ── Título ── */
  doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(...INK);
  doc.text(t.title, M, y);
  y += 7;
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...MUTED);
  const intro = doc.splitTextToSize(t.intro, CW);
  doc.text(intro, M, y);
  y += intro.length * 4.6 + 5;

  /* ── Datos de la solicitud (dos columnas) ── */
  const fields: [string, string][] = [
    [t.id, p.id],
    [t.created, formatDate(p.createdAt, lang, true)],
    [t.type, labels.types[p.type]],
    [t.priority, labels.priorities[p.priority]],
    [t.status, labels.statuses[p.status]],
    [p.answer ? t.answered : t.due, formatDate(p.answer ? p.answeredAt ?? p.createdAt : pqrsfDue(p).toISOString(), lang, !!p.answer)],
    [t.name, p.name],
    [t.student, p.student ? `${p.student}${p.grade ? ` · ${p.grade}` : ""}` : "—"],
  ];
  const colW = CW / 2;
  const boxTop = y;
  const rows = Math.ceil(fields.length / 2);
  const rowH = 12;
  doc.setFillColor(247, 244, 236).roundedRect(M, boxTop, CW, rows * rowH + 6, 3, 3, "F");
  fields.forEach(([k, v], i) => {
    const cx = M + 6 + (i % 2) * colW;
    const cy = boxTop + 8 + Math.floor(i / 2) * rowH;
    doc.setFont("helvetica", "bold").setFontSize(7.5).setTextColor(...MUTED);
    doc.text(k.toUpperCase(), cx, cy);
    doc.setFont("helvetica", "normal").setFontSize(10.5).setTextColor(...INK);
    doc.text(doc.splitTextToSize(v || "—", colW - 10)[0], cx, cy + 5);
  });
  y = boxTop + rows * rowH + 14;

  /* ── Bloques de texto ── */
  const block = (title: string, body: string, highlight = false) => {
    ensure(18);
    doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...NAVY);
    doc.text(title, M, y);
    y += 6;
    doc.setFont("helvetica", "normal").setFontSize(10.5).setTextColor(...INK);
    const lines: string[] = doc.splitTextToSize(body || "—", highlight ? CW - 10 : CW);
    const lh = 5;
    if (highlight) {
      // Caja con borde dorado a la izquierda; se parte entre páginas si es larga
      let i = 0;
      while (i < lines.length) {
        ensure(lh + 8);
        const fit = Math.max(1, Math.min(lines.length - i, Math.floor((H - 22 - y - 8) / lh)));
        const chunk = lines.slice(i, i + fit);
        const h = chunk.length * lh + 8;
        doc.setFillColor(255, 251, 238).rect(M, y, CW, h, "F");
        doc.setFillColor(...GOLD).rect(M, y, 1.4, h, "F");
        doc.text(chunk, M + 6, y + 6.5);
        y += h + 2;
        i += fit;
      }
      y += 4;
    } else {
      for (const line of lines) {
        ensure(lh);
        doc.text(line, M, y);
        y += lh;
      }
      y += 6;
    }
  };

  block(t.subject, p.subject);
  block(t.request, p.description);
  block(t.answer, p.answer, true);

  /* ── Cierre ── */
  ensure(20);
  y += 4;
  doc.setFont("helvetica", "normal").setFontSize(10.5).setTextColor(...INK);
  doc.text(t.closing, M, y);
  doc.setFont("helvetica", "bold");
  doc.text(SITE_NAME, M, y + 6);

  /* ── Pie en cada página ── */
  const pages = doc.getNumberOfPages();
  const generated = `${t.generated} ${formatDate(new Date().toISOString(), lang, true)}`;
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(221, 213, 195).setLineWidth(0.3).line(M, H - 16, W - M, H - 16);
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...MUTED);
    doc.text(generated, M, H - 11);
    doc.text(`${t.page} ${i} ${t.of} ${pages}`, W - M, H - 11, { align: "right" });
  }

  doc.save(`${t.file}-${p.id}.pdf`);
}
