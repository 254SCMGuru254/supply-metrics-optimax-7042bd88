import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Node = {
  id: number;
  name: string;
  capacity: number;
};

type Route = {
  id: number;
  origin_id: number;
  destination_id: number;
  cost_per_unit: number;
  min_flow: number;
  max_flow: number;
  nodes: { name: string }; // Origin
  destination_node: { name: string }; // Destination
};

interface NetworkFlowContentProps {
  projectId: string;
}

export const NetworkFlowContent = ({ projectId }: NetworkFlowContentProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: nodes, isLoading: isLoadingNodes } = useQuery<Node[]>({
    queryKey: ['nodesForNetwork', projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from('nodes').select('id, name, capacity').eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!projectId,
  });

  const { data: routes, isLoading: isLoadingRoutes } = useQuery<Route[]>({
    queryKey: ['routesForNetwork', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select('*, nodes!origin_id(name), destination_node:nodes!destination_id(name)')
        .eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data.map(r => ({ ...r, min_flow: 0, max_flow: r.capacity || 1000 }));
    },
    enabled: !!projectId,
  });

  const [localRoutes, setLocalRoutes] = useState<Route[]>([]);

  useEffect(() => {
    if(routes) {
      setLocalRoutes(routes);
    }
  }, [routes]);

  const updateNodeCapacityMutation = useMutation({
    mutationFn: async ({ id, capacity }: { id: number; capacity: number }) => {
      const { error } = await supabase.from('nodes').update({ capacity }).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodesForNetwork', projectId] });
      toast({ title: 'Success', description: 'Node capacity updated.' });
    },
    onError: (error: any) => toast({ title: 'Error', description: error.message, variant: 'destructive' }),
  });

  const updateRouteCostMutation = useMutation({
    mutationFn: async ({ id, cost_per_unit }: { id: number; cost_per_unit: number }) => {
      const { error } = await supabase.from('routes').update({ cost_per_unit }).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routesForNetwork', projectId] });
      toast({ title: 'Success', description: 'Route cost updated.' });
    },
    onError: (error: any) => toast({ title: 'Error', description: error.message, variant: 'destructive' }),
  });

  const handleCapacityChange = (id: number, capacity: string) => {
    const newCapacity = parseInt(capacity, 10);
    if (!isNaN(newCapacity)) {
      updateNodeCapacityMutation.mutate({ id, capacity: newCapacity });
    }
  };
  
  const handleCostChange = (id: number, cost: string) => {
    const newCost = parseFloat(cost);
    if (!isNaN(newCost)) {
      updateRouteCostMutation.mutate({ id, cost_per_unit: newCost });
    }
  };

  const handleFlowChange = (routeId: number, key: 'min_flow' | 'max_flow', value: string) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
      setLocalRoutes(prevRoutes => 
        prevRoutes.map(r => 
          r.id === routeId ? { ...r, [key]: numericValue } : r
        )
      );
      toast({ title: "Updated locally", description: "Flow constraint updated in local state." });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Network Flow Data</h2>
      <Tabs defaultValue="capacities">
        <TabsList className="mb-6">
          <TabsTrigger value="capacities">Node Capacities</TabsTrigger>
          <TabsTrigger value="flow-constraints">Flow Constraints</TabsTrigger>
          <TabsTrigger value="cost-matrix">Cost Matrix</TabsTrigger>
        </TabsList>
        <TabsContent value="capacities">
          <p className="text-muted-foreground mb-4">
            Define capacity constraints for each node in the network.
          </p>
          <div className="mb-4 flex justify-between">
            <h3 className="text-lg font-medium">Node Capacities</h3>
            <Button variant="outline" size="sm">Import Data</Button>
          </div>
          {isLoadingNodes ? (
            <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Node Name</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nodes?.map((node) => (
                  <TableRow key={node.id}>
                    <TableCell>{node.name}</TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        defaultValue={node.capacity} 
                        className="w-24"
                        onBlur={(e) => handleCapacityChange(node.id, e.target.value)}
                        disabled={updateNodeCapacityMutation.isLoading}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" disabled>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        <TabsContent value="flow-constraints">
          <p className="text-muted-foreground mb-4">
            Set minimum and maximum flow constraints for each route in the network.
          </p>
          <div className="mb-4 flex justify-between">
            <h3 className="text-lg font-medium">Flow Constraints</h3>
            <Button variant="outline" size="sm">Add Constraint</Button>
          </div>
          {isLoadingRoutes ? (
            <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Min Flow</TableHead>
                  <TableHead>Max Flow</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>{route.nodes.name}</TableCell>
                    <TableCell>{route.destination_node.name}</TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        defaultValue={route.min_flow} 
                        className="w-20"
                        onBlur={(e) => handleFlowChange(route.id, 'min_flow', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        defaultValue={route.max_flow} 
                        className="w-20"
                        onBlur={(e) => handleFlowChange(route.id, 'max_flow', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" disabled>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        <TabsContent value="cost-matrix">
          <p className="text-muted-foreground mb-4">
            Upload or define a cost matrix for transportation between nodes.
          </p>
          <div className="mb-4 flex justify-between">
            <h3 className="text-lg font-medium">Transportation Cost Matrix</h3>
            <div className="space-x-2">
              <Button variant="outline" size="sm">Import CSV</Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
          {isLoadingRoutes ? (
             <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Cost per Unit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes?.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>{route.nodes?.name}</TableCell>
                    <TableCell>{route.destination_node?.name}</TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        defaultValue={route.cost_per_unit} 
                        className="w-24"
                        onBlur={(e) => handleCostChange(route.id, e.target.value)}
                        disabled={updateRouteCostMutation.isLoading}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" disabled>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};
