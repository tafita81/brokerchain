import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [isPopulating, setIsPopulating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handlePopulate = async () => {
    try {
      setIsPopulating(true);
      setResult(null);

      toast({
        title: "Starting database population",
        description: "This will take several minutes as we fetch 700+ real companies via OpenAI...",
      });

      //  🔒 Include admin token for authentication
      const adminToken = prompt("Enter admin token to populate database:");
      if (!adminToken) {
        throw new Error("Admin token required");
      }

      const res = await fetch("/api/admin/populate", {
        method: "POST",
        headers: {
          "X-Admin-Token": adminToken,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Population failed");
      }

      const response = await res.json();

      setResult(response);

      toast({
        title: "✅ Success!",
        description: `Database populated with ${response.stats.total} companies (100% compliance validated)`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "❌ Population Failed",
        description: error.message,
      });
      setResult({ success: false, error: error.message });
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Database management and population tools</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6" />
              Populate Database with Real Companies
            </CardTitle>
            <CardDescription>
              Fetch 700+ verified companies (100% compliance validated) across PFAS, Buy America, EUDR, and Secondary Materials frameworks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
              <div className="font-semibold">What this does:</div>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Generates 120+ suppliers per framework via OpenAI (PFAS, Buy America, EUDR, Secondary)</li>
                <li>Generates 120+ buyers per framework with RFQ portal information</li>
                <li>Validates 100% COMPLIANCE with respective legislation before insertion</li>
                <li>Only accepts real companies that supply to Fortune 500 (Walmart, Nestlé, etc.)</li>
              </ul>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 space-y-2 text-sm">
              <div className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Compliance Requirements
              </div>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>PFAS:</strong> BPI certified, zero PFAS substances, state-level compliance (CA AB 1200, ME LD 1541)</li>
                <li><strong>Buy America:</strong> 100% USA manufacturing, SAM.gov registered, metallurgical traceability</li>
                <li><strong>EUDR:</strong> Zero deforestation after 2020-12-31, GPS coordinates, satellite verification</li>
                <li><strong>Secondary:</strong> ISO certified, verified surplus, chain of custody documentation</li>
              </ul>
            </div>

            <Button
              onClick={handlePopulate}
              disabled={isPopulating}
              size="lg"
              className="w-full"
              data-testid="button-populate-database"
            >
              {isPopulating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Populating Database... (this takes 3-5 minutes)
                </>
              ) : (
                <>
                  <Database className="w-5 h-5 mr-2" />
                  Populate Database with 700+ Companies
                </>
              )}
            </Button>

            {result && (
              <div
                className={`rounded-lg p-4 ${
                  result.success
                    ? "bg-green-500/10 border border-green-500/30"
                    : "bg-red-500/10 border border-red-500/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold mb-2">
                      {result.success ? "✅ Database Populated Successfully!" : "❌ Population Failed"}
                    </div>
                    {result.success && result.stats && (
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>✓ Suppliers added: {result.stats.suppliersAdded}</div>
                        <div>✓ Buyers added: {result.stats.buyersAdded}</div>
                        <div>✓ Total companies: {result.stats.total}</div>
                      </div>
                    )}
                    {!result.success && result.error && (
                      <div className="text-sm text-red-600 dark:text-red-400 mt-2">
                        {result.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
