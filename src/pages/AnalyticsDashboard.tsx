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
        runningOptimizations: Math.max(
          0,
          prev.runningOptimizations + Math.floor(Math.random() * 3) - 1
        ),
        totalSavings: prev.totalSavings + Math.floor(Math.random() * 1000),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Real-time insights into your supply chain performance
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{realTimeData.activeUsers}</div>
                <p className="text-sm text-gray-500">Current live users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Running Optimizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {realTimeData.runningOptimizations}
                </div>
                <p className="text-sm text-gray-500">Active processes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${realTimeData.totalSavings.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">This month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={costBreakdownData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
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
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((metric) => (
                    <div
                      key={metric.name}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{metric.name}</h4>
                        <p className="text-sm text-gray-500">
                          Target: {metric.target}%
                        </p>
                      </div>
                      <div className="text-2xl font-bold">{metric.value}%</div>
                      {metric.status === 'on-track' && (
                        <Badge variant="secondary">On Track</Badge>
                      )}
                      {metric.status === 'exceeding' && (
                        <Badge variant="default">Exceeding</Badge>
                      )}
                      {metric.status === 'needs-attention' && (
                        <Badge variant="destructive">Needs Attention</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-green-50 text-green-800">
                  <CardHeader>
                    <CardTitle>On-Time Delivery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">95%</div>
                    <p className="text-sm">Orders delivered on schedule</p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 text-blue-800">
                  <CardHeader>
                    <CardTitle>Inventory Turnover</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">8.2x</div>
                    <p className="text-sm">Times inventory is sold per year</p>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 text-yellow-800">
                  <CardHeader>
                    <CardTitle>Customer Satisfaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">4.8/5</div>
                    <p className="text-sm">Average customer rating</p>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 text-red-800">
                  <CardHeader>
                    <CardTitle>Order Fulfillment Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">92%</div>
                    <p className="text-sm">Orders successfully fulfilled</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usageTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" name="Active Users" />
                  <Line
                    type="monotone"
                    dataKey="optimizations"
                    stroke="#82ca9d"
                    name="Optimizations"
                  />
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
