
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

  // Chart data
  const classificationData = [
    { name: 'Class A', count: items.filter(i => i.classification === 'A').length, value: items.filter(i => i.classification === 'A').reduce((sum, item) => sum + item.annualValue, 0), color: '#FF6B6B' },
    { name: 'Class B', count: items.filter(i => i.classification === 'B').length, value: items.filter(i => i.classification === 'B').reduce((sum, item) => sum + item.annualValue, 0), color: '#4ECDC4' },
    { name: 'Class C', count: items.filter(i => i.classification === 'C').length, value: items.filter(i => i.classification === 'C').reduce((sum, item) => sum + item.annualValue, 0), color: '#45B7D1' },
  ];

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'A': return 'bg-red-100 text-red-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">ABC Analysis</h2>
        <p className="text-muted-foreground">
          Classify inventory items based on their annual value contribution
        </p>
      </div>

      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="items">Item Management</TabsTrigger>
          <TabsTrigger value="charts">Visualizations</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ABC Classification Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classificationData.map((cls, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: cls.color }}></div>
                        <div>
                          <div className="font-medium">{cls.name}</div>
                          <div className="text-sm text-muted-foreground">{cls.count} items</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${cls.value.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {((cls.value / items.reduce((sum, item) => sum + item.annualValue, 0)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Classification Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={classificationData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {classificationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value}`, 'Item Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">SKU</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-right p-2">Annual Demand</th>
                      <th className="text-right p-2">Unit Cost</th>
                      <th className="text-right p-2">Annual Value</th>
                      <th className="text-center p-2">Class</th>
                      <th className="text-center p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2 font-mono text-sm">{item.sku}</td>
                        <td className="p-2">{item.name}</td>
                        <td className="p-2 text-right">{item.annualDemand.toLocaleString()}</td>
                        <td className="p-2 text-right">${item.unitCost.toFixed(2)}</td>
                        <td className="p-2 text-right">${item.annualValue.toLocaleString()}</td>
                        <td className="p-2 text-center">
                          <Badge className={getClassificationColor(item.classification)}>
                            {item.classification}
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Button
                            variant="outline"
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
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Add New Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    onChange={(e) => setNewItem(prev => ({ ...prev, annualDemand: parseInt(e.target.value) || 0 }))}
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
              <div className="mt-4">
                <Button onClick={addItem} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Cumulative Value Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={items}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sku" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Cumulative %']} />
                    <Line type="monotone" dataKey="cumulativePercentage" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Class A Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">High-value items requiring tight control:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Frequent inventory reviews</li>
                    <li>• Accurate demand forecasting</li>
                    <li>• Strong supplier relationships</li>
                    <li>• Lower safety stock levels</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-yellow-600" />
                  Class B Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Medium-value items with moderate control:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Regular inventory reviews</li>
                    <li>• Standard forecasting methods</li>
                    <li>• Balanced safety stock</li>
                    <li>• Automated reordering</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Class C Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Low-value items with simple controls:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Periodic bulk ordering</li>
                    <li>• Higher safety stock levels</li>
                    <li>• Simple forecasting</li>
                    <li>• Focus on availability</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ABCAnalysis;
