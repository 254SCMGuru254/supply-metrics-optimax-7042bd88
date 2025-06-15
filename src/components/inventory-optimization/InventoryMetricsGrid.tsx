
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";

interface Metric {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: "up" | "down";
}

// The metrics grid, use only icons that exist in lucide-react.
const metrics: Metric[] = [
  {
    title: "Total Inventory Value",
    value: "$2.4M",
    change: "+12%",
    icon: Package,
    trend: "up"
  },
  {
    title: "Turnover Rate",
    value: "8.2x",
    change: "+15%",
    icon: TrendingUp,
    trend: "up"
  },
  {
    title: "Stockout Risk",
    value: "3.2%",
    change: "-8%",
    icon: AlertTriangle,
    trend: "down"
  },
  {
    title: "Carrying Cost",
    value: "$180K",
    change: "-22%",
    icon: DollarSign,
    trend: "down"
  }
];

export const InventoryMetricsGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {metrics.map((metric, index) => {
      const Icon = metric.icon;
      return (
        <Card key={index}>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                  metric.trend === 'up'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'}>
                    {metric.change}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
);
