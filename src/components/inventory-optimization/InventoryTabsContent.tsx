import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { BarChart3 } from "lucide-react";

import { InventoryOptimizationContent } from "@/components/inventory-optimization/InventoryOptimizationContent";
import { EOQCalculator } from "@/components/inventory-optimization/EOQCalculator";
import { SafetyStockCalculator } from "@/components/inventory-optimization/SafetyStockCalculator";
import { ABCAnalysis } from "@/components/inventory-optimization/ABCAnalysis";
import { MultiEchelonVisualization } from "@/components/inventory-optimization/MultiEchelonVisualization";
import { ColdChainOptimizer } from "@/components/inventory-optimization/ColdChainOptimizer";
import { RetailSupplyChainOptimizer } from "@/components/inventory-optimization/RetailSupplyChainOptimizer";
import { HorticulturalEOQCalculator } from "@/components/inventory-optimization/HorticulturalEOQCalculator";

interface InventoryTabsContentProps {
  projectId: string;
}

export const InventoryTabsContent: React.FC<InventoryTabsContentProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div id="inventory-optimization-content">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="eoq">EOQ</TabsTrigger>
          <TabsTrigger value="safety-stock">Safety Stock</TabsTrigger>
          <TabsTrigger value="abc-analysis">ABC Analysis</TabsTrigger>
          <TabsTrigger value="multi-echelon">Multi-Echelon</TabsTrigger>
          <TabsTrigger value="cold-chain">Cold Chain</TabsTrigger>
          <TabsTrigger value="retail">Retail Chain</TabsTrigger>
          <TabsTrigger value="horticultural">Horticultural</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Inventory Optimization Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryOptimizationContent projectId={projectId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eoq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Economic Order Quantity (EOQ) Calculator</CardTitle>
              <div className="flex justify-end">
                <ExportPdfButton
                  exportId="eoq-calculator"
                  fileName="eoq-analysis"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div id="eoq-calculator">
                <EOQCalculator projectId={projectId} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety-stock" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Safety Stock Calculator</CardTitle>
              <div className="flex justify-end">
                <ExportPdfButton
                  exportId="safety-stock-calculator"
                  fileName="safety-stock-analysis"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div id="safety-stock-calculator">
                <SafetyStockCalculator projectId={projectId} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abc-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ABC Analysis</CardTitle>
              <div className="flex justify-end">
                <ExportPdfButton
                  exportId="abc-analysis"
                  fileName="abc-analysis-report"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div id="abc-analysis">
                <ABCAnalysis projectId={projectId} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multi-echelon" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Echelon Inventory Optimization</CardTitle>
              <div className="flex justify-end">
                <ExportPdfButton
                  exportId="multi-echelon-optimization"
                  fileName="multi-echelon-analysis"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div id="multi-echelon-optimization">
                <MultiEchelonVisualization projectId={projectId} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cold-chain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cold Chain Optimization</CardTitle>
              <div className="flex justify-end">
                <ExportPdfButton
                  exportId="cold-chain-optimization"
                  fileName="cold-chain-analysis"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div id="cold-chain-optimization">
                <ColdChainOptimizer projectId={projectId} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retail" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Retail Supply Chain Optimization</CardTitle>
              <div className="flex justify-end">
                <ExportPdfButton
                  exportId="retail-optimization"
                  fileName="retail-supply-chain-analysis"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div id="retail-optimization">
                <RetailSupplyChainOptimizer projectId={projectId} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="horticultural" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Horticultural EOQ Calculator</CardTitle>
              <div className="flex justify-end">
                <ExportPdfButton
                  exportId="horticultural-eoq"
                  fileName="horticultural-eoq-analysis"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div id="horticultural-eoq">
                <HorticulturalEOQCalculator projectId={projectId} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
