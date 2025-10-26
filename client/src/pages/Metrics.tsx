import { Navigation } from "@/components/Navigation";
import { MetricsCard } from "@/components/MetricsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function Metrics() {
  const [timeRange, setTimeRange] = useState("30d");

  const frameworkData = [
    { name: "PFAS/EPR", value: 547, color: "bg-primary", percentage: 44 },
    { name: "Buy America", value: 458, color: "bg-chart-2", percentage: 37 },
    { name: "EUDR", value: 242, color: "bg-chart-3", percentage: 19 },
  ];

  const countryData = [
    { name: "USA", rfqs: 487, color: "bg-primary" },
    { name: "Brazil", rfqs: 156, color: "bg-chart-2" },
    { name: "Germany", rfqs: 123, color: "bg-chart-3" },
    { name: "UK", rfqs: 98, color: "bg-chart-4" },
    { name: "Canada", rfqs: 76, color: "bg-chart-5" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="max-w-screen-2xl mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">Metrics Dashboard</h1>
              <p className="text-lg text-muted-foreground">
                Real-time compliance and operational analytics
              </p>
            </div>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px]" data-testid="select-time-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d" data-testid="option-time-7d">Last 7 days</SelectItem>
                <SelectItem value="30d" data-testid="option-time-30d">Last 30 days</SelectItem>
                <SelectItem value="90d" data-testid="option-time-90d">Last 90 days</SelectItem>
                <SelectItem value="1y" data-testid="option-time-1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricsCard
              title="Total RFQs Issued"
              value="1,247"
              trend={{ value: 18, isPositive: true }}
              subtitle="Across all frameworks"
            />
            <MetricsCard
              title="Response Rate"
              value="71%"
              trend={{ value: 5, isPositive: true }}
              subtitle="892 verified responses"
            />
            <MetricsCard
              title="Success Rate"
              value="35%"
              trend={{ value: 3, isPositive: true }}
              subtitle="312 closed transactions"
            />
            <MetricsCard
              title="Avg Response Time"
              value="4.2d"
              trend={{ value: 12, isPositive: false }}
              subtitle="Time to first response"
            />
          </div>

          {/* By Framework */}
          <Card data-testid="card-metrics-by-framework">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    RFQs by Regulatory Framework
                  </CardTitle>
                  <CardDescription>Distribution across compliance domains</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {frameworkData.map((framework) => (
                <div key={framework.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{framework.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-muted-foreground">{framework.percentage}%</span>
                      <span className="font-mono font-semibold w-16 text-right">{framework.value}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${framework.color} transition-all`}
                      style={{ width: `${framework.percentage}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold font-mono">547</p>
                  <p className="text-xs text-muted-foreground">PFAS/EPR</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold font-mono">458</p>
                  <p className="text-xs text-muted-foreground">Buy America</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold font-mono">242</p>
                  <p className="text-xs text-muted-foreground">EUDR</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* By Country */}
            <Card data-testid="card-metrics-by-country">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Top Countries
                </CardTitle>
                <CardDescription>RFQ volume by country</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {countryData.map((country, index) => (
                  <div key={country.name} className="flex items-center gap-4">
                    <div className="w-8 text-center">
                      <span className="text-lg font-bold font-mono text-muted-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{country.name}</span>
                        <span className="font-mono font-semibold">{country.rfqs}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${country.color} transition-all`}
                          style={{ width: `${(country.rfqs / 487) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Content Generation Stats */}
            <Card data-testid="card-content-stats">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Content Generation
                </CardTitle>
                <CardDescription>SEO content across 10 countries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Articles</p>
                    <p className="text-3xl font-bold font-mono">134</p>
                    <div className="flex items-center gap-2 text-sm text-chart-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">+23%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Avg Words</p>
                    <p className="text-3xl font-bold font-mono">1,847</p>
                    <p className="text-sm text-muted-foreground">per article</p>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <p className="text-sm font-medium">Top Niches</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Supplements (47)</Badge>
                    <Badge variant="secondary">Skincare (38)</Badge>
                    <Badge variant="secondary">Fitness (29)</Badge>
                    <Badge variant="secondary">Wellness (20)</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <p className="text-sm font-medium">Languages Generated</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">English</Badge>
                    <Badge variant="outline">Portuguese</Badge>
                    <Badge variant="outline">Spanish</Badge>
                    <Badge variant="outline">French</Badge>
                    <Badge variant="outline">German</Badge>
                    <Badge variant="outline">Italian</Badge>
                    <Badge variant="outline">Japanese</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Supplier Network</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-bold font-mono">28</p>
                  <p className="text-sm text-muted-foreground mt-1">Verified Suppliers</p>
                </div>
                <div className="pt-4 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PFAS/EPR</span>
                    <span className="font-mono font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buy America</span>
                    <span className="font-mono font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EUDR</span>
                    <span className="font-mono font-medium">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Digital Passports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-bold font-mono">87</p>
                  <p className="text-sm text-muted-foreground mt-1">DPPs Generated</p>
                </div>
                <div className="pt-4 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EUDR Coffee</span>
                    <span className="font-mono font-medium">52</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EUDR Cellulose</span>
                    <span className="font-mono font-medium">35</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lead Captures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-bold font-mono">89</p>
                  <p className="text-sm text-muted-foreground mt-1">Email Subscribers</p>
                </div>
                <div className="pt-4 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conversion Rate</span>
                    <span className="font-mono font-medium">12.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="font-mono font-medium text-chart-2">+31%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
