import { Navigation } from "@/components/Navigation";
import { HeroCarousel } from "@/components/HeroCarousel";
import { RegulatoryFrameworks } from "@/components/RegulatoryFrameworks";
import { MetricsCard } from "@/components/MetricsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Recycle, TrendingUp, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section with 4K Carousel */}
        <HeroCarousel />

        {/* Regulatory Frameworks */}
        <RegulatoryFrameworks />

        {/* Live Metrics Section */}
        <section className="w-full py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-semibold tracking-tight">Real-Time Compliance Metrics</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transparency as a Service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="RFQs Issued"
                value="1,247"
                trend={{ value: 12, isPositive: true }}
                subtitle="Across 3 regulatory domains"
                data-testid="metric-rfqs-issued"
              />
              <MetricsCard
                title="Supplier Responses"
                value="892"
                trend={{ value: 8, isPositive: true }}
                subtitle="71% response rate"
                data-testid="metric-supplier-responses"
              />
              <MetricsCard
                title="Closed Transactions"
                value="312"
                trend={{ value: 15, isPositive: true }}
                subtitle="35% success rate"
                data-testid="metric-closed-transactions"
              />
              <MetricsCard
                title="Avg Cycle Time"
                value="4.2d"
                trend={{ value: 5, isPositive: false }}
                subtitle="From RFQ to close"
                data-testid="metric-avg-cycle-time"
              />
            </div>
          </div>
        </section>

        {/* 🔄 CIRCULAR ECONOMY VALUE PROP */}
        <section className="w-full py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                <Recycle className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Circular Compliance Innovation</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight">
                Buy Verified <span className="text-primary">Secondary Materials</span>
                <br />
                Save 30% While Staying Compliant
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                World's first marketplace combining circular economy with multi-framework regulatory compliance. 
                Every surplus material is AI-matched, verified, and certified.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border rounded-xl p-8 hover-elevate transition-all">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Recycle className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Surplus Marketplace</h3>
                <p className="text-muted-foreground mb-4">
                  Access certified materials from completed projects. All compliance maintained, pricing 30% below market.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>PFAS-free packaging surplus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Buy America steel & components</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>EUDR-certified commodities</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border rounded-xl p-8 hover-elevate transition-all">
                <div className="w-14 h-14 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
                  <Award className="w-7 h-7 text-chart-2" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Carbon Credits Included</h3>
                <p className="text-muted-foreground mb-4">
                  Every circular transaction generates verified carbon credits. Monetize your sustainability impact.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                    <span>Auto-calculated CO2 savings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                    <span>Verified carbon credits marketplace</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                    <span>ESG reporting integration</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border rounded-xl p-8 hover-elevate transition-all">
                <div className="w-14 h-14 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-7 h-7 text-chart-3" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Reverse Auctions</h3>
                <p className="text-muted-foreground mb-4">
                  Smart matching engine finds best combination of price, compliance, and sustainability in real-time.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-3" />
                    <span>24h automated bidding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-3" />
                    <span>8-language AI negotiation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-3" />
                    <span>Optimal supplier mix algorithm</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Lead Capture Section - URGÊNCIA EXTREMA */}
        <section className="w-full py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-chart-2/10 to-chart-3/20" />
          <div className="relative max-w-4xl mx-auto px-6">
            <div className="bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-2xl p-12 text-center space-y-6 shadow-2xl">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-2">
                <Recycle className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">⚡ Limited Time: First 100 Free</span>
              </div>
              
              <h2 className="text-4xl font-bold tracking-tight">
                Start Circular Compliance Sourcing Today
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join <span className="font-semibold text-primary">600+ verified suppliers</span> and buyers using BrokerChain for 
                circular, compliant supply chains across PFAS, Buy America, and EUDR.
              </p>

              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4" onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  placeholder="your.email@company.com"
                  className="h-14 text-base"
                  data-testid="input-email-subscribe"
                />
                <Button size="lg" className="gap-2 whitespace-nowrap h-14 px-8 font-semibold animate-pulse" data-testid="button-subscribe">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>

              <div className="flex items-center justify-center gap-8 pt-6 text-sm text-muted-foreground border-t">
                <div className="flex items-center gap-2">
                  <Recycle className="w-4 h-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-chart-2" />
                  <span>Free carbon tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-chart-3" />
                  <span>AI consultation included</span>
                </div>
              </div>

              {/* 🔥 SOCIAL PROOF - MENSAGEM SUBLIMINAR */}
              <div className="bg-muted/50 rounded-lg p-4 mt-6">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">47 companies</span> joined in the last 7 days • 
                  <span className="font-semibold text-foreground"> $2.3M</span> circular materials traded this week
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-12 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 BrokerChain. NMSDC Certified MBE | SAM.gov Registered
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
