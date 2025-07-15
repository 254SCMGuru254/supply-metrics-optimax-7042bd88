import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, Activity, AlertTriangle, Target, CheckCircle } from 'lucide-react';

const performanceData = [
  { name: 'Route Optimization', value: 85, target: 90, status: 'good' },
  { name: 'Inventory Turnover', value: 92, target: 85, status: 'excellent' },
  { name: 'Cost Reduction', value: 78, target: 80, status: 'warning' },
  { name: 'Service Level', value: 96, target: 95, status: 'excellent' },
];

const usageData = [
  { month: 'Jan', optimizations: 45, savings: 12000 },
  { month: 'Feb', optimizations: 52, savings: 15600 },
  { month: 'Mar', optimizations: 48, savings: 14200 },
  { month: 'Apr', optimizations: 61, savings: 18300 },
  { month: 'May', optimizations: 55, savings: 16500 },
  { month: 'Jun', optimizations: 68, savings: 20400 },
];

const modelData = [
  { model: 'TSP', accuracy: 95, usage: 340, impact: 'High' },
  { model: 'VRP', accuracy: 92, usage: 285, impact: 'High' },
  { model: 'EOQ', accuracy: 88, usage: 420, impact: 'Medium' },
  { model: 'ABC Analysis', accuracy: 91, usage: 380, impact: 'Medium' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const AdvancedAnalyticsDashboard = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <Target className="h-4 w-4 text-blue-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceData.map((metric, index) => (
          <Card key={index} className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                {getStatusIcon(metric.status)}
                <Badge variant={metric.status === 'excellent' ? 'default' : metric.status === 'warning' ? 'destructive' : 'secondary'}>
                  {metric.value}%
                </Badge>
              </div>
              <div className="text-sm font-medium text-foreground">{metric.name}</div>
              <div className="text-xs text-muted-foreground">Target: {metric.target}%</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Trends</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="optimizations" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <TrendingUp className="h-5 w-5" />
                  Cost Savings Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Savings']} />
                    <Line type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Model Usage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={modelData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="usage"
                    >
                      {modelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Usage Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Model Accuracy Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={modelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="accuracy" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Route Optimization Recommendation</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    Consider implementing time-window constraints to improve delivery efficiency by 15%.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Inventory Management Success</h4>
                  <p className="text-green-700 text-sm mt-1">
                    ABC Analysis has reduced carrying costs by 22% over the last quarter.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900">Network Optimization Alert</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Consider adding a distribution center in the southeast region to reduce transportation costs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
