import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Mail, ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculatePackPrice,
  formatCurrency,
  getCategoryById,
  getPackByQuantity,
} from "@/lib/smm-catalog";
import { readCheckoutDraft, saveCheckoutDraft } from "@/lib/checkout-draft";
import { siteConfig } from "@/lib/site-config";

function resolveSelection(draft: ReturnType<typeof readCheckoutDraft>) {
  const searchParams = new URLSearchParams(window.location.search);
  const categoryId = searchParams.get("category") ?? draft?.categoryId;
  const quantity = searchParams.get("quantity") ?? draft?.quantity;
  const category = getCategoryById(categoryId);
  const pack = getPackByQuantity(category, quantity);

  return {
    category,
    pack,
  };
}

export default function FinalizarPage() {
  const [, setLocation] = useLocation();
  const initialDraft = readCheckoutDraft();
  const selection = resolveSelection(initialDraft);
  const [name, setName] = useState(initialDraft?.customerName ?? "");
  const [email, setEmail] = useState(initialDraft?.customerEmail ?? "");
  const totalPrice = calculatePackPrice(selection.category, selection.pack.quantity);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    saveCheckoutDraft({
      categoryId: selection.category.id,
      quantity: selection.pack.quantity,
      customerName: name.trim(),
      customerEmail: email.trim(),
    });

    setLocation("/pagamento");
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[-10rem] top-[-8rem] h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-[-8rem] top-[12rem] h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Voltar para a loja
            </Link>
          </Button>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/40">
            {siteConfig.siteName}
          </p>
        </div>

        <section className="grid flex-1 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Card className="border-white/10 bg-white/[0.05] text-white shadow-[0_40px_120px_rgba(0,0,0,0.36)] backdrop-blur-xl">
            <CardHeader className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.36em] text-cyan-300/80">
                Finalizar pedido
              </p>
              <CardTitle className="text-3xl font-black tracking-tight text-white">
                Preencha seus dados
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 text-white/60">
                Confirme o nome e o email para avançar ao pagamento via PIX.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                      Pacote selecionado
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-white">
                      {selection.pack.label}
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                      {selection.category.title}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <ShoppingBag className="h-5 w-5 text-cyan-200" />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                      Quantidade
                    </p>
                    <p className="mt-2 text-lg font-black text-white">
                      {selection.pack.quantity.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                      Base por 1.000
                    </p>
                    <p className="mt-2 text-lg font-black text-white">
                      {formatCurrency(selection.category.basePricePerThousand)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                      Total
                    </p>
                    <p className="mt-2 text-lg font-black text-white">
                      {formatCurrency(totalPrice)}
                    </p>
                  </div>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-white/80">
                    Nome
                  </Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Seu nome"
                      required
                      className="h-12 border-white/10 bg-black/20 pl-10 text-white placeholder:text-white/30 focus-visible:ring-cyan-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-white/80">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="voce@exemplo.com"
                      required
                      className="h-12 border-white/10 bg-black/20 pl-10 text-white placeholder:text-white/30 focus-visible:ring-cyan-300"
                    />
                  </div>
                </div>

                <Button type="submit" className="h-12 w-full rounded-full font-bold">
                  Finalizar e ir para o pagamento
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.045] text-white shadow-[0_40px_120px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-white">
                Resumo do pedido
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-white/60">
                Confira os dados antes de seguir para o pagamento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                  Produto
                </p>
                <p className="mt-2 text-xl font-black text-white">
                  {selection.pack.label}
                </p>
                <p className="mt-1 text-sm text-white/60">
                  {selection.category.title}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                  Próximo passo
                </p>
                <p className="mt-2 text-sm leading-6 text-white/68">
                  Você segue para a tela de pagamento com QR Code e código
                  copia e cola.
                </p>
              </div>

              <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm leading-6 text-cyan-50">
                Dica: deixe nome e email corretos para facilitar o envio e a
                confirmação do pedido no futuro.
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
