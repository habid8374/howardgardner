import Link from "next/link";

/* Página 404 bilingüe (se muestra dentro del layout del idioma). */
export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center bg-paper pt-[76px]">
      <div className="wrap py-20">
        <p className="eyebrow text-navy">404</p>
        <h1 className="h-section mt-5 text-ink">No encontramos esta página.</h1>
        <p className="lead mt-4 text-muted" lang="en">We couldn&apos;t find this page.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/es" className="btn btn-primary">Volver al inicio</Link>
          <Link href="/en" className="btn btn-ghost on-light text-ink">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
