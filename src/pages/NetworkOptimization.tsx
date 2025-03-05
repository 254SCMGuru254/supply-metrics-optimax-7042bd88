
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/components/ui/use-toast";
import { ModelWalkthrough } from "@/components/ModelWalkthrough";
import { NetworkMetrics } from "@/components/network-optimization/NetworkMetrics";
import { 
  createInitialNetwork, 
  optimizeNetworkFlow, 
  calculateFlowEfficiency 
} from "@/components/network-optimization/NetworkOptimizationUtils";
import { getNetworkWalkthroughSteps } from "@/components/network-optimization/NetworkWalkthroughSteps";

const NetworkOptimization = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [costReduction, setCostReduction] = useState<number | null>(null);
  const [flowEfficiency, setFlowEfficiency] = useState<number | null>(null);
  const { toast } = useToast();

  const handleMapClick = (lat: number, lng: number) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: Math.random() > 0.5 ? "warehouse" : "distribution", // Randomly assign node types
      name: `Node ${nodes.length + 1}`,
      latitude: lat,
      longitude: lng,
      capacity: Math.floor(Math.random() * 1000) + 500, // Random capacity
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    
    // Create routes between new node and existing nodes
    if (nodes.length > 0) {
      setRoutes(createInitialNetwork(updatedNodes));
    }
    
    toast({
      title: "Node Added",
      description: `Added ${newNode.name} at [${lat.toFixed(4)}, ${lng.toFixed(4)}]`,
    });
  };

  const handleNodeClick = (node: Node) => {
    toast({
      title: "Node Selected",
      description: `Selected ${node.name} (Capacity: ${node.capacity})`,
    });
  };

  const handleOptimize = () => {
    // Calculate unoptimized network cost
    const originalCost = routes.reduce((sum, route) => sum + ((route.cost || 0) * (route.volume || 0)), 0);
    
    // Run optimization algorithm
    const optimizedRoutes = optimizeNetworkFlow(nodes, routes);
    
    // Calculate optimized network cost
    const newCost = optimizedRoutes.reduce((sum, route) => sum + ((route.cost || 0) * (route.volume || 0)), 0);
    
    // Calculate metrics
    const calculatedCostReduction = originalCost > 0 ? ((originalCost - newCost) / originalCost) * 100 : 0;
    const calculatedFlowEfficiency = calculateFlowEfficiency(optimizedRoutes);
    
    // Update state
    setRoutes(optimizedRoutes);
    setIsOptimized(true);
    setCostReduction(calculatedCostReduction);
    setFlowEfficiency(calculatedFlowEfficiency);
    
    toast({
      title: "Optimization Complete",
      description: `Network has been optimized. Cost reduced by ${calculatedCostReduction.toFixed(1)}%.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Network Flow Optimization</h1>
          <p className="text-muted-foreground mt-2">
            Optimize network flows to minimize costs and maximize efficiency.
          </p>
        </div>
        <Button onClick={handleOptimize} disabled={nodes.length < 2}>
          Run Optimization
        </Button>
      </div>

      <ModelWalkthrough steps={getNetworkWalkthroughSteps()} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-4">
          <NetworkMap
            nodes={nodes}
            routes={routes}
            onNodeClick={handleNodeClick}
            onMapClick={handleMapClick}
            isOptimized={isOptimized}
          />
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Network Metrics</h2>
          <NetworkMetrics 
            nodes={nodes}
            routes={routes}
            isOptimized={isOptimized}
            costReduction={costReduction}
            flowEfficiency={flowEfficiency}
          />
        </Card>
      </div>
    </div>
  );
};

export default NetworkOptimization;
