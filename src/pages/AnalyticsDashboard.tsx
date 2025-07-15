
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, BarChart3, DollarSign, AlertTriangle, Target, Activity } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface CostBreakdownItem {
  name: string;
  value: number;
  color: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  status: 'on-track' | 'exceeding' | 'needs-attention';
}

interface UsageTrend {
  month: string;
  users: number;
  optimizations: number;
  savings: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const costBreakdownData: CostBreakdownItem[] = [
  { name: 'Transportation', value: 35000, color: '#0088FE' },
  { name: 'Warehousing', value: 25000, color: '#00C49F' },
  { name: 'Inventory', value: 15000, color: '#FFBB28' },
  { name: 'Labor', value: 20000, color: '#FF8042' },
];

const performanceMetrics: PerformanceMetric[] = [
  { name: 'Cost Reduction', value: 23, target: 25, status: 'on-track' },
  { name: 'Service Level', value: 97, target: 95, status: 'exceeding' },
  { name: 'Processing Speed', value: 87, target: 90, status: 'needs-attention' },
];

const usageTrends: UsageTrend[] = [
  { month: 'Jan', users: 120, optimizations: 450, savings: 12000 },
  { month: 'Feb', users: 145, optimizations: 523, savings: 15600 },
  { month: 'Mar', users: 178, optimizations: 612, savings: 18900 },
  { month: 'Apr', users: 203, optimizations: 734, savings: 22400 },
  { month: 'May', users: 235, optimizations: 856, savings: 26800 },
];

const AnalyticsDashboard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 47,
    runningOptimizations: 12,
    totalSavings: 156000,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        runningOptimizations: Math.max(0, prev.runningOptimizations + Math.floor(Math.random() * 3) - 1),
        totalSavings: prev.totalSavings + Math.floor(Math.random() * 1000),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeding': return 'text-green-600';
      case 'on-track': return 'text-blue-600';
      case 'needs-attention': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'exceeding': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'on-track': return <Target className="h-4 w-4 text-blue-600" />;
      case 'needs-attention': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Real-time supply chain performance insights and metrics
        </p>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{realTimeData.activeUsers}</div>
            <div className="text-sm text-gray-600">Active Users</div>
            <div className="flex items-center justify-center mt-2">
              <Activity className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">Live</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{realTimeData.runningOptimizations}</div>
            <div className="text-sm text-gray-600">Running Optimizations</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-xs text-blue-500">Processing</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">${realTimeData.totalSavings.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Savings</div>
            <div className="flex items-center justify-center mt-2">
              <DollarSign className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+$1.2K today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="trends">Usage Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
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
                    >
                      {costBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Cost']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Savings Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usageTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Savings']} />
                    <Line type="monotone" dataKey="savings" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {performanceMetrics.map((metric, index) => (
                <Card key={index} className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      {getStatusIcon(metric.status)}
                      <Badge variant={metric.status === 'exceeding' ? 'default' : metric.status === 'needs-attention' ? 'destructive' : 'secondary'}>
                        {metric.value}%
                      </Badge>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-2">{metric.name}</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Current</span>
                        <span>Target: {metric.target}%</span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={costBreakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Cost']} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Usage and Optimization Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={usageTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="users" fill="#8884d8" name="Users" />
                  <Line yAxisId="right" type="monotone" dataKey="optimizations" stroke="#82ca9d" strokeWidth={2} name="Optimizations" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
