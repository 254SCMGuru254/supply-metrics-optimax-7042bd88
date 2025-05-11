
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Boxes, Warehouse, Home, Truck, Settings2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EchelonNode {
  id: string;
  name: string;
  echelon: number;
  leadTime: number;
  serviceLevel: number;
  safetyStock: number;
  baseStock: number;
  demand: number;
  children?: string[];
}

export const MultiEchelonVisualization = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("visualization");
  const [nodes, setNodes] = useState<EchelonNode[]>([
    { 
      id: "dc1", 
      name: "Distribution Center", 
      echelon: 1, 
      leadTime: 10, 
      serviceLevel: 98, 
      safetyStock: 200,
      baseStock: 800,
      demand: 0,
      children: ["rw1", "rw2"] 
    },
    { 
      id: "rw1", 
      name: "Regional Warehouse 1", 
      echelon: 2, 
      leadTime: 5, 
      serviceLevel: 95, 
      safetyStock: 100,
      baseStock: 400,
      demand: 0,
      children: ["s1", "s2"] 
    },
    { 
      id: "rw2", 
      name: "Regional Warehouse 2", 
      echelon: 2, 
      leadTime: 6, 
      serviceLevel: 95, 
      safetyStock: 120,
      baseStock: 450,
      demand: 0,
      children: ["s3", "s4"] 
    },
    { 
      id: "s1", 
      name: "Store 1", 
      echelon: 3, 
      leadTime: 2, 
      serviceLevel: 92, 
      safetyStock: 30,
      baseStock: 120,
      demand: 40
    },
    { 
      id: "s2", 
      name: "Store 2", 
      echelon: 3, 
      leadTime: 2, 
      serviceLevel: 92, 
      safetyStock: 35,
      baseStock: 140,
      demand: 45
    },
    { 
      id: "s3", 
      name: "Store 3", 
      echelon: 3, 
      leadTime: 3, 
      serviceLevel: 92, 
      safetyStock: 40,
      baseStock: 150,
      demand: 50
    },
    { 
      id: "s4", 
      name: "Store 4", 
      echelon: 3, 
      leadTime: 2, 
      serviceLevel: 92, 
      safetyStock: 25,
      baseStock: 110,
      demand: 35
    }
  ]);
  
  const [newNode, setNewNode] = useState<{
    name: string;
    echelon: number;
    leadTime: number;
    serviceLevel: number;
    safetyStock: number;
    baseStock: number;
    demand: number;
    parentId: string;
  }>({
    name: "",
    echelon: 3,
    leadTime: 2,
    serviceLevel: 92,
    safetyStock: 30,
    baseStock: 100,
    demand: 40,
    parentId: ""
  });

  // Calculate the base stock levels using Clark-Scarf model (simplified version)
  const optimizeInventoryLevels = () => {
    // Copy nodes for manipulation
    const updatedNodes = [...nodes];
    
    // First, calculate demand at each echelon by aggregating from downstream nodes
    // Start with leaf nodes (stores, echelon 3)
    const calculateAggregateDemand = (nodeId: string): number => {
      const node = updatedNodes.find(n => n.id === nodeId);
      if (!node) return 0;
      
      // If node has children, calculate demand as sum of children's demands
      if (node.children && node.children.length > 0) {
        const childrenDemand = node.children.reduce((sum, childId) => {
          return sum + calculateAggregateDemand(childId);
        }, 0);
        
        node.demand = childrenDemand;
        return childrenDemand;
      }
      
      // Leaf node - use its own demand
      return node.demand;
    };
    
    // Start calculation from top echelon
    const topNodes = updatedNodes.filter(n => n.echelon === 1);
    topNodes.forEach(node => {
      calculateAggregateDemand(node.id);
    });
    
    // Calculate safety stock and base stock levels using square root law for risk pooling
    const calculateSafetyStock = (nodeId: string): void => {
      const node = updatedNodes.find(n => n.id === nodeId);
      if (!node) return;
      
      // Z-score based on service level
      let zScore = 1.28; // 90% service level
      if (node.serviceLevel >= 95) zScore = 1.645;
      if (node.serviceLevel >= 98) zScore = 2.05;
      
      // For demonstration purpose, use simplified calculation
      // In a real system, would need to account for demand distribution, lead time variability, etc.
      
      // Calculate standard deviation of demand
      // Assume standard deviation is 20% of average demand
      const stdDev = node.demand * 0.2;
      
      // Safety stock = Z-score * std dev * sqrt(lead time)
      node.safetyStock = Math.round(zScore * stdDev * Math.sqrt(node.leadTime));
      
      // Base stock = Average demand during lead time + safety stock
      // Assume daily demand = annual demand / 365
      const dailyDemand = node.demand / 365;
      node.baseStock = Math.round((dailyDemand * node.leadTime) + node.safetyStock);
      
      // Calculate for children
      if (node.children && node.children.length > 0) {
        node.children.forEach(childId => {
          calculateSafetyStock(childId);
        });
      }
    };
    
    // Calculate starting from top nodes
    topNodes.forEach(node => {
      calculateSafetyStock(node.id);
    });
    
    setNodes(updatedNodes);
    
    toast({
      title: "Inventory Optimization Complete",
      description: "Multi-echelon inventory levels have been optimized using Clark-Scarf model principles"
    });
  };

  const handleAddNode = () => {
    if (!newNode.name || !newNode.parentId) {
      toast({
        title: "Invalid Input",
        description: "Node name and parent node are required",
        variant: "destructive"
      });
      return;
    }
    
    // Find parent node
    const parentNode = nodes.find(n => n.id === newNode.parentId);
    if (!parentNode) {
      toast({
        title: "Invalid Parent",
        description: "Selected parent node not found",
        variant: "destructive"
      });
      return;
    }
    
    // Create new node
    const nodeId = `node${Date.now().toString().slice(-5)}`;
    const newEchelonNode: EchelonNode = {
      id: nodeId,
      name: newNode.name,
      echelon: parentNode.echelon + 1,
      leadTime: newNode.leadTime,
      serviceLevel: newNode.serviceLevel,
      safetyStock: newNode.safetyStock,
      baseStock: newNode.baseStock,
      demand: newNode.demand
    };
    
    // Update parent's children
    const updatedParent: EchelonNode = {
      ...parentNode,
      children: [...(parentNode.children || []), nodeId]
    };
    
    // Update nodes state
    const updatedNodes = nodes.map(n => 
      n.id === parentNode.id ? updatedParent : n
    );
    
    setNodes([...updatedNodes, newEchelonNode]);
    
    // Reset form
    setNewNode({
      name: "",
      echelon: 3,
      leadTime: 2,
      serviceLevel: 92,
      safetyStock: 30,
      baseStock: 100,
      demand: 40,
      parentId: ""
    });
    
    toast({
      title: "Node Added",
      description: `${newNode.name} has been added to the supply chain network`
    });
  };

  const renderEchelonNetwork = () => {
    // Group nodes by echelon
    const echelonGroups: { [key: number]: EchelonNode[] } = {};
    nodes.forEach(node => {
      if (!echelonGroups[node.echelon]) {
        echelonGroups[node.echelon] = [];
      }
      echelonGroups[node.echelon].push(node);
    });
    
    // Determine maximum echelon level
    const maxEchelon = Math.max(...nodes.map(n => n.echelon));
    
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md overflow-auto">
        <div className="min-w-[800px]">
          {/* Render echelon levels */}
          {Array.from({ length: maxEchelon }, (_, i) => i + 1).map(level => (
            <div key={level} className="mb-8">
              <div className="mb-2 text-sm font-medium text-muted-foreground">
                Echelon {level}: {getEchelonName(level)}
              </div>
              
              <div className="flex justify-evenly">
                {(echelonGroups[level] || []).map(node => (
                  <div 
                    key={node.id} 
                    className="flex flex-col items-center"
                  >
                    {/* Node representation */}
                    <div 
                      className={`
                        w-40 p-3 rounded-md border-2 text-center
                        ${node.echelon === 1 ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800' : ''}
                        ${node.echelon === 2 ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : ''}
                        ${node.echelon === 3 ? 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800' : ''}
                      `}
                    >
                      <div className="flex justify-center mb-2">
                        {node.echelon === 1 && <Warehouse className="h-5 w-5 text-blue-500" />}
                        {node.echelon === 2 && <Boxes className="h-5 w-5 text-green-500" />}
                        {node.echelon === 3 && <Home className="h-5 w-5 text-amber-500" />}
                      </div>
                      <div className="font-medium text-sm">{node.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">Base: {node.baseStock}</div>
                      <div className="text-xs text-muted-foreground">Safety: {node.safetyStock}</div>
                    </div>
                    
                    {/* Connection lines to children */}
                    {(node.children && node.children.length > 0) && (
                      <>
                        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
                        <div className="flex items-center">
                          <div className="h-px bg-gray-300 dark:bg-gray-700" style={{ 
                            width: `${(node.children.length - 1) * 100}px` 
                          }}></div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getEchelonName = (level: number): string => {
    switch(level) {
      case 1: return "Distribution Centers";
      case 2: return "Regional Warehouses";
      case 3: return "Retail Stores";
      default: return `Level ${level}`;
    }
  };

  const getEchelonIcon = (level: number) => {
    switch(level) {
      case 1: return <Warehouse className="h-5 w-5" />;
      case 2: return <Boxes className="h-5 w-5" />;
      case 3: return <Home className="h-5 w-5" />;
      default: return <Settings2 className="h-5 w-5" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Truck className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold">Multi-Echelon Inventory Optimizer</h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="visualization">Network Visualization</TabsTrigger>
          <TabsTrigger value="management">Node Management</TabsTrigger>
          <TabsTrigger value="parameters">Optimization Parameters</TabsTrigger>
        </TabsList>
      </Tabs>

      <TabsContent value="visualization" className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg font-semibold">Supply Chain Network</h4>
            <p className="text-sm text-muted-foreground">
              Multi-echelon inventory visualization with calculated stock levels
            </p>
          </div>
          <Button onClick={optimizeInventoryLevels}>
            Optimize Inventory Levels
          </Button>
        </div>
        
        {renderEchelonNetwork()}
      </TabsContent>

      <TabsContent value="management" className="space-y-6">
        <h4 className="text-lg font-semibold">Add Node to Network</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="node-name">Node Name</Label>
            <Input
              id="node-name"
              value={newNode.name}
              onChange={(e) => setNewNode({...newNode, name: e.target.value})}
              placeholder="Location name"
            />
          </div>
          
          <div>
            <Label htmlFor="parent-node">Parent Node</Label>
            <select
              id="parent-node"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={newNode.parentId}
              onChange={(e) => setNewNode({...newNode, parentId: e.target.value})}
            >
              <option value="">Select parent node...</option>
              {nodes.filter(n => n.echelon < 3).map(node => (
                <option key={node.id} value={node.id}>{node.name} (Echelon {node.echelon})</option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="lead-time">Lead Time (days)</Label>
            <Input
              id="lead-time"
              type="number"
              min="1"
              value={newNode.leadTime}
              onChange={(e) => setNewNode({...newNode, leadTime: Number(e.target.value)})}
            />
          </div>
          
          <div>
            <Label htmlFor="service-level">Service Level (%)</Label>
            <Input
              id="service-level"
              type="number"
              min="80"
              max="99.9"
              value={newNode.serviceLevel}
              onChange={(e) => setNewNode({...newNode, serviceLevel: Number(e.target.value)})}
            />
          </div>
          
          <div>
            <Label htmlFor="demand">Daily Demand (units)</Label>
            <Input
              id="demand"
              type="number"
              min="0"
              value={newNode.demand}
              onChange={(e) => setNewNode({...newNode, demand: Number(e.target.value)})}
            />
          </div>
          
          <div className="flex items-end">
            <Button onClick={handleAddNode} className="w-full">Add to Network</Button>
          </div>
        </div>

        <div className="pt-4 border-t mt-4">
          <h4 className="text-lg font-semibold mb-4">Network Nodes</h4>
          <div className="space-y-2">
            {Array.from({ length: Math.max(...nodes.map(n => n.echelon)) }, (_, i) => i + 1).map(echelon => (
              <div key={echelon} className="space-y-2">
                <h5 className="font-medium flex items-center gap-2 text-sm">
                  {getEchelonIcon(echelon)}
                  {getEchelonName(echelon)}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {nodes
                    .filter(node => node.echelon === echelon)
                    .map(node => (
                      <div key={node.id} className="border rounded-md p-3 text-sm">
                        <div className="font-medium">{node.name}</div>
                        <div className="grid grid-cols-2 gap-x-4 mt-2 text-xs text-muted-foreground">
                          <div>Lead Time:</div>
                          <div>{node.leadTime} days</div>
                          <div>Service Level:</div>
                          <div>{node.serviceLevel}%</div>
                          <div>Base Stock:</div>
                          <div>{node.baseStock} units</div>
                          <div>Safety Stock:</div>
                          <div>{node.safetyStock} units</div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="parameters" className="space-y-6">
        <h4 className="text-lg font-semibold">Optimization Parameters</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h5 className="font-semibold mb-3">Inventory Policy</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="policy-type">Policy Type</Label>
                <select
                  id="policy-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  defaultValue="base-stock"
                >
                  <option value="base-stock">Base Stock Policy</option>
                  <option value="s-S">Min-Max (s, S) Policy</option>
                  <option value="q-r">Reorder Point (Q, r) Policy</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="review-period">Review Period</Label>
                <select
                  id="review-period"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  defaultValue="continuous"
                >
                  <option value="continuous">Continuous Review</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                </select>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <h5 className="font-semibold mb-3">Optimization Model</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="model-type">Model Type</Label>
                <select
                  id="model-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  defaultValue="clark-scarf"
                >
                  <option value="clark-scarf">Clark-Scarf Model</option>
                  <option value="graves-willems">Graves-Willems Model</option>
                  <option value="metric">METRIC Model</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="cost-objective">Optimization Objective</Label>
                <select
                  id="cost-objective"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  defaultValue="total-cost"
                >
                  <option value="total-cost">Minimize Total Cost</option>
                  <option value="service-level">Maximize Service Level</option>
                  <option value="working-capital">Minimize Working Capital</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        <div className="pt-6 border-t mt-4">
          <h4 className="text-lg font-semibold mb-4">Advanced Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="demand-distribution">Demand Distribution</Label>
              <select
                id="demand-distribution"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                defaultValue="normal"
              >
                <option value="normal">Normal Distribution</option>
                <option value="poisson">Poisson Distribution</option>
                <option value="gamma">Gamma Distribution</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="lead-time-var">Lead Time Variability (%)</Label>
              <Input id="lead-time-var" type="number" defaultValue="20" />
            </div>
            
            <div>
              <Label htmlFor="backorder-cost">Backorder Cost ($/unit/day)</Label>
              <Input id="backorder-cost" type="number" defaultValue="5" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button onClick={optimizeInventoryLevels}>Apply & Optimize</Button>
        </div>
      </TabsContent>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-md">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">About Multi-Echelon Inventory Optimization</h4>
        <p className="text-sm text-muted-foreground">
          Multi-echelon inventory optimization manages stock across all supply chain tiers (distribution centers, warehouses, retail stores). 
          The system implements mathematical models like Clark-Scarf and Graves-Willems to determine optimal inventory levels at each stage,
          accounting for lead times, demand variability, and service levels. Key concepts include risk pooling, where centralized inventory 
          reduces total safety stock requirements, and service level propagation between tiers.
        </p>
      </div>
    </Card>
  );
};
