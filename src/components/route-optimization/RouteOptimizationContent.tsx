import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { NetworkMap } from "@/components/NetworkMap";
import { VehicleFleetConfig } from "./VehicleFleetConfig";
import { generateOptimizedRoutes, optimizeMultiModalNetwork } from "./EnhancedRouteUtils";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import type { Node, Route } from "@/components/map/MapTypes";
import { Truck, Plane, Ship, Train, MapPin, BarChart3, Download } from "lucide-react";

export const RouteOptimizationContent = () => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "nairobi-hub",
      name: "Nairobi Distribution Hub",
      type: "warehouse",
      latitude: -1.2921,
      longitude: 36.8219,
      ownership: 'owned', // Add ownership property
      metadata: {
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
      ownership: 'owned', // Add ownership property
      metadata: {
        quayCapacity: 50000,
        maxDraft: 15.0,
        craneAvailability: true
      }
    },
    {
      id: "kisumu-airport",
      name: "Kisumu International Airport",
      type: "airport",
      latitude: -0.0917,
      longitude: 34.7578,
      ownership: 'owned', // Add ownership property
      metadata: {
        runwayLength: 3300,
        cargoCapacity: 15000,
        nightLanding: true
      }
    },
    {
      id: "nakuru-retail",
      name: "Nakuru Retail Center",
      type: "retail",
      latitude: -0.2833,
      longitude: 36.0667,
      ownership: 'owned', // Add ownership property
      metadata: {
        storageCapacity: 10000,
        customerFootfall: 5000,
        peakHours: "10:00-16:00"
      }
    },
    {
      id: "eldoret-industrial",
      name: "Eldoret Industrial Park",
      type: "factory",
      latitude: 0.5167,
      longitude: 35.2667,
      ownership: 'owned', // Add ownership property
      metadata: {
        productionCapacity: 75000,
        rawMaterialSupply: "Reliable",
        wasteManagement: "ISO 14001"
      }
    }
  ]);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [optimizedRoutes, setOptimizedRoutes] = useState<Route[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const initialRoutes = [
      {
        id: "route-1",
        from: "nairobi-hub",
        to: "mombasa-port",
        type: "road" as const,
        volume: 120,
        cost: 15000,
        transitTime: 8,
        isOptimized: true,
        ownership: 'owned' as const // Add ownership property
      },
      {
        id: "route-2",
        from: "mombasa-port",
        to: "kisumu-airport",
        type: "rail" as const,
        volume: 80,
        cost: 22000,
        transitTime: 14,
        isOptimized: true,
        ownership: 'owned' as const // Add ownership property
      },
      {
        id: "route-3",
        from: "kisumu-airport",
        to: "nakuru-retail",
        type: "air" as const,
        volume: 50,
        cost: 35000,
        transitTime: 2,
        isOptimized: true,
        ownership: 'owned' as const // Add ownership property
      },
      {
        id: "route-4",
        from: "nakuru-retail",
        to: "eldoret-industrial",
        type: "road" as const,
        volume: 90,
        cost: 12000,
        transitTime: 6,
        isOptimized: true,
        ownership: 'owned' as const // Add ownership property
      }
    ];
    
    setRoutes(initialRoutes);
    
    // Generate optimized routes
    const optimized = generateOptimizedRoutes(nodes);
    setOptimizedRoutes(optimized);
  }, [nodes]);

  const totalCost = routes.reduce((sum, route) => sum + route.cost, 0);
  const totalVolume = routes.reduce((sum, route) => sum + route.volume, 0);
  const averageTransitTime = routes.reduce((sum, route) => sum + route.transitTime, 0) / routes.length;

  return (
    <div className="space-y-6" id="route-optimization-content">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Route Optimization Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="flex flex-col items-center justify-center">
                <Truck className="h-6 w-6 text-blue-500 mb-2" />
                <div className="text-2xl font-bold">{routes.filter(r => r.type === "road").length}</div>
                <div className="text-sm text-gray-500">Road Routes</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="flex flex-col items-center justify-center">
                <Train className="h-6 w-6 text-green-500 mb-2" />
                <div className="text-2xl font-bold">{routes.filter(r => r.type === "rail").length}</div>
                <div className="text-sm text-gray-500">Rail Routes</div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200">
              <CardContent className="flex flex-col items-center justify-center">
                <Plane className="h-6 w-6 text-red-500 mb-2" />
                <div className="text-2xl font-bold">{routes.filter(r => r.type === "air").length}</div>
                <div className="text-sm text-gray-500">Air Routes</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Badge variant="secondary">Total Cost: ${totalCost}</Badge>
            <Badge variant="secondary">Total Volume: {totalVolume} units</Badge>
            <Badge variant="secondary">Avg. Transit Time: {averageTransitTime.toFixed(1)} hours</Badge>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end mb-4">
        <ExportPdfButton 
          title="Route Optimization Report"
          exportId="route-optimization-content"
          fileName="route_optimization_analysis"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="network">Network Map</TabsTrigger>
          <TabsTrigger value="fleet">Vehicle Fleet</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Optimization Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                This section provides an overview of the route optimization process, 
                including network configuration, optimization algorithms, and key performance indicators.
              </p>
              
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Key Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold">${totalCost}</div>
                      <div className="text-sm text-gray-500">Total Transportation Cost</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold">{totalVolume} units</div>
                      <div className="text-sm text-gray-500">Total Volume Delivered</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Map</CardTitle>
            </CardHeader>
            <CardContent>
              <NetworkMap nodes={nodes} routes={routes} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fleet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Fleet Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleFleetConfig />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports and Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Generate detailed reports on route optimization performance, 
                cost savings, and environmental impact.
              </p>
              
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Key Performance Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold">15%</div>
                      <div className="text-sm text-gray-500">Cost Reduction</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-pink-50 border-pink-200">
                    <CardContent className="flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold">20%</div>
                      <div className="text-sm text-gray-500">Emissions Reduction</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
