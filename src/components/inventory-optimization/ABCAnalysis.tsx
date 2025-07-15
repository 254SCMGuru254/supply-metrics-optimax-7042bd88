import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Package, 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  Calculator,
  Database,
  Settings,
  Download,
  Upload,
  Sliders
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  unitCost: number;
  annualDemand: number;
}

interface ABCAnalysisProps {
  inventoryData: InventoryItem[];
  onAnalysisComplete: (results: any) => void;
}

interface AnalysisResults {
  distribution: { name: string; count: number; value: number; cumulativePercentage: number; color: string }[];
  totalValue: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const ABCAnalysis: React.FC<ABCAnalysisProps> = ({ inventoryData, onAnalysisComplete }) => {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (inventoryData && inventoryData.length > 0) {
      performAnalysis();
    }
  }, [inventoryData]);

  const performAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      const totalValue = inventoryData.reduce((sum, item) => sum + item.unitCost * item.annualDemand, 0);
      const itemsWithValue = inventoryData.map(item => ({ ...item, value: item.unitCost * item.annualDemand }));
      const sortedItems = [...itemsWithValue].sort((a, b) => b.value - a.value);

      let cumulativeValue = 0;
      const distribution = sortedItems.map((item, index) => {
        cumulativeValue += item.value;
        const cumulativePercentage = (cumulativeValue / totalValue) * 100;
        let category = 'C';
        let color = COLORS[2];
        if (cumulativePercentage <= 80) {
          category = 'B';
          color = COLORS[1];
        }
        if (cumulativePercentage <= 50) {
          category = 'A';
          color = COLORS[0];
        }
        return {
          name: category,
          count: 1,
          value: item.value,
          cumulativePercentage,
          color
        };
      });

      const consolidatedDistribution = distribution.reduce((acc: any[], item) => {
        const existingCategory = acc.find(cat => cat.name === item.name);
        if (existingCategory) {
          existingCategory.count += item.count;
          existingCategory.value += item.value;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, []);

      setResults({
        distribution: consolidatedDistribution,
        totalValue
      });
      setLoading(false);
      toast({
        title: "ABC Analysis Complete",
        description: "Inventory items classified based on value"
      });
      onAnalysisComplete({
        distribution: consolidatedDistribution,
        totalValue
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
          ABC Inventory Analysis
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Classify inventory items based on their value and prioritize management efforts
        </p>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          {results && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>ABC Classification Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={results.distribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, count }) => `${name}: ${count}`}
                      >
                        {results.distribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any, name: any) => [value, `${name} Items`]} />
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
                    <BarChart data={results.distribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: any, name: any) => [`$${value.toLocaleString()}`, `${name} Value`]} />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cumulative Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={results.distribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: any, name: any) => [`${value}%`, `Cumulative ${name}`]} />
                      <Bar dataKey="cumulativePercentage" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Inventory Management Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold">Focus on A Items</div>
                  <div className="text-sm text-gray-600">
                    Implement strict inventory control and regular monitoring for A category items.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-semibold">Optimize B Items</div>
                  <div className="text-sm text-gray-600">
                    Apply moderate inventory control measures and periodic reviews for B category items.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <div className="font-semibold">Simplify C Items</div>
                  <div className="text-sm text-gray-600">
                    Use simple inventory control techniques and infrequent reviews for C category items.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Analysis Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="a-threshold">A Category Threshold (%)</Label>
                <Input id="a-threshold" type="number" defaultValue="50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="b-threshold">B Category Threshold (%)</Label>
                <Input id="b-threshold" type="number" defaultValue="80" />
              </div>
              <Button variant="outline">
                <Sliders className="h-4 w-4 mr-2" />
                Adjust Thresholds
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ABCAnalysis;
