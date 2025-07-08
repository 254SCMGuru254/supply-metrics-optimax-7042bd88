
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Download, Upload, TrendingUp, Package, DollarSign, AlertCircle } from 'lucide-react';
import { InventoryItem, ABCAnalysisResult } from '@/components/map/MapTypes';
import { performABCAnalysis } from '@/components/inventory-optimization/InventoryOptimizationUtils';

interface ABCAnalysisProps {
  projectId: string;
}

const COLORS = {
  A: '#ef4444', // Red for high-value items
  B: '#f59e0b', // Orange for medium-value items  
  C: '#10b981'  // Green for low-value items
};

export const ABCAnalysis: React.FC<ABCAnalysisProps> = ({ projectId }) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [abcResults, setAbcResults] = useState<ABCAnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    sku: '',
    description: '',
    unitCost: 0,
    demandRate: 0
  });

  // Sample data for demonstration
  const sampleItems: InventoryItem[] = [
    { id: '1', sku: 'SKU001', description: 'High-value component A', unitCost: 500, demandRate: 100, annualDemand: 36500, leadTime: 7, holdingCostRate: 0.25, orderingCost: 100, safetyStock: 50, reorderPoint: 150, economicOrderQuantity: 500, abcClassification: 'A' },
    { id: '2', sku: 'SKU002', description: 'Medium-value component B', unitCost: 150, demandRate: 50, annualDemand: 18250, leadTime: 10, holdingCostRate: 0.25, orderingCost: 80, safetyStock: 25, reorderPoint: 75, economicOrderQuantity: 300, abcClassification: 'B' },
    { id: '3', sku: 'SKU003', description: 'Low-value component C', unitCost: 25, demandRate: 200, annualDemand: 73000, leadTime: 5, holdingCostRate: 0.25, orderingCost: 60, safetyStock: 100, reorderPoint: 250, economicOrderQuantity: 800, abcClassification: 'C' },
    { id: '4', sku: 'SKU004', description: 'Premium component D', unitCost: 750, demandRate: 30, annualDemand: 10950, leadTime: 14, holdingCostRate: 0.25, orderingCost: 120, safetyStock: 20, reorderPoint: 60, economicOrderQuantity: 200, abcClassification: 'A' },
    { id: '5', sku: 'SKU005', description: 'Standard component E', unitCost: 85, demandRate: 80, annualDemand: 29200, leadTime: 8, holdingCostRate: 0.25, orderingCost: 70, safetyStock: 40, reorderPoint: 120, economicOrderQuantity: 400, abcClassification: 'B' }
  ];

  useEffect(() => {
    // Initialize with sample data
    setInventoryItems(sampleItems);
    runABCAnalysis(sampleItems);
  }, []);

  const runABCAnalysis = (items: InventoryItem[]) => {
    setLoading(true);
    try {
      const results = performABCAnalysis(items);
      setAbcResults(results);
    } catch (error) {
      console.error('Error performing ABC analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNewItem = () => {
    if (newItem.sku && newItem.description) {
      const item: InventoryItem = {
        id: Date.now().toString(),
        ...newItem,
        annualDemand: newItem.demandRate * 365,
        leadTime: 7,
        holdingCostRate: 0.25,
        orderingCost: 100,
        safetyStock: Math.round(newItem.demandRate * 0.5),
        reorderPoint: Math.round(newItem.demandRate * 1.5),
        economicOrderQuantity: Math.round(Math.sqrt((2 * 100 * newItem.demandRate * 365) / (newItem.unitCost * 0.25)))
      };
      
      const updatedItems = [...inventoryItems, item];
      setInventoryItems(updatedItems);
      runABCAnalysis(updatedItems);
      
      setNewItem({ sku: '', description: '', unitCost: 0, demandRate: 0 });
    }
  };

  const getClassificationStats = () => {
    const stats = { A: 0, B: 0, C: 0 };
    abcResults.forEach(result => {
      stats[result.classification]++;
    });
    return stats;
  };

  const getClassificationData = () => {
    const stats = getClassificationStats();
    return [
      { name: 'Class A Items', count: stats.A, value: 80, color: COLORS.A },
      { name: 'Class B Items', count: stats.B, value: 15, color: COLORS.B },
      { name: 'Class C Items', count: stats.C, value: 5, color: COLORS.C }
    ];
  };

  const chartData = getClassificationData();
  const totalValue = abcResults.reduce((sum, item) => sum + item.annualValue, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">ABC Analysis</h2>
          <p className="text-muted-foreground">
            Categorize inventory items by their annual value contribution
          </p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryItems.length}</div>
            <p className="text-xs text-muted-foreground">Inventory items analyzed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class A Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{getClassificationStats().A}</div>
            <p className="text-xs text-muted-foreground">High-value items (~80% value)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Annual inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analysis Status</CardTitle>
            <AlertCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Complete</div>
            <p className="text-xs text-muted-foreground">Last updated now</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Item Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Inventory Item</CardTitle>
          <CardDescription>Add items to perform ABC analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={newItem.sku}
                onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                placeholder="Enter SKU"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                placeholder="Item description"
              />
            </div>
            <div>
              <Label htmlFor="unitCost">Unit Cost ($)</Label>
              <Input
                id="unitCost"
                type="number"
                value={newItem.unitCost}
                onChange={(e) => setNewItem({...newItem, unitCost: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addNewItem} className="w-full">
                Add Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ABC Classification Distribution</CardTitle>
            <CardDescription>Item count by classification</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, count }) => `${name}: ${count}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
            <CardTitle>Value Distribution</CardTitle>
            <CardDescription>Annual value by item classification</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed ABC Analysis Results</CardTitle>
          <CardDescription>Complete breakdown of inventory classification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">SKU</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-right p-2">Unit Cost</th>
                  <th className="text-right p-2">Annual Demand</th>
                  <th className="text-right p-2">Annual Value</th>
                  <th className="text-center p-2">Classification</th>
                  <th className="text-right p-2">Cumulative %</th>
                </tr>
              </thead>
              <tbody>
                {abcResults.map((result, index) => (
                  <tr key={result.item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{result.item.sku}</td>
                    <td className="p-2">{result.item.description}</td>
                    <td className="p-2 text-right">${result.item.unitCost.toFixed(2)}</td>
                    <td className="p-2 text-right">{result.item.annualDemand?.toLocaleString()}</td>
                    <td className="p-2 text-right">${result.annualValue.toLocaleString()}</td>
                    <td className="p-2 text-center">
                      <Badge 
                        variant="outline"
                        className={`
                          ${result.classification === 'A' ? 'border-red-500 text-red-700 bg-red-50' : ''}
                          ${result.classification === 'B' ? 'border-orange-500 text-orange-700 bg-orange-50' : ''}
                          ${result.classification === 'C' ? 'border-green-500 text-green-700 bg-green-50' : ''}
                        `}
                      >
                        Class {result.classification}
                      </Badge>
                    </td>
                    <td className="p-2 text-right">{result.cumulativePercentage.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pareto Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Pareto Analysis Insights</CardTitle>
          <CardDescription>Key insights from the ABC analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">Class A Items (High Priority)</h4>
              <p className="text-sm text-muted-foreground">
                Focus on tight inventory control, frequent reviews, and supplier relationship management.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Items:</span>
                  <span className="font-medium">{getClassificationStats().A}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Target Service Level:</span>
                  <span className="font-medium">99%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-orange-600">Class B Items (Medium Priority)</h4>
              <p className="text-sm text-muted-foreground">
                Maintain good inventory records with regular cycle counting and moderate controls.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Items:</span>
                  <span className="font-medium">{getClassificationStats().B}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Target Service Level:</span>
                  <span className="font-medium">95%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Class C Items (Low Priority)</h4>
              <p className="text-sm text-muted-foreground">
                Simple controls, larger safety stocks acceptable, periodic review systems.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Items:</span>
                  <span className="font-medium">{getClassificationStats().C}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Target Service Level:</span>
                  <span className="font-medium">90%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
