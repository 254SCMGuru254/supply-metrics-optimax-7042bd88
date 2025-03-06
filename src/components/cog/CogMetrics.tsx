
import { Node, Route } from "@/components/NetworkMap";

type CogMetricsProps = {
  nodes: Node[];
  totalWeight: number;
  isOptimized: boolean;
  optimalLocation: { lat: number; lng: number } | null;
  distanceReduction: number | null;
  calculationType: 'euclidean' | 'haversine';
};

export const CogMetrics = ({
  nodes,
  totalWeight,
  isOptimized,
  optimalLocation,
  distanceReduction,
  calculationType,
}: CogMetricsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Total Demand Points</p>
        <p className="text-2xl font-semibold">{nodes.filter(n => n.type === "retail").length}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Total Demand Weight</p>
        <p className="text-2xl font-semibold">{totalWeight}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Distance Calculation</p>
        <p className="text-lg font-medium">{calculationType === 'haversine' ? 'Haversine (accounts for Earth curvature)' : 'Euclidean (straight-line)'}</p>
      </div>
      {isOptimized && optimalLocation && (
        <>
          <div>
            <p className="text-sm text-muted-foreground">Optimal Location</p>
            <p className="text-lg font-medium">[{optimalLocation.lat.toFixed(4)}, {optimalLocation.lng.toFixed(4)}]</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Distance Reduction</p>
            <p className="text-2xl font-semibold text-primary">{distanceReduction?.toFixed(1)}%</p>
          </div>
        </>
      )}
    </div>
  );
};
