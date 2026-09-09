import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { siteConfig } from "@/lib/site-config";

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const supportUrl = `https://wa.me/${siteConfig.whatsappPhoneNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;
  const ordersUrl = `https://wa.me/${siteConfig.whatsappPhoneNumber}?text=${encodeURIComponent("Olá, preciso de ajuda com meu pedido.")}`;

  return (
    <header className="store-header">
      <div className="mx-auto flex h-[var(--store-header-height)] w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" onClick={closeMenu} aria-label="curtidas.online - início">
          <BrandMark size="sm" />
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold text-white/68 md:flex" aria-label="Navegação principal">
          <a href="/#como-funciona" className="hover:text-white">Como funciona</a>
          <a href={supportUrl} target="_blank" rel="noreferrer" className="hover:text-white">Suporte</a>
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="top-navigation-mobile"
          onClick={() => setMenuOpen((current) => !current)}
          className="store-icon-button md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav id="top-navigation-mobile" className="store-header-menu md:hidden" aria-label="Navegação mobile">
          <div className="mx-auto grid max-w-6xl gap-1">
            <a href={ordersUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>Meus pedidos</a>
            <Link href="/comprar-curtidas" onClick={closeMenu}>Comprar curtidas</Link>
            <Link href="/comprar-seguidores" onClick={closeMenu}>Comprar seguidores</Link>
            <Link href="/comprar-visualizacoes" onClick={closeMenu}>Comprar visualizações</Link>
            <a href={supportUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>Suporte</a>
            <a href="/#como-funciona" onClick={closeMenu}>Como funciona</a>
            <a href="/#termos" onClick={closeMenu}>Termos</a>
          </div>
        </nav>
      )}
    </header>
  );
}
