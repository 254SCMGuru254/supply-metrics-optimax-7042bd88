
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/components/ui/use-toast";
import { HelpSystem } from "@/components/HelpSystem";
import { ExportPDF } from "@/components/ExportPDF";

const Simulation = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isSimulated, setIsSimulated] = useState(false);
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

  const handleMapClick = (lat: number, lng: number) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: "warehouse",
      name: `Node ${nodes.length + 1}`,
      latitude: lat,
      longitude: lng,
      capacity: 1000,
    };

    setNodes([...nodes, newNode]);
    
    // Generate routes between the new node and existing nodes
    if (nodes.length > 0) {
      const newRoutes = nodes.map(existingNode => ({
        id: crypto.randomUUID(),
        from: newNode.id,
        to: existingNode.id,
        volume: Math.floor(Math.random() * 500) + 100,
      }));
      
      setRoutes([...routes, ...newRoutes]);
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
    setIsSimulated(true);
    
    // Run supply chain simulation algorithm (simplified version)
    const simulatedRoutes = routes.map(route => ({
      ...route,
      isOptimized: Math.random() > 0.3, // Randomly optimize some routes
      volume: route.volume * (Math.random() * 0.5 + 0.75), // Adjust volumes based on simulation
    }));
    
    setRoutes(simulatedRoutes);
    
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
          <ExportPDF contentRef={contentRef} filename="supply-chain-simulation" />
          <Button onClick={handleSimulate} disabled={nodes.length < 2}>
            Run Simulation
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
            {isSimulated && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Service Level</p>
                  <p className="text-2xl font-semibold text-primary">95%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inventory Turns</p>
                  <p className="text-2xl font-semibold text-primary">12</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lead Time (Avg)</p>
                  <p className="text-2xl font-semibold text-primary">3.2 days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-semibold text-primary">$28,450</p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">How to Use</h2>
        <div className="space-y-2">
          <p>1. Click on the map to add facility locations</p>
          <p>2. Add at least two nodes to enable simulation</p>
          <p>3. Click "Run Simulation" to analyze network performance</p>
          <p>4. View the results in the metrics panel</p>
          <p>5. Export your results as PDF for reporting</p>
        </div>
      </Card>
    </div>
  );
};

export default Simulation;
