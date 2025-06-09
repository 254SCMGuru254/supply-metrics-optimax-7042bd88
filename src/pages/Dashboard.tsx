
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  CircleDollarSign, 
  Package, 
  Truck, 
  Clock,
  LayoutDashboard,
  LineChart
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Line, 
  Bar
} from "recharts";

const Dashboard = () => {
  // Mock data for charts
  const performanceData = [
    { month: 'Jan', optimization: 85, traditional: 65 },
    { month: 'Feb', optimization: 89, traditional: 67 },
    { month: 'Mar', optimization: 92, traditional: 69 },
    { month: 'Apr', optimization: 88, traditional: 71 },
    { month: 'May', optimization: 95, traditional: 73 },
    { month: 'Jun', optimization: 97, traditional: 75 },
  ];

  const costSavingsData = [
    { category: 'Transportation', savings: 24000 },
    { category: 'Inventory', savings: 18500 },
    { category: 'Warehousing', savings: 15200 },
    { category: 'Distribution', savings: 12800 },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8" />
            Supply Chain Dashboard
          </h2>
          <p className="text-muted-foreground">
            Monitor your optimization performance and key metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost Savings</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$70,500</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5%
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivery Efficiency</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">97.2%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.3%
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.4x</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +0.7x
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Lead Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2 days</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -0.8 days
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Performance Comparison
                </CardTitle>
                <CardDescription>
                  Optimized vs Traditional Methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="optimization" 
                      stroke="#8884d8" 
                      name="Optimized" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="traditional" 
                      stroke="#82ca9d" 
                      name="Traditional" 
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Cost Savings by Category
                </CardTitle>
                <CardDescription>
                  Monthly savings breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={costSavingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="savings" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Access your most used optimization tools
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-4">
              <Button variant="outline" className="justify-start">
                <Package className="mr-2 h-4 w-4" />
                Inventory Optimization
              </Button>
              <Button variant="outline" className="justify-start">
                <Truck className="mr-2 h-4 w-4" />
                Route Optimization
              </Button>
              <Button variant="outline" className="justify-start">
                <Activity className="mr-2 h-4 w-4" />
                Network Analysis
              </Button>
              <Button variant="outline" className="justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Demand Forecasting
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Detailed performance analysis and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Overall Efficiency</span>
                  <Badge variant="secondary">94.7%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cost Reduction</span>
                  <Badge variant="secondary">-15.3%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Service Level</span>
                  <Badge variant="secondary">99.1%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Deep insights and predictive analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced analytics features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
