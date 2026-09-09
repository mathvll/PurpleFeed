import { BrandSymbol } from "@/components/brand-mark";

export default function BrandLoader({ label = "Carregando..." }: { label?: string }) {
  return (
    <span className="inline-flex items-center justify-center gap-2" role="status" aria-live="polite">
      <BrandSymbol className="store-brand-loader h-5 w-5" />
      <span>{label}</span>
    </span>
  );
}
