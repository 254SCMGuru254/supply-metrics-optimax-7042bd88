
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Package, 
  TrendingUp, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-react';

interface ABCAnalysisProps {
  projectId?: string;
}

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  annualDemand: number;
  unitCost: number;
  annualValue: number;
  classification: 'A' | 'B' | 'C';
  percentage: number;
  cumulativePercentage: number;
}

const ABCAnalysis: React.FC<ABCAnalysisProps> = ({ projectId }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState({
    sku: '',
    name: '',
    annualDemand: 0,
    unitCost: 0
  });

  // Sample data for demonstration
  const sampleItems = [
    { id: '1', sku: 'SKU001', name: 'Premium Product A', annualDemand: 5000, unitCost: 50 },
    { id: '2', sku: 'SKU002', name: 'Standard Product B', annualDemand: 3000, unitCost: 30 },
    { id: '3', sku: 'SKU003', name: 'Basic Product C', annualDemand: 8000, unitCost: 10 },
    { id: '4', sku: 'SKU004', name: 'Luxury Item D', annualDemand: 1000, unitCost: 100 },
    { id: '5', sku: 'SKU005', name: 'Bulk Item E', annualDemand: 10000, unitCost: 5 },
  ];

  useEffect(() => {
    performABCAnalysis(sampleItems);
  }, []);

  const performABCAnalysis = (rawItems: any[]) => {
    // Calculate annual value for each item
    const itemsWithValue = rawItems.map(item => ({
      ...item,
      annualValue: item.annualDemand * item.unitCost
    }));

    // Sort by annual value (descending)
    itemsWithValue.sort((a, b) => b.annualValue - a.annualValue);

    const totalValue = itemsWithValue.reduce((sum, item) => sum + item.annualValue, 0);
    let cumulativeValue = 0;

    // Classify items and calculate percentages
    const classifiedItems = itemsWithValue.map((item, index) => {
      cumulativeValue += item.annualValue;
      const percentage = (item.annualValue / totalValue) * 100;
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
        classification,
        percentage,
        cumulativePercentage
      };
    });

    setItems(classifiedItems);
  };

  const addItem = () => {
    if (newItem.sku && newItem.name && newItem.annualDemand && newItem.unitCost) {
      const updatedItems = [...items.map(item => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        annualDemand: item.annualDemand,
        unitCost: item.unitCost
      })), {
        id: Date.now().toString(),
        ...newItem
      }];
      
      performABCAnalysis(updatedItems);
      setNewItem({ sku: '', name: '', annualDemand: 0, unitCost: 0 });
    }
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id).map(item => ({
      id: item.id,
      sku: item.sku,
      name: item.name,
      annualDemand: item.annualDemand,
      unitCost: item.unitCost
    }));
    performABCAnalysis(updatedItems);
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'A': return '#FF6B6B';
      case 'B': return '#4ECDC4';
      case 'C': return '#45B7D1';
      default: return '#95A5A6';
    }
  };

  const classificationData = [
    {
      name: 'Class A',
      count: items.filter(item => item.classification === 'A').length,
      value: items.filter(item => item.classification === 'A').reduce((sum, item) => sum + item.annualValue, 0),
      color: '#FF6B6B'
    },
    {
      name: 'Class B',
      count: items.filter(item => item.classification === 'B').length,
      value: items.filter(item => item.classification === 'B').reduce((sum, item) => sum + item.annualValue, 0),
      color: '#4ECDC4'
    },
    {
      name: 'Class C',
      count: items.filter(item => item.classification === 'C').length,
      value: items.filter(item => item.classification === 'C').reduce((sum, item) => sum + item.annualValue, 0),
      color: '#45B7D1'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">ABC Analysis</h2>
        <p className="text-muted-foreground">
          Classify inventory items by value and importance
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Item Management</TabsTrigger>
          <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Classification Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, count }) => `${name}: ${count}`}
                    >
                      {classificationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [value, 'Items']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Value Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classificationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Value']} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="items">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Item
                </CardTitle>
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
                    <Label htmlFor="demand">Annual Demand</Label>
                    <Input
                      id="demand"
                      type="number"
                      value={newItem.annualDemand}
                      onChange={(e) => setNewItem(prev => ({ ...prev, annualDemand: parseFloat(e.target.value) || 0 }))}
                      placeholder="Enter demand"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost">Unit Cost ($)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={newItem.unitCost}
                      onChange={(e) => setNewItem(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))}
                      placeholder="Enter cost"
                    />
                  </div>
                </div>
                <Button onClick={addItem} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">SKU</th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Annual Demand</th>
                        <th className="text-left p-2">Unit Cost</th>
                        <th className="text-left p-2">Annual Value</th>
                        <th className="text-left p-2">Classification</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-mono text-sm">{item.sku}</td>
                          <td className="p-2">{item.name}</td>
                          <td className="p-2">{item.annualDemand.toLocaleString()}</td>
                          <td className="p-2">${item.unitCost.toFixed(2)}</td>
                          <td className="p-2">${item.annualValue.toLocaleString()}</td>
                          <td className="p-2">
                            <Badge 
                              style={{ backgroundColor: getClassificationColor(item.classification) }}
                              className="text-white"
                            >
                              Class {item.classification}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Cumulative Value Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={items}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sku" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Cumulative %']} />
                  <Line 
                    type="monotone" 
                    dataKey="cumulativePercentage" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Class A Items (High Value - Tight Control)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Frequent inventory reviews and accurate demand forecasting</li>
                  <li>• Tight inventory control with low safety stock</li>
                  <li>• Close supplier relationships and frequent deliveries</li>
                  <li>• Priority in inventory management attention</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Class B Items (Moderate Value - Moderate Control)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Regular inventory reviews with good controls</li>
                  <li>• Moderate safety stock levels</li>
                  <li>• Standard reorder procedures</li>
                  <li>• Balanced attention in inventory management</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-yellow-600" />
                  Class C Items (Low Value - Simple Control)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Simple inventory control with higher safety stock</li>
                  <li>• Less frequent reviews and bulk ordering</li>
                  <li>• Focus on cost-effective ordering methods</li>
                  <li>• Minimal management attention required</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ABCAnalysis;
