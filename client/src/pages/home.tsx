import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import QuickCheckoutDrawer from "@/components/store/quick-checkout-drawer";
import PackageCard from "@/components/store/package-card";
import PopularProducts from "@/components/store/popular-products";
import PurchaseBar from "@/components/store/purchase-bar";
import ServiceSelector from "@/components/store/service-selector";
import StoreFooter from "@/components/store/store-footer";
import TrustStrip from "@/components/store/trust-strip";
import { catalogCategories, getCategoryById, getPackByQuantity, type CategoryId } from "@/lib/smm-catalog";

const faqs = [
  { question: "Como funciona?", answer: "Escolha o pacote, informe o perfil ou link e finalize o pagamento por PIX." },
  { question: "Preciso criar uma conta?", answer: "Não. Você compra sem cadastro e recebe a confirmação no e-mail." },
  { question: "Posso comprar mais de um pacote?", answer: "Sim. Volte à loja e escolha o próximo pacote quando quiser." },
];

function selectedPackFor(categoryId: CategoryId) {
  const category = getCategoryById(categoryId);
  return category.packs.find((pack) => pack.featured) ?? category.packs[0];
}

export default function Home() {
  const [selectedService, setSelectedService] = useState<CategoryId>("likes");
  const [selectedQuantity, setSelectedQuantity] = useState(() => selectedPackFor("likes").quantity);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const category = getCategoryById(selectedService);
  const selectedPack = getPackByQuantity(category, selectedQuantity);

  const chooseService = (service: CategoryId) => {
    setSelectedService(service);
    setSelectedQuantity(selectedPackFor(service).quantity);
  };

  const choosePopular = (service: CategoryId, quantity: number) => {
    setSelectedService(service);
    setSelectedQuantity(quantity);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="store-shell">
      <main className="store-main">
        <section className="store-hero" aria-labelledby="home-title">
          <p className="store-badge">⚡ Compra rápida</p>
          <h1 id="home-title">
            Engajamento <span>rápido.</span><br />
            Sem complicação.
          </h1>
          <p>Escolha seu pacote e compre em poucos passos.</p>
        </section>

        <ServiceSelector value={selectedService} onChange={chooseService} />

        <section id="pacotes" className="space-y-3" aria-labelledby="packages-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="store-eyebrow">Escolha a quantidade</p>
              <h2 id="packages-title" className="store-section-title">{category.title}</h2>
            </div>
            <span className="text-xs font-semibold text-white/52">PIX disponível</span>
          </div>
          <div className="store-package-grid" aria-live="polite">
            {category.packs.map((pack) => (
              <PackageCard
                key={pack.quantity}
                category={category}
                pack={pack}
                selected={pack.quantity === selectedPack.quantity}
                onSelect={() => setSelectedQuantity(pack.quantity)}
              />
            ))}
          </div>
        </section>

        <TrustStrip />

        <section id="como-funciona" className="store-how-it-works" aria-label="Como funciona a compra">
          <span>1. Escolha</span><i>→</i><span>2. Informe</span><i>→</i><span>3. Pague</span>
        </section>

        <PopularProducts onChoose={choosePopular} />

        <section className="space-y-2" aria-labelledby="faq-title">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-[var(--store-accent-warm)]" aria-hidden="true" />
            <h2 id="faq-title" className="store-section-title">Dúvidas rápidas</h2>
          </div>
          <div className="store-faq-list">
            {faqs.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div key={faq.question} className="store-faq-item">
                  <button type="button" onClick={() => setOpenFaq(open ? null : index)} aria-expanded={open}>
                    {faq.question}
                    <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && <p>{faq.answer}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <StoreFooter />
      </main>

      <PurchaseBar category={category} pack={selectedPack} onClick={() => setCheckoutOpen(true)} />
      <QuickCheckoutDrawer open={checkoutOpen} category={category} pack={selectedPack} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}
