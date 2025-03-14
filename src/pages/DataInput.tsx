
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
import { HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DataInput = () => {
  const navigate = useNavigate();
  const [activeModel, setActiveModel] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("guide");

  const renderModelContent = () => {
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
      default:
        return null;
    }
  };

  const handleModelSelect = (model: string) => {
    setActiveModel(model);
    if (model) {
      setActiveTab("input");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Data Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate("/onboarding")}>
            Go to Onboarding
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guide">
            <HelpCircle className="h-4 w-4 mr-2" />
            Model Selection Guide
          </TabsTrigger>
          <TabsTrigger value="input" disabled={!activeModel}>
            Data Input
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="guide" className="pt-6">
          <ModelSelectionGuide onModelSelect={handleModelSelect} />
        </TabsContent>
        
        <TabsContent value="input" className="pt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Data Input for Selected Model</h2>
            <p className="text-muted-foreground mb-6">
              Enter the required data for your selected optimization model. All fields marked with * are required.
            </p>
            
            <Button 
              variant="outline"
              onClick={() => {
                setActiveModel("");
                setActiveTab("guide");
              }}
              className="mb-6"
            >
              Change Model Selection
            </Button>
            
            <ModelSelection 
              activeModel={activeModel} 
              setActiveModel={setActiveModel} 
            />
          </div>
          
          {renderModelContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataInput;
