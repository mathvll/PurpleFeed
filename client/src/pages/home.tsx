import LandingPage from "@/components/landing-page";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <LandingPage
      destinationUrl={siteConfig.homeCtaUrl}
      mode="root"
      pageTitle={siteConfig.pageTitles.root}
    />
  );
}
