import { Link } from "wouter";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCopy,
  QrCode,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  calculatePackPrice,
  formatCurrency,
  getCategoryById,
  getPackByQuantity,
} from "@/lib/smm-catalog";
import { readCheckoutDraft } from "@/lib/checkout-draft";
import { siteConfig } from "@/lib/site-config";
import { toast } from "@/hooks/use-toast";

function resolvePaymentState() {
  const draft = readCheckoutDraft();
  const searchParams = new URLSearchParams(window.location.search);
  const category = getCategoryById(draft?.categoryId ?? searchParams.get("category") ?? undefined);
  const pack = getPackByQuantity(category, draft?.quantity ?? searchParams.get("quantity") ?? undefined);
  const totalPrice = calculatePackPrice(category, pack.quantity);

  return {
    draft,
    category,
    pack,
    totalPrice,
  };
}

function getQrCodeUrl(payload: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(payload)}`;
}

async function copyPixCode(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = value;
  helper.setAttribute("readonly", "true");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  document.body.removeChild(helper);
}

export default function PagamentoPage() {
  const paymentState = resolvePaymentState();
  const pixCode = siteConfig.pixCopyPaste;
  const qrCodeUrl = getQrCodeUrl(pixCode);

  const handleCopyPix = async () => {
    try {
      await copyPixCode(pixCode);
      toast({
        title: "PIX copia e cola foi copiado",
      });
    } catch (error) {
      console.error("Failed to copy PIX code:", error);
      toast({
        title: "Não foi possível copiar o PIX",
        description: "Tente novamente ou copie manualmente.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[-10rem] top-[-8rem] h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-[-8rem] top-[12rem] h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Link
              href={`/finalizar?category=${paymentState.category.id}&quantity=${paymentState.pack.quantity}`}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/40">
            Pagamento PIX
          </p>
        </div>

        <section className="grid flex-1 gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Card className="border-white/10 bg-white/[0.05] text-white shadow-[0_40px_120px_rgba(0,0,0,0.36)] backdrop-blur-xl">
            <CardHeader className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.36em] text-cyan-300/80">
                Confirmação
              </p>
              <CardTitle className="text-3xl font-black tracking-tight text-white">
                Pague com PIX
              </CardTitle>
              <CardDescription className="max-w-xl text-sm leading-6 text-white/60">
                Escaneie o QR Code ou copie e cole o código abaixo para concluir
                sua compra.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                      Pedido
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-white">
                      {paymentState.pack.label}
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                      {paymentState.category.title}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Sparkles className="h-5 w-5 text-cyan-200" />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                      Nome
                    </p>
                    <p className="mt-2 text-sm font-bold text-white">
                      {paymentState.draft?.customerName || "Não informado"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                      Email
                    </p>
                    <p className="mt-2 text-sm font-bold text-white">
                      {paymentState.draft?.customerEmail || "Não informado"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                      Total
                    </p>
                    <p className="mt-2 text-sm font-black text-white">
                      {formatCurrency(paymentState.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm leading-6 text-cyan-50">
                Assim que o PIX for confirmado, seu pedido segue para
                atendimento.
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.045] text-white shadow-[0_40px_120px_rgba(0,0,0,0.3)] backdrop-blur-xl">
            <CardHeader className="items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <QrCode className="h-6 w-6 text-cyan-200" />
              </div>
              <CardTitle className="text-2xl font-black text-white">
                QR Code PIX
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-white/60">
                Abra o app do banco, escolha PIX e escaneie a imagem.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex justify-center">
                <div className="rounded-[1.75rem] border border-white/10 bg-white p-4 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
                  <img
                    alt="QR Code PIX"
                    className="h-[280px] w-[280px] rounded-[1rem] bg-white object-contain"
                    src={qrCodeUrl}
                  />
                </div>
              </div>

              <div className="grid gap-3 text-sm leading-6 text-white/60">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <p>Abra o app do banco e entre em PIX.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <p>Use o QR Code ou o código copia e cola abaixo.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <p>Confirme o pagamento e aguarde a finalização.</p>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="pix-code" className="text-sm font-semibold text-white/80">
                  PIX copia e cola
                </Label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Textarea
                    id="pix-code"
                    readOnly
                    value={pixCode}
                    className="min-h-[110px] flex-1 border-white/10 bg-black/20 text-sm leading-6 text-white placeholder:text-white/30 focus-visible:ring-cyan-300"
                  />
                  <Button
                    type="button"
                    onClick={handleCopyPix}
                    className="h-12 rounded-full px-5 font-bold sm:self-start"
                  >
                    <ClipboardCopy className="h-4 w-4" />
                    Copiar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
