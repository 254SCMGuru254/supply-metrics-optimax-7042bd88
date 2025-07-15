
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, DollarSign, TrendingUp, FileText } from 'lucide-react';

interface CostModelInputs {
  transportationCost: number;
  warehouseCost: number;
  inventoryCost: number;
  laborCost: number;
  fuelCost: number;
  maintenanceCost: number;
}

const ComprehensiveCostModeling = () => {
  const [inputs, setInputs] = useState<CostModelInputs>({
    transportationCost: 50000,
    warehouseCost: 30000,
    inventoryCost: 25000,
    laborCost: 40000,
    fuelCost: 15000,
    maintenanceCost: 10000,
  });

  const [results, setResults] = useState<any>(null);

  const costBreakdown = [
    { name: 'Transportation', value: inputs.transportationCost, color: '#0088FE' },
    { name: 'Warehouse', value: inputs.warehouseCost, color: '#00C49F' },
    { name: 'Inventory', value: inputs.inventoryCost, color: '#FFBB28' },
    { name: 'Labor', value: inputs.laborCost, color: '#FF8042' },
    { name: 'Fuel', value: inputs.fuelCost, color: '#8884D8' },
    { name: 'Maintenance', value: inputs.maintenanceCost, color: '#82CA9D' },
  ];

  const calculateTotalCost = () => {
    const totalCost = Object.values(inputs).reduce((sum, cost) => sum + cost, 0);
    const breakdown = costBreakdown.map(item => ({
      ...item,
      percentage: ((item.value / totalCost) * 100).toFixed(1)
    }));

    // Cost optimization recommendations
    const recommendations = [];
    if (inputs.transportationCost > totalCost * 0.35) {
      recommendations.push("Consider route optimization to reduce transportation costs");
    }
    if (inputs.inventoryCost > totalCost * 0.20) {
      recommendations.push("Implement just-in-time inventory management");
    }
    if (inputs.fuelCost > totalCost * 0.15) {
      recommendations.push("Evaluate fuel-efficient vehicles or alternative transportation modes");
    }

    setResults({
      totalCost,
      breakdown,
      recommendations,
      costPerUnit: (totalCost / 1000).toFixed(2), // Assuming 1000 units
      potentialSavings: totalCost * 0.15, // 15% potential savings
    });
  };

  const handleInputChange = (field: keyof CostModelInputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Comprehensive Cost Modeling Suite</h1>
        <p className="text-muted-foreground mt-2">
          Advanced supply chain cost analysis and optimization tools
        </p>
      </div>

      <Tabs defaultValue="inputs" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="inputs">Cost Inputs</TabsTrigger>
          <TabsTrigger value="analysis">Cost Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Cost Input Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(inputs).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                    <Input
                      id={key}
                      type="number"
                      value={value}
                      onChange={(e) => handleInputChange(key as keyof CostModelInputs, e.target.value)}
                      placeholder="Enter cost"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button onClick={calculateTotalCost} className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Total Cost
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          {results && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {results.breakdown.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Cost']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600">Total Cost</div>
                      <div className="text-xl font-bold text-blue-900">
                        ${results.totalCost.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-600">Cost per Unit</div>
                      <div className="text-xl font-bold text-green-900">
                        ${results.costPerUnit}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-yellow-600">Potential Savings</div>
                    <div className="text-xl font-bold text-yellow-900">
                      ${results.potentialSavings.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="optimization">
          {results && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Cost Optimization Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <p className="text-sm">{recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Cost Analysis Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Executive Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive cost analysis reveals optimization opportunities across
                    transportation, inventory, and operational expenses.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Key Findings</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Transportation costs represent the largest expense category</li>
                    <li>• Inventory carrying costs can be reduced through better forecasting</li>
                    <li>• Fuel efficiency improvements can yield significant savings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveCostModeling;
