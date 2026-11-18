"use client";

import { useEffect } from "react";
import Link from "next/link";

/* Error inesperado (OWASP A10: manejo de condiciones excepcionales).
   Mensaje genérico y bilingüe: nunca se muestran detalles internos al visitante.
   En producción el error se registra en el servidor con su identificador. */
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;
    console.error("Error en la página", digest ?? "");
  }, [error]);

  return (
    <section className="flex min-h-[70svh] items-center bg-paper pt-[76px]">
      <div className="wrap py-20">
        <p className="eyebrow text-navy">Error</p>
        <h1 className="h-section mt-5 text-ink">Algo salió mal. Inténtalo de nuevo.</h1>
        <p className="lead mt-4 text-muted" lang="en">Something went wrong. Please try again.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => retry()} className="btn btn-primary">Reintentar · Try again</button>
          <Link href="/es" className="btn btn-ghost on-light text-ink">Ir al inicio · Home</Link>
        </div>
      </div>
    </section>
  );
}
