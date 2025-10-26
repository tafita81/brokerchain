import { Navigation } from "@/components/Navigation";
import { RFQGenerator } from "@/components/RFQGenerator";
import { SupplierCard } from "@/components/SupplierCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, CheckCircle2, MapPin, Loader2, Package } from "lucide-react";
import type { Supplier } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import eudrCommodity1 from "@assets/stock_images/coffee_beans_cocoa_a_31b0e462.jpg";
import eudrCommodity2 from "@assets/stock_images/coffee_beans_cocoa_a_1671c66c.jpg";
import eudrCommodity3 from "@assets/stock_images/coffee_beans_cocoa_a_06d27b41.jpg";

export default function EUDR() {
  const { t } = useLanguage();
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
                <h1 className="text-4xl font-semibold tracking-tight">{t('eudrPageTitle')}</h1>
                <p className="text-lg text-muted-foreground">
                  {t('eudrPageSubtitle')}
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-chart-3/5 text-chart-3 border-chart-3/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('eudrImportersCount').replace('{count}', '500')}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-chart-3/5 text-chart-3 border-chart-3/20 gap-2">
                  <MapPin className="w-4 h-4" />
                  {t('eudrGpsTracking')}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-chart-3/5 text-chart-3 border-chart-3/20 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('eudrCertification')}
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
                {t('eudrProblemText')}
              </p>
              <div className="pt-4 border-t">
                <p className="font-medium mb-3">{t('ourSolution')}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>{t('eudrSolution1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>{t('eudrSolution2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>{t('eudrSolution3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>{t('eudrSolution4')}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Product Gallery - Real Photos */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-chart-3/10 px-4 py-2 rounded-full">
                <Package className="w-5 h-5 text-chart-3" />
                <span className="text-sm font-semibold text-chart-3">{t('realProductsWeBroker')}</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                {t('eudrProductsTitle')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('eudrProductsSubtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="overflow-hidden hover-elevate transition-all">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img 
                    src={eudrCommodity1} 
                    alt="Sustainable coffee beans" 
                    className="w-full h-full object-cover"
                    data-testid="img-eudr-product-1"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-bold">Deforestation-Free Coffee</h3>
                  <p className="text-sm text-muted-foreground">
                    Arabica and Robusta coffee beans from verified farms in Brazil, Colombia, and Vietnam. 
                    Every batch includes polygon-level GPS coordinates and Sentinel-2 satellite verification.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">GPS Verified</Badge>
                    <Badge variant="outline" className="text-xs">FSC Certified</Badge>
                    <Badge variant="outline" className="text-xs">EU TRACES NT</Badge>
                  </div>
                  <div className="pt-3 border-t text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume Pricing:</span>
                      <span className="font-semibold">Competitive</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">MOQ:</span>
                      <span className="font-semibold">1 container (20MT)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover-elevate transition-all">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img 
                    src={eudrCommodity2} 
                    alt="Sustainable cocoa beans" 
                    className="w-full h-full object-cover"
                    data-testid="img-eudr-product-2"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-bold">Traced Cocoa Beans</h3>
                  <p className="text-sm text-muted-foreground">
                    Premium cocoa from Ivory Coast, Ghana, and Ecuador with complete chain-of-custody. 
                    Each shipment includes Digital Product Passport with farm plot coordinates.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Rainforest Alliance</Badge>
                    <Badge variant="outline" className="text-xs">DPP Included</Badge>
                    <Badge variant="outline" className="text-xs">Zero Deforestation</Badge>
                  </div>
                  <div className="pt-3 border-t text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume Pricing:</span>
                      <span className="font-semibold">Market rate</span>
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
                    src={eudrCommodity3} 
                    alt="Sustainable palm oil" 
                    className="w-full h-full object-cover"
                    data-testid="img-eudr-product-3"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-bold">RSPO Palm Oil</h3>
                  <p className="text-sm text-muted-foreground">
                    Certified sustainable palm oil from Indonesia and Malaysia. 
                    RSPO-certified with full satellite monitoring and zero deforestation proof.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">RSPO Certified</Badge>
                    <Badge variant="outline" className="text-xs">Satellite Tracked</Badge>
                    <Badge variant="outline" className="text-xs">EUDR Compliant</Badge>
                  </div>
                  <div className="pt-3 border-t text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume Pricing:</span>
                      <span className="font-semibold">Negotiable</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">MOQ:</span>
                      <span className="font-semibold">25 MT</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* RFQ Generator */}
          <RFQGenerator framework="eudr" />

          {/* Certified Suppliers */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">{t('verifiedSuppliersInNetwork')}</h2>
              <p className="text-muted-foreground">
                {t('eudrPageSubtitle')}
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
