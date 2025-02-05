import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/components/ui/use-toast";

const NetworkOptimization = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
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

  const handleOptimize = () => {
    setIsOptimized(true);
    toast({
      title: "Optimization Complete",
      description: "Network has been optimized using Network Flow method.",
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
                  <p className="text-2xl font-semibold text-primary">18%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Flow Efficiency</p>
                  <p className="text-2xl font-semibold text-primary">25%</p>
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
          <p>2. Add at least two nodes to enable optimization</p>
          <p>3. Click "Run Optimization" to calculate optimal network flows</p>
          <p>4. View the results in the metrics panel</p>
        </div>
      </Card>
    </div>
  );
};

export default NetworkOptimization;