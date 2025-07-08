
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  BarChart3,
  Target,
  Clock
} from "lucide-react";

interface InventoryMetricsGridProps {
  projectId?: string;
}

export const InventoryMetricsGrid: React.FC<InventoryMetricsGridProps> = ({ projectId }) => {
  // Mock data for now
  const metrics = [
    {
      title: "Inventory Turnover",
      value: "8.5x",
      change: "+12%",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Stockout Rate",
      value: "2.3%",
      change: "-0.8%",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Fill Rate",
      value: "97.2%",
      change: "+1.5%",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Carrying Cost",
      value: "$2.4M",
      change: "-8%",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    }
  ];

  const categoryMetrics = [
    { category: "A Items", percentage: 80, value: 20, color: "bg-red-500" },
    { category: "B Items", percentage: 15, value: 30, color: "bg-yellow-500" },
    { category: "C Items", percentage: 5, value: 50, color: "bg-green-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {metric.change}
                  </span>
                  {' '}from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ABC Analysis Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            ABC Analysis Overview
          </CardTitle>
          <CardDescription>
            Distribution of inventory value across ABC categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryMetrics.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="font-medium">{item.category}</span>
                  <Badge variant="outline">{item.value}% of items</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground w-16">
                    {item.percentage}% value
                  </span>
                  <Progress value={item.percentage} className="w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Service Level Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Target Service Level</span>
                <span className="font-semibold">95%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Current Achievement</span>
                <span className="font-semibold text-green-600">97.2%</span>
              </div>
              <Progress value={97.2} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Exceeding target by 2.2 percentage points
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Lead Time Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Average Lead Time</span>
                <span className="font-semibold">12.5 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Target Lead Time</span>
                <span className="font-semibold">14 days</span>
              </div>
              <Progress value={89} className="w-full" />
              <p className="text-sm text-muted-foreground">
                1.5 days better than target
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
