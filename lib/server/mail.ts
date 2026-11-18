import "server-only";
import { Resend } from "resend";
import { SITE_URL } from "@/lib/site";
import type { Admission, CampusId, Pqrsf } from "@/lib/records";

/* Correos con Resend. Si falta la clave, no se envía nada y el resto sigue funcionando.
   Mientras el colegio no tenga dominio propio verificado, Resend solo entrega correos
   a la dirección dueña de la cuenta (ver PENDIENTES.md). */
const key = process.env.RESEND_API_KEY;
const resend = key ? new Resend(key) : null;
const FROM = process.env.MAIL_FROM || "Howard Gardner Bilingual School <onboarding@resend.dev>";
const SCHOOL = process.env.SCHOOL_NOTIFY_EMAIL || "";
/* Cada sede puede tener su propio responsable; si no está definido, el aviso va al correo general. */
const notifyTo = (campus: CampusId) => (campus === "sede2" && process.env.SCHOOL_NOTIFY_EMAIL_SEDE2) || SCHOOL;
const CAMPUS_ES: Record<CampusId, string> = { principal: "Sede principal", sede2: "Nueva sede" };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f7f4ec;font-family:Arial,Helvetica,sans-serif;color:#0c1631">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
  <tr><td style="background:#0c1631;padding:20px 28px;color:#fff;font-weight:bold;letter-spacing:1px">HOWARD GARDNER <span style="color:#e3b23c;font-size:12px;letter-spacing:3px">BILINGUAL SCHOOL</span></td></tr>
  <tr><td style="padding:28px"><h1 style="font-size:20px;margin:0 0 16px">${esc(title)}</h1>${body}</td></tr>
  <tr><td style="padding:16px 28px;background:#efeadd;font-size:12px;color:#5a6278">Sabanalarga, Atlántico · <a href="${SITE_URL}" style="color:#12245a">${SITE_URL.replace("https://", "")}</a></td></tr>
  </table></td></tr></table></body></html>`;
}

const row = (k: string, v: string) => `<tr><td style="padding:4px 12px 4px 0;color:#5a6278;font-size:13px">${esc(k)}</td><td style="padding:4px 0;font-size:14px"><b>${esc(v)}</b></td></tr>`;

async function send(to: string, subject: string, html: string) {
  if (!resend || !to) return;
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) console.error("[mail]", error.name, error.message);
  } catch (err) {
    console.error("[mail]", err);
  }
}

export async function mailNewAdmission(a: Admission) {
  await send(notifyTo(a.campus), `Nueva preinscripción ${a.id} · ${a.grade} · ${CAMPUS_ES[a.campus]}`, layout("Nueva preinscripción 2027", `
    <table role="presentation">${row("Radicado", a.id)}${row("Sede", CAMPUS_ES[a.campus])}${row("Acudiente", a.guardian)}${row("Teléfono", a.phone)}${row("Grado", a.grade)}</table>
    ${a.message ? `<p style="margin-top:16px;font-size:14px">${esc(a.message)}</p>` : ""}
    <p style="margin-top:20px"><a href="${SITE_URL}/admin" style="background:#e3b23c;color:#0c1631;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Abrir el panel</a></p>`));
}

const TYPE_ES: Record<string, string> = { peticion: "Petición", queja: "Queja", reclamo: "Reclamo", sugerencia: "Sugerencia", felicitacion: "Felicitación" };
const TYPE_EN: Record<string, string> = { peticion: "Request", queja: "Complaint", reclamo: "Claim", sugerencia: "Suggestion", felicitacion: "Compliment" };

export async function mailNewPqrsf(p: Pqrsf, due: Date) {
  const en = p.lang === "en";
  const fmt = (d: Date) => d.toLocaleDateString(en ? "en-US" : "es-CO", { day: "numeric", month: "long", year: "numeric" });
  const lookup = `${SITE_URL}/${en ? "en/requests" : "es/pqrsf"}#consultar`;
  await Promise.all([
    send(notifyTo(p.campus), `${p.urgent ? "URGENTE · " : ""}Nueva PQRSF ${p.id} · ${TYPE_ES[p.type]} · ${CAMPUS_ES[p.campus]}`, layout(`Nueva ${TYPE_ES[p.type].toLowerCase()} radicada`, `
      <table role="presentation">${row("Radicado", p.id)}${row("Sede", CAMPUS_ES[p.campus])}${row("Prioridad", p.priority)}${row("Vence", fmt(due))}${row("Acudiente", p.name)}${row("Correo", p.email)}${row("Asunto", p.subject)}</table>
      <p style="margin-top:20px"><a href="${SITE_URL}/admin" style="background:#e3b23c;color:#0c1631;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Abrir el panel</a></p>`)),
    send(p.email, en ? `We received your ${TYPE_EN[p.type].toLowerCase()} · ${p.id}` : `Recibimos tu ${TYPE_ES[p.type].toLowerCase()} · ${p.id}`, layout(
      en ? "We received your message" : "Recibimos tu solicitud", `
      <p style="font-size:14px;line-height:1.6">${en ? `Hello ${esc(p.name)}, thank you for writing to us. Keep this tracking number:` : `Hola ${esc(p.name)}, gracias por escribirnos. Guarda este número de radicado:`}</p>
      <p style="font-size:24px;font-weight:bold;letter-spacing:1px;margin:8px 0 16px">${esc(p.id)}</p>
      <table role="presentation">${row(en ? "Subject" : "Asunto", p.subject)}${row(en ? "Reply by" : "Respuesta a más tardar", fmt(due))}</table>
      <p style="margin-top:20px"><a href="${lookup}" style="color:#12245a;font-weight:bold">${en ? "Check the status of your request" : "Consultar el estado de tu solicitud"}</a></p>`)),
  ]);
}

export async function mailAnswer(p: Pqrsf) {
  const en = p.lang === "en";
  const lookup = `${SITE_URL}/${en ? "en/requests" : "es/pqrsf"}#consultar`;
  await send(p.email, en ? `Answer to your request ${p.id}` : `Respuesta a tu solicitud ${p.id}`, layout(
    en ? "We answered your request" : "Respondimos tu solicitud", `
    <p style="font-size:14px;line-height:1.6">${en ? `Hello ${esc(p.name)}, this is our answer to <b>${esc(p.subject)}</b>:` : `Hola ${esc(p.name)}, esta es nuestra respuesta sobre <b>${esc(p.subject)}</b>:`}</p>
    <div style="border-left:4px solid #e3b23c;background:#f7f4ec;padding:14px 16px;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(p.answer)}</div>
    <p style="margin-top:20px;font-size:13px"><a href="${lookup}" style="color:#12245a;font-weight:bold">${en ? "Download the answer as PDF" : "Descargar la respuesta en PDF"}</a> · ${esc(p.id)}</p>`));
}
