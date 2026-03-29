import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CheckSquare,
  FileText,
  Headphones,
  Package,
  Plus,
} from "lucide-react";
import { useGetAllInventory } from "../hooks/useQueries";

export function OperationsModule() {
  const { data: inventory = [] } = useGetAllInventory();

  const stats = [
    { label: "Meetings Today", value: "0", icon: Calendar },
    {
      label: "Inventory Items",
      value: inventory.length.toString(),
      icon: Package,
    },
    { label: "Pending Tasks", value: "0", icon: CheckSquare },
    { label: "Open Tickets", value: "0", icon: Headphones },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Operations Management
          </h2>
          <p className="text-muted-foreground mt-2">
            Meetings, tasks, inventory, notes, and customer support
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Quick Add
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
      <Tabs defaultValue="meetings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="support">Customer Support</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Calendar</CardTitle>
              <CardDescription>Schedule and manage meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Meeting calendar coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>
                Track stock levels and movements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inventory.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No inventory items tracked.
                </p>
              ) : (
                <div className="space-y-3">
                  {inventory.map(([location, quantity]) => (
                    <div
                      key={location}
                      className="p-4 border rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{location}</p>
                        <p className="text-sm text-muted-foreground">
                          Location
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {quantity.toString()}
                        </p>
                        <p className="text-xs text-muted-foreground">units</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Scheduler</CardTitle>
              <CardDescription>Create and track tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Task management coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notes Manager</CardTitle>
              <CardDescription>Create and organize notes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Notes system coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Support</CardTitle>
              <CardDescription>Manage support tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Support ticketing coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
