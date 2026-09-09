import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteIntegrations } from "@/components/site-integrations";
import AppSplash from "@/components/app-splash";
import TopNav from "@/components/top-nav";
import Home from "@/pages/home";
import Onboarding from "@/pages/onboarding";
import FinalizarPage from "@/pages/finalizar";
import PagamentoPage from "@/pages/pagamento";
import SalesPage from "@/pages/sales-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/finalizar" component={FinalizarPage} />
      <Route path="/pagamento" component={PagamentoPage} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/comprar-curtidas">{() => <SalesPage categoryId="likes" />}</Route>
      <Route path="/comprar-visualizacoes">{() => <SalesPage categoryId="reels" />}</Route>
      <Route path="/comprar-seguidores">{() => <SalesPage categoryId="followers" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <SiteIntegrations />
        <Toaster />
        <AppSplash />
        <TopNav />
        <Router />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
