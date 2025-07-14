
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
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
  Clock,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

// Data Types
interface Kpi {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}
interface PerformanceData {
  month: string;
  cost: number;
  efficiency: number;
  savings: number;
}
interface OptimizationMetric {
  model: string;
  usage: number;
  savings: number;
  status: string;
}
interface CostBreakdownItem {
  name: string;
  value: number;
  color: string;
}

// Icon Map
const iconMap: { [key: string]: React.ComponentType<any> } = {
  DollarSign, CheckCircle, Package, Clock, TrendingUp, Activity, MapPin, BarChart3,
  default: Package
};

// Loading Skeletons
const KpiCardSkeleton = () => (
  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-lg bg-gray-200 animate-pulse"></div>
        <div className="h-6 w-16 rounded-md bg-gray-200 animate-pulse"></div>
      </div>
      <div className="mt-4">
        <div className="h-8 w-24 rounded-md bg-gray-200 animate-pulse mb-2"></div>
        <div className="h-4 w-32 rounded-md bg-gray-200 animate-pulse"></div>
      </div>
    </CardContent>
  </Card>
);

const ChartSkeleton = () => (
  <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
    <CardHeader>
      <div className="h-6 w-48 rounded-md bg-gray-200 animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="h-[300px] w-full rounded-md bg-gray-200 animate-pulse"></div>
    </CardContent>
  </Card>
);

const AnalyticsDashboard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [optimizationMetrics, setOptimizationMetrics] = useState<OptimizationMetric[]>([]);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdownItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !projectId) return;

      setLoading(true);
      setError(null);

      try {
        const mockKpis = [
          { title: "Total Cost Savings", value: "$2.4M", change: "+12%", icon: "DollarSign", color: "from-green-500 to-green-600" },
          { title: "Optimization Success", value: "94%", change: "+5%", icon: "CheckCircle", color: "from-blue-500 to-blue-600" },
          { title: "Active Projects", value: "28", change: "+8", icon: "Package", color: "from-purple-500 to-purple-600" },
          { title: "Processing Time", value: "2.3s", change: "-15%", icon: "Clock", color: "from-orange-500 to-orange-600" }
        ];

        const mockPerformanceData = [
          { month: "Jan", cost: 85000, efficiency: 78, savings: 12000 },
          { month: "Feb", cost: 82000, efficiency: 82, savings: 15000 },
          { month: "Mar", cost: 78000, efficiency: 85, savings: 18000 },
          { month: "Apr", cost: 75000, efficiency: 88, savings: 22000 },
          { month: "May", cost: 72000, efficiency: 91, savings: 25000 },
          { month: "Jun", cost: 69000, efficiency: 94, savings: 28000 }
        ];

        const mockOptimizationMetrics = [
          { model: "Center of Gravity", usage: 85, savings: 23, status: "Active" },
          { model: "Route Optimization", usage: 92, savings: 35, status: "Active" },
          { model: "Inventory Management", usage: 76, savings: 18, status: "Active" },
          { model: "Network Flow", usage: 68, savings: 12, status: "Inactive" }
        ];

        const mockCostBreakdown = [
          { name: "Transportation", value: 35, color: "#8884d8" },
          { name: "Warehousing", value: 25, color: "#82ca9d" },
          { name: "Inventory", value: 20, color: "#ffc658" },
          { name: "Labor", value: 15, color: "#ff7c7c" },
          { name: "Other", value: 5, color: "#8dd1e1" }
        ];

        setKpis(mockKpis);
        setPerformanceData(mockPerformanceData);
        setOptimizationMetrics(mockOptimizationMetrics);
        setCostBreakdown(mockCostBreakdown);

      } catch (error: any) {
        console.error("Failed to fetch analytics data:", error);
        setError(error.message || "An unknown error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, user]);

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

        {error && (
            <Card className="border-destructive bg-destructive/10">
                <CardContent className="p-4 flex items-center gap-4">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <p className="text-sm text-destructive">Could not load analytics data: {error}</p>
                </CardContent>
            </Card>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              <KpiCardSkeleton />
              <KpiCardSkeleton />
              <KpiCardSkeleton />
              <KpiCardSkeleton />
            </>
          ) : (
            kpis.map((kpi, index) => {
              const Icon = iconMap[kpi.icon] || iconMap.default;
              const textColor = kpi.color.replace('from-', 'text-').replace(/-500$/, '-600').split(' ')[0];
              return (
                <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${kpi.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {kpi.change}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <div className={`text-3xl font-bold ${textColor}`}>{kpi.value}</div>
                      <div className="text-sm text-gray-500">{kpi.title}</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? <ChartSkeleton /> : (
            <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Cost Reduction Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cost" stroke="#3B82F6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {loading ? <ChartSkeleton /> : (
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
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="efficiency" stroke="#10B981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Optimization Models Performance */}
        {loading ? <ChartSkeleton /> : (
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
        )}

        {/* Cost Distribution and Savings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {loading ? <ChartSkeleton /> : (
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
                      data={costBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
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
          )}

          {loading ? <ChartSkeleton /> : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
