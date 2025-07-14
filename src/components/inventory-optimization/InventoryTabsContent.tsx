
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ABCAnalysis from "@/components/inventory-optimization/ABCAnalysis";
import InventoryManagement from "@/components/inventory-optimization/InventoryManagement";
import { Package, BarChart3, Target, Calculator, TrendingUp, Activity, Layers } from "lucide-react";

interface InventoryTabsContentProps {
  projectId: string;
}

export const InventoryTabsContent: React.FC<InventoryTabsContentProps> = ({ projectId }) => {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="abc-analysis">ABC Analysis</TabsTrigger>
        <TabsTrigger value="eoq">EOQ</TabsTrigger>
        <TabsTrigger value="safety-stock">Safety Stock</TabsTrigger>
        <TabsTrigger value="multi-echelon">Multi-Echelon</TabsTrigger>
        <TabsTrigger value="optimization">Optimization</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory Management Overview
            </CardTitle>
            <CardDescription>
              Comprehensive inventory optimization and management tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryManagement projectId={projectId} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="abc-analysis">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              ABC Analysis
            </CardTitle>
            <CardDescription>
              Classify inventory items by value and importance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ABCAnalysis projectId={projectId} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="eoq">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Economic Order Quantity (EOQ)
            </CardTitle>
            <CardDescription>
              Calculate optimal order quantities to minimize total costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">EOQ calculation tools coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="safety-stock">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Safety Stock Optimization
            </CardTitle>
            <CardDescription>
              Determine optimal safety stock levels for service requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Safety stock optimization tools coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="multi-echelon">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Multi-Echelon Inventory Optimization
            </CardTitle>
            <CardDescription>
              Optimize inventory across multiple supply chain tiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Layers className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Multi-echelon optimization tools coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="optimization">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Advanced Optimization
            </CardTitle>
            <CardDescription>
              Advanced inventory optimization models and algorithms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Advanced optimization tools coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Inventory Analytics
            </CardTitle>
            <CardDescription>
              Detailed analytics and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Advanced analytics coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
