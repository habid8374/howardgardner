import { get } from "@vercel/blob";
import { audit, getPqrsfRow } from "@/lib/server/db";
import { clientIp, fail, json, requireStaff } from "@/lib/server/http";

/* Descargar el adjunto de una PQRSF. El archivo está en almacenamiento privado:
   solo sale por aquí, con sesión del panel, y queda registrado quién lo descargó. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireStaff(req);
  if (user instanceof Response) return user;
  try {
    const { id } = await params;
    const row = await getPqrsfRow(id);
    if (!row?.attachment_path) return json({ error: "notfound" }, 404);
    const file = await get(row.attachment_path, { access: "private" });
    if (!file || file.statusCode !== 200 || !file.stream) return json({ error: "notfound" }, 404);
    await audit(user.username, "pqrsf_adjunto", id, clientIp(req));
    const name = encodeURIComponent(row.attachment || "adjunto");
    return new Response(file.stream, {
      headers: {
        "Content-Type": file.blob.contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename*=UTF-8''${name}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    return fail(err, "adjunto");
  }
}
