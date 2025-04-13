
import {
  BarChart3,
  Home,
  Network,
  Settings,
  Truck,
  Database,
  Warehouse,
  Target,
  LineChart,
  Info,
  HelpCircle,
  BookOpen,
  TrendingUp,
  Package,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { title: "Introduction", icon: Info, path: "/introduction" },
  { title: "Onboarding", icon: BookOpen, path: "/onboarding" },
  { title: "Dashboard", icon: Home, path: "/dashboard" },
  
  // Analysis Tools
  { title: "Data Management", icon: Database, path: "/data-input" },
  { title: "Analytics Dashboard", icon: BarChart3, path: "/analytics" },
  
  // Optimization Tools
  { title: "Center of Gravity", icon: Target, path: "/center-of-gravity" },
  { title: "Network Optimization", icon: Network, path: "/network-optimization" },
  { title: "Route Optimization", icon: Truck, path: "/route-optimization" },
  { title: "Demand Forecasting", icon: TrendingUp, path: "/demand-forecasting" },
  { title: "Inventory Management", icon: Package, path: "/inventory-management" },
  { title: "Fleet Management", icon: Truck, path: "/fleet-management" },
  { title: "Simulation", icon: LineChart, path: "/simulation" },
  { title: "Heuristic Analysis", icon: BarChart3, path: "/heuristic" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary">Chainalyze.io</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Getting Started</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(0, 3).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className={`flex items-center gap-3 ${
                        location.pathname === item.path ? "bg-accent text-accent-foreground" : ""
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Analysis Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(3, 5).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className={`flex items-center gap-3 ${
                        location.pathname === item.path ? "bg-accent text-accent-foreground" : ""
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Optimization Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(5).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className={`flex items-center gap-3 ${
                        location.pathname === item.path ? "bg-accent text-accent-foreground" : ""
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
