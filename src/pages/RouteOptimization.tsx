import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Truck, Package2, Route as RouteIcon } from "lucide-react";
import { VehicleFleetConfig } from "@/components/route-optimization/VehicleFleetConfig";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { Vehicle } from "@/components/route-optimization/types";

const RouteOptimization = () => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: crypto.randomUUID(),
      type: "warehouse",
      name: "Main Warehouse",
      latitude: -1.2921,
      longitude: 36.8219,
      ownership: "owned"
    },
    {
      id: crypto.randomUUID(),
      type: "distribution",
      name: "Distribution Center",
      latitude: -1.3921,
      longitude: 36.9219,
      ownership: "owned"
    }
  ]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: crypto.randomUUID(),
      name: "Truck 1",
      capacity: 500,
      costPerKm: 1.5,
      fixedCost: 100,
      speed: 60,
      emissions: 0.5,
      maxDistance: 500,
      tonnageLimit: 10,
      type: "truck",
      fuelEfficiency: 8
    }
  ]);

  const addNode = () => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: "distribution",
      name: `Node ${nodes.length + 1}`,
      latitude: -1.3 + (Math.random() - 0.5) * 0.2,
      longitude: 36.8 + (Math.random() - 0.5) * 0.2,
      ownership: "owned"
    };
    setNodes([...nodes, newNode]);
  };

  const optimizeRoutes = () => {
    if (nodes.length < 2) {
      toast({
        title: "Insufficient Data",
        description: "Add at least 2 nodes to optimize routes",
        variant: "destructive"
      });
      return;
    }

    // Create optimized routes with ownership property
    const optimizedRoutes: Route[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      optimizedRoutes.push({
        id: crypto.randomUUID(),
        from: nodes[i].id,
        to: nodes[i + 1].id,
        volume: Math.floor(Math.random() * 100) + 50,
        transitTime: Math.floor(Math.random() * 24) + 1,
        isOptimized: true,
        vehicleId: vehicles[0]?.id || "default",
        vehicleName: vehicles[0]?.name || "Default Vehicle",
        ownership: "owned"
      });
    }

    // Add return route
    if (nodes.length > 2) {
      optimizedRoutes.push({
        id: crypto.randomUUID(),
        from: nodes[nodes.length - 1].id,
        to: nodes[0].id,
        volume: Math.floor(Math.random() * 100) + 50,
        transitTime: Math.floor(Math.random() * 24) + 1,
        isOptimized: true,
        vehicleId: vehicles[0]?.id || "default",
        vehicleName: vehicles[0]?.name || "Default Vehicle",
        ownership: "owned"
      });
    }

    setRoutes(optimizedRoutes);
    setIsOptimized(true);

    toast({
      title: "Routes Optimized",
      description: `Generated ${optimizedRoutes.length} optimized routes`,
    });
  };

  const reset = () => {
    setIsOptimized(false);
    setRoutes([]);
  };

  const allNodes: Node[] = [...nodes];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <RouteIcon className="h-8 w-8" />
            Route Optimization
          </h1>
          <p className="text-muted-foreground mt-2">
            Optimize delivery routes for efficiency and cost savings
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={addNode}>
            Add Node
          </Button>
          {isOptimized && (
            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
          )}
          <Button onClick={optimizeRoutes} disabled={nodes.length < 2}>
            Optimize Routes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="lg:col-span-2 p-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Network Visualization
            </CardTitle>
            <CardDescription>
              Visualize nodes and optimized routes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px]">
              <NetworkMap
                nodes={allNodes}
                routes={routes}
                isOptimized={isOptimized}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuration Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Vehicle Fleet Configuration
              </CardTitle>
              <CardDescription>
                Configure your vehicle fleet settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VehicleFleetConfig
                vehicles={vehicles}
                onVehiclesChange={setVehicles}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package2 className="h-5 w-5" />
                Optimization Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total Nodes:</span>
                <span>{nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Optimized Routes:</span>
                <span>{routes.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span>{isOptimized ? "Optimized" : "Not Optimized"}</span>
              </div>
            </CardContent>
          </Card>

          {isOptimized && (
            <ExportPdfButton
              data={routes}
              fileName="route-optimization-results.pdf"
              isOptimized={isOptimized}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteOptimization;
