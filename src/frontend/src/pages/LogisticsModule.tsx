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
import { MapPin, Package, Plus, Truck, Warehouse } from "lucide-react";
import { Variant_pending_inTransit_delivered } from "../backend";
import { useGetAllInventory, useGetAllShipments } from "../hooks/useQueries";

export function LogisticsModule() {
  const { data: shipments = [], isLoading: shipmentsLoading } =
    useGetAllShipments();
  const { data: inventory = [], isLoading: inventoryLoading } =
    useGetAllInventory();

  const pendingShipments = shipments.filter(
    (s) => s.status === Variant_pending_inTransit_delivered.pending,
  );
  const inTransitShipments = shipments.filter(
    (s) => s.status === Variant_pending_inTransit_delivered.inTransit,
  );
  const _deliveredShipments = shipments.filter(
    (s) => s.status === Variant_pending_inTransit_delivered.delivered,
  );

  const stats = [
    {
      label: "Total Shipments",
      value: shipments.length.toString(),
      icon: Truck,
    },
    {
      label: "In Transit",
      value: inTransitShipments.length.toString(),
      icon: MapPin,
    },
    {
      label: "Inventory Locations",
      value: inventory.length.toString(),
      icon: Warehouse,
    },
    {
      label: "Pending",
      value: pendingShipments.length.toString(),
      icon: Package,
    },
  ];

  const getStatusBadge = (status: Variant_pending_inTransit_delivered) => {
    switch (status) {
      case Variant_pending_inTransit_delivered.pending:
        return <Badge variant="outline">Pending</Badge>;
      case Variant_pending_inTransit_delivered.inTransit:
        return <Badge className="bg-blue-500">In Transit</Badge>;
      case Variant_pending_inTransit_delivered.delivered:
        return <Badge className="bg-green-500">Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Logistics Management
          </h2>
          <p className="text-muted-foreground mt-2">
            Track shipments, manage inventory, and optimize delivery routes
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Shipment
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
      <Tabs defaultValue="shipments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="fulfillment">Order Fulfillment</TabsTrigger>
        </TabsList>

        <TabsContent value="shipments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Tracking</CardTitle>
              <CardDescription>
                Monitor all shipments and deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shipmentsLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading shipments...
                </p>
              ) : shipments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No shipments yet. Create your first shipment!
                </p>
              ) : (
                <div className="space-y-3">
                  {shipments.map((shipment) => (
                    <div
                      key={shipment.id.toString()}
                      className="p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              Shipment #{shipment.id.toString()}
                            </p>
                            {getStatusBadge(shipment.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {shipment.contents}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span>From: {shipment.origin}</span>
                            <span>To: {shipment.destination}</span>
                            <span>Method: {shipment.shippingMethod}</span>
                            <span>Price: ${shipment.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Track
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Inventory</CardTitle>
              <CardDescription>
                Stock levels across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inventoryLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading inventory...
                </p>
              ) : inventory.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No inventory tracked yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {inventory.map(([location, quantity]) => (
                    <div
                      key={location}
                      className="p-4 border rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Warehouse className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{location}</p>
                          <p className="text-sm text-muted-foreground">
                            Warehouse Location
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {quantity.toString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          units in stock
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Routes</CardTitle>
              <CardDescription>
                Optimize delivery schedules and routes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Route optimization coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fulfillment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Fulfillment</CardTitle>
              <CardDescription>Connect orders to shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Order fulfillment workflow coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
