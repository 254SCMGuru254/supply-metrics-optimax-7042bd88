import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Routes, Route, useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  ChevronRight, 
  Package, 
  Truck, 
  Network, 
  Target, 
  BarChart3, 
  LineChart, 
  TrendingUp 
} from "lucide-react";

// Components for each model introduction
const Introduction = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome to Chainalyze.io</h1>
      <p className="text-muted-foreground">
        Our platform provides a suite of supply chain optimization tools to help
        you make data-driven decisions for your logistics operations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Center of Gravity</h3>
            </div>
            <p className="text-sm text-muted-foreground flex-grow">Optimal warehouse location</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <Network className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Network Design</h3>
            </div>
            <p className="text-sm text-muted-foreground flex-grow">Optimize facility locations</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Route Optimization</h3>
            </div>
            <p className="text-sm text-muted-foreground flex-grow">Efficient delivery routes</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Demand Forecasting</h3>
            </div>
            <p className="text-sm text-muted-foreground flex-grow">Predict future demand</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Inventory Management</h3>
            </div>
            <p className="text-sm text-muted-foreground flex-grow">Optimize stock levels</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Fleet Management</h3>
            </div>
            <p className="text-sm text-muted-foreground flex-grow">Optimize vehicle operations</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <LineChart className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Simulation</h3>
            </div>
            <p className="text-sm text-muted-foreground flex-grow">Test network scenarios</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Analytics</h3>
            </div>
            <p className="text-sm text-muted-foreground flex-grow">Performance insights</p>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button onClick={() => navigate("/onboarding/select-model")}>
          Get Started
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const SelectModel = () => {
  const navigate = useNavigate();
  
  const models = [
    { name: "Center of Gravity", icon: Target, path: "center-of-gravity" },
    { name: "Network Optimization", icon: Network, path: "network-optimization" },
    { name: "Route Optimization", icon: Truck, path: "route-optimization" },
    { name: "Demand Forecasting", icon: TrendingUp, path: "demand-forecasting" },
    { name: "Inventory Management", icon: Package, path: "inventory-management" },
    { name: "Fleet Management", icon: Truck, path: "fleet-management" },
    { name: "Simulation", icon: LineChart, path: "simulation" },
    { name: "Analytics", icon: BarChart3, path: "analytics" },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Select a model to explore</h2>
      <p className="text-muted-foreground">
        Choose one of our optimization models to learn more about its capabilities
        and how it can help your supply chain operations.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <Button
            key={model.path}
            variant="outline"
            className="h-auto p-4 justify-start"
            onClick={() => navigate(`/onboarding/${model.path}`)}
          >
            <model.icon className="h-5 w-5 mr-2" />
            {model.name}
          </Button>
        ))}
        
        <Button
          variant="default"
          className="h-auto p-4 justify-start"
          onClick={() => navigate("/onboarding/complete")}
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Complete Onboarding
        </Button>
      </div>
    </div>
  );
};

const CenterOfGravityIntro = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Center of Gravity</h2>
      <p>Determine the optimal location for a new warehouse or distribution center based on demand and supply points.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Weighted Analysis</p>
              <p className="text-sm text-muted-foreground">Calculates the best location based on weighted demand</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Cost Optimization</p>
              <p className="text-sm text-muted-foreground">Minimizes transportation costs</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Interactive Map</p>
              <p className="text-sm text-muted-foreground">Visualizes demand points and optimal location</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Scenario Analysis</p>
              <p className="text-sm text-muted-foreground">Evaluate different scenarios</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => navigate("/onboarding/select-model")}>
          Back
        </Button>
        <Button onClick={() => navigate("/onboarding/network-optimization")}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const NetworkOptimizationIntro = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Network Optimization</h2>
      <p>Design an optimal supply chain network by determining the best locations for facilities and the flows between them.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Facility Placement</p>
              <p className="text-sm text-muted-foreground">Optimal location of factories, warehouses, and distribution centers</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Flow Optimization</p>
              <p className="text-sm text-muted-foreground">Optimal flow of goods between facilities</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Capacity Planning</p>
              <p className="text-sm text-muted-foreground">Determine the right capacity for each facility</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Cost Minimization</p>
              <p className="text-sm text-muted-foreground">Minimize total supply chain costs</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => navigate("/onboarding/center-of-gravity")}>
          Back
        </Button>
        <Button onClick={() => navigate("/onboarding/route-optimization")}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const RouteOptimizationIntro = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Route Optimization</h2>
      <p>Optimize delivery routes for minimum time and cost, taking into account vehicle capacity, time windows, and other constraints.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Multi-Vehicle Routing</p>
              <p className="text-sm text-muted-foreground">Optimize routes for multiple vehicles</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Time Window Constraints</p>
              <p className="text-sm text-muted-foreground">Respect customer time windows</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Capacity Constraints</p>
              <p className="text-sm text-muted-foreground">Respect vehicle capacity</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Real-Time Tracking</p>
              <p className="text-sm text-muted-foreground">Track vehicles in real-time</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => navigate("/onboarding/network-optimization")}>
          Back
        </Button>
        <Button onClick={() => navigate("/onboarding/demand-forecasting")}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const DemandForecastingIntro = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Demand Forecasting</h2>
      <p>Use advanced time-series analysis to predict future demand across your supply chain.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Multiple forecasting models</p>
              <p className="text-sm text-muted-foreground">ARIMA, Prophet, and machine learning algorithms</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Seasonal patterns</p>
              <p className="text-sm text-muted-foreground">Identify weekly, monthly, and annual patterns</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Accuracy metrics</p>
              <p className="text-sm text-muted-foreground">MAPE, RMSE, and MAE to validate models</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">External factors</p>
              <p className="text-sm text-muted-foreground">Include holidays, weather, and events</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => navigate("/onboarding/select-model")}>
          Back
        </Button>
        <Button onClick={() => navigate("/onboarding/inventory-management")}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const InventoryManagementIntro = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inventory Management</h2>
      <p>Optimize inventory levels and stock policies to reduce costs while meeting service levels.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Economic Order Quantity</p>
              <p className="text-sm text-muted-foreground">Determine optimal order quantities</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">ABC Analysis</p>
              <p className="text-sm text-muted-foreground">Classify inventory by importance</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Safety Stock Calculation</p>
              <p className="text-sm text-muted-foreground">Buffer against demand variability</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Multi-Echelon Optimization</p>
              <p className="text-sm text-muted-foreground">Optimize across multiple tiers</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => navigate("/onboarding/demand-forecasting")}>
          Back
        </Button>
        <Button onClick={() => navigate("/onboarding/fleet-management")}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const FleetManagementIntro = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Fleet Management</h2>
      <p>Optimize your vehicle fleet for maximum efficiency and lower costs.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Ownership Models</p>
              <p className="text-sm text-muted-foreground">Compare owned vs. outsourced vehicles</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Cost Calculator</p>
              <p className="text-sm text-muted-foreground">Fuel, maintenance, driver wages, depreciation</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Capacity Management</p>
              <p className="text-sm text-muted-foreground">Tonnage, dimensions, speed limits</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Compliance Alerts</p>
              <p className="text-sm text-muted-foreground">Tonnage restrictions, emissions standards</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => navigate("/onboarding/inventory-management")}>
          Back
        </Button>
        <Button onClick={() => navigate("/onboarding/simulation")}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const SimulationIntro = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Simulation</h2>
      <p>Simulate different scenarios to test network resilience and identify potential bottlenecks.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Scenario Planning</p>
              <p className="text-sm text-muted-foreground">Evaluate different scenarios</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Bottleneck Analysis</p>
              <p className="text-sm text-muted-foreground">Identify potential bottlenecks</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Risk Assessment</p>
              <p className="text-sm text-muted-foreground">Assess risks</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">What-If Analysis</p>
              <p className="text-sm text-muted-foreground">Analyze different scenarios</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => navigate("/onboarding/fleet-management")}>
          Back
        </Button>
        <Button onClick={() => navigate("/onboarding/analytics")}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const AnalyticsIntro = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics</h2>
      <p>Gain insights into your supply chain performance with our analytics dashboard.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Performance Metrics</p>
              <p className="text-sm text-muted-foreground">Track key performance indicators</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Interactive Dashboards</p>
              <p className="text-sm text-muted-foreground">Explore data</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Custom Reports</p>
              <p className="text-sm text-muted-foreground">Generate custom reports</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Data Visualization</p>
              <p className="text-sm text-muted-foreground">Visualize data</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => navigate("/onboarding/simulation")}>
          Back
        </Button>
        <Button onClick={() => navigate("/onboarding/complete")}>
          Complete Onboarding
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const OnboardingComplete = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="text-center space-y-4">
      <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
      <h2 className="text-3xl font-bold">Onboarding Complete!</h2>
      <p className="text-muted-foreground">
        You have successfully completed the onboarding process.
      </p>
      <p className="text-muted-foreground">
        Redirecting to dashboard in 3 seconds...
      </p>
    </div>
  );
};

const Onboarding = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("center-of-gravity")) setProgress(12.5);
    else if (path.includes("network-optimization")) setProgress(25);
    else if (path.includes("route-optimization")) setProgress(37.5);
    else if (path.includes("demand-forecasting")) setProgress(50);
    else if (path.includes("inventory-management")) setProgress(62.5);
    else if (path.includes("fleet-management")) setProgress(75);
    else if (path.includes("simulation")) setProgress(87.5);
    else if (path.includes("analytics")) setProgress(100);
    else setProgress(0);
  }, [navigate]);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <Routes>
            <Route index element={<Introduction />} />
            <Route path="select-model" element={<SelectModel />} />
            <Route path="center-of-gravity" element={<CenterOfGravityIntro />} />
            <Route path="network-optimization" element={<NetworkOptimizationIntro />} />
            <Route path="route-optimization" element={<RouteOptimizationIntro />} />
            <Route path="demand-forecasting" element={<DemandForecastingIntro />} />
            <Route path="inventory-management" element={<InventoryManagementIntro />} />
            <Route path="fleet-management" element={<FleetManagementIntro />} />
            <Route path="simulation" element={<SimulationIntro />} />
            <Route path="analytics" element={<AnalyticsIntro />} />
            <Route path="complete" element={<OnboardingComplete />} />
          </Routes>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
