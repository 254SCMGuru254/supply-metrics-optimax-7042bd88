
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit, MapPin, Factory, Truck } from 'lucide-react';

interface SupplyChainNode {
  id: string;
  name: string;
  type: 'supplier' | 'warehouse' | 'distribution' | 'retail' | 'customer';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  capacity: number;
  holdingCost: number;
  orderingCost: number;
  leadTime: number;
  serviceLevel: number;
  demandPattern: 'constant' | 'seasonal' | 'volatile' | 'custom';
  demandParameters: {
    mean: number;
    variance: number;
    seasonality: number;
  };
  constraints: {
    minInventory: number;
    maxInventory: number;
    operatingHours: string;
    specialRequirements: string[];
  };
}

export function NodeConfigurationSystem() {
  const [nodes, setNodes] = useState<SupplyChainNode[]>([]);
  const [editingNode, setEditingNode] = useState<SupplyChainNode | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const createEmptyNode = (): SupplyChainNode => ({
    id: `node_${Date.now()}`,
    name: '',
    type: 'warehouse',
    location: {
      latitude: -1.2921,
      longitude: 36.8219,
      address: 'Nairobi, Kenya'
    },
    capacity: 1000,
    holdingCost: 0.2,
    orderingCost: 50,
    leadTime: 7,
    serviceLevel: 95,
    demandPattern: 'constant',
    demandParameters: {
      mean: 100,
      variance: 20,
      seasonality: 0.1
    },
    constraints: {
      minInventory: 0,
      maxInventory: 10000,
      operatingHours: '24/7',
      specialRequirements: []
    }
  });

  const addNode = () => {
    setEditingNode(createEmptyNode());
    setIsCreating(true);
  };

  const saveNode = () => {
    if (!editingNode) return;

    if (isCreating) {
      setNodes([...nodes, editingNode]);
      setIsCreating(false);
    } else {
      setNodes(nodes.map(n => n.id === editingNode.id ? editingNode : n));
    }
    setEditingNode(null);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
  };

  const editNode = (node: SupplyChainNode) => {
    setEditingNode({ ...node });
    setIsCreating(false);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'supplier': return Factory;
      case 'warehouse': return MapPin;
      case 'distribution': return Truck;
      case 'retail': return MapPin;
      case 'customer': return MapPin;
      default: return MapPin;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Supply Chain Node Configuration</span>
            <Button onClick={addNode}>
              <Plus className="h-4 w-4 mr-2" />
              Add Node
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map((node) => {
              const IconComponent = getNodeIcon(node.type);
              return (
                <Card key={node.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <h3 className="font-semibold truncate">{node.name || 'Unnamed Node'}</h3>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => editNode(node)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteNode(node.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline">{node.type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span>{node.capacity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Level:</span>
                        <span>{node.serviceLevel}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lead Time:</span>
                        <span>{node.leadTime} days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {editingNode && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Create New Node' : 'Edit Node'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="costs">Costs & Timing</TabsTrigger>
                <TabsTrigger value="demand">Demand Pattern</TabsTrigger>
                <TabsTrigger value="constraints">Constraints</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Node Name</Label>
                    <Input
                      value={editingNode.name}
                      onChange={(e) => setEditingNode({...editingNode, name: e.target.value})}
                      placeholder="Enter node name"
                    />
                  </div>
                  <div>
                    <Label>Node Type</Label>
                    <Select 
                      value={editingNode.type} 
                      onValueChange={(value: any) => setEditingNode({...editingNode, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="distribution">Distribution Center</SelectItem>
                        <SelectItem value="retail">Retail Store</SelectItem>
                        <SelectItem value="customer">Customer Zone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Capacity</Label>
                    <Input
                      type="number"
                      value={editingNode.capacity}
                      onChange={(e) => setEditingNode({...editingNode, capacity: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label>Service Level (%)</Label>
                    <Input
                      type="number"
                      value={editingNode.serviceLevel}
                      onChange={(e) => setEditingNode({...editingNode, serviceLevel: parseInt(e.target.value) || 95})}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={editingNode.location.address}
                      onChange={(e) => setEditingNode({
                        ...editingNode, 
                        location: {...editingNode.location, address: e.target.value}
                      })}
                      placeholder="Enter address"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="costs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Holding Cost Rate</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingNode.holdingCost}
                      onChange={(e) => setEditingNode({...editingNode, holdingCost: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label>Ordering Cost</Label>
                    <Input
                      type="number"
                      value={editingNode.orderingCost}
                      onChange={(e) => setEditingNode({...editingNode, orderingCost: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label>Lead Time (days)</Label>
                    <Input
                      type="number"
                      value={editingNode.leadTime}
                      onChange={(e) => setEditingNode({...editingNode, leadTime: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="demand">
                <div className="space-y-4">
                  <div>
                    <Label>Demand Pattern</Label>
                    <Select 
                      value={editingNode.demandPattern} 
                      onValueChange={(value: any) => setEditingNode({...editingNode, demandPattern: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="constant">Constant</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                        <SelectItem value="volatile">Volatile</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Mean Demand</Label>
                      <Input
                        type="number"
                        value={editingNode.demandParameters.mean}
                        onChange={(e) => setEditingNode({
                          ...editingNode,
                          demandParameters: {
                            ...editingNode.demandParameters,
                            mean: parseInt(e.target.value) || 0
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Variance</Label>
                      <Input
                        type="number"
                        value={editingNode.demandParameters.variance}
                        onChange={(e) => setEditingNode({
                          ...editingNode,
                          demandParameters: {
                            ...editingNode.demandParameters,
                            variance: parseInt(e.target.value) || 0
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Seasonality Factor</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editingNode.demandParameters.seasonality}
                        onChange={(e) => setEditingNode({
                          ...editingNode,
                          demandParameters: {
                            ...editingNode.demandParameters,
                            seasonality: parseFloat(e.target.value) || 0
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="constraints">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Minimum Inventory</Label>
                    <Input
                      type="number"
                      value={editingNode.constraints.minInventory}
                      onChange={(e) => setEditingNode({
                        ...editingNode,
                        constraints: {
                          ...editingNode.constraints,
                          minInventory: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Maximum Inventory</Label>
                    <Input
                      type="number"
                      value={editingNode.constraints.maxInventory}
                      onChange={(e) => setEditingNode({
                        ...editingNode,
                        constraints: {
                          ...editingNode.constraints,
                          maxInventory: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Operating Hours</Label>
                    <Input
                      value={editingNode.constraints.operatingHours}
                      onChange={(e) => setEditingNode({
                        ...editingNode,
                        constraints: {
                          ...editingNode.constraints,
                          operatingHours: e.target.value
                        }
                      })}
                      placeholder="e.g., 8:00-18:00 or 24/7"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 mt-6">
              <Button onClick={saveNode}>
                {isCreating ? 'Create Node' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => setEditingNode(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
