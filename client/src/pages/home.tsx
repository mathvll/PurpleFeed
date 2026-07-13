import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ChevronRight,
  Heart,
  Menu,
  PlayCircle,
  ShoppingBag,
  Sparkles,
  Users,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { SiInstagram, SiTiktok } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import {
  buildFinalizeHref,
  calculatePackPrice,
  catalogCategories,
  formatCurrency,
  type CatalogCategory,
} from "@/lib/smm-catalog";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type FilterValue = "all" | CatalogCategory["id"];

const testimonials = [
  {
    name: "Marina S.",
    role: "Perfil de conteúdo",
    quote:
      "Comecei pelo pacote menor e já senti mais movimento no perfil. Foi direto e rápido.",
  },
  {
    name: "Rafael M.",
    role: "Loja online",
    quote:
      "O pacote de curtidas ajudou a dar mais força nos posts e a compra foi simples.",
  },
  {
    name: "Juliana P.",
    role: "Criadora digital",
    quote:
      "Peguei seguidores e visualizações para destacar os Reels que eu estava impulsionando.",
  },
];

const filterOptions: Array<{ value: FilterValue; label: string }> = [
  { value: "all", label: "Tudo" },
  ...catalogCategories.map((category) => ({
    value: category.id as FilterValue,
    label: category.shortTitle,
  })),
];

function getCategoryIcon(categoryId: CatalogCategory["id"]) {
  if (categoryId === "reels") {
    return PlayCircle;
  }

  if (categoryId === "likes") {
    return Heart;
  }

  return Users;
}

function getCategoryGlow(category: CatalogCategory) {
  return `bg-gradient-to-br ${category.accent}`;
}

function PackCard({
  category,
  quantity,
  featured,
}: {
  category: CatalogCategory;
  quantity: number;
  featured?: boolean;
}) {
  const Icon = getCategoryIcon(category.id);
  const totalPrice = calculatePackPrice(category, quantity);
  const quantityLabel = quantity.toLocaleString("pt-BR");

  return (
    <Card
      className={cn(
        "group h-full overflow-hidden border-white/10 bg-white/[0.05] text-white shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20",
        featured && "border-cyan-300/25 bg-white/[0.07]",
      )}
    >
      <div className={cn("h-1.5 w-full", getCategoryGlow(category))} />
      <CardContent className="flex h-full flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            {featured && (
              <Badge
                variant="outline"
                className="rounded-full border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-100"
              >
                Mais vendido
              </Badge>
            )}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/45">
                {category.shortTitle}
              </p>
              <h3 className="mt-2 text-3xl font-black tracking-tight text-white">
                {quantityLabel}
              </h3>
              <p className="mt-1 text-sm text-white/72">
                {quantityLabel} {category.shortTitle.toLowerCase()}
              </p>
            </div>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg",
              getCategoryGlow(category),
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/45">
            Seu investimento
          </p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-2xl font-black text-white">
                {formatCurrency(totalPrice)}
              </p>
              <p className="mt-1 text-sm text-white/60">
                para ganhar mais presença no perfil
              </p>
            </div>
            <p className="max-w-[120px] text-right text-xs leading-5 text-white/55">
              Ideal para destacar conteúdo e vender mais.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-1 flex-col justify-end">
          <Button asChild className="h-11 w-full rounded-full font-bold">
            <Link href={buildFinalizeHref(category.id, quantity)}>
              Quero este pacote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CategorySection({ category }: { category: CatalogCategory }) {
  return (
    <section className="space-y-3 scroll-mt-24" id={`category-${category.id}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-full border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-white/70"
            >
              Oferta em destaque
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-white/55"
            >
              Mais buscados
            </Badge>
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            {category.title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/66 sm:text-base">
            {category.description}
          </p>
        </div>
      </div>

      <div className="md:hidden">
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            containScroll: "trimSnaps",
          }}
        >
          <CarouselContent className="-ml-3">
            {category.packs.map((pack) => (
              <CarouselItem key={pack.quantity} className="basis-[84%] pl-3 sm:basis-[56%]">
                <PackCard
                  category={category}
                  quantity={pack.quantity}
                  featured={pack.featured}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
        {category.packs.map((pack) => (
          <PackCard
            key={pack.quantity}
            category={category}
            quantity={pack.quantity}
            featured={pack.featured}
          />
        ))}
      </div>
    </section>
  );
}

function UrgencySection() {
  const urgencyItems = [
    {
      title: "Liberação imediata",
      description: "Escolha seu pacote e siga para o pagamento na hora.",
    },
    {
      title: "Mais escolhidos",
      description: "Os pacotes com melhor saída ficam no topo da vitrine.",
    },
    {
      title: "Atendimento rápido",
      description: "Se precisar, fale com a equipe logo após a compra.",
    },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-3">
      {urgencyItems.map((item) => (
        <div
          key={item.title}
          className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-white/62">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="space-y-4">
      <div className="max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-cyan-300/80">
          Feedback
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Quem compra, volta
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/66 sm:text-base">
          Depoimentos curtos de quem quer ganhar presença e vender com mais
          confiança no Instagram.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.name}
            className="border-white/10 bg-white/[0.045] text-white shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          >
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-black text-white">
                  {testimonial.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-white/45">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-white/72">
                “{testimonial.quote}”
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const visibleCategories =
    activeFilter === "all"
      ? catalogCategories
      : catalogCategories.filter((category) => category.id === activeFilter);

  const scrollToCategory = (categoryId: CatalogCategory["id"]) => {
    setActiveFilter(categoryId);
    setMobileMenuOpen(false);
    window.requestAnimationFrame(() => {
      document
        .getElementById(`category-${categoryId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[-10rem] top-[-8rem] h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-[-8rem] top-[14rem] h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[25%] h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 pb-44 sm:px-6 lg:px-8 lg:py-8 lg:pb-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="grid gap-6 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10 lg:py-10">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200"
                >
                  Mais vendidos
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white/75"
                >
                  Compra rápida
                </Badge>
              </div>

              <div className="max-w-3xl space-y-4">
                <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Pacotes que dão{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
                    força ao seu Instagram
                  </span>
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
                  Escolha o pacote ideal, aumente a presença do seu perfil e
                  finalize em poucos passos.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    title: "Mais impacto",
                    description: "Pacotes prontos para chamar atenção",
                    icon: ShieldCheck,
                  },
                  {
                    title: "Escolha fácil",
                    description: "Encontre o volume certo em segundos",
                    icon: Sparkles,
                  },
                  {
                    title: "Pagamento rápido",
                    description: "Finalize sem sair da página",
                    icon: ShoppingBag,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                          <Icon className="h-5 w-5 text-cyan-200" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            {item.title}
                          </p>
                          <p className="text-sm text-white/60">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,11,26,0.96),rgba(7,11,26,0.78))] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-white/40">
                  Ofertas em destaque
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {filterOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={activeFilter === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(option.value)}
                      className={cn(
                        "rounded-full px-4 text-sm",
                        activeFilter !== option.value &&
                          "border-white/10 bg-white/5 text-white hover:bg-white/10",
                      )}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  {catalogCategories.map((category) => {
                    const isActive =
                      activeFilter === "all" || activeFilter === category.id;
                    const Icon = getCategoryIcon(category.id);

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => scrollToCategory(category.id)}
                        className={cn(
                          "flex w-full items-center justify-between gap-4 rounded-2xl border p-3 text-left transition",
                          isActive
                            ? "border-white/20 bg-white/10"
                            : "border-white/10 bg-black/10 opacity-85 hover:opacity-100",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-11 w-11 items-center justify-center rounded-2xl text-white",
                              getCategoryGlow(category),
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">
                              {category.title}
                            </p>
                            <p className="text-xs text-white/55">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/50" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <UrgencySection />

        <section className="space-y-5">
          {visibleCategories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </section>

        <TestimonialsSection />

        <footer className="pb-6 text-center text-sm text-white/45">
          <p>{siteConfig.siteName} - escolhas rápidas para vender mais no Instagram.</p>
        </footer>
      </main>

      <div className="fixed inset-x-3 bottom-[94px] z-50 md:bottom-6 md:left-6 md:right-auto">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 rounded-[1.5rem] border border-cyan-300/20 bg-[#081022]/94 px-4 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200/80">
              Mais pedido agora
            </p>
            <p className="mt-1 truncate text-sm font-bold text-white">
              Pacote 1.000 seguidores com compra rápida
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              asChild
              size="sm"
              className="rounded-full px-4 font-bold"
            >
              <Link href={buildFinalizeHref("followers", 1000)}>
                Comprar agora
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:hidden">
        <div className="rounded-[1.6rem] border border-white/10 bg-[#081022]/92 p-2 shadow-[0_-20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => scrollToCategory("reels")}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white/5 px-2 py-3 text-white transition hover:bg-white/10"
            >
              <SiInstagram className="h-5 w-5" />
              <span className="text-[11px] font-semibold">Instagram</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToCategory("followers")}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white/5 px-2 py-3 text-white transition hover:bg-white/10"
            >
              <SiTiktok className="h-5 w-5" />
              <span className="text-[11px] font-semibold">TikTok</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-white transition",
                mobileMenuOpen ? "bg-cyan-400/20" : "bg-white/5 hover:bg-white/10",
              )}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="text-[11px] font-semibold">Mais Serviços</span>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        >
          <div
            className="absolute inset-x-3 bottom-[88px] rounded-[1.8rem] border border-white/10 bg-[#081022]/96 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.48)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/40">
                  Mais serviços
                </p>
                <h3 className="mt-1 text-lg font-black text-white">
                  Acesso rápido
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/40">
                  Plataformas
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => scrollToCategory("reels")}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                      <SiInstagram className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Instagram</p>
                      <p className="text-xs text-white/55">Atração e presença</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToCategory("followers")}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                      <SiTiktok className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">TikTok</p>
                      <p className="text-xs text-white/55">Mais alcance</p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/40">
                  Categorias
                </p>
                <div className="mt-3 grid gap-2">
                  {catalogCategories.map((category) => {
                    const Icon = getCategoryIcon(category.id);

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => scrollToCategory(category.id)}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-2xl text-white",
                              getCategoryGlow(category),
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">
                              {category.shortTitle}
                            </p>
                            <p className="text-xs text-white/55">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/45" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
