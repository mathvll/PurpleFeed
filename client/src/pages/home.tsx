import { useEffect, useRef, useState } from "react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const LOADING_DURATION_MS = 1500;
const FADE_OUT_DURATION_MS = 1000;

type LandingMode = "root" | "onboarding";

interface Platform {
  id: "instagram" | "tiktok";
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  glowColor: string;
}

const platforms: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: SiInstagram,
    color: "from-purple-600 via-pink-600 to-orange-500",
    glowColor: "shadow-[0_0_48px_rgba(236,72,153,0.35)]",
  },
  {
    id: "tiktok",
    name: "Tiktok",
    icon: SiTiktok,
    color: "from-zinc-900 via-neutral-800 to-zinc-700",
    glowColor: "shadow-[0_0_48px_rgba(22,22,22,0.42)]",
  },
];

function buildRedirectUrl(baseUrl: string, social?: Platform["id"]): string {
  const targetUrl = new URL(baseUrl);
  const currentParams = new URLSearchParams(window.location.search);
  const gclid = currentParams.get("gclid");

  if (social) {
    targetUrl.searchParams.set("social", social);
  }

  if (gclid) {
    targetUrl.searchParams.set("gclid", gclid);
  }

  return targetUrl.toString();
}

function LandingPage({
  destinationUrl,
  mode,
}: {
  destinationUrl: string;
  mode: LandingMode;
}) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState<Platform["id"] | null>(null);
  const timersRef = useRef<number[]>([]);
  const transitionLockRef = useRef(false);

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

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, []);

  const scheduleTimer = (callback: () => void, delayMs: number) => {
    const timer = window.setTimeout(callback, delayMs);
    timersRef.current.push(timer);
  };

  const runTransition = ({
    social,
    openInNewTab,
  }: {
    social?: Platform["id"];
    openInNewTab: boolean;
  }) => {
    if (transitionLockRef.current || isTransitioning) {
      return;
    }
    transitionLockRef.current = true;

    const targetUrl = buildRedirectUrl(destinationUrl, social);
    let preparedTab: Window | null = null;

    if (openInNewTab) {
      preparedTab = window.open("", "_blank");
    }

    setIsTransitioning(true);
    setIsFadingOut(false);

    scheduleTimer(() => {
      setIsFadingOut(true);

      scheduleTimer(() => {
        if (openInNewTab) {
          if (preparedTab && !preparedTab.closed) {
            try {
              preparedTab.opener = null;
            } catch (error) {
              console.error("Unable to clear opener reference:", error);
            }
            preparedTab.location.href = targetUrl;
          } else {
            const fallbackTab = window.open(targetUrl, "_blank");
            if (!fallbackTab) {
              window.location.href = targetUrl;
            }
          }
          return;
        }

        window.location.href = targetUrl;
      }, FADE_OUT_DURATION_MS);
    }, LOADING_DURATION_MS);
  };

  const handleCardClick = (platformId: Platform["id"]) => {
    if (mode === "onboarding") {
      setSelectedSocial(platformId);
      runTransition({ social: platformId, openInNewTab: true });
      return;
    }

    runTransition({ openInNewTab: false });
  };

  const handleStartNow = () => {
    if (mode === "onboarding") {
      if (!selectedSocial) {
        return;
      }
      runTransition({ social: selectedSocial, openInNewTab: true });
      return;
    }

    runTransition({ openInNewTab: false });
  };

  const isOnboarding = mode === "onboarding";
  const isCtaDisabled = isTransitioning || (isOnboarding && !selectedSocial);

  return (
    <div className="native-shell page-reveal min-h-screen bg-background text-foreground">
      <div className="native-bg-orb native-bg-orb--one" aria-hidden="true" />
      <div className="native-bg-orb native-bg-orb--two" aria-hidden="true" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 pb-10 pt-8 sm:px-6 sm:pt-10">
        <section className="glass-panel animate-rise-up mb-6 rounded-3xl px-5 py-6 sm:px-8 sm:py-8">
          <div className="text-center">
            <h1
              className="font-[family-name:var(--font-heading)] text-4xl font-black leading-tight tracking-tight sm:text-5xl"
              data-testid="text-hero-title"
            >
              Impulsione sua presença{" "}
              <span className="headline-gradient">No Digital!</span>
            </h1>
            <p
              className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg"
              data-testid="text-hero-subtitle"
            >
              Somos a escolha preferida dos clientes por nossa excelência,
              custo-benefício e{" "}
              <span className="font-semibold text-foreground">Suporte</span>.
            </p>
          </div>

          <div className="mt-8 text-center sm:mt-10">
            <h2
              className="font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl"
              data-testid="text-section-title"
            >
              Escolha a melhor opção
            </h2>
            <p
              className="mt-2 text-sm text-muted-foreground sm:text-base"
              data-testid="text-section-subtitle"
            >
              Encontre o serviço certo para você e comece agora.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {platforms.map((platform, index) => {
              const Icon = platform.icon;
              const isSelected = selectedSocial === platform.id;

              return (
                <Card
                  key={platform.id}
                  role="button"
                  tabIndex={isTransitioning ? -1 : 0}
                  onClick={() => handleCardClick(platform.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleCardClick(platform.id);
                    }
                  }}
                  className={`platform-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] ${
                    isSelected ? "platform-card-selected" : ""
                  } ${platform.glowColor}`}
                  style={{ animationDelay: `${index * 110}ms` }}
                  data-testid={`card-platform-${platform.id}`}
                >
                  <div
                    className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${platform.color}`}
                  >
                    <Icon className="h-11 w-11 text-white" />
                  </div>
                  <h3
                    className="font-[family-name:var(--font-heading)] text-xl font-semibold text-card-foreground"
                    data-testid={`text-platform-${platform.id}`}
                  >
                    {platform.name}
                  </h3>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Button
              size="lg"
              onClick={handleStartNow}
              disabled={isCtaDisabled}
              className="native-cta h-14 w-full rounded-full text-base font-extrabold tracking-wide disabled:opacity-50 sm:h-12 sm:w-auto sm:px-10"
              data-testid="button-start-now"
            >
              COMEÇAR AGORA
            </Button>
            {isOnboarding && !selectedSocial && (
              <p className="mt-3 text-sm text-muted-foreground">
                Selecione uma rede para continuar.
              </p>
            )}
          </div>
        </section>

        <footer className="animate-rise-up mt-2 text-center [animation-delay:320ms]">
          <p className="text-sm text-muted-foreground" data-testid="text-footer">
            Serviços de alta qualidade e entrega rápida garantidos
          </p>
        </footer>
      </main>

      {isTransitioning && (
        <div
          className={`transition-overlay ${isFadingOut ? "transition-overlay-fade" : ""}`}
          aria-live="polite"
          aria-busy="true"
        >
          <LoaderCircle className="h-8 w-8 animate-spin text-white" />
          <p className="mt-4 text-lg font-semibold text-white">Carregando...</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <LandingPage destinationUrl="https://app.impulsionalikes.com/" mode="root" />
  );
}

export function Onboarding() {
  return (
    <LandingPage
      destinationUrl="https://app.impulsionalikes.com/impulsionar"
      mode="onboarding"
    />
  );
}
