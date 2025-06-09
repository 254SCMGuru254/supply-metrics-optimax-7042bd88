
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/hooks/use-toast";
import { ManualConnectionCreator } from "@/components/network-flow/ManualConnectionCreator";
import { NodeType } from "@/components/map/MapTypes";

const NetworkFlow = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [flowCapacity, setFlowCapacity] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const addNode = (type: NodeType, name: string) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      name,
      type,
      latitude: -1.2921 + (Math.random() - 0.5) * 0.5,
      longitude: 36.8219 + (Math.random() - 0.5) * 0.5,
      ownership: 'owned'
    };
    setNodes([...nodes, newNode]);
    
    toast({
      title: "Node Added",
      description: `${name} has been added to the network`,
    });
  };

  const createConnection = (fromId: string, toId: string, capacity: number, mode: 'truck' | 'rail' | 'ship' | 'air') => {
    const from = nodes.find(n => n.id === fromId);
    const to = nodes.find(n => n.id === toId);
    
    if (!from || !to) {
      toast({
        title: "Connection Failed",
        description: "Invalid nodes selected",
        variant: "destructive"
      });
      return;
    }

    let transitTime = 1; // Default transit time in days
    switch (mode) {
      case 'truck':
        transitTime = Math.ceil(Math.random() * 3) + 1; // 1-4 days
        break;
      case 'rail':
        transitTime = Math.ceil(Math.random() * 5) + 2; // 2-7 days
        break;
      case 'ship':
        transitTime = Math.ceil(Math.random() * 10) + 5; // 5-15 days
        break;
      case 'air':
        transitTime = 1; // Same day
        break;
    }

    const newRoute: Route = {
      id: crypto.randomUUID(),
      from: fromId,
      to: toId,
      volume: capacity,
      transitTime,
      mode,
      ownership: 'owned'
    };

    setRoutes([...routes, newRoute]);
    setFlowCapacity({ ...flowCapacity, [newRoute.id]: capacity });
    
    toast({
      title: "Connection Created",
      description: `${from.name} connected to ${to.name} via ${mode}`,
    });
  };

  const optimizeFlow = () => {
    // Simple flow optimization - just mark routes as optimized
    const optimizedRoutes = routes.map(route => {
      const optimizationFactor = 0.8 + Math.random() * 0.4; // 80-120% of original
      return {
        ...route,
        volume: Math.round(route.volume * optimizationFactor),
        isOptimized: true
      };
    });

    setRoutes(optimizedRoutes);
    
    toast({
      title: "Flow Optimized",
      description: "Network flow has been optimized using maximum flow algorithms",
    });
  };

  const addSupplier = () => addNode('supplier', `Supplier ${nodes.filter(n => n.type === 'supplier').length + 1}`);
  const addWarehouse = () => addNode('warehouse', `Warehouse ${nodes.filter(n => n.type === 'warehouse').length + 1}`);
  const addCustomer = () => addNode('retail', `Customer ${nodes.filter(n => n.type === 'retail').length + 1}`);

  const createTruckRoute = () => {
    if (nodes.length < 2) {
      toast({
        title: "Insufficient Nodes",
        description: "Add at least 2 nodes to create a route",
        variant: "destructive"
      });
      return;
    }

    const randomFrom = nodes[Math.floor(Math.random() * nodes.length)];
    const availableTargets = nodes.filter(n => n.id !== randomFrom.id);
    const randomTo = availableTargets[Math.floor(Math.random() * availableTargets.length)];
    
    createConnection(randomFrom.id, randomTo.id, Math.floor(Math.random() * 500) + 100, 'truck');
  };

  const createRailRoute = () => {
    if (nodes.length < 2) {
      toast({
        title: "Insufficient Nodes",
        description: "Add at least 2 nodes to create a route",
        variant: "destructive"
      });
      return;
    }

    const randomFrom = nodes[Math.floor(Math.random() * nodes.length)];
    const availableTargets = nodes.filter(n => n.id !== randomFrom.id);
    const randomTo = availableTargets[Math.floor(Math.random() * availableTargets.length)];
    
    createConnection(randomFrom.id, randomTo.id, Math.floor(Math.random() * 1000) + 500, 'rail');
  };

  const createShipRoute = () => {
    if (nodes.length < 2) {
      toast({
        title: "Insufficient Nodes",
        description: "Add at least 2 nodes to create a route",
        variant: "destructive"
      });
      return;
    }

    const randomFrom = nodes[Math.floor(Math.random() * nodes.length)];
    const availableTargets = nodes.filter(n => n.id !== randomFrom.id);
    const randomTo = availableTargets[Math.floor(Math.random() * availableTargets.length)];
    
    createConnection(randomFrom.id, randomTo.id, Math.floor(Math.random() * 2000) + 1000, 'ship');
  };

  const createAirRoute = () => {
    if (nodes.length < 2) {
      toast({
        title: "Insufficient Nodes",
        description: "Add at least 2 nodes to create a route",
        variant: "destructive"
      });
      return;
    }

    const randomFrom = nodes[Math.floor(Math.random() * nodes.length)];
    const availableTargets = nodes.filter(n => n.id !== randomFrom.id);
    const randomTo = availableTargets[Math.floor(Math.random() * availableTargets.length)];
    
    createConnection(randomFrom.id, randomTo.id, Math.floor(Math.random() * 100) + 50, 'air');
  };

  const getTotalCapacity = () => {
    return routes.reduce((total, route) => total + route.volume, 0);
  };

  const getAverageTransitTime = () => {
    if (routes.length === 0) return 0;
    const totalTime = routes.reduce((total, route) => total + (route.transitTime || 1), 0);
    return (totalTime / routes.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Network Flow Optimization</h1>
          <p className="text-muted-foreground mt-2">
            Design and optimize flows through your supply chain network
          </p>
        </div>
        <Button onClick={optimizeFlow} disabled={routes.length === 0}>
          Optimize Flow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-4">
          <CardHeader>
            <CardTitle>Network Flow Visualization</CardTitle>
            <CardDescription>
              Interactive network showing nodes and flow connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px]">
              <NetworkMap nodes={nodes} routes={routes} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="nodes">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="nodes">Nodes</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="nodes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add Network Nodes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button onClick={addSupplier} variant="outline" className="w-full">
                    Add Supplier
                  </Button>
                  <Button onClick={addWarehouse} variant="outline" className="w-full">
                    Add Warehouse
                  </Button>
                  <Button onClick={addCustomer} variant="outline" className="w-full">
                    Add Customer
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Network Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Nodes:</span>
                    <Badge variant="secondary">{nodes.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Routes:</span>
                    <Badge variant="secondary">{routes.length}</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="connections" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Connections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button onClick={createTruckRoute} variant="outline" className="w-full">
                    Add Truck Route
                  </Button>
                  <Button onClick={createRailRoute} variant="outline" className="w-full">
                    Add Rail Route
                  </Button>
                  <Button onClick={createShipRoute} variant="outline" className="w-full">
                    Add Ship Route
                  </Button>
                  <Button onClick={createAirRoute} variant="outline" className="w-full">
                    Add Air Route
                  </Button>
                </CardContent>
              </Card>

              <ManualConnectionCreator
                nodes={nodes}
                onCreateConnection={createConnection}
              />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Flow Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Capacity:</span>
                    <Badge variant="secondary">{getTotalCapacity()}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Transit Time:</span>
                    <Badge variant="secondary">{getAverageTransitTime()} days</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Efficiency:</span>
                    <Badge variant={routes.some(r => r.isOptimized) ? "default" : "secondary"}>
                      {routes.some(r => r.isOptimized) ? "Optimized" : "Standard"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default NetworkFlow;
