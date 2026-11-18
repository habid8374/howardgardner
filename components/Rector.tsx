import Image from "next/image";

export default function Rector() {
  return (
    <section id="rector" className="section bg-paper-2">
      <div className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <figure className="photo-frame relative aspect-[4/5] w-full max-w-[480px] overflow-hidden rounded-[28px] bg-ink lg:max-w-none">
          <Image
            src="/rector.png"
            alt="Julián David Cuentas Navarro, rector del colegio"
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover object-[55%_30%]"
          />
        </figure>

        <div>
          <p className="eyebrow text-navy">Palabras del rector</p>
          <blockquote className="mt-6">
            <p className="h-display text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.15] text-ink text-balance">
              “Cada estudiante tiene un potencial único. Nuestro trabajo es despertarlo con una
              educación bilingüe de excelencia, valores sólidos y un acompañamiento cercano.”
            </p>
            <p className="lead mt-7 max-w-xl text-muted">
              Los resultados nos respaldan, pero lo que más nos enorgullece son los jóvenes que
              formamos: íntegros y preparados para construir el futuro de Sabanalarga y de Colombia.
            </p>
            <footer className="mt-8 border-l-2 border-gold pl-4">
              <cite className="not-italic">
                <span className="block font-bold text-ink">Julián David Cuentas Navarro</span>
                <span className="block text-sm text-muted">Rector · Howard Gardner Bilingual School</span>
              </cite>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
