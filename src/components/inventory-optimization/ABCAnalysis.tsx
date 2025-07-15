import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  SlidersHorizontal, Package, TrendingUp, AlertTriangle, 
  CheckCircle, Calculator, Download, Upload 
} from 'lucide-react';

interface ABCItem {
  id: string;
  name: string;
  annualUsage: number;
  unitCost: number;
  totalValue: number;
  category: 'A' | 'B' | 'C';
  percentage: number;
  cumulativePercentage: number;
}

const sampleData: Omit<ABCItem, 'totalValue' | 'category' | 'percentage' | 'cumulativePercentage'>[] = [
  { id: '1', name: 'Premium Engine Oil', annualUsage: 5000, unitCost: 25 },
  { id: '2', name: 'Brake Pads', annualUsage: 3000, unitCost: 45 },
  { id: '3', name: 'Air Filters', annualUsage: 8000, unitCost: 12 },
  { id: '4', name: 'Spark Plugs', annualUsage: 10000, unitCost: 8 },
  { id: '5', name: 'Transmission Fluid', annualUsage: 2000, unitCost: 35 },
];

export const ABCAnalysis = () => {
  const [items, setItems] = useState<Omit<ABCItem, 'totalValue' | 'category' | 'percentage' | 'cumulativePercentage'>[]>(sampleData);
  const [newItem, setNewItem] = useState({ name: '', annualUsage: '', unitCost: '' });
  const [thresholds, setThresholds] = useState({ categoryA: 80, categoryB: 95 });

  const abcAnalysis = useMemo(() => {
    const itemsWithValues = items.map(item => ({
      ...item,
      totalValue: item.annualUsage * item.unitCost
    }));

    const sortedItems = itemsWithValues.sort((a, b) => b.totalValue - a.totalValue);
    const totalValue = sortedItems.reduce((sum, item) => sum + item.totalValue, 0);

    let cumulativeValue = 0;
    const analyzedItems: ABCItem[] = sortedItems.map(item => {
      cumulativeValue += item.totalValue;
      const percentage = (item.totalValue / totalValue) * 100;
      const cumulativePercentage = (cumulativeValue / totalValue) * 100;
      
      let category: 'A' | 'B' | 'C' = 'C';
      if (cumulativePercentage <= thresholds.categoryA) {
        category = 'A';
      } else if (cumulativePercentage <= thresholds.categoryB) {
        category = 'B';
      }

      return {
        ...item,
        category,
        percentage,
        cumulativePercentage
      };
    });

    return analyzedItems;
  }, [items, thresholds]);

  const categoryStats = useMemo(() => {
    const stats = { A: 0, B: 0, C: 0 };
    abcAnalysis.forEach(item => {
      stats[item.category]++;
    });
    return Object.entries(stats).map(([name, count]) => ({ 
      name: `Category ${name}`, 
      count, 
      color: name === 'A' ? '#ef4444' : name === 'B' ? '#f59e0b' : '#10b981' 
    }));
  }, [abcAnalysis]);

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">ABC Analysis</h2>
          <p className="text-muted-foreground">Categorize inventory items based on their importance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">
                  {categoryStats.find(s => s.name === 'Category A')?.count || 0}
                </div>
                <div className="text-sm text-muted-foreground">Category A Items</div>
                <div className="text-xs text-red-600 mt-1">High Value (80%)</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-2">
                  {categoryStats.find(s => s.name === 'Category B')?.count || 0}
                </div>
                <div className="text-sm text-muted-foreground">Category B Items</div>
                <div className="text-xs text-yellow-600 mt-1">Medium Value (15%)</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {categoryStats.find(s => s.name === 'Category C')?.count || 0}
                </div>
                <div className="text-sm text-muted-foreground">Category C Items</div>
                <div className="text-xs text-green-600 mt-1">Low Value (5%)</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Items']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Cumulative Value Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={abcAnalysis.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Cumulative %']} />
                    <Line type="monotone" dataKey="cumulativePercentage" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Detailed Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Item Name</th>
                      <th className="text-right p-2">Annual Usage</th>
                      <th className="text-right p-2">Unit Cost</th>
                      <th className="text-right p-2">Total Value</th>
                      <th className="text-center p-2">Category</th>
                      <th className="text-right p-2">Cumulative %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {abcAnalysis.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2 text-right">{item.annualUsage.toLocaleString()}</td>
                        <td className="p-2 text-right">${item.unitCost.toFixed(2)}</td>
                        <td className="p-2 text-right">${item.totalValue.toLocaleString()}</td>
                        <td className="p-2 text-center">
                          <Badge variant={item.category === 'A' ? 'destructive' : item.category === 'B' ? 'secondary' : 'default'}>
                            {item.category}
                          </Badge>
                        </td>
                        <td className="p-2 text-right">{item.cumulativePercentage.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Add New Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <Label htmlFor="annualUsage">Annual Usage</Label>
                  <Input
                    id="annualUsage"
                    type="number"
                    value={newItem.annualUsage}
                    onChange={(e) => setNewItem({ ...newItem, annualUsage: e.target.value })}
                    placeholder="Enter annual usage"
                  />
                </div>
                <div>
                  <Label htmlFor="unitCost">Unit Cost ($)</Label>
                  <Input
                    id="unitCost"
                    type="number"
                    step="0.01"
                    value={newItem.unitCost}
                    onChange={(e) => setNewItem({ ...newItem, unitCost: e.target.value })}
                    placeholder="Enter unit cost"
                  />
                </div>
              </div>
              <Button 
                onClick={() => {
                  if (newItem.name && newItem.annualUsage && newItem.unitCost) {
                    setItems([...items, {
                      id: Date.now().toString(),
                      name: newItem.name,
                      annualUsage: parseInt(newItem.annualUsage),
                      unitCost: parseFloat(newItem.unitCost)
                    }]);
                    setNewItem({ name: '', annualUsage: '', unitCost: '' });
                  }
                }}
                disabled={!newItem.name || !newItem.annualUsage || !newItem.unitCost}
              >
                Add Item
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Analysis Thresholds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryA">Category A Threshold (%)</Label>
                  <Input
                    id="categoryA"
                    type="number"
                    value={thresholds.categoryA}
                    onChange={(e) => setThresholds({ ...thresholds, categoryA: parseInt(e.target.value) })}
                    min="1"
                    max="100"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Items contributing to this percentage of total value</p>
                </div>
                <div>
                  <Label htmlFor="categoryB">Category B Threshold (%)</Label>
                  <Input
                    id="categoryB"
                    type="number"
                    value={thresholds.categoryB}
                    onChange={(e) => setThresholds({ ...thresholds, categoryB: parseInt(e.target.value) })}
                    min="1"
                    max="100"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Items contributing up to this percentage (remaining are Category C)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
