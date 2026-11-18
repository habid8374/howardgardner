import { Phone } from "lucide-react";
import { WhatsAppIcon } from "./BrandIcons";
import { TEL_HREF, waLink } from "@/lib/site";
import type { Dict } from "@/lib/dictionaries";

/* Celular: barra de acción fija (WhatsApp + Llamar).
   Escritorio: botón flotante de WhatsApp. */
export default function WhatsAppFloat({ t }: { t: Dict }) {
  const wa = waLink(t.wa.admissions);
  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_auto] gap-2 border-t border-ink/10 bg-paper/95 px-4 pt-3 backdrop-blur md:hidden"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <a href={wa} target="_blank" rel="noopener noreferrer" className="btn !min-h-12 bg-[#108043] text-white">
          <WhatsAppIcon size={20} /> {t.common.whatsapp}
        </a>
        <a href={TEL_HREF} className="btn btn-ghost on-light !min-h-12 !px-4 text-ink">
          <Phone size={20} aria-hidden /> {t.common.call}
        </a>
      </div>

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.common.whatsapp}
        className="btn fixed bottom-6 right-6 z-40 hidden !h-14 !w-14 !min-h-14 !p-0 bg-[#108043] text-white shadow-[0_12px_30px_-10px_rgba(16,128,67,0.6)] md:inline-flex"
      >
        <WhatsAppIcon size={28} />
      </a>
    </>
  );
}
