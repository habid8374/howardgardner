"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Star } from "lucide-react";

const cards = [
  {
    icon: Trophy,
    iconBg: "linear-gradient(135deg,#1e1e8f,#2929b0)",
    iconColor: "#FFD700",
    number: "#1",
    numberColor: "#1e1e8f",
    borderColor: "#1e1e8f",
    title: "Ranking ICFES Municipal 2025",
    desc: "Primeros en Sabanalarga con 297 puntos globales y la máxima categoría A+ (Excelencia) en las Pruebas Saber 11°.",
  },
  {
    icon: Medal,
    iconBg: "linear-gradient(135deg,#a07800,#FFD700)",
    iconColor: "#fff",
    number: "A+",
    numberColor: "#a07800",
    borderColor: "#FFD700",
    title: "Mejor Colegio de Sabanalarga",
    desc: "Categoría A+ Excelencia según el Ranking Milton Ochoa 2025, el referente nacional más importante en educación.",
  },
  {
    icon: Star,
    iconBg: "linear-gradient(135deg,#1e1e8f,#2929b0)",
    iconColor: "#FFD700",
    number: "74°",
    numberColor: "#1e1e8f",
    borderColor: "#1e1e8f",
    title: "Top 100 del Atlántico",
    desc: "Entre los 100 mejores colegios del departamento, puesto 74 de 542 instituciones educativas.",
  },
];

export default function Achievements() {
  return (
    <section id="logros" style={{ background: "#f5f7ff", padding: "5rem 1.5rem" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
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
            Reconocimientos
          </span>
          <h2 className="font-extrabold mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.75rem)", color: "#13136b", lineHeight: 1.2 }}>
            Nuestra excelencia, <span style={{ color: "#a07800" }}>comprobada</span>
          </h2>
          <p className="max-w-xl mx-auto m-0" style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.75 }}>
            Resultados que nos posicionan como la institución educativa más destacada de Sabanalarga.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="rounded-2xl p-8 text-center flex flex-col items-center"
                style={{
                  background: "#fff",
                  borderTop: `4px solid ${c.borderColor}`,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ background: c.iconBg, boxShadow: "0 4px 16px rgba(30,30,143,0.25)" }}
                >
                  <Icon size={28} style={{ color: c.iconColor }} />
                </div>

                <span className="font-black mb-1" style={{ fontSize: "3rem", color: c.numberColor, lineHeight: 1 }}>
                  {c.number}
                </span>
                <h3 className="font-bold mb-2 mt-1" style={{ fontSize: "0.98rem", color: "#1a1a2e" }}>
                  {c.title}
                </h3>
                <p className="m-0" style={{ fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.6 }}>
                  {c.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
