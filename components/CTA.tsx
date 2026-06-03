"use client";

import { motion } from "framer-motion";
import { MessageCircle, Mail } from "lucide-react";

export default function CTA() {
  return (
    <section
      id="admisiones"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0d0d5a 0%, #1e1e8f 50%, #2929b0 100%)",
        padding: "5.5rem 1.5rem",
        textAlign: "center",
      }}
    >
      {/* Decorative dots */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,215,0,0.7) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
        >
          <span
            className="inline-block rounded-full text-xs font-bold uppercase tracking-widest px-4 py-1.5 mb-5"
            style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            Admisiones 2026
          </span>

          <h2 className="font-extrabold mb-4" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", color: "#fff", lineHeight: 1.15 }}>
            ¿Listo para ser parte del{" "}
            <span style={{ color: "#FFD700" }}>mejor colegio</span>
            {" "}de Sabanalarga?
          </h2>

          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: 1.75, marginBottom: "2rem" }}>
            Las inscripciones para el año lectivo 2026 están abiertas. Contáctanos hoy y da el primer paso
            hacia una educación de excelencia bilingüe para tu hijo o hija.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="https://wa.me/573012028756?text=Hola%2C%20me%20interesa%20información%20sobre%20inscripciones%20en%20Howard%20Gardner%20Bilingual%20School"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 font-bold rounded-xl no-underline"
              style={{
                background: "#25D366",
                color: "#fff",
                padding: "0.95rem 2rem",
                boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
                fontSize: "1rem",
              }}
            >
              <MessageCircle size={18} />
              Escríbenos por WhatsApp
            </motion.a>

            <motion.a
              href="#contacto"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl no-underline"
              style={{
                background: "transparent",
                color: "#fff",
                padding: "0.95rem 2rem",
                border: "2px solid rgba(255,255,255,0.3)",
                fontSize: "1rem",
              }}
            >
              <Mail size={18} />
              Enviar mensaje
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
