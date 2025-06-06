
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ModelSelection } from "@/components/data-input/ModelSelection";
import { GeneralDataContent } from "@/components/data-input/GeneralDataContent";
import { CogDataContent } from "@/components/data-input/CogDataContent";
import { NetworkFlowContent } from "@/components/data-input/NetworkFlowContent";
import { SimulationContent } from "@/components/data-input/SimulationContent";
import { HeuristicContent } from "@/components/data-input/HeuristicContent";
import { IsohedronContent } from "@/components/data-input/IsohedronContent";
import { ComprehensiveDataContent } from "@/components/data-input/ComprehensiveDataContent";
import { ModelSelectionGuide } from "@/components/data-input/ModelSelectionGuide";
import { MILPDataContent } from "@/components/data-input/MILPDataContent";
import { FleetManagementContent } from "@/components/fleet-management/FleetManagementContent";
import { WarehouseConfigContent } from "@/components/warehouse/WarehouseConfigContent";
import { RouteOptimizationContent } from "@/components/route-optimization/RouteOptimizationContent";
import { CostModelingContent } from "@/components/cost-modeling/CostModelingContent";
import { InventoryOptimizationContent } from "@/components/inventory-optimization/InventoryOptimizationContent";
import { SuitabilityQuestionnaire } from "@/components/suitability/SuitabilityQuestionnaire";
import { HelpCircle, FileQuestion, Calculator, Network, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DataInput = () => {
  const navigate = useNavigate();
  const [activeModel, setActiveModel] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("guide");

  const handleModelSelect = (model: string) => {
    setActiveModel(model);
    setActiveTab("input");
  };

  const handleStartOptimization = () => {
    if (!activeModel) return;
    
    // Navigate to the appropriate optimization page based on selected model
    const routeMap: Record<string, string> = {
      comprehensive: "/dashboard",
      general: "/dashboard", 
      cog: "/center-of-gravity",
      network: "/network-optimization",
      simulation: "/simulation",
      heuristic: "/heuristic",
      isohedron: "/isohedron",
      milp: "/dashboard",
      fleet: "/fleet-management",
      warehouse: "/network-design",
      route: "/route-optimization",
      cost: "/dashboard",
      inventory: "/inventory-management",
      suitability: "/dashboard"
    };

    const targetRoute = routeMap[activeModel] || "/dashboard";
    navigate(targetRoute);
  };

  const renderModelContent = () => {
    if (!activeModel) {
      return (
        <div className="text-center py-12">
          <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Select an Optimization Model</h3>
          <p className="text-muted-foreground mb-4">
            Choose from our comprehensive suite of supply chain optimization models
          </p>
          <Button onClick={() => setActiveTab("guide")}>
            <HelpCircle className="h-4 w-4 mr-2" />
            View Model Guide
          </Button>
        </div>
      );
    }

    switch (activeModel) {
      case "comprehensive":
        return <ComprehensiveDataContent />;
      case "general":
        return <GeneralDataContent />;
      case "cog":
        return <CogDataContent />;
      case "network":
        return <NetworkFlowContent />;
      case "simulation":
        return <SimulationContent />;
      case "heuristic":
        return <HeuristicContent />;
      case "isohedron":
        return <IsohedronContent />;
      case "milp":
        return <MILPDataContent />;
      case "fleet":
        return <FleetManagementContent />;
      case "warehouse":
        return <WarehouseConfigContent />;
      case "route":
        return <RouteOptimizationContent />;
      case "cost":
        return <CostModelingContent />;
      case "inventory":
        return <InventoryOptimizationContent />;
      case "suitability":
        return <SuitabilityQuestionnaire onModelSelect={handleModelSelect} />;
      default:
        return (
          <div className="text-center py-12">
            <Calculator className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Model Configuration</h3>
            <p className="text-muted-foreground mb-4">
              Configure your {activeModel} optimization model
            </p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Data Input & Model Selection</h1>
          <p className="text-muted-foreground mt-2">
            Configure and input data for your supply chain optimization models
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="guide">Model Selection Guide</TabsTrigger>
          <TabsTrigger value="input">Data Input</TabsTrigger>
          <TabsTrigger value="questionnaire">Suitability Assessment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guide">
          <ModelSelectionGuide />
        </TabsContent>
        
        <TabsContent value="questionnaire">
          <div className="flex justify-center">
            <SuitabilityQuestionnaire onModelSelect={handleModelSelect} />
          </div>
        </TabsContent>
        
        <TabsContent value="input" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Model Selection</CardTitle>
                  <CardDescription>Choose your optimization model</CardDescription>
                </CardHeader>
                <CardContent>
                  <ModelSelection 
                    activeModel={activeModel} 
                    setActiveModel={setActiveModel} 
                  />
                  {activeModel && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <Badge variant="default" className="w-full justify-center">
                        Selected: {activeModel.toUpperCase()}
                      </Badge>
                      <Button 
                        className="w-full" 
                        onClick={handleStartOptimization}
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Start Optimization
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    {activeModel ? `${activeModel.toUpperCase()} Model Configuration` : "Model Configuration"}
                  </CardTitle>
                  <CardDescription>
                    Configure parameters and input data for your selected optimization model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderModelContent()}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataInput;
