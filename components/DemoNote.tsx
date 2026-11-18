import { FlaskConical } from "lucide-react";

/* Aviso visible en los formularios de la demo. */
export default function DemoNote({ text, badge }: { text: string; badge: string }) {
  return (
    <p className="mt-5 flex items-start gap-3 rounded-xl border border-gold/50 bg-gold-soft/40 px-4 py-3 text-sm leading-relaxed text-ink">
      <span className="mt-0.5 inline-flex flex-none items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink">
        <FlaskConical size={12} aria-hidden /> {badge}
      </span>
      <span>{text}</span>
    </p>
  );
}
