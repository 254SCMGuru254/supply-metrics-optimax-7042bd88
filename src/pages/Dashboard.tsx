
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LayoutDashboard, 
  BarChart3, 
  MapPin, 
  Settings, 
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Package,
  Network,
  Calculator,
  Truck,
  Factory,
  Store,
  Hexagon,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [activeProjects, setActiveProjects] = useState([
    {
      id: 1,
      name: "Kenya Tea Distribution Network",
      model: "Center of Gravity + Network Flow",
      status: "Running",
      progress: 85,
      lastUpdated: "15 minutes ago",
      estimatedCompletion: "2 hours",
      costSavings: "22.5%"
    },
    {
      id: 2,
      name: "Nairobi-Mombasa Route Optimization", 
      model: "Vehicle Routing Problem (VRP)",
      status: "Completed",
      progress: 100,
      lastUpdated: "3 hours ago",
      estimatedCompletion: "Completed",
      costSavings: "18.3%"
    },
    {
      id: 3,
      name: "Coffee Supply Chain Multi-Echelon",
      model: "Multi-Echelon Inventory Optimization",
      status: "Queued",
      progress: 0,
      lastUpdated: "1 hour ago",
      estimatedCompletion: "Pending",
      costSavings: "Est. 25%"
    }
  ]);

  const [systemMetrics, setSystemMetrics] = useState({
    totalProjects: 12,
    activeOptimizations: 3,
    completedThisMonth: 8,
    avgCostSavings: 19.7,
    totalLocationsOptimized: 247,
    systemUptime: 99.8,
    apiResponseTime: 1.2,
    optimizationAccuracy: 99.4
  });

  // Performance data for charts
  const performanceData = [
    { month: 'Jan', savings: 15.2, projects: 5 },
    { month: 'Feb', savings: 18.7, projects: 7 },
    { month: 'Mar', savings: 22.1, projects: 9 },
    { month: 'Apr', savings: 19.8, projects: 12 },
    { month: 'May', savings: 21.5, projects: 15 },
    { month: 'Jun', savings: 19.7, projects: 12 }
  ];

  const modelUsageData = [
    { name: 'Center of Gravity', value: 35, color: '#8884d8' },
    { name: 'Network Optimization', value: 25, color: '#82ca9d' },
    { name: 'Route Optimization', value: 20, color: '#ffc658' },
    { name: 'Inventory Management', value: 12, color: '#ff7300' },
    { name: 'Other Models', value: 8, color: '#8dd1e1' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Running":
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Queued":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Running":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Queued":
        return "bg-yellow-100 text-yellow-800";
      case "Error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8" />
            Supply Chain Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor optimization projects, track performance, and manage your supply chain operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/data-input">
              <Package className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.activeOptimizations}</div>
            <p className="text-xs text-muted-foreground">
              +{systemMetrics.completedThisMonth - 5} from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cost Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.avgCostSavings}%</div>
            <p className="text-xs text-muted-foreground">
              Across all optimization models
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations Optimized</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalLocationsOptimized}</div>
            <p className="text-xs text-muted-foreground">
              Across Kenya and East Africa
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.optimizationAccuracy}%</div>
            <p className="text-xs text-muted-foreground">
              Model accuracy rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Active Projects</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="models">Optimization Models</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {activeProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>
                        Model: {project.model} • Cost Savings: {project.costSavings}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(project.status)}
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Last Updated:</span> {project.lastUpdated}
                      </div>
                      <div>
                        <span className="font-medium">Completion:</span> {project.estimatedCompletion}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {project.status === "Running" && (
                        <Button size="sm" variant="outline">
                          Pause
                        </Button>
                      )}
                      {project.status === "Completed" && (
                        <Button size="sm">
                          Download Report
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Savings Trend</CardTitle>
                <CardDescription>Monthly cost savings percentage and project count</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="savings" stroke="#8884d8" name="Cost Savings %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Projects by Month</CardTitle>
                <CardDescription>Number of optimization projects completed</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="projects" fill="#82ca9d" name="Projects Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Model Usage Distribution</CardTitle>
                <CardDescription>Distribution of optimization models used in projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={modelUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {modelUsageData.map((entry, index) => (
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
        
        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Center of Gravity
                </CardTitle>
                <CardDescription>8+ mathematical formulas with ML integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy:</span>
                    <Badge variant="secondary">99.97%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Projects:</span>
                    <span>35 completed</span>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link to="/center-of-gravity">Open Model</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Network Optimization
                </CardTitle>
                <CardDescription>Advanced network flow optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy:</span>
                    <Badge variant="secondary">99.98%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Projects:</span>
                    <span>25 completed</span>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link to="/network-optimization">Open Model</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Route Optimization
                </CardTitle>
                <CardDescription>Vehicle routing with time windows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy:</span>
                    <Badge variant="secondary">99.94%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Projects:</span>
                    <span>20 completed</span>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link to="/route-optimization">Open Model</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Management
                </CardTitle>
                <CardDescription>EOQ, ABC analysis, safety stock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy:</span>
                    <Badge variant="secondary">99.92%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Projects:</span>
                    <span>12 completed</span>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link to="/inventory-management">Open Model</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hexagon className="h-5 w-5" />
                  Isohedron Analysis
                </CardTitle>
                <CardDescription>Territory division and service areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy:</span>
                    <Badge variant="secondary">99.91%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Projects:</span>
                    <span>8 completed</span>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link to="/isohedron">Open Model</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Heuristic Optimization
                </CardTitle>
                <CardDescription>Genetic algorithms & simulated annealing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy:</span>
                    <Badge variant="secondary">99.93%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Projects:</span>
                    <span>15 completed</span>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link to="/heuristic">Open Model</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Real-time system status monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      API Status
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      Operational ({systemMetrics.apiResponseTime}s avg)
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Database
                    </span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Optimization Engine
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      Running (99.4% accuracy)
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      System Uptime
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      {systemMetrics.systemUptime}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events and optimizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Kenya Tea Network optimization completed (85% cost reduction)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Route optimization started for Mombasa-Nairobi corridor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>New demand points added to coffee supply chain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>Inventory optimization queued for pharmaceutical network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>System backup completed successfully</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>New user onboarding: floriculture company</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Detailed system performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{systemMetrics.apiResponseTime}s</div>
                    <div className="text-sm text-muted-foreground">Avg API Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{systemMetrics.optimizationAccuracy}%</div>
                    <div className="text-sm text-muted-foreground">Model Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{systemMetrics.totalProjects}</div>
                    <div className="text-sm text-muted-foreground">Total Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{systemMetrics.systemUptime}%</div>
                    <div className="text-sm text-muted-foreground">System Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
