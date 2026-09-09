import { Check, Zap } from "lucide-react";
import type { CatalogCategory, PackOffer } from "@/lib/smm-catalog";
import { calculatePackPrice, formatCurrency } from "@/lib/smm-catalog";
import { cn } from "@/lib/utils";

type PackageCardProps = {
  category: CatalogCategory;
  pack: PackOffer;
  selected: boolean;
  onSelect: () => void;
};

export default function PackageCard({ category, pack, selected, onSelect }: PackageCardProps) {
  const price = calculatePackPrice(category, pack.quantity);
  const quantity = pack.quantity.toLocaleString("pt-BR");

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn("store-package-card", selected && "store-package-card--selected")}
    >
      <span className="flex min-h-5 items-center justify-between gap-2">
        {pack.featured ? <span className="store-package-card__badge">Mais vendido</span> : <span />}
        {selected && <Check className="h-4 w-4 rounded-full bg-white p-0.5 text-[#8B2CF5]" aria-label="Pacote selecionado" />}
      </span>
      <span className="mt-3 block text-left text-[17px] font-extrabold tracking-[-0.03em] text-white">{quantity}</span>
      <span className="mt-0.5 block text-left text-xs text-white/65">{category.shortTitle.toLowerCase()}</span>
      <span className="mt-3 flex items-center justify-between gap-1 text-left text-lg font-extrabold tracking-[-0.03em] text-white">
        {formatCurrency(price)}
        <Zap className="h-3.5 w-3.5 text-[var(--store-accent-warm)]" aria-hidden="true" />
      </span>
      <span className="mt-1 block text-left text-[11px] text-white/52">Entrega rápida</span>
    </button>
  );
}
