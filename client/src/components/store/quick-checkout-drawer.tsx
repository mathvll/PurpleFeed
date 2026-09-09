import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, X } from "lucide-react";
import { useLocation } from "wouter";
import BrandLoader from "@/components/brand-loader";
import type { CatalogCategory, PackOffer } from "@/lib/smm-catalog";
import { calculatePackPrice, formatCurrency } from "@/lib/smm-catalog";
import { saveCheckoutDraft } from "@/lib/checkout-draft";

type QuickCheckoutDrawerProps = {
  open: boolean;
  category: CatalogCategory;
  pack: PackOffer;
  onClose: () => void;
};

function targetDetails(category: CatalogCategory) {
  if (category.id === "followers") {
    return { label: "Qual é o seu @usuário?", placeholder: "@seuperfil", hint: "Use apenas o usuário do perfil, sem senha." };
  }

  return { label: "Cole o link do conteúdo", placeholder: "https://instagram.com/...", hint: "Use o link do post ou Reel que receberá o pacote." };
}

export default function QuickCheckoutDrawer({ open, category, pack, onClose }: QuickCheckoutDrawerProps) {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<1 | 2>(1);
  const [target, setTarget] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const targetField = targetDetails(category);
  const price = calculatePackPrice(category, pack.quantity);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setTarget("");
    setEmail("");
    setError("");
  }, [open, category.id, pack.quantity]);

  if (!open) return null;

  const continueToSummary = () => {
    if (!target.trim()) {
      setError("Informe o perfil ou link para continuar.");
      return;
    }
    setError("");
    setStep(2);
  };

  const goToPayment = () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Informe um e-mail válido para receber seu pedido.");
      return;
    }

    setSubmitting(true);
    saveCheckoutDraft({
      categoryId: category.id,
      quantity: pack.quantity,
      customerName: "",
      customerEmail: email.trim(),
      target: target.trim(),
    });
    setLocation("/pagamento");
  };

  return (
    <div className="store-drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="store-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="store-drawer__handle" aria-hidden="true" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="store-eyebrow">Passo {step} de 2</p>
            <h2 id="checkout-title" className="mt-1 text-xl font-extrabold tracking-[-0.035em] text-white">
              {step === 1 ? "Para onde enviamos?" : "Revise seu pedido"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="store-icon-button" aria-label="Fechar compra rápida">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 1 ? (
          <div className="mt-6 space-y-3">
            <label htmlFor="purchase-target" className="block text-sm font-bold text-white">{targetField.label}</label>
            <input
              id="purchase-target"
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              placeholder={targetField.placeholder}
              autoComplete="url"
              className="store-input"
              autoFocus
            />
            <p className="text-xs leading-5 text-white/58">{targetField.hint}</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="store-order-summary">
              <span><CheckCircle2 className="h-4 w-4 text-[var(--store-accent-warm)]" /> {pack.quantity.toLocaleString("pt-BR")} {category.shortTitle.toLowerCase()}</span>
              <strong>{formatCurrency(price)}</strong>
              <small>{target}</small>
            </div>
            <div className="space-y-2">
              <label htmlFor="purchase-email" className="block text-sm font-bold text-white">Seu e-mail</label>
              <input
                id="purchase-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@exemplo.com"
                autoComplete="email"
                className="store-input"
                autoFocus
              />
              <p className="text-xs leading-5 text-white/58">Enviaremos a confirmação do pedido para este e-mail.</p>
            </div>
          </div>
        )}

        <p className="mt-4 min-h-5 text-sm text-[#ffb2c9]" aria-live="polite">{error}</p>
        <div className="mt-3 flex gap-3">
          {step === 2 && (
            <button type="button" onClick={() => { setError(""); setStep(1); }} className="store-secondary-button">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
          )}
          <button type="button" onClick={step === 1 ? continueToSummary : goToPayment} disabled={submitting} className="store-primary-button flex-1">
            {submitting ? <BrandLoader label="Abrindo pagamento" /> : step === 1 ? <>Continuar <ArrowRight className="h-4 w-4" /></> : <>Ir para pagamento <ArrowRight className="h-4 w-4" /></>}
          </button>
        </div>
      </section>
    </div>
  );
}
