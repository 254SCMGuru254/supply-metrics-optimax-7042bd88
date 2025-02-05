import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/components/ui/use-toast";

const Simulation = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isSimulated, setIsSimulated] = useState(false);
  const { toast } = useToast();

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
    toast({
      title: "Simulation Complete",
      description: "Network simulation has been completed successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Supply Chain Simulation</h1>
          <p className="text-muted-foreground mt-2">
            Simulate and analyze supply chain scenarios to optimize performance.
          </p>
        </div>
        <Button onClick={handleSimulate} disabled={nodes.length < 2}>
          Run Simulation
        </Button>
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
        </div>
      </Card>
    </div>
  );
};

export default Simulation;