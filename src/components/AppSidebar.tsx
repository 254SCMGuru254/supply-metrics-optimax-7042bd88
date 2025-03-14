
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
  { title: "Dashboard", icon: Home, path: "/dashboard" },
  { title: "Analytics Dashboard", icon: BarChart3, path: "/analytics" },
  { title: "Center of Gravity", icon: Target, path: "/center-of-gravity" },
  { title: "Network Optimization", icon: Network, path: "/network-optimization" },
  { title: "Route Optimization", icon: Truck, path: "/route-optimization" },
  { title: "Simulation", icon: LineChart, path: "/simulation" },
  { title: "Heuristic Analysis", icon: BarChart3, path: "/heuristic" },
  { title: "Data Management", icon: Database, path: "/data-input" },
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
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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
