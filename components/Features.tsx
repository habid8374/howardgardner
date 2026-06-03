"use client";

import { motion } from "framer-motion";
import { Globe, TrendingUp, Brain, Users, Laptop, Shield } from "lucide-react";

const items = [
  {
    icon: Globe,
    title: "Educación Bilingüe",
    desc: "Única institución bilingüe en Sabanalarga. Formamos ciudadanos globales con dominio del inglés desde preescolar.",
  },
  {
    icon: TrendingUp,
    title: "Excelencia Académica",
    desc: "Categoría A+ Ranking Milton Ochoa 2025. #1 en el municipio en las Pruebas ICFES Saber 11° con 297 puntos.",
  },
  {
    icon: Brain,
    title: "Pedagogía Innovadora",
    desc: "Basados en la teoría de las Inteligencias Múltiples de Howard Gardner, desarrollamos el potencial de cada estudiante.",
  },
  {
    icon: Users,
    title: "Comunidad Educativa",
    desc: "Un ambiente de formación integral donde padres, docentes y estudiantes construyen juntos el éxito académico.",
  },
  {
    icon: Laptop,
    title: "Tecnología Educativa",
    desc: "Infraestructura tecnológica moderna que potencia el aprendizaje y prepara a los estudiantes para el futuro digital.",
  },
  {
    icon: Shield,
    title: "Valores y Liderazgo",
    desc: "Formamos líderes con valores sólidos, sentido crítico y compromiso con su comunidad y con Colombia.",
  },
];

export default function Features() {
  return (
    <section
      id="nosotros"
      style={{
        background: "linear-gradient(180deg, #f5f7ff 0%, #fff 100%)",
        padding: "5rem 1.5rem",
      }}
    >
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
            style={{ background: "rgba(30,30,143,0.08)", color: "#1e1e8f" }}
          >
            ¿Por qué elegirnos?
          </span>
          <h2 className="font-extrabold mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.75rem)", color: "#13136b", lineHeight: 1.2 }}>
            Una educación que <span style={{ color: "#1e1e8f" }}>transforma</span>
          </h2>
          <p className="max-w-xl mx-auto m-0" style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.75 }}>
            En Howard Gardner formamos estudiantes íntegros, bilingües y preparados para los retos del mundo moderno.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="rounded-2xl p-6"
                style={{
                  background: "#fff",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(30,30,143,0.07)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg,#1e1e8f,#2929b0)" }}
                >
                  <Icon size={22} style={{ color: "#FFD700" }} />
                </div>
                <h3 className="font-bold mb-2 m-0" style={{ fontSize: "1rem", color: "#1a1a2e" }}>
                  {item.title}
                </h3>
                <p className="m-0" style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.65 }}>
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
