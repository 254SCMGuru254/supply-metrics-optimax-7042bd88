import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { EOQCalculator } from "./EOQCalculator";
import { ABCAnalysis } from "./ABCAnalysis";
import { MultiEchelonVisualization } from "./MultiEchelonVisualization";
import { HorticulturalEOQCalculator } from "./HorticulturalEOQCalculator";
import { ColdChainOptimizer } from "./ColdChainOptimizer";
import { RetailSupplyChainOptimizer } from "./RetailSupplyChainOptimizer";
import { EnterpriseEOQCalculators } from "./EnterpriseEOQCalculators";
import { SupplyChainReportGenerator } from "@/components/ai-design-assistant/SupplyChainReportGenerator";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { Calculator, BarChart3, Network, Package, Thermometer, Store, FileText, Building2 } from "lucide-react";

export const InventoryOptimizationContent = () => {
  const [activeTab, setActiveTab] = useState<string>("enterprise-suite");

  return (
    <div className="space-y-6" id="inventory-optimization-content">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enterprise Inventory Optimization Suite</h2>
          <p className="text-gray-600 mt-1">Complete mathematical models for optimal inventory management</p>
        </div>
        <ExportPdfButton 
          exportId="inventory-optimization-content"
          fileName="inventory_optimization_report"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="bg-white rounded-lg shadow-sm p-1 mb-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-8 w-full h-auto p-1 bg-transparent gap-1">
            <TabsTrigger 
              value="enterprise-suite" 
              className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-medium">Enterprise</span>
            </TabsTrigger>
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
              <Package className="h-4 w-4" />
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

        <TabsContent value="enterprise-suite" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-xl font-semibold">Enterprise Inventory Optimization Suite</h3>
                <p className="text-gray-600">Complete collection of inventory management formulas and calculators</p>
              </div>
            </div>
            <EnterpriseEOQCalculators />
          </Card>
        </TabsContent>

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
              <Package className="h-6 w-6 text-primary" />
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
        <h3 className="text-lg font-bold mb-4 text-gray-900">Enterprise Mathematical Models Implemented</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-blue-700 mb-2">Basic EOQ</h4>
            <p className="text-sm text-gray-600">√(2DS/H) - Wilson's formula</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-green-700 mb-2">Quantity Discounts</h4>
            <p className="text-sm text-gray-600">Piecewise EOQ optimization</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-purple-700 mb-2">Newsvendor Model</h4>
            <p className="text-sm text-gray-600">Q* = F⁻¹(p/(p+h))</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-orange-700 mb-2">Base Stock Policy</h4>
            <p className="text-sm text-gray-600">S = μ_LT + SS</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-red-700 mb-2">Safety Stock</h4>
            <p className="text-sm text-gray-600">Z × σ_LT × √LT</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-indigo-700 mb-2">ABC Analysis</h4>
            <p className="text-sm text-gray-600">Pareto classification</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-pink-700 mb-2">Multi-Echelon</h4>
            <p className="text-sm text-gray-600">Network-wide optimization</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-teal-700 mb-2">EPQ Model</h4>
            <p className="text-sm text-gray-600">Production batch sizing</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
