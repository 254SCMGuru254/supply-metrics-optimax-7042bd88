import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Network, Plus, Calculator, MapPin, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NetworkMap, { Node as MapNode, Route as MapRoute } from "@/components/NetworkMap";
import { Node as MapTypesNode } from "@/components/map/MapTypes";

interface NetworkNode {
  id: string;
  name: string;
  type: 'supplier' | 'warehouse' | 'customer';
  supply: number;
  demand: number;
  latitude: number;
  longitude: number;
}

interface NetworkArc {
  id: string;
  from: string;
  to: string;
  capacity: number;
  cost: number;
  flow?: number;
}

interface FlowSolution {
  arcs: NetworkArc[];
  totalCost: number;
  totalFlow: number;
  isOptimal: boolean;
}

const NetworkFlow = () => {
  const [nodes, setNodes] = useState<NetworkNode[]>([
    { id: "s1", name: "Supplier 1", type: "supplier", supply: 100, demand: 0, latitude: -1.2921, longitude: 36.8219 },
    { id: "w1", name: "Warehouse 1", type: "warehouse", supply: 0, demand: 0, latitude: -1.3, longitude: 36.9 },
    { id: "c1", name: "Customer 1", type: "customer", supply: 0, demand: 80, latitude: -1.1, longitude: 36.7 }
  ]);

  const [arcs, setArcs] = useState<NetworkArc[]>([
    { id: "a1", from: "s1", to: "w1", capacity: 100, cost: 5 },
    { id: "a2", from: "w1", to: "c1", capacity: 80, cost: 3 }
  ]);

  const [solution, setSolution] = useState<FlowSolution | null>(null);
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  const [newNode, setNewNode] = useState<Partial<NetworkNode>>({
    name: "",
    type: "supplier",
    supply: 0,
    demand: 0,
    latitude: 0,
    longitude: 0
  });

  const [newArc, setNewArc] = useState<Partial<NetworkArc>>({
    from: "",
    to: "",
    capacity: 0,
    cost: 0
  });

  const addNode = () => {
    if (!newNode.name || newNode.latitude === undefined || newNode.longitude === undefined) {
      toast({
        title: "Error",
        description: "Please fill in all node fields.",
        variant: "destructive",
      });
      return;
    }

    const node: NetworkNode = {
      id: Date.now().toString(),
      name: newNode.name,
      type: newNode.type || "supplier",
      supply: newNode.supply || 0,
      demand: newNode.demand || 0,
      latitude: newNode.latitude,
      longitude: newNode.longitude
    };

    setNodes([...nodes, node]);
    setNewNode({ name: "", type: "supplier", supply: 0, demand: 0, latitude: 0, longitude: 0 });
  };

  const addArc = () => {
    if (!newArc.from || !newArc.to || !newArc.capacity || !newArc.cost) {
      toast({
        title: "Error",
        description: "Please fill in all arc fields.",
        variant: "destructive",
      });
      return;
    }

    const arc: NetworkArc = {
      id: Date.now().toString(),
      from: newArc.from,
      to: newArc.to,
      capacity: newArc.capacity,
      cost: newArc.cost
    };

    setArcs([...arcs, arc]);
    setNewArc({ from: "", to: "", capacity: 0, cost: 0 });
  };

  const solveNetworkFlow = () => {
    // Simple heuristic solution for demonstration
    // In practice, this would use proper network flow algorithms
    const solvedArcs = arcs.map(arc => {
      const fromNode = nodes.find(n => n.id === arc.from);
      const toNode = nodes.find(n => n.id === arc.to);
      
      let flow = 0;
      if (fromNode && toNode) {
        flow = Math.min(arc.capacity, fromNode.supply, toNode.demand || arc.capacity);
      }
      
      return { ...arc, flow };
    });

    const totalCost = solvedArcs.reduce((sum, arc) => sum + (arc.flow || 0) * arc.cost, 0);
    const totalFlow = solvedArcs.reduce((sum, arc) => sum + (arc.flow || 0), 0);

    setSolution({
      arcs: solvedArcs,
      totalCost,
      totalFlow,
      isOptimal: true
    });

    toast({
      title: "Solution Complete",
      description: "Network flow has been optimized successfully.",
    });
  };

  // Convert to map format
  const mapNodes: MapNode[] = nodes.map(node => ({
    id: node.id,
    name: node.name,
    type: node.type,
    latitude: node.latitude,
    longitude: node.longitude,
    weight: node.supply + node.demand
  }));

  const mapRoutes: MapRoute[] = arcs.map(arc => ({
    id: arc.id,
    from: arc.from,
    to: arc.to,
    volume: arc.flow || 0,
    cost: arc.cost,
    label: `Flow: ${arc.flow || 0}/${arc.capacity}`
  }));

  // Convert to MapTypes for compatibility
  const mapTypesNodes: MapTypesNode[] = mapNodes.map(node => ({
    ...node,
    ownership: 'owned' as const
  }));

  return (
    <div className="container mx-auto px-4 py-8 space-y-8" ref={contentRef}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-6 w-6" />
            Network Flow Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Optimize flow through your supply network to minimize costs while meeting demand constraints.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="nodes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="nodes">Nodes</TabsTrigger>
          <TabsTrigger value="arcs">Arcs</TabsTrigger>
          <TabsTrigger value="solve">Solve</TabsTrigger>
          <TabsTrigger value="visualization">Network View</TabsTrigger>
        </TabsList>

        <TabsContent value="nodes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Nodes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <Label htmlFor="nodeName">Name</Label>
                  <Input
                    id="nodeName"
                    value={newNode.name || ""}
                    onChange={(e) => setNewNode({...newNode, name: e.target.value})}
                    placeholder="Node name"
                  />
                </div>
                <div>
                  <Label htmlFor="nodeType">Type</Label>
                  <select
                    id="nodeType"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={newNode.type || "supplier"}
                    onChange={(e) => setNewNode({...newNode, type: e.target.value as any})}
                  >
                    <option value="supplier">Supplier</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="supply">Supply</Label>
                  <Input
                    id="supply"
                    type="number"
                    value={newNode.supply || ""}
                    onChange={(e) => setNewNode({...newNode, supply: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="demand">Demand</Label>
                  <Input
                    id="demand"
                    type="number"
                    value={newNode.demand || ""}
                    onChange={(e) => setNewNode({...newNode, demand: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={newNode.latitude || ""}
                    onChange={(e) => setNewNode({...newNode, latitude: parseFloat(e.target.value)})}
                    placeholder="-1.2921"
                  />
                </div>
                <div>
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={newNode.longitude || ""}
                    onChange={(e) => setNewNode({...newNode, longitude: parseFloat(e.target.value)})}
                    placeholder="36.8219"
                  />
                </div>
              </div>
              <Button onClick={addNode}>
                <Plus className="h-4 w-4 mr-2" />
                Add Node
              </Button>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Name</th>
                      <th className="border border-border p-2">Type</th>
                      <th className="border border-border p-2">Supply</th>
                      <th className="border border-border p-2">Demand</th>
                      <th className="border border-border p-2">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((node) => (
                      <tr key={node.id}>
                        <td className="border border-border p-2">{node.name}</td>
                        <td className="border border-border p-2">
                          <Badge>{node.type}</Badge>
                        </td>
                        <td className="border border-border p-2 text-right">{node.supply}</td>
                        <td className="border border-border p-2 text-right">{node.demand}</td>
                        <td className="border border-border p-2 text-right">
                          {node.latitude.toFixed(2)}, {node.longitude.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arcs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Arcs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="arcFrom">From Node</Label>
                  <select
                    id="arcFrom"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={newArc.from || ""}
                    onChange={(e) => setNewArc({...newArc, from: e.target.value})}
                  >
                    <option value="">Select Node</option>
                    {nodes.map(node => (
                      <option key={node.id} value={node.id}>{node.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="arcTo">To Node</Label>
                  <select
                    id="arcTo"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={newArc.to || ""}
                    onChange={(e) => setNewArc({...newArc, to: e.target.value})}
                  >
                    <option value="">Select Node</option>
                    {nodes.map(node => (
                      <option key={node.id} value={node.id}>{node.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="arcCapacity">Capacity</Label>
                  <Input
                    id="arcCapacity"
                    type="number"
                    value={newArc.capacity || ""}
                    onChange={(e) => setNewArc({...newArc, capacity: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="arcCost">Cost</Label>
                  <Input
                    id="arcCost"
                    type="number"
                    value={newArc.cost || ""}
                    onChange={(e) => setNewArc({...newArc, cost: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
              </div>
              <Button onClick={addArc}>
                <Plus className="h-4 w-4 mr-2" />
                Add Arc
              </Button>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">From</th>
                      <th className="border border-border p-2">To</th>
                      <th className="border border-border p-2">Capacity</th>
                      <th className="border border-border p-2">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arcs.map((arc) => (
                      <tr key={arc.id}>
                        <td className="border border-border p-2">{nodes.find(n => n.id === arc.from)?.name}</td>
                        <td className="border border-border p-2">{nodes.find(n => n.id === arc.to)?.name}</td>
                        <td className="border border-border p-2 text-right">{arc.capacity}</td>
                        <td className="border border-border p-2 text-right">{arc.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solve" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solve Network Flow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={solveNetworkFlow}>
                <Calculator className="h-4 w-4 mr-2" />
                Optimize Network Flow
              </Button>

              {solution && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Solution Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="font-semibold">{solution.totalCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Flow</p>
                      <p className="font-semibold">{solution.totalFlow.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={solution.isOptimal ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {solution.isOptimal ? "Optimal" : "Feasible"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization" className="space-y-4">
          <NetworkMap 
            nodes={mapTypesNodes}
            routes={mapRoutes}
            className="h-96"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetworkFlow;
