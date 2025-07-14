
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import ABCAnalysis from "./ABCAnalysis";
import { Package, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface InventoryManagementProps {
  projectId?: string;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ projectId }) => {
  // Mock data for demonstration
  const inventoryMetrics = [
    { name: "Total Items", value: 1250, change: "+5.2%", status: "positive" },
    { name: "Stock Value", value: "$2.4M", change: "+12.8%", status: "positive" },
    { name: "Turnover Rate", value: "6.2x", change: "+0.8x", status: "positive" },
    { name: "Stockouts", value: 3, change: "-2", status: "positive" }
  ];

  const inventoryTrends = [
    { month: "Jan", stock: 850000, orders: 45, turnover: 5.2 },
    { month: "Feb", stock: 920000, orders: 52, turnover: 5.8 },
    { month: "Mar", stock: 780000, orders: 48, turnover: 6.1 },
    { month: "Apr", stock: 840000, orders: 51, turnover: 5.9 },
    { month: "May", stock: 720000, orders: 47, turnover: 6.4 },
    { month: "Jun", stock: 680000, orders: 44, turnover: 6.2 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "positive": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "negative": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "neutral": return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventoryMetrics.map((metric, index) => (
          <Card key={index} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(metric.status)}
                  <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                </div>
                <Badge variant={metric.status === "positive" ? "default" : metric.status === "negative" ? "destructive" : "secondary"}>
                  {metric.change}
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Stock Value Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={inventoryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Stock Value"]} />
                <Line type="monotone" dataKey="stock" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Inventory Turnover</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="turnover" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ABC Analysis */}
      <Tabs defaultValue="abc-analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="abc-analysis">ABC Analysis</TabsTrigger>
          <TabsTrigger value="eoq-optimization">EOQ Optimization</TabsTrigger>
          <TabsTrigger value="safety-stock">Safety Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="abc-analysis">
          <ABCAnalysis projectId={projectId} />
        </TabsContent>

        <TabsContent value="eoq-optimization">
          <Card>
            <CardHeader>
              <CardTitle>Economic Order Quantity (EOQ) Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Optimize order quantities to minimize total inventory costs including ordering and holding costs.
              </p>
              <div className="text-center py-8">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">EOQ optimization tools coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety-stock">
          <Card>
            <CardHeader>
              <CardTitle>Safety Stock Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Calculate optimal safety stock levels to balance service levels with inventory costs.
              </p>
              <div className="text-center py-8">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Safety stock optimization tools coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;
