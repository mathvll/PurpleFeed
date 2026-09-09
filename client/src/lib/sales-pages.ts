import type { CategoryId } from "@/lib/smm-catalog";

export type SalesPageConfig = {
  categoryId: CategoryId;
  path: string;
  navLabel: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
};

export const salesPages: SalesPageConfig[] = [
  {
    categoryId: "likes",
    path: "/comprar-curtidas",
    navLabel: "Curtidas",
    title: "Comprar curtidas para Instagram",
    description: "Escolha um pacote de curtidas e avance para o pagamento em poucos passos.",
    seoTitle: "Comprar Curtidas Instagram | curtidas.online",
    seoDescription: "Compre pacotes de curtidas para Instagram com opções rápidas e pagamento via PIX.",
  },
  {
    categoryId: "reels",
    path: "/comprar-visualizacoes",
    navLabel: "Visualizações",
    title: "Comprar visualizações para Reels",
    description: "Destaque seus Reels com um pacote de visualizações no tamanho certo para o seu conteúdo.",
    seoTitle: "Comprar Visualizações para Reels | curtidas.online",
    seoDescription: "Encontre pacotes de visualizações para Reels e finalize sua compra por PIX.",
  },
  {
    categoryId: "followers",
    path: "/comprar-seguidores",
    navLabel: "Seguidores",
    title: "Comprar seguidores para Instagram",
    description: "Escolha seu pacote de seguidores e fortaleça a presença do seu perfil no Instagram.",
    seoTitle: "Comprar Seguidores Instagram | curtidas.online",
    seoDescription: "Escolha um pacote de seguidores para Instagram e compre com pagamento rápido por PIX.",
  },
];

export function getSalesPageByPath(pathname: string) {
  return salesPages.find((page) => page.path === pathname);
}
