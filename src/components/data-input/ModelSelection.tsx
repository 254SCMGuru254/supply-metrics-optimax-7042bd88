
import { 
  LayoutGrid, 
  Network, 
  Activity, 
  Box, 
  Target, 
  Building2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ModelSelectionButton } from "./ModelSelectionButton";

type ModelSelectionProps = {
  activeModel: string;
  setActiveModel: (model: string) => void;
};

export const ModelSelection = ({ activeModel, setActiveModel }: ModelSelectionProps) => {
  const models = [
    {
      id: "general",
      icon: LayoutGrid,
      title: "General Data",
      description: "Base network data"
    },
    {
      id: "cog",
      icon: Target,
      title: "Center of Gravity",
      description: "Facility location"
    },
    {
      id: "network",
      icon: Network,
      title: "Network Flow",
      description: "Optimal routing"
    },
    {
      id: "simulation",
      icon: Activity,
      title: "Simulation",
      description: "Stochastic analysis"
    },
    {
      id: "heuristic",
      icon: Box,
      title: "Heuristic",
      description: "Approximate solutions"
    },
    {
      id: "isohedron",
      icon: Building2,
      title: "Isohedron",
      description: "Spatial optimization"
    }
  ];

  return (
    <Card className="mb-6">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Select Optimization Model</h2>
        <p className="mb-4 text-muted-foreground">
          Choose the optimization model to configure specific data inputs required for each analysis method.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {models.map((model) => (
            <ModelSelectionButton
              key={model.id}
              isActive={activeModel === model.id}
              onClick={() => setActiveModel(model.id)}
              icon={model.icon}
              title={model.title}
              description={model.description}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};
