
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ResponsiveContainer, 
  LineChart, 
  BarChart, 
  AreaChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Line, 
  Bar,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Target,
  DollarSign,
  Package,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [kpis, setKpis] = useState({
    totalCostSavings: 1250000,
    efficiencyImprovement: 34.5,
    onTimeDelivery: 97.8,
    inventoryTurnover: 8.2,
    customerSatisfaction: 94.7,
    carbonFootprintReduction: 18.3
  });

  // Mock real-time data
  const performanceData = [
    { date: '2024-01', efficiency: 78, cost: 450000, delivery: 92 },
    { date: '2024-02', efficiency: 82, cost: 420000, delivery: 94 },
    { date: '2024-03', efficiency: 85, cost: 390000, delivery: 96 },
    { date: '2024-04', efficiency: 88, cost: 360000, delivery: 97 },
    { date: '2024-05', efficiency: 91, cost: 340000, delivery: 98 },
    { date: '2024-06', efficiency: 94, cost: 320000, delivery: 97 }
  ];

  const optimizationMetrics = [
    { category: 'Route Optimization', savings: 320000, improvement: 28 },
    { category: 'Inventory Management', savings: 280000, improvement: 22 },
    { category: 'Facility Location', savings: 260000, improvement: 35 },
    { category: 'Network Flow', savings: 190000, improvement: 18 },
    { category: 'Demand Forecasting', savings: 200000, improvement: 15 }
  ];

  const riskMetrics = [
    { risk: 'Supplier Disruption', probability: 15, impact: 'High', mitigation: 85 },
    { risk: 'Transportation Delays', probability: 22, impact: 'Medium', mitigation: 78 },
    { risk: 'Demand Volatility', probability: 30, impact: 'Medium', mitigation: 92 },
    { risk: 'Quality Issues', probability: 8, impact: 'High', mitigation: 95 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Supply Chain Analytics
            </h1>
            <p className="text-gray-600 mt-2">Real-time insights and optimization performance</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Export Report</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
              Real-time Sync
            </Button>
          </div>
        </div>

        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cost Savings</p>
                  <p className="text-2xl font-bold text-green-600">
                    KES {(kpis.totalCostSavings / 1000000).toFixed(1)}M
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12.3% vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Efficiency</p>
                  <p className="text-2xl font-bold text-blue-600">{kpis.efficiencyImprovement}%</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">+8.7% improvement</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">On-Time Delivery</p>
                  <p className="text-2xl font-bold text-purple-600">{kpis.onTimeDelivery}%</p>
                </div>
                <Truck className="h-8 w-8 text-purple-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-sm text-purple-600">+2.1% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inventory Turnover</p>
                  <p className="text-2xl font-bold text-orange-600">{kpis.inventoryTurnover}x</p>
                </div>
                <Package className="h-8 w-8 text-orange-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-sm text-orange-600">+0.9x improvement</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Customer Satisfaction</p>
                  <p className="text-2xl font-bold text-pink-600">{kpis.customerSatisfaction}%</p>
                </div>
                <Target className="h-8 w-8 text-pink-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-pink-500 mr-1" />
                <span className="text-sm text-pink-600">+3.2% satisfaction</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Carbon Reduction</p>
                  <p className="text-2xl font-bold text-emerald-600">{kpis.carbonFootprintReduction}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-sm text-emerald-600">+5.1% reduction</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-1/2">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="efficiency" stroke="#3B82F6" strokeWidth={3} />
                      <Line type="monotone" dataKey="delivery" stroke="#10B981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Cost Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="cost" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Optimization Impact by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizationMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{metric.category}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div>
                            <span className="text-sm text-gray-600">Savings: </span>
                            <span className="font-bold text-green-600">
                              KES {(metric.savings / 1000).toLocaleString()}K
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Improvement: </span>
                            <span className="font-bold text-blue-600">{metric.improvement}%</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={metric.improvement} className="w-24" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Assessment Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMetrics.map((risk, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{risk.risk}</h3>
                        <Badge variant={risk.impact === 'High' ? 'destructive' : 'secondary'}>
                          {risk.impact} Impact
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Probability: </span>
                          <span className="font-bold">{risk.probability}%</span>
                          <Progress value={risk.probability} className="mt-1" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Mitigation: </span>
                          <span className="font-bold text-green-600">{risk.mitigation}%</span>
                          <Progress value={risk.mitigation} className="mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Demand Forecasting Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={optimizationMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="improvement" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
