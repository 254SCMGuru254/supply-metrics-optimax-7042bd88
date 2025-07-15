
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Calculator, 
  TrendingUp, 
  Package, 
  Settings, 
  FileText, 
  Download 
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  annualUsage: number;
  unitCost: number;
  annualValue: number;
  cumulativeValue: number;
  cumulativePercentage: number;
  category: 'A' | 'B' | 'C';
}

interface ABCResult {
  items: InventoryItem[];
  categoryA: InventoryItem[];
  categoryB: InventoryItem[];
  categoryC: InventoryItem[];
  summary: {
    totalItems: number;
    totalValue: number;
    categoryACount: number;
    categoryBCount: number;
    categoryCCount: number;
    categoryAValue: number;
    categoryBValue: number;
    categoryCValue: number;
  };
}

export const ABCAnalysis: React.FC = () => {
  const [items, setItems] = useState<Array<{name: string; annualUsage: number; unitCost: number}>>([
    { name: 'Item A', annualUsage: 1000, unitCost: 50 },
    { name: 'Item B', annualUsage: 500, unitCost: 100 },
    { name: 'Item C', annualUsage: 200, unitCost: 25 }
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    annualUsage: 0,
    unitCost: 0
  });

  const abcResults = useMemo((): ABCResult => {
    // Calculate annual value for each item
    const itemsWithValue = items.map((item, index) => ({
      id: `item-${index}`,
      ...item,
      annualValue: item.annualUsage * item.unitCost
    }));

    // Sort by annual value in descending order
    const sortedItems = itemsWithValue.sort((a, b) => b.annualValue - a.annualValue);

    // Calculate cumulative values and percentages
    const totalValue = sortedItems.reduce((sum, item) => sum + item.annualValue, 0);
    let cumulativeValue = 0;

    const itemsWithCumulative = sortedItems.map(item => {
      cumulativeValue += item.annualValue;
      const cumulativePercentage = (cumulativeValue / totalValue) * 100;
      
      let category: 'A' | 'B' | 'C';
      if (cumulativePercentage <= 80) {
        category = 'A';
      } else if (cumulativePercentage <= 95) {
        category = 'B';
      } else {
        category = 'C';
      }

      return {
        ...item,
        cumulativeValue,
        cumulativePercentage,
        category
      };
    });

    // Group by categories
    const categoryA = itemsWithCumulative.filter(item => item.category === 'A');
    const categoryB = itemsWithCumulative.filter(item => item.category === 'B');
    const categoryC = itemsWithCumulative.filter(item => item.category === 'C');

    return {
      items: itemsWithCumulative,
      categoryA,
      categoryB,
      categoryC,
      summary: {
        totalItems: itemsWithCumulative.length,
        totalValue,
        categoryACount: categoryA.length,
        categoryBCount: categoryB.length,
        categoryCCount: categoryC.length,
        categoryAValue: categoryA.reduce((sum, item) => sum + item.annualValue, 0),
        categoryBValue: categoryB.reduce((sum, item) => sum + item.annualValue, 0),
        categoryCValue: categoryC.reduce((sum, item) => sum + item.annualValue, 0)
      }
    };
  }, [items]);

  const handleAddItem = () => {
    if (newItem.name && newItem.annualUsage > 0 && newItem.unitCost > 0) {
      setItems([...items, newItem]);
      setNewItem({ name: '', annualUsage: 0, unitCost: 0 });
    }
  };

  const chartData = abcResults.items.map((item, index) => ({
    name: item.name,
    value: item.annualValue,
    cumulative: item.cumulativePercentage,
    category: item.category
  }));

  const pieData = [
    { name: 'Category A', value: abcResults.summary.categoryACount },
    { name: 'Category B', value: abcResults.summary.categoryBCount },
    { name: 'Category C', value: abcResults.summary.categoryCCount }
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>ABC Analysis - Inventory Classification</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="input" className="space-y-4">
            <TabsList>
              <TabsTrigger value="input">Data Input</TabsTrigger>
              <TabsTrigger value="results">Analysis Results</TabsTrigger>
              <TabsTrigger value="charts">Visualizations</TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <Label htmlFor="annualUsage">Annual Usage</Label>
                  <Input
                    id="annualUsage"
                    type="number"
                    value={newItem.annualUsage}
                    onChange={(e) => setNewItem({...newItem, annualUsage: parseFloat(e.target.value) || 0})}
                    placeholder="Units per year"
                  />
                </div>
                <div>
                  <Label htmlFor="unitCost">Unit Cost (KES)</Label>
                  <Input
                    id="unitCost"
                    type="number"
                    value={newItem.unitCost}
                    onChange={(e) => setNewItem({...newItem, unitCost: parseFloat(e.target.value) || 0})}
                    placeholder="Cost per unit"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddItem} className="w-full">
                    Add Item
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Current Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-2 text-left">Item Name</th>
                        <th className="border border-border p-2 text-right">Annual Usage</th>
                        <th className="border border-border p-2 text-right">Unit Cost (KES)</th>
                        <th className="border border-border p-2 text-right">Annual Value (KES)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-border p-2">{item.name}</td>
                          <td className="border border-border p-2 text-right">{item.annualUsage.toLocaleString()}</td>
                          <td className="border border-border p-2 text-right">{item.unitCost.toLocaleString()}</td>
                          <td className="border border-border p-2 text-right">{(item.annualUsage * item.unitCost).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Badge className="bg-red-100 text-red-800 mb-2">Category A</Badge>
                      <p className="text-2xl font-bold">{abcResults.summary.categoryACount}</p>
                      <p className="text-sm text-muted-foreground">High Value Items</p>
                      <p className="text-lg font-semibold text-red-600">
                        KES {abcResults.summary.categoryAValue.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Badge className="bg-yellow-100 text-yellow-800 mb-2">Category B</Badge>
                      <p className="text-2xl font-bold">{abcResults.summary.categoryBCount}</p>
                      <p className="text-sm text-muted-foreground">Medium Value Items</p>
                      <p className="text-lg font-semibold text-yellow-600">
                        KES {abcResults.summary.categoryBValue.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Badge className="bg-green-100 text-green-800 mb-2">Category C</Badge>
                      <p className="text-2xl font-bold">{abcResults.summary.categoryCCount}</p>
                      <p className="text-sm text-muted-foreground">Low Value Items</p>
                      <p className="text-lg font-semibold text-green-600">
                        KES {abcResults.summary.categoryCValue.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Item</th>
                      <th className="border border-border p-2 text-right">Annual Value</th>
                      <th className="border border-border p-2 text-right">Cumulative %</th>
                      <th className="border border-border p-2 text-center">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {abcResults.items.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-border p-2">{item.name}</td>
                        <td className="border border-border p-2 text-right">KES {item.annualValue.toLocaleString()}</td>
                        <td className="border border-border p-2 text-right">{item.cumulativePercentage.toFixed(1)}%</td>
                        <td className="border border-border p-2 text-center">
                          <Badge 
                            className={
                              item.category === 'A' ? 'bg-red-100 text-red-800' :
                              item.category === 'B' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }
                          >
                            {item.category}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Annual Value by Item</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ABCAnalysis;
