import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Network, Plus, Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthProvider";

interface NetworkCalculatorsProps {
  projectId: string;
}

// Define types for our data
type Node = { id: string; name: string; type: string; capacity?: number };
type Edge = { id: string; from_node: string; to_node: string; cost?: number; capacity?: number; };
type Commodity = { id: string; origin_node: string; destination_node: string; demand?: number };

export function NetworkCalculators({ projectId }: NetworkCalculatorsProps) {
  const [activeTab, setActiveTab] = useState("nodes");
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  // --- DATA FETCHING ---
  const { data: nodes = [], isLoading: isLoadingNodes } = useQuery<Node[]>({
    queryKey: ['networkNodes', projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from('nodes').select('*').eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!projectId,
  });

  const { data: edges = [], isLoading: isLoadingEdges } = useQuery<Edge[]>({
    queryKey: ['networkEdges', projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from('routes').select('id, from_node:from, to_node:to, cost, capacity').eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!projectId,
  });
  
  const { data: commodities = [], isLoading: isLoadingCommodities } = useQuery<Commodity[]>({
    queryKey: ['networkCommodities', projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from('commodities').select('*').eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!projectId,
  });

  // --- MUTATIONS ---
  const genericMutation = (tableName: string, queryKey: string) => {
    return useMutation({
      mutationFn: async (record: any) => {
        const { id, ...updates } = record;
        if (id) { // Update
          const { error } = await supabase.from(tableName).update(updates).eq('id', id);
          if (error) throw error;
        } else { // Insert
          const { error } = await supabase.from(tableName).insert([{ ...updates, project_id: projectId, user_id: user?.id }]);
          if (error) throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey, projectId] });
        toast({ title: `${tableName.slice(0, -1)} saved` });
      },
      onError: (error: Error) => {
        toast({ title: `Error saving ${tableName.slice(0, -1)}`, description: error.message, variant: "destructive" });
      },
    });
  };

  const genericDeleteMutation = (tableName: string, queryKey: string) => {
     return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from(tableName).delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey, projectId] });
            toast({ title: `${tableName.slice(0,-1)} deleted`});
        },
        onError: (error: Error) => {
             toast({ title: `Error deleting ${tableName.slice(0,-1)}`, description: error.message, variant: "destructive" });
        }
     });
  };

  const nodeMutation = genericMutation('nodes', 'networkNodes');
  const edgeMutation = genericMutation('routes', 'networkEdges');
  const commodityMutation = genericMutation('commodities', 'networkCommodities');
  
  const deleteNodeMutation = genericDeleteMutation('nodes', 'networkNodes');
  const deleteEdgeMutation = genericDeleteMutation('routes', 'networkEdges');
  const deleteCommodityMutation = genericDeleteMutation('commodities', 'networkCommodities');

  const handleNodeChange = (id: string, field: keyof Node, value: any) => {
    const node = nodes.find(n => n.id === id);
    if(node) {
        nodeMutation.mutate({ ...node, [field]: value });
    }
  };

  const handleEdgeChange = (id: string, field: keyof Edge, value: any) => {
    const edge = edges.find(e => e.id === id);
    if(edge) {
        edgeMutation.mutate({ ...edge, [field]: value });
    }
  };

  const handleCommodityChange = (id: string, field: keyof Commodity, value: any) => {
    const commodity = commodities.find(c => c.id === id);
    if(commodity) {
        commodityMutation.mutate({ ...commodity, [field]: value });
    }
  };

  const renderNodesTable = () => (
    <Table>
      <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Capacity</TableHead><TableHead/></TableRow></TableHeader>
      <TableBody>
        {nodes.map((node) => (
          <TableRow key={node.id}>
            <TableCell><Input value={node.name} onChange={e => handleNodeChange(node.id, 'name', e.target.value)} /></TableCell>
            <TableCell><Input value={node.type} onChange={e => handleNodeChange(node.id, 'type', e.target.value)} /></TableCell>
            <TableCell><Input type="number" value={node.capacity || ''} onChange={e => handleNodeChange(node.id, 'capacity', e.target.valueAsNumber)} /></TableCell>
            <TableCell><Button variant="ghost" size="icon" onClick={() => deleteNodeMutation.mutate(node.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderEdgesTable = () => (
    <Table>
       <TableHeader><TableRow><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Cost</TableHead><TableHead>Capacity</TableHead><TableHead/></TableRow></TableHeader>
       <TableBody>
        {edges.map(edge => (
            <TableRow key={edge.id}>
                <TableCell><Input value={edge.from_node} onChange={e => handleEdgeChange(edge.id, 'from_node', e.target.value)} /></TableCell>
                <TableCell><Input value={edge.to_node} onChange={e => handleEdgeChange(edge.id, 'to_node', e.target.value)}/></TableCell>
                <TableCell><Input type="number" value={edge.cost || ''} onChange={e => handleEdgeChange(edge.id, 'cost', e.target.valueAsNumber)}/></TableCell>
                <TableCell><Input type="number" value={edge.capacity || ''} onChange={e => handleEdgeChange(edge.id, 'capacity', e.target.valueAsNumber)}/></TableCell>
                <TableCell><Button variant="ghost" size="icon" onClick={() => deleteEdgeMutation.mutate(edge.id)}><Trash2 className="h-4 w-4"/></Button></TableCell>
            </TableRow>
        ))}
       </TableBody>
    </Table>
  );

  const renderCommoditiesTable = () => (
    <Table>
        <TableHeader><TableRow><TableHead>Origin</TableHead><TableHead>Destination</TableHead><TableHead>Demand</TableHead><TableHead/></TableRow></TableHeader>
        <TableBody>
            {commodities.map(com => (
                <TableRow key={com.id}>
                    <TableCell><Input value={com.origin_node} onChange={e => handleCommodityChange(com.id, 'origin_node', e.target.value)}/></TableCell>
                    <TableCell><Input value={com.destination_node} onChange={e => handleCommodityChange(com.id, 'destination_node', e.target.value)}/></TableCell>
                    <TableCell><Input type="number" value={com.demand || ''} onChange={e => handleCommodityChange(com.id, 'demand', e.target.valueAsNumber)}/></TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => deleteCommodityMutation.mutate(com.id)}><Trash2 className="h-4 w-4"/></Button></TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
  )

  const isLoading = isLoadingNodes || isLoadingEdges || isLoadingCommodities;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Data Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="nodes">Nodes</TabsTrigger>
            <TabsTrigger value="edges">Edges</TabsTrigger>
            <TabsTrigger value="commodities">Commodities</TabsTrigger>
          </TabsList>
          {isLoading ? <p>Loading network data...</p> : (
            <>
              <TabsContent value="nodes">
                <Button size="sm" className="my-2" onClick={() => nodeMutation.mutate({ name: 'New Node', type: 'warehouse' })}><Plus className="mr-2 h-4 w-4" /> Add Node</Button>
                {renderNodesTable()}
              </TabsContent>
              <TabsContent value="edges">
                <Button size="sm" className="my-2" onClick={() => edgeMutation.mutate({ from_node: nodes[0]?.id, to_node: nodes[1]?.id })} disabled={nodes.length < 2}><Plus className="mr-2 h-4 w-4" /> Add Edge</Button>
                {renderEdgesTable()}
              </TabsContent>
              <TabsContent value="commodities">
                <Button size="sm" className="my-2" onClick={() => commodityMutation.mutate({ origin_node: nodes[0]?.id, destination_node: nodes[1]?.id, demand: 100 })} disabled={nodes.length < 2}><Plus className="mr-2 h-4 w-4" /> Add Commodity</Button>
                {renderCommoditiesTable()}
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default NetworkCalculators;
