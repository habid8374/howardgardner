"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { TEL_HREF, PHONE_DISPLAY, waLink } from "@/lib/site";

/* TODO(CLIENTE): confirmar pasos reales del proceso de admisión,
   documentos requeridos y fechas de inscripción 2026. */
const steps = [
  { t: "Escríbenos", d: "Cuéntanos el grado al que aspira tu hijo o hija por WhatsApp o con este formulario." },
  { t: "Visita el colegio", d: "Agendamos un recorrido para que conozcas las instalaciones y al equipo." },
  { t: "Inscripción", d: "Te enviamos los requisitos y te acompañamos en el proceso de matrícula." },
];

const GRADES = [
  "Prejardín", "Jardín", "Transición",
  "1°", "2°", "3°", "4°", "5°", "6°", "7°", "8°", "9°", "10°", "11°",
];

type Errors = Partial<Record<"nombre" | "telefono" | "grado" | "acepta", string>>;

export default function Admissions() {
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nombre = String(f.get("nombre") || "").trim();
    const telefono = String(f.get("telefono") || "").trim();
    const grado = String(f.get("grado") || "");
    const mensaje = String(f.get("mensaje") || "").trim();
    const acepta = f.get("acepta") === "on";

    const next: Errors = {};
    if (nombre.length < 3) next.nombre = "Escribe tu nombre completo.";
    if (telefono.replace(/\D/g, "").length < 7) next.telefono = "Escribe un número de contacto válido.";
    if (!grado) next.grado = "Elige el grado de interés.";
    if (!acepta) next.acepta = "Debes autorizar el tratamiento de datos para continuar.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const text =
      `Hola, quiero información de inscripciones 2026.\n` +
      `Nombre: ${nombre}\nTeléfono: ${telefono}\nGrado de interés: ${grado}` +
      (mensaje ? `\nMensaje: ${mensaje}` : "") +
      `\n(Autorizo el tratamiento de mis datos según la política del colegio.)`;
    window.open(waLink(text), "_blank", "noopener,noreferrer");
  }

  const field =
    "mt-2 block w-full min-h-12 rounded-xl border border-ink/20 bg-white px-4 text-base text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-navy focus:shadow-[0_0_0_3px_rgba(18,36,90,0.15)]";

  return (
    <section id="admisiones" className="section bg-ink text-white">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow text-gold">Admisiones 2026</p>
          <h2 className="h-section mt-5">Inscripciones abiertas para todos los grados.</h2>
          <p className="lead mt-6 max-w-lg text-white/75">
            De Prejardín a grado 11°. Te respondemos por WhatsApp en horario de atención.
          </p>

          <ol className="mt-10 flex flex-col">
            {steps.map((s, i) => (
              <li key={s.t} className="grid grid-cols-[48px_1fr] gap-4 border-t border-white/12 py-6">
                <span className="h-display text-3xl text-gold">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-bold">{s.t}</h3>
                  <p className="mt-1 text-white/70">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <a href={TEL_HREF} className="link mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-white/85">
            <Phone size={16} aria-hidden /> ¿Prefieres llamar? {PHONE_DISPLAY}
          </a>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-[28px] bg-paper p-6 text-ink sm:p-10"
          aria-labelledby="form-titulo"
        >
          <h3 id="form-titulo" className="h-display text-[1.9rem]">Solicitar información</h3>
          <p className="mt-2 text-muted">Al enviar se abre WhatsApp con tus datos listos.</p>

          <div className="mt-8 flex flex-col gap-5">
            <div>
              <label htmlFor="nombre" className="text-sm font-semibold">Nombre del acudiente *</label>
              <input id="nombre" name="nombre" autoComplete="name" className={field} aria-invalid={!!errors.nombre} aria-describedby={errors.nombre ? "e-nombre" : undefined} />
              {errors.nombre && <p id="e-nombre" className="mt-1.5 text-sm font-medium text-red-700">{errors.nombre}</p>}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="telefono" className="text-sm font-semibold">Teléfono / WhatsApp *</label>
                <input id="telefono" name="telefono" type="tel" inputMode="tel" autoComplete="tel" className={field} aria-invalid={!!errors.telefono} aria-describedby={errors.telefono ? "e-telefono" : undefined} />
                {errors.telefono && <p id="e-telefono" className="mt-1.5 text-sm font-medium text-red-700">{errors.telefono}</p>}
              </div>
              <div>
                <label htmlFor="grado" className="text-sm font-semibold">Grado de interés *</label>
                <select id="grado" name="grado" defaultValue="" className={field} aria-invalid={!!errors.grado} aria-describedby={errors.grado ? "e-grado" : undefined}>
                  <option value="" disabled>Elige un grado</option>
                  {GRADES.map((g) => <option key={g}>{g}</option>)}
                </select>
                {errors.grado && <p id="e-grado" className="mt-1.5 text-sm font-medium text-red-700">{errors.grado}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="mensaje" className="text-sm font-semibold">Mensaje (opcional)</label>
              <textarea id="mensaje" name="mensaje" rows={3} className={`${field} py-3`} />
            </div>

            <div>
              <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                <input type="checkbox" name="acepta" className="mt-1 h-5 w-5 flex-none accent-[var(--navy)]" aria-invalid={!!errors.acepta} aria-describedby={errors.acepta ? "e-acepta" : undefined} />
                <span>
                  Autorizo el tratamiento de mis datos personales conforme a la{" "}
                  <Link href="/politica-de-datos" className="font-semibold text-navy underline underline-offset-2">
                    Política de Tratamiento de Datos
                  </Link>{" "}
                  (Ley 1581 de 2012).
                </span>
              </label>
              {errors.acepta && <p id="e-acepta" className="mt-1.5 text-sm font-medium text-red-700">{errors.acepta}</p>}
            </div>

            <button type="submit" className="btn btn-primary mt-2 w-full">
              <MessageCircle size={18} aria-hidden /> Enviar por WhatsApp
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
