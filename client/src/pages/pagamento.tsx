import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useLocation } from "wouter";
import { ArrowLeft, Check, ClipboardCopy, ExternalLink, QrCode, ShieldCheck, TriangleAlert } from "lucide-react";

import { calculatePackPrice, formatCurrency, getCategoryById, getPackByQuantity } from "@/lib/smm-catalog";
import { readCheckoutDraft } from "@/lib/checkout-draft";
import { siteConfig } from "@/lib/site-config";

function resolvePaymentState() {
  const draft = readCheckoutDraft();
  const searchParams = new URLSearchParams(window.location.search);
  const category = getCategoryById(draft?.categoryId ?? searchParams.get("category") ?? undefined);
  const pack = getPackByQuantity(category, draft?.quantity ?? searchParams.get("quantity") ?? undefined);

  return { draft, category, pack, totalPrice: calculatePackPrice(category, pack.quantity) };
}

function isConfiguredPixCode(value: string) {
  const normalized = value.trim();
  return normalized.length >= 20 && !normalized.includes("CHAVE_PIX_AQUI");
}

async function copyPixCode(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = value;
  helper.setAttribute("readonly", "true");
  helper.style.position = "fixed";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  document.body.removeChild(helper);
}

function trackPaymentEvent(eventName: "view_pix_payment" | "copy_pix_code") {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName);
  }
}

export default function PagamentoPage() {
  const [, setLocation] = useLocation();
  const paymentState = resolvePaymentState();
  const pixCode = siteConfig.pixCopyPaste.trim();
  const pixIsConfigured = isConfiguredPixCode(pixCode);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const supportUrl = `https://wa.me/${siteConfig.whatsappPhoneNumber}?text=${encodeURIComponent("Olá, preciso de ajuda com meu pagamento na curtidas.online.")}`;

  useEffect(() => {
    trackPaymentEvent("view_pix_payment");
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleBack = () => {
    if (document.referrer.startsWith(window.location.origin)) {
      window.history.back();
      return;
    }

    setLocation("/");
  };

  const handleCopyPix = async () => {
    if (!pixIsConfigured) return;

    try {
      await copyPixCode(pixCode);
      setCopyError(false);
      setCopied(true);
      trackPaymentEvent("copy_pix_code");
    } catch (error) {
      console.error("Failed to copy PIX code:", error);
      setCopyError(true);
    }
  };

  return (
    <div className="store-shell">
      <main className="payment-main">
        <header className="payment-header">
          <button type="button" onClick={handleBack} className="store-icon-button" aria-label="Voltar para a loja">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span>Pagamento PIX</span>
          <span className="payment-header__secure"><ShieldCheck className="h-4 w-4" /> Seguro</span>
        </header>

        <section className="payment-layout" aria-labelledby="payment-title">
          <div className="payment-action-panel">
            <p className="store-eyebrow">Último passo</p>
            <h1 id="payment-title">Finalize em segundos.</h1>
            <p className="payment-action-panel__intro">Copie o código PIX, abra o app do seu banco e confirme o pagamento.</p>

            <div className="payment-total">
              <span>Total do pedido</span>
              <strong>{formatCurrency(paymentState.totalPrice)}</strong>
            </div>

            {!pixIsConfigured ? (
              <div className="payment-alert" role="alert">
                <TriangleAlert className="h-5 w-5 shrink-0" />
                <div>
                  <strong>Pagamento indisponível no momento.</strong>
                  <p>Fale com o suporte para receber as instruções de pagamento.</p>
                </div>
              </div>
            ) : (
              <>
                <button type="button" onClick={handleCopyPix} className="payment-copy-button" aria-describedby="payment-copy-status">
                  {copied ? <Check className="h-5 w-5" /> : <ClipboardCopy className="h-5 w-5" />}
                  <span>{copied ? "Código PIX copiado" : "Copiar código PIX"}</span>
                  <strong>{formatCurrency(paymentState.totalPrice)}</strong>
                </button>
                <p id="payment-copy-status" className="payment-status" aria-live="polite">
                  {copied && "Código copiado. Abra o aplicativo do seu banco para pagar."}
                  {copyError && "Não foi possível copiar. Use o código completo abaixo."}
                </p>

                <details className="payment-code-details">
                  <summary>Ver código PIX copia e cola</summary>
                  <code>{pixCode}</code>
                </details>

                <section className="payment-qr" aria-labelledby="pix-qr-title">
                  <div>
                    <QrCode className="h-5 w-5 text-[var(--store-accent-warm)]" />
                    <h2 id="pix-qr-title">Prefere escanear?</h2>
                    <p>Aponte a câmera do banco para o QR Code.</p>
                  </div>
                  <div className="payment-qr__code">
                    <QRCodeSVG value={pixCode} size={208} marginSize={2} level="M" title="QR Code PIX" />
                  </div>
                </section>
              </>
            )}
          </div>

          <aside className="payment-order" aria-label="Resumo do pedido">
            <div className="payment-order__heading">
              <p className="store-eyebrow">Seu pedido</p>
              <button type="button" onClick={handleBack}>Editar</button>
            </div>
            <h2>{paymentState.pack.label}</h2>
            <p>{paymentState.category.title}</p>
            <dl>
              {paymentState.draft?.target && (
                <div>
                  <dt>Perfil ou conteúdo</dt>
                  <dd title={paymentState.draft.target}>{paymentState.draft.target}</dd>
                </div>
              )}
              {paymentState.draft?.customerEmail && (
                <div>
                  <dt>E-mail</dt>
                  <dd title={paymentState.draft.customerEmail}>{paymentState.draft.customerEmail}</dd>
                </div>
              )}
            </dl>
            <div className="payment-order__notice">Após o pagamento, seu pedido segue para atendimento.</div>
            <a href={supportUrl} target="_blank" rel="noreferrer" className="payment-support-link">
              Precisa de ajuda? Fale com o suporte <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </aside>
        </section>
      </main>
    </div>
  );
}
