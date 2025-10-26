import { Navigation } from "@/components/Navigation";
import { HeroCarousel } from "@/components/HeroCarousel";
import { RegulatoryFrameworks } from "@/components/RegulatoryFrameworks";
import { MetricsCard } from "@/components/MetricsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Recycle, TrendingUp, Award, Shield, Zap, Leaf, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Supplier } from "@shared/schema";
import { formatCount } from "@/hooks/use-stats";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const supplierCount = suppliers.length;
  const uniqueCountries = new Set(suppliers.map(s => s.country));
  const countries = Array.from(uniqueCountries).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section with 4K Carousel */}
        <HeroCarousel />

        {/* 🎯 SERVIÇOS CLAROS - O QUE FAZEMOS */}
        <section className="w-full py-20 bg-gradient-to-b from-background via-muted/30 to-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">{t('pureBrokerModel')}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                {t('howItWorks')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('howItWorksDesc')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* PFAS - Sustainable Packaging */}
              <div className="bg-card border-2 border-blue-500/20 rounded-2xl p-8 hover-elevate transition-all">
                <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <Leaf className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t('pfasFreePackaging')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('pfasPackagingDesc')}
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{t('bpiCertified')}</div>
                      <div className="text-sm text-muted-foreground">{t('bpiCertifiedDesc')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{t('stateCompliant').replace('{count}', '20')}</div>
                      <div className="text-sm text-muted-foreground">{t('stateCompliantDesc')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{t('belowMarket').replace('{percent}', '30')}</div>
                      <div className="text-sm text-muted-foreground">{t('belowMarketDesc')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buy America - Steel & Components */}
              <div className="bg-card border-2 border-orange-500/20 rounded-2xl p-8 hover-elevate transition-all">
                <div className="w-16 h-16 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t('buyAmericaSteel')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('buyAmericaSteelDesc')}
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{t('samGovVerified')}</div>
                      <div className="text-sm text-muted-foreground">{t('samGovVerifiedDesc')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{t('metallurgicalProof')}</div>
                      <div className="text-sm text-muted-foreground">{t('metallurgicalProofDesc')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{t('iatfCertified')}</div>
                      <div className="text-sm text-muted-foreground">{t('iatfCertifiedDesc')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* EUDR - Agricultural Commodities */}
              <div className="bg-card border-2 border-green-500/20 rounded-2xl p-8 hover-elevate transition-all">
                <div className="w-16 h-16 rounded-xl bg-green-500/10 flex items-center justify-center mb-6">
                  <Leaf className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t('eudrCommodities')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('eudrCommoditiesDesc')}
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{t('gpsCoordinates')}</div>
                      <div className="text-sm text-muted-foreground">{t('gpsCoordinatesDesc')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{t('satelliteVerified')}</div>
                      <div className="text-sm text-muted-foreground">{t('satelliteVerifiedDesc')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{t('euTracesNT')}</div>
                      <div className="text-sm text-muted-foreground">{t('euTracesNTDesc')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GS1 + DPP + QR Code Tracking */}
            <div className="bg-gradient-to-r from-primary/10 via-chart-2/10 to-chart-3/10 border-2 border-primary/30 rounded-3xl p-8 md:p-12">
              <div className="text-center space-y-4 mb-8">
                <div className="inline-flex items-center gap-2 bg-background/80 px-4 py-2 rounded-full">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold">{t('worldsFirstBroker')}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black">
                  {t('gs1DppTracking')}
                </h3>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  {t('gs1DppTrackingDesc')}
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-background/80 rounded-xl p-6 text-center">
                  <div className="text-4xl font-black text-primary mb-2">GS1</div>
                  <div className="text-sm font-semibold">{t('globalBarcode')}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t('globalBarcodeDesc')}</div>
                </div>
                <div className="bg-background/80 rounded-xl p-6 text-center">
                  <div className="text-4xl font-black text-chart-2 mb-2">DPP</div>
                  <div className="text-sm font-semibold">{t('digitalPassport')}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t('digitalPassportDesc')}</div>
                </div>
                <div className="bg-background/80 rounded-xl p-6 text-center">
                  <div className="text-4xl font-black text-chart-3 mb-2">QR</div>
                  <div className="text-sm font-semibold">{t('instantScan')}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t('instantScanDesc')}</div>
                </div>
                <div className="bg-background/80 rounded-xl p-6 text-center">
                  <div className="text-4xl font-black text-chart-4 mb-2">100%</div>
                  <div className="text-sm font-semibold">{t('traceable')}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t('traceableDesc')}</div>
                </div>
              </div>

              <div className="mt-8 bg-background/80 rounded-xl p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-3">{t('howItWorksSteps')}</h4>
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-primary">1.</span>
                        <span>{t('step1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-primary">2.</span>
                        <span>{t('step2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-primary">3.</span>
                        <span>{t('step3')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-primary">4.</span>
                        <span>{t('step4')}</span>
                      </li>
                    </ol>
                  </div>
                  <div className="w-48 h-48 bg-background rounded-xl flex items-center justify-center border-2 border-border">
                    <div className="text-center">
                      <div className="text-6xl mb-2">📱</div>
                      <div className="text-xs text-muted-foreground">{t('scanToVerify')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🚀 LEAD CAPTURE - ENGENHARIA DE ATENÇÃO EXTREMA */}
        <section className="w-full py-20 bg-gradient-to-b from-muted/50 via-background to-muted/50 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-green-500/5 to-orange-500/5" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-orange-500" />
          
          <div className="relative max-w-4xl mx-auto px-6">
            <div className="bg-card/95 backdrop-blur-xl border-2 border-primary/30 rounded-3xl p-8 md:p-12 shadow-2xl hover-elevate transition-all">
              
              {/* 🇺🇸 AMERICAN COMPANY BADGE - TRUST SIGNAL */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-500/30 rounded-full px-4 py-2">
                  <span className="text-2xl">🇺🇸</span>
                  <span className="font-bold text-sm text-blue-700 dark:text-blue-300">{t('usaRegistered')}</span>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/30 border-2 border-orange-500/30 rounded-full px-4 py-2">
                  <span className="text-xl">🌴</span>
                  <span className="font-bold text-sm text-orange-700 dark:text-orange-300">{t('floridaBased')}</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 border-2 border-green-500/30 rounded-full px-4 py-2">
                  <Shield className="w-4 h-4 text-green-700 dark:text-green-300" />
                  <span className="font-bold text-sm text-green-700 dark:text-green-300">{t('samGovId')}</span>
                </div>
              </div>

              {/* 🔥 URGÊNCIA - BADGE */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 border-2 border-yellow-500/40 px-5 py-2 rounded-full mb-6 animate-pulse">
                <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-black text-yellow-700 dark:text-yellow-300">{t('limitedTimeOffer')}</span>
              </div>

              {/* HEADLINE PRINCIPAL */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-6 leading-tight">
                {t('ctaHeadline')}
              </h2>

              {/* SUBHEADLINE COM SOCIAL PROOF */}
              <p className="text-lg md:text-xl text-center text-muted-foreground mb-8 leading-relaxed">
                {t('ctaDescription').replace('{supplierCount}', String(supplierCount))}
              </p>

              {/* LEAD CAPTURE FORM */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
                <input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  className="flex-1 h-14 px-6 rounded-xl border-2 border-input bg-background text-base font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  data-testid="input-lead-email"
                />
                <Button
                  size="lg"
                  className="h-14 px-8 gap-2 font-black text-lg bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-400 hover:to-blue-500 shadow-xl shadow-blue-500/30"
                  data-testid="button-get-started"
                >
                  {t('getStartedFree')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              {/* TRUST SIGNALS - REMOVER FRICÇÃO */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="font-semibold">{t('noCreditCard')}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Leaf className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold">{t('freeCarbonTracking')}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="font-semibold">{t('aiConsultation')}</span>
                </div>
              </div>

              {/* 🔥 SOCIAL PROOF SUBLIMINAR - URGÊNCIA */}
              <div className="bg-gradient-to-r from-muted/50 to-muted/30 border border-border rounded-xl p-4 text-center">
                <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{
                  __html: t('socialProofRecent').replace('{count}', '47').replace('{amount}', '2.3')
                }} />
              </div>
            </div>
          </div>
        </section>

        {/* 📊 STATS SECTION - SOCIAL PROOF EXTREMO */}
        <section className="w-full py-16 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-chart-2/5 to-chart-3/5" />
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="bg-card/80 backdrop-blur-lg border-2 border-primary/20 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="text-center space-y-4 mb-8">
                <div className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
                  $12.4M+
                </div>
                <div className="text-xl md:text-2xl font-bold text-foreground">{t('circularMaterialsTraded')}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl p-6 border border-blue-500/20 hover-elevate transition-all" data-testid="stat-suppliers">
                  <div className="text-5xl md:text-6xl font-black text-blue-600 dark:text-blue-400">{supplierCount}+</div>
                  <div className="text-sm md:text-base font-semibold text-muted-foreground mt-2">{t('verifiedSuppliers')}</div>
                </div>
                <div className="text-center bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl p-6 border border-green-500/20 hover-elevate transition-all" data-testid="stat-countries">
                  <div className="text-5xl md:text-6xl font-black text-green-600 dark:text-green-400">{countries}</div>
                  <div className="text-sm md:text-base font-semibold text-muted-foreground mt-2">{t('countries')}</div>
                </div>
                <div className="text-center bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-2xl p-6 border border-orange-500/20 hover-elevate transition-all" data-testid="stat-frameworks">
                  <div className="text-5xl md:text-6xl font-black text-orange-600 dark:text-orange-400">3</div>
                  <div className="text-sm md:text-base font-semibold text-muted-foreground mt-2">{t('frameworks')}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-4 border">
                  <Recycle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="font-semibold text-sm md:text-base">{t('avgDiscount')}</span>
                </div>
                <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-4 border">
                  <Recycle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="font-semibold text-sm md:text-base">{t('aiMatchSpeed')}</span>
                </div>
                <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-4 border">
                  <Recycle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                  <span className="font-semibold text-sm md:text-base">{t('carbonCredits')}</span>
                </div>
              </div>

              {/* 🔥 URGÊNCIA - MENSAGEM SUBLIMINAR */}
              <div className="bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 border-2 border-yellow-500/30 rounded-2xl p-6 text-center animate-pulse">
                <div className="text-2xl md:text-3xl font-black text-yellow-600 dark:text-yellow-400 mb-2">⚡ Limited Time Offer</div>
                <div className="text-base md:text-lg font-bold text-foreground">First 100 suppliers get free carbon credit tracking</div>
              </div>
            </div>
          </div>
        </section>

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
                Join <span className="font-semibold text-primary">{formatCount(supplierCount)} verified suppliers</span> and buyers using BrokerChain for 
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-muted-foreground space-y-1">
              <div>© 2025 BrokerChain. SPC Member</div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <div className="font-semibold text-foreground">
                  📧 <a href="mailto:contact@brokerchain.business" className="hover:text-primary transition-colors" data-testid="link-contact-email">contact@brokerchain.business</a>
                </div>
                <div className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>SAM.gov: N394AKZSR349</span>
                </div>
              </div>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="mailto:contact@brokerchain.business" className="hover:text-foreground transition-colors font-semibold">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
