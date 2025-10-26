import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { RegulatoryFrameworks } from "@/components/RegulatoryFrameworks";
import { MetricsCard } from "@/components/MetricsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

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

        {/* Lead Capture Section */}
        <section className="w-full py-24">
          <div className="max-w-3xl mx-auto px-6">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border p-12 text-center space-y-6">
              <h2 className="text-3xl font-semibold tracking-tight">Ready to Ensure Compliance?</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Join 600+ companies using BrokerChain for verified, compliant supply chains across PFAS, Buy America, and EUDR regulations.
              </p>

              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4" onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  placeholder="your.email@company.com"
                  className="h-12"
                  data-testid="input-email-subscribe"
                />
                <Button size="lg" className="gap-2 whitespace-nowrap" data-testid="button-subscribe">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>

              <p className="text-xs text-muted-foreground">
                No credit card required. Free consultation included.
              </p>
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
