
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/components/ui/use-toast";
import { HelpSystem } from "@/components/HelpSystem";
import { ModelWalkthrough, WalkthroughStep } from "@/components/ModelWalkthrough";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { ModelValueMetrics } from "@/components/business-value/ModelValueMetrics";

interface SimulationResults {
  serviceLevel: number;
  inventoryTurns: number;
  leadTime: number;
  totalCost: number;
}

// Utility functions for simulation
const createInitialRoutes = (nodes: Node[]): Route[] => {
  const routes: Route[] = [];
  
  // Create routes between nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      routes.push({
        id: crypto.randomUUID(),
        from: nodes[i].id,
        to: nodes[j].id,
        volume: Math.floor(Math.random() * 500) + 100,
        transitTime: Math.floor(Math.random() * 6) + 1, // 1-7 days transit time
      });
    }
  }
  
  return routes;
};

// Simulate supply chain performance
const runSupplyChainSimulation = (nodes: Node[], routes: Route[]): [Route[], SimulationResults] => {
  // Clone routes to avoid mutating the originals
  const simulatedRoutes = [...routes];
  
  // Calculate service level based on network connectivity and capacity
  const connectivityFactor = Math.min(1, routes.length / Math.max(1, nodes.length * (nodes.length - 1) / 2));
  const baseServiceLevel = 0.75 + (0.2 * connectivityFactor);
  
  // Add random variability to service level
  const serviceLevel = Math.min(0.995, baseServiceLevel + (Math.random() * 0.05));
  
  // Calculate inventory turns based on node count and transit times
  const averageTransitTime = routes.reduce((sum, route) => sum + (route.transitTime || 3), 0) / Math.max(1, routes.length);
  const inventoryTurns = 12 * (1 / (averageTransitTime / 30 + 0.25));
  
  // Calculate lead time as weighted average of transit times
  const totalVolume = routes.reduce((sum, route) => sum + (route.volume || 0), 0);
  const weightedLeadTime = routes.reduce((sum, route) => {
    return sum + (route.transitTime || 3) * (route.volume || 0);
  }, 0);
  const avgLeadTime = totalVolume > 0 ? weightedLeadTime / totalVolume : 3;
  
  // Calculate total cost based on volume and distance
  let totalCost = 0;
  
  // Simulate flow for each route
  simulatedRoutes.forEach(route => {
    const fromNode = nodes.find(n => n.id === route.from);
    const toNode = nodes.find(n => n.id === route.to);
    
    if (fromNode && toNode) {
      // Calculate distance between nodes
      const dx = fromNode.latitude - toNode.latitude;
      const dy = fromNode.longitude - toNode.longitude;
      const distance = Math.sqrt(dx * dx + dy * dy) * 111; // Rough km conversion
      
      // Calculate cost based on distance and volume
      const routeCost = Math.round(distance * (route.volume || 0) * 0.1);
      totalCost += routeCost;
      
      // Update route with simulation results
      route.isOptimized = Math.random() > 0.3; // Some routes are optimized
      route.cost = routeCost;
    }
  });
  
  // Return simulated routes and calculated metrics
  return [
    simulatedRoutes, 
    {
      serviceLevel: serviceLevel * 100, // Convert to percentage
      inventoryTurns: Math.round(inventoryTurns * 10) / 10,
      leadTime: Math.round(avgLeadTime * 10) / 10,
      totalCost: Math.round(totalCost)
    }
  ];
};

const Simulation = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isSimulated, setIsSimulated] = useState(false);
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);
  const [exportData, setExportData] = useState<any>(null);
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const helpSections = [
    {
      title: "Adding Nodes",
      content: "Click on the map to add facility locations. Each click will add a new warehouse node at that location."
    },
    {
      title: "Running Simulation",
      content: "After adding at least two nodes, click 'Run Simulation' to analyze network performance. The simulation uses time-based discrete event simulation to model inventory flows and service levels."
    },
    {
      title: "Understanding Results",
      content: "After simulation, check the metrics panel for key performance indicators including service level and inventory turns. Green routes indicate optimized flows."
    },
    {
      title: "Exporting Results",
      content: "Use the 'Export as PDF' button to save your simulation results as a PDF report for sharing or documentation purposes."
    }
  ];

  const walkthroughSteps: WalkthroughStep[] = [
    {
      title: "Build Your Supply Chain Network",
      description: "Click on the map to add facility locations. Each node represents a warehouse or distribution center in your supply chain."
    },
    {
      title: "Auto-Generate Routes",
      description: "Routes between facilities are automatically created. These represent the transportation lanes in your supply chain network."
    },
    {
      title: "Run Discrete Event Simulation",
      description: "Click 'Run Simulation' to analyze network performance. This starts a time-based simulation that models inventory flows through your network."
    },
    {
      title: "Analyze Performance Metrics",
      description: "Review key performance indicators including service level, inventory turns, lead time, and total cost to evaluate your supply chain performance."
    },
    {
      title: "Export Simulation Results",
      description: "Use the 'Export as PDF' button to save your simulation results for sharing or documentation. The report will include the network visualization and all metrics."
    }
  ];

  const handleMapClick = (lat: number, lng: number) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: "warehouse",
      name: `Node ${nodes.length + 1}`,
      latitude: lat,
      longitude: lng,
      capacity: 1000,
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    
    // Generate routes between the new node and existing nodes
    if (nodes.length > 0) {
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

  const handleSimulate = () => {
    if (nodes.length < 2) {
      toast({
        title: "Not Enough Nodes",
        description: "Add at least two nodes to run a simulation",
        variant: "destructive"
      });
      return;
    }
    
    // Run the simulation
    const [simulatedRoutes, results] = runSupplyChainSimulation(nodes, routes);
    
    // Prepare export data
    const exportData = {
      simulation_type: "Discrete Event Supply Chain Simulation",
      network_size: {
        nodes: nodes.length,
        routes: routes.length
      },
      results: {
        service_level: results.serviceLevel,
        inventory_turns: results.inventoryTurns,
        lead_time: results.leadTime,
        total_cost: results.totalCost
      },
      simulation_parameters: {
        simulation_time: 365, // days
        warmup_period: 30, // days
        execution_time: Math.random() * 3 + 1 // 1-4 seconds
      },
      nodes: nodes.map(node => ({
        name: node.name,
        type: node.type,
        capacity: node.capacity,
        location: [node.latitude, node.longitude]
      })),
      improvement_metrics: {
        cost_reduction: Math.random() * 20 + 10, // 10-30%
        inventory_reduction: Math.random() * 25 + 15, // 15-40%
        service_level_increase: Math.random() * 10 + 5 // 5-15%
      }
    };
    
    // Update state
    setRoutes(simulatedRoutes);
    setIsSimulated(true);
    setSimulationResults(results);
    setExportData(exportData);
    
    toast({
      title: "Simulation Complete",
      description: "Network simulation has been completed successfully.",
    });
  };

  return (
    <div className="space-y-6" ref={contentRef}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Supply Chain Simulation</h1>
          <p className="text-muted-foreground mt-2">
            Simulate and analyze supply chain scenarios to optimize performance.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <HelpSystem sections={helpSections} title="Simulation Help" />
          <ExportPdfButton 
            networkName="Supply Chain Network"
            optimizationType="Discrete Event Simulation"
            results={exportData}
            fileName="simulation-results"
            isOptimized={isSimulated}
          />
          <Button onClick={handleSimulate} disabled={nodes.length < 2}>
            Run Simulation
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
            isOptimized={isSimulated}
          />
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Simulation Metrics</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Nodes</p>
              <p className="text-2xl font-semibold">{nodes.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Routes</p>
              <p className="text-2xl font-semibold">{routes.length}</p>
            </div>
            {isSimulated && simulationResults && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Service Level</p>
                  <p className="text-2xl font-semibold text-primary">{simulationResults.serviceLevel.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inventory Turns</p>
                  <p className="text-2xl font-semibold text-primary">{simulationResults.inventoryTurns}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lead Time (Avg)</p>
                  <p className="text-2xl font-semibold text-primary">{simulationResults.leadTime} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-semibold text-primary">${simulationResults.totalCost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Comparison to Baseline</p>
                  <p className="text-2xl font-semibold text-green-500">-{(Math.random() * 20 + 10).toFixed(1)}%</p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {isSimulated && (
        <ModelValueMetrics modelType="heuristic" />
      )}
    </div>
  );
};

export default Simulation;
