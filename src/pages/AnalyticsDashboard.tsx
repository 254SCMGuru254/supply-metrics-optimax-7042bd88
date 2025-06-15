
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Package, 
  Truck,
  BarChart3,
  Target,
  Clock,
  Users
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [activeMetrics, setActiveMetrics] = useState('overview');

  // Sample data for different charts
  const performanceData = [
    { name: 'Jan', efficiency: 85, cost: 120000, volume: 450 },
    { name: 'Feb', efficiency: 88, cost: 115000, volume: 480 },
    { name: 'Mar', efficiency: 92, cost: 108000, volume: 520 },
    { name: 'Apr', efficiency: 89, cost: 112000, volume: 510 },
    { name: 'May', efficiency: 94, cost: 105000, volume: 580 },
    { name: 'Jun', efficiency: 96, cost: 98000, volume: 620 }
  ];

  const distributionData = [
    { name: 'Road Transport', value: 45, color: '#3B82F6' },
    { name: 'Rail Transport', value: 25, color: '#10B981' },
    { name: 'Air Transport', value: 15, color: '#F59E0B' },
    { name: 'Sea Transport', value: 15, color: '#8B5CF6' }
  ];

  const kpiData = [
    {
      title: 'Total Cost Savings',
      value: 'KES 2.4M',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'Month over month improvement'
    },
    {
      title: 'Supply Chain Efficiency',
      value: '94.2%',
      change: '+3.8%',
      trend: 'up',
      icon: Activity,
      description: 'Overall network performance'
    },
    {
      title: 'Inventory Turnover',
      value: '8.4x',
      change: '+0.6x',
      trend: 'up',
      icon: Package,
      description: 'Annual turnover rate'
    },
    {
      title: 'Delivery Performance',
      value: '98.1%',
      change: '-0.3%',
      trend: 'down',
      icon: Truck,
      description: 'On-time delivery rate'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time insights and performance metrics for your supply chain optimization
          </p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={selectedTimeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="text-3xl font-bold">{kpi.value}</p>
                    <div className="flex items-center gap-2">
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {kpi.change}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{kpi.description}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeMetrics} onValueChange={setActiveMetrics}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Supply Chain Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Efficiency %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Transport Mode Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {distributionData.map((entry, index) => (
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

        <TabsContent value="performance" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill="#3B82F6" name="Volume (units)" />
                  <Bar dataKey="efficiency" fill="#10B981" name="Efficiency %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { region: 'Nairobi Region', performance: 96, change: '+2.1%' },
                  { region: 'Mombasa Region', performance: 92, change: '+1.8%' },
                  { region: 'Kisumu Region', performance: 88, change: '+0.5%' },
                  { region: 'Nakuru Region', performance: 85, change: '-0.3%' }
                ].map((region, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{region.region}</span>
                      <span className="text-sm text-muted-foreground">{region.change}</span>
                    </div>
                    <Progress value={region.performance} className="h-2" />
                    <div className="text-right text-sm font-medium">{region.performance}%</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      name="Cost (KES)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Demand Forecasting Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { model: 'ARIMA', accuracy: '94.2%', mape: '5.8%' },
                  { model: 'LSTM Neural Network', accuracy: '96.1%', mape: '3.9%' },
                  { model: 'Prophet', accuracy: '92.7%', mape: '7.3%' }
                ].map((model, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{model.model}</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Accuracy:</span>
                          <span className="font-medium">{model.accuracy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">MAPE:</span>
                          <span className="font-medium">{model.mape}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name="Actual Volume"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Forecasted Efficiency"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
