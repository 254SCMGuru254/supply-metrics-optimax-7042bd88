import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NetworkMap } from '@/components/NetworkMap';
import { Node, Route } from '@/components/map/MapTypes';
import { Plus, Trash, Play } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link } from 'react-router-dom';

export const RouteOptimizationContent = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNodes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('supply_nodes')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const formattedNodes: Node[] = data.map(n => ({
        id: n.id,
        name: n.name,
        type: n.node_type || 'customer',
        latitude: n.latitude,
        longitude: n.longitude,
        demand: n.demand || 0,
        ownership: 'owned'
      }));
      setNodes(formattedNodes);
    } catch (error) {
      console.error("Error fetching nodes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, [user]);

  const handleAddNode = async () => {
    if (!user) return;
    const newNodeData = {
      user_id: user.id,
      name: `New Customer #${Math.floor(Math.random() * 1000)}`,
      node_type: 'customer',
      latitude: -1.28 + (Math.random() - 0.5) * 0.1,
      longitude: 36.82 + (Math.random() - 0.5) * 0.1,
      demand: Math.floor(Math.random() * 20) + 5,
    };

    const { data, error } = await supabase
      .from('supply_nodes')
      .insert([newNodeData])
      .select();

    if (error) {
      console.error('Error adding node:', error);
    } else if (data) {
      fetchNodes(); // Re-fetch nodes to update the list
    }
  };

  const handleRemoveNode = async (nodeId: string) => {
    const { error } = await supabase
      .from('supply_nodes')
      .delete()
      .eq('id', nodeId);
    
    if(error) {
      console.error("Error deleting node:", error);
    } else {
      setNodes(nodes.filter(n => n.id !== nodeId));
    }
  };
  
  const handleOptimize = () => {
    // Basic TSP-like optimization (nearest neighbor)
    const unvisited = [...nodes.filter(n => n.type === 'customer')];
    const optimizedRoute: Node[] = [nodes.find(n => n.type === 'warehouse')!];
    let currentNode = optimizedRoute[0];

    while(unvisited.length > 0) {
      let nearestNeighbor: Node | null = null;
      let minDistance = Infinity;

      unvisited.forEach(neighbor => {
        const distance = Math.sqrt(
          Math.pow(currentNode.latitude - neighbor.latitude, 2) + 
          Math.pow(currentNode.longitude - neighbor.longitude, 2)
        );
        if(distance < minDistance) {
          minDistance = distance;
          nearestNeighbor = neighbor;
        }
      });

      if(nearestNeighbor) {
        optimizedRoute.push(nearestNeighbor);
        currentNode = nearestNeighbor;
        unvisited.splice(unvisited.indexOf(nearestNeighbor), 1);
      }
    }
    
    // Create route segments
    const newRoutes: Route[] = [];
    for(let i=0; i < optimizedRoute.length - 1; i++) {
        newRoutes.push({
            id: `r-${i}`,
            from: optimizedRoute[i].id,
            to: optimizedRoute[i+1].id,
            ownership: 'owned',
            color: '#3b82f6'
        });
    }
    // Add route back to warehouse
    newRoutes.push({
        id: 'r-final',
        from: optimizedRoute[optimizedRoute.length - 1].id,
        to: optimizedRoute[0].id,
        ownership: 'owned',
        color: '#a855f7'
    });

    setRoutes(newRoutes);
    setIsOptimized(true);
  };
  
  const handleReset = () => {
    setRoutes([]);
    setIsOptimized(false);
  }

  if (loading) {
    return <div className="text-center p-8">Loading node data...</div>
  }

  if (nodes.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardHeader><CardTitle>No locations to optimize</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4">You need to add some locations (warehouses, customers) before you can optimize a route.</p>
          <Link to="/data-input"><Button><Plus className="mr-2 h-4 w-4" /> Add Location Data</Button></Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
        <Card className="h-[700px]">
           <NetworkMap 
            nodes={nodes}
            routes={routes}
          />
        </Card>
      </div>
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={handleOptimize} disabled={isOptimized}><Play className="mr-2 h-4 w-4"/> Optimize</Button>
            <Button onClick={handleReset} variant="outline" disabled={!isOptimized}>Reset</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAddNode} size="sm" className="mb-4"><Plus className="mr-2 h-4 w-4"/>Add Random Node</Button>
            <div className="max-h-[480px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Demand</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nodes.map(node => (
                    <TableRow key={node.id}>
                      <TableCell>{node.name}</TableCell>
                      <TableCell>{node.type}</TableCell>
                      <TableCell>{node.demand || 'N/A'}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveNode(node.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
