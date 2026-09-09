import { useEffect } from "react";
import { useLocation } from "wouter";
import { siteConfig } from "@/lib/site-config";
import { calculatePackPrice, getCategoryById } from "@/lib/smm-catalog";
import { getSalesPageByPath } from "@/lib/sales-pages";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function upsertMeta(selector: string, attribute: string, value: string) {
  let element = document.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  element.setAttribute(attribute, value);
}

function upsertCanonicalLink(href: string) {
  let element = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = href;
}

function upsertJsonLd(id: string, value: Record<string, unknown> | null) {
  const existingScript = document.querySelector<HTMLScriptElement>(`script[data-seo-id="${id}"]`);

  if (!value) {
    existingScript?.remove();
    return;
  }

  const script = existingScript ?? document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.seoId = id;
  script.text = JSON.stringify(value);

  if (!existingScript) {
    document.head.appendChild(script);
  }
}

function getPathname(location: string) {
  return new URL(location, window.location.origin).pathname;
}

function resolveCanonicalUrl(pathname: string) {
  const baseUrl = siteConfig.siteUrl || siteConfig.appUrl || window.location.origin;
  return `${baseUrl.replace(/\/$/, "")}${pathname === "/" ? "" : pathname}`;
}

function getPageTitle(pathname: string): string {
  const salesPage = getSalesPageByPath(pathname);
  if (salesPage) {
    return salesPage.seoTitle;
  }

  if (pathname === "/finalizar") {
    return siteConfig.pageTitles.checkout;
  }

  if (pathname === "/pagamento") {
    return siteConfig.pageTitles.payment;
  }

  return siteConfig.pageTitles.root;
}

function getPageDescription(pathname: string) {
  return getSalesPageByPath(pathname)?.seoDescription ?? siteConfig.siteDescription;
}

export function SiteIntegrations() {
  const [location] = useLocation();

  useEffect(() => {
    const pathname = getPathname(location);
    const canonicalUrl = resolveCanonicalUrl(pathname);
    const salesPage = getSalesPageByPath(pathname);

    document.title = getPageTitle(pathname);
    upsertMeta('meta[name="description"]', "content", getPageDescription(pathname));
    upsertMeta('meta[property="og:title"]', "content", getPageTitle(pathname));
    upsertMeta(
      'meta[property="og:description"]',
      "content",
      getPageDescription(pathname),
    );
    upsertMeta('meta[property="og:site_name"]', "content", siteConfig.siteName);
    upsertMeta('meta[property="og:url"]', "content", canonicalUrl);
    upsertCanonicalLink(canonicalUrl);

    if (salesPage) {
      const category = getCategoryById(salesPage.categoryId);
      const featuredPack = category.packs.find((pack) => pack.featured) ?? category.packs[0];
      upsertJsonLd("sales-product", {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${featuredPack.label} - ${category.title}`,
        description: salesPage.seoDescription,
        brand: { "@type": "Brand", name: siteConfig.siteName },
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: calculatePackPrice(category, featuredPack.quantity),
          availability: "https://schema.org/InStock",
          url: canonicalUrl,
        },
      });
    } else {
      upsertJsonLd("sales-product", null);
    }
  }, [location]);

  useEffect(() => {
    const measurementId = siteConfig.ga4MeasurementId || siteConfig.googleAdsMeasurementId;

    if (!measurementId) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      ((...args: unknown[]) => {
        window.dataLayer?.push(args);
      });

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-google-tag="true"]',
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
        measurementId,
      )}`;
      script.dataset.googleTag = "true";
      document.head.appendChild(script);
    }

    window.gtag("js", new Date());

    if (siteConfig.ga4MeasurementId) {
      window.gtag("config", siteConfig.ga4MeasurementId, {
        send_page_view: false,
      });
    }

    if (
      siteConfig.googleAdsMeasurementId &&
      siteConfig.googleAdsMeasurementId !== siteConfig.ga4MeasurementId
    ) {
      window.gtag("config", siteConfig.googleAdsMeasurementId);
    }
  }, []);

  useEffect(() => {
    if (!siteConfig.ga4MeasurementId || typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", "page_view", {
      page_path: location,
      page_location: window.location.href,
      page_title: getPageTitle(getPathname(location)),
    });
  }, [location]);

  return null;
}
