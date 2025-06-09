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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

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

  const performanceData = [
    { month: 'Jan', savings: 15.2, projects: 5 },
    { month: 'Feb', savings: 18.7, projects: 7 },
    { month: 'Mar', savings: 22.1, projects: 9 },
    { month: 'Apr', savings: 19.8, projects: 12 },
    { month: 'May', savings: 21.5, projects: 15 },
    { month: 'Jun', savings: 19.7, projects: 12 }
  ];

  const modelUsageData = [
    { name: 'Center of Gravity', value: 35, projects: 12 },
    { name: 'Network Optimization', value: 25, projects: 8 },
    { name: 'Route Optimization', value: 20, projects: 6 },
    { name: 'Inventory Management', value: 12, projects: 4 },
    { name: 'Other Models', value: 8, projects: 2 }
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
                  <BarChart data={modelUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="projects" fill="#8884d8" name="Projects" />
                  </BarChart>
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
                <CardDescription>Vehicle routing and logistics optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy:</span>
                    <Badge variant="secondary">99.95%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Projects:</span>
                    <span>18 completed</span>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link to="/route-optimization">Open Model</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime:</span>
                    <Badge variant="secondary">{systemMetrics.systemUptime}%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Response Time:</span>
                    <span>{systemMetrics.apiResponseTime}s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active Models:</span>
                    <span>12</span>
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
