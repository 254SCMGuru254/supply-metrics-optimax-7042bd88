import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Network, 
  BarChart3, 
  Calculator, 
  Hexagon,
  Truck,
  Building,
  Route,
  DollarSign,
  Package2,
  FileQuestion
} from "lucide-react";
import { ModelSelectionButton } from "./ModelSelectionButton";

interface ModelSelectionProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
}

export function ModelSelection({ selectedModel, onModelSelect }: ModelSelectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      <ModelSelectionButton
        title="Comprehensive"
        description="Detailed data for all models"
        isActive={selectedModel === "comprehensive"}
        onClick={() => onModelSelect("comprehensive")}
        icon={LayoutDashboard}
      />
      <ModelSelectionButton
        title="General"
        description="Basic supply chain data"
        isActive={selectedModel === "general"}
        onClick={() => onModelSelect("general")}
        icon={Package}
      />
      <ModelSelectionButton
        title="Center of Gravity"
        description="Location data for CoG analysis"
        isActive={selectedModel === "cog"}
        onClick={() => onModelSelect("cog")}
        icon={MapPin}
      />
      <ModelSelectionButton
        title="Network Flow"
        description="Data for network optimization"
        isActive={selectedModel === "network"}
        onClick={() => onModelSelect("network")}
        icon={Network}
      />
      <ModelSelectionButton
        title="Simulation"
        description="Data for supply chain simulation"
        isActive={selectedModel === "simulation"}
        onClick={() => onModelSelect("simulation")}
        icon={BarChart3}
      />
      <ModelSelectionButton
        title="Heuristic"
        description="Data for heuristic analysis"
        isActive={selectedModel === "heuristic"}
        onClick={() => onModelSelect("heuristic")}
        icon={Calculator}
      />
      <ModelSelectionButton
        title="Isohedron"
        description="Data for isohedron modeling"
        isActive={selectedModel === "isohedron"}
        onClick={() => onModelSelect("isohedron")}
        icon={Hexagon}
      />
      <ModelSelectionButton
        title="MILP"
        description="Mixed-Integer Linear Programming"
        isActive={selectedModel === "milp"}
        onClick={() => onModelSelect("milp")}
        icon={Calculator}
      />
      <ModelSelectionButton
        title="Fleet Management"
        description="Vehicle fleet optimization"
        isActive={selectedModel === "fleet"}
        onClick={() => onModelSelect("fleet")}
        icon={Truck}
      />
      <ModelSelectionButton
        title="Warehouse Network"
        description="Warehouse location & configuration"
        isActive={selectedModel === "warehouse"}
        onClick={() => onModelSelect("warehouse")}
        icon={Building}
      />
      <ModelSelectionButton
        title="Route Optimization"
        description="Advanced multi-modal routing"
        isActive={selectedModel === "route"}
        onClick={() => onModelSelect("route")}
        icon={Route}
      />
      <ModelSelectionButton
        title="Cost Modeling"
        description="TCO & cost scenario analysis"
        isActive={selectedModel === "cost"}
        onClick={() => onModelSelect("cost")}
        icon={DollarSign}
      />
      <ModelSelectionButton
        title="Inventory Optimization"
        description="EOQ & ABC Analysis"
        isActive={selectedModel === "inventory"}
        onClick={() => onModelSelect("inventory")}
        icon={Package2}
      />
      <ModelSelectionButton
        title="Suitability Questionnaire"
        description="Find the right optimization model"
        isActive={selectedModel === "suitability"}
        onClick={() => onModelSelect("suitability")}
        icon={FileQuestion}
      />
    </div>
  );
};
