import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    TrendingUp, 
    AlertTriangle, 
    DollarSign, 
    Package,
    Activity,
    Box,
    Truck,
    CircleSlash,
    Archive,
    ShoppingCart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

const iconMap: { [key: string]: React.ComponentType<any> } = {
    TrendingUp,
    AlertTriangle,
    DollarSign,
    Package,
    Activity,
    Box,
    Truck,
    CircleSlash,
    Archive,
    ShoppingCart,
    default: Package,
};

type Metric = {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "stable";
  icon: string;
  color?: string;
};

interface InventoryMetricsGridProps {
  projectId: string;
}

export const InventoryMetricsGrid: React.FC<InventoryMetricsGridProps> = ({ projectId }) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user || !projectId) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("inventory_metrics")
          .select("title, value, change, trend, icon, color")
          .eq("project_id", projectId);

        if (error) throw error;
        setMetrics(data as Metric[]);
      } catch (error) {
        console.error("Error fetching inventory metrics:", error);
        // Optionally set some default or error state here
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [projectId, user]);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="p-6">
            <div className="h-8 bg-gray-200 rounded-md w-3/4 animate-pulse mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="text-center py-8 col-span-full">
        <p>No inventory metrics found for this project.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = iconMap[metric.icon] || iconMap.default;
        const trendColor = metric.trend === 'up' ? 'green' : metric.trend === 'down' ? 'red' : 'gray';
        
        return (
          <Card key={index}>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-${trendColor}-100 text-${trendColor}-600`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    {metric.change && (
                       <Badge 
                         className={`bg-${trendColor}-100 text-${trendColor}-800 hover:bg-${trendColor}-200`}
                       >
                         {metric.trend === 'up' ? '↑' : '↓'} {metric.change}
                       </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
