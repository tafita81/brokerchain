import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail } from "lucide-react";
import type { Supplier } from "@shared/schema";

interface SupplierCardProps {
  supplier: Supplier;
  onContact?: (supplier: Supplier) => void;
}

export function SupplierCard({ supplier, onContact }: SupplierCardProps) {
  const frameworkColors: Record<string, string> = {
    pfas: "bg-primary/10 text-primary border-primary/20",
    buyamerica: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    eudr: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  };

  const certifications = Array.isArray(supplier.certifications) ? supplier.certifications : [];
  const products = Array.isArray(supplier.products) ? supplier.products : [];

  return (
    <Card className="hover-elevate transition-all h-full flex flex-col" data-testid={`card-supplier-${supplier.id}`}>
      <CardHeader className="space-y-4">
        {/* Supplier Icon/Initial */}
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
          <span className="text-lg font-semibold text-muted-foreground">
            {supplier.name.charAt(0)}
          </span>
        </div>

        <div className="space-y-2">
          <CardTitle className="text-xl" data-testid={`text-supplier-name-${supplier.id}`}>
            {supplier.name}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{supplier.country}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 flex-1">
        {/* Framework Badge */}
        <div>
          <Badge 
            className={frameworkColors[supplier.framework] || "bg-muted"} 
            variant="outline"
            data-testid={`badge-framework-${supplier.framework}`}
          >
            {supplier.framework.toUpperCase()}
          </Badge>
        </div>

        {/* Description */}
        {supplier.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {supplier.description}
          </p>
        )}

        {/* Products */}
        {products.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Products
            </p>
            <div className="flex flex-wrap gap-2">
              {products.slice(0, 3).map((product: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {product}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Certifications
            </p>
            <div className="space-y-1">
              {certifications.slice(0, 3).map((cert: string, idx: number) => (
                <div key={idx} className="text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                  {cert}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {supplier.contactEmail && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => onContact?.(supplier)}
            data-testid={`button-contact-${supplier.id}`}
          >
            <Mail className="w-4 h-4" />
            Contact Supplier
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
