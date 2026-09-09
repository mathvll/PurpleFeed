import { MessageCircleMore } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function StoreFooter() {
  const supportUrl = `https://wa.me/${siteConfig.whatsappPhoneNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  return (
    <footer id="suporte" className="space-y-4 border-t border-white/8 pt-6 text-center">
      <a href={supportUrl} target="_blank" rel="noreferrer" className="store-support-link">
        <MessageCircleMore className="h-4 w-4" aria-hidden="true" />
        Precisa de ajuda? Fale com o suporte
      </a>
      <div className="flex justify-center gap-4 text-xs text-white/52">
        <a href="#como-funciona" className="hover:text-white">Como funciona</a>
        <a href="#termos" className="hover:text-white">Termos</a>
      </div>
      <p id="termos" className="text-xs text-white/38">© {new Date().getFullYear()} curtidas.online</p>
    </footer>
  );
}
