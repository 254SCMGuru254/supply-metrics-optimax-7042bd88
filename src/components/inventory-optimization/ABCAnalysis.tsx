
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, AlertCircle } from 'lucide-react';
import { InventoryItem, ABCAnalysisResult } from '@/components/map/MapTypes';

interface ABCAnalysisProps {
  projectId: string;
  items?: InventoryItem[];
}

export const ABCAnalysis = ({ projectId, items = [] }: ABCAnalysisProps) => {
  // Mock data for demonstration
  const mockItems: InventoryItem[] = items.length > 0 ? items : [
    {
      id: '1',
      sku: 'A001',
      description: 'High-value component',
      unitCost: 500,
      demandRate: 100,
      leadTime: 7,
      holdingCostRate: 0.25,
      orderingCost: 50,
      safetyStock: 20,
      reorderPoint: 150,
      economicOrderQuantity: 40,
      abcClassification: 'A',
      annualValue: 50000
    },
    {
      id: '2',
      sku: 'B002',
      description: 'Medium-value component',
      unitCost: 100,
      demandRate: 200,
      leadTime: 5,
      holdingCostRate: 0.20,
      orderingCost: 30,
      safetyStock: 15,
      reorderPoint: 100,
      economicOrderQuantity: 60,
      abcClassification: 'B',
      annualValue: 20000
    },
    {
      id: '3',
      sku: 'C003',
      description: 'Low-value component',
      unitCost: 10,
      demandRate: 500,
      leadTime: 3,
      holdingCostRate: 0.15,
      orderingCost: 20,
      safetyStock: 10,
      reorderPoint: 50,
      economicOrderQuantity: 100,
      abcClassification: 'C',
      annualValue: 5000
    }
  ];

  const performABCAnalysis = (items: InventoryItem[]): ABCAnalysisResult[] => {
    const totalValue = items.reduce((sum, item) => sum + (item.annualValue || 0), 0);
    
    const sortedItems = items
      .map(item => ({
        ...item,
        annualValue: item.annualValue || item.unitCost * item.demandRate
      }))
      .sort((a, b) => b.annualValue - a.annualValue);

    let cumulativeValue = 0;
    const results: ABCAnalysisResult[] = [];

    sortedItems.forEach(item => {
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

      results.push({
        item,
        annualValue: item.annualValue,
        percentage,
        cumulativePercentage,
        classification
      });
    });

    return results;
  };

  const abcResults = performABCAnalysis(mockItems);
  
  const summaryData = [
    { 
      class: 'A', 
      count: abcResults.filter(r => r.classification === 'A').length,
      value: abcResults.filter(r => r.classification === 'A').reduce((sum, r) => sum + r.annualValue, 0)
    },
    { 
      class: 'B', 
      count: abcResults.filter(r => r.classification === 'B').length,
      value: abcResults.filter(r => r.classification === 'B').reduce((sum, r) => sum + r.annualValue, 0)
    },
    { 
      class: 'C', 
      count: abcResults.filter(r => r.classification === 'C').length,
      value: abcResults.filter(r => r.classification === 'C').reduce((sum, r) => sum + r.annualValue, 0)
    }
  ];

  const columns = [
    {
      key: 'sku' as keyof ABCAnalysisResult,
      header: 'SKU',
      render: (value: any, row: ABCAnalysisResult) => row.item.sku
    },
    {
      key: 'description' as keyof ABCAnalysisResult,
      header: 'Description',
      render: (value: any, row: ABCAnalysisResult) => row.item.description
    },
    {
      key: 'annualValue' as keyof ABCAnalysisResult,
      header: 'Annual Value',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      key: 'percentage' as keyof ABCAnalysisResult,
      header: 'Percentage',
      render: (value: number) => `${value.toFixed(1)}%`
    },
    {
      key: 'cumulativePercentage' as keyof ABCAnalysisResult,
      header: 'Cumulative %',
      render: (value: number) => `${value.toFixed(1)}%`
    },
    {
      key: 'classification' as keyof ABCAnalysisResult,
      header: 'Class',
      render: (value: 'A' | 'B' | 'C') => (
        <Badge variant={value === 'A' ? 'default' : value === 'B' ? 'secondary' : 'outline'}>
          Class {value}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryData.map((data) => (
          <Card key={data.class}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class {data.class} Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.count}</div>
              <p className="text-xs text-muted-foreground">
                ${data.value.toLocaleString()} annual value
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ABC Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            ABC Classification Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            ABC Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={abcResults}
            columns={columns}
          />
        </CardContent>
      </Card>
    </div>
  );
};
