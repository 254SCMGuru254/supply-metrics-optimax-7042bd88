import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Activity, MapPin, Package, TrendingUp, Calculator, Network } from "lucide-react";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    {
      title: "Analytics",
      href: "/analytics-dashboard",
      description: "Real-time supply chain analytics and insights",
      icon: <Activity className="h-4 w-4" />,
      badge: "Live"
    },
    {
      title: "Optimization Models",
      items: [
        { title: "Route Optimization", href: "/route-optimization", icon: <MapPin className="h-4 w-4" /> },
        { title: "Inventory Management", href: "/inventory-management", icon: <Package className="h-4 w-4" /> },
        { title: "Center of Gravity", href: "/center-of-gravity", icon: <TrendingUp className="h-4 w-4" /> },
        { title: "Network Optimization", href: "/network-optimization", icon: <Network className="h-4 w-4" /> },
        { title: "Network Flow", href: "/network-flow", icon: <Activity className="h-4 w-4" /> },
        { title: "Simulation", href: "/simulation", icon: <Calculator className="h-4 w-4" /> }
      ]
    },
    {
      title: "Kenya Focus",
      href: "/kenya-supply-chain",
      description: "Kenya-specific supply chain solutions",
      icon: <MapPin className="h-4 w-4" />,
      badge: "New"
    },
    {
      title: "Business Value",
      href: "/business-value", 
      description: "ROI calculator and value metrics",
      icon: <TrendingUp className="h-4 w-4" />
    }
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Supply Metrics Optimax
                </span>
                <div className="text-xs text-gray-500">Advanced Analytics Platform</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.items ? (
                      <>
                        <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 font-medium">
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid gap-3 p-4 w-80">
                            {item.items.map((subItem) => (
                              <NavigationMenuLink key={subItem.title} asChild>
                                <Link
                                  to={subItem.href}
                                  className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                                    isActive(subItem.href) ? 'bg-blue-50 text-blue-600' : ''
                                  }`}
                                >
                                  {subItem.icon}
                                  <span className="font-medium">{subItem.title}</span>
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.href!}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                            isActive(item.href!) 
                              ? 'bg-blue-600 text-white' 
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                          }`}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-3 ml-6">
              <Link to="/documentation">
                <Button variant="ghost" size="sm">
                  Documentation
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <div key={item.title}>
                {item.items ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm font-medium text-gray-900">{item.title}</div>
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        to={subItem.href}
                        className={`flex items-center space-x-2 px-6 py-2 text-sm rounded-md ${
                          isActive(subItem.href) 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.icon}
                        <span>{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to={item.href!}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md ${
                      isActive(item.href!) 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )}
              </div>
            ))}
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              <Link
                to="/documentation"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link
                to="/dashboard"
                className="block px-3 py-2 text-sm bg-blue-600 text-white rounded-md mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
