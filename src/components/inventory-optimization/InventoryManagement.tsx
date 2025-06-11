import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { EOQCalculator } from "@/components/inventory-optimization/EOQCalculator";
import { SafetyStockCalculator } from "@/components/inventory-optimization/SafetyStockCalculator";
import { ABCAnalysis } from "@/components/inventory-optimization/ABCAnalysis";
import { MultiEchelonVisualization } from "@/components/inventory-optimization/MultiEchelonVisualization";
import { useToast } from "@/components/ui/use-toast";
import { Package, Calculator, Shield, BarChart3, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";
import { calculateEOQ } from "@/components/inventory-optimization/InventoryOptimizationUtils";
// Import other calculation functions as needed

const inventoryModel = modelFormulaRegistry.find(m => m.id === "inventory-management");

// Dynamic dispatcher for backend functions
const formulaDispatcher: Record<string, Function> = {
  calculateEOQ: (values: any) => calculateEOQ(values),
  // Add other mappings as you implement more formulas
};

export const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState("eoq");
  const { toast } = useToast();
  const [selectedFormulaId, setSelectedFormulaId] = useState(inventoryModel?.formulas[0]?.id || "");
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);

  if (!inventoryModel) return <div>Model not found.</div>;
  const selectedFormula = inventoryModel.formulas.find(f => f.id === selectedFormulaId);

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

  const handleInputChange = (name: string, value: any) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleCalculate = () => {
    if (selectedFormula && selectedFormula.backendFunction && formulaDispatcher[selectedFormula.backendFunction]) {
      const output = formulaDispatcher[selectedFormula.backendFunction](inputValues);
      setResult(output);
    } else {
      setResult({ message: `Calculated using ${selectedFormula?.name}` });
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
            <BarChart3 className="mr-2 h-4 w-4" />
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
              <BarChart3 className="h-5 w-5 text-primary" />
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

      <div className="mt-6">
        <label className="block font-medium mb-2">Select Formula</label>
        <select
          className="border rounded px-3 py-2"
          value={selectedFormulaId}
          onChange={e => setSelectedFormulaId(e.target.value)}
        >
          {inventoryModel.formulas.map(formula => (
            <option key={formula.id} value={formula.id}>{formula.name}</option>
          ))}
        </select>
      </div>

      {selectedFormula && (
        <Card className="p-4 mt-4">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">{selectedFormula.name}</h2>
            <p className="text-muted-foreground mb-4">{selectedFormula.description}</p>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleCalculate(); }}>
              {selectedFormula.inputs.map(input => (
                <div key={input.name}>
                  <label className="block mb-1 font-medium">{input.label}</label>
                  <Input
                    type={input.type === "number" ? "number" : "text"}
                    value={inputValues[input.name] || ""}
                    onChange={e => handleInputChange(input.name, e.target.value)}
                  />
                </div>
              ))}
              <Button type="submit" className="mt-4">Calculate</Button>
            </form>
            {result && (
              <div className="mt-6 p-4 bg-muted rounded">
                <strong>Result:</strong> <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryManagement;
