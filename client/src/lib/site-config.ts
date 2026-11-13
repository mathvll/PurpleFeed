const env = import.meta.env as Record<string, string | undefined>;

function readString(keys: string[], fallback: string): string {
  for (const key of keys) {
    const value = env[key]?.trim();

    if (value && value.length > 0) {
      return value;
    }
  }

  return fallback;
}

function readOptionalString(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = env[key]?.trim();

    if (value && value.length > 0) {
      return value;
    }
  }

  return undefined;
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

const appName = readString(["VITE_APP_NAME", "VITE_BRAND_NAME"], "ImpulsionaLikes");

export const siteConfig = {
  appName,
  siteName: readString(["VITE_SITE_NAME", "VITE_APP_NAME", "VITE_BRAND_NAME"], appName),
  siteDescription: readString(
    ["VITE_SITE_DESCRIPTION"],
    "Landing page configurável para campanhas, captação e redirecionamento.",
  ),
  siteUrl: stripTrailingSlash(readString(["VITE_SITE_URL"], "")),
  appUrl: stripTrailingSlash(
    readString(["VITE_APP_URL"], "https://app.impulsionalikes.com"),
  ),
  homeCtaUrl: readString(
    ["VITE_HOME_CTA_URL", "VITE_CTA_URL"],
    "https://app.impulsionalikes.com/",
  ),
  onboardingCtaUrl: readString(
    ["VITE_ONBOARDING_CTA_URL", "VITE_ONBOARDING_URL"],
    "https://app.impulsionalikes.com/impulsionar",
  ),
  ga4MeasurementId: readOptionalString(["VITE_GA4_MEASUREMENT_ID", "VITE_GA4_ID"]),
  googleAdsMeasurementId: readOptionalString([
    "VITE_GOOGLE_ADS_MEASUREMENT_ID",
    "VITE_GOOGLE_ADS_ID",
  ]),
  whatsappPhoneNumber: readString(
    ["VITE_WHATSAPP_PHONE_NUMBER", "VITE_WHATSAPP_PHONE"],
    "5522992829808",
  ),
  whatsappDisplayPhone: readString(
    ["VITE_WHATSAPP_DISPLAY_PHONE"],
    "+55 22 99282-9808",
  ),
  whatsappMessage: readString(
    ["VITE_WHATSAPP_MESSAGE"],
    "Olá, gostaria de saber mais sobre como funciona a Loja ImpulsionaLikes",
  ),
  pageTitles: {
    root: readString(
      ["VITE_HOME_PAGE_TITLE"],
      `${appName} | Página inicial`,
    ),
    onboarding: readString(
      ["VITE_ONBOARDING_PAGE_TITLE"],
      `${appName} | Onboarding`,
    ),
  },
  landingCopy: {
    heroTitlePrefix: readString(["VITE_HERO_TITLE_PREFIX"], "Impulsione sua"),
    heroTitleHighlight: readString(
      ["VITE_HERO_TITLE_HIGHLIGHT"],
      "presença digital",
    ),
    heroSubtitle: readString(
      ["VITE_HERO_SUBTITLE"],
      "Somos a escolha preferida dos clientes pela excelência, custo-benefício e suporte.",
    ),
    sectionTitle: readString(
      ["VITE_SECTION_TITLE"],
      "Escolha a melhor opção",
    ),
    sectionSubtitle: readString(
      ["VITE_SECTION_SUBTITLE"],
      "Selecione a plataforma ideal para começar agora.",
    ),
    ctaLabel: readString(["VITE_CTA_LABEL"], "Começar agora"),
    onboardingSelectionHint: readString(
      ["VITE_ONBOARDING_SELECTION_HINT"],
      "Selecione uma rede para continuar.",
    ),
    footerText: readString(
      ["VITE_FOOTER_TEXT"],
      "Serviços de alta qualidade e entrega rápida garantidos",
    ),
    followUpTitle: readString(
      ["VITE_FOLLOW_UP_TITLE"],
      "Opa, Eaí, deu tudo certo ?",
    ),
    followUpBody: readString(
      ["VITE_FOLLOW_UP_BODY"],
      "Caso precise de mais informações sobre como funciona, ou outra coisa, pode nos mandar mensagem clicando no botão abaixo",
    ),
  },
} as const;
