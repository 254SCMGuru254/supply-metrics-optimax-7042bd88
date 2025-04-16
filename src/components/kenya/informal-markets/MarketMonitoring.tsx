
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Clock,
  AlertCircle
} from "lucide-react";

interface MarketMetric {
  id: string;
  marketId: string;
  timestamp: string;
  tradersPresent: number;
  customerFootfall: number;
  capacityUtilization: number;
  salesVolume: number;
  trend: 'up' | 'down' | 'stable';
}

const mockRealTimeData: MarketMetric[] = [
  {
    id: "rt1",
    marketId: "gk1",
    timestamp: new Date().toISOString(),
    tradersPresent: 42000,
    customerFootfall: 28000,
    capacityUtilization: 85,
    salesVolume: 12500000,
    trend: 'up'
  },
  {
    id: "rt2",
    marketId: "wk1",
    timestamp: new Date().toISOString(),
    tradersPresent: 9800,
    customerFootfall: 15000,
    capacityUtilization: 92,
    salesVolume: 8200000,
    trend: 'stable'
  },
  {
    id: "rt3",
    marketId: "km1",
    timestamp: new Date().toISOString(),
    tradersPresent: 12500,
    customerFootfall: 18000,
    capacityUtilization: 78,
    salesVolume: 6800000,
    trend: 'down'
  }
];

export const MarketMonitoring = () => {
  const [metrics, setMetrics] = useState<MarketMetric[]>(mockRealTimeData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => ({
          ...metric,
          tradersPresent: metric.tradersPresent + Math.floor(Math.random() * 200 - 100),
          customerFootfall: metric.customerFootfall + Math.floor(Math.random() * 300 - 150),
          capacityUtilization: Math.min(100, Math.max(0, 
            metric.capacityUtilization + Math.floor(Math.random() * 4 - 2)
          )),
          salesVolume: metric.salesVolume + Math.floor(Math.random() * 500000 - 250000),
          trend: Math.random() > 0.7 ? 
            (['up', 'down', 'stable'] as const)[Math.floor(Math.random() * 3)] : 
            metric.trend
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: MarketMetric['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (utilization: number) => {
    if (utilization >= 90) return "bg-red-500";
    if (utilization >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Real-Time Market Monitoring</h3>
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {metric.marketId === "gk1" ? "Gikomba Market" :
                   metric.marketId === "wk1" ? "Wakulima Market" :
                   "Kongowea Market"}
                </CardTitle>
                {getTrendIcon(metric.trend)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Active Traders</span>
                    </div>
                    <p className="text-xl font-semibold">
                      {metric.tradersPresent.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Current Footfall</span>
                    </div>
                    <p className="text-xl font-semibold">
                      {metric.customerFootfall.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacity Utilization</span>
                    <span>{metric.capacityUtilization}%</span>
                  </div>
                  <Progress 
                    value={metric.capacityUtilization} 
                    className={`h-2 ${getStatusColor(metric.capacityUtilization)}`}
                  />
                </div>

                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-muted-foreground">Current Sales Volume</span>
                  <span className="font-medium">
                    KES {(metric.salesVolume / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
