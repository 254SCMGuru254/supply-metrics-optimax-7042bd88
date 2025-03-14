
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
      />
      <ModelSelectionButton
        title="General"
        description="Basic supply chain data"
        isActive={activeModel === "general"}
        onClick={() => setActiveModel("general")}
      />
      <ModelSelectionButton
        title="Center of Gravity"
        description="Location data for CoG analysis"
        isActive={activeModel === "cog"}
        onClick={() => setActiveModel("cog")}
      />
      <ModelSelectionButton
        title="Network Flow"
        description="Data for network optimization"
        isActive={activeModel === "network"}
        onClick={() => setActiveModel("network")}
      />
      <ModelSelectionButton
        title="Simulation"
        description="Data for supply chain simulation"
        isActive={activeModel === "simulation"}
        onClick={() => setActiveModel("simulation")}
      />
      <ModelSelectionButton
        title="Heuristic"
        description="Data for heuristic analysis"
        isActive={activeModel === "heuristic"}
        onClick={() => setActiveModel("heuristic")}
      />
      <ModelSelectionButton
        title="Isohedron"
        description="Data for isohedron modeling"
        isActive={activeModel === "isohedron"}
        onClick={() => setActiveModel("isohedron")}
      />
    </div>
  );
};
