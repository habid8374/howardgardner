import Link from "next/link";
import { href, type Lang } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";
import CookiePrefsButton from "./CookiePrefsButton";

export default function CookiePolicy({ lang, t }: { lang: Lang; t: Dict }) {
  const c = t.cookies.page;
  return (
    <div className="bg-paper pt-[76px]">
      <article className="wrap max-w-4xl py-16 text-[1.02rem] leading-relaxed text-ink">
        <p className="eyebrow text-navy">{c.eyebrow}</p>
        <h1 className="h-section mt-5">{c.title}</h1>
        <p className="lead mt-6 text-muted">{c.intro}</p>

        <div className="mt-10 overflow-x-auto rounded-2xl ring-1 ring-line">
          <table className="w-full min-w-[640px] border-collapse bg-white text-left text-[0.95rem]">
            <thead className="bg-ink text-white">
              <tr>
                {[c.colName, c.colType, c.colPurpose, c.colDuration].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r[0]} className="border-t border-line align-top">
                  <th scope="row" className="px-4 py-3 font-semibold">{r[0]}</th>
                  <td className="px-4 py-3">{r[1]}</td>
                  <td className="px-4 py-3 text-muted">{r[2]}</td>
                  <td className="px-4 py-3">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 text-2xl font-bold">{c.manageTitle}</h2>
        <p className="mt-4">{c.manage}</p>
        <CookiePrefsButton label={t.footer.cookiePrefs} className="btn btn-primary mt-6" />
        <p className="mt-10 text-muted">
          {c.contact}{" "}
          <Link href={href(lang, "privacy")} className="font-semibold text-navy underline underline-offset-2">{t.footer.privacy}</Link>
        </p>
      </article>
    </div>
  );
}
