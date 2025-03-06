
import { Node } from "@/components/NetworkMap";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CogDemandWeightsProps = {
  nodes: Node[];
  onUpdateWeight: (id: string, weight: number) => void;
};

export const CogDemandWeights = ({ nodes, onUpdateWeight }: CogDemandWeightsProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Demand Weights</h3>
      <div className="space-y-3 max-h-72 overflow-y-auto">
        {nodes.map((node) => (
          <div key={node.id} className="flex gap-2 items-center">
            <div className="flex-1">
              <Label htmlFor={`weight-${node.id}`}>{node.name}</Label>
            </div>
            <Input
              id={`weight-${node.id}`}
              type="number"
              min="1"
              className="w-24"
              value={node.weight || 1}
              onChange={(e) => onUpdateWeight(node.id, parseInt(e.target.value) || 1)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
