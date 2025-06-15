
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { 
  Activity, TrendingUp, Package, MapPin, Calculator, 
  Users, DollarSign, Clock, AlertTriangle, CheckCircle
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Sample data for charts
  const performanceData = [
    { month: 'Jan', cost: 45000, savings: 8000, efficiency: 85 },
    { month: 'Feb', cost: 42000, savings: 11000, efficiency: 87 },
    { month: 'Mar', cost: 38000, savings: 15000, efficiency: 90 },
    { month: 'Apr', cost: 35000, savings: 18000, efficiency: 92 },
    { month: 'May', cost: 32000, savings: 21000, efficiency: 94 },
    { month: 'Jun', cost: 30000, savings: 23000, efficiency: 96 }
  ];

  const optimizationMetrics = [
    { name: 'Route Optimization', value: 25, color: '#3B82F6' },
    { name: 'Inventory Management', value: 30, color: '#10B981' },
    { name: 'Network Design', value: 20, color: '#F59E0B' },
    { name: 'Demand Forecasting', value: 15, color: '#EF4444' },
    { name: 'Cost Reduction', value: 10, color: '#8B5CF6' }
  ];

  const kpiData = [
    {
      title: 'Total Cost Savings',
      value: 'KES 2.3M',
      change: '+18%',
      trend: 'up',
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      title: 'Service Level',
      value: '96.8%',
      change: '+2.3%',
      trend: 'up',
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      title: 'Avg Transit Time',
      value: '4.2 days',
      change: '-0.8 days',
      trend: 'down',
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: 'Active Models',
      value: '6',
      change: '+2',
      trend: 'up',
      icon: <Activity className="h-6 w-6" />
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Real-time supply chain performance insights</p>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Activity className="h-4 w-4 mr-2" />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-gray-600">{kpi.icon}</div>
                  <Badge variant={kpi.trend === 'up' ? 'default' : 'secondary'}>
                    {kpi.change}
                  </Badge>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
                  <p className="text-sm text-gray-600">{kpi.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Cost Savings Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="savings" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        name="Savings (KES)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Optimization Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={optimizationMetrics}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {optimizationMetrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cost" fill="#EF4444" name="Total Cost (KES)" />
                    <Bar dataKey="savings" fill="#10B981" name="Savings (KES)" />
                    <Bar dataKey="efficiency" fill="#3B82F6" name="Efficiency (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Route Optimization', usage: 92, status: 'Active', savings: '25%' },
                { name: 'Inventory Management', usage: 87, status: 'Active', savings: '30%' },
                { name: 'Network Design', usage: 78, status: 'Active', savings: '20%' },
                { name: 'Demand Forecasting', usage: 65, status: 'Active', savings: '15%' },
                { name: 'Cost Modeling', usage: 45, status: 'Testing', savings: '12%' },
                { name: 'Risk Assessment', usage: 38, status: 'Development', savings: '8%' }
              ].map((model, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <Badge variant={model.status === 'Active' ? 'default' : 'secondary'}>
                      {model.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Usage Rate</span>
                        <span className="text-sm font-semibold">{model.usage}%</span>
                      </div>
                      <Progress value={model.usage} />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{model.savings}</div>
                      <div className="text-sm text-gray-600">Cost Savings</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Demand Forecasting Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">94.2%</div>
                    <div className="text-sm text-gray-600">Overall Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">2.1 days</div>
                    <div className="text-sm text-gray-600">Avg Forecast Horizon</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">87%</div>
                    <div className="text-sm text-gray-600">Model Confidence</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      name="Forecast Accuracy (%)"
                    />
                  </LineChart>
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
