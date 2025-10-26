import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { COUNTRIES } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ContentGeneratorProps {
  onGenerate?: (data: any) => void;
}

const NICHES = ["supplements", "skincare", "fitness", "wellness", "sustainable-packaging"];

export function ContentGenerator({ onGenerate }: ContentGeneratorProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    niche: "",
    country: "USA",
    keywords: "",
  });

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const keywords = data.keywords.split(',').map((k: string) => k.trim()).filter(Boolean);
      const response = await apiRequest("POST", "/api/content/generate", {
        niche: data.niche,
        country: data.country,
        keywords,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Content Generation Started",
        description: "ChatGPT 4o mini is creating your SEO-optimized content.",
      });
      onGenerate?.(data);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateMutation.mutate(formData);
  };

  return (
    <Card className="w-full" data-testid="card-content-generator">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">SEO Content Generator</CardTitle>
            <CardDescription>
              Generate multilingual SEO content optimized for Amazon OneLink
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-2">
            <Sparkles className="w-3 h-3" />
            AI-Powered
          </Badge>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Niche Selection */}
            <div className="space-y-2">
              <Label htmlFor="niche">Content Niche</Label>
              <Select
                value={formData.niche}
                onValueChange={(value) => setFormData({ ...formData, niche: value })}
              >
                <SelectTrigger id="niche" data-testid="select-niche">
                  <SelectValue placeholder="Select niche" />
                </SelectTrigger>
                <SelectContent>
                  {NICHES.map((niche) => (
                    <SelectItem key={niche} value={niche} data-testid={`option-niche-${niche}`}>
                      {niche.charAt(0).toUpperCase() + niche.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country Selection */}
            <div className="space-y-2">
              <Label htmlFor="country">Target Country</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => setFormData({ ...formData, country: value })}
              >
                <SelectTrigger id="country" data-testid="select-content-country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country} data-testid={`option-content-country-${country.toLowerCase()}`}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Target Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              placeholder="e.g., organic supplements, vitamin d3, immune support"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              data-testid="input-keywords"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Leave blank for AI to suggest keywords
            </p>
          </div>

          {/* Generation Status */}
          {generateMutation.isPending && (
            <div className="p-6 bg-primary/5 rounded-lg border space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <p className="text-sm font-medium">Generating SEO-optimized content...</p>
              </div>
              <p className="text-sm text-muted-foreground">
                ChatGPT 4o mini is creating multilingual content with Amazon OneLink integration.
              </p>
            </div>
          )}

          {generateMutation.isSuccess && !generateMutation.isPending && (
            <div className="p-6 bg-chart-2/5 rounded-lg border space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-chart-2" />
                <p className="text-sm font-semibold">Content Generation Started</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Your content is being generated in the background. Check the Dashboard for updates.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-4">
          <Button
            type="submit"
            disabled={generateMutation.isPending || !formData.niche}
            className="gap-2"
            data-testid="button-generate-content"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Content
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                niche: "",
                country: "USA",
                keywords: "",
              });
            }}
          >
            Reset
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
