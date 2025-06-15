import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { NetworkMap } from "@/components/NetworkMap";
import { VehicleFleetConfig, Vehicle } from "./VehicleFleetConfig";
import { ConstraintsForm } from "@/components/data-input/ConstraintsForm";
import { OptimizationControls } from "./OptimizationControls";
import { OptimizationResults } from "./OptimizationResults";
import { useOptimizationEngine } from "./OptimizationEngine";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import type { Node, Route } from "@/components/map/MapTypes";
import { 
  Truck, 
  MapPin, 
  Activity, 
  Gauge, 
  DollarSign, 
  Package, 
  Clock, 
  Settings 
} from "lucide-react";
import { toast } from "sonner";

export const RouteOptimizationContent = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "vehicle-1",
      name: "Delivery Truck 1",
      type: "truck",
      capacity: 5000,
      costPerKm: 2.5,
      fuelEfficiency: 8.0
    }
  ]);

  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "nairobi-hub",
      name: "Nairobi Distribution Hub",
      type: "warehouse",
      latitude: -1.2921,
      longitude: 36.8219,
      ownership: 'owned',
      metadata: {
        demand: 0,
        capacity: 50000,
        restrictions: {
          weightLimit: 40000,
          heightLimit: 4.2,
          environmentalZone: true
        },
        trafficFactor: 1.3,
        tollCost: 500,
        checkpointWaitTime: 0.5
      }
    },
    {
      id: "mombasa-port",
      name: "Mombasa Port",
      type: "port",
      latitude: -4.0435,
      longitude: 39.6682,
      ownership: 'owned',
      metadata: {
        demand: 15000,
        capacity: 30000,
        quayCapacity: 50000,
        maxDraft: 15.0,
        craneAvailability: true
      }
    },
    {
      id: "kisumu-customer",
      name: "Kisumu Customer Center",
      type: "customer",
      latitude: -0.0917,
      longitude: 34.7578,
      ownership: 'owned',
      metadata: {
        demand: 8000,
        capacity: 10000,
        customerFootfall: 5000,
        peakHours: "10:00-16:00"
      }
    },
    {
      id: "nakuru-retail",
      name: "Nakuru Retail Center",
      type: "retail",
      latitude: -0.2833,
      longitude: 36.0667,
      ownership: 'owned',
      metadata: {
        demand: 5000,
        capacity: 8000,
        storageCapacity: 10000,
        customerFootfall: 5000,
        peakHours: "10:00-16:00"
      }
    },
    {
      id: "eldoret-customer",
      name: "Eldoret Customer Hub",
      type: "customer",
      latitude: 0.5167,
      longitude: 35.2667,
      ownership: 'owned',
      metadata: {
        demand: 6000,
        capacity: 9000,
        productionCapacity: 75000,
        rawMaterialSupply: "Reliable",
        wasteManagement: "ISO 14001"
      }
    }
  ]);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [activeTab, setActiveTab] = useState("optimization");

  const {
    optimizeRoutes,
    isOptimizing,
    optimizationResult,
    error,
    clearResult,
    clearError
  } = useOptimizationEngine();

  useEffect(() => {
    // Initialize with basic routes
    const initialRoutes = [
      {
        id: "route-1",
        from: "nairobi-hub",
        to: "mombasa-port",
        type: "road" as const,
        volume: 120,
        cost: 15000,
        transitTime: 8,
        isOptimized: false,
        ownership: 'owned' as const
      },
      {
        id: "route-2",
        from: "nairobi-hub",
        to: "kisumu-customer",
        type: "road" as const,
        volume: 80,
        cost: 12000,
        transitTime: 6,
        isOptimized: false,
        ownership: 'owned' as const
      },
      {
        id: "route-3",
        from: "nairobi-hub",
        to: "nakuru-retail",
        type: "road" as const,
        volume: 50,
        cost: 8000,
        transitTime: 3,
        isOptimized: false,
        ownership: 'owned' as const
      },
      {
        id: "route-4",
        from: "nairobi-hub",
        to: "eldoret-customer",
        type: "road" as const,
        volume: 60,
        cost: 10000,
        transitTime: 4,
        isOptimized: false,
        ownership: 'owned' as const
      }
    ];
    
    setRoutes(initialRoutes);
  }, []);

  const handleOptimize = async (params: any) => {
    clearError();
    toast.info("Starting route optimization...");
    
    const optimizationParams = {
      ...params,
      vehicles
    };
    
    const result = await optimizeRoutes(nodes, routes, optimizationParams);
    
    if (result) {
      toast.success(`Optimization completed! Cost savings: $${result.costSavings.toLocaleString()}`);
    } else if (error) {
      toast.error(`Optimization failed: ${error}`);
    }
  };

  const handleApplyRoutes = (optimizedRoutes: Route[]) => {
    setRoutes(optimizedRoutes);
    toast.success("Optimized routes applied successfully!");
    clearResult();
  };

  const currentRoutes = optimizationResult?.optimizedRoutes || routes;
  const totalCost = currentRoutes.reduce((sum, route) => sum + route.cost, 0);
  const totalVolume = currentRoutes.reduce((sum, route) => sum + route.volume, 0);
  const averageTransitTime = currentRoutes.length > 0 
    ? currentRoutes.reduce((sum, route) => sum + route.transitTime, 0) / currentRoutes.length 
    : 0;

  return (
    <div className="space-y-6" id="route-optimization-content">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Live Route Optimization Engine
            <Badge variant={isOptimizing ? "default" : "secondary"}>
              {isOptimizing ? "Optimizing" : "Ready"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <Truck className="h-6 w-6 text-blue-500 mb-2" />
                <div className="text-2xl font-bold">{currentRoutes.filter(r => r.type === "road").length}</div>
                <div className="text-sm text-gray-500">Road Routes</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <DollarSign className="h-6 w-6 text-green-500 mb-2" />
                <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Cost</div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <Package className="h-6 w-6 text-purple-500 mb-2" />
                <div className="text-2xl font-bold">{totalVolume.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Volume</div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <Clock className="h-6 w-6 text-orange-500 mb-2" />
                <div className="text-2xl font-bold">{averageTransitTime.toFixed(1)}h</div>
                <div className="text-sm text-gray-500">Avg Transit Time</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mb-4">
        <ExportPdfButton 
          exportId="route-optimization-content"
          fileName="route_optimization_analysis"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Live Optimization
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Network Map
          </TabsTrigger>
          <TabsTrigger value="fleet" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Vehicle Fleet
          </TabsTrigger>
          <TabsTrigger value="constraints" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Constraints
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="optimization" className="space-y-4">
          <OptimizationControls
            onOptimize={handleOptimize}
            isOptimizing={isOptimizing}
          />
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <OptimizationResults
            results={optimizationResult}
            originalRoutes={routes}
            onApplyRoutes={handleApplyRoutes}
            onExportResults={() => toast.info("Export functionality coming soon!")}
          />
        </TabsContent>
        
        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Network Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <NetworkMap nodes={nodes} routes={currentRoutes} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fleet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Fleet Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleFleetConfig vehicles={vehicles} onVehiclesChange={setVehicles} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="constraints" className="space-y-4">
          <ConstraintsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};
