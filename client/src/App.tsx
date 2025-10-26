import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import PFAS from "@/pages/PFAS";
import BuyAmerica from "@/pages/BuyAmerica";
import EUDR from "@/pages/EUDR";
import Suppliers from "@/pages/Suppliers";
import Content from "@/pages/Content";
import Metrics from "@/pages/Metrics";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/pfas" component={PFAS} />
      <Route path="/buy-america" component={BuyAmerica} />
      <Route path="/eudr" component={EUDR} />
      <Route path="/suppliers" component={Suppliers} />
      <Route path="/content" component={Content} />
      <Route path="/metrics" component={Metrics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
