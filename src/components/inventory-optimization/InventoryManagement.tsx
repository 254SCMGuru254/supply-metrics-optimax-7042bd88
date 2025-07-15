
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Calculator, BarChart3, Activity } from 'lucide-react';
import { EOQCalculator } from './EOQCalculator';
import { SafetyStockCalculator } from './SafetyStockCalculator';
import { ABCAnalysis } from './ABCAnalysis';
import { InventoryTabsContent } from './InventoryTabsContent';

interface InventoryManagementProps {
  projectId: string;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ projectId }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Inventory Management & Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Comprehensive inventory optimization tools including EOQ calculations, 
            safety stock analysis, ABC classification, and multi-echelon optimization.
          </p>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="eoq">EOQ Calculator</TabsTrigger>
          <TabsTrigger value="safety-stock">Safety Stock</TabsTrigger>
          <TabsTrigger value="abc-analysis">ABC Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <InventoryTabsContent projectId={projectId} />
        </TabsContent>

        <TabsContent value="eoq">
          <EOQCalculator />
        </TabsContent>

        <TabsContent value="safety-stock">
          <SafetyStockCalculator />
        </TabsContent>

        <TabsContent value="abc-analysis">
          <ABCAnalysis projectId={projectId} />
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total SKUs</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold">KES 2.4M</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Turnover Rate</p>
                <p className="text-2xl font-bold">6.2x</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryManagement;
