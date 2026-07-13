export type CategoryId = "reels" | "likes" | "followers";

export interface PackOffer {
  quantity: number;
  label: string;
  featured?: boolean;
}

export interface CatalogCategory {
  id: CategoryId;
  title: string;
  shortTitle: string;
  description: string;
  basePricePerThousand: number;
  accent: string;
  packs: PackOffer[];
}

export const catalogCategories: CatalogCategory[] = [
  {
    id: "reels",
    title: "Visualizações para Reels",
    shortTitle: "Reels",
    description: "Acelere o alcance e deixe seus Reels com mais presença.",
    basePricePerThousand: 18.9,
    accent: "from-cyan-400 via-sky-500 to-blue-600",
    packs: [
      { quantity: 1000, label: "1.000 visualizações", featured: true },
      { quantity: 2500, label: "2.500 visualizações" },
      { quantity: 5000, label: "5.000 visualizações" },
      { quantity: 10000, label: "10.000 visualizações" },
      { quantity: 25000, label: "25.000 visualizações" },
      { quantity: 50000, label: "50.000 visualizações" },
    ],
  },
  {
    id: "likes",
    title: "Curtidas",
    shortTitle: "Curtidas",
    description: "Mais prova social para destacar seus posts e Reels.",
    basePricePerThousand: 14.9,
    accent: "from-fuchsia-400 via-pink-500 to-rose-500",
    packs: [
      { quantity: 500, label: "500 curtidas" },
      { quantity: 1000, label: "1.000 curtidas", featured: true },
      { quantity: 2000, label: "2.000 curtidas" },
      { quantity: 5000, label: "5.000 curtidas" },
      { quantity: 10000, label: "10.000 curtidas" },
      { quantity: 25000, label: "25.000 curtidas" },
    ],
  },
  {
    id: "followers",
    title: "Seguidores",
    shortTitle: "Seguidores",
    description: "Fortaleça a autoridade do perfil com mais volume.",
    basePricePerThousand: 29.9,
    accent: "from-emerald-400 via-teal-500 to-cyan-600",
    packs: [
      { quantity: 500, label: "500 seguidores" },
      { quantity: 1000, label: "1.000 seguidores", featured: true },
      { quantity: 2000, label: "2.000 seguidores" },
      { quantity: 5000, label: "5.000 seguidores" },
      { quantity: 10000, label: "10.000 seguidores" },
      { quantity: 20000, label: "20.000 seguidores" },
    ],
  },
];

export function getCategoryById(categoryId: string | undefined): CatalogCategory {
  return (
    catalogCategories.find((category) => category.id === categoryId) ??
    catalogCategories[0]
  );
}

export function getPackByQuantity(category: CatalogCategory, quantity?: string | number) {
  const normalizedQuantity =
    typeof quantity === "string"
      ? Number.parseInt(quantity, 10)
      : typeof quantity === "number"
        ? quantity
        : Number.NaN;

  if (!Number.isFinite(normalizedQuantity)) {
    return category.packs[0];
  }

  return (
    category.packs.find((pack) => pack.quantity === normalizedQuantity) ??
    category.packs[0]
  );
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function calculatePackPrice(category: CatalogCategory, quantity: number): number {
  const rawValue = (category.basePricePerThousand * quantity) / 1000;
  return Math.round(rawValue * 100) / 100;
}

export function buildFinalizeHref(categoryId: CategoryId, quantity: number): string {
  const params = new URLSearchParams({
    category: categoryId,
    quantity: String(quantity),
  });

  return `/finalizar?${params.toString()}`;
}
