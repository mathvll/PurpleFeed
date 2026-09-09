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

const appName = readString(["VITE_APP_NAME", "VITE_BRAND_NAME"], "curtidas.online");

export const siteConfig = {
  appName,
  siteName: readString(["VITE_SITE_NAME", "VITE_APP_NAME", "VITE_BRAND_NAME"], appName),
  siteDescription: readString(
    ["VITE_SITE_DESCRIPTION"],
    "Curtidas, seguidores e visualizações para fortalecer sua presença no Instagram.",
  ),
  siteUrl: stripTrailingSlash(readString(["VITE_SITE_URL"], "")),
  appUrl: stripTrailingSlash(
    readString(["VITE_APP_URL"], "https://curtidas.online"),
  ),
  homeCtaUrl: readString(
    ["VITE_HOME_CTA_URL", "VITE_CTA_URL"],
    "https://curtidas.online/",
  ),
  onboardingCtaUrl: readString(
    ["VITE_ONBOARDING_CTA_URL", "VITE_ONBOARDING_URL"],
    "https://curtidas.online/",
  ),
  pixCopyPaste: readString(
    ["VITE_PIX_COPY_PASTE"],
    "CHAVE_PIX_AQUI",
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
    "Olá, gostaria de saber mais sobre os pacotes da curtidas.online",
  ),
  pageTitles: {
    root: readString(
      ["VITE_HOME_PAGE_TITLE"],
      `${appName} | Loja de curtidas`,
    ),
    checkout: readString(
      ["VITE_CHECKOUT_PAGE_TITLE"],
      `${appName} | Finalizar pedido`,
    ),
    payment: readString(
      ["VITE_PAYMENT_PAGE_TITLE"],
      `${appName} | Pagamento PIX`,
    ),
    onboarding: readString(
      ["VITE_ONBOARDING_PAGE_TITLE"],
      `${appName} | Onboarding`,
    ),
  },
  landingCopy: {
    heroTitlePrefix: readString(["VITE_HERO_TITLE_PREFIX"], "Aumente suas"),
    heroTitleHighlight: readString(
      ["VITE_HERO_TITLE_HIGHLIGHT"],
      "curtidas no Instagram",
    ),
    heroSubtitle: readString(
      ["VITE_HERO_SUBTITLE"],
      "Pacotes rápidos de curtidas, seguidores e visualizações para deixar seu perfil mais forte.",
    ),
    sectionTitle: readString(
      ["VITE_SECTION_TITLE"],
      "Escolha seu pacote",
    ),
    sectionSubtitle: readString(
      ["VITE_SECTION_SUBTITLE"],
      "Encontre a opção ideal e comece a aumentar sua presença agora.",
    ),
    ctaLabel: readString(["VITE_CTA_LABEL"], "Começar agora"),
    onboardingSelectionHint: readString(
      ["VITE_ONBOARDING_SELECTION_HINT"],
      "Selecione uma rede para continuar.",
    ),
    footerText: readString(
      ["VITE_FOOTER_TEXT"],
      "Mais curtidas, mais presença, mais confiança.",
    ),
    followUpTitle: readString(
      ["VITE_FOLLOW_UP_TITLE"],
      "Deu tudo certo com seu pedido?",
    ),
    followUpBody: readString(
      ["VITE_FOLLOW_UP_BODY"],
      "Se precisar de ajuda com seu pacote ou pedido, fale com nosso atendimento.",
    ),
  },
} as const;
