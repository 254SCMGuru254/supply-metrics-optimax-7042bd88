
import { 
  Database, 
  Boxes, 
  Target, 
  Network, 
  BarChart4, 
  Calculator, 
  Hexagon 
} from "lucide-react";
import { ModelSelectionButton } from "./ModelSelectionButton";

interface ModelSelectionProps {
  activeModel: string;
  setActiveModel: (model: string) => void;
}

export const ModelSelection = ({
  activeModel,
  setActiveModel,
}: ModelSelectionProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <ModelSelectionButton
        title="Comprehensive"
        description="Detailed data for all models"
        isActive={activeModel === "comprehensive"}
        onClick={() => setActiveModel("comprehensive")}
        icon={Database}
      />
      <ModelSelectionButton
        title="General"
        description="Basic supply chain data"
        isActive={activeModel === "general"}
        onClick={() => setActiveModel("general")}
        icon={Boxes}
      />
      <ModelSelectionButton
        title="Center of Gravity"
        description="Location data for CoG analysis"
        isActive={activeModel === "cog"}
        onClick={() => setActiveModel("cog")}
        icon={Target}
      />
      <ModelSelectionButton
        title="Network Flow"
        description="Data for network optimization"
        isActive={activeModel === "network"}
        onClick={() => setActiveModel("network")}
        icon={Network}
      />
      <ModelSelectionButton
        title="Simulation"
        description="Data for supply chain simulation"
        isActive={activeModel === "simulation"}
        onClick={() => setActiveModel("simulation")}
        icon={BarChart4}
      />
      <ModelSelectionButton
        title="Heuristic"
        description="Data for heuristic analysis"
        isActive={activeModel === "heuristic"}
        onClick={() => setActiveModel("heuristic")}
        icon={Calculator}
      />
      <ModelSelectionButton
        title="Isohedron"
        description="Data for isohedron modeling"
        isActive={activeModel === "isohedron"}
        onClick={() => setActiveModel("isohedron")}
        icon={Hexagon}
      />
    </div>
  );
};
