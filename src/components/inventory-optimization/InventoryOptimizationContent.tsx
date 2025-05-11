
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EOQCalculator } from "./EOQCalculator";
import { ABCAnalysis } from "./ABCAnalysis";
import { MultiEchelonVisualization } from "./MultiEchelonVisualization";
import { SupplyChainReportGenerator } from "@/components/ai-design-assistant/SupplyChainReportGenerator";

export const InventoryOptimizationContent = () => {
  const [activeTab, setActiveTab] = useState<string>("eoq");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="eoq">EOQ Calculator</TabsTrigger>
          <TabsTrigger value="abc">ABC Analysis</TabsTrigger>
          <TabsTrigger value="multi-echelon">Multi-Echelon</TabsTrigger>
          <TabsTrigger value="report">Generate Report</TabsTrigger>
        </TabsList>

        <TabsContent value="eoq">
          <EOQCalculator />
        </TabsContent>

        <TabsContent value="abc">
          <ABCAnalysis />
        </TabsContent>

        <TabsContent value="multi-echelon">
          <MultiEchelonVisualization />
        </TabsContent>

        <TabsContent value="report">
          <SupplyChainReportGenerator />
        </TabsContent>
      </Tabs>

      <div className="p-4 bg-muted rounded-md">
        <h3 className="text-lg font-bold mb-2">Industry-Standard Models</h3>
        <p className="text-sm text-muted-foreground">
          This inventory optimization module implements established mathematical models used by leading supply chain management systems:
        </p>
        <ul className="list-disc ml-5 mt-2 text-sm text-muted-foreground space-y-1">
          <li>Economic Order Quantity (EOQ) - Harris-Wilson formula for optimal order quantities</li>
          <li>ABC Analysis - Pareto-based inventory classification model (80/20 rule)</li>
          <li>Safety Stock - Statistical calculation based on service level requirements</li>
          <li>Multi-Echelon Optimization - Clark-Scarf model for complex supply networks</li>
          <li>Inventory Policy Selection - Base stock, Min-Max (s,S), and Reorder Point (Q,r) models</li>
        </ul>
      </div>
    </div>
  );
};
