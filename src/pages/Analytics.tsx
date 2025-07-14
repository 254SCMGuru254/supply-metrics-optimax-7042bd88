
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Warehouse, Network, Truck, BarChart3, Package, Activity } from "lucide-react";
import { AdvancedAnalyticsDashboard } from "@/components/analytics/AdvancedAnalyticsDashboard";

const analyticsModels = [
  {
    title: "Center of Gravity",
    description: "Optimize facility locations based on weighted distances",
    icon: Warehouse,
    path: "/center-of-gravity/new",
  },
  {
    title: "Network Optimization", 
    description: "Minimize costs across your supply chain network",
    icon: Network,
    path: "/network-optimization/new",
  },
  {
    title: "Simulation",
    description: "Model and analyze supply chain scenarios",
    icon: Truck,
    path: "/simulation/new",
  },
  {
    title: "Advanced Analytics",
    description: "Real-time insights and performance metrics",
    icon: BarChart3,
    path: "/analytics-dashboard/new",
  },
  {
    title: "Inventory Management",
    description: "Optimize inventory levels and reduce carrying costs",
    icon: Package,
    path: "/inventory-management/new",
  },
];

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto py-8 px-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Supply Chain Analytics Hub
          </h1>
          <p className="text-xl text-gray-600">
            Advanced optimization models and real-time analytics for enterprise supply chains
          </p>
        </div>

        {/* Real-time Dashboard */}
        <div className="mb-12">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-blue-600" />
                Live Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdvancedAnalyticsDashboard />
            </CardContent>
          </Card>
        </div>
        
        {/* Analytics Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsModels.map((model) => (
            <Card key={model.title} className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm group">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <model.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{model.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">{model.description}</p>
                <Link to={model.path}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Launch Model
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
