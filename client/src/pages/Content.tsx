import { Navigation } from "@/components/Navigation";
import { ContentGenerator } from "@/components/ContentGenerator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe, TrendingUp } from "lucide-react";

export default function Content() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">AI Content Generation</h1>
                <p className="text-muted-foreground mt-1">
                  ChatGPT 4o mini powered SEO content for Amazon OneLink in 10 countries
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Supported Countries</CardTitle>
                <Globe className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10</div>
                <p className="text-xs text-muted-foreground mt-1">
                  USA, Brazil, China, Australia, Indonesia, Singapore, Netherlands, Switzerland, Ivory Coast, Nigeria
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Model</CardTitle>
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ChatGPT 4o mini</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Multilingual content with SEO optimization
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Optimization</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">SEO + Conversion</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Amazon OneLink integration included
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
              <CardDescription>
                Automated content generation for Amazon affiliate marketing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Multilingual</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Generate content in English, Portuguese, Spanish, French, German, Italian, Japanese, and more
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">SEO Optimized</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    1,500-2,000 word articles with natural keyword integration for organic traffic
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Amazon OneLink</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatic product link generation for 14 Amazon marketplaces worldwide
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Conversion Focused</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Persuasive content designed to drive clicks and affiliate conversions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Generator */}
          <ContentGenerator />
        </div>
      </main>
    </div>
  );
}
