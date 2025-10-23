import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { PostCard } from "@/components/post-card";
import { CreatePostDialog } from "@/components/create-post-dialog";
import { CategoryFilter } from "@/components/category-filter";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, TrendingUp } from "lucide-react";
import { SiTiktok, SiInstagram } from "react-icons/si";

export default function Home() {
  const [selectedPlatform, setSelectedPlatform] = useState<"all" | "tiktok" | "instagram">("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "https://app.impulsionalikes.com/?utm_campaign=instamediabr";
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const filteredPosts = posts?.filter(post => 
    selectedPlatform === "all" ? true : post.platform === selectedPlatform
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Theme Toggle */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent font-[family-name:var(--font-heading)]">
            SocialBuzz
          </h2>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--gradient-from))] via-[hsl(var(--gradient-via))] to-[hsl(var(--gradient-to))] py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]" data-testid="text-hero-title">
            Últimas Notícias
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8" data-testid="text-hero-subtitle">
            TikTok & Instagram
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
              onClick={() => setCreateDialogOpen(true)}
              data-testid="button-create-post-hero"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Post
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
              data-testid="button-trending"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Tendências
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filters */}
        <div className="mb-8">
          <CategoryFilter 
            selected={selectedPlatform}
            onSelect={setSelectedPlatform}
          />
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-card-border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-via))] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground" data-testid="text-total-posts">{posts?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Posts Totais</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF0050] to-[#00F2EA] flex items-center justify-center">
                <SiTiktok className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground" data-testid="text-tiktok-posts">
                  {posts?.filter(p => p.platform === 'tiktok').length || 0}
                </p>
                <p className="text-sm text-muted-foreground">TikTok</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center">
                <SiInstagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground" data-testid="text-instagram-posts">
                  {posts?.filter(p => p.platform === 'instagram').length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Instagram</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] flex items-center justify-center">
              <Plus className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2" data-testid="text-empty-state">
              Nenhum post encontrado
            </h3>
            <p className="text-muted-foreground mb-6">
              Seja o primeiro a compartilhar novidades sobre {selectedPlatform === "all" ? "redes sociais" : selectedPlatform === "tiktok" ? "TikTok" : "Instagram"}!
            </p>
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              data-testid="button-create-first-post"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Post
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl md:hidden bg-gradient-to-br from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] border-0"
        onClick={() => setCreateDialogOpen(true)}
        data-testid="button-create-post-fab"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <CreatePostDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
