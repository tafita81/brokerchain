import { Navigation } from "@/components/Navigation";
import { RFQTable } from "@/components/RFQTable";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSearch, Loader2, Shield, Flag, Leaf, RefreshCw } from "lucide-react";
import type { RFQWithDetails } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function AdminRFQs() {
  const [activeTab, setActiveTab] = useState("all");

  const { data: allRfqs = [], isLoading: allLoading, isError: allError, refetch: refetchAll } = useQuery<RFQWithDetails[]>({
    queryKey: ["/api/rfqs"],
    queryFn: async () => {
      const response = await fetch("/api/rfqs");
      if (!response.ok) throw new Error("Failed to fetch RFQs");
      return response.json();
    },
    retry: 2,
  });

  const { data: pfasRfqs = [], isLoading: pfasLoading, isError: pfasError, refetch: refetchPfas } = useQuery<RFQWithDetails[]>({
    queryKey: ["/api/rfqs", { framework: "pfas" }],
    queryFn: async () => {
      const response = await fetch("/api/rfqs?framework=pfas");
      if (!response.ok) throw new Error("Failed to fetch PFAS RFQs");
      return response.json();
    },
    retry: 2,
  });

  const { data: buyamericaRfqs = [], isLoading: buyamericaLoading, isError: buyamericaError, refetch: refetchBuyAmerica } = useQuery<RFQWithDetails[]>({
    queryKey: ["/api/rfqs", { framework: "buyamerica" }],
    queryFn: async () => {
      const response = await fetch("/api/rfqs?framework=buyamerica");
      if (!response.ok) throw new Error("Failed to fetch Buy America RFQs");
      return response.json();
    },
    retry: 2,
  });

  const { data: eudrRfqs = [], isLoading: eudrLoading, isError: eudrError, refetch: refetchEudr } = useQuery<RFQWithDetails[]>({
    queryKey: ["/api/rfqs", { framework: "eudr" }],
    queryFn: async () => {
      const response = await fetch("/api/rfqs?framework=eudr");
      if (!response.ok) throw new Error("Failed to fetch EUDR RFQs");
      return response.json();
    },
    retry: 2,
  });

  const handleRefresh = () => {
    refetchAll();
    refetchPfas();
    refetchBuyAmerica();
    refetchEudr();
  };

  const isLoading = allLoading || pfasLoading || buyamericaLoading || eudrLoading;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileSearch className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-semibold tracking-tight">SAM.gov RFQs</h1>
                  <p className="text-lg text-muted-foreground">
                    Federal procurement opportunities automatically captured
                  </p>
                </div>
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="gap-2"
                disabled={isLoading}
                data-testid="button-refresh-rfqs"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 gap-2">
                <FileSearch className="w-4 h-4" />
                Total: {allRfqs.length}
              </Badge>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 gap-2">
                <Shield className="w-4 h-4" />
                PFAS: {pfasRfqs.length}
              </Badge>
              <Badge variant="outline" className="bg-chart-2/5 text-chart-2 border-chart-2/20 gap-2">
                <Flag className="w-4 h-4" />
                Buy America: {buyamericaRfqs.length}
              </Badge>
              <Badge variant="outline" className="bg-chart-3/5 text-chart-3 border-chart-3/20 gap-2">
                <Leaf className="w-4 h-4" />
                EUDR: {eudrRfqs.length}
              </Badge>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList data-testid="tabs-framework-filter">
              <TabsTrigger value="all" data-testid="tab-all">
                All RFQs ({allRfqs.length})
              </TabsTrigger>
              <TabsTrigger value="pfas" data-testid="tab-pfas">
                <Shield className="w-4 h-4 mr-2" />
                PFAS ({pfasRfqs.length})
              </TabsTrigger>
              <TabsTrigger value="buyamerica" data-testid="tab-buyamerica">
                <Flag className="w-4 h-4 mr-2" />
                Buy America ({buyamericaRfqs.length})
              </TabsTrigger>
              <TabsTrigger value="eudr" data-testid="tab-eudr">
                <Leaf className="w-4 h-4 mr-2" />
                EUDR ({eudrRfqs.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {allError ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-destructive font-medium">Failed to load RFQs</p>
                    <p className="text-sm text-muted-foreground mt-2">Please try refreshing the page</p>
                    <Button onClick={() => refetchAll()} className="mt-4" variant="outline" data-testid="button-retry-all">
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              ) : allLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : allRfqs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileSearch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No RFQs captured yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      SAM.gov scraper runs automatically every 6 hours
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <RFQTable rfqs={allRfqs} />
              )}
            </TabsContent>

            <TabsContent value="pfas" className="mt-6">
              {pfasError ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-destructive font-medium">Failed to load PFAS RFQs</p>
                    <Button onClick={() => refetchPfas()} className="mt-4" variant="outline" data-testid="button-retry-pfas">
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              ) : pfasLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : pfasRfqs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">No PFAS RFQs captured yet</p>
                  </CardContent>
                </Card>
              ) : (
                <RFQTable rfqs={pfasRfqs} />
              )}
            </TabsContent>

            <TabsContent value="buyamerica" className="mt-6">
              {buyamericaError ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-destructive font-medium">Failed to load Buy America RFQs</p>
                    <Button onClick={() => refetchBuyAmerica()} className="mt-4" variant="outline" data-testid="button-retry-buyamerica">
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              ) : buyamericaLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : buyamericaRfqs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Flag className="w-12 h-12 text-chart-2 mx-auto mb-4" />
                    <p className="text-muted-foreground">No Buy America RFQs captured yet</p>
                  </CardContent>
                </Card>
              ) : (
                <RFQTable rfqs={buyamericaRfqs} />
              )}
            </TabsContent>

            <TabsContent value="eudr" className="mt-6">
              {eudrError ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-destructive font-medium">Failed to load EUDR RFQs</p>
                    <Button onClick={() => refetchEudr()} className="mt-4" variant="outline" data-testid="button-retry-eudr">
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              ) : eudrLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : eudrRfqs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Leaf className="w-12 h-12 text-chart-3 mx-auto mb-4" />
                    <p className="text-muted-foreground">No EUDR RFQs captured yet</p>
                  </CardContent>
                </Card>
              ) : (
                <RFQTable rfqs={eudrRfqs} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
