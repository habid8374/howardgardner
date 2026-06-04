"use client";

import { motion } from "framer-motion";
import { WhatsAppIcon } from "./BrandIcons";

const WA_LINK =
  "https://wa.me/573012028756?text=" +
  encodeURIComponent(
    "Hola, me interesa información sobre Howard Gardner Bilingual School."
  );

export default function WhatsAppFloat() {
  return (
    <motion.a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="wa-float fixed flex items-center gap-3 no-underline"
      style={{
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 60,
      }}
    >
      {/* Label expandible (desktop) */}
      <span
        className="wa-label hidden sm:flex items-center font-semibold rounded-full overflow-hidden whitespace-nowrap"
        style={{
          maxWidth: 0,
          opacity: 0,
          paddingLeft: 0,
          paddingRight: 0,
          height: 0,
          background: "#fff",
          color: "#075E54",
          fontSize: "0.85rem",
          boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
          transition: "all 0.35s ease",
        }}
      >
        Escríbenos por WhatsApp
      </span>

      {/* Botón circular con logo */}
      <span className="relative flex items-center justify-center">
        {/* Pulso animado */}
        <motion.span
          aria-hidden
          className="absolute rounded-full"
          style={{ width: 60, height: 60, background: "#25D366" }}
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <span
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: 60,
            height: 60,
            background: "#25D366",
            color: "#fff",
            boxShadow: "0 8px 24px rgba(37,211,102,0.45)",
          }}
        >
          <WhatsAppIcon size={32} />
        </span>
      </span>

      <style>{`
        .wa-float:hover .wa-label {
          max-width: 240px !important;
          opacity: 1 !important;
          height: 44px !important;
          padding-left: 18px !important;
          padding-right: 18px !important;
        }
      `}</style>
    </motion.a>
  );
}
