import { useState, useEffect } from "react";
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
import { Loader2, Send, FileText, CheckCircle2, Sparkles, Zap, TrendingUp, Clock, Award } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Import product images
import pfasProduct1 from "@assets/stock_images/compostable_food_pac_dd275d77.jpg";
import pfasProduct2 from "@assets/stock_images/compostable_food_pac_3ae43ab7.jpg";
import pfasProduct3 from "@assets/stock_images/sustainable_packagin_e77be9fd.jpg";

import buyamericaProduct1 from "@assets/stock_images/steel_manufacturing__9b6afee0.jpg";
import buyamericaProduct2 from "@assets/stock_images/industrial_manufactu_cb33623d.jpg";
import buyamericaProduct3 from "@assets/stock_images/steel_manufacturing__2a1691e0.jpg";

import eudrProduct1 from "@assets/stock_images/coffee_beans_cocoa_a_31b0e462.jpg";
import eudrProduct2 from "@assets/stock_images/agricultural_commodi_65d8217e.jpg";
import eudrProduct3 from "@assets/stock_images/coffee_beans_cocoa_a_1671c66c.jpg";

interface RFQGeneratorProps {
  framework: "pfas" | "buyamerica" | "eudr";
  onGenerate?: (data: any) => void;
}

const frameworkProducts = {
  pfas: [
    { image: pfasProduct1, name: "Compostable Bowls & Containers" },
    { image: pfasProduct2, name: "PFAS-Free Food Packaging" },
    { image: pfasProduct3, name: "Sustainable Fiber Packaging" },
  ],
  buyamerica: [
    { image: buyamericaProduct1, name: "100% USA Steel Pipes" },
    { image: buyamericaProduct2, name: "Domestic Metal Components" },
    { image: buyamericaProduct3, name: "American-Made Industrial Parts" },
  ],
  eudr: [
    { image: eudrProduct1, name: "Deforestation-Free Coffee" },
    { image: eudrProduct2, name: "Traced Agricultural Commodities" },
    { image: eudrProduct3, name: "GPS-Verified Cocoa Beans" },
  ],
};

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
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Auto-rotate product carousel
  useEffect(() => {
    const products = frameworkProducts[framework];
    const interval = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % products.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [framework]);

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/rfqs/generate", {
        framework,
        ...data,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedRFQ(data.generated);
      toast({
        title: "🎉 RFQ Generated Successfully!",
        description: "Your AI-powered professional RFQ is ready to send.",
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
    pfas: "PFAS/EPR Compliance",
    buyamerica: "Buy America Act",
    eudr: "EU Deforestation Regulation",
  };

  const frameworkColors = {
    pfas: "from-blue-500 to-cyan-500",
    buyamerica: "from-green-500 to-emerald-500",
    eudr: "from-orange-500 to-amber-500",
  };

  const frameworkBgColors = {
    pfas: "bg-blue-500/10",
    buyamerica: "bg-green-500/10",
    eudr: "bg-orange-500/10",
  };

  const frameworkBorderColors = {
    pfas: "border-blue-500/30",
    buyamerica: "border-green-500/30",
    eudr: "border-orange-500/30",
  };

  const frameworkTextColors = {
    pfas: "text-blue-600 dark:text-blue-400",
    buyamerica: "text-green-600 dark:text-green-400",
    eudr: "text-orange-600 dark:text-orange-400",
  };

  const currentProduct = frameworkProducts[framework][currentProductIndex];

  return (
    <div className="space-y-6">
      {/* 🎯 ATTENTION-GRABBING HEADER WITH PRODUCT CAROUSEL */}
      <div className={`relative overflow-hidden rounded-2xl p-8 border-2 ${frameworkBorderColors[framework]} ${frameworkBgColors[framework]}`}>
        <div className="absolute inset-0 bg-gradient-to-br opacity-5" style={{ backgroundImage: `linear-gradient(135deg, currentColor 0%, transparent 100%)` }}></div>
        
        <div className="relative grid lg:grid-cols-[1fr,auto] gap-8 items-start">
          {/* Left: Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${frameworkColors[framework]} shadow-lg`}>
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <Badge variant="outline" className={`font-mono text-sm ${frameworkTextColors[framework]} border-current`}>
                  {framework.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                Get Instant <span className={`bg-gradient-to-r ${frameworkColors[framework]} bg-clip-text text-transparent`}>FREE</span> RFQ
              </h2>
              <p className="text-xl text-muted-foreground font-medium">
                AI-Powered {frameworkLabels[framework]} Request in <span className="font-bold text-foreground">30 Seconds</span>
              </p>
            </div>

            {/* 🏆 TRUST INDICATORS */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Instant Generation</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Award className="w-5 h-5 text-purple-500" />
                <span>ChatGPT 4o mini Powered</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>98% Response Rate</span>
              </div>
            </div>
          </div>

          {/* Right: Product Carousel */}
          <div className="hidden lg:block">
            <div className="relative w-80 h-80 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
              {/* Product Image with fade transition */}
              <div className="absolute inset-0 transition-opacity duration-1000">
                <img 
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>

              {/* Product Name Label */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="space-y-2">
                  <Badge className={`bg-gradient-to-r ${frameworkColors[framework]} text-white border-0 text-xs font-bold`}>
                    AVAILABLE NOW
                  </Badge>
                  <h3 className="text-2xl font-black text-white leading-tight drop-shadow-lg">
                    {currentProduct.name}
                  </h3>
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="absolute top-4 right-4 flex gap-1.5">
                {frameworkProducts[framework].map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentProductIndex 
                        ? 'bg-white w-8' 
                        : 'bg-white/30 w-1.5'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 ENHANCED FORM */}
      <Card className="w-full border-2 shadow-xl" data-testid="card-rfq-generator">
        <CardHeader className="pb-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Takes only 30 seconds • 100% FREE</span>
              </div>
              <CardTitle className="text-3xl font-bold">Complete Your Information</CardTitle>
              <CardDescription className="text-base">
                Fill in the details below and our AI will create a <strong>professional, compliance-ready RFQ</strong>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            {/* Step Indicator - ENHANCED */}
            <div className={`flex items-center gap-3 p-4 rounded-xl border-2 ${frameworkBorderColors[framework]} ${frameworkBgColors[framework]}`}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${frameworkColors[framework]} text-white font-bold text-lg shadow-lg`}>
                1
              </div>
              <div>
                <p className="font-bold text-lg">Basic Information</p>
                <p className="text-sm text-muted-foreground">Tell us about your requirements</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Buyer Name - ENHANCED */}
              <div className="space-y-3">
                <Label htmlFor="buyerName" className="text-base font-bold flex items-center gap-2">
                  Your Company Name
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="buyerName"
                  placeholder="e.g., Tesla Inc."
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  required
                  className="h-12 text-lg border-2"
                  data-testid="input-buyer-name"
                />
                <p className="text-xs text-muted-foreground">We'll use this in your professional RFQ</p>
              </div>

              {/* Industry - ENHANCED */}
              <div className="space-y-3">
                <Label htmlFor="industry" className="text-base font-bold">
                  Industry Sector
                </Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger id="industry" className="h-12 text-lg border-2" data-testid="select-industry">
                    <SelectValue placeholder="Choose your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food-beverage" data-testid="option-industry-food-beverage">🍔 Food & Beverage</SelectItem>
                    <SelectItem value="manufacturing" data-testid="option-industry-manufacturing">🏭 Manufacturing</SelectItem>
                    <SelectItem value="agriculture" data-testid="option-industry-agriculture">🌾 Agriculture</SelectItem>
                    <SelectItem value="infrastructure" data-testid="option-industry-infrastructure">🏗️ Infrastructure</SelectItem>
                    <SelectItem value="cosmetics" data-testid="option-industry-cosmetics">💄 Cosmetics</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Helps us match you with certified suppliers</p>
              </div>

              {/* Product Type - ENHANCED */}
              <div className="space-y-3">
                <Label htmlFor="productType" className="text-base font-bold flex items-center gap-2">
                  Product/Material Needed
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="productType"
                  placeholder="e.g., 100% recycled steel pipes"
                  value={formData.productType}
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                  required
                  className="h-12 text-lg border-2"
                  data-testid="input-product-type"
                />
                <p className="text-xs text-muted-foreground">Be specific for better supplier matches</p>
              </div>

              {/* Quantity - ENHANCED */}
              <div className="space-y-3">
                <Label htmlFor="quantity" className="text-base font-bold">
                  Estimated Volume
                </Label>
                <Input
                  id="quantity"
                  placeholder="e.g., 50,000 units/month"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="h-12 text-lg border-2"
                  data-testid="input-quantity"
                />
                <p className="text-xs text-muted-foreground">Suppliers love clear volume commitments</p>
              </div>
            </div>

            {/* Special Requirements - ENHANCED */}
            <div className="space-y-3">
              <Label htmlFor="requirements" className="text-base font-bold">
                Special Compliance Requirements
              </Label>
              <Textarea
                id="requirements"
                placeholder="List certifications, compliance standards, technical specs, delivery timelines, or any special requests..."
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={5}
                className="text-base border-2 resize-none"
                data-testid="textarea-requirements"
              />
              <p className="text-xs text-muted-foreground">
                💡 <strong>Pro tip:</strong> Mention specific certifications (ISO, FSC, etc.) for faster responses
              </p>
            </div>

            {/* Generation Status - ENHANCED */}
            {generateMutation.isPending && (
              <div className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-primary/30 space-y-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <p className="text-xl font-bold">🤖 AI is crafting your perfect RFQ...</p>
                </div>
                <div className="space-y-2">
                  <p className="text-base text-muted-foreground">
                    ✨ Analyzing compliance requirements for {frameworkLabels[framework]}
                  </p>
                  <p className="text-base text-muted-foreground">
                    📝 Writing professional procurement language
                  </p>
                  <p className="text-base text-muted-foreground">
                    🎯 Matching you with 600+ verified suppliers
                  </p>
                </div>
              </div>
            )}

            {/* Generated RFQ Preview - ENHANCED */}
            {generatedRFQ && !generateMutation.isPending && (
              <div className="p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-2xl border-2 border-green-500/30 space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">✅ Your RFQ is Ready!</p>
                    <p className="text-sm text-muted-foreground">Professional, compliance-ready, and ready to send</p>
                  </div>
                </div>
                
                <div className="space-y-4 p-6 bg-background rounded-xl border">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Subject Line</p>
                    <p className="text-lg font-bold">{generatedRFQ.subject}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">RFQ Content Preview</p>
                    <p className="text-base text-muted-foreground leading-relaxed line-clamp-6">{generatedRFQ.content}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <p className="text-sm font-semibold">
                    This RFQ will be sent to <span className="text-blue-600">matching verified suppliers</span> in your area
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button
              type="submit"
              disabled={generateMutation.isPending || !formData.buyerName || !formData.productType}
              className={`w-full sm:flex-1 h-14 text-lg font-bold gap-3 bg-gradient-to-r ${frameworkColors[framework]} hover:opacity-90 shadow-xl transition-all hover:scale-105`}
              data-testid="button-generate-rfq"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Your RFQ...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Generate FREE RFQ Now
                  <Send className="w-5 h-5" />
                </>
              )}
            </Button>
            {generatedRFQ && (
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
                className="h-14 text-base border-2"
                data-testid="button-reset-form"
              >
                Start New RFQ
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>

      {/* 🔥 URGENCY + SOCIAL PROOF */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl border-2 bg-card hover-elevate transition-all">
          <div className="text-4xl font-black text-primary mb-2">30s</div>
          <p className="font-semibold mb-1">Instant Generation</p>
          <p className="text-sm text-muted-foreground">Get your professional RFQ in seconds, not hours</p>
        </div>
        <div className="p-6 rounded-xl border-2 bg-card hover-elevate transition-all">
          <div className="text-4xl font-black text-green-600 mb-2">98%</div>
          <p className="font-semibold mb-1">Response Rate</p>
          <p className="text-sm text-muted-foreground">Suppliers respond fast to our AI-optimized RFQs</p>
        </div>
        <div className="p-6 rounded-xl border-2 bg-card hover-elevate transition-all">
          <div className="text-4xl font-black text-orange-600 mb-2">600+</div>
          <p className="font-semibold mb-1">Verified Suppliers</p>
          <p className="text-sm text-muted-foreground">Instant access to certified compliance partners</p>
        </div>
      </div>
    </div>
  );
}
