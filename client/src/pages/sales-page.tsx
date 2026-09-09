import { ArrowRight, Heart, PlayCircle, ShieldCheck, Users, Zap } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  buildFinalizeHref,
  calculatePackPrice,
  formatCurrency,
  getCategoryById,
  type CategoryId,
} from "@/lib/smm-catalog";
import { salesPages } from "@/lib/sales-pages";

const categoryIcons = {
  likes: Heart,
  reels: PlayCircle,
  followers: Users,
};

const categoryBenefits = {
  likes: ["Pacotes para posts e Reels", "Opções a partir de 500 curtidas", "Pagamento por PIX"],
  reels: ["Pacotes para dar alcance aos Reels", "Opções a partir de 1.000 visualizações", "Pagamento por PIX"],
  followers: ["Pacotes para fortalecer o perfil", "Opções a partir de 500 seguidores", "Pagamento por PIX"],
};

export default function SalesPage({ categoryId }: { categoryId: CategoryId }) {
  const category = getCategoryById(categoryId);
  const page = salesPages.find((item) => item.categoryId === categoryId)!;
  const Icon = categoryIcons[categoryId];
  const benefits = categoryBenefits[categoryId];

  return (
    <div className="min-h-screen bg-[#32183f] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[-10rem] top-[-8rem] h-72 w-72 rounded-full bg-[#833ab4]/30 blur-3xl" />
        <div className="absolute right-[-8rem] top-[14rem] h-72 w-72 rounded-full bg-[#e1306c]/30 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[25%] h-80 w-80 rounded-full bg-[#f77737]/20 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-3 py-5 pb-24 sm:px-6 sm:py-8 md:pb-8 lg:px-8">
        <section className="rounded-3xl border border-white/20 bg-[#4b2552]/76 px-4 py-6 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:px-8 sm:py-10">
          <Badge variant="outline" className="border-pink-200/35 bg-pink-200/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-pink-100">
            Pacotes para Instagram
          </Badge>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{page.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-lg sm:leading-7">{page.description}</p>
            </div>
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${category.accent} text-white shadow-xl sm:h-20 sm:w-20`}>
              <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {benefits.map((benefit, index) => {
              const BenefitIcon = index === 0 ? ShieldCheck : index === 1 ? Zap : Heart;
              return (
                <div key={benefit} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-3 py-3">
                  <BenefitIcon className="h-4 w-4 shrink-0 text-pink-200" />
                  <span className="text-xs font-semibold text-white/85 sm:text-sm">{benefit}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="packages-title" className="relative">
          <div className="mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-pink-200/80">Escolha seu pacote</p>
              <h2 id="packages-title" className="mt-1 text-2xl font-black text-white sm:text-3xl">Compra rápida, sem complicação</h2>
            </div>
          </div>

          <Carousel opts={{ align: "start", containScroll: "trimSnaps" }}>
            <CarouselContent className="-ml-3">
              {category.packs.map((pack) => {
                const price = calculatePackPrice(category, pack.quantity);
                return (
                  <CarouselItem key={pack.quantity} className="basis-[84%] pl-3 sm:basis-[48%] lg:basis-[31%]">
                    <Card className="h-full overflow-hidden border-white/20 bg-[#552653]/90 text-white shadow-[0_22px_65px_rgba(0,0,0,0.28)]">
                      <div className={`h-1.5 bg-gradient-to-r ${category.accent}`} />
                      <CardContent className="flex h-full flex-col p-4">
                        {pack.featured ? (
                          <Badge className="w-fit rounded-full bg-pink-200 text-[10px] font-black uppercase tracking-[0.18em] text-[#4a163f]">Mais escolhido</Badge>
                        ) : (
                          <span className="h-6" aria-hidden="true" />
                        )}
                        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.26em] text-white/55">{category.shortTitle}</p>
                        <h3 className="mt-2 text-3xl font-black tracking-tight">{pack.quantity.toLocaleString("pt-BR")}</h3>
                        <p className="mt-1 text-sm text-white/75">{pack.label}</p>
                        <div className="mt-5 rounded-2xl border border-white/15 bg-black/15 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">Valor do pacote</p>
                          <p className="mt-1 text-2xl font-black text-white">{formatCurrency(price)}</p>
                        </div>
                        <Button asChild className="mt-5 h-11 w-full rounded-full bg-gradient-to-r from-[#f77737] via-[#e1306c] to-[#833ab4] font-black text-white hover:brightness-110">
                          <Link href={buildFinalizeHref(category.id, pack.quantity)}>
                            Comprar agora
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-2 top-1/2 hidden h-9 w-9 border-white/30 bg-[#32183f]/90 text-white hover:bg-[#552653] sm:flex" />
            <CarouselNext className="right-2 top-1/2 hidden h-9 w-9 border-white/30 bg-[#32183f]/90 text-white hover:bg-[#552653] sm:flex" />
          </Carousel>
        </section>

        <section className="grid gap-3 rounded-3xl border border-white/15 bg-white/10 p-4 sm:grid-cols-3 sm:p-5">
          <div className="sm:col-span-3">
            <h2 className="text-xl font-black text-white">Dúvidas rápidas</h2>
          </div>
          <div><p className="text-sm font-bold">Como escolho o pacote?</p><p className="mt-1 text-sm leading-6 text-white/70">Escolha a quantidade que faz sentido para seu momento e siga para o pagamento.</p></div>
          <div><p className="text-sm font-bold">Como funciona o pagamento?</p><p className="mt-1 text-sm leading-6 text-white/70">Após selecionar o pacote, você confirma os dados e paga por PIX.</p></div>
          <div><p className="text-sm font-bold">Posso comprar outro pacote depois?</p><p className="mt-1 text-sm leading-6 text-white/70">Sim. Você pode voltar à loja e escolher outro pacote quando quiser.</p></div>
        </section>
      </main>
    </div>
  );
}
