import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Flag, Leaf } from "lucide-react";
import { Link } from "wouter";

const frameworks = [
  {
    id: "pfas",
    title: "PFAS & EPR Compliance",
    icon: Shield,
    description: "PFAS-free packaging solutions for US food service. Over 20 states have banned PFAS in food packaging. Our certified suppliers ensure full compliance with state regulations.",
    metrics: ["600+ Suppliers", "14 Countries", "100% PFAS-Free"],
    certifications: ["BPI Certified", "ASTM D6868", "SPC Aligned"],
    color: "text-primary",
    bgColor: "bg-primary/10",
    link: "/pfas",
  },
  {
    id: "buyamerica",
    title: "Buy America Act",
    icon: Flag,
    description: "100% melted and manufactured in USA components for federal contracts. End-to-end metallurgical traceability from foundry to finished product.",
    metrics: ["10,000+ Contracts", "ISO 9001", "Zero Offshore"],
    certifications: ["IATF 16949", "Buy America Proof", "SAM.gov Verified"],
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    link: "/buy-america",
  },
  {
    id: "eudr",
    title: "EUDR Compliance",
    icon: Leaf,
    description: "Deforestation-free agricultural commodities for EU imports. Satellite-verified geofencing and Digital Product Passports for every shipment.",
    metrics: ["500+ Importers", "Polygon-Level GPS", "FSC/PEFC"],
    certifications: ["EU TRACES NT", "Rainforest Alliance", "Zero Deforestation"],
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    link: "/eudr",
  },
];

export function RegulatoryFrameworks() {
  return (
    <section className="w-full py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">The Compliance Trifecta</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three Regulations. One Verified Global Chain.
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
                    {framework.metrics.map((metric) => (
                      <Badge key={metric} variant="secondary" className="font-mono text-xs font-medium" data-testid={`badge-metric-${metric.toLowerCase().replace(/\s+/g, '-')}`}>
                        {metric}
                      </Badge>
                    ))}
                  </div>

                  {/* Certifications */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Certifications
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
                      Explore
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
