
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  SlidersHorizontal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  annualUsage: number;
  unitCost: number;
  totalValue: number;
  category?: 'A' | 'B' | 'C';
  percentage?: number;
  cumulativePercentage?: number;
}

interface ABCAnalysisProps {
  projectId?: string;
}

export const ABCAnalysis: React.FC<ABCAnalysisProps> = ({ projectId }) => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Sample data for demonstration
  const sampleData: InventoryItem[] = [
    { id: '1', name: 'Item A1', annualUsage: 1000, unitCost: 50, totalValue: 50000 },
    { id: '2', name: 'Item A2', annualUsage: 800, unitCost: 40, totalValue: 32000 },
    { id: '3', name: 'Item B1', annualUsage: 500, unitCost: 30, totalValue: 15000 },
    { id: '4', name: 'Item B2', annualUsage: 300, unitCost: 25, totalValue: 7500 },
    { id: '5', name: 'Item C1', annualUsage: 200, unitCost: 20, totalValue: 4000 },
    { id: '6', name: 'Item C2', annualUsage: 100, unitCost: 15, totalValue: 1500 },
  ];

  useEffect(() => {
    setInventoryData(sampleData);
  }, []);

  const performABCAnalysis = () => {
    setLoading(true);
    
    setTimeout(() => {
      // Sort by total value descending
      const sortedItems = [...inventoryData].sort((a, b) => b.totalValue - a.totalValue);
      
      // Calculate total value
      const totalValue = sortedItems.reduce((sum, item) => sum + item.totalValue, 0);
      
      // Calculate percentages and cumulative percentages
      let cumulativeValue = 0;
      const analyzedItems = sortedItems.map(item => {
        const percentage = (item.totalValue / totalValue) * 100;
        cumulativeValue += item.totalValue;
        const cumulativePercentage = (cumulativeValue / totalValue) * 100;
        
        let category: 'A' | 'B' | 'C' = 'C';
        if (cumulativePercentage <= 80) category = 'A';
        else if (cumulativePercentage <= 95) category = 'B';
        
        return {
          ...item,
          percentage,
          cumulativePercentage,
          category
        };
      });

      // Group by category
      const categoryData = {
        A: analyzedItems.filter(item => item.category === 'A'),
        B: analyzedItems.filter(item => item.category === 'B'),
        C: analyzedItems.filter(item => item.category === 'C')
      };

      const categoryStats = [
        { 
          name: 'Category A', 
          count: categoryData.A.length,
          value: categoryData.A.reduce((sum, item) => sum + item.totalValue, 0),
          color: '#8884d8'
        },
        { 
          name: 'Category B', 
          count: categoryData.B.length,
          value: categoryData.B.reduce((sum, item) => sum + item.totalValue, 0),
          color: '#82ca9d'
        },
        { 
          name: 'Category C', 
          count: categoryData.C.length,
          value: categoryData.C.reduce((sum, item) => sum + item.totalValue, 0),
          color: '#ffc658'
        }
      ];

      setAnalysisResults({
        analyzedItems,
        categoryData,
        categoryStats,
        totalValue,
        recommendations: [
          'Focus on Category A items - they represent 80% of your inventory value',
          'Implement tight controls and frequent monitoring for Category A items',
          'Consider bulk purchasing for Category C items to reduce ordering costs'
        ]
      });
      
      setLoading(false);
      toast({
        title: "ABC Analysis Complete",
        description: "Inventory categorization and recommendations generated"
      });
    }, 2000);
  };

  const addInventoryItem = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: `New Item ${inventoryData.length + 1}`,
      annualUsage: 0,
      unitCost: 0,
      totalValue: 0
    };
    setInventoryData([...inventoryData, newItem]);
  };

  const updateInventoryItem = (id: string, field: keyof InventoryItem, value: any) => {
    setInventoryData(items => items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'annualUsage' || field === 'unitCost') {
          updated.totalValue = updated.annualUsage * updated.unitCost;
        }
        return updated;
      }
      return item;
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'A': return 'bg-red-100 text-red-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          ABC Inventory Analysis
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Categorize inventory items based on their value contribution using the Pareto principle
        </p>
      </div>

      <Tabs defaultValue="data" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data">Inventory Data</TabsTrigger>
          <TabsTrigger value="analysis">ABC Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={addInventoryItem} className="mb-4">
                  Add Item
                </Button>
                
                <div className="grid gap-4">
                  {inventoryData.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                      <div>
                        <Label>Item Name</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateInventoryItem(item.id, 'name', e.target.value)}
                          placeholder="Item name"
                        />
                      </div>
                      <div>
                        <Label>Annual Usage</Label>
                        <Input
                          type="number"
                          value={item.annualUsage}
                          onChange={(e) => updateInventoryItem(item.id, 'annualUsage', parseInt(e.target.value) || 0)}
                          placeholder="Annual usage"
                        />
                      </div>
                      <div>
                        <Label>Unit Cost ($)</Label>
                        <Input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => updateInventoryItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                          placeholder="Unit cost"
                        />
                      </div>
                      <div>
                        <Label>Total Value ($)</Label>
                        <Input
                          value={item.totalValue.toFixed(2)}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="flex items-end">
                        {item.category && (
                          <Badge className={getCategoryColor(item.category)}>
                            Category {item.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={performABCAnalysis} 
                  disabled={loading || inventoryData.length === 0}
                  className="w-full mt-4"
                >
                  {loading ? 'Analyzing...' : 'Perform ABC Analysis'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {analysisResults && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analysisResults.categoryStats}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, count }) => `${name}: ${count} items`}
                      >
                        {analysisResults.categoryStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} items`} />
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
                    <BarChart data={analysisResults.categoryStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Categorized Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['A', 'B', 'C'].map(category => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-semibold">Category {category}</h4>
                        <div className="space-y-1">
                          {analysisResults.categoryData[category].map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span>{item.name}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">
                                  ${item.totalValue.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {item.percentage.toFixed(1)}%
                                </span>
                                <Badge className={getCategoryColor(item.category)}>
                                  {item.category}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {analysisResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  ABC Analysis Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResults.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-semibold">Recommendation {index + 1}</div>
                        <div className="text-sm text-gray-600">{rec}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ABCAnalysis;
