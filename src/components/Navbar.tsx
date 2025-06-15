
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  BarChart3, 
  Route, 
  Package, 
  MapPin, 
  Settings,
  Play,
  Database,
  BookOpen,
  LayoutDashboard,
  TrendingUp,
  Activity
} from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: TrendingUp, badge: "Pro" },
    { name: "Route Optimization", href: "/route-optimization", icon: Route },
    { name: "Inventory Management", href: "/inventory-optimization", icon: Package },
    { name: "Center of Gravity", href: "/center-of-gravity", icon: MapPin },
    { name: "Network Optimization", href: "/network-optimization", icon: BarChart3 },
    { name: "Heuristic Algorithms", href: "/heuristic", icon: Settings },
    { name: "Simulation", href: "/simulation", icon: Play },
    { name: "Data Management", href: "/data-management", icon: Database },
    { name: "Documentation", href: "/documentation", icon: BookOpen }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Supply Metrics Optimax
                </h1>
                <p className="text-xs text-gray-500">Advanced Supply Chain Analytics</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.slice(0, 6).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="hidden lg:block">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="mt-8 space-y-2">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Supply Metrics Optimax</h2>
                    <p className="text-sm text-gray-500">Supply Chain Optimization Platform</p>
                  </div>
                  
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive(item.href)
                            ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm"
                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.name}
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
