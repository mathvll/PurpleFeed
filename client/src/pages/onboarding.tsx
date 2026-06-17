import LandingPage from "@/components/landing-page";
import { siteConfig } from "@/lib/site-config";

export default function Onboarding() {
  return (
    <LandingPage
      destinationUrl={siteConfig.onboardingCtaUrl}
      mode="onboarding"
      pageTitle={siteConfig.pageTitles.onboarding}
    />
  );
}
