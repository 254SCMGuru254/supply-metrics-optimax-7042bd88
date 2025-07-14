
import { Node, Route } from "@/components/map/MapTypes";

type HeuristicMetricsProps = {
  nodes: Node[];
  routes: Route[];
  isOptimized: boolean;
  improvementPercentage: number | null;
};

export const HeuristicMetrics = ({
  nodes,
  routes,
  isOptimized,
  improvementPercentage,
}: HeuristicMetricsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Total Nodes</p>
        <p className="text-2xl font-semibold">{nodes.length}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Total Routes</p>
        <p className="text-2xl font-semibold">{routes.length}</p>
      </div>
      {isOptimized && improvementPercentage !== null && (
        <>
          <div>
            <p className="text-sm text-muted-foreground">Cost Reduction</p>
            <p className="text-2xl font-semibold text-primary">{improvementPercentage.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Algorithm</p>
            <p className="text-lg font-medium">Simulated Annealing</p>
          </div>
        </>
      )}
    </div>
  );
};
