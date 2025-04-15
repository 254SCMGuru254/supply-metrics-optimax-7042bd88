
import { Card } from "@/components/ui/card";
import { BarChart3, Network, Truck, LineChart, Target, Building2, Map, Warehouse, TrendingUp, Package, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const metrics = [
    { label: "Active Networks", value: "7", change: "+2", positive: true },
    { label: "Optimized Routes", value: "124", change: "+12", positive: true },
    { label: "Cost Savings", value: "32%", change: "+5%", positive: true },
    { label: "Logistics Score", value: "86", change: "+3", positive: true },
  ];

  const modules = [
    { 
      title: "Route Optimization", 
      icon: Truck, 
      description: "Optimize delivery routes for minimum time and cost", 
      path: "/route-optimization", 
      status: "Active" 
    },
    { 
      title: "Network Design", 
      icon: Network, 
      description: "Configure optimal facility locations and flows", 
      path: "/network-optimization", 
      status: "Active" 
    },
    { 
      title: "Center of Gravity", 
      icon: Target, 
      description: "Find optimal facility locations based on weighted demand", 
      path: "/center-of-gravity", 
      status: "Active" 
    },
    { 
      title: "Supply Chain Simulation", 
      icon: LineChart, 
      description: "Simulate different scenarios to test network resilience", 
      path: "/simulation", 
      status: "Active" 
    },
    { 
      title: "Inventory Management", 
      icon: Package, 
      description: "Optimize inventory levels and safety stock", 
      path: "/inventory-management", 
      status: "Active" 
    },
    { 
      title: "Fleet Management", 
      icon: Truck, 
      description: "Manage and optimize transportation fleet", 
      path: "/fleet-management", 
      status: "Active" 
    },
    { 
      title: "Demand Forecasting", 
      icon: TrendingUp, 
      description: "Predict future demand using time-series analysis", 
      path: "/demand-forecasting", 
      status: "Active" 
    },
    { 
      title: "Heuristic Analysis", 
      icon: BarChart3, 
      description: "Apply heuristic algorithms for complex problems", 
      path: "/heuristic", 
      status: "Active" 
    },
    { 
      title: "Warehouse Analysis", 
      icon: Warehouse, 
      description: "Analyze warehouse capacities and throughput", 
      path: "/warehouse", 
      status: "Active" 
    },
    { 
      title: "Cost Modeling", 
      icon: DollarSign, 
      description: "Model and analyze supply chain costs", 
      path: "/cost-modeling", 
      status: "Active" 
    },
    { 
      title: "Data Management", 
      icon: BarChart3, 
      description: "Import, manage and analyze supply chain data", 
      path: "/data-input", 
      status: "Active" 
    },
    { 
      title: "Kenya Supply Chain", 
      icon: Map, 
      description: "Explore Kenya's supply chain network and data", 
      path: "/kenya-supply-chain", 
      status: "Featured" 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Your supply chain optimization control center
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">{metric.label}</span>
              <span className="text-3xl font-bold">{metric.value}</span>
              <div className={`flex items-center ${metric.positive ? 'text-green-500' : 'text-red-500'}`}>
                <span>{metric.change}</span>
                <span className="text-xs ml-1">vs last month</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Optimization Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module, index) => (
            <Link key={index} to={module.path}>
              <Card className="p-6 h-full hover:border-primary transition-all">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <module.icon className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">{module.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        module.status === 'Featured' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {module.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm flex-grow">
                    {module.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Network className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Network optimized</p>
                <p className="text-sm text-muted-foreground">Kenya Distribution Network</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Truck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Routes optimized</p>
                <p className="text-sm text-muted-foreground">Nairobi Delivery Network</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Center of gravity calculated</p>
                <p className="text-sm text-muted-foreground">Central Distribution Hub</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Optimization Overview</h2>
          <div className="h-[200px] flex items-center justify-center">
            <BarChart3 className="h-24 w-24 text-muted-foreground/50" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
