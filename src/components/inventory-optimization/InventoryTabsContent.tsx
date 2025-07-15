
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { ABCAnalysis } from './ABCAnalysis';

interface InventoryTabsContentProps {
  projectId: string;
}

export const InventoryTabsContent: React.FC<InventoryTabsContentProps> = ({ projectId }) => {
  const inventoryMetrics = [
    {
      name: 'Fast Moving Items',
      count: 8,
      percentage: 33,
      status: 'good',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      name: 'Slow Moving Items',
      count: 12,
      percentage: 50,
      status: 'warning',
      icon: TrendingDown,
      color: 'text-yellow-600'
    },
    {
      name: 'Excess Stock',
      count: 3,
      percentage: 12.5,
      status: 'alert',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      name: 'Optimal Stock',
      count: 1,
      percentage: 4.2,
      status: 'good',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventoryMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                <Badge variant={
                  metric.status === 'good' ? 'default' : 
                  metric.status === 'warning' ? 'secondary' : 'destructive'
                }>
                  {metric.count}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{metric.name}</p>
                <Progress value={metric.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">{metric.percentage}% of total</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Inventory Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">SKU</th>
                  <th className="border border-border p-2 text-left">Product</th>
                  <th className="border border-border p-2 text-right">Current Stock</th>
                  <th className="border border-border p-2 text-right">Reorder Point</th>
                  <th className="border border-border p-2 text-right">EOQ</th>
                  <th className="border border-border p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-muted/50">
                  <td className="border border-border p-2 font-mono">SKU001</td>
                  <td className="border border-border p-2">Product A</td>
                  <td className="border border-border p-2 text-right">150</td>
                  <td className="border border-border p-2 text-right">75</td>
                  <td className="border border-border p-2 text-right">200</td>
                  <td className="border border-border p-2 text-center">
                    <Badge variant="default">Normal</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="border border-border p-2 font-mono">SKU002</td>
                  <td className="border border-border p-2">Product B</td>
                  <td className="border border-border p-2 text-right">45</td>
                  <td className="border border-border p-2 text-right">60</td>
                  <td className="border border-border p-2 text-right">150</td>
                  <td className="border border-border p-2 text-center">
                    <Badge variant="destructive">Low Stock</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="border border-border p-2 font-mono">SKU003</td>
                  <td className="border border-border p-2">Product C</td>
                  <td className="border border-border p-2 text-right">320</td>
                  <td className="border border-border p-2 text-right">90</td>
                  <td className="border border-border p-2 text-right">180</td>
                  <td className="border border-border p-2 text-center">
                    <Badge variant="secondary">Excess</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ABC Analysis Section */}
      <ABCAnalysis projectId={projectId} />
    </div>
  );
};
