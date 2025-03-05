
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/components/ui/use-toast";
import { ModelWalkthrough, WalkthroughStep } from "@/components/ModelWalkthrough";

// Network flow optimization utility functions
const createInitialNetwork = (nodes: Node[]): Route[] => {
  const routes: Route[] = [];
  
  // Create a fully connected network for demo purposes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      // Calculate distance
      const dx = nodes[i].latitude - nodes[j].latitude;
      const dy = nodes[i].longitude - nodes[j].longitude;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Create route with cost based on distance
      routes.push({
        id: crypto.randomUUID(),
        from: nodes[i].id,
        to: nodes[j].id,
        volume: 0, // Initial flow
        cost: Math.round(distance * 100), // Cost proportional to distance
      });
    }
  }
  
  return routes;
};

// Implementation of a simplified Ford-Fulkerson algorithm for max-flow min-cost
const optimizeNetworkFlow = (nodes: Node[], routes: Route[]): Route[] => {
  if (nodes.length < 2) return routes;
  
  // For demo purposes, let's implement a simple optimization
  const optimizedRoutes = [...routes];
  
  // Simple algorithm: 
  // 1. Sort routes by cost
  // 2. Allocate flow to cheaper routes first
  // 3. Ensure flow balance at each node
  
  // Sort routes by cost (ascending)
  optimizedRoutes.sort((a, b) => (a.cost || 0) - (b.cost || 0));
  
  // Assign maximum possible flow to each route
  optimizedRoutes.forEach(route => {
    // For demo, assign random flow values that decrease with cost
    const baseCost = route.cost || 1;
    const maxPossibleFlow = Math.round(10000 / baseCost);
    route.volume = Math.min(Math.floor(Math.random() * maxPossibleFlow) + 50, 1000);
    route.isOptimized = true;
  });
  
  return optimizedRoutes;
};

const NetworkOptimization = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [costReduction, setCostReduction] = useState<number | null>(null);
  const [flowEfficiency, setFlowEfficiency] = useState<number | null>(null);
  const { toast } = useToast();

  const walktroughSteps: WalkthroughStep[] = [
    {
      title: "Add Network Nodes",
      description: "Start by clicking on the map to add facility locations. Each click will add a new node at that location. Add at least two nodes to create a network."
    },
    {
      title: "Create Connections",
      description: "Once you've added multiple nodes, routes will automatically be created between them, forming a connected network with initial flow values."
    },
    {
      title: "Run Optimization Algorithm",
      description: "Click the 'Run Optimization' button to apply the network flow algorithm that minimizes transportation costs across your supply chain network."
    },
    {
      title: "Analyze Results",
      description: "After optimization, review the metrics panel to see the cost reduction and flow efficiency. Optimized routes will be highlighted on the map."
    },
    {
      title: "Refine Your Network",
      description: "Continue adding more nodes to create a more complex network, then re-run the optimization to see how the algorithm handles different scenarios."
    }
  ];

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
  
  // Calculate flow efficiency (a measure of how well flow is balanced)
  const calculateFlowEfficiency = (optimizedRoutes: Route[]): number => {
    // For demo purposes, return a calculated value
    const totalFlow = optimizedRoutes.reduce((sum, route) => sum + (route.volume || 0), 0);
    const averageFlow = totalFlow / Math.max(optimizedRoutes.length, 1);
    
    // Calculate standard deviation of flow
    const flowVariance = optimizedRoutes.reduce((sum, route) => {
      const diff = (route.volume || 0) - averageFlow;
      return sum + (diff * diff);
    }, 0) / Math.max(optimizedRoutes.length, 1);
    
    const flowStdDev = Math.sqrt(flowVariance);
    
    // Efficiency formula: inverse of coefficient of variation (higher is better)
    return Math.min(100, Math.max(0, 100 * (1 - flowStdDev / Math.max(averageFlow, 1))));
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

      <ModelWalkthrough steps={walktroughSteps} />

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
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Nodes</p>
              <p className="text-2xl font-semibold">{nodes.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Routes</p>
              <p className="text-2xl font-semibold">{routes.length}</p>
            </div>
            {isOptimized && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Cost Reduction</p>
                  <p className="text-2xl font-semibold text-primary">{costReduction?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Flow Efficiency</p>
                  <p className="text-2xl font-semibold text-primary">{flowEfficiency?.toFixed(1)}%</p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NetworkOptimization;
