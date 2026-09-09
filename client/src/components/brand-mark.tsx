type BrandMarkProps = {
  showName?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function BrandSymbol({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" fill="none">
      <path d="M32 7c13.8 0 25 11.2 25 25S45.8 57 32 57 7 45.8 7 32 18.2 7 32 7Z" fill="url(#brand-orbit)" />
      <path d="M25.5 20.5c0-2.7 3-4.3 5.2-2.8l16 10.1c2.1 1.3 2.1 4.3 0 5.6l-16 10.1c-2.2 1.5-5.2-.1-5.2-2.8V20.5Z" fill="white" />
      <path d="M18 43.5c4.1 5.6 10.3 8.8 17.2 8.8" stroke="white" strokeOpacity=".72" strokeWidth="3.2" strokeLinecap="round" />
      <defs>
        <linearGradient id="brand-orbit" x1="10" y1="9" x2="55" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B2CF5" />
          <stop offset=".55" stopColor="#D72D8B" />
          <stop offset="1" stopColor="#FF4D76" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BrandMark({ showName = true, className = "", size = "md" }: BrandMarkProps) {
  const iconSize = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-14 w-14" : "h-9 w-9";
  const nameSize = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-[15px]";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <BrandSymbol className={`${iconSize} shrink-0 drop-shadow-[0_8px_20px_rgba(215,45,139,0.35)]`} />
      {showName && <span className={`${nameSize} font-extrabold tracking-[-0.04em] text-white`}>curtidas.online</span>}
    </span>
  );
}
