import { Navigation } from "@/components/Navigation";
import { RFQGenerator } from "@/components/RFQGenerator";
import { SupplierCard } from "@/components/SupplierCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flag, CheckCircle2, Loader2 } from "lucide-react";
import type { Supplier } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

export default function BuyAmerica() {
  const { data: suppliers = [], isLoading, isError, error } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers", { framework: "buyamerica" }],
    queryFn: async () => {
      const response = await fetch("/api/suppliers?framework=buyamerica");
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
              <div className="w-16 h-16 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <Flag className="w-8 h-8 text-chart-2" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight">Buy America Act Compliance</h1>
                <p className="text-lg text-muted-foreground">
                  100% melted and manufactured in USA components
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-chart-2/5 text-chart-2 border-chart-2/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  10,000+ Contracts
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-chart-2/5 text-chart-2 border-chart-2/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  ISO 9001 Certified
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-chart-2/5 text-chart-2 border-chart-2/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Zero Offshore Subcontracting
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
                Federal contracts require 100% "melted and manufactured in USA" components per the Buy America Act 
                (41 U.S.C. § 8301–8305). Most suppliers lack verifiable origin proof and proper documentation.
              </p>
              <div className="pt-4 border-t">
                <p className="font-medium mb-3">Our Solution:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>End-to-end metallurgical traceability from foundry to finished fastener</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>IATF 16949 & ISO 9001 certified production facilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>Real-time audit logs of furnace batches, casting dates, and machining records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>Zero tolerance for offshore subcontracting or foreign materials</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* RFQ Generator */}
          <RFQGenerator framework="buyamerica" />

          {/* Certified Suppliers */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Certified Suppliers</h2>
              <p className="text-muted-foreground">
                Buy America Act compliant manufacturers with full traceability
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
                <p className="text-muted-foreground">No Buy America suppliers available at this time.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
