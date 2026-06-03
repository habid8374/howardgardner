"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const features = [
  "Clases bilingües en todas las áreas del conocimiento",
  "Docentes certificados en lengua inglesa",
  "Inmersión lingüística desde preescolar",
  "#1 en inglés — Pruebas Saber 11° municipio",
  "Preparación para certificaciones internacionales",
  "Intercambios culturales y experiencias globales",
];

export default function Bilingual() {
  return (
    <section
      id="bilinguismo"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #08083e 0%, #13136b 45%, #1e1e8f 80%, #2929b0 100%)",
        padding: "5rem 1.5rem",
      }}
    >
      {/* Background accent */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: "-10%",
          width: 600, height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,215,0,0.06), transparent 70%)",
          transform: "translateY(-50%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left — content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
        >
          <span
            className="inline-block rounded-full text-xs font-bold uppercase tracking-widest px-4 py-1.5 mb-5"
            style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            Bilingüismo
          </span>

          <h2 className="font-extrabold mb-4" style={{ fontSize: "clamp(1.8rem,4vw,2.75rem)", color: "#fff", lineHeight: 1.15 }}>
            Líderes en{" "}
            <span style={{ color: "#FFD700" }}>Bilingüismo</span>
            {" "}en Sabanalarga
          </h2>

          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "1rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
            La <strong style={{ color: "#fff" }}>única institución bilingüe</strong> en Sabanalarga y una de las
            más destacadas del Atlántico. Con sobresaliente puntaje en inglés en las pruebas ICFES,
            reafirmamos nuestra posición como referente en educación bilingüe.
          </p>

          <ul className="list-none m-0 p-0 flex flex-col gap-3">
            {features.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                className="flex items-center gap-3"
                style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.93rem" }}
              >
                <CheckCircle size={17} style={{ color: "#FFD700", flexShrink: 0 }} />
                {f}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right — visual cards */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="flex flex-col items-center gap-4"
        >
          {/* ES card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="w-full max-w-xs rounded-2xl p-5 text-center"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ fontSize: "2.8rem" }}>🇨🇴</span>
            <p className="font-extrabold m-0 mt-2" style={{ color: "#fff", fontSize: "1.3rem" }}>Español</p>
            <p className="m-0 mt-1" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>Lengua materna</p>
          </motion.div>

          {/* Plus */}
          <span style={{ color: "#FFD700", fontSize: "1.8rem", fontWeight: 900 }}>+</span>

          {/* EN card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="w-full max-w-xs rounded-2xl p-5 text-center"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ fontSize: "2.8rem" }}>🇺🇸</span>
            <p className="font-extrabold m-0 mt-2" style={{ color: "#fff", fontSize: "1.3rem" }}>English</p>
            <p className="m-0 mt-1" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>Second language</p>
          </motion.div>

          {/* Result */}
          <div
            className="w-full max-w-xs rounded-2xl p-4 text-center"
            style={{
              background: "rgba(255,215,0,0.12)",
              border: "1px solid rgba(255,215,0,0.3)",
            }}
          >
            <p style={{ color: "#FFD700", fontSize: "1.8rem", fontWeight: 900, margin: 0 }}>= Futuro</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", margin: "0.2rem 0 0" }}>
              Ciudadanos globales del siglo XXI
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
