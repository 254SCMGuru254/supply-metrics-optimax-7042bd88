
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  AlertCircle, // Replace CircleSlash
  FileArchive, // Replace Archive
  Truck,
  ShoppingCart,
  Clock,
  BarChart3
} from "lucide-react";

interface InventoryMetric {
  name: string;
  value: number;
  change: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  target?: number;
}

interface InventoryMetricsGridProps {
  metrics?: InventoryMetric[];
}

export const InventoryMetricsGrid = ({ metrics = [] }: InventoryMetricsGridProps) => {
  const defaultMetrics: InventoryMetric[] = [
    {
      name: "Inventory Turnover",
      value: 8.5,
      change: 12.5,
      unit: "times/year",
      status: 'good',
      target: 8.0
    },
    {
      name: "Stock-out Rate",
      value: 2.3,
      change: -5.2,
      unit: "%",
      status: 'good',
      target: 3.0
    },
    {
      name: "Carrying Cost",
      value: 18.5,
      change: -8.1,
      unit: "%",
      status: 'warning',
      target: 15.0
    },
    {
      name: "Order Frequency",
      value: 24,
      change: 3.7,
      unit: "orders/month",
      status: 'good',
      target: 20
    },
    {
      name: "Lead Time",
      value: 7.2,
      change: -12.8,
      unit: "days",
      status: 'good',
      target: 8.0
    },
    {
      name: "Safety Stock Level",
      value: 85,
      change: -2.1,
      unit: "%",
      status: 'warning',
      target: 90
    }
  ];

  const displayMetrics = metrics.length > 0 ? metrics : defaultMetrics;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'inventory turnover': return <BarChart3 className="h-5 w-5" />;
      case 'stock-out rate': return <AlertCircle className="h-5 w-5" />;
      case 'carrying cost': return <DollarSign className="h-5 w-5" />;
      case 'order frequency': return <ShoppingCart className="h-5 w-5" />;
      case 'lead time': return <Clock className="h-5 w-5" />;
      case 'safety stock level': return <FileArchive className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayMetrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
            <div className={getStatusColor(metric.status)}>
              {getStatusIcon(metric.name)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">
                {metric.value} {metric.unit}
              </div>
              <div className="flex items-center space-x-1">
                {metric.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(metric.change)}%
                </span>
              </div>
            </div>
            
            {metric.target && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Target: {metric.target} {metric.unit}</span>
                  <Badge variant={metric.status === 'good' ? 'default' : metric.status === 'warning' ? 'secondary' : 'destructive'}>
                    {metric.status}
                  </Badge>
                </div>
                <Progress 
                  value={Math.min((metric.value / metric.target) * 100, 100)} 
                  className="h-2"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
