"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

export default function Rector() {
  return (
    <section
      id="rector"
      style={{ background: "#ffffff", padding: "5rem 1.5rem" }}
    >
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
            style={{ background: "rgba(255,215,0,0.14)", color: "#a07800" }}
          >
            Nuestro Rector
          </span>
          <h2
            className="font-extrabold mb-3"
            style={{ fontSize: "clamp(1.8rem,4vw,2.75rem)", color: "#13136b", lineHeight: 1.2 }}
          >
            Liderazgo con <span style={{ color: "#1e1e8f" }}>visión</span>
          </h2>
        </motion.div>

        {/* Two-column content */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,360px)_1fr] gap-10 md:gap-14 items-center">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full"
            style={{ maxWidth: 360 }}
          >
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                aspectRatio: "3 / 4",
                boxShadow: "0 20px 50px rgba(19,19,107,0.25)",
                border: "1px solid rgba(30,30,143,0.1)",
                background: "#0a0a3a",
              }}
            >
              <Image
                src="/rector.png"
                alt="Julián David Cuentas Navarro — Rector"
                fill
                sizes="(max-width: 768px) 90vw, 360px"
                className="object-cover object-top"
              />
              {/* Bottom gradient with name plate */}
              <div
                className="absolute inset-x-0 bottom-0 p-5"
                style={{ background: "linear-gradient(180deg, transparent 0%, rgba(8,8,62,0.92) 100%)" }}
              >
                <p className="m-0 font-bold text-white" style={{ fontSize: "1.05rem", lineHeight: 1.2 }}>
                  Julián David Cuentas Navarro
                </p>
                <p className="m-0 mt-1 font-medium uppercase tracking-wider" style={{ color: "#FFD700", fontSize: "0.7rem" }}>
                  Rector
                </p>
              </div>
            </div>
            {/* Decorative gold corner */}
            <div
              aria-hidden
              className="absolute -top-3 -left-3 rounded-2xl -z-10"
              style={{ width: 90, height: 90, background: "rgba(255,215,0,0.18)" }}
            />
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Quote size={42} style={{ color: "rgba(255,215,0,0.5)" }} className="mb-4" />
            <p
              className="m-0 mb-5"
              style={{ color: "#374151", fontSize: "clamp(1rem,2vw,1.2rem)", lineHeight: 1.85, fontWeight: 400 }}
            >
              En el <strong style={{ color: "#13136b" }}>Howard Gardner Bilingual School</strong> creemos
              que cada estudiante posee un potencial único. Nuestra misión es despertarlo a través de
              una educación bilingüe de excelencia, valores sólidos y un acompañamiento humano cercano.
            </p>
            <p
              className="m-0"
              style={{ color: "#6b7280", fontSize: "clamp(0.95rem,2vw,1.1rem)", lineHeight: 1.85 }}
            >
              Los resultados nos respaldan, pero lo que realmente nos enorgullece son los líderes
              que formamos: jóvenes íntegros, preparados para transformar su entorno y construir
              el futuro de Sabanalarga y de Colombia.
            </p>

            <div
              className="mt-7 inline-flex items-center gap-3"
              style={{ borderLeft: "3px solid #FFD700", paddingLeft: "1rem" }}
            >
              <div>
                <p className="m-0 font-bold" style={{ color: "#13136b", fontSize: "1rem" }}>
                  Julián David Cuentas Navarro
                </p>
                <p className="m-0 text-sm" style={{ color: "#6b7280" }}>
                  Rector · Howard Gardner Bilingual School
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
