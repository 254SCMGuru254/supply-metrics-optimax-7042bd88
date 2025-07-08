
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EOQCalculator } from './EOQCalculator';
import { SafetyStockCalculator } from './SafetyStockCalculator';
import { ABCAnalysis } from './ABCAnalysis';
import { InventoryMetricsGrid } from './InventoryMetricsGrid';
import { Package, Target, AlertCircle, TrendingUp } from 'lucide-react';

interface InventoryManagementProps {
  projectId?: string;
}

export const InventoryManagement = ({ projectId = "default" }: InventoryManagementProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
        <p className="text-muted-foreground">
          Optimize inventory levels, reduce costs, and improve service levels
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="eoq">EOQ Calculator</TabsTrigger>
          <TabsTrigger value="safety">Safety Stock</TabsTrigger>
          <TabsTrigger value="abc">ABC Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">Active inventory items</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.4M</div>
                <p className="text-xs text-muted-foreground">Total inventory value</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Outs</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">Items below minimum</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.5x</div>
                <p className="text-xs text-muted-foreground">Annual turnover</p>
              </CardContent>
            </Card>
          </div>

          <InventoryMetricsGrid projectId={projectId} />
        </TabsContent>

        <TabsContent value="eoq" className="space-y-6">
          <EOQCalculator />
        </TabsContent>

        <TabsContent value="safety" className="space-y-6">
          <SafetyStockCalculator />
        </TabsContent>

        <TabsContent value="abc" className="space-y-6">
          <ABCAnalysis projectId={projectId || "default"} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;
