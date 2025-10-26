import { Link, useLocation } from "wouter";
import { Globe, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { COUNTRIES } from "@shared/schema";

export function Navigation() {
  const [location] = useLocation();
  const [selectedCountry, setSelectedCountry] = useState("USA");

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/pfas", label: "PFAS/EPR" },
    { path: "/buy-america", label: "Buy America" },
    { path: "/eudr", label: "EUDR" },
    { path: "/suppliers", label: "Suppliers" },
    { path: "/metrics", label: "Metrics" },
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
              <Link key={item.path} href={item.path} data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <Button
                  variant={location === item.path ? "secondary" : "ghost"}
                  size="sm"
                  className="font-medium"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Section: Language Selector */}
          <div className="flex items-center gap-4">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-[140px] h-9" data-testid="select-country">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country} data-testid={`option-country-${country.toLowerCase()}`}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
