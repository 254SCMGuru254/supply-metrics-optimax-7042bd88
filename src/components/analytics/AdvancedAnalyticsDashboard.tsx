
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Users, Zap, Target, Database, Activity } from "lucide-react";

// Mock data for analytics
const modelAccuracyData = [
  { model: "Center of Gravity", accuracy: 94, usage: 45, impact: "High" },
  { model: "Route Optimization", accuracy: 89, usage: 78, impact: "Very High" },
  { model: "Inventory Management", accuracy: 92, usage: 56, impact: "High" },
  { model: "Network Flow", accuracy: 87, usage: 34, impact: "Medium" },
  { model: "Facility Location", accuracy: 91, usage: 29, impact: "High" },
];

const performanceMetrics = [
  { name: "Cost Reduction", value: 23, target: 25, status: "on-track" },
  { name: "Service Level", value: 97, target: 95, status: "exceeding" },
  { name: "Processing Speed", value: 87, target: 90, status: "needs-attention" },
  { name: "User Satisfaction", value: 92, target: 88, status: "exceeding" },
];

const usageTrends = [
  { month: "Jan", users: 120, optimizations: 450, savings: 12000 },
  { month: "Feb", users: 145, optimizations: 523, savings: 15600 },
  { month: "Mar", users: 178, optimizations: 612, savings: 18900 },
  { month: "Apr", users: 203, optimizations: 734, savings: 22400 },
  { month: "May", users: 235, optimizations: 856, savings: 26800 },
  { month: "Jun", users: 267, optimizations: 978, savings: 31200 },
];

const systemHealth = [
  { component: "Database", status: "healthy", uptime: 99.9, response: 45 },
  { component: "API Gateway", status: "healthy", uptime: 99.7, response: 120 },
  { component: "Optimization Engine", status: "warning", uptime: 98.5, response: 340 },
  { component: "Map Services", status: "healthy", uptime: 99.8, response: 89 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AdvancedAnalyticsDashboard = () => {
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 47,
    runningOptimizations: 12,
    totalSavings: 156000,
    systemLoad: 67
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        runningOptimizations: Math.max(0, prev.runningOptimizations + Math.floor(Math.random() * 3) - 1),
        totalSavings: prev.totalSavings + Math.floor(Math.random() * 1000),
        systemLoad: Math.max(0, Math.min(100, prev.systemLoad + Math.floor(Math.random() * 10) - 5))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "exceeding": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "on-track": return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "needs-attention": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time insights into system performance, model accuracy, and business impact
        </p>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Live sessions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running Optimizations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData.runningOptimizations}</div>
            <p className="text-xs text-muted-foreground">Active processes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${realTimeData.totalSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Load</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData.systemLoad}%</div>
            <Progress value={realTimeData.systemLoad} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
          <TabsTrigger value="business">Business Impact</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="trends">Usage Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Accuracy & Usage</CardTitle>
              <CardDescription>Performance metrics for optimization models</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelAccuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="model" height={60} textAnchor="end" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="accuracy" fill="#8884d8" name="Accuracy %" />
                  <Bar dataKey="usage" fill="#82ca9d" name="Usage Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Usage Distribution</CardTitle>
              <CardDescription>Relative usage of different optimization models</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={modelAccuracyData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="usage"
                    label={({ model, usage }) => `${model}: ${usage}`}
                  >
                    {modelAccuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key business performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(metric.status)}
                      <div>
                        <h4 className="font-medium">{metric.name}</h4>
                        <p className="text-sm text-muted-foreground">Target: {metric.target}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{metric.value}%</div>
                      <Badge variant={metric.status === "exceeding" ? "default" : metric.status === "on-track" ? "secondary" : "destructive"}>
                        {metric.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Real-time system component monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth.map((component) => (
                  <div key={component.component} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${component.status === "healthy" ? "bg-green-500" : component.status === "warning" ? "bg-yellow-500" : "bg-red-500"}`} />
                      <div>
                        <h4 className="font-medium">{component.component}</h4>
                        <p className="text-sm text-muted-foreground">Response: {component.response}ms</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{component.uptime}%</div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>Monthly growth and usage patterns</CardDescription>
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
                  <Line type="monotone" dataKey="optimizations" stroke="#82ca9d" name="Optimizations" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Savings Trend</CardTitle>
              <CardDescription>Monthly cost savings achieved</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Savings"]} />
                  <Bar dataKey="savings" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
