import { useEffect, useRef, useState, type ReactNode } from "react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { LoaderCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const LOADING_DURATION_MS = 1500;
const FADE_OUT_DURATION_MS = 1000;
const FOLLOW_UP_MODAL_DELAY_MS = 10000;
const WHATSAPP_PHONE_NUMBER = "5522992829808";
const WHATSAPP_DISPLAY_PHONE = "+55 22 99282-9808";
const WHATSAPP_MESSAGE =
  "Olá, gostaria de saber mais sobre como funciona a Loja ImpulsionaLikes";

export type LandingMode = "root" | "onboarding";

interface Platform {
  id: "instagram" | "tiktok";
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  glowColor: string;
}

interface LandingCopy {
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  sectionTitle: string;
  sectionSubtitle: string;
  ctaLabel: string;
  onboardingSelectionHint: string;
  footerText: string;
  followUpTitle: string;
  followUpBody: string;
}

const defaultCopy: LandingCopy = {
  heroTitlePrefix: "Impulsione sua presença",
  heroTitleHighlight: "No Digital!",
  heroSubtitle:
    "Somos a escolha preferida dos clientes por nossa excelência, custo-benefício e Suporte.",
  sectionTitle: "Escolha a melhor opção",
  sectionSubtitle: "Encontre o serviço certo para você e comece agora.",
  ctaLabel: "COMEÇAR AGORA",
  onboardingSelectionHint: "Selecione uma rede para continuar.",
  footerText: "Serviços de alta qualidade e entrega rápida garantidos",
  followUpTitle: "Opa, Eaí, deu tudo certo ?",
  followUpBody:
    "Caso precise de mais informações sobre como funciona, ou outra coisa, pode nos mandar mensagem clicando no botão abaixo",
};

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

export interface LandingPageProps {
  destinationUrl: string;
  mode: LandingMode;
  copy?: Partial<LandingCopy>;
  extraSectionContent?: ReactNode;
}

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

function buildWhatsAppUrl(): string {
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE,
  )}`;
}

export default function LandingPage({
  destinationUrl,
  mode,
  copy,
  extraSectionContent,
}: LandingPageProps) {
  const content = { ...defaultCopy, ...copy };
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
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
    setShowFollowUpModal(false);

    if (openInNewTab) {
      scheduleTimer(() => {
        setIsTransitioning(false);
        setIsFadingOut(false);
        setShowFollowUpModal(true);
        transitionLockRef.current = false;
      }, FOLLOW_UP_MODAL_DELAY_MS);
    }

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
              {content.heroTitlePrefix}{" "}
              <span className="headline-gradient">{content.heroTitleHighlight}</span>
            </h1>
            <p
              className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg"
              data-testid="text-hero-subtitle"
            >
              {content.heroSubtitle}
            </p>
          </div>

          <div className="mt-8 text-center sm:mt-10">
            <h2
              className="font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl"
              data-testid="text-section-title"
            >
              {content.sectionTitle}
            </h2>
            <p
              className="mt-2 text-sm text-muted-foreground sm:text-base"
              data-testid="text-section-subtitle"
            >
              {content.sectionSubtitle}
            </p>
          </div>

          {extraSectionContent}

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
              {content.ctaLabel}
            </Button>
            {isOnboarding && !selectedSocial && (
              <p className="mt-3 text-sm text-muted-foreground">
                {content.onboardingSelectionHint}
              </p>
            )}
          </div>
        </section>

        <footer className="animate-rise-up mt-2 text-center [animation-delay:320ms]">
          <p className="text-sm text-muted-foreground" data-testid="text-footer">
            {content.footerText}
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

      {showFollowUpModal && isOnboarding && (
        <div className="follow-up-backdrop">
          <div
            aria-labelledby="follow-up-title"
            aria-modal="true"
            className="follow-up-modal"
            role="dialog"
          >
            <div className="follow-up-icon" aria-hidden="true">
              <MessageCircle className="h-7 w-7" />
            </div>
            <h2 id="follow-up-title">{content.followUpTitle}</h2>
            <p>{content.followUpBody}</p>
            <a
              className="whatsapp-cta"
              href={buildWhatsAppUrl()}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              <span>{WHATSAPP_DISPLAY_PHONE}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
