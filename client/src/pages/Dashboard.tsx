import { Navigation } from "@/components/Navigation";
import { MetricsCard } from "@/components/MetricsCard";
import { ContentGenerator } from "@/components/ContentGenerator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Send, CheckCircle2, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="max-w-screen-2xl mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Manage RFQs, generate content, and monitor compliance metrics
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricsCard
              title="Active RFQs"
              value="47"
              trend={{ value: 12, isPositive: true }}
              subtitle="18 sent this week"
            />
            <MetricsCard
              title="Content Generated"
              value="134"
              trend={{ value: 23, isPositive: true }}
              subtitle="Across 14 countries"
            />
            <MetricsCard
              title="Suppliers Connected"
              value="28"
              subtitle="PFAS, Buy America, EUDR"
            />
            <MetricsCard
              title="Lead Captures"
              value="89"
              trend={{ value: 31, isPositive: true }}
              subtitle="This month"
            />
          </div>

          {/* Content Generator */}
          <ContentGenerator />

          {/* Recent Activity */}
          <Card data-testid="card-recent-activity">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest RFQs and content generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    type: "RFQ",
                    title: "PFAS-Free Packaging for Food Service",
                    status: "sent",
                    time: "2 hours ago",
                    icon: Send,
                  },
                  {
                    id: 2,
                    type: "Content",
                    title: "SEO Article: Supplements for USA Market",
                    status: "completed",
                    time: "5 hours ago",
                    icon: FileText,
                  },
                  {
                    id: 3,
                    type: "RFQ",
                    title: "Buy America Compliant Fasteners",
                    status: "responded",
                    time: "1 day ago",
                    icon: CheckCircle2,
                  },
                  {
                    id: 4,
                    type: "Content",
                    title: "SEO Article: Skincare for Brazil Market",
                    status: "pending",
                    time: "1 day ago",
                    icon: Clock,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const statusColors = {
                    sent: "bg-primary/10 text-primary",
                    completed: "bg-chart-2/10 text-chart-2",
                    responded: "bg-chart-3/10 text-chart-3",
                    pending: "bg-muted text-muted-foreground",
                  };

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover-elevate transition-all"
                      data-testid={`activity-item-${item.id}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.time}</p>
                      </div>
                      <Badge className={statusColors[item.status as keyof typeof statusColors]} variant="outline">
                        {item.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6">
                <Button variant="outline" className="w-full" data-testid="button-view-all-activity">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
