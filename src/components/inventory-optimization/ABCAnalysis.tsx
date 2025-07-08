
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Package, DollarSign, TrendingUp } from "lucide-react";
import type { InventoryItem, ABCAnalysisResult } from "@/components/map/MapTypes";

interface ABCAnalysisProps {
  projectId: string;
}

export const ABCAnalysis: React.FC<ABCAnalysisProps> = ({ projectId }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [analysisResults, setAnalysisResults] = useState<ABCAnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockItems: InventoryItem[] = [
    {
      id: '1',
      sku: 'SKU001',
      description: 'High-value electronic component',
      unitCost: 500,
      demandRate: 1000,
      annualDemand: 12000,
      leadTime: 7,
      holdingCostRate: 0.25,
      orderingCost: 100,
      safetyStock: 200,
      reorderPoint: 500,
      economicOrderQuantity: 600,
      annualValue: 6000000,
      abcClassification: 'A'
    },
    {
      id: '2',
      sku: 'SKU002',
      description: 'Medium-value mechanical part',
      unitCost: 150,
      demandRate: 800,
      annualDemand: 9600,
      leadTime: 10,
      holdingCostRate: 0.25,
      orderingCost: 80,
      safetyStock: 150,
      reorderPoint: 400,
      economicOrderQuantity: 500,
      annualValue: 1440000,
      abcClassification: 'B'
    },
    {
      id: '3',
      sku: 'SKU003',
      description: 'Low-value consumable item',
      unitCost: 5,
      demandRate: 2000,
      annualDemand: 24000,
      leadTime: 3,
      holdingCostRate: 0.15,
      orderingCost: 30,
      safetyStock: 500,
      reorderPoint: 1000,
      economicOrderQuantity: 2000,
      annualValue: 120000,
      abcClassification: 'C'
    }
  ];

  useEffect(() => {
    setItems(mockItems);
    performABCAnalysis(mockItems);
  }, [projectId]);

  const performABCAnalysis = (inventoryItems: InventoryItem[]) => {
    setLoading(true);
    
    // Calculate annual values and sort
    const itemsWithValues = inventoryItems.map(item => ({
      ...item,
      annualValue: item.unitCost * (item.annualDemand || item.demandRate * 12)
    }));

    const sortedItems = itemsWithValues.sort((a, b) => b.annualValue! - a.annualValue!);
    const totalValue = sortedItems.reduce((sum, item) => sum + item.annualValue!, 0);

    let cumulativeValue = 0;
    const results: ABCAnalysisResult[] = [];

    sortedItems.forEach((item, index) => {
      cumulativeValue += item.annualValue!;
      const percentage = (item.annualValue! / totalValue) * 100;
      const cumulativePercentage = (cumulativeValue / totalValue) * 100;

      let classification: 'A' | 'B' | 'C';
      if (cumulativePercentage <= 80) {
        classification = 'A';
      } else if (cumulativePercentage <= 95) {
        classification = 'B';
      } else {
        classification = 'C';
      }

      results.push({
        item: { ...item, abcClassification: classification },
        annualValue: item.annualValue!,
        percentage,
        cumulativePercentage,
        classification
      });
    });

    setAnalysisResults(results);
    setLoading(false);
  };

  const getClassificationStats = () => {
    const aItems = analysisResults.filter(r => r.classification === 'A');
    const bItems = analysisResults.filter(r => r.classification === 'B');
    const cItems = analysisResults.filter(r => r.classification === 'C');

    return {
      A: { count: aItems.length, value: aItems.reduce((sum, item) => sum + item.annualValue, 0) },
      B: { count: bItems.length, value: bItems.reduce((sum, item) => sum + item.annualValue, 0) },
      C: { count: cItems.length, value: cItems.reduce((sum, item) => sum + item.annualValue, 0) }
    };
  };

  const stats = getClassificationStats();
  const totalValue = stats.A.value + stats.B.value + stats.C.value;

  const chartData = [
    { name: 'A Items', count: stats.A.count, value: stats.A.value, color: '#ef4444' },
    { name: 'B Items', count: stats.B.count, value: stats.B.value, color: '#f59e0b' },
    { name: 'C Items', count: stats.C.count, value: stats.C.value, color: '#10b981' }
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">ABC Analysis</h2>
          <p className="text-muted-foreground">
            Classify inventory items based on annual value contribution
          </p>
        </div>
        <Button onClick={() => performABCAnalysis(items)} disabled={loading}>
          {loading ? 'Analyzing...' : 'Refresh Analysis'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class A Items</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.A.count}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.A.value.toLocaleString()} ({((stats.A.value / totalValue) * 100).toFixed(1)}% of value)
            </p>
            <Progress value={(stats.A.value / totalValue) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class B Items</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.B.count}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.B.value.toLocaleString()} ({((stats.B.value / totalValue) * 100).toFixed(1)}% of value)
            </p>
            <Progress value={(stats.B.value / totalValue) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class C Items</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.C.count}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.C.value.toLocaleString()} ({((stats.C.value / totalValue) * 100).toFixed(1)}% of value)
            </p>
            <Progress value={(stats.C.value / totalValue) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Value Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'value' ? `$${value.toLocaleString()}` : value,
                  name === 'value' ? 'Annual Value' : 'Item Count'
                ]} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Item Count Distribution
            </CardTitle>
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
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>ABC Analysis Results</CardTitle>
          <CardDescription>
            Detailed classification of inventory items by annual value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Annual Demand</TableHead>
                <TableHead>Annual Value</TableHead>
                <TableHead>Cumulative %</TableHead>
                <TableHead>Classification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisResults.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{result.item.sku}</TableCell>
                  <TableCell>{result.item.description}</TableCell>
                  <TableCell>${result.item.unitCost}</TableCell>
                  <TableCell>{result.item.annualDemand || result.item.demandRate * 12}</TableCell>
                  <TableCell>${result.annualValue.toLocaleString()}</TableCell>
                  <TableCell>{result.cumulativePercentage.toFixed(1)}%</TableCell>
                  <TableCell>
                    <Badge className={getClassificationColor(result.classification)}>
                      Class {result.classification}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
