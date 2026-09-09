import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";

const SPLASH_KEY = "curtidas_splash_seen_v1";

export default function AppSplash() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = window.sessionStorage.getItem(SPLASH_KEY);

    if (seen) {
      return;
    }

    window.sessionStorage.setItem(SPLASH_KEY, "true");
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), reducedMotion ? 80 : 820);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="store-splash" role="status" aria-label="Abrindo curtidas.online">
      <div className="store-splash__brand">
        <BrandMark size="lg" />
        <span className="store-splash__caption">compra rápida</span>
      </div>
    </div>
  );
}
