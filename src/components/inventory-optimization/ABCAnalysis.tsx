
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PlusCircle, Download, Upload } from "lucide-react";
import { InventoryItem, ABCAnalysisResult } from "@/components/map/MapTypes";

interface ABCAnalysisProps {
  projectId?: string;
}

const ABCAnalysis: React.FC<ABCAnalysisProps> = ({ projectId }) => {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: "1",
      sku: "SKU-001",
      description: "High-value component A",
      name: "Component A",
      unitCost: 500,
      demandRate: 1000,
      leadTime: 7,
      holdingCostRate: 0.25,
      orderingCost: 100,
      safetyStock: 50,
      reorderPoint: 150,
      economicOrderQuantity: 200,
      annualDemand: 12000,
      serviceLevel: 99
    },
    {
      id: "2",
      sku: "SKU-002",
      description: "Medium-value component B",
      name: "Component B",
      unitCost: 200,
      demandRate: 800,
      leadTime: 5,
      holdingCostRate: 0.20,
      orderingCost: 80,
      safetyStock: 30,
      reorderPoint: 100,
      economicOrderQuantity: 150,
      annualDemand: 9600,
      serviceLevel: 95
    },
    {
      id: "3",
      sku: "SKU-003",
      description: "Low-value component C",
      name: "Component C",
      unitCost: 50,
      demandRate: 500,
      leadTime: 3,
      holdingCostRate: 0.15,
      orderingCost: 50,
      safetyStock: 20,
      reorderPoint: 60,
      economicOrderQuantity: 100,
      annualDemand: 6000,
      serviceLevel: 90
    }
  ]);

  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    sku: "",
    description: "",
    unitCost: 0,
    demandRate: 0,
    annualDemand: 0
  });

  const abcAnalysis = useMemo(() => {
    if (items.length === 0) return null;

    // Calculate annual value for each item
    const itemsWithValue = items.map(item => ({
      ...item,
      annualValue: (item.annualDemand || item.demandRate * 12) * item.unitCost
    }));

    // Sort by annual value descending
    itemsWithValue.sort((a, b) => b.annualValue - a.annualValue);

    const totalValue = itemsWithValue.reduce((sum, item) => sum + item.annualValue, 0);
    let cumulativeValue = 0;

    // Classify items
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
        item,
        annualValue: item.annualValue,
        percentage,
        cumulativePercentage,
        classification
      };
    });

    // Group by classification
    const classA = classifiedItems.filter(item => item.classification === 'A');
    const classB = classifiedItems.filter(item => item.classification === 'B');
    const classC = classifiedItems.filter(item => item.classification === 'C');

    const classAValue = classA.reduce((sum, item) => sum + item.annualValue, 0);

    return {
      items: classifiedItems,
      classA: classA.map(c => c.item),
      classB: classB.map(c => c.item),
      classC: classC.map(c => c.item),
      metrics: {
        totalItems: items.length,
        totalValue,
        aItems: classA.length,
        bItems: classB.length,
        cItems: classC.length,
        classAValuePercentage: (classAValue / totalValue) * 100
      }
    };
  }, [items]);

  const chartData = useMemo(() => {
    if (!abcAnalysis) return [];
    
    return [
      { name: 'Class A', count: abcAnalysis.metrics.aItems, value: abcAnalysis.classA.reduce((sum, item) => sum + (item.annualDemand || 0) * item.unitCost, 0), color: '#ef4444' },
      { name: 'Class B', count: abcAnalysis.metrics.bItems, value: abcAnalysis.classB.reduce((sum, item) => sum + (item.annualDemand || 0) * item.unitCost, 0), color: '#f59e0b' },
      { name: 'Class C', count: abcAnalysis.metrics.cItems, value: abcAnalysis.classC.reduce((sum, item) => sum + (item.annualDemand || 0) * item.unitCost, 0), color: '#10b981' }
    ];
  }, [abcAnalysis]);

  const addItem = () => {
    if (newItem.sku && newItem.description && newItem.unitCost && newItem.demandRate) {
      const item: InventoryItem = {
        id: Date.now().toString(),
        sku: newItem.sku,
        description: newItem.description || "",
        name: newItem.description || "",
        unitCost: newItem.unitCost,
        demandRate: newItem.demandRate,
        annualDemand: newItem.annualDemand || newItem.demandRate * 12,
        leadTime: 7,
        holdingCostRate: 0.25,
        orderingCost: 100,
        safetyStock: 0,
        reorderPoint: 0,
        economicOrderQuantity: 0,
        serviceLevel: 95
      };
      
      setItems([...items, item]);
      setNewItem({
        sku: "",
        description: "",
        unitCost: 0,
        demandRate: 0,
        annualDemand: 0
      });
    }
  };

  const getClassificationColor = (classification: 'A' | 'B' | 'C') => {
    switch (classification) {
      case 'A': return 'bg-red-100 text-red-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ABC Analysis - Inventory Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={newItem.sku || ""}
                onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                placeholder="Enter SKU"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newItem.description || ""}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Item description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitCost">Unit Cost ($)</Label>
              <Input
                id="unitCost"
                type="number"
                value={newItem.unitCost || ""}
                onChange={(e) => setNewItem({ ...newItem, unitCost: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demandRate">Annual Demand</Label>
              <Input
                id="demandRate"
                type="number"
                value={newItem.demandRate || ""}
                onChange={(e) => setNewItem({ ...newItem, demandRate: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mb-6">
            <Button onClick={addItem} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Item
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import CSV
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Results
            </Button>
          </div>

          {abcAnalysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Classification Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Items:</span>
                      <span className="font-semibold">{abcAnalysis.metrics.totalItems}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Value:</span>
                      <span className="font-semibold">${abcAnalysis.metrics.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge className="bg-red-100 text-red-800">Class A</Badge>
                        <span>{abcAnalysis.metrics.aItems} items ({((abcAnalysis.metrics.aItems/abcAnalysis.metrics.totalItems)*100).toFixed(1)}%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Class B</Badge>
                        <span>{abcAnalysis.metrics.bItems} items ({((abcAnalysis.metrics.bItems/abcAnalysis.metrics.totalItems)*100).toFixed(1)}%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge className="bg-green-100 text-green-800">Class C</Badge>
                        <span>{abcAnalysis.metrics.cItems} items ({((abcAnalysis.metrics.cItems/abcAnalysis.metrics.totalItems)*100).toFixed(1)}%)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Value Distribution</CardTitle>
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
                        dataKey="value"
                        label={({ name, count }) => `${name}: ${count}`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Value"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {abcAnalysis && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Detailed Classification Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">SKU</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Unit Cost</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Annual Demand</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Annual Value</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Classification</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Cumulative %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {abcAnalysis.items.map((result, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">{result.item.sku}</td>
                          <td className="border border-gray-300 px-4 py-2">{result.item.description}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">${result.item.unitCost}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{result.item.annualDemand || result.item.demandRate * 12}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">${result.annualValue.toLocaleString()}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <Badge className={getClassificationColor(result.classification)}>
                              {result.classification}
                            </Badge>
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{result.cumulativePercentage.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ABCAnalysis;
