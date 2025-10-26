import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, FileText, CheckCircle2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RFQGeneratorProps {
  framework: "pfas" | "buyamerica" | "eudr";
  onGenerate?: (data: any) => void;
}

export function RFQGenerator({ framework, onGenerate }: RFQGeneratorProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    buyerName: "",
    industry: "",
    productType: "",
    quantity: "",
    requirements: "",
  });
  const [generatedRFQ, setGeneratedRFQ] = useState<{ subject: string; content: string } | null>(null);

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("/api/rfqs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          framework,
          ...data,
        }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedRFQ(data.generated);
      toast({
        title: "RFQ Generated Successfully",
        description: "Your AI-powered RFQ has been created.",
      });
      onGenerate?.(data);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate RFQ. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateMutation.mutate(formData);
  };

  const frameworkLabels = {
    pfas: "PFAS/EPR Compliance RFQ",
    buyamerica: "Buy America Compliance RFQ",
    eudr: "EUDR Compliance RFQ",
  };

  return (
    <Card className="w-full" data-testid="card-rfq-generator">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Generate RFQ</CardTitle>
            <CardDescription>
              Create an AI-powered Request for Quote for {frameworkLabels[framework]}
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono">
            {framework.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>Step 1 of 1: Basic Information</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Buyer Name */}
            <div className="space-y-2">
              <Label htmlFor="buyerName">Buyer Company Name</Label>
              <Input
                id="buyerName"
                placeholder="e.g., Chobani Inc."
                value={formData.buyerName}
                onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                required
                data-testid="input-buyer-name"
              />
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger id="industry" data-testid="select-industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food-beverage" data-testid="option-industry-food-beverage">Food & Beverage</SelectItem>
                  <SelectItem value="manufacturing" data-testid="option-industry-manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="agriculture" data-testid="option-industry-agriculture">Agriculture</SelectItem>
                  <SelectItem value="infrastructure" data-testid="option-industry-infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="cosmetics" data-testid="option-industry-cosmetics">Cosmetics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Type */}
            <div className="space-y-2">
              <Label htmlFor="productType">Product/Material Type</Label>
              <Input
                id="productType"
                placeholder="e.g., Compostable food containers"
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                required
                data-testid="input-product-type"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Estimated Quantity</Label>
              <Input
                id="quantity"
                placeholder="e.g., 10,000 units/month"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                data-testid="input-quantity"
              />
            </div>
          </div>

          {/* Special Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Special Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="List any specific compliance requirements, certifications needed, or technical specifications..."
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={4}
              data-testid="textarea-requirements"
            />
          </div>

          {/* Generation Status */}
          {generateMutation.isPending && (
            <div className="p-6 bg-muted/50 rounded-lg border border-dashed space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <p className="text-sm font-medium">Generating AI-powered RFQ...</p>
              </div>
              <p className="text-sm text-muted-foreground">
                ChatGPT 4o mini is analyzing your requirements and creating a professional RFQ with compliance-specific language.
              </p>
            </div>
          )}

          {/* Generated RFQ Preview */}
          {generatedRFQ && !generateMutation.isPending && (
            <div className="p-6 bg-chart-2/5 rounded-lg border space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-chart-2" />
                <p className="text-sm font-semibold">RFQ Generated Successfully</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Subject</p>
                <p className="font-medium">{generatedRFQ.subject}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Content Preview</p>
                <p className="text-sm text-muted-foreground line-clamp-4">{generatedRFQ.content}</p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-4">
          <Button
            type="submit"
            disabled={generateMutation.isPending || !formData.buyerName || !formData.productType}
            className="gap-2"
            data-testid="button-generate-rfq"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Generate RFQ
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                buyerName: "",
                industry: "",
                productType: "",
                quantity: "",
                requirements: "",
              });
              setGeneratedRFQ(null);
            }}
            data-testid="button-reset-form"
          >
            Reset
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
