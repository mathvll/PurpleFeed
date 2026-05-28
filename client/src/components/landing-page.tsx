import { useEffect, useRef, useState, type ReactNode } from "react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { ArrowRight, Check, LoaderCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const LOADING_DURATION_MS = 1500;
const FADE_OUT_DURATION_MS = 1000;
const FOLLOW_UP_MODAL_DELAY_MS = 10000;
const WHATSAPP_PHONE_NUMBER = "5522992829808";
const WHATSAPP_DISPLAY_PHONE = "+55 22 99282-9808";
const WHATSAPP_MESSAGE =
  "Olá, gostaria de saber mais sobre como funciona a Loja ImpulsionaLikes";
const ENGAGEMENT_MIN_DURATION_MS = 10000;
const ENGAGEMENT_MIN_INTERACTIONS = 3;
const SESSION_STARTED_AT_KEY = "purplefeed_page_session_started_at";
const SESSION_INTERACTION_COUNT_KEY = "purplefeed_page_interaction_count";
const SESSION_ENGAGEMENT_SENT_KEY = "purplefeed_engajamento_confirmado_sent";
const SCROLL_TRIGGER_PX = 120;

export type LandingMode = "root" | "onboarding";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type InteractionEventName = "instagram_social" | "tiktok_social" | "page_scroll";
type AnalyticsParams = Record<string, string | number | boolean>;

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
  heroTitlePrefix: "Impulsione sua",
  heroTitleHighlight: "presença digital",
  heroSubtitle:
    "Somos a escolha preferida dos clientes pela excelência, custo-benefício e suporte.",
  sectionTitle: "Escolha a melhor opção",
  sectionSubtitle: "Selecione a plataforma ideal para começar agora.",
  ctaLabel: "Começar agora",
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
    color: "from-[#4B00A8] via-[#7A12E0] to-[#B72BFF]",
    glowColor: "shadow-[0_0_48px_rgba(183,43,255,0.34)]",
  },
  {
    id: "tiktok",
    name: "Tiktok",
    icon: SiTiktok,
    color: "from-[#13003D] via-[#25005F] to-[#4B00A8]",
    glowColor: "shadow-[0_0_48px_rgba(37,0,95,0.46)]",
  },
];

export interface LandingPageProps {
  destinationUrl: string;
  mode: LandingMode;
  pageTitle?: string;
  copy?: Partial<LandingCopy>;
  extraSectionContent?: ReactNode;
}

function safeReadSessionNumber(key: string, fallback: number): number {
  try {
    const rawValue = window.sessionStorage.getItem(key);

    if (rawValue === null) {
      return fallback;
    }

    const parsedValue = Number(rawValue);

    return Number.isFinite(parsedValue) ? parsedValue : fallback;
  } catch (error) {
    console.error(`Failed to read session value for ${key}:`, error);
    return fallback;
  }
}

function safeWriteSessionValue(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to persist session value for ${key}:`, error);
  }
}

function safeReadSessionBoolean(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === "true";
  } catch (error) {
    console.error(`Failed to read session flag for ${key}:`, error);
    return false;
  }
}

function trackAnalyticsEvent(
  eventName: InteractionEventName | "engajamento_confirmado",
  params: AnalyticsParams = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    return;
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...params });
  }
}

function getPlatformHint(mode: LandingMode, isSelected: boolean): string {
  if (mode === "onboarding") {
    return isSelected ? "Selecionado para continuar" : "Toque para selecionar";
  }

  return "Clique para continuar";
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
  pageTitle,
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
  const scrollTrackedRef = useRef(false);
  const interactionCountRef = useRef(0);
  const engagementReadyRef = useRef(false);
  const engagementSentRef = useRef(false);
  const engagementTimerRef = useRef<number | null>(null);
  const sessionStartedAtRef = useRef(0);
  const resolvedPageTitle =
    pageTitle ??
    (mode === "onboarding"
      ? "ImpulsionaLikes | Onboarding"
      : "ImpulsionaLikes | Página inicial");

  const attemptEngagementConfirmation = () => {
    if (engagementSentRef.current || !engagementReadyRef.current) {
      return;
    }

    if (interactionCountRef.current < ENGAGEMENT_MIN_INTERACTIONS) {
      return;
    }

    engagementSentRef.current = true;
    safeWriteSessionValue(SESSION_ENGAGEMENT_SENT_KEY, "true");

    trackAnalyticsEvent("engajamento_confirmado", {
      page_title: resolvedPageTitle,
      page_mode: mode,
      interaction_count: interactionCountRef.current,
      time_spent_ms: Date.now() - sessionStartedAtRef.current,
    });
  };

  const registerInteraction = (
    eventName: InteractionEventName,
    params: AnalyticsParams = {},
  ) => {
    const nextInteractionCount = interactionCountRef.current + 1;
    interactionCountRef.current = nextInteractionCount;
    safeWriteSessionValue(SESSION_INTERACTION_COUNT_KEY, String(nextInteractionCount));

    trackAnalyticsEvent(eventName, {
      page_title: resolvedPageTitle,
      page_mode: mode,
      ...params,
    });

    attemptEngagementConfirmation();
  };

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
    document.title = resolvedPageTitle;
  }, [resolvedPageTitle]);

  useEffect(() => {
    const storedStartedAt = safeReadSessionNumber(SESSION_STARTED_AT_KEY, 0);
    const sessionStartedAt = storedStartedAt || Date.now();

    sessionStartedAtRef.current = sessionStartedAt;
    safeWriteSessionValue(SESSION_STARTED_AT_KEY, String(sessionStartedAt));

    interactionCountRef.current = safeReadSessionNumber(
      SESSION_INTERACTION_COUNT_KEY,
      0,
    );
    engagementSentRef.current = safeReadSessionBoolean(SESSION_ENGAGEMENT_SENT_KEY);

    const elapsedMs = Date.now() - sessionStartedAtRef.current;
    const remainingMs = Math.max(ENGAGEMENT_MIN_DURATION_MS - elapsedMs, 0);

    engagementReadyRef.current = remainingMs === 0;

    if (engagementReadyRef.current) {
      attemptEngagementConfirmation();
    } else {
      engagementTimerRef.current = window.setTimeout(() => {
        engagementReadyRef.current = true;
        attemptEngagementConfirmation();
      }, remainingMs);
    }

    const handleScroll = () => {
      if (scrollTrackedRef.current) {
        return;
      }

      const scrollThreshold = Math.max(
        SCROLL_TRIGGER_PX,
        Math.round(window.innerHeight * 0.2),
      );

      if (window.scrollY < scrollThreshold) {
        return;
      }

      scrollTrackedRef.current = true;

      const scrollRange = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );

      registerInteraction("page_scroll", {
        scroll_y: window.scrollY,
        scroll_depth: Math.min(
          100,
          Math.round((window.scrollY / scrollRange) * 100),
        ),
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (engagementTimerRef.current !== null) {
        window.clearTimeout(engagementTimerRef.current);
      }
    };
  }, [mode, resolvedPageTitle]);

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
    if (transitionLockRef.current || isTransitioning) {
      return;
    }

    registerInteraction(
      platformId === "instagram" ? "instagram_social" : "tiktok_social",
      {
        social: platformId,
      },
    );

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
              className="hero-title font-[family-name:var(--font-heading)]"
              data-testid="text-hero-title"
            >
              {content.heroTitlePrefix}{" "}
              <span className="headline-gradient">{content.heroTitleHighlight}</span>
            </h1>
            <p
              className="hero-subtitle mt-4"
              data-testid="text-hero-subtitle"
            >
              {content.heroSubtitle}
            </p>
          </div>

          <div className="mt-8 text-center sm:mt-10">
            <h2
              className="section-title font-[family-name:var(--font-heading)]"
              data-testid="text-section-title"
            >
              {content.sectionTitle}
            </h2>
            <p
              className="section-subtitle mt-2"
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
              const platformHint = getPlatformHint(mode, isSelected);

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
                  aria-pressed={isOnboarding ? isSelected : undefined}
                  className={`platform-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] ${
                    isSelected ? "platform-card-selected" : ""
                  } ${platform.glowColor}`}
                  data-state={isSelected ? "selected" : "idle"}
                  style={{ animationDelay: `${index * 110}ms` }}
                  data-testid={`card-platform-${platform.id}`}
                >
                  {isSelected && (
                    <span className="platform-card-badge" aria-hidden="true">
                      <Check className="h-3.5 w-3.5" />
                      Selecionado
                    </span>
                  )}
                  <div
                    className={`platform-card-icon mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${platform.color}`}
                  >
                    <Icon className="h-11 w-11 text-[#FFF7FF]" />
                  </div>
                  <h3
                    className="platform-card-title font-[family-name:var(--font-heading)] text-card-foreground"
                    data-testid={`text-platform-${platform.id}`}
                  >
                    {platform.name}
                  </h3>
                  <p className="platform-card-hint">{platformHint}</p>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Button
              size="lg"
              onClick={handleStartNow}
              disabled={isCtaDisabled}
              className="native-cta h-14 w-full rounded-full text-base font-extrabold disabled:opacity-50 sm:h-12 sm:w-auto sm:px-10"
              data-testid="button-start-now"
            >
              <span>{content.ctaLabel}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            {isOnboarding && !selectedSocial && (
              <p className="selection-hint">
                {content.onboardingSelectionHint}
              </p>
            )}
          </div>
        </section>

        <footer className="animate-rise-up mt-2 text-center [animation-delay:320ms]">
          <p className="footer-copy text-sm" data-testid="text-footer">
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
          <LoaderCircle className="h-8 w-8 animate-spin text-[#FFF7FF]" />
          <p className="mt-4 text-lg font-semibold text-[#FFF7FF]">Carregando...</p>
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
