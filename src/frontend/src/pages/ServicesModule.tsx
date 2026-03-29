import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Clock, Plus, Wrench } from "lucide-react";
import { Variant_pending_completed_inProgress } from "../backend";
import {
  useGetAllServiceRequests,
  useGetServiceRequestsByStatus,
} from "../hooks/useQueries";

export function ServicesModule() {
  const { data: allRequests = [], isLoading } = useGetAllServiceRequests();
  const { data: pendingRequests = [] } = useGetServiceRequestsByStatus(
    Variant_pending_completed_inProgress.pending,
  );
  const { data: inProgressRequests = [] } = useGetServiceRequestsByStatus(
    Variant_pending_completed_inProgress.inProgress,
  );
  const { data: completedRequests = [] } = useGetServiceRequestsByStatus(
    Variant_pending_completed_inProgress.completed,
  );

  const stats = [
    {
      label: "Total Requests",
      value: allRequests.length.toString(),
      icon: Wrench,
    },
    { label: "Pending", value: pendingRequests.length.toString(), icon: Clock },
    {
      label: "In Progress",
      value: inProgressRequests.length.toString(),
      icon: AlertCircle,
    },
    {
      label: "Completed",
      value: completedRequests.length.toString(),
      icon: CheckCircle,
    },
  ];

  const getStatusBadge = (status: Variant_pending_completed_inProgress) => {
    switch (status) {
      case Variant_pending_completed_inProgress.pending:
        return <Badge variant="outline">Pending</Badge>;
      case Variant_pending_completed_inProgress.inProgress:
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case Variant_pending_completed_inProgress.completed:
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getServiceTypeLabel = (serviceType: any) => {
    if (typeof serviceType === "object" && serviceType !== null) {
      const key = Object.keys(serviceType)[0];
      return key === "other" ? serviceType.other : key;
    }
    return "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Services Management
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage service requests, scheduling, and technician assignments
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Service Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Service Requests</CardTitle>
              <CardDescription>
                Complete list of service requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : allRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No service requests yet. Create your first one!
                </p>
              ) : (
                <div className="space-y-3">
                  {allRequests.map((request) => (
                    <div
                      key={request.id.toString()}
                      className="p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              Request #{request.id.toString()}
                            </p>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {request.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span>Customer: {request.customer}</span>
                            <span>
                              Type: {getServiceTypeLabel(request.serviceType)}
                            </span>
                            <span>
                              Date:{" "}
                              {new Date(
                                Number(request.dateRequested) / 1000000,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>
                Service requests awaiting assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No pending requests
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id.toString()}
                      className="p-4 border rounded-lg"
                    >
                      <p className="font-medium">
                        Request #{request.id.toString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inProgress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>In Progress</CardTitle>
              <CardDescription>Active service requests</CardDescription>
            </CardHeader>
            <CardContent>
              {inProgressRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No requests in progress
                </p>
              ) : (
                <div className="space-y-3">
                  {inProgressRequests.map((request) => (
                    <div
                      key={request.id.toString()}
                      className="p-4 border rounded-lg"
                    >
                      <p className="font-medium">
                        Request #{request.id.toString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Requests</CardTitle>
              <CardDescription>Service history</CardDescription>
            </CardHeader>
            <CardContent>
              {completedRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No completed requests
                </p>
              ) : (
                <div className="space-y-3">
                  {completedRequests.map((request) => (
                    <div
                      key={request.id.toString()}
                      className="p-4 border rounded-lg"
                    >
                      <p className="font-medium">
                        Request #{request.id.toString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Schedule</CardTitle>
              <CardDescription>
                Calendar view of scheduled services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Service scheduling calendar coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
