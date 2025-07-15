import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Package, Truck } from 'lucide-react';

interface CostBreakdownItem {
  name: string;
  value: number;
  color: string;
}

const costBreakdown: CostBreakdownItem[] = [
  { name: 'Transportation', value: 35000, color: '#0088FE' },
  { name: 'Warehousing', value: 25000, color: '#00C49F' },
  { name: 'Inventory', value: 15000, color: '#FFBB28' },
  { name: 'Labor', value: 20000, color: '#FF8042' },
];

const performanceMetrics = [
  { name: 'Cost Reduction', value: 23, target: 25 },
  { name: 'Service Level', value: 97, target: 95 },
  { name: 'Processing Speed', value: 87, target: 90 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const ComprehensiveCostModeling = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Comprehensive Cost Modeling</h2>
        <p className="text-muted-foreground">Analyze and optimize your supply chain costs with detailed insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">$1.25M</div>
            <div className="text-sm text-muted-foreground">Total Annual Costs</div>
            <div className="flex items-center justify-center mt-2">
              <DollarSign className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+5.2% YOY</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">23%</div>
            <div className="text-sm text-muted-foreground">Cost Reduction</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-xs text-blue-500">Target: 25%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">97%</div>
            <div className="text-sm text-muted-foreground">Service Level</div>
            <div className="flex items-center justify-center mt-2">
              <Package className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">Exceeds Target</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Cost Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-foreground">{metric.name}</div>
                    <Badge variant="secondary">{metric.value}%</Badge>
                  </div>
                  <Progress value={metric.value} max={100} />
                  <div className="text-xs text-muted-foreground">Target: {metric.target}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
