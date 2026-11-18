import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "./BrandIcons";
import { waLink } from "@/lib/site";
import { href, type Lang } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";

/* Llamado a la acción de admisiones para el inicio. */
export default function AdmissionsBand({ lang, t }: { lang: Lang; t: Dict }) {
  const a = t.admissionsBand;
  return (
    <section className="doodle-bg section bg-ink text-white">
      <div className="wrap grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="eyebrow text-gold">{a.eyebrow}</p>
          <h2 className="h-section mt-5 max-w-2xl">{a.title}</h2>
          <p className="lead mt-6 max-w-xl text-white/75">{a.lead}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Link href={href(lang, "admissions")} className="btn btn-primary">
            {a.button} <ArrowRight size={18} aria-hidden />
          </Link>
          <a href={waLink(t.wa.admissions)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <WhatsAppIcon size={18} /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
