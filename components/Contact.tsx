"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, CreditCard, Send, Check } from "lucide-react";
import { WhatsAppIcon, InstagramIcon } from "./BrandIcons";

const info = [
  { icon: MapPin,        label: "Dirección",         value: "Calle 12 #34 B-2, Sabanalarga, Atlántico" },
  { icon: Phone,         label: "Teléfono",           value: "+57 301 202 8756",  href: "tel:+573012028756" },
  { icon: WhatsAppIcon,  label: "WhatsApp",            value: "+57 301 202 8756",  href: "https://wa.me/573012028756" },
  { icon: InstagramIcon, label: "Instagram",            value: "@howard_gardner_sabanalarga", href: "https://www.instagram.com/howard_gardner_sabanalarga" },
  { icon: Clock,        label: "Horario de Atención",value: "Lunes a Viernes: 7:00 a.m. – 5:00 p.m." },
  { icon: CreditCard,   label: "NIT",                value: "900.419.545-7" },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <section id="contacto" style={{ background: "#fff", padding: "5rem 1.5rem" }}>
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span
            className="inline-block rounded-full text-xs font-bold uppercase tracking-widest px-4 py-1.5 mb-4"
            style={{ background: "rgba(30,30,143,0.08)", color: "#1e1e8f" }}
          >
            Contacto
          </span>
          <h2 className="font-extrabold mb-2" style={{ fontSize: "clamp(1.8rem,4vw,2.75rem)", color: "#13136b", lineHeight: 1.2 }}>
            ¿Tienes <span style={{ color: "#1e1e8f" }}>preguntas?</span>
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1rem", lineHeight: 1.75, maxWidth: 500 }}>
            Estamos aquí para ayudarte. Contáctanos por cualquiera de nuestros canales.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-5"
          >
            {info.map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#1e1e8f,#2929b0)" }}
                  >
                    <Icon size={18} style={{ color: "#FFD700" }} />
                  </div>
                  <div>
                    <p className="font-bold m-0 mb-0.5" style={{ color: "#1a1a2e", fontSize: "0.88rem" }}>{item.label}</p>
                    <p className="m-0" style={{ color: "#6b7280", fontSize: "0.88rem" }}>{item.value}</p>
                  </div>
                </div>
              );
              return item.href ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="no-underline block hover:opacity-80 transition-opacity">
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl p-7"
            style={{ background: "#f5f7ff" }}
          >
            <h3 className="font-bold mb-5 m-0" style={{ fontSize: "1.15rem", color: "#13136b" }}>
              Envíanos un mensaje
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1a1a2e" }}>Nombre completo *</label>
                <input
                  type="text" required placeholder="Tu nombre completo"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{ border: "1.5px solid #e5e7eb", background: "#fff", fontFamily: "inherit", color: "#1a1a2e" }}
                  onFocus={(e) => (e.target.style.borderColor = "#1e1e8f")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1a1a2e" }}>Teléfono / WhatsApp *</label>
                <input
                  type="tel" required placeholder="+57 300 000 0000"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{ border: "1.5px solid #e5e7eb", background: "#fff", fontFamily: "inherit", color: "#1a1a2e" }}
                  onFocus={(e) => (e.target.style.borderColor = "#1e1e8f")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1a1a2e" }}>Asunto</label>
                <select
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{ border: "1.5px solid #e5e7eb", background: "#fff", fontFamily: "inherit", color: "#6b7280" }}
                  onFocus={(e) => (e.target.style.borderColor = "#1e1e8f")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                >
                  <option value="">Selecciona un asunto</option>
                  <option>Información sobre inscripciones</option>
                  <option>Tarifas y pensiones</option>
                  <option>Visita al colegio</option>
                  <option>Programa bilingüe</option>
                  <option>Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1a1a2e" }}>Mensaje</label>
                <textarea
                  rows={4} placeholder="¿En qué podemos ayudarte?"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all resize-y"
                  style={{ border: "1.5px solid #e5e7eb", background: "#fff", fontFamily: "inherit", color: "#1a1a2e", minHeight: 90 }}
                  onFocus={(e) => (e.target.style.borderColor = "#1e1e8f")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                style={{
                  padding: "0.875rem",
                  background: sent
                    ? "#16a34a"
                    : "linear-gradient(135deg,#1e1e8f,#2929b0)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.3s",
                  boxShadow: "0 4px 16px rgba(30,30,143,0.3)",
                }}
              >
                {sent ? (
                  <><Check size={17} /> ¡Mensaje enviado!</>
                ) : (
                  <><Send size={17} /> Enviar mensaje</>
                )}
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
