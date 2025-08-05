
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Route, Plus, Calculator, MapPin, Truck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NetworkMap, { Node as MapNode, Route as MapRoute } from "@/components/NetworkMap";

interface RouteNode {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  demand?: number;
  timeWindow?: { start: number; end: number };
}

interface Vehicle {
  id: string;
  capacity: number;
  startLocation: string;
  endLocation: string;
}

interface RouteSolution {
  routes: Array<{
    vehicleId: string;
    nodes: string[];
    distance: number;
    load: number;
  }>;
  totalDistance: number;
  totalCost: number;
}

const RouteOptimization = () => {
  const [nodes, setNodes] = useState<RouteNode[]>([
    { id: "depot", name: "Depot", type: "depot", latitude: -1.2921, longitude: 36.8219 },
    { id: "c1", name: "Customer 1", type: "customer", latitude: -1.3, longitude: 36.9, demand: 20 },
    { id: "c2", name: "Customer 2", type: "customer", latitude: -1.1, longitude: 36.7, demand: 15 }
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: "v1", capacity: 100, startLocation: "depot", endLocation: "depot" }
  ]);

  const [solution, setSolution] = useState<RouteSolution | null>(null);
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  const optimizeRoutes = () => {
    // Simple heuristic for demonstration
    // In practice, this would use sophisticated routing algorithms
    const routes = [{
      vehicleId: "v1",
      nodes: ["depot", "c1", "c2", "depot"],
      distance: 150,
      load: 35
    }];

    const routeSolution: RouteSolution = {
      routes,
      totalDistance: 150,
      totalCost: 750
    };

    setSolution(routeSolution);

    toast({
      title: "Routes Optimized",
      description: "Vehicle routes have been optimized successfully.",
    });
  };

  // Convert to map format with proper types
  const mapNodes: MapNode[] = nodes.map(node => ({
    id: node.id,
    name: node.name,
    type: node.type,
    latitude: node.latitude,
    longitude: node.longitude,
    weight: node.demand || 0
  }));

  const mapRoutes: MapRoute[] = solution ? 
    solution.routes.flatMap(route => 
      route.nodes.slice(0, -1).map((nodeId, index) => ({
        id: `${route.vehicleId}-${index}`,
        from: nodeId,
        to: route.nodes[index + 1],
        volume: route.load,
        label: `Vehicle ${route.vehicleId}`,
        isOptimized: true
      }))
    ) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 space-y-8" ref={contentRef}>
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Route className="h-6 w-6 text-primary" />
              Vehicle Route Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Optimize vehicle routes to minimize travel distance and cost while meeting customer demands.
            </p>
          </CardContent>
        </Card>

      <Tabs defaultValue="locations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="optimize">Optimize</TabsTrigger>
          <TabsTrigger value="routes">Route View</TabsTrigger>
        </TabsList>

        <TabsContent value="locations" className="space-y-4">
          {/* Location management content */}
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Customer Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left text-foreground">Name</th>
                      <th className="border border-border p-2 text-foreground">Type</th>
                      <th className="border border-border p-2 text-foreground">Demand</th>
                      <th className="border border-border p-2 text-foreground">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((node) => (
                      <tr key={node.id}>
                        <td className="border border-border p-2 text-foreground">{node.name}</td>
                        <td className="border border-border p-2">
                          <Badge>{node.type}</Badge>
                        </td>
                        <td className="border border-border p-2 text-right text-foreground">{node.demand || 0}</td>
                        <td className="border border-border p-2 text-right text-foreground">
                          {node.latitude.toFixed(2)}, {node.longitude.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          {/* Vehicle management content */}
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Vehicle Fleet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left text-foreground">Vehicle ID</th>
                      <th className="border border-border p-2 text-foreground">Capacity</th>
                      <th className="border border-border p-2 text-foreground">Start</th>
                      <th className="border border-border p-2 text-foreground">End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td className="border border-border p-2 text-foreground">{vehicle.id}</td>
                        <td className="border border-border p-2 text-right text-foreground">{vehicle.capacity}</td>
                        <td className="border border-border p-2 text-foreground">{vehicle.startLocation}</td>
                        <td className="border border-border p-2 text-foreground">{vehicle.endLocation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimize" className="space-y-4">
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Route Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={optimizeRoutes}>
                <Calculator className="h-4 w-4 mr-2" />
                Optimize Routes
              </Button>

              {solution && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Optimization Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Distance</p>
                      <p className="font-semibold text-foreground">{solution.totalDistance} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="font-semibold text-foreground">KES {solution.totalCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Number of Routes</p>
                      <p className="font-semibold text-foreground">{solution.routes.length}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <NetworkMap 
            nodes={mapNodes}
            routes={mapRoutes}
            className="h-96"
            isOptimized={!!solution}
          />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default RouteOptimization;
