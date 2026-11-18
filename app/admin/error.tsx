"use client";

import { useEffect } from "react";

/* Error inesperado en el panel (OWASP A10): mensaje genérico, sin detalles internos. */
export default function AdminError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;
    console.error("Error en el panel", digest ?? "");
  }, [error]);

  return (
    <main className="flex min-h-svh items-center justify-center bg-ink px-4">
      <div className="w-full max-w-md rounded-[28px] bg-paper p-8 text-ink">
        <h1 className="h-display text-[1.8rem]">Algo salió mal</h1>
        <p className="mt-2 text-muted" lang="en">Something went wrong.</p>
        <button type="button" onClick={() => retry()} className="btn btn-primary mt-6 w-full">Reintentar · Try again</button>
      </div>
    </main>
  );
}
