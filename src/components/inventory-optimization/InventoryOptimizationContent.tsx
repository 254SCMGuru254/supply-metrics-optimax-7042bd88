
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { EOQCalculator } from "./EOQCalculator";
import { ABCAnalysis } from "./ABCAnalysis";
import { MultiEchelonVisualization } from "./MultiEchelonVisualization";
import { HorticulturalEOQCalculator } from "./HorticulturalEOQCalculator";
import { ColdChainOptimizer } from "./ColdChainOptimizer";
import { RetailSupplyChainOptimizer } from "./RetailSupplyChainOptimizer";
import { SupplyChainReportGenerator } from "@/components/ai-design-assistant/SupplyChainReportGenerator";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { Calculator, BarChart3, Network, TreePine, Thermometer, Store, FileText } from "lucide-react";

export const InventoryOptimizationContent = () => {
  const [activeTab, setActiveTab] = useState<string>("eoq");

  return (
    <div className="space-y-6" id="inventory-optimization-content">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory Optimization Tools</h2>
          <p className="text-gray-600 mt-1">Industry-standard mathematical models for optimal inventory management</p>
        </div>
        <ExportPdfButton 
          title="Inventory Optimization Report"
          exportId="inventory-optimization-content"
          fileName="inventory_optimization_report"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="bg-white rounded-lg shadow-sm p-1 mb-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-7 w-full h-auto p-1 bg-transparent gap-1">
            <TabsTrigger 
              value="eoq" 
              className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <Calculator className="h-4 w-4" />
              <span className="text-xs font-medium">EOQ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="abc" 
              className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-medium">ABC</span>
            </TabsTrigger>
            <TabsTrigger 
              value="multi-echelon" 
              className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <Network className="h-4 w-4" />
              <span className="text-xs font-medium">Multi-Echelon</span>
            </TabsTrigger>
            <TabsTrigger 
              value="horticultural" 
              className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <TreePine className="h-4 w-4" />
              <span className="text-xs font-medium">Horticultural</span>
            </TabsTrigger>
            <TabsTrigger 
              value="cold-chain" 
              className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <Thermometer className="h-4 w-4" />
              <span className="text-xs font-medium">Cold Chain</span>
            </TabsTrigger>
            <TabsTrigger 
              value="retail" 
              className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <Store className="h-4 w-4" />
              <span className="text-xs font-medium">Retail</span>
            </TabsTrigger>
            <TabsTrigger 
              value="report" 
              className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <FileText className="h-4 w-4" />
              <span className="text-xs font-medium">Reports</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="eoq" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-xl font-semibold">Economic Order Quantity (EOQ)</h3>
                <p className="text-gray-600">Wilson formula for optimal order quantities minimizing total costs</p>
              </div>
            </div>
            <EOQCalculator />
          </Card>
        </TabsContent>

        <TabsContent value="abc" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-xl font-semibold">ABC Analysis</h3>
                <p className="text-gray-600">Pareto-based inventory classification (80/20 rule)</p>
              </div>
            </div>
            <ABCAnalysis />
          </Card>
        </TabsContent>

        <TabsContent value="multi-echelon" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Network className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-xl font-semibold">Multi-Echelon Optimization</h3>
                <p className="text-gray-600">METRIC and Graves-Willems algorithms for network optimization</p>
              </div>
            </div>
            <MultiEchelonVisualization />
          </Card>
        </TabsContent>

        <TabsContent value="horticultural" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TreePine className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-xl font-semibold">Horticultural EOQ</h3>
                <p className="text-gray-600">Perishability-adjusted model for flowers and fresh produce</p>
              </div>
            </div>
            <HorticulturalEOQCalculator />
          </Card>
        </TabsContent>

        <TabsContent value="cold-chain" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Thermometer className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-xl font-semibold">Cold Chain Optimization</h3>
                <p className="text-gray-600">Temperature-controlled inventory model (TCIM)</p>
              </div>
            </div>
            <ColdChainOptimizer />
          </Card>
        </TabsContent>

        <TabsContent value="retail" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Store className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-xl font-semibold">Retail Supply Chain</h3>
                <p className="text-gray-600">Multi-Echelon Retail Optimization (MERO)</p>
              </div>
            </div>
            <RetailSupplyChainOptimizer />
          </Card>
        </TabsContent>

        <TabsContent value="report" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-xl font-semibold">Supply Chain Reports</h3>
                <p className="text-gray-600">Comprehensive analysis and optimization reports</p>
              </div>
            </div>
            <SupplyChainReportGenerator />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mathematical Models Summary */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Implemented Mathematical Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-blue-700 mb-2">Wilson EOQ Formula</h4>
            <p className="text-sm text-gray-600">√(2DS/H) where D=demand, S=setup cost, H=holding cost</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-green-700 mb-2">Safety Stock Model</h4>
            <p className="text-sm text-gray-600">Z × σ_LT where Z=service factor, σ=demand std dev</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-purple-700 mb-2">ABC Classification</h4>
            <p className="text-sm text-gray-600">Pareto principle: 80% value from 20% items</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
