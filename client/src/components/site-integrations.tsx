import { useEffect } from "react";
import { useLocation } from "wouter";
import { siteConfig } from "@/lib/site-config";

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

function resolveCanonicalUrl() {
  return siteConfig.siteUrl || siteConfig.appUrl || window.location.origin;
}

function getPageTitle(pathname: string): string {
  if (pathname === "/onboarding") {
    return siteConfig.pageTitles.onboarding;
  }

  return siteConfig.pageTitles.root;
}

export function SiteIntegrations() {
  const [location] = useLocation();

  useEffect(() => {
    const canonicalUrl = resolveCanonicalUrl();

    upsertMeta('meta[name="description"]', "content", siteConfig.siteDescription);
    upsertMeta('meta[property="og:title"]', "content", siteConfig.siteName);
    upsertMeta(
      'meta[property="og:description"]',
      "content",
      siteConfig.siteDescription,
    );
    upsertMeta('meta[property="og:site_name"]', "content", siteConfig.siteName);
    upsertMeta('meta[property="og:url"]', "content", canonicalUrl);
    upsertCanonicalLink(canonicalUrl);
  }, []);

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
      page_title: getPageTitle(location),
    });
  }, [location]);

  return null;
}
