/* Encabezado de páginas internas: fondo azul bajo el menú, título y bajada. */
export default function PageHeader({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <section className="relative overflow-hidden bg-ink pb-16 pt-[148px] text-white lg:pb-24 lg:pt-[176px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-[0.10]"
        style={{ background: "radial-gradient(closest-side, var(--gold), transparent)" }}
      />
      <div className="wrap relative">
        <p className="eyebrow text-gold" data-enter style={{ "--rise": "8px" } as React.CSSProperties}>{eyebrow}</p>
        <h1 className="h-display mt-6 max-w-4xl text-[clamp(2.4rem,5.6vw,4.6rem)] text-balance" data-enter style={{ "--d": "60ms", "--rise": "16px" } as React.CSSProperties}>
          {title}
        </h1>
        <p className="lead mt-6 max-w-2xl text-white/75" data-enter style={{ "--d": "140ms", "--rise": "10px" } as React.CSSProperties}>{lead}</p>
      </div>
    </section>
  );
}
