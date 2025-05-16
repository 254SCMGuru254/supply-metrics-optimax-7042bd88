
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { NetworkMap } from "@/components/NetworkMap";
import { Node, Route } from "@/components/map/MapTypes";
import { ManualConnectionCreator } from "@/components/network-flow/ManualConnectionCreator";

export default function NetworkFlow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [activeTab, setActiveTab] = useState("nodes");
  const { toast } = useToast();

  const handleMapClick = (lat: number, lng: number) => {
    const nodeTypes = ["factory", "warehouse", "distribution", "customer", "port", "railhub", "airport"];
    const randomType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)] as Node["type"];
    
    const newNode: Node = {
      id: crypto.randomUUID(),
      name: `${randomType.charAt(0).toUpperCase() + randomType.slice(1)} ${nodes.length + 1}`,
      type: randomType,
      latitude: lat,
      longitude: lng
    };
    
    setNodes([...nodes, newNode]);
    
    toast({
      title: "Node Added",
      description: `Added ${newNode.name} at [${lat.toFixed(4)}, ${lng.toFixed(4)}]`
    });
  };

  const handleAddRoute = (routeData: Omit<Route, "id">) => {
    const newRoute: Route = {
      id: crypto.randomUUID(),
      ...routeData
    };
    
    setRoutes([...routes, newRoute]);
  };

  const handleAutoGenerateRoutes = () => {
    if (nodes.length < 2) {
      toast({
        title: "Not enough nodes",
        description: "Add at least two nodes to generate connections",
        variant: "destructive"
      });
      return;
    }
    
    const newRoutes: Route[] = [];
    const factories = nodes.filter(n => n.type === "factory");
    const warehouses = nodes.filter(n => n.type === "warehouse" || n.type === "distribution");
    const customers = nodes.filter(n => n.type === "customer");
    
    // Connect factories to warehouses
    factories.forEach(factory => {
      warehouses.forEach(warehouse => {
        newRoutes.push({
          id: crypto.randomUUID(),
          from: factory.id,
          to: warehouse.id,
          volume: Math.floor(Math.random() * 100) + 10,
          transitTime: Math.floor(Math.random() * 24) + 1,
          mode: "truck"
        });
      });
    });
    
    // Connect warehouses to customers
    warehouses.forEach(warehouse => {
      customers.forEach(customer => {
        newRoutes.push({
          id: crypto.randomUUID(),
          from: warehouse.id,
          to: customer.id,
          volume: Math.floor(Math.random() * 50) + 5,
          transitTime: Math.floor(Math.random() * 12) + 1,
          mode: "truck"
        });
      });
    });
    
    // Add some special transportation modes if available
    const ports = nodes.filter(n => n.type === "port");
    const railhubs = nodes.filter(n => n.type === "railhub");
    const airports = nodes.filter(n => n.type === "airport");
    
    if (ports.length > 0) {
      factories.forEach(factory => {
        ports.forEach(port => {
          newRoutes.push({
            id: crypto.randomUUID(),
            from: factory.id,
            to: port.id,
            volume: Math.floor(Math.random() * 200) + 50,
            transitTime: Math.floor(Math.random() * 72) + 24,
            mode: "ship"
          });
        });
      });
    }
    
    if (railhubs.length > 0) {
      factories.forEach(factory => {
        railhubs.forEach(rail => {
          newRoutes.push({
            id: crypto.randomUUID(),
            from: factory.id,
            to: rail.id,
            volume: Math.floor(Math.random() * 150) + 50,
            transitTime: Math.floor(Math.random() * 48) + 12,
            mode: "rail"
          });
        });
      });
    }
    
    if (airports.length > 0) {
      factories.forEach(factory => {
        airports.forEach(airport => {
          newRoutes.push({
            id: crypto.randomUUID(),
            from: factory.id,
            to: airport.id,
            volume: Math.floor(Math.random() * 30) + 5,
            transitTime: Math.floor(Math.random() * 12) + 2,
            mode: "air"
          });
        });
      });
    }
    
    setRoutes([...routes, ...newRoutes]);
    setActiveTab("connections");
    
    toast({
      title: "Routes Generated",
      description: `Created ${newRoutes.length} network connections`
    });
  };

  const clearNetwork = () => {
    setNodes([]);
    setRoutes([]);
    toast({
      title: "Network Cleared",
      description: "All nodes and connections have been removed"
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Network Flow Analysis</h1>
          <p className="text-muted-foreground">
            Design and optimize your multi-echelon supply chain network
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAutoGenerateRoutes}>
            Auto-Generate Routes
          </Button>
          <Button variant="outline" onClick={clearNetwork}>
            Clear Network
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-4">
              <div className="h-[600px] border rounded-md overflow-hidden">
                <NetworkMap
                  nodes={nodes}
                  routes={routes}
                  onMapClick={handleMapClick}
                  showLegend={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="nodes">Nodes</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="nodes" className="mt-4">
              <Card className="mb-4">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Node Types</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span>Factory</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span>Warehouse</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Distribution Center</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                      <span>Customer</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-cyan-500"></div>
                      <span>Port</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span>Rail Hub</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-sky-500"></div>
                      <span>Airport</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Click on the map to add nodes to your network.
                  </p>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {nodes.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No nodes created yet
                      </div>
                    ) : (
                      <ul className="divide-y">
                        {nodes.map(node => (
                          <li key={node.id} className="py-2">
                            <div className="flex items-center gap-2">
                              <div className={`h-3 w-3 rounded-full ${getNodeColor(node.type)}`}></div>
                              <span className="font-medium">{node.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {node.latitude.toFixed(4)}, {node.longitude.toFixed(4)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="connections">
              <ManualConnectionCreator 
                nodes={nodes}
                onAddRoute={handleAddRoute}
              />
              
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Network Connections</h3>
                  <div className="max-h-80 overflow-y-auto">
                    {routes.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No connections created yet
                      </div>
                    ) : (
                      <ul className="divide-y">
                        {routes.map(route => {
                          const fromNode = nodes.find(n => n.id === route.from);
                          const toNode = nodes.find(n => n.id === route.to);
                          
                          return (
                            <li key={route.id} className="py-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">
                                    {fromNode?.name} → {toNode?.name}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {route.mode || "truck"} | {route.volume || 0} units | {route.transitTime || 0}h
                                  </p>
                                </div>
                                <div className={`px-2 py-1 text-xs rounded-full ${getRouteColor(route.mode)}`}>
                                  {route.mode || "truck"}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Network Stats</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Nodes:</span>
                  <span className="font-medium">{nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Connections:</span>
                  <span className="font-medium">{routes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Volume:</span>
                  <span className="font-medium">
                    {routes.reduce((sum, route) => sum + (route.volume || 0), 0)} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transport Modes:</span>
                  <span className="font-medium">
                    {new Set(routes.map(r => r.mode)).size || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getNodeColor(type: string): string {
  switch (type) {
    case "factory": return "bg-red-500";
    case "warehouse": return "bg-blue-500";
    case "distribution": return "bg-green-500";
    case "customer": return "bg-purple-500";
    case "port": return "bg-cyan-500";
    case "railhub": return "bg-amber-500";
    case "airport": return "bg-sky-500";
    default: return "bg-gray-500";
  }
}

function getRouteColor(mode?: string): string {
  switch (mode) {
    case "truck": return "bg-red-100 text-red-800";
    case "rail": return "bg-amber-100 text-amber-800";
    case "ship": return "bg-cyan-100 text-cyan-800";
    case "air": return "bg-purple-100 text-purple-800";
    default: return "bg-gray-100 text-gray-800";
  }
}
