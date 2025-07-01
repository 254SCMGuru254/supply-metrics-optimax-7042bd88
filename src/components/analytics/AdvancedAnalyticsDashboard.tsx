
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Package, Truck, DollarSign, Clock, AlertTriangle, CheckCircle } from "lucide-react";

const AdvancedAnalyticsDashboard = ({ projectId }: { projectId: string }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);

  // Sample analytics data (in real app, this would come from Supabase)
  const performanceMetrics = [
    { name: "Cost Reduction", value: 23.5, trend: "up", icon: DollarSign, color: "text-green-600" },
    { name: "Delivery Time", value: -15.2, trend: "down", icon: Clock, color: "text-blue-600" },
    { name: "Inventory Turnover", value: 18.7, trend: "up", icon: Package, color: "text-purple-600" },
    { name: "Route Efficiency", value: 31.4, trend: "up", icon: Truck, color: "text-orange-600" }
  ];

  const optimizationHistory = [
    { date: "2024-01", baseline: 100, optimized: 88, savings: 12 },
    { date: "2024-02", baseline: 100, optimized: 85, savings: 15 },
    { date: "2024-03", baseline: 100, optimized: 82, savings: 18 },
    { date: "2024-04", baseline: 100, optimized: 78, savings: 22 },
    { date: "2024-05", baseline: 100, optimized: 75, savings: 25 },
    { date: "2024-06", baseline: 100, optimized: 73, savings: 27 }
  ];

  const modelPerformance = [
    { model: "Center of Gravity", accuracy: 94.2, usage: 65, impact: "High" },
    { model: "Route Optimization", accuracy: 97.8, usage: 89, impact: "Very High" },
    { model: "Inventory Management", accuracy: 91.5, usage: 72, impact: "High" },
    { model: "Network Flow", accuracy: 89.3, usage: 45, impact: "Medium" },
    { model: "Multi-Echelon", accuracy: 96.1, usage: 38, impact: "Very High" }
  ];

  const industryComparison = [
    { metric: "Cost Efficiency", yourValue: 85, industryAvg: 72, kenyaAvg: 68 },
    { metric: "Delivery Performance", yourValue: 94, industryAvg: 81, kenyaAvg: 76 },
    { metric: "Inventory Management", yourValue: 88, industryAvg: 75, kenyaAvg: 71 },
    { metric: "Sustainability Score", yourValue: 76, industryAvg: 63, kenyaAvg: 58 }
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into your supply chain performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Project: {projectId}
          </Badge>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric) => (
          <Card key={metric.name} className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {metric.value > 0 ? '+' : ''}{metric.value}%
                    </span>
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${metric.color}`}>
                  <metric.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Optimization Trends</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
          <TabsTrigger value="comparison">Industry Comparison</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Cost Savings Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={optimizationHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="baseline" stroke="#8884d8" />
                  <Line type="monotone" dataKey="optimized" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Model Accuracy Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={modelPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="accuracy" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Model Usage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={modelPerformance}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="usage"
                      label={({ model, usage }) => `${model}: ${usage}%`}
                    >
                      {modelPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Model Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelPerformance.map((model) => (
                  <div key={model.model} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">{model.model}</div>
                        <div className="text-sm text-gray-500">Accuracy: {model.accuracy}%</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={model.impact === "Very High" ? "default" : model.impact === "High" ? "secondary" : "outline"}
                      >
                        {model.impact} Impact
                      </Badge>
                      <span className="text-sm text-gray-500">{model.usage}% usage</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Performance vs Industry Benchmarks</CardTitle>
              <p className="text-gray-600">Compare your performance against Kenya and global industry averages</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={industryComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="yourValue" fill="#3B82F6" name="Your Performance" />
                  <Bar dataKey="industryAvg" fill="#8B5CF6" name="Global Industry Average" />
                  <Bar dataKey="kenyaAvg" fill="#10B981" name="Kenya Industry Average" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Key Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-green-700">
                  • 27% reduction in total supply chain costs
                </div>
                <div className="text-sm text-green-700">
                  • 94% improvement in delivery performance
                </div>
                <div className="text-sm text-green-700">
                  • 15% reduction in inventory holding costs
                </div>
                <div className="text-sm text-green-700">
                  • 31% increase in route optimization efficiency
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-blue-700">
                  • Consider implementing multi-echelon inventory optimization
                </div>
                <div className="text-sm text-blue-700">
                  • Explore Kenya-specific supplier diversification options
                </div>
                <div className="text-sm text-blue-700">
                  • Optimize for seasonal demand patterns in tea sector
                </div>
                <div className="text-sm text-blue-700">
                  • Implement predictive maintenance for fleet management
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none text-gray-700">
                <p>
                  Your supply chain optimization initiative has delivered exceptional results over the past 6 months. 
                  With a 27% reduction in total costs and 94% improvement in delivery performance, you're outperforming 
                  both Kenya and global industry benchmarks across all key metrics.
                </p>
                <p>
                  The Route Optimization model has been your most effective tool, with 97.8% accuracy and highest usage rate. 
                  Consider expanding its application to additional distribution centers for maximum impact.
                </p>
                <p>
                  Recommended next steps include implementing multi-echelon inventory optimization and exploring 
                  sustainability initiatives to maintain competitive advantage in the Kenya market.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
