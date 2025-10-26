import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountrySelector } from "@/components/CountrySelector";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navigation() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/dashboard", label: t("dashboard"), testId: "dashboard" },
    { path: "/pfas", label: t("pfasCompliance"), testId: "pfas" },
    { path: "/buy-america", label: t("buyAmerica"), testId: "buy-america" },
    { path: "/eudr", label: t("eudrCompliance"), testId: "eudr" },
    { path: "/suppliers", label: t("suppliers"), testId: "suppliers" },
    { path: "/metrics", label: t("metrics"), testId: "metrics" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <span className="text-xl font-semibold tracking-tight hover-elevate px-2 py-1 rounded-md cursor-pointer">
              BrokerChain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`link-${item.testId}`}>
                <Button
                  variant={location === item.path ? "secondary" : "ghost"}
                  size="default"
                  className="font-medium text-base"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Section: Country Selector with Flag */}
          <div className="flex items-center gap-4">
            <CountrySelector />

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
