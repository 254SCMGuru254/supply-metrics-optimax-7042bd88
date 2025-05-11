
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { EOQCalculator } from "@/components/inventory-optimization/EOQCalculator";
import { SafetyStockCalculator } from "@/components/inventory-optimization/SafetyStockCalculator";
import { ABCAnalysis } from "@/components/inventory-optimization/ABCAnalysis";
import { MultiEchelonVisualization } from "@/components/inventory-optimization/MultiEchelonVisualization";
import { useToast } from "@/components/ui/use-toast";
import { Package, Calculator, Shield, BarChart, Network } from "lucide-react";

export const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState("eoq");
  const { toast } = useToast();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    toast({
      title: `Switched to ${getTabTitle(tab)}`,
      description: `Now viewing the ${getTabTitle(tab)} calculator tool.`
    });
  };

  const getTabTitle = (tab: string) => {
    switch(tab) {
      case "eoq": return "Economic Order Quantity";
      case "safety-stock": return "Safety Stock";
      case "abc-analysis": return "ABC Analysis";
      case "multi-echelon": return "Multi-Echelon Inventory";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Optimization Tools</h1>
        <p className="text-muted-foreground mt-2">
          Optimize your inventory levels with industry-standard models and calculators
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <TabsTrigger value="eoq" className="flex items-center">
            <Calculator className="mr-2 h-4 w-4" />
            <span>EOQ Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="safety-stock" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            <span>Safety Stock</span>
          </TabsTrigger>
          <TabsTrigger value="abc-analysis" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            <span>ABC Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="multi-echelon" className="flex items-center">
            <Network className="mr-2 h-4 w-4" />
            <span>Multi-Echelon</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="eoq" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Economic Order Quantity (EOQ)</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Calculate the optimal order quantity that minimizes total inventory holding and ordering costs.
            </p>
            <EOQCalculator />
          </Card>
        </TabsContent>
        
        <TabsContent value="safety-stock" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Safety Stock Calculator</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Calculate optimal safety stock levels to protect against variability in demand and lead time.
            </p>
            <SafetyStockCalculator />
          </Card>
        </TabsContent>
        
        <TabsContent value="abc-analysis" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">ABC Analysis</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Categorize inventory items based on their value and importance to optimize control strategies.
            </p>
            <ABCAnalysis />
          </Card>
        </TabsContent>
        
        <TabsContent value="multi-echelon" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Network className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Multi-Echelon Inventory Optimization</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Visualize and optimize inventory across multiple levels in your supply chain.
            </p>
            <MultiEchelonVisualization />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;
