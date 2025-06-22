import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, LineChart, Line } from 'recharts';
import { NetworkMap } from '@/components/NetworkMap';
import { Node, InventoryItem } from '@/components/map/MapTypes';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export const InventoryOptimizationContent = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data: nodesData, error: nodesError } = await supabase
          .from('supply_nodes')
          .select('*')
          .eq('user_id', user.id);
        
        const { data: inventoryData, error: inventoryError } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('user_id', user.id);

        if (nodesError) throw nodesError;
        if (inventoryError) throw inventoryError;

        setNodes(nodesData.map(n => ({ ...n, type: n.node_type || 'warehouse' })) || []);
        setInventory(inventoryData || []);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };

  const filteredInventory = useMemo(() => {
    if (!selectedNode) return inventory;
    return inventory.filter(item => item.nodeId === selectedNode.id);
  }, [selectedNode, inventory]);

  const inventoryValueByLocation = useMemo(() => {
    return nodes.map(node => {
      const value = inventory
        .filter(item => item.nodeId === node.id)
        .reduce((sum, item) => sum + (item.unitCost * item.annualDemand), 0);
      return { name: node.name, value };
    });
  }, [nodes, inventory]);

  if(loading) {
    return <div className="text-center p-8">Loading inventory data...</div>
  }

  if(nodes.length === 0 || inventory.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardHeader><CardTitle>No Inventory Data</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4">You need to add locations and inventory items to get started.</p>
          <Link to="/data-input"><Button><PlusCircle className="mr-2 h-4 w-4" /> Add Inventory Data</Button></Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle>Inventory Location Map</CardTitle>
          </CardHeader>
          <CardContent>
            <NetworkMap 
              nodes={nodes}
              routes={[]}
              onNodeClick={handleNodeClick}
              highlightNodes={selectedNode ? [selectedNode.id] : []}
            />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Inventory Value by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={inventoryValueByLocation}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedNode ? `Inventory at ${selectedNode.name}` : 'All Inventory Items'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[250px] overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {filteredInventory.map(item => (
                  <li key={item.id} className="py-2">
                    <div className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-mono">Value: KES {(item.unitCost * (item.annualDemand || 0)).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {selectedNode && (
              <Button onClick={() => setSelectedNode(null)} className="mt-4 w-full">
                Show All Locations
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
