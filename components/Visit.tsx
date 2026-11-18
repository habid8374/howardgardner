import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from "./BrandIcons";
import MapEmbed from "./MapEmbed";
import { ADDRESS_LINE, PHONE_DISPLAY, TEL_HREF, MAPS_URL, MAPS_EMBED, SOCIAL, waLink } from "@/lib/site";
import type { Dict } from "@/lib/dictionaries";

export default function Visit({ t }: { t: Dict }) {
  const v = t.visit;
  const rows = [
    { Icon: MapPin, label: v.address, value: ADDRESS_LINE, href: MAPS_URL, external: true },
    { Icon: Phone, label: v.phone, value: PHONE_DISPLAY, href: TEL_HREF },
    { Icon: WhatsAppIcon, label: v.whatsapp, value: PHONE_DISPLAY, href: waLink(t.wa.visit), external: true },
    { Icon: Clock, label: v.hoursLabel, value: v.hours },
  ];

  return (
    <section id="visitanos" className="section bg-paper-2">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <p className="eyebrow text-navy">{v.eyebrow}</p>
          <h2 className="h-section mt-5 text-ink">{v.title}</h2>

          <ul className="mt-10 border-t border-ink/15">
            {rows.map(({ Icon, label, value, href, external }) => {
              const inner = (
                <>
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-ink text-gold">
                    <Icon size={18} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.14em] text-muted">{label}</span>
                    <span className="mt-0.5 block text-[1.05rem] font-semibold text-ink">{value}</span>
                  </span>
                </>
              );
              return (
                <li key={label} className="border-b border-ink/15">
                  {href ? (
                    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex min-h-16 items-center gap-4 py-4 transition-opacity hover:opacity-80">
                      {inner}
                    </a>
                  ) : (
                    <div className="flex min-h-16 items-center gap-4 py-4">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex gap-3">
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label={v.instagram} className="lift flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink">
              <InstagramIcon size={20} />
            </a>
            <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label={v.facebook} className="lift flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink">
              <FacebookIcon size={20} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-[28px] border border-ink/10 bg-paper lg:min-h-[480px]">
            <MapEmbed src={MAPS_EMBED} title={v.mapTitle} blocked={t.cookies.mapBlocked} loadLabel={t.cookies.loadMap} />
          </div>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full sm:w-fit">
            <Navigation size={18} aria-hidden /> {v.directions}
          </a>
        </div>
      </div>
    </section>
  );
}
