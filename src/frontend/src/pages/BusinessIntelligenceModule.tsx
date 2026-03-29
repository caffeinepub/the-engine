import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  BarChart3,
  FileText,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

export function BusinessIntelligenceModule() {
  const kpis = [
    { label: "Overall Performance", value: "87%", icon: Target, trend: "+5%" },
    { label: "Efficiency Score", value: "92%", icon: Activity, trend: "+3%" },
    { label: "Growth Rate", value: "+18%", icon: TrendingUp, trend: "YoY" },
    { label: "Automation Rate", value: "76%", icon: Zap, trend: "+12%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Business Intelligence
        </h2>
        <p className="text-muted-foreground mt-2">
          Analytics, insights, and automated workflow intelligence
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">{kpi.trend}</span>{" "}
                  improvement
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">KPI Dashboard</TabsTrigger>
          <TabsTrigger value="agents">Workflow Agents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="ratios">Financial Ratios</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>
                Real-time business metrics across all modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Sales Performance
                      </span>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">$284K</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pipeline value
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Service Efficiency
                      </span>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">94%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Completion rate
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Automation Agents</CardTitle>
              <CardDescription>
                AI-powered insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg bg-accent/5">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        Sales Opportunity Detected
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        3 leads in your pipeline are ready for follow-up based
                        on engagement patterns
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-accent/5">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Inventory Alert</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Low stock detected at 2 warehouse locations. Reorder
                        recommended.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>
                Generate reports across all business modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Report generator coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Ratio Analysis</CardTitle>
              <CardDescription>Key financial health metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Financial ratio analysis coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Metrics</CardTitle>
              <CardDescription>
                System usage and capacity planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Infrastructure monitoring coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
