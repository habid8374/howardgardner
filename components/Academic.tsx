"use client";

import { motion } from "framer-motion";

const subjects = [
  { medal: "🥇", rank: "1° Lugar Municipal", name: "Matemáticas",      variant: "gold"   },
  { medal: "🥇", rank: "1° Lugar Municipal", name: "Ciencias Sociales", variant: "gold"   },
  { medal: "🥇", rank: "1° Lugar Municipal", name: "Lectura Crítica",   variant: "gold"   },
  { medal: "🥈", rank: "2° Lugar Municipal", name: "Ciencias Naturales",variant: "silver" },
];

export default function Academic() {
  return (
    <section id="academico" style={{ background: "#fff", padding: "5rem 1.5rem" }}>
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
            Resultados ICFES 2025
          </span>
          <h2 className="font-extrabold mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.75rem)", color: "#13136b", lineHeight: 1.2 }}>
            Primeros lugares en <span style={{ color: "#1e1e8f" }}>áreas académicas</span>
          </h2>
          <p className="max-w-xl mx-auto m-0" style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.75 }}>
            Nuestros estudiantes brillan en las Pruebas Saber 11°, liderando el municipio en las principales áreas del conocimiento.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="rounded-2xl p-6 text-center"
              style={
                s.variant === "gold"
                  ? {
                      background: "linear-gradient(135deg,#fffde7,#fff9c4)",
                      border: "2px solid #FFD700",
                      boxShadow: "0 4px 20px rgba(255,215,0,0.15)",
                    }
                  : {
                      background: "linear-gradient(135deg,#f5f5f5,#ececec)",
                      border: "2px solid #bbb",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                    }
              }
            >
              <span style={{ fontSize: "3rem", display: "block", marginBottom: "0.75rem" }}>{s.medal}</span>
              <p className="font-extrabold uppercase tracking-wider m-0 mb-1" style={{ fontSize: "0.72rem", color: "#1e1e8f" }}>
                {s.rank}
              </p>
              <p className="font-bold m-0" style={{ fontSize: "1rem", color: "#1a1a2e" }}>
                {s.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
