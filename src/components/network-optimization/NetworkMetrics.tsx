
import { Node, Route } from "@/components/map/MapTypes";

type NetworkMetricsProps = {
  nodes: Node[];
  routes: Route[];
  isOptimized?: boolean;
  costReduction?: number | null;
  flowEfficiency?: number | null;
  optimizationResults?: any;
};

export const NetworkMetrics = ({
  nodes,
  routes,
  isOptimized,
  costReduction,
  flowEfficiency,
}: NetworkMetricsProps) => {
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
      {isOptimized && (
        <>
          <div>
            <p className="text-sm text-muted-foreground">Cost Reduction</p>
            <p className="text-2xl font-semibold text-primary">
              {costReduction !== null ? `${costReduction.toFixed(1)}%` : 'Calculating...'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Flow Efficiency</p>
            <p className="text-2xl font-semibold text-primary">
              {flowEfficiency !== null ? `${flowEfficiency.toFixed(1)}%` : 'Calculating...'}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
