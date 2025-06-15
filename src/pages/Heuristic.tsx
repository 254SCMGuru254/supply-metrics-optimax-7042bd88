import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/hooks/use-toast";
import { ModelWalkthrough, WalkthroughStep } from "@/components/ModelWalkthrough";
import { HeuristicMetrics } from "@/components/heuristic/HeuristicMetrics";
import { HeuristicParameters } from "@/components/heuristic/HeuristicParameters";
import { HeuristicInstructions } from "@/components/heuristic/HeuristicInstructions";
import { ModelFormulas } from "@/components/shared/ModelFormulas";
import { createInitialRoutes, runSimulatedAnnealing } from "@/components/heuristic/HeuristicUtils";

const Heuristic = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [improvementPercentage, setImprovementPercentage] = useState<number | null>(null);
  const [iterations, setIterations] = useState<number>(500);
  const [initialTemperature, setInitialTemperature] = useState<number>(1000);
  const [coolingRate, setCoolingRate] = useState<number>(0.95);
  const { toast } = useToast();

  const walkthroughSteps: WalkthroughStep[] = [
    {
      title: "Create Network Structure",
      description: "Click on the map to add facility locations that will form your supply chain network. Each node represents a warehouse or distribution center."
    },
    {
      title: "Configure Algorithm Parameters",
      description: "Adjust the simulated annealing parameters: iterations control how long the algorithm runs, temperature affects the initial probability of accepting worse solutions, and cooling rate determines how quickly the algorithm narrows its search."
    },
    {
      title: "Run Simulated Annealing Algorithm",
      description: "Click 'Run Optimization' to apply the simulated annealing algorithm to find near-optimal flow patterns in your network. This is especially useful for complex networks with many constraints."
    },
    {
      title: "Analyze Cost Reduction",
      description: "Review the metrics panel to see the percentage of cost reduction achieved. The algorithm may not find the mathematically optimal solution, but it can find good solutions quickly for complex problems."
    },
    {
      title: "Experiment With Parameters",
      description: "Reset and try different parameter combinations to see how they affect the solution quality. Higher iterations and slower cooling rates may yield better results but take longer to compute."
    }
  ];

  const handleMapClick = (lat: number, lng: number) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: Math.random() > 0.5 ? "warehouse" : "distribution",
      name: `Node ${nodes.length + 1}`,
      latitude: lat,
      longitude: lng,
      capacity: Math.floor(Math.random() * 1000) + 500,
      ownership: 'owned' // Add missing ownership property
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
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Heuristic Optimization</h1>
          <p className="text-muted-foreground">
            Use advanced heuristic algorithms to solve complex supply chain problems.
          </p>
        </div>
      </div>

      <ModelFormulas modelId="heuristic-optimization" />

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

      <ModelWalkthrough steps={walkthroughSteps} />

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
            <HeuristicMetrics
              nodes={nodes}
              routes={routes}
              isOptimized={isOptimized}
              improvementPercentage={improvementPercentage}
            />
          </Card>

          {!isOptimized && (
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Algorithm Parameters</h2>
              <HeuristicParameters 
                iterations={iterations}
                initialTemperature={initialTemperature}
                coolingRate={coolingRate}
                onIterationsChange={setIterations}
                onTemperatureChange={setInitialTemperature}
                onCoolingRateChange={setCoolingRate}
              />
            </Card>
          )}
        </div>
      </div>

      <HeuristicInstructions />
    </div>
  );
};

export default Heuristic;
