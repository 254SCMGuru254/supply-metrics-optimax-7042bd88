
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calculator, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CostModelingProps {
  projectId?: string;
}

const ComprehensiveCostModeling: React.FC<CostModelingProps> = ({ projectId }) => {
  const [costData, setCostData] = useState({
    transportation: 0,
    warehousing: 0,
    inventory: 0,
    labor: 0,
    technology: 0,
    overhead: 0
  });

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const calculateCostModel = () => {
    setLoading(true);
    
    // Simulate calculation
    setTimeout(() => {
      const totalCost = Object.values(costData).reduce((sum, cost) => sum + cost, 0);
      const costBreakdown = [
        { name: 'Transportation', value: costData.transportation, color: '#8884d8' },
        { name: 'Warehousing', value: costData.warehousing, color: '#82ca9d' },
        { name: 'Inventory', value: costData.inventory, color: '#ffc658' },
        { name: 'Labor', value: costData.labor, color: '#ff7c7c' },
        { name: 'Technology', value: costData.technology, color: '#8dd1e1' },
        { name: 'Overhead', value: costData.overhead, color: '#d084d0' }
      ];

      setResults({
        totalCost,
        costBreakdown,
        recommendations: [
          'Consider optimizing transportation routes to reduce costs by 15%',
          'Implement automated warehousing systems to reduce labor costs',
          'Negotiate better rates with suppliers to reduce inventory costs'
        ]
      });
      setLoading(false);
      
      toast({
        title: "Cost Model Calculated",
        description: "Analysis complete with optimization recommendations"
      });
    }, 2000);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
          Comprehensive Cost Modeling
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Analyze and optimize your total supply chain costs with advanced modeling techniques
        </p>
      </div>

      <Tabs defaultValue="input" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Cost Input</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Cost Components Input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="transportation">Transportation Costs ($)</Label>
                    <Input
                      id="transportation"
                      type="number"
                      value={costData.transportation || ''}
                      onChange={(e) => setCostData({...costData, transportation: parseFloat(e.target.value) || 0})}
                      placeholder="Enter transportation costs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="warehousing">Warehousing Costs ($)</Label>
                    <Input
                      id="warehousing"
                      type="number"
                      value={costData.warehousing || ''}
                      onChange={(e) => setCostData({...costData, warehousing: parseFloat(e.target.value) || 0})}
                      placeholder="Enter warehousing costs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inventory">Inventory Holding Costs ($)</Label>
                    <Input
                      id="inventory"
                      type="number"
                      value={costData.inventory || ''}
                      onChange={(e) => setCostData({...costData, inventory: parseFloat(e.target.value) || 0})}
                      placeholder="Enter inventory costs"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="labor">Labor Costs ($)</Label>
                    <Input
                      id="labor"
                      type="number"
                      value={costData.labor || ''}
                      onChange={(e) => setCostData({...costData, labor: parseFloat(e.target.value) || 0})}
                      placeholder="Enter labor costs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="technology">Technology Costs ($)</Label>
                    <Input
                      id="technology"
                      type="number"
                      value={costData.technology || ''}
                      onChange={(e) => setCostData({...costData, technology: parseFloat(e.target.value) || 0})}
                      placeholder="Enter technology costs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="overhead">Overhead Costs ($)</Label>
                    <Input
                      id="overhead"
                      type="number"
                      value={costData.overhead || ''}
                      onChange={(e) => setCostData({...costData, overhead: parseFloat(e.target.value) || 0})}
                      placeholder="Enter overhead costs"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button 
                  onClick={calculateCostModel} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Calculating...' : 'Calculate Cost Model'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {results && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={results.costBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {results.costBreakdown.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-600">Total Cost</div>
                        <div className="text-2xl font-bold">${results.totalCost.toLocaleString()}</div>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      {results.costBreakdown.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{item.name}</span>
                          <span className="font-semibold">${item.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {results && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Optimization Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
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

export default ComprehensiveCostModeling;
