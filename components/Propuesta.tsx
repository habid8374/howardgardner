"use client";

import { motion } from "framer-motion";
import { Baby, BookOpen, FlaskConical, GraduationCap } from "lucide-react";

/* Niveles de formación según el sistema educativo colombiano (MEN).
   Las descripciones son generales y editables por el colegio. */
const levels = [
  {
    id: "preescolar",
    icon: Baby,
    name: "Preescolar",
    grades: "Prejardín · Jardín · Transición",
    ages: "3 a 5 años",
    desc: "Primeros pasos en un entorno bilingüe lúdico, donde el juego y la exploración despiertan la curiosidad y las inteligencias múltiples de cada niño.",
  },
  {
    id: "primaria",
    icon: BookOpen,
    name: "Básica Primaria",
    grades: "1° a 5° grado",
    ages: "6 a 10 años",
    desc: "Construcción de bases sólidas en lectura, escritura, matemáticas e inglés, fortaleciendo el pensamiento crítico y los valores desde temprana edad.",
  },
  {
    id: "secundaria",
    icon: FlaskConical,
    name: "Básica Secundaria",
    grades: "6° a 9° grado",
    ages: "11 a 14 años",
    desc: "Profundización en las áreas del conocimiento con un enfoque bilingüe y experimental, preparando a los estudiantes para los retos de la media académica.",
  },
  {
    id: "media",
    icon: GraduationCap,
    name: "Media Académica",
    grades: "10° y 11° grado",
    ages: "15 a 17 años",
    desc: "Etapa de excelencia y orientación profesional, donde nuestros estudiantes lideran el municipio en las Pruebas Saber 11° y se preparan para la universidad.",
  },
];

export default function Propuesta() {
  return (
    <section id="propuesta" style={{ background: "#f7f8fc", padding: "5rem 1.5rem" }}>
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block rounded-full text-xs font-bold uppercase tracking-widest px-4 py-1.5 mb-4"
            style={{ background: "rgba(255,215,0,0.14)", color: "#a07800" }}
          >
            Propuesta Educativa
          </span>
          <h2 className="font-extrabold mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.75rem)", color: "#13136b", lineHeight: 1.2 }}>
            Niveles de <span style={{ color: "#1e1e8f" }}>formación</span>
          </h2>
          <p className="max-w-xl mx-auto m-0" style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.75 }}>
            Un proceso educativo bilingüe y continuo, desde los primeros años hasta el grado 11°,
            que acompaña a cada estudiante en todo su crecimiento.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {levels.map((lvl, i) => {
            const Icon = lvl.icon;
            return (
              <motion.div
                id={lvl.id}
                key={lvl.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="rounded-2xl p-7 flex flex-col"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(30,30,143,0.1)",
                  boxShadow: "0 6px 24px rgba(19,19,107,0.07)",
                  scrollMarginTop: "90px",
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#1e1e8f,#2929b0)" }}
                  >
                    <Icon size={26} style={{ color: "#FFD700" }} />
                  </div>
                  <div>
                    <h3 className="font-extrabold m-0" style={{ fontSize: "1.25rem", color: "#13136b", lineHeight: 1.2 }}>
                      {lvl.name}
                    </h3>
                    <p className="m-0 font-semibold" style={{ fontSize: "0.78rem", color: "#1e1e8f" }}>
                      {lvl.grades}
                    </p>
                  </div>
                </div>

                <p className="m-0 mb-4" style={{ color: "#6b7280", fontSize: "0.92rem", lineHeight: 1.7 }}>
                  {lvl.desc}
                </p>

                <span
                  className="inline-flex items-center self-start rounded-full px-3 py-1 text-xs font-bold mt-auto"
                  style={{ background: "rgba(255,215,0,0.16)", color: "#a07800" }}
                >
                  {lvl.ages}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-10"
        >
          <a
            href="#admisiones"
            className="inline-flex items-center justify-center gap-2 font-bold rounded-xl no-underline transition-all"
            style={{
              background: "#FFD700",
              color: "#13136b",
              padding: "0.9rem 2rem",
              fontSize: "0.95rem",
              boxShadow: "0 4px 18px rgba(255,215,0,0.3)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
          >
            <GraduationCap size={18} />
            Inscríbete en cualquier nivel · 2026
          </a>
        </motion.div>
      </div>
    </section>
  );
}
