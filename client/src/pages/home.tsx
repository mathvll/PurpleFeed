import { useEffect } from "react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Platform {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const platforms: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: SiInstagram,
    color: "from-purple-600 via-pink-600 to-orange-500",
  },
  {
    id: "tiktok",
    name: "Tiktok",
    icon: SiTiktok,
    color: "from-black to-gray-800",
  },
];

function buildRedirectUrl(): string {
  const baseUrl = "https://app.impulsionalikes.com/";
  const urlParams = new URLSearchParams(window.location.search);
  const gclid = urlParams.get("gclid");
  
  if (gclid) {
    return `${baseUrl}?gclid=${gclid}`;
  }
  
  return baseUrl;
}

function PlatformCard({ platform }: { platform: Platform }) {
  const handleClick = () => {
    window.location.href = buildRedirectUrl();
  };

  const Icon = platform.icon;

  return (
    <Card
      onClick={handleClick}
      className="flex flex-col items-center justify-center p-8 md:p-12 cursor-pointer hover-elevate active-elevate-2 transition-all duration-200 bg-card border-card-border"
      data-testid={`card-platform-${platform.id}`}
    >
      <div className={`bg-gradient-to-br ${platform.color} rounded-full p-4 mb-4`}>
        <Icon className="w-16 h-16 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-card-foreground font-[family-name:var(--font-heading)]" data-testid={`text-platform-${platform.id}`}>
        {platform.name}
      </h3>
    </Card>
  );
}

export default function Home() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gclid = urlParams.get("gclid");
    
    if (gclid) {
      fetch("/api/tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gclid }),
      }).catch((error) => {
        console.error("Failed to track visit:", error);
      });
    }
  }, []);

  const handleStartNow = () => {
    window.location.href = buildRedirectUrl();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto w-full">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 font-[family-name:var(--font-heading)]" data-testid="text-hero-title">
              Impulsione sua presença{" "}
              <span className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--primary))] bg-clip-text text-transparent">
                No Digital!
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-hero-subtitle">
              Somos a escolha preferida dos clientes por nossa excelência, custo-benefício e{" "}
              <span className="font-semibold text-foreground">Suporte</span>.
            </p>
          </div>

          {/* Platform Selection Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-[family-name:var(--font-heading)]" data-testid="text-section-title">
                Escolha a melhor opção
              </h2>
              <p className="text-base md:text-lg text-muted-foreground" data-testid="text-section-subtitle">
                Encontre o serviço certo para você e comece agora.
              </p>
            </div>

            {/* Platform Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
              {platforms.map((platform) => (
                <PlatformCard key={platform.id} platform={platform} />
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-8">
            <Button
              size="lg"
              onClick={handleStartNow}
              className="text-lg font-bold rounded-full shadow-lg"
              data-testid="button-start-now"
            >
              COMEÇAR AGORA
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-sm md:text-base text-muted-foreground" data-testid="text-footer">
          Serviços de alta qualidade e entrega rápida garantidos
        </p>
      </footer>
    </div>
  );
}
