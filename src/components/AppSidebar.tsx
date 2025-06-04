
import { Link } from "react-router-dom";
import { Home, LayoutDashboard, Settings, Package, Truck, LineChart, BarChart3, FileText, HelpCircle, CircleDollarSign, TrendingUp, Activity, Hexagon } from "lucide-react";

const AppSidebar = () => {
  return (
    <div className="h-screen flex flex-col border-r">
      <div className="px-6 py-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="text-lg font-bold">Supply Chain OS</span>
        </Link>
      </div>

      <nav className="space-y-1 px-2 py-5 flex-grow overflow-y-auto">
        <Link
          to="/"
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted group"
        >
          <Home className="mr-3 h-5 w-5 text-muted-foreground" />
          Home
        </Link>

        <Link
          to="/dashboard"
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted group"
        >
          <LayoutDashboard className="mr-3 h-5 w-5 text-muted-foreground" />
          Dashboard
        </Link>

        <Link
          to="/analytics"
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted group"
        >
          <LineChart className="mr-3 h-5 w-5 text-muted-foreground" />
          Analytics
        </Link>

        <Link
          to="/data-input"
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted group"
        >
          <FileText className="mr-3 h-5 w-5 text-muted-foreground" />
          Data Input
        </Link>

        <div className="px-2 py-2 text-xs font-bold text-muted-foreground uppercase">
          Optimization Models
        </div>

        <Link
          to="/center-of-gravity"
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted group"
        >
          <Settings className="mr-3 h-5 w-5 text-muted-foreground" />
          Center of Gravity
        </Link>

        <Link
          to="/network-optimization"
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted group"
        >
          <BarChart3 className="mr-3 h-5 w-5 text-muted-foreground" />
          Network Optimization
        </Link>

        <Link
          to="/route-optimization"
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted group"
        >
          <Truck className="mr-3 h-5 w-5 text-muted-foreground" />
          Route Optimization
        </Link>

        <Link
          to="/simulation"
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted group"
        >
          <Activity className="mr-3 h-5 w-5 text-muted-foreground" />
          Simulation
        </Link>

        <Link
          to="/isohedron"
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted group"
        >
          <Hexagon className="mr-3 h-5 w-5 text-muted-foreground" />
          Isohedron
        </Link>

        <Link
          to="/heuristic"
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted group"
        >
          <HelpCircle className="mr-3 h-5 w-5 text-muted-foreground" />
          Heuristic
        </Link>

        <div className="px-2 py-2 text-xs font-bold text-muted-foreground uppercase">
          Management
        </div>

        <Link
          to="/inventory-management"
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted group"
        >
          <Package className="mr-3 h-5 w-5 text-muted-foreground" />
          Inventory Management
        </Link>
        
        <Link 
          to="/business-value" 
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted group"
        >
          <TrendingUp className="mr-3 h-5 w-5 text-muted-foreground" />
          Business Value & ROI
        </Link>

        <Link
          to="/pricing"
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted group"
        >
          <CircleDollarSign className="mr-3 h-5 w-5 text-muted-foreground" />
          Pricing
        </Link>
      </nav>

      <div className="p-4">
        <p className="text-xs text-muted-foreground">
          Copyright © {new Date().getFullYear()} Supply Chain OS
        </p>
      </div>
    </div>
  );
};

export default AppSidebar;
