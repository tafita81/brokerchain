import { Navigation } from "@/components/Navigation";
import { RFQGenerator } from "@/components/RFQGenerator";
import { SupplierCard } from "@/components/SupplierCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, Loader2 } from "lucide-react";
import type { Supplier } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

export default function PFAS() {
  const { data: suppliers = [], isLoading, isError, error } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers", { framework: "pfas" }],
    queryFn: async () => {
      const response = await fetch("/api/suppliers?framework=pfas");
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
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight">PFAS & EPR Compliance</h1>
                <p className="text-lg text-muted-foreground">
                  PFAS-free packaging solutions for US food service
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  600+ Suppliers
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  10 Countries
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  100% PFAS-Free
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
                Over 20 U.S. states have banned PFAS (per- and polyfluoroalkyl substances) in food packaging. 
                Non-compliant suppliers risk recalls, fines, and brand destruction.
              </p>
              <div className="pt-4 border-t">
                <p className="font-medium mb-3">Our Solution:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>Certified PFAS-free packaging from audited global manufacturers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>Full alignment with Sustainable Packaging Coalition (SPC) standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>Real-time material traceability: bio-based resins, molded fiber, bagasse, starch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>Live Digital Product Passport generation with chemical composition logs</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* RFQ Generator */}
          <RFQGenerator framework="pfas" />

          {/* Certified Suppliers */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Certified Suppliers</h2>
              <p className="text-muted-foreground">
                Pre-vetted suppliers with full PFAS-free certifications
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
                <p className="text-muted-foreground">No PFAS/EPR suppliers available at this time.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
