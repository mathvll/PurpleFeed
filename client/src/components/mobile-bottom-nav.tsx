import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Heart, Menu, PlayCircle, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

const navItemClass = "flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-white transition hover:bg-white/10";

export default function MobileBottomNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm md:hidden" onClick={closeMenu}>
          <div className="absolute inset-x-3 bottom-[5.75rem] rounded-3xl border border-white/20 bg-[#552653]/98 p-3 shadow-[0_30px_100px_rgba(0,0,0,0.34)]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between px-2 py-1">
              <div>
                <BrandMark />
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">Acesso rápido</p>
              </div>
              <button type="button" onClick={closeMenu} aria-label="Fechar menu" className="rounded-full border border-white/10 bg-white/5 p-2 text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 grid gap-1">
              <Link href="/" onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm font-semibold text-white/80 hover:bg-white/10">Início</Link>
              <Link href="/comprar-curtidas" onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm font-semibold text-white/80 hover:bg-white/10">Comprar curtidas</Link>
              <Link href="/comprar-visualizacoes" onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm font-semibold text-white/80 hover:bg-white/10">Comprar visualizações</Link>
              <Link href="/comprar-seguidores" onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm font-semibold text-white/80 hover:bg-white/10">Comprar seguidores</Link>
              <div className="mt-2 grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
                <Link href="/comprar-visualizacoes" onClick={closeMenu} className="rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center text-xs font-bold text-white/80">Reels</Link>
                <Link href="/comprar-curtidas" onClick={closeMenu} className="rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center text-xs font-bold text-white/80">Curtidas</Link>
                <Link href="/comprar-seguidores" onClick={closeMenu} className="rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center text-xs font-bold text-white/80">Seguidores</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:hidden" aria-label="Navegação mobile">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-1 rounded-2xl border border-white/20 bg-[#552653]/95 p-1.5 shadow-[0_-20px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <Link href="/comprar-curtidas" onClick={closeMenu} className={navItemClass}>
            <Heart className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Curtidas</span>
          </Link>
          <Link href="/comprar-visualizacoes" onClick={closeMenu} className={navItemClass}>
            <PlayCircle className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Reels</span>
          </Link>
          <button type="button" onClick={() => setMenuOpen((current) => !current)} aria-expanded={menuOpen} className={`${navItemClass} ${menuOpen ? "bg-cyan-400/20" : ""}`}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="text-[10px] font-semibold">Mais serviços</span>
          </button>
        </div>
      </nav>
    </>
  );
}
