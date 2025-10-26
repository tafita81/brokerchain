import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Factory, Leaf } from "lucide-react";
import { Link } from "wouter";

export function Hero() {
  return (
    <section className="w-full py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left: Content (60%) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-tight">
                Global Compliance Authority for Regulated Supply Chains
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                End-to-end B2B compliance broker engineered for PFAS-free packaging, Buy America-certified components, and EUDR-compliant agricultural commodities. We certify, verify, inspect, and guarantee every link in your supply chain.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" data-testid="link-access-dashboard">
                <Button size="lg" className="gap-2 font-medium" data-testid="button-access-dashboard">
                  Access Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/suppliers" data-testid="link-view-suppliers">
                <Button size="lg" variant="outline" className="gap-2 font-medium" data-testid="button-view-suppliers">
                  View Supplier Network
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="font-medium">NMSDC Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Factory className="w-4 h-4 text-primary" />
                <span className="font-medium">SAM.gov: N394AKZSR349</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="font-medium">SPC Member</span>
              </div>
            </div>
          </div>

          {/* Right: Visual (40%) */}
          <div className="lg:col-span-2">
            <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border p-8 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-chart-2/10 flex items-center justify-center">
                    <Factory className="w-8 h-8 text-chart-2" />
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-chart-3/10 flex items-center justify-center">
                    <Leaf className="w-8 h-8 text-chart-3" />
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Three Regulations<br />One Verified Global Chain
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
