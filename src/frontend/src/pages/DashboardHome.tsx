import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  BarChart3,
  ClipboardList,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { useGetCallerUserProfile } from "../hooks/useQueries";

type ModuleType =
  | "sales"
  | "services"
  | "logistics"
  | "financial"
  | "employees"
  | "operations"
  | "bi";

interface DashboardHomeProps {
  onNavigate: (path: string) => void;
  onOpenModule?: (module: ModuleType) => void;
}

export function DashboardHome({
  onNavigate,
  onOpenModule,
}: DashboardHomeProps) {
  const { data: userProfile } = useGetCallerUserProfile();

  const moduleCards = [
    {
      id: "sales" as ModuleType,
      title: "Sales & CRM",
      description: "Manage leads, pipeline, opportunities, and quotes",
      icon: ShoppingCart,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      id: "services" as ModuleType,
      title: "Services",
      description: "Service requests, scheduling, and technician management",
      icon: Wrench,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      id: "logistics" as ModuleType,
      title: "Logistics",
      description: "Shipment tracking, delivery scheduling, and inventory",
      icon: Truck,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      id: "financial" as ModuleType,
      title: "Financial",
      description: "Payments, accounting, tax management, and budgets",
      icon: DollarSign,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      id: "employees" as ModuleType,
      title: "HR & Employees",
      description: "Employee directory, time tracking, and performance",
      icon: Users,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
    {
      id: "operations" as ModuleType,
      title: "Operations",
      description: "Meetings, tasks, notes, inventory, and support",
      icon: ClipboardList,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      id: "bi" as ModuleType,
      title: "Business Intelligence",
      description: "Analytics, reports, KPIs, and automation insights",
      icon: BarChart3,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ];

  const quickStats = [
    {
      label: "Active Projects",
      value: "12",
      icon: Package,
      trend: "+3 this week",
    },
    {
      label: "Pending Tasks",
      value: "24",
      icon: AlertCircle,
      trend: "8 due today",
    },
    {
      label: "Revenue Growth",
      value: "+18%",
      icon: TrendingUp,
      trend: "vs last month",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back{userProfile ? `, ${userProfile.businessName}` : ""}!
        </h2>
        <p className="text-muted-foreground mt-2">
          Your complete business automation and management platform
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Module Cards */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Business Modules</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {moduleCards.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() =>
                  onOpenModule
                    ? onOpenModule(module.id)
                    : onNavigate("/dashboard")
                }
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${module.bgColor}`}>
                      <Icon className={`h-6 w-6 ${module.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {module.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="w-full">
                    Open Module →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Getting Started */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Explore the powerful features of Agenda Automation Station
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="p-1.5 rounded bg-primary/10">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Track your sales pipeline</p>
              <p className="text-xs text-muted-foreground">
                Manage leads and close deals faster
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="p-1.5 rounded bg-primary/10">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">
                Monitor business intelligence
              </p>
              <p className="text-xs text-muted-foreground">
                Get insights and automated recommendations
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="p-1.5 rounded bg-primary/10">
              <Truck className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">
                Optimize logistics operations
              </p>
              <p className="text-xs text-muted-foreground">
                Track shipments and manage inventory
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
