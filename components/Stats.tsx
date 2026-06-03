"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { prefix: "", value: 297, suffix: "", label: "Puntaje Global ICFES 2025" },
  { prefix: "#", value: 1,   suffix: "", label: "Ranking Municipal ICFES" },
  { prefix: "",  value: 74,  suffix: "°", label: "Puesto en Atlántico (de 542)" },
  { prefix: "+", value: 13,  suffix: " pts", label: "Mejora vs 2024 en ICFES" },
];

function Counter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * value));
      if (p < 1) requestAnimationFrame(tick);
      else setCount(value);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} style={{ color: "#FFD700", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1 }}>
      {prefix}{count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section style={{ background: "#0d0d5a", padding: "3rem 1.5rem" }}>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center flex flex-col items-center gap-2 p-4"
            style={{
              borderRight: i < stats.length - 1 ? "1px solid rgba(255,215,0,0.12)" : "none",
            }}
          >
            <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            <p className="text-xs font-medium uppercase tracking-wider m-0" style={{ color: "rgba(255,255,255,0.6)" }}>
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
