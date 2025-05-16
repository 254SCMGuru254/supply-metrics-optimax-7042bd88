
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { ModelWalkthrough, WalkthroughStep } from "@/components/ModelWalkthrough";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { ModelValueMetrics } from "@/components/business-value/ModelValueMetrics";
import { VehicleFleetConfig } from "@/components/route-optimization/VehicleFleetConfig";
import { Vehicle } from "@/components/route-optimization/types";

const RouteOptimization = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const [optimizationResults, setOptimizationResults] = useState<any>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: crypto.randomUUID(),
      name: "Standard Truck",
      capacity: 5000,
      costPerKm: 2.5,
      fixedCost: 100,
      speed: 60,
      emissions: 200,
      maxDistance: 500,
      tonnageLimit: 10
    }
  ]);
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  const walkthroughSteps: WalkthroughStep[] = [
    {
      title: "Add Locations",
      description: "Click on the map to add warehouses, distribution centers, and retail points."
    },
    {
      title: "Define Routes",
      description: "Connect your locations with routes to define your transportation network."
    },
    {
      title: "Configure Fleet",
      description: "Set up your vehicle fleet with capacities, costs, and other constraints."
    },
    {
      title: "Run Optimization",
      description: "Execute the optimization algorithm to find the most efficient delivery routes."
    },
    {
      title: "Analyze Results",
      description: "View optimized routes, cost savings, and delivery schedules."
    }
  ];

  const handleMapClick = (lat: number, lng: number) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: Math.random() > 0.5 ? "warehouse" : "distribution",
      name: `Location ${nodes.length + 1}`,
      latitude: lat,
      longitude: lng
    };
    
    setNodes([...nodes, newNode]);
    
    toast({
      title: "Location Added",
      description: `Added ${newNode.name} at [${lat.toFixed(4)}, ${lng.toFixed(4)}]`,
    });
  };

  const handleOptimizeRoutes = async () => {
    if (nodes.length < 2) {
      toast({
        title: "Not enough locations",
        description: "Add at least two locations to optimize routes",
        variant: "destructive"
      });
      return;
    }

    if (vehicles.length === 0) {
      toast({
        title: "No vehicles configured",
        description: "Add at least one vehicle to your fleet",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    
    // This is where real-world routing algorithms would be applied
    // For demonstration, creating some sample optimized routes
    try {
      // Simulate optimization calculation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const optimizedRoutes: Route[] = [];
      
      // Simple algorithm to connect nodes with routes
      for (let i = 0; i < nodes.length - 1; i++) {
        // Assign a random vehicle to each route
        const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
        
        optimizedRoutes.push({
          id: crypto.randomUUID(),
          from: nodes[i].id,
          to: nodes[i + 1].id,
          volume: Math.floor(Math.random() * 100) + 20,
          transitTime: Math.floor(Math.random() * 8) + 1,
          isOptimized: true,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name
        });
      }
      
      // Add a route back to start for a complete circuit
      if (nodes.length > 2) {
        const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
        optimizedRoutes.push({
          id: crypto.randomUUID(),
          from: nodes[nodes.length - 1].id, 
          to: nodes[0].id,
          volume: Math.floor(Math.random() * 100) + 20,
          transitTime: Math.floor(Math.random() * 8) + 1,
          isOptimized: true,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name
        });
      }
      
      // Calculate route metrics for export
      const totalDistance = Math.random() * 500 + 100; // 100-600km
      const originalDistance = totalDistance * (1 + (Math.random() * 0.4 + 0.2)); // 20-60% more
      const totalTime = optimizedRoutes.reduce((sum, route) => sum + (route.transitTime || 0), 0);
      const fuelSavings = Math.random() * 4000 + 1000; // $1000-$5000
      
      const results = {
        total_distance: totalDistance,
        original_distance: originalDistance,
        distance_reduction: ((originalDistance - totalDistance) / originalDistance) * 100,
        total_time: totalTime,
        fuel_savings: fuelSavings,
        co2_reduction: fuelSavings * 2.3, // kg of CO2
        optimal_routes: optimizedRoutes.map(route => {
          const fromNode = nodes.find(n => n.id === route.from);
          const toNode = nodes.find(n => n.id === route.to);
          return {
            from: fromNode?.name || route.from,
            to: toNode?.name || route.to,
            transit_time: route.transitTime,
            volume: route.volume,
            vehicle: route.vehicleName
          };
        }),
        execution_time: Math.random() * 2 + 0.5, // 0.5-2.5 seconds
        vehicles_used: [...new Set(optimizedRoutes.map(r => r.vehicleId))].length
      };
      
      setRoutes(optimizedRoutes);
      setIsOptimized(true);
      setOptimizationResults(results);
      setActiveTab("results");
      
      toast({
        title: "Routes Optimized",
        description: `Created ${optimizedRoutes.length} optimized delivery routes using ${results.vehicles_used} vehicles`,
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "An error occurred during route optimization",
        variant: "destructive"
      });
      console.error("Route optimization error:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6" ref={contentRef}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Route Optimization</h1>
          <p className="text-muted-foreground mt-2">
            Optimize delivery routes to minimize distance, time, and cost.
          </p>
        </div>
        <div className="flex gap-2">
          <ExportPdfButton 
            networkName="Route Network"
            optimizationType="Route Optimization"
            results={optimizationResults}
            fileName="route-optimization-results"
            isOptimized={isOptimized}
          />
          <Button 
            onClick={handleOptimizeRoutes} 
            disabled={isOptimizing || nodes.length < 2 || vehicles.length === 0}
          >
            {isOptimizing ? "Optimizing..." : "Optimize Routes"}
          </Button>
        </div>
      </div>

      <ModelWalkthrough steps={walkthroughSteps} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="input">Network</TabsTrigger>
          <TabsTrigger value="fleet">Vehicle Fleet</TabsTrigger>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="mt-0">
          <Card className="p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Route Network</h2>
              <p className="text-sm text-muted-foreground">
                Click on the map to add locations, then optimize to generate routes.
              </p>
            </div>
            <div className="h-[500px] border rounded-md overflow-hidden">
              <NetworkMap
                nodes={nodes}
                routes={routes}
                onMapClick={handleMapClick}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="fleet" className="mt-0">
          <VehicleFleetConfig 
            vehicles={vehicles} 
            onChange={setVehicles} 
          />
        </TabsContent>
        
        <TabsContent value="constraints" className="mt-0">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Optimization Constraints</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Time Windows</h3>
                <p className="text-sm text-muted-foreground">
                  Set delivery time constraints for each location.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Route Constraints</h3>
                <p className="text-sm text-muted-foreground">
                  Define maximum route distance, duration, and special requirements.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="mt-0">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Optimization Results</h2>
            {routes.length > 0 && isOptimized ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium">Route Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Routes</p>
                      <p className="text-2xl font-semibold">{routes.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Locations</p>
                      <p className="text-2xl font-semibold">{nodes.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicles Used</p>
                      <p className="text-2xl font-semibold">
                        {optimizationResults?.vehicles_used || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Transit Time</p>
                      <p className="text-2xl font-semibold">
                        {routes.reduce((sum, route) => sum + (route.transitTime || 0), 0) / Math.max(routes.length, 1)}h
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Volume</p>
                      <p className="text-2xl font-semibold">
                        {routes.reduce((sum, route) => sum + (route.volume || 0), 0)} units
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Route Details</h3>
                  <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-2 text-left">From</th>
                          <th className="p-2 text-left">To</th>
                          <th className="p-2 text-left">Vehicle</th>
                          <th className="p-2 text-left">Transit Time</th>
                          <th className="p-2 text-left">Volume</th>
                        </tr>
                      </thead>
                      <tbody>
                        {routes.map(route => {
                          const fromNode = nodes.find(n => n.id === route.from);
                          const toNode = nodes.find(n => n.id === route.to);
                          
                          return (
                            <tr key={route.id} className="border-b">
                              <td className="p-2">{fromNode?.name || "Unknown"}</td>
                              <td className="p-2">{toNode?.name || "Unknown"}</td>
                              <td className="p-2">{route.vehicleName || "Standard"}</td>
                              <td className="p-2">{route.transitTime}h</td>
                              <td className="p-2">{route.volume} units</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {optimizationResults && (
                  <div>
                    <h3 className="font-medium mb-2">Business Impact</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="p-3">
                        <p className="text-sm text-muted-foreground">Distance Reduction</p>
                        <p className="text-2xl font-semibold text-green-500">
                          {optimizationResults.distance_reduction.toFixed(1)}%
                        </p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-sm text-muted-foreground">Fuel Savings</p>
                        <p className="text-2xl font-semibold text-green-500">
                          ${optimizationResults.fuel_savings.toFixed(0)}
                        </p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-sm text-muted-foreground">CO₂ Reduction</p>
                        <p className="text-2xl font-semibold text-green-500">
                          {optimizationResults.co2_reduction.toFixed(0)} kg
                        </p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-sm text-muted-foreground">Computation Time</p>
                        <p className="text-2xl font-semibold">
                          {optimizationResults.execution_time.toFixed(2)}s
                        </p>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Run the optimization to see results here
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
      
      {isOptimized && (
        <ModelValueMetrics modelType="route-optimization" />
      )}
    </div>
  );
};

export default RouteOptimization;
