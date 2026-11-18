import Image from "next/image";
import { Check } from "lucide-react";

/* TODO(CLIENTE): confirmar intensidad horaria de inglés, certificaciones
   de los docentes y exámenes internacionales que se preparan. */
const points = [
  "Colegio Oxford Quality: trabajamos con Oxford University Press.",
  "Única institución bilingüe de Sabanalarga.",
  "Inglés desde preescolar, como parte del día a día.",
  "Clases bilingües en las distintas áreas del conocimiento.",
  "Destacado puntaje en inglés en las Pruebas Saber 11° 2025.",
];

export default function Bilingual() {
  return (
    <section id="bilinguismo" className="section bg-ink text-white">
      <div className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="order-2 lg:order-1">
          <div className="photo-frame relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[28px]">
            <Image
              src="/oxford-quality.jpg"
              alt="Anuncio: oficialmente formamos parte de Oxford Quality, en alianza con Oxford University Press"
              fill
              sizes="(min-width: 1024px) 460px, 90vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="eyebrow text-gold">Bilingüismo</p>
          <h2 className="h-section mt-5">
            Español e inglés, <span className="text-gold">todos los días.</span>
          </h2>
          <p className="lead mt-6 max-w-lg text-white/75">
            Oficialmente formamos parte de Oxford Quality: nuestros estudiantes aprenden inglés con
            recursos confiables de calidad internacional, desde preescolar hasta grado 11°, para
            llegar a la universidad y al mundo con un segundo idioma propio.
          </p>
          <ul className="mt-9 flex flex-col">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-4 border-t border-white/12 py-4 text-[1.02rem] text-white/90">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gold text-ink">
                  <Check size={14} strokeWidth={3} aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
