import { Navigation } from "@/components/Navigation";
import { RFQGenerator } from "@/components/RFQGenerator";
import { SupplierCard } from "@/components/SupplierCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, CheckCircle2, MapPin, Loader2 } from "lucide-react";
import type { Supplier } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

export default function EUDR() {
  const { data: suppliers = [], isLoading, isError, error } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers", { framework: "eudr" }],
    queryFn: async () => {
      const response = await fetch("/api/suppliers?framework=eudr");
      if (!response.ok) throw new Error("Failed to fetch suppliers");
      return response.json();
    },
  });
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-chart-3" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight">EUDR Compliance</h1>
                <p className="text-lg text-muted-foreground">
                  Deforestation-free agricultural commodities for EU
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-chart-3/5 text-chart-3 border-chart-3/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  500+ EU Importers
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-chart-3/5 text-chart-3 border-chart-3/20 gap-2">
                  <MapPin className="w-4 h-4" />
                  Polygon-Level GPS
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-chart-3/5 text-chart-3 border-chart-3/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  FSC/PEFC Certified
                </Badge>
              </div>
            </div>
          </div>

          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>The Problem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                As of December 2024, EU Regulation 2023/1115 (EUDR) requires all coffee, soy, palm oil, wood, 
                cocoa, rubber, and cattle imports to prove no deforestation occurred after December 31, 2020 - 
                verified down to the polygon level with geospatial coordinates.
              </p>
              <div className="pt-4 border-t">
                <p className="font-medium mb-3">Our Solution:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>Satellite-verified geofencing of every farm plot using Sentinel-2 imagery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>Dynamic Digital Product Passport (DPP) in PDF format with embedded geocoordinates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>Integration with EU TRACES NT and national competent authorities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>Complete chain-of-custody documentation with FSC/PEFC certifications</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* RFQ Generator */}
          <RFQGenerator framework="eudr" />

          {/* Certified Suppliers */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Certified Suppliers</h2>
              <p className="text-muted-foreground">
                EUDR-compliant suppliers with satellite-verified deforestation-free proof
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : isError ? (
              <div className="text-center py-16">
                <p className="text-destructive font-medium">Failed to load suppliers</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {error instanceof Error ? error.message : "An unexpected error occurred"}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {suppliers.map((supplier) => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              </div>
            )}

            {!isLoading && !isError && suppliers.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No EUDR suppliers available at this time.</p>
              </div>
            )}
          </div>

          {/* Digital Product Passport Info */}
          <Card className="bg-gradient-to-br from-chart-3/5 to-chart-3/10 border-chart-3/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-chart-3" />
                Digital Product Passport (DPP)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every EUDR shipment includes a Digital Product Passport with:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-1.5" />
                  <span>Polygon coordinates of origin farm plots</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-1.5" />
                  <span>Satellite verification date and imagery reference</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-1.5" />
                  <span>Harvest date and land-use history</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-1.5" />
                  <span>Chain-of-custody documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-1.5" />
                  <span>FSC/PEFC/Rainforest Alliance certifications</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
