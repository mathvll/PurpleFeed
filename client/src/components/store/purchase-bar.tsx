import { ArrowRight } from "lucide-react";
import type { CatalogCategory, PackOffer } from "@/lib/smm-catalog";
import { calculatePackPrice, formatCurrency } from "@/lib/smm-catalog";

type PurchaseBarProps = {
  category: CatalogCategory;
  pack: PackOffer;
  onClick: () => void;
};

export default function PurchaseBar({ category, pack, onClick }: PurchaseBarProps) {
  const quantity = pack.quantity.toLocaleString("pt-BR");
  const price = calculatePackPrice(category, pack.quantity);

  return (
    <div className="store-purchase-bar" aria-label="Resumo do pacote selecionado">
      <div className="store-purchase-bar__summary">
        <span>{quantity} {category.shortTitle.toLowerCase()}</span>
        <strong aria-live="polite">{formatCurrency(price)}</strong>
      </div>
      <button type="button" onClick={onClick} className="store-primary-button">
        Comprar agora
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
