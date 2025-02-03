import {
  BarChart3,
  Home,
  Network,
  Settings,
  Truck,
  Database,
  Warehouse,
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
import { Link } from "react-router-dom";

const menuItems = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Analytics Dashboard", icon: BarChart3, path: "/analytics" },
  { title: "Center of Gravity", icon: Warehouse, path: "/center-of-gravity" },
  { title: "Network Optimization", icon: Network, path: "/network-optimization" },
  { title: "Simulation", icon: Truck, path: "/simulation" },
  { title: "Heuristic Analysis", icon: BarChart3, path: "/heuristic" },
  { title: "Data Management", icon: Database, path: "/data-input" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export function AppSidebar() {
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
                    <Link to={item.path} className="flex items-center gap-3">
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