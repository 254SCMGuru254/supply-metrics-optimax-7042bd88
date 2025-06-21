import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, LineChart, Line } from 'recharts';
import { NetworkMap } from '@/components/NetworkMap';
import { Node, InventoryItem } from '@/components/map/MapTypes';

// Mock data (replace with actual data fetching)
const mockNodes: Node[] = [
  { id: '1', name: 'Nairobi Warehouse', type: 'warehouse', latitude: -1.2921, longitude: 36.8219, ownership: 'owned' },
  { id: '2', name: 'Mombasa Port', type: 'port', latitude: -4.0435, longitude: 39.6682, ownership: 'owned' },
  { id: '3', name: 'Kisumu Distribution', type: 'distribution', latitude: -0.0917, longitude: 34.7680, ownership: 'owned' },
  { id: '4', name: 'Eldoret Store', type: 'retail', latitude: 0.5143, longitude: 35.2698, ownership: 'owned' },
];

const mockInventory: InventoryItem[] = [
  { id: 'item1', name: 'Product A', nodeId: '1', unitCost: 100, annualDemand: 1200, orderingCost: 50, holdingCost: 0.2 },
  { id: 'item2', name: 'Product B', nodeId: '1', unitCost: 150, annualDemand: 800, orderingCost: 60, holdingCost: 0.25 },
  { id: 'item3', name: 'Product C', nodeId: '2', unitCost: 200, annualDemand: 600, orderingCost: 70, holdingCost: 0.3 },
  { id: 'item4', name: 'Product D', nodeId: '3', unitCost: 50, annualDemand: 2400, orderingCost: 40, holdingCost: 0.15 },
  { id: 'item5', name: 'Product E', nodeId: '4', unitCost: 300, annualDemand: 300, orderingCost: 100, holdingCost: 0.35 },
];

export const InventoryOptimizationContent = () => {
  const [nodes] = useState<Node[]>(mockNodes);
  const [inventory] = useState<InventoryItem[]>(mockInventory);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

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
                      <span className="font-mono">Value: KES {(item.unitCost * item.annualDemand).toLocaleString()}</span>
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
