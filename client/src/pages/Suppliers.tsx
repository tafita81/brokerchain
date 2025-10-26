import { Navigation } from "@/components/Navigation";
import { SupplierCard } from "@/components/SupplierCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Loader2 } from "lucide-react";
import type { Supplier } from "@shared/schema";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFramework, setSelectedFramework] = useState<string>("all");

  const { data: allSuppliers = [], isLoading, isError, error } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const filteredSuppliers = allSuppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFramework = selectedFramework === "all" || supplier.framework === selectedFramework;
    return matchesSearch && matchesFramework;
  });

  const stats = {
    total: allSuppliers.length,
    pfas: allSuppliers.filter(s => s.framework === "pfas").length,
    buyamerica: allSuppliers.filter(s => s.framework === "buyamerica").length,
    eudr: allSuppliers.filter(s => s.framework === "eudr").length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight">Supplier Network</h1>
            <p className="text-lg text-muted-foreground">
              Pre-vetted, certified suppliers across all three regulatory frameworks
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <Badge variant="outline" className="gap-2 px-4 py-2">
                <span className="font-mono text-lg">{stats.total}</span>
                <span className="text-muted-foreground">Total Suppliers</span>
              </Badge>
              <Badge variant="outline" className="gap-2 px-4 py-2 bg-primary/5 border-primary/20">
                <span className="font-mono text-lg">{stats.pfas}</span>
                <span className="text-muted-foreground">PFAS/EPR</span>
              </Badge>
              <Badge variant="outline" className="gap-2 px-4 py-2 bg-chart-2/5 border-chart-2/20">
                <span className="font-mono text-lg">{stats.buyamerica}</span>
                <span className="text-muted-foreground">Buy America</span>
              </Badge>
              <Badge variant="outline" className="gap-2 px-4 py-2 bg-chart-3/5 border-chart-3/20">
                <span className="font-mono text-lg">{stats.eudr}</span>
                <span className="text-muted-foreground">EUDR</span>
              </Badge>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-suppliers"
              />
            </div>
            <Select value={selectedFramework} onValueChange={setSelectedFramework}>
              <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-filter-framework">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" data-testid="option-framework-all">All Frameworks</SelectItem>
                <SelectItem value="pfas" data-testid="option-framework-pfas">PFAS/EPR Only</SelectItem>
                <SelectItem value="buyamerica" data-testid="option-framework-buyamerica">Buy America Only</SelectItem>
                <SelectItem value="eudr" data-testid="option-framework-eudr">EUDR Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Suppliers Grid */}
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
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredSuppliers.map((supplier) => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              </div>

              {filteredSuppliers.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No suppliers found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
