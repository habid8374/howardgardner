import { get } from "@vercel/blob";
import { audit, canAccess, sql } from "@/lib/server/db";
import { clientIp, fail, json, requireStaff } from "@/lib/server/http";

/* Descargar un documento de una preinscripción (documento de identidad o boletín).
   Archivo en almacenamiento privado: solo con permiso de ver preinscripciones, de la sede del usuario,
   y queda registrado quién lo descargó. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string; kind: string }> }) {
  const user = await requireStaff(req, { need: { area: "admisiones", level: "ver" } });
  if (user instanceof Response) return user;
  try {
    const { id, kind } = await params;
    if (kind !== "documento" && kind !== "boletin") return json({ error: "notfound" }, 404);
    const rows = (await sql`SELECT campus, files FROM admissions WHERE id = ${id}`) as { campus: string; files: { kind: string; name: string; path: string }[] }[];
    const row = rows[0];
    const f = row?.files?.find((x) => x.kind === kind);
    if (!row || !f || !canAccess(user, row.campus)) return json({ error: "notfound" }, 404);
    const file = await get(f.path, { access: "private" });
    if (!file || file.statusCode !== 200 || !file.stream) return json({ error: "notfound" }, 404);
    await audit(user.username, `admision_adjunto:${kind}`, id, clientIp(req));
    return new Response(file.stream, {
      headers: {
        "Content-Type": file.blob.contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(f.name || kind)}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    return fail(err, "admision_adjunto");
  }
}
