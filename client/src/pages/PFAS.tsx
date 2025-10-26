import { Navigation } from "@/components/Navigation";
import { RFQGenerator } from "@/components/RFQGenerator";
import { SupplierCard } from "@/components/SupplierCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, Loader2, Package } from "lucide-react";
import type { Supplier } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import pfasPackaging1 from "@assets/stock_images/compostable_food_pac_dd275d77.jpg";
import pfasPackaging2 from "@assets/stock_images/compostable_food_pac_057a4a06.jpg";
import pfasPackaging3 from "@assets/stock_images/compostable_food_pac_3ae43ab7.jpg";

export default function PFAS() {
  const { t } = useLanguage();
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
                <h1 className="text-4xl font-semibold tracking-tight">{t('pfasPageTitle')}</h1>
                <p className="text-lg text-muted-foreground">
                  {t('pfasPageSubtitle')}
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('pfasSuppliersCount').replace('{count}', '600')}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('pfasCountriesCount').replace('{count}', '10')}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('pfasCertification')}
                </Badge>
              </div>
            </div>
          </div>

          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('theProblem')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {t('pfasProblemText')}
              </p>
              <div className="pt-4 border-t">
                <p className="font-medium mb-3">{t('ourSolution')}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>{t('pfasSolution1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>{t('pfasSolution2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>{t('pfasSolution3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>{t('pfasSolution4')}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Product Gallery - Real Photos */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Package className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">{t('realProductsWeBroker')}</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                {t('pfasProductsTitle')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('pfasProductsSubtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="overflow-hidden hover-elevate transition-all">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img 
                    src={pfasPackaging1} 
                    alt="Compostable food containers" 
                    className="w-full h-full object-cover"
                    data-testid="img-pfas-product-1"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-bold">Compostable Food Containers</h3>
                  <p className="text-sm text-muted-foreground">
                    BPI-certified compostable containers made from plant-based materials. 
                    Perfect for food service operations in CA, WA, NY, and other PFAS-ban states.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">BPI Certified</Badge>
                    <Badge variant="outline" className="text-xs">ASTM D6868</Badge>
                    <Badge variant="outline" className="text-xs">PFAS-Free</Badge>
                  </div>
                  <div className="pt-3 border-t text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume Pricing:</span>
                      <span className="font-semibold">30% below market</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">MOQ:</span>
                      <span className="font-semibold">1,000 units</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover-elevate transition-all">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img 
                    src={pfasPackaging2} 
                    alt="Biodegradable packaging materials" 
                    className="w-full h-full object-cover"
                    data-testid="img-pfas-product-2"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-bold">Biodegradable Film & Wraps</h3>
                  <p className="text-sm text-muted-foreground">
                    Plant-based biodegradable films for wrapping fresh produce and bakery items. 
                    Compliant with SPC guidelines and state-level PFAS regulations.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">TÜV OK Compost</Badge>
                    <Badge variant="outline" className="text-xs">SPC Compliant</Badge>
                    <Badge variant="outline" className="text-xs">Home Compostable</Badge>
                  </div>
                  <div className="pt-3 border-t text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume Pricing:</span>
                      <span className="font-semibold">25% below market</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">MOQ:</span>
                      <span className="font-semibold">500 kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover-elevate transition-all">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img 
                    src={pfasPackaging3} 
                    alt="Recycled packaging materials" 
                    className="w-full h-full object-cover"
                    data-testid="img-pfas-product-3"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-bold">Molded Fiber Packaging</h3>
                  <p className="text-sm text-muted-foreground">
                    Recycled paper pulp molded into protective packaging. 
                    Perfect for electronics, cosmetics, and consumer goods shipping.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">100% Recycled</Badge>
                    <Badge variant="outline" className="text-xs">FSC Certified</Badge>
                    <Badge variant="outline" className="text-xs">Carbon Negative</Badge>
                  </div>
                  <div className="pt-3 border-t text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume Pricing:</span>
                      <span className="font-semibold">35% below market</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">MOQ:</span>
                      <span className="font-semibold">2,000 units</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* RFQ Generator */}
          <RFQGenerator framework="pfas" />

          {/* Certified Suppliers */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">{t('verifiedSuppliersInNetwork')}</h2>
              <p className="text-muted-foreground">
                {t('pfasPageSubtitle')}
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : isError ? (
              <div className="text-center py-16">
                <p className="text-destructive font-medium">{t('errorLoadingSuppliers')}</p>
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
                <p className="text-muted-foreground">{t('noSuppliersFound')}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
