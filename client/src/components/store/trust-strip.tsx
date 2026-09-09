import { LockKeyhole, MessageCircleMore, Zap } from "lucide-react";

const items = [
  { label: "Entrega rápida", Icon: Zap },
  { label: "Compra segura", Icon: LockKeyhole },
  { label: "Suporte humano", Icon: MessageCircleMore },
];

export default function TrustStrip() {
  return (
    <section className="store-trust-strip" aria-label="Vantagens da compra">
      {items.map(({ label, Icon }) => (
        <div key={label} className="store-trust-strip__item">
          <Icon className="h-4 w-4 text-[var(--store-accent-warm)]" aria-hidden="true" />
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}
