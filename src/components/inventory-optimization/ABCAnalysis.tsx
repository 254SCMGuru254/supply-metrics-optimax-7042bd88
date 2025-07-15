
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Settings
} from 'lucide-react';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  unitCost: number;
  annualDemand: number;
  annualValue: number;
  classification?: 'A' | 'B' | 'C';
  cumulativePercentage?: number;
}

interface ABCAnalysisProps {
  projectId: string;
}

export const ABCAnalysis: React.FC<ABCAnalysisProps> = ({ projectId }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState({
    sku: '',
    name: '',
    unitCost: 0,
    annualDemand: 0
  });

  // Sample data for demonstration
  useEffect(() => {
    const sampleItems: InventoryItem[] = [
      { id: '1', sku: 'SKU001', name: 'Product A', unitCost: 100, annualDemand: 1000, annualValue: 100000 },
      { id: '2', sku: 'SKU002', name: 'Product B', unitCost: 50, annualDemand: 800, annualValue: 40000 },
      { id: '3', sku: 'SKU003', name: 'Product C', unitCost: 200, annualDemand: 300, annualValue: 60000 },
      { id: '4', sku: 'SKU004', name: 'Product D', unitCost: 25, annualDemand: 1200, annualValue: 30000 },
      { id: '5', sku: 'SKU005', name: 'Product E', unitCost: 150, annualDemand: 400, annualValue: 60000 },
    ];
    
    setItems(performABCAnalysis(sampleItems));
  }, []);

  const performABCAnalysis = (itemList: InventoryItem[]): InventoryItem[] => {
    // Calculate annual value for each item
    const itemsWithValue = itemList.map(item => ({
      ...item,
      annualValue: item.unitCost * item.annualDemand
    }));

    // Sort by annual value in descending order
    const sortedItems = itemsWithValue.sort((a, b) => b.annualValue - a.annualValue);

    // Calculate total value
    const totalValue = sortedItems.reduce((sum, item) => sum + item.annualValue, 0);

    // Calculate cumulative percentages and classify
    let cumulativeValue = 0;
    return sortedItems.map((item, index) => {
      cumulativeValue += item.annualValue;
      const cumulativePercentage = (cumulativeValue / totalValue) * 100;
      
      let classification: 'A' | 'B' | 'C';
      if (cumulativePercentage <= 80) {
        classification = 'A';
      } else if (cumulativePercentage <= 95) {
        classification = 'B';
      } else {
        classification = 'C';
      }

      return {
        ...item,
        cumulativePercentage,
        classification
      };
    });
  };

  const addItem = () => {
    if (newItem.sku && newItem.name && newItem.unitCost > 0 && newItem.annualDemand > 0) {
      const item: InventoryItem = {
        id: Date.now().toString(),
        sku: newItem.sku,
        name: newItem.name,
        unitCost: newItem.unitCost,
        annualDemand: newItem.annualDemand,
        annualValue: newItem.unitCost * newItem.annualDemand
      };
      
      const updatedItems = performABCAnalysis([...items, item]);
      setItems(updatedItems);
      setNewItem({ sku: '', name: '', unitCost: 0, annualDemand: 0 });
    }
  };

  // Prepare data for charts
  const classificationSummary = items.reduce((acc, item) => {
    const key = item.classification!;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<'A' | 'B' | 'C', number>);

  const pieData = Object.entries(classificationSummary).map(([name, count]) => ({
    name,
    count,
    color: name === 'A' ? '#ef4444' : name === 'B' ? '#f59e0b' : '#10b981'
  }));

  const barData = items.map(item => ({
    name: item.sku,
    value: item.annualValue,
    classification: item.classification
  }));

  const getClassificationColor = (classification: 'A' | 'B' | 'C') => {
    switch (classification) {
      case 'A': return 'bg-red-100 text-red-800 border-red-200';
      case 'B': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'C': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            ABC Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Classify inventory items based on their annual consumption value to optimize inventory management strategies.
          </p>
        </CardContent>
      </Card>

      {/* Add New Item */}
      <Card>
        <CardHeader>
          <CardTitle>Add Inventory Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={newItem.sku}
                onChange={(e) => setNewItem(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="Enter SKU"
              />
            </div>
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <Label htmlFor="unitCost">Unit Cost (KES)</Label>
              <Input
                id="unitCost"
                type="number"
                value={newItem.unitCost}
                onChange={(e) => setNewItem(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="annualDemand">Annual Demand</Label>
              <Input
                id="annualDemand"
                type="number"
                value={newItem.annualDemand}
                onChange={(e) => setNewItem(prev => ({ ...prev, annualDemand: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
          </div>
          <Button onClick={addItem} className="mt-4">
            Add Item
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classification Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Classification Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Value Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Annual Value by Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">SKU</th>
                  <th className="border border-border p-2 text-left">Product Name</th>
                  <th className="border border-border p-2 text-right">Unit Cost</th>
                  <th className="border border-border p-2 text-right">Annual Demand</th>
                  <th className="border border-border p-2 text-right">Annual Value</th>
                  <th className="border border-border p-2 text-center">Classification</th>
                  <th className="border border-border p-2 text-right">Cumulative %</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50">
                    <td className="border border-border p-2 font-mono">{item.sku}</td>
                    <td className="border border-border p-2">{item.name}</td>
                    <td className="border border-border p-2 text-right">KES {item.unitCost.toLocaleString()}</td>
                    <td className="border border-border p-2 text-right">{item.annualDemand.toLocaleString()}</td>
                    <td className="border border-border p-2 text-right">KES {item.annualValue.toLocaleString()}</td>
                    <td className="border border-border p-2 text-center">
                      <Badge className={getClassificationColor(item.classification!)}>
                        {item.classification}
                      </Badge>
                    </td>
                    <td className="border border-border p-2 text-right">
                      {item.cumulativePercentage?.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Class A Items</p>
                <p className="text-2xl font-bold text-red-600">
                  {classificationSummary.A || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              High value items (80% of total value)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Class B Items</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {classificationSummary.B || 0}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Medium value items (15% of total value)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Class C Items</p>
                <p className="text-2xl font-bold text-green-600">
                  {classificationSummary.C || 0}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Low value items (5% of total value)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ABCAnalysis;
