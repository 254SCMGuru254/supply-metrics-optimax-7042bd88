
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Upload, BarChart3, Network, Target, Calculator, Activity, Layers } from "lucide-react";
import { ModelSelection } from "@/components/data-input/ModelSelection";
import { GeneralDataContent } from "@/components/data-input/GeneralDataContent";
import { ComprehensiveDataContent } from "@/components/data-input/ComprehensiveDataContent";
import { CogDataContent } from "@/components/data-input/CogDataContent";
import { HeuristicContent } from "@/components/data-input/HeuristicContent";
import { IsohedronContent } from "@/components/data-input/IsohedronContent";
import { MILPDataContent } from "@/components/data-input/MILPDataContent";
import { NetworkFlowContent } from "@/components/data-input/NetworkFlowContent";
import { SimulationContent } from "@/components/data-input/SimulationContent";
import { WarehouseConfigContent } from "@/components/warehouse/WarehouseConfigContent";
import { Node } from "@/components/map/MapTypes";

const DataInput = () => {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [nodes, setNodes] = useState<Node[]>([]);

  const modelTabs = [
    { id: "general", label: "General Data", icon: Database },
    { id: "comprehensive", label: "Comprehensive", icon: BarChart3 },
    { id: "cog", label: "Center of Gravity", icon: Target },
    { id: "heuristic", label: "Heuristic", icon: Calculator },
    { id: "isohedron", label: "Isohedron", icon: Layers },
    { id: "milp", label: "MILP", icon: Activity },
    { id: "network-flow", label: "Network Flow", icon: Network },
    { id: "simulation", label: "Simulation", icon: Activity },
    { id: "warehouse", label: "Warehouse Config", icon: Upload },
  ];

  const renderTabContent = (tabId: string) => {
    switch (tabId) {
      case "general":
        return <GeneralDataContent />;
      case "comprehensive":
        return <ComprehensiveDataContent />;
      case "cog":
        return <CogDataContent />;
      case "heuristic":
        return <HeuristicContent />;
      case "isohedron":
        return <IsohedronContent />;
      case "milp":
        return <MILPDataContent />;
      case "network-flow":
        return <NetworkFlowContent />;
      case "simulation":
        return <SimulationContent />;
      case "warehouse":
        return <WarehouseConfigContent nodes={nodes} setNodes={setNodes} />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Select a Data Input Type</CardTitle>
              <CardDescription>
                Choose from the tabs above to configure data for different optimization models.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Each tab provides specialized data input forms tailored to specific optimization algorithms and methodologies.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Database className="h-8 w-8" />
          Data Input & Configuration
        </h1>
        <p className="text-gray-600">
          Configure data inputs for various supply chain optimization models and algorithms
        </p>
      </div>

      <ModelSelection
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
          {modelTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-1 text-xs"
              >
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {modelTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-6">
            {renderTabContent(tab.id)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DataInput;
