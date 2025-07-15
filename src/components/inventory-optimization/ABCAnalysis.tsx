import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  Sliders as SlidersHorizontal,
  Download,
  Upload
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  unitCost: number;
  annualDemand: number;
}

interface ABCItem {
  name: string;
  percentage: number;
  cumulativePercentage: number;
  category: string;
  color: string;
}

const initialInventoryData: InventoryItem[] = [
  { id: 'item-1', name: 'Product A', unitCost: 50, annualDemand: 1000 },
  { id: 'item-2', name: 'Product B', unitCost: 30, annualDemand: 2000 },
  { id: 'item-3', name: 'Product C', unitCost: 100, annualDemand: 500 },
  { id: 'item-4', name: 'Product D', unitCost: 25, annualDemand: 3000 },
  { id: 'item-5', name: 'Product E', unitCost: 75, annualDemand: 750 },
  { id: 'item-6', name: 'Product F', unitCost: 40, annualDemand: 1500 },
  { id: 'item-7', name: 'Product G', unitCost: 60, annualDemand: 900 },
  { id: 'item-8', name: 'Product H', unitCost: 35, annualDemand: 2500 },
  { id: 'item-9', name: 'Product I', unitCost: 90, annualDemand: 600 },
  { id: 'item-10', name: 'Product J', unitCost: 45, annualDemand: 1200 },
];

export const ABCAnalysis = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(initialInventoryData);
  const [aThreshold, setAThreshold] = useState<number>(80);
  const [bThreshold, setBThreshold] = useState<number>(95);

  const totalAnnualRevenue = useMemo(() => {
    return inventoryData.reduce((sum, item) => sum + item.unitCost * item.annualDemand, 0);
  }, [inventoryData]);

  const sortedInventory = useMemo(() => {
    return [...inventoryData].sort((a, b) => (b.unitCost * b.annualDemand) - (a.unitCost * a.annualDemand));
  }, [inventoryData]);

  const abcAnalysis = useMemo(() => {
    let cumulativeRevenue = 0;
    let cumulativePercentage = 0;
    
    return sortedInventory.map(item => {
      const annualRevenue = item.unitCost * item.annualDemand;
      cumulativeRevenue += annualRevenue;
      cumulativePercentage = (cumulativeRevenue / totalAnnualRevenue) * 100;

      let category = 'C';
      let color = '#6b7280'; // Gray
      if (cumulativePercentage <= aThreshold) {
        category = 'A';
        color = '#ef4444'; // Red
      } else if (cumulativePercentage <= bThreshold) {
        category = 'B';
        color = '#f59e0b'; // Amber
      }

      return {
        name: item.name,
        percentage: (annualRevenue / totalAnnualRevenue) * 100,
        cumulativePercentage: cumulativePercentage,
        category: category,
        color: color,
      };
    });
  }, [sortedInventory, totalAnnualRevenue, aThreshold, bThreshold]);

  const abcData = useMemo(() => {
    const aCount = abcAnalysis.filter(item => item.category === 'A').length;
    const bCount = abcAnalysis.filter(item => item.category === 'B').length;
    const cCount = abcAnalysis.filter(item => item.category === 'C').length;

    return [
      { name: 'A', count: aCount, color: '#ef4444' },
      { name: 'B', count: bCount, color: '#f59e0b' },
      { name: 'C', count: cCount, color: '#6b7280' },
    ];
  }, [abcAnalysis]);

  const totalItems = inventoryData.length;
  const aItemsPercentage = (abcData[0].count / totalItems) * 100;
  const bItemsPercentage = (abcData[1].count / totalItems) * 100;
  const cItemsPercentage = (abcData[2].count / totalItems) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">ABC Analysis</h2>
          <p className="text-muted-foreground">Classify inventory items by importance and value</p>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <SlidersHorizontal className="h-5 w-5" />
            Analysis Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="a-threshold" className="text-foreground">A Threshold (%)</Label>
              <Input
                id="a-threshold"
                type="number"
                value={aThreshold}
                onChange={(e) => setAThreshold(Number(e.target.value))}
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="b-threshold" className="text-foreground">B Threshold (%)</Label>
              <Input
                id="b-threshold"
                type="number"
                value={bThreshold}
                onChange={(e) => setBThreshold(Number(e.target.value))}
                className="bg-background text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-green-700">{totalItems}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-blue-700">{aItemsPercentage.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">A Items</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-yellow-700">{bItemsPercentage.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">B Items</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="classification" className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="classification">Classification</TabsTrigger>
          <TabsTrigger value="chart">Revenue Chart</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
        </TabsList>

        <TabsContent value="classification">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">ABC Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={abcData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {abcData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Items']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Cumulative Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={abcAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Revenue']} />
                    <Bar dataKey="percentage" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Revenue by Item</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={abcAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Revenue']} />
                  <Legend />
                  <Bar dataKey="percentage" fill="#82ca9d" name="Revenue (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Inventory Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Annual Demand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue (%)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {abcAnalysis.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${inventoryData.find(i => i.name === item.name)?.unitCost}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {inventoryData.find(i => i.name === item.name)?.annualDemand}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.percentage.toFixed(2)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
