import Link from "next/link";
import { MapPin, Phone, Clock, Navigation, Sparkles, MessageCircle, GraduationCap } from "lucide-react";
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from "./BrandIcons";
import MapEmbed from "./MapEmbed";
import { SOCIAL, campusMaps, telHref, waLink, waLinkTo } from "@/lib/site";
import { href, type Lang } from "@/lib/i18n";
import { campusName, type PublicCampus } from "@/lib/records";
import type { Dict } from "@/lib/dictionaries";

/* "Nuestras sedes": las sedes vienen de la base de datos y se editan desde el panel del colegio.
   Las sedes abiertas muestran sus datos; las que están "próximamente" invitan a preinscribirse. */
export default function Visit({ t, lang, campuses }: { t: Dict; lang: Lang; campuses: PublicCampus[] }) {
  const v = t.visit;
  const c = t.campuses;
  const open = campuses.filter((s) => s.status === "open");
  const soon = campuses.filter((s) => s.status === "soon");
  const main = open[0] ?? campuses[0];
  const mainMaps = main ? campusMaps(main) : { url: null, embed: null };

  return (
    <section id="visitanos" className="section bg-paper-2">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <p className="eyebrow text-navy">{v.eyebrow}</p>
          <h2 className="h-section mt-5 text-ink">{v.title}</h2>

          {open.map((s) => {
            const maps = campusMaps(s);
            const hours = (lang === "en" && s.hoursEn) || s.hoursEs || v.hours;
            const rows = [
              { Icon: MapPin, label: v.address, value: [s.address, s.city].filter(Boolean).join(", ") || c.noAddress, href: maps.url, external: true },
              s.phone && { Icon: Phone, label: v.phone, value: s.phone, href: telHref(s.phone) },
              s.whatsapp && { Icon: WhatsAppIcon, label: v.whatsapp, value: s.whatsapp, href: waLinkTo(s.whatsapp, t.wa.visit), external: true },
              { Icon: Clock, label: v.hoursLabel, value: hours },
              s.grades && { Icon: GraduationCap, label: c.grades, value: s.grades },
            ].filter(Boolean) as { Icon: typeof MapPin; label: string; value: string; href?: string | null; external?: boolean }[];
            return (
              <div key={s.id}>
                <h3 className="mt-10 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-navy">
                  <span className="h-2 w-2 rounded-full bg-[#108043]" aria-hidden /> {campusName(s, lang)}
                </h3>
                <ul className="mt-4 border-t border-ink/15">
                  {rows.map(({ Icon, label, value, href: link, external }) => {
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
                        {link ? (
                          <a href={link} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex min-h-16 items-center gap-4 py-4 transition-opacity hover:opacity-80">
                            {inner}
                          </a>
                        ) : (
                          <div className="flex min-h-16 items-center gap-4 py-4">{inner}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {/* Sedes próximas */}
          {soon.map((s) => {
            const name = campusName(s, lang);
            const note = (lang === "en" && s.noteEn) || s.noteEs;
            const where = [s.address, s.city].filter(Boolean).join(", ") || c.noAddress;
            return (
              <div key={s.id} className="doodle-bg relative mt-10 overflow-hidden rounded-[24px] bg-ink p-6 text-white sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-ink">
                  <Sparkles size={14} aria-hidden /> {c.soonTag}
                </span>
                <h3 className="h-display mt-4 text-[1.8rem] leading-tight">{c.soonTitle(name)}</h3>
                {note && <p className="mt-3 text-white/75">{note}</p>}
                <p className="mt-4 flex items-center gap-2 text-sm text-white/60"><MapPin size={16} aria-hidden /> {where}</p>
                {s.grades && <p className="mt-1 flex items-center gap-2 text-sm text-white/60"><GraduationCap size={16} aria-hidden /> {s.grades}</p>}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href={`${href(lang, "admissions")}?sede=${encodeURIComponent(s.id)}#preinscripcion`} className="btn btn-primary !min-h-12 !text-sm">{c.soonCta}</Link>
                  <a href={s.whatsapp ? waLinkTo(s.whatsapp, c.soonWa(name)) : waLink(c.soonWa(name))} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-12 !text-sm">
                    <MessageCircle size={16} aria-hidden /> {c.soonWaCta}
                  </a>
                </div>
              </div>
            );
          })}

          <div className="mt-8 flex gap-3">
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label={v.instagram} className="lift flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink">
              <InstagramIcon size={20} />
            </a>
            <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label={v.facebook} className="lift flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink">
              <FacebookIcon size={20} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          <div className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-ink/10 bg-paper lg:h-[480px]">
            {mainMaps.embed && <MapEmbed src={mainMaps.embed} title={v.mapTitle} blocked={t.cookies.mapBlocked} loadLabel={t.cookies.loadMap} />}
          </div>
          {mainMaps.url && (
            <a href={mainMaps.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full sm:w-fit">
              <Navigation size={18} aria-hidden /> {v.directions}{open.length > 1 && main ? ` · ${campusName(main, lang)}` : ""}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
