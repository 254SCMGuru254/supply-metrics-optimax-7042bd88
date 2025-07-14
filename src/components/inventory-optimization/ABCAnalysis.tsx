
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Package, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface ABCAnalysisResult {
  sku: string;
  annualUsage: number;
  unitCost: number;
  annualValue: number;
  cumulativeValue: number;
  cumulativePercentage: number;
  classification: 'A' | 'B' | 'C';
}

interface ABCItem {
  sku: string;
  annualUsage: number;
  unitCost: number;
}

const ABCAnalysis = () => {
  const [items, setItems] = useState<ABCItem[]>([
    { sku: 'ITEM001', annualUsage: 1000, unitCost: 50 },
    { sku: 'ITEM002', annualUsage: 500, unitCost: 100 },
    { sku: 'ITEM003', annualUsage: 2000, unitCost: 25 },
  ]);
  const [results, setResults] = useState<ABCAnalysisResult[]>([]);
  const [newItem, setNewItem] = useState<ABCItem>({ sku: '', annualUsage: 0, unitCost: 0 });

  const performABCAnalysis = () => {
    if (items.length === 0) return;

    // Calculate annual value for each item
    const itemsWithValue = items.map(item => ({
      ...item,
      annualValue: item.annualUsage * item.unitCost
    }));

    // Sort by annual value in descending order
    itemsWithValue.sort((a, b) => b.annualValue - a.annualValue);

    const totalValue = itemsWithValue.reduce((sum, item) => sum + item.annualValue, 0);
    let cumulativeValue = 0;

    // Calculate cumulative percentages and classify
    const analysisResults: ABCAnalysisResult[] = itemsWithValue.map(item => {
      cumulativeValue += item.annualValue;
      const cumulativePercentage = (cumulativeValue / totalValue) * 100;

      let classification: 'A' | 'B' | 'C';
      if (cumulativePercentage <= 70) {
        classification = 'A';
      } else if (cumulativePercentage <= 90) {
        classification = 'B';
      } else {
        classification = 'C';
      }

      return {
        sku: item.sku,
        annualUsage: item.annualUsage,
        unitCost: item.unitCost,
        annualValue: item.annualValue,
        cumulativeValue,
        cumulativePercentage,
        classification
      };
    });

    setResults(analysisResults);
  };

  const addItem = () => {
    if (newItem.sku && newItem.annualUsage > 0 && newItem.unitCost > 0) {
      setItems([...items, newItem]);
      setNewItem({ sku: '', annualUsage: 0, unitCost: 0 });
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  useEffect(() => {
    performABCAnalysis();
  }, [items]);

  const summary = {
    totalItems: results.length,
    totalValue: results.reduce((sum, item) => sum + item.annualValue, 0),
    aItems: results.filter(item => item.classification === 'A').length,
    bItems: results.filter(item => item.classification === 'B').length,
    cItems: results.filter(item => item.classification === 'C').length,
    classAValuePercentage: results.length > 0 ? 
      (results.filter(item => item.classification === 'A').reduce((sum, item) => sum + item.annualValue, 0) / 
       results.reduce((sum, item) => sum + item.annualValue, 0) * 100) : 0,
  };

  const chartData = [
    { 
      name: 'Class A', 
      count: summary.aItems, 
      value: results.filter(item => item.classification === 'A').reduce((sum, item) => sum + item.annualValue, 0),
      color: '#ef4444'
    },
    { 
      name: 'Class B', 
      count: summary.bItems, 
      value: results.filter(item => item.classification === 'B').reduce((sum, item) => sum + item.annualValue, 0),
      color: '#f59e0b'
    },
    { 
      name: 'Class C', 
      count: summary.cItems, 
      value: results.filter(item => item.classification === 'C').reduce((sum, item) => sum + item.annualValue, 0),
      color: '#10b981'
    },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            ABC Analysis - Inventory Classification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Item */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <Input
              placeholder="SKU"
              value={newItem.sku}
              onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Annual Usage"
              value={newItem.annualUsage || ''}
              onChange={(e) => setNewItem({...newItem, annualUsage: Number(e.target.value)})}
            />
            <Input
              type="number"
              placeholder="Unit Cost"
              value={newItem.unitCost || ''}
              onChange={(e) => setNewItem({...newItem, unitCost: Number(e.target.value)})}
            />
            <Button onClick={addItem}>Add Item</Button>
          </div>

          {/* Current Items */}
          <div className="space-y-2">
            <h3 className="font-semibold">Current Items:</h3>
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                <span>{item.sku} - Usage: {item.annualUsage}, Cost: ${item.unitCost}</span>
                <Button variant="destructive" size="sm" onClick={() => removeItem(index)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Analysis Results */}
          {results.length > 0 && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{summary.totalItems}</div>
                    <div className="text-sm text-gray-600">Total Items</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">${summary.totalValue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Value</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{summary.aItems}</div>
                    <div className="text-sm text-gray-600">Class A Items</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{summary.classAValuePercentage.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Class A Value %</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Classification Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ name, count }) => `${name}: ${count}`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
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
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Value"]} />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Results Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2">SKU</th>
                          <th className="border border-gray-300 p-2">Annual Usage</th>
                          <th className="border border-gray-300 p-2">Unit Cost</th>
                          <th className="border border-gray-300 p-2">Annual Value</th>
                          <th className="border border-gray-300 p-2">Cumulative %</th>
                          <th className="border border-gray-300 p-2">Classification</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((result, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 p-2">{result.sku}</td>
                            <td className="border border-gray-300 p-2">{result.annualUsage.toLocaleString()}</td>
                            <td className="border border-gray-300 p-2">${result.unitCost.toLocaleString()}</td>
                            <td className="border border-gray-300 p-2">${result.annualValue.toLocaleString()}</td>
                            <td className="border border-gray-300 p-2">{result.cumulativePercentage.toFixed(1)}%</td>
                            <td className="border border-gray-300 p-2">
                              <Badge 
                                variant={
                                  result.classification === 'A' ? 'destructive' : 
                                  result.classification === 'B' ? 'default' : 
                                  'secondary'
                                }
                              >
                                Class {result.classification}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    ABC Analysis Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <h4 className="font-semibold text-red-800">Class A Items ({summary.aItems} items)</h4>
                      <p className="text-red-700">High-value items requiring tight inventory control, frequent monitoring, and accurate demand forecasting.</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                      <h4 className="font-semibold text-yellow-800">Class B Items ({summary.bItems} items)</h4>
                      <p className="text-yellow-700">Moderate-value items requiring normal inventory control with periodic reviews.</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <h4 className="font-semibold text-green-800">Class C Items ({summary.cItems} items)</h4>
                      <p className="text-green-700">Low-value items that can be managed with simple inventory control systems and bulk ordering.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ABCAnalysis;
