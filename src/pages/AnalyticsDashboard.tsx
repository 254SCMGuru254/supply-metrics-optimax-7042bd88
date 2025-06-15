
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  Package, 
  MapPin, 
  DollarSign, 
  Users, 
  Truck, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const performanceData = [
    { month: 'Jan', cost: 45000, efficiency: 87, savings: 8500 },
    { month: 'Feb', cost: 42000, efficiency: 89, savings: 9200 },
    { month: 'Mar', cost: 39000, efficiency: 91, savings: 10100 },
    { month: 'Apr', cost: 37000, efficiency: 93, savings: 11300 },
    { month: 'May', cost: 35000, efficiency: 94, savings: 12500 },
    { month: 'Jun', cost: 33000, efficiency: 96, savings: 13800 }
  ];

  const optimizationMetrics = [
    { model: 'Route Optimization', usage: 85, savings: 24, status: 'Active' },
    { model: 'Inventory Management', usage: 92, savings: 28, status: 'Active' },
    { model: 'Network Flow', usage: 78, savings: 18, status: 'Active' },
    { model: 'Center of Gravity', usage: 65, savings: 22, status: 'Active' },
    { model: 'Simulation', usage: 71, savings: 20, status: 'Active' }
  ];

  const costBreakdown = [
    { name: 'Transportation', value: 35, color: '#3B82F6' },
    { name: 'Inventory', value: 28, color: '#10B981' },
    { name: 'Warehousing', value: 20, color: '#8B5CF6' },
    { name: 'Processing', value: 17, color: '#F59E0B' }
  ];

  const kpis = [
    { title: 'Total Cost Reduction', value: '28.5%', change: '+4.2%', icon: <DollarSign className="h-5 w-5" />, color: 'text-green-600' },
    { title: 'Service Level', value: '96.8%', change: '+2.1%', icon: <CheckCircle className="h-5 w-5" />, color: 'text-blue-600' },
    { title: 'Inventory Turnover', value: '8.2x', change: '+1.3x', icon: <Package className="h-5 w-5" />, color: 'text-purple-600' },
    { title: 'On-Time Delivery', value: '94.5%', change: '+3.8%', icon: <Clock className="h-5 w-5" />, color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Command Center
          </h1>
          <p className="text-xl text-gray-600">
            Real-time supply chain optimization insights and performance metrics
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${
                    index === 0 ? 'from-green-500 to-emerald-600' :
                    index === 1 ? 'from-blue-500 to-cyan-600' :
                    index === 2 ? 'from-purple-500 to-violet-600' :
                    'from-orange-500 to-amber-600'
                  } text-white`}>
                    {kpi.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {kpi.change}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</div>
                  <div className="text-sm text-gray-500">{kpi.title}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Cost Reduction Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="cost" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Efficiency Improvements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="efficiency" stroke="#10B981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Optimization Models Performance */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              Optimization Models Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optimizationMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-semibold">{metric.model}</div>
                    <Badge variant={metric.status === 'Active' ? 'default' : 'secondary'}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Usage Rate</div>
                      <div className="font-semibold">{metric.usage}%</div>
                    </div>
                    <Progress value={metric.usage} className="w-24" />
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Cost Savings</div>
                      <div className="font-semibold text-green-600">{metric.savings}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cost Distribution and Savings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-600" />
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
                    nameKey="name"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Monthly Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="savings" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
