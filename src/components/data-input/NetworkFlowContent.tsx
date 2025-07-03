
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Network, MapPin, Route } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NetworkFlowContentProps {
  projectId: string;
}

interface NetworkNode {
  id: string;
  name: string;
  type: string;
  capacity: number;
  latitude: number;
  longitude: number;
}

interface NetworkArc {
  id: string;
  from_node: string;
  to_node: string;
  capacity: number;
  cost: number;
  flow: number;
}

export const NetworkFlowContent = ({ projectId }: NetworkFlowContentProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [newNode, setNewNode] = useState({
    name: "",
    type: "supply",
    capacity: 0,
    latitude: 0,
    longitude: 0,
  });

  const [newArc, setNewArc] = useState({
    from_node: "",
    to_node: "",
    capacity: 0,
    cost: 0,
  });

  // Fetch network nodes
  const { data: nodes, isLoading: nodesLoading } = useQuery({
    queryKey: ['networkNodes', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supply_nodes')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!projectId,
  });

  // Fetch network routes (arcs)
  const { data: arcs, isLoading: arcsLoading } = useQuery({
    queryKey: ['networkArcs', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supply_routes')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!projectId,
  });

  // Add node mutation
  const addNodeMutation = useMutation({
    mutationFn: async (nodeData: typeof newNode) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('supply_nodes')
        .insert({
          ...nodeData,
          project_id: projectId,
          user_id: user.id,
          node_type: nodeData.type,
        })
        .select();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networkNodes', projectId] });
      toast({ title: "Success", description: "Network node added successfully." });
      setNewNode({
        name: "",
        type: "supply",
        capacity: 0,
        latitude: 0,
        longitude: 0,
      });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Add arc mutation
  const addArcMutation = useMutation({
    mutationFn: async (arcData: typeof newArc) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('supply_routes')
        .insert({
          project_id: projectId,
          user_id: user.id,
          origin_id: arcData.from_node,
          destination_id: arcData.to_node,
          capacity: arcData.capacity,
          cost_per_unit: arcData.cost,
        })
        .select();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networkArcs', projectId] });
      toast({ title: "Success", description: "Network arc added successfully." });
      setNewArc({
        from_node: "",
        to_node: "",
        capacity: 0,
        cost: 0,
      });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Update capacity mutation
  const updateCapacityMutation = useMutation({
    mutationFn: async ({ id, capacity }: { id: number, capacity: number }) => {
      const { data, error } = await supabase
        .from('supply_nodes')
        .update({ capacity })
        .eq('id', id.toString());

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networkNodes', projectId] });
      toast({ title: "Success", description: "Node capacity updated." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleCapacityChange = (id: number, newCapacity: string) => {
    const capacity = parseInt(newCapacity, 10);
    if (!isNaN(capacity)) {
      updateCapacityMutation.mutate({ id, capacity });
    }
  };

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    addNodeMutation.mutate(newNode);
  };

  const handleAddArc = (e: React.FormEvent) => {
    e.preventDefault();
    addArcMutation.mutate(newArc);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Network Flow Optimization</h2>
      <Tabs defaultValue="nodes">
        <TabsList className="mb-6">
          <TabsTrigger value="nodes">Network Nodes</TabsTrigger>
          <TabsTrigger value="arcs">Network Arcs</TabsTrigger>
          <TabsTrigger value="flow">Flow Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="nodes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Node Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Add Network Node
                </CardTitle>
                <CardDescription>Configure supply/demand nodes in your network</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddNode} className="space-y-4">
                  <div>
                    <Label htmlFor="node-name">Node Name</Label>
                    <Input
                      id="node-name"
                      value={newNode.name}
                      onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="node-type">Node Type</Label>
                    <Select
                      value={newNode.type}
                      onValueChange={(value) => setNewNode({ ...newNode, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supply">Supply Node</SelectItem>
                        <SelectItem value="demand">Demand Node</SelectItem>
                        <SelectItem value="transshipment">Transshipment Node</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="node-capacity">Capacity/Demand</Label>
                    <Input
                      id="node-capacity"
                      type="number"
                      value={newNode.capacity}
                      onChange={(e) => setNewNode({ ...newNode, capacity: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="node-lat">Latitude</Label>
                      <Input
                        id="node-lat"
                        type="number"
                        step="any"
                        value={newNode.latitude}
                        onChange={(e) => setNewNode({ ...newNode, latitude: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="node-lng">Longitude</Label>
                      <Input
                        id="node-lng"
                        type="number"
                        step="any"
                        value={newNode.longitude}
                        onChange={(e) => setNewNode({ ...newNode, longitude: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={addNodeMutation.isPending} className="w-full">
                    {addNodeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Node
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Nodes List */}
            <Card>
              <CardHeader>
                <CardTitle>Network Nodes</CardTitle>
                <CardDescription>Manage your network nodes</CardDescription>
              </CardHeader>
              <CardContent>
                {nodesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Capacity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nodes?.map((node) => (
                        <TableRow key={node.id}>
                          <TableCell>{node.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{node.node_type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              defaultValue={node.capacity || 0}
                              className="w-24"
                              onBlur={(e) => handleCapacityChange(parseInt(node.id), e.target.value)}
                              disabled={updateCapacityMutation.isPending}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="arcs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Arc Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Add Network Arc
                </CardTitle>
                <CardDescription>Configure connections between nodes</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddArc} className="space-y-4">
                  <div>
                    <Label htmlFor="from-node">From Node</Label>
                    <Select
                      value={newArc.from_node}
                      onValueChange={(value) => setNewArc({ ...newArc, from_node: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source node" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes?.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.name} ({node.node_type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="to-node">To Node</Label>
                    <Select
                      value={newArc.to_node}
                      onValueChange={(value) => setNewArc({ ...newArc, to_node: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination node" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes?.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.name} ({node.node_type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="arc-capacity">Arc Capacity</Label>
                    <Input
                      id="arc-capacity"
                      type="number"
                      value={newArc.capacity}
                      onChange={(e) => setNewArc({ ...newArc, capacity: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="arc-cost">Cost per Unit</Label>
                    <Input
                      id="arc-cost"
                      type="number"
                      step="0.01"
                      value={newArc.cost}
                      onChange={(e) => setNewArc({ ...newArc, cost: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={addArcMutation.isPending} className="w-full">
                    {addArcMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Arc
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Arcs List */}
            <Card>
              <CardHeader>
                <CardTitle>Network Arcs</CardTitle>
                <CardDescription>Manage network connections</CardDescription>
              </CardHeader>
              <CardContent>
                {arcsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>From → To</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Cost/Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {arcs?.map((arc) => {
                        const fromNode = nodes?.find(n => n.id === arc.origin_id);
                        const toNode = nodes?.find(n => n.id === arc.destination_id);
                        return (
                          <TableRow key={arc.id}>
                            <TableCell>
                              {fromNode?.name || 'Unknown'} → {toNode?.name || 'Unknown'}
                            </TableCell>
                            <TableCell>{arc.capacity}</TableCell>
                            <TableCell>${arc.cost_per_unit}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="flow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Flow Analysis
              </CardTitle>
              <CardDescription>Analyze current flow patterns in your network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 border rounded">
                  <h3 className="text-lg font-semibold">Total Supply</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {nodes?.filter(n => n.node_type === 'supply').reduce((sum, n) => sum + (n.capacity || 0), 0) || 0}
                  </p>
                </div>
                <div className="text-center p-4 border rounded">
                  <h3 className="text-lg font-semibold">Total Demand</h3>
                  <p className="text-2xl font-bold text-red-600">
                    {nodes?.filter(n => n.node_type === 'demand').reduce((sum, n) => sum + (n.demand || 0), 0) || 0}
                  </p>
                </div>
                <div className="text-center p-4 border rounded">
                  <h3 className="text-lg font-semibold">Network Balance</h3>
                  <p className="text-2xl font-bold text-green-600">Balanced</p>
                </div>
              </div>
              
              <div className="text-center">
                <Button size="lg">
                  Analyze Flow Patterns
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Network Flow Optimization</CardTitle>
              <CardDescription>Optimize flow through your network to minimize costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Optimization Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Objective</Label>
                      <Select defaultValue="minimize-cost">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimize-cost">Minimize Total Cost</SelectItem>
                          <SelectItem value="maximize-flow">Maximize Flow</SelectItem>
                          <SelectItem value="minimize-time">Minimize Transit Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Algorithm</Label>
                      <Select defaultValue="simplex">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simplex">Simplex Method</SelectItem>
                          <SelectItem value="network-simplex">Network Simplex</SelectItem>
                          <SelectItem value="min-cost-flow">Min-Cost Flow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Constraints</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="capacity-constraints" defaultChecked />
                      <Label htmlFor="capacity-constraints">Capacity Constraints</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="demand-constraints" defaultChecked />
                      <Label htmlFor="demand-constraints">Demand Satisfaction</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="supply-constraints" defaultChecked />
                      <Label htmlFor="supply-constraints">Supply Limits</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button size="lg" className="w-full md:w-auto">
                  <Network className="mr-2 h-4 w-4" />
                  Run Optimization
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
