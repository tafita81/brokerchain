import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Mail, Globe, Filter, Search } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Buyer {
  id: string;
  name: string;
  industry: string;
  country: string;
  framework: string;
  contactEmail: string;
  createdAt: string;
}

export default function Buyers() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  const { data: buyers = [], isLoading } = useQuery<Buyer[]>({
    queryKey: ["/api/buyers"],
  });

  const filteredBuyers = buyers.filter(buyer => {
    const matchesSearch = buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buyer.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buyer.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFramework = !selectedFramework || buyer.framework === selectedFramework;
    return matchesSearch && matchesFramework;
  });

  const getFrameworkColor = (framework: string) => {
    switch (framework.toLowerCase()) {
      case "pfas":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "buyamerica":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "eudr":
        return "bg-amber-500/10 text-amber-700 border-amber-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  const getFrameworkLabel = (framework: string) => {
    switch (framework.toLowerCase()) {
      case "pfas":
        return "PFAS/EPR";
      case "buyamerica":
        return "Buy America";
      case "eudr":
        return "EUDR";
      default:
        return framework.toUpperCase();
    }
  };

  const stats = {
    total: buyers.length,
    pfas: buyers.filter(b => b.framework === "pfas").length,
    buyamerica: buyers.filter(b => b.framework === "buyamerica").length,
    eudr: buyers.filter(b => b.framework === "eudr").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
            Buyer Network
          </h1>
          <p className="text-muted-foreground text-lg" data-testid="text-page-subtitle">
            Real companies seeking compliance-verified suppliers • {stats.total} Active Buyers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover-elevate" data-testid="card-stats-total">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Buyers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All frameworks</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-stats-pfas">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">PFAS/EPR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.pfas}</div>
              <p className="text-xs text-muted-foreground mt-1">Packaging buyers</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-stats-buyamerica">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Buy America</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.buyamerica}</div>
              <p className="text-xs text-muted-foreground mt-1">Federal contracts</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-stats-eudr">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">EUDR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.eudr}</div>
              <p className="text-xs text-muted-foreground mt-1">EU importers</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search buyers by name, industry, or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-buyers"
                  />
                </div>
              </div>

              {/* Framework Filters */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedFramework === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFramework(null)}
                  data-testid="button-filter-all"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  All ({stats.total})
                </Button>
                <Button
                  variant={selectedFramework === "pfas" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFramework("pfas")}
                  data-testid="button-filter-pfas"
                >
                  PFAS ({stats.pfas})
                </Button>
                <Button
                  variant={selectedFramework === "buyamerica" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFramework("buyamerica")}
                  data-testid="button-filter-buyamerica"
                >
                  Buy America ({stats.buyamerica})
                </Button>
                <Button
                  variant={selectedFramework === "eudr" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFramework("eudr")}
                  data-testid="button-filter-eudr"
                >
                  EUDR ({stats.eudr})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buyers Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading buyers...</p>
          </div>
        ) : filteredBuyers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No buyers found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuyers.map((buyer) => (
              <Card key={buyer.id} className="hover-elevate" data-testid={`card-buyer-${buyer.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg leading-tight flex-1">
                      {buyer.name}
                    </CardTitle>
                    <Badge 
                      className={`${getFrameworkColor(buyer.framework)} text-xs shrink-0`}
                      data-testid={`badge-framework-${buyer.framework}`}
                    >
                      {getFrameworkLabel(buyer.framework)}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {buyer.industry}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground truncate">{buyer.country}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a 
                      href={`mailto:${buyer.contactEmail}`}
                      className="text-primary hover:underline truncate"
                      data-testid={`link-email-${buyer.id}`}
                    >
                      {buyer.contactEmail}
                    </a>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(buyer.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <Button 
                    className="w-full mt-2" 
                    variant="outline"
                    data-testid={`button-contact-${buyer.id}`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send RFQ
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!isLoading && filteredBuyers.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredBuyers.length} of {buyers.length} buyers
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
