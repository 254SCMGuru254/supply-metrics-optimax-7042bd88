
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, Truck, MapPin, Activity, Download, RefreshCw } from 'lucide-react';

const analyticsData = {
  kpis: [
    { name: 'Total Cost Reduction', value: '24%', trend: 'up', color: 'text-green-600' },
    { name: 'Service Level', value: '96.8%', trend: 'up', color: 'text-blue-600' },
    { name: 'Inventory Turnover', value: '8.2x', trend: 'up', color: 'text-purple-600' },
    { name: 'Transport Efficiency', value: '89%', trend: 'down', color: 'text-orange-600' }
  ],
  costBreakdown: [
    { name: 'Transportation', value: 45, color: '#3B82F6' },
    { name: 'Warehousing', value: 25, color: '#10B981' },
    { name: 'Inventory Holding', value: 20, color: '#F59E0B' },
    { name: 'Administrative', value: 10, color: '#8B5CF6' }
  ],
  performanceTrends: [
    { month: 'Jan', cost: 120000, service: 94, efficiency: 85 },
    { month: 'Feb', cost: 115000, service: 95, efficiency: 87 },
    { month: 'Mar', cost: 108000, service: 96, efficiency: 89 },
    { month: 'Apr', cost: 102000, service: 97, efficiency: 91 },
    { month: 'May', cost: 98000, service: 96, efficiency: 89 },
    { month: 'Jun', cost: 94000, service: 97, efficiency: 92 }
  ],
  routeOptimization: [
    { route: 'Nairobi-Mombasa', distance: 485, cost: 15000, efficiency: 92 },
    { route: 'Nairobi-Kisumu', distance: 345, cost: 12000, efficiency: 89 },
    { route: 'Mombasa-Nakuru', distance: 520, cost: 18000, efficiency: 87 },
    { route: 'Kisumu-Eldoret', distance: 210, cost: 8000, efficiency: 94 }
  ],
  inventoryMetrics: [
    { product: 'Tea', stock: 850, demand: 1000, turnover: 8.5 },
    { product: 'Coffee', stock: 450, demand: 500, turnover: 9.2 },
    { product: 'Flowers', stock: 200, demand: 250, turnover: 12.1 },
    { product: 'Vegetables', stock: 300, demand: 400, turnover: 15.3 }
  ]
};

export const AnalyticsDashboard = () => {
  const [activeMetric, setActiveMetric] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Real-time supply chain performance insights</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={refreshData} 
              variant="outline"
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsData.kpis.map((kpi, index) => (
            <Card key={index} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.name}</p>
                    <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Analytics Tabs */}
        <Tabs value={activeMetric} onValueChange={setActiveMetric} className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="routes">Route Performance</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Metrics</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Trends */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.performanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="cost" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        name="Cost (KES)"
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="service" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        name="Service Level (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cost Breakdown */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Cost Distribution
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
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.costBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Detailed Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData.performanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cost" fill="#3B82F6" name="Total Cost (KES)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-600" />
                  Route Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Route</th>
                        <th className="text-left p-3">Distance (km)</th>
                        <th className="text-left p-3">Cost (KES)</th>
                        <th className="text-left p-3">Efficiency</th>
                        <th className="text-left p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.routeOptimization.map((route, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{route.route}</td>
                          <td className="p-3">{route.distance}</td>
                          <td className="p-3">{route.cost.toLocaleString()}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Progress value={route.efficiency} className="w-20" />
                              <span className="text-sm">{route.efficiency}%</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant={route.efficiency > 90 ? "default" : "secondary"}>
                              {route.efficiency > 90 ? "Optimal" : "Good"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  Inventory Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData.inventoryMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="turnover" fill="#8B5CF6" name="Turnover Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Demand Forecasting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Advanced Forecasting Models</h3>
                  <p className="text-gray-500">AI-powered demand forecasting coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
