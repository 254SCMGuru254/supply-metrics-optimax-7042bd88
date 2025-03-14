
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

const DataInput = () => {
  const navigate = useNavigate();
  const [activeModel, setActiveModel] = useState<string>("comprehensive");

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
      default:
        return <ComprehensiveDataContent />;
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
        </div>
      </div>
      
      <ModelSelection 
        activeModel={activeModel} 
        setActiveModel={setActiveModel} 
      />

      {renderModelContent()}
    </div>
  );
};

export default DataInput;
