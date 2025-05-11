
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { Truck, Package, Database, Info, Boxes, Settings, ArrowDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

interface SupplyChainNode {
  id: string;
  name: string;
  type: "supplier" | "dc" | "warehouse" | "retail";
  tier: number;
  leadTime: number;
  demandMean: number;
  demandStd: number;
  serviceLevel: number;
  inventoryLevel: number;
  safetyStock: number;
  optimalInventory?: number;
  parentId?: string;
}

export const MultiEchelonVisualization = () => {
  const { toast } = useToast();
  const [optimized, setOptimized] = useState(false);
  
  const [nodes, setNodes] = useState<SupplyChainNode[]>([
    {
      id: "supplier1",
      name: "Raw Materials Supplier",
      type: "supplier",
      tier: 1,
      leadTime: 14,
      demandMean: 1000,
      demandStd: 200,
      serviceLevel: 0.95,
      inventoryLevel: 2000,
      safetyStock: 500
    },
    {
      id: "dc1",
      name: "Central Distribution Center",
      type: "dc",
      tier: 2,
      leadTime: 7,
      demandMean: 800,
      demandStd: 150,
      serviceLevel: 0.97,
      inventoryLevel: 1600,
      safetyStock: 400,
      parentId: "supplier1"
    },
    {
      id: "wh1",
      name: "Regional Warehouse 1",
      type: "warehouse",
      tier: 3,
      leadTime: 3,
      demandMean: 400,
      demandStd: 80,
      serviceLevel: 0.95,
      inventoryLevel: 800,
      safetyStock: 200,
      parentId: "dc1"
    },
    {
      id: "wh2",
      name: "Regional Warehouse 2",
      type: "warehouse",
      tier: 3,
      leadTime: 4,
      demandMean: 350,
      demandStd: 70,
      serviceLevel: 0.95,
      inventoryLevel: 700,
      safetyStock: 180,
      parentId: "dc1"
    },
    {
      id: "retail1",
      name: "Retail Store 1",
      type: "retail",
      tier: 4,
      leadTime: 1,
      demandMean: 150,
      demandStd: 30,
      serviceLevel: 0.98,
      inventoryLevel: 300,
      safetyStock: 90,
      parentId: "wh1"
    },
    {
      id: "retail2",
      name: "Retail Store 2",
      type: "retail",
      tier: 4,
      leadTime: 1,
      demandMean: 200,
      demandStd: 40,
      serviceLevel: 0.99,
      inventoryLevel: 400,
      safetyStock: 120,
      parentId: "wh1"
    },
    {
      id: "retail3",
      name: "Retail Store 3",
      type: "retail",
      tier: 4,
      leadTime: 1,
      demandMean: 170,
      demandStd: 35,
      serviceLevel: 0.97,
      inventoryLevel: 340,
      safetyStock: 100,
      parentId: "wh2"
    },
    {
      id: "retail4",
      name: "Retail Store 4",
      type: "retail",
      tier: 4,
      leadTime: 2,
      demandMean: 180,
      demandStd: 36,
      serviceLevel: 0.96,
      inventoryLevel: 360,
      safetyStock: 105,
      parentId: "wh2"
    }
  ]);
  
  const [systemServiceLevel, setSystemServiceLevel] = useState<number>(0.95);
  const [inventoryHoldingCost, setInventoryHoldingCost] = useState<number>(0.25);
  
  // Selected node state for detailed view
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('dc1');
  
  const getNodeIcon = (type: SupplyChainNode['type']) => {
    switch (type) {
      case 'supplier':
        return <Truck className="h-6 w-6" />;
      case 'dc':
        return <Database className="h-6 w-6" />;
      case 'warehouse':
        return <Package className="h-6 w-6" />;
      case 'retail':
        return <Boxes className="h-6 w-6" />;
    }
  };
  
  const getNodeColor = (type: SupplyChainNode['type']) => {
    switch (type) {
      case 'supplier':
        return 'bg-amber-500';
      case 'dc':
        return 'bg-blue-500';
      case 'warehouse':
        return 'bg-green-500';
      case 'retail':
        return 'bg-purple-500';
    }
  };
  
  const getTextColor = (type: SupplyChainNode['type']) => {
    switch (type) {
      case 'supplier':
        return 'text-amber-500';
      case 'dc':
        return 'text-blue-500';
      case 'warehouse':
        return 'text-green-500';
      case 'retail':
        return 'text-purple-500';
    }
  };
  
  const calculateOptimalInventory = (node: SupplyChainNode, useRiskPooling: boolean = true): number => {
    const leadTime = node.leadTime;
    
    // Get children nodes to consider demand aggregation
    const childNodes = nodes.filter(n => n.parentId === node.id);
    
    // Calculate total demand and variance across children (if any)
    let totalDemand = node.demandMean;
    let totalVariance = Math.pow(node.demandStd, 2);
    
    // Consider demand from children for non-retail nodes
    if (childNodes.length > 0) {
      totalDemand = childNodes.reduce((sum, child) => sum + child.demandMean, 0);
      
      // Calculate variance
      if (useRiskPooling) {
        // Risk pooling - consider correlation effects
        // This is a simplified implementation of risk pooling
        // In practice, we would use covariance matrix of demands
        const poolingEffect = 0.7; // 0.7 represents partial correlation
        totalVariance = childNodes.reduce((sum, child) => {
          return sum + Math.pow(child.demandStd * poolingEffect, 2);
        }, 0);
      } else {
        // No risk pooling - just sum the variances
        totalVariance = childNodes.reduce((sum, child) => {
          return sum + Math.pow(child.demandStd, 2);
        }, 0);
      }
    }
    
    // Convert service level to z-score (simplified approximation)
    let zScore = 1.65; // Default z-score for 95% service level
    if (node.serviceLevel >= 0.99) zScore = 2.33;
    else if (node.serviceLevel >= 0.98) zScore = 2.05;
    else if (node.serviceLevel >= 0.97) zScore = 1.88;
    else if (node.serviceLevel >= 0.96) zScore = 1.75;
    else if (node.serviceLevel >= 0.95) zScore = 1.65;
    else if (node.serviceLevel >= 0.90) zScore = 1.28;
    else if (node.serviceLevel >= 0.85) zScore = 1.04;
    else if (node.serviceLevel >= 0.80) zScore = 0.84;
    
    // Calculate safety stock using lead time demand standard deviation
    const leadTimeDemandStd = Math.sqrt(totalVariance * leadTime);
    const safetyStock = Math.round(zScore * leadTimeDemandStd);
    
    // Calculate cycle stock (simplified - using square root of EOQ)
    const cycleStock = Math.round(Math.sqrt(totalDemand * leadTime));
    
    // Total optimal inventory = cycle stock + safety stock
    return cycleStock + safetyStock;
  };

  const runOptimization = () => {
    try {
      // Update nodes with optimized inventory levels
      const optimizedNodes = nodes.map(node => {
        const optimalInventory = calculateOptimalInventory(node, true);
        
        return {
          ...node,
          optimalInventory
        };
      });
      
      setNodes(optimizedNodes);
      setOptimized(true);
      
      toast({
        title: "Optimization Complete",
        description: "Multi-echelon inventory has been optimized."
      });
    } catch (error) {
      console.error("Optimization error:", error);
      toast({
        title: "Optimization Error",
        description: "An error occurred during multi-echelon optimization.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateNode = (nodeId: string, field: keyof SupplyChainNode, value: any) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, [field]: value } : node
    ));
  };

  const renderSupplyChainNetwork = () => {
    // Group nodes by tier
    const nodesByTier = nodes.reduce((acc, node) => {
      if (!acc[node.tier]) acc[node.tier] = [];
      acc[node.tier].push(node);
      return acc;
    }, {} as Record<number, SupplyChainNode[]>);
    
    // Render tiers
    return Object.entries(nodesByTier)
      .sort(([tierA], [tierB]) => Number(tierA) - Number(tierB))
      .map(([tier, tierNodes]) => (
        <div key={tier} className="mb-6">
          <h3 className="text-lg font-medium mb-4">Tier {tier}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tierNodes.map(node => (
              <Card 
                key={node.id} 
                className={`p-4 border-l-4 ${
                  selectedNodeId === node.id ? 'ring-2 ring-primary' : ''
                }`}
                style={{ borderLeftColor: getNodeColor(node.type).replace('bg-', '') }}
                onClick={() => setSelectedNodeId(node.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${getNodeColor(node.type)} bg-opacity-20`}>
                      {getNodeIcon(node.type)}
                    </div>
                    <h4 className="font-medium">{node.name}</h4>
                  </div>
                </div>
                
                <div className="space-y-1 mt-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Inventory:</span>
                    <span className="font-medium">{node.inventoryLevel} units</span>
                  </div>
                  
                  {optimized && node.optimalInventory && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Optimal Inventory:</span>
                      <span className={
                        node.optimalInventory < node.inventoryLevel ? 'font-medium text-green-600' : 
                          node.optimalInventory > node.inventoryLevel ? 'font-medium text-red-600' : 'font-medium'
                      }>
                        {node.optimalInventory} units
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Safety Stock:</span>
                    <span className="font-medium">{node.safetyStock} units</span>
                  </div>
                </div>
                
                {node.parentId && (
                  <div className="flex items-center justify-center mt-3">
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ));
  };

  // Get selected node details
  const selectedNode = selectedNodeId ? nodes.find(node => node.id === selectedNodeId) : null;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Database className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Multi-Echelon Inventory Visualization</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Optimize inventory levels across multiple tiers of your supply chain network using 
          multi-echelon inventory theory and risk pooling principles.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
            <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Risk Pooling Benefits</h3>
            <p className="text-sm text-muted-foreground">
              Centralization of inventory across the supply chain reduces overall variability 
              and required safety stock.
            </p>
          </Card>
          <Card className="p-4 bg-green-50 dark:bg-green-900/20">
            <h3 className="font-medium text-green-700 dark:text-green-300 mb-2">Service Level Balancing</h3>
            <p className="text-sm text-muted-foreground">
              Adjust service levels strategically at each echelon to minimize total inventory while 
              meeting customer requirements.
            </p>
          </Card>
          <Card className="p-4 bg-purple-50 dark:bg-purple-900/20">
            <h3 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Lead Time Impact</h3>
            <p className="text-sm text-muted-foreground">
              Understand how lead times at each tier affect inventory requirements and 
              identify bottlenecks in the supply chain.
            </p>
          </Card>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Network Overview</h3>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Network Settings
            </Button>
            <Button onClick={runOptimization} disabled={optimized}>
              Optimize Inventory
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="systemServiceLevel">System Service Level: {(systemServiceLevel * 100).toFixed(0)}%</Label>
                </div>
                <Slider 
                  id="systemServiceLevel"
                  value={[systemServiceLevel * 100]} 
                  min={80} 
                  max={99} 
                  step={1}
                  onValueChange={([val]) => setSystemServiceLevel(val / 100)} 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="holdingCost">Inventory Holding Cost Rate: {(inventoryHoldingCost * 100).toFixed(0)}%</Label>
                </div>
                <Slider 
                  id="holdingCost"
                  value={[inventoryHoldingCost * 100]} 
                  min={10} 
                  max={50} 
                  step={1}
                  onValueChange={([val]) => setInventoryHoldingCost(val / 100)} 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border p-4 rounded-md mb-8 bg-muted/20">
          {renderSupplyChainNetwork()}
        </div>
        
        {selectedNode && (
          <div className="bg-muted/20 border rounded-md p-4">
            <h3 className="text-lg font-medium flex items-center space-x-2 mb-4">
              <div className={`p-1.5 rounded-full ${getNodeColor(selectedNode.type)} bg-opacity-30`}>
                {getNodeIcon(selectedNode.type)}
              </div>
              <span>Node Details: {selectedNode.name}</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="name">Node Name</Label>
                  <Input 
                    id="name" 
                    value={selectedNode.name} 
                    onChange={(e) => handleUpdateNode(selectedNode.id, 'name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="type">Node Type</Label>
                  <Select 
                    value={selectedNode.type}
                    onValueChange={(value) => handleUpdateNode(selectedNode.id, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="dc">Distribution Center</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="retail">Retail Store</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="leadTime">Lead Time (days)</Label>
                  <Input 
                    id="leadTime"
                    type="number"
                    value={selectedNode.leadTime} 
                    onChange={(e) => handleUpdateNode(selectedNode.id, 'leadTime', Number(e.target.value))}
                    min="1"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="serviceLevel">Service Level (%)</Label>
                  <Input 
                    id="serviceLevel"
                    type="number"
                    value={selectedNode.serviceLevel * 100} 
                    onChange={(e) => handleUpdateNode(selectedNode.id, 'serviceLevel', Number(e.target.value) / 100)}
                    min="70"
                    max="99.9"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="demandMean">Mean Demand</Label>
                  <Input 
                    id="demandMean"
                    type="number"
                    value={selectedNode.demandMean} 
                    onChange={(e) => handleUpdateNode(selectedNode.id, 'demandMean', Number(e.target.value))}
                    min="0"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="demandStd">Demand StdDev</Label>
                  <Input 
                    id="demandStd"
                    type="number"
                    value={selectedNode.demandStd} 
                    onChange={(e) => handleUpdateNode(selectedNode.id, 'demandStd', Number(e.target.value))}
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            {optimized && selectedNode.optimalInventory && (
              <div className="mt-6 p-4 border rounded-md bg-primary/5">
                <h4 className="font-medium mb-3">Optimization Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Inventory</p>
                    <p className="text-xl font-bold">{selectedNode.inventoryLevel} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Optimal Inventory</p>
                    <p className="text-xl font-bold">{selectedNode.optimalInventory} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Adjustment</p>
                    <p className={`text-xl font-bold ${
                      selectedNode.optimalInventory < selectedNode.inventoryLevel 
                        ? 'text-green-600'
                        : selectedNode.optimalInventory > selectedNode.inventoryLevel
                          ? 'text-red-600'
                          : ''
                    }`}>
                      {selectedNode.optimalInventory < selectedNode.inventoryLevel ? '-' : '+'}{Math.abs(selectedNode.optimalInventory - selectedNode.inventoryLevel)} units
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
      
      <Card className="p-6 bg-muted/50">
        <div className="flex items-start space-x-3">
          <Info className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="text-lg font-medium">About Multi-Echelon Inventory Optimization</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Multi-echelon inventory optimization considers the entire supply chain network as an integrated system 
              rather than optimizing each node in isolation. This approach utilizes risk pooling principles and 
              recognizes that inventory decisions at one level affect other levels.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h4 className="text-sm font-medium mb-2">Mathematical Models:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>Clark-Scarf Model:</strong> Base stock policy in serial systems</li>
                <li><strong>METRIC (Multi-Echelon Technique for Recoverable Item Control):</strong> For repair inventory systems</li>
                <li><strong>Strategic Safety Stock Placement:</strong> Graves-Willems model for general networks</li>
                <li><strong>Risk Pooling Effect:</strong> σ<sub>pooled</sub> = σ × √(1 + ρ(n-1))/n where ρ is correlation and n is number of locations</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
