import { Heart, Play, Users } from "lucide-react";
import { calculatePackPrice, formatCurrency, getCategoryById } from "@/lib/smm-catalog";

const popularProducts = [
  { categoryId: "followers" as const, quantity: 1000, Icon: Users },
  { categoryId: "likes" as const, quantity: 5000, Icon: Heart },
  { categoryId: "reels" as const, quantity: 10000, Icon: Play },
];

type PopularProductsProps = {
  onChoose: (categoryId: "reels" | "likes" | "followers", quantity: number) => void;
};

export default function PopularProducts({ onChoose }: PopularProductsProps) {
  return (
    <section className="space-y-3" aria-labelledby="popular-title">
      <div>
        <p className="store-eyebrow">Escolhas rápidas</p>
        <h2 id="popular-title" className="store-section-title">Mais pedidos</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
        {popularProducts.map(({ categoryId, quantity, Icon }) => {
          const category = getCategoryById(categoryId);
          return (
            <button
              key={`${categoryId}-${quantity}`}
              type="button"
              onClick={() => onChoose(categoryId, quantity)}
              className="store-popular-card"
            >
              <span className="flex items-center gap-2 text-white/72">
                <Icon className="h-4 w-4 text-[var(--store-accent)]" aria-hidden="true" />
                {quantity.toLocaleString("pt-BR")} {category.shortTitle.toLowerCase()}
              </span>
              <strong>{formatCurrency(calculatePackPrice(category, quantity))}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}
