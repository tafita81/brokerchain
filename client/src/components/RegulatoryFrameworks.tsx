import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Flag, Leaf, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useStats, formatCount } from "@/hooks/use-stats";
import { useLanguage } from "@/contexts/LanguageContext";

export function RegulatoryFrameworks() {
  const { data: stats, isLoading } = useStats();
  const { t } = useLanguage();

  const frameworks = [
    {
      id: "pfas",
      title: t('pfasFreeCompliance'),
      icon: Shield,
      description: t('pfasFreePackagingDesc'),
      getMetrics: () => stats ? [
        t('suppliersCount', { count: formatCount(stats.suppliers.pfas) }),
        t('countries') + ': ' + stats.countries,
        t('pfasFree')
      ] : [t('loadingStats')],
      certifications: [t('bpiCertified'), t('astmD6868'), t('spcAligned')],
      color: "text-primary",
      bgColor: "bg-primary/10",
      link: "/pfas",
    },
    {
      id: "buyamerica",
      title: t('buyAmericaActTitle'),
      icon: Flag,
      description: t('buyAmericaActDesc'),
      getMetrics: () => stats ? [
        t('contractsCount', { count: formatCount(stats.buyers.buyamerica) }),
        t('iso9001'),
        t('zeroOffshore')
      ] : [t('loadingStats')],
      certifications: [t('iatf16949'), t('buyAmericaProof'), t('samGovRegistration')],
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      link: "/buy-america",
    },
    {
      id: "eudr",
      title: t('eudrComplianceTitle'),
      icon: Leaf,
      description: t('eudrComplianceDesc'),
      getMetrics: () => stats ? [
        t('importersCount', { count: formatCount(stats.buyers.eudr) }),
        t('polygonLevelGPS'),
        t('fscPefc')
      ] : [t('loadingStats')],
      certifications: [t('euTracesNT'), t('rainforestAlliance'), t('zeroDeforestation')],
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      link: "/eudr",
    },
  ];
  return (
    <section className="w-full py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">{t('complianceTrifecta')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('threeRegulationsOneChain')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {frameworks.map((framework) => {
            const Icon = framework.icon;
            return (
              <Card key={framework.id} className="hover-elevate transition-all" data-testid={`card-framework-${framework.id}`}>
                <CardHeader className="space-y-4">
                  <div className={`w-16 h-16 rounded-lg ${framework.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 ${framework.color}`} />
                  </div>
                  <CardTitle className="text-xl">{framework.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {framework.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="flex flex-wrap gap-2">
                    {isLoading ? (
                      <Badge variant="secondary" className="font-mono text-xs font-medium">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Loading stats...
                      </Badge>
                    ) : (
                      framework.getMetrics().map((metric) => (
                        <Badge key={metric} variant="secondary" className="font-mono text-xs font-medium" data-testid={`badge-metric-${metric.toLowerCase().replace(/\s+/g, '-')}`}>
                          {metric}
                        </Badge>
                      ))
                    )}
                  </div>

                  {/* Certifications */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t('certifications')}
                    </p>
                    <div className="space-y-1">
                      {framework.certifications.map((cert) => (
                        <div key={cert} className="text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Link href={framework.link} className="w-full" data-testid={`link-explore-${framework.id}`}>
                    <Button variant="outline" className="w-full gap-2" data-testid={`button-explore-${framework.id}`}>
                      {t('explore')}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
