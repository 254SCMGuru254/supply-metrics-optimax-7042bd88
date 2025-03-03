
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

// Simulated annealing parameters
interface SimulatedAnnealingParams {
  initialTemperature: number;
  coolingRate: number;
  iterations: number;
}

// Utility functions for heuristic algorithm
const createInitialRoutes = (nodes: Node[]): Route[] => {
  const routes: Route[] = [];
  
  // Create a fully connected network
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      // Calculate distance
      const dx = nodes[i].latitude - nodes[j].latitude;
      const dy = nodes[i].longitude - nodes[j].longitude;
      const distance = Math.sqrt(dx * dx + dy * dy) * 111; // Rough km conversion
      
      routes.push({
        id: crypto.randomUUID(),
        from: nodes[i].id,
        to: nodes[j].id,
        volume: Math.floor(Math.random() * 100) + 50,
        cost: Math.round(distance * 10), // Cost based on distance
      });
    }
  }
  
  return routes;
};

// Calculate total cost of a solution
const calculateTotalCost = (routes: Route[]): number => {
  return routes.reduce((sum, route) => {
    return sum + ((route.volume || 0) * (route.cost || 0));
  }, 0);
};

// Heuristic algorithm: Simulated Annealing
const runSimulatedAnnealing = (
  nodes: Node[], 
  routes: Route[], 
  params: SimulatedAnnealingParams
): [Route[], number] => {
  // Clone routes to avoid mutating the original
  let currentSolution = routes.map(r => ({...r}));
  let bestSolution = [...currentSolution];
  
  let currentCost = calculateTotalCost(currentSolution);
  let bestCost = currentCost;
  
  let temperature = params.initialTemperature;
  
  // Iterations counter for progress tracking
  let currentIteration = 0;
  const totalIterations = params.iterations;
  
  // Run the simulated annealing algorithm
  while (currentIteration < totalIterations) {
    // Generate a neighbor solution by randomly modifying flows
    const neighborSolution = currentSolution.map(route => {
      // 30% chance to modify a route
      if (Math.random() < 0.3) {
        const currentVolume = route.volume || 0;
        // Random adjustment between -30% and +30% of current volume
        const adjustment = currentVolume * (Math.random() * 0.6 - 0.3);
        const newVolume = Math.max(10, Math.round(currentVolume + adjustment));
        
        return {
          ...route,
          volume: newVolume,
          isOptimized: true,
        };
      }
      return {...route};
    });
    
    // Calculate cost of neighbor solution
    const neighborCost = calculateTotalCost(neighborSolution);
    
    // Determine if we should accept the neighbor solution
    const costDifference = neighborCost - currentCost;
    
    if (
      costDifference < 0 || // Better solution
      Math.random() < Math.exp(-costDifference / temperature) // Accept worse solution with probability
    ) {
      currentSolution = neighborSolution;
      currentCost = neighborCost;
      
      // Update best solution if current is better
      if (currentCost < bestCost) {
        bestSolution = [...currentSolution];
        bestCost = currentCost;
      }
    }
    
    // Cool temperature
    temperature *= params.coolingRate;
    currentIteration++;
  }
  
  // Calculate improvement percentage
  const initialCost = calculateTotalCost(routes);
  const improvementPercentage = ((initialCost - bestCost) / initialCost) * 100;
  
  // Set isOptimized flag for best solution routes
  bestSolution = bestSolution.map(route => ({...route, isOptimized: true}));
  
  return [bestSolution, improvementPercentage];
};

const Heuristic = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [improvementPercentage, setImprovementPercentage] = useState<number | null>(null);
  const [iterations, setIterations] = useState<number>(500);
  const [initialTemperature, setInitialTemperature] = useState<number>(1000);
  const [coolingRate, setCoolingRate] = useState<number>(0.95);
  const { toast } = useToast();

  const handleMapClick = (lat: number, lng: number) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: Math.random() > 0.5 ? "warehouse" : "distribution",
      name: `Node ${nodes.length + 1}`,
      latitude: lat,
      longitude: lng,
      capacity: Math.floor(Math.random() * 1000) + 500,
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    
    // Create routes when we have at least 2 nodes
    if (updatedNodes.length > 1) {
      setRoutes(createInitialRoutes(updatedNodes));
    }
    
    toast({
      title: "Node Added",
      description: `Added ${newNode.name} at [${lat.toFixed(4)}, ${lng.toFixed(4)}]`,
    });
  };

  const handleNodeClick = (node: Node) => {
    toast({
      title: "Node Selected",
      description: `Selected ${node.name}`,
    });
  };

  const handleOptimize = () => {
    if (nodes.length < 2) {
      toast({
        title: "Not Enough Nodes",
        description: "Add at least two nodes to run the optimization",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Optimization Started",
      description: "Running simulated annealing algorithm...",
    });
    
    // Run simulated annealing algorithm
    const [optimizedRoutes, improvement] = runSimulatedAnnealing(
      nodes, 
      routes, 
      {
        initialTemperature,
        coolingRate,
        iterations
      }
    );
    
    // Update state
    setRoutes(optimizedRoutes);
    setIsOptimized(true);
    setImprovementPercentage(improvement);
    
    toast({
      title: "Optimization Complete",
      description: `Network optimized with ${improvement.toFixed(1)}% cost reduction.`,
    });
  };

  const handleReset = () => {
    setIsOptimized(false);
    setImprovementPercentage(null);
    // Reset routes to unoptimized state
    setRoutes(routes.map(route => ({...route, isOptimized: false})));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Heuristic Optimization</h1>
          <p className="text-muted-foreground mt-2">
            Optimize network configuration using simulated annealing algorithm.
          </p>
        </div>
        <div className="space-x-2">
          {isOptimized && (
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          )}
          <Button onClick={handleOptimize} disabled={nodes.length < 2 || isOptimized}>
            Run Optimization
          </Button>
        </div>
      </div>

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

        <div className="space-y-6">
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
              {isOptimized && improvementPercentage !== null && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Cost Reduction</p>
                    <p className="text-2xl font-semibold text-primary">{improvementPercentage.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Algorithm</p>
                    <p className="text-lg font-medium">Simulated Annealing</p>
                  </div>
                </>
              )}
            </div>
          </Card>

          {!isOptimized && (
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Algorithm Parameters</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="iterations">Iterations: {iterations}</Label>
                  </div>
                  <Slider
                    id="iterations"
                    min={100}
                    max={2000}
                    step={100}
                    value={[iterations]}
                    onValueChange={(vals) => setIterations(vals[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="temperature">Initial Temperature: {initialTemperature}</Label>
                  </div>
                  <Slider
                    id="temperature"
                    min={100}
                    max={5000}
                    step={100}
                    value={[initialTemperature]}
                    onValueChange={(vals) => setInitialTemperature(vals[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="cooling-rate">Cooling Rate: {coolingRate.toFixed(2)}</Label>
                  </div>
                  <Slider
                    id="cooling-rate"
                    min={0.8}
                    max={0.99}
                    step={0.01}
                    value={[coolingRate]}
                    onValueChange={(vals) => setCoolingRate(vals[0])}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">How to Use</h2>
        <div className="space-y-2">
          <p>1. Click on the map to add facility locations</p>
          <p>2. Adjust algorithm parameters if needed</p>
          <p>3. Click "Run Optimization" to apply the simulated annealing algorithm</p>
          <p>4. View the optimized routes and cost reduction in the metrics panel</p>
        </div>
      </Card>
    </div>
  );
};

export default Heuristic;
