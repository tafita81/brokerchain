import { Navigation } from "@/components/Navigation";
import { RFQGenerator } from "@/components/RFQGenerator";
import { SupplierCard } from "@/components/SupplierCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flag, CheckCircle2, Loader2, Package } from "lucide-react";
import type { Supplier } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import steelProduct1 from "@assets/stock_images/steel_manufacturing__9228c3fd.jpg";
import steelProduct2 from "@assets/stock_images/steel_manufacturing__9b6afee0.jpg";
import steelProduct3 from "@assets/stock_images/steel_manufacturing__2a1691e0.jpg";

export default function BuyAmerica() {
  const { t } = useLanguage();
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
                <h1 className="text-4xl font-semibold tracking-tight">{t('buyAmericaPageTitle')}</h1>
                <p className="text-lg text-muted-foreground">
                  {t('buyAmericaPageSubtitle')}
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-chart-2/5 text-chart-2 border-chart-2/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('buyAmericaContractsCount').replace('{count}', '10,000')}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-chart-2/5 text-chart-2 border-chart-2/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('buyAmericaCertification')}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-chart-2/5 text-chart-2 border-chart-2/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('buyAmericaNoOffshore')}
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
                {t('buyAmericaProblemText')}
              </p>
              <div className="pt-4 border-t">
                <p className="font-medium mb-3">{t('ourSolution')}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>{t('buyAmericaSolution1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>{t('buyAmericaSolution2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>{t('buyAmericaSolution3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>{t('buyAmericaSolution4')}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Product Gallery - Real Photos */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-chart-2/10 px-4 py-2 rounded-full">
                <Package className="w-5 h-5 text-chart-2" />
                <span className="text-sm font-semibold text-chart-2">{t('realProductsWeBroker')}</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                {t('buyAmericaProductsTitle')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('buyAmericaProductsSubtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="overflow-hidden hover-elevate transition-all">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img 
                    src={steelProduct1} 
                    alt="American-made steel components" 
                    className="w-full h-full object-cover"
                    data-testid="img-buyamerica-product-1"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-bold">Domestic Steel Bars & Rods</h3>
                  <p className="text-sm text-muted-foreground">
                    100% US-melted steel bars for construction and infrastructure projects. 
                    Full metallurgical traceability from Nucor, US Steel, and Steel Dynamics mills.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">SAM.gov Verified</Badge>
                    <Badge variant="outline" className="text-xs">IATF 16949</Badge>
                    <Badge variant="outline" className="text-xs">100% USA Origin</Badge>
                  </div>
                  <div className="pt-3 border-t text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume Pricing:</span>
                      <span className="font-semibold">Market competitive</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">MOQ:</span>
                      <span className="font-semibold">5 metric tons</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover-elevate transition-all">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img 
                    src={steelProduct2} 
                    alt="Aerospace fasteners and components" 
                    className="w-full h-full object-cover"
                    data-testid="img-buyamerica-product-2"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-bold">Aerospace Fasteners</h3>
                  <p className="text-sm text-muted-foreground">
                    Precision fasteners for aerospace and defense applications. 
                    AS9100 certified with full batch traceability and chemical composition documentation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">AS9100</Badge>
                    <Badge variant="outline" className="text-xs">DFARS Compliant</Badge>
                    <Badge variant="outline" className="text-xs">No Foreign Content</Badge>
                  </div>
                  <div className="pt-3 border-t text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume Pricing:</span>
                      <span className="font-semibold">Volume discounts</span>
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
                    src={steelProduct3} 
                    alt="Automotive components made in USA" 
                    className="w-full h-full object-cover"
                    data-testid="img-buyamerica-product-3"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-bold">Automotive Stampings</h3>
                  <p className="text-sm text-muted-foreground">
                    Precision metal stampings for automotive and heavy equipment. 
                    IATF 16949 certified with zero offshore subcontracting.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">IATF 16949</Badge>
                    <Badge variant="outline" className="text-xs">ISO 9001</Badge>
                    <Badge variant="outline" className="text-xs">Made in USA</Badge>
                  </div>
                  <div className="pt-3 border-t text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume Pricing:</span>
                      <span className="font-semibold">Negotiable</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">MOQ:</span>
                      <span className="font-semibold">Custom tooling required</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* RFQ Generator */}
          <RFQGenerator framework="buyamerica" />

          {/* Certified Suppliers */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">{t('verifiedSuppliersInNetwork')}</h2>
              <p className="text-muted-foreground">
                {t('buyAmericaPageSubtitle')}
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
