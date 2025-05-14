
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
  const retailNodes = nodes.filter(n => n.type === "retail");
  const warehouseNodes = nodes.filter(n => n.type === "warehouse" && !n.isOptimal);
  const hasExistingWarehouse = warehouseNodes.length > 0;
  
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Total Demand Points</p>
        <p className="text-2xl font-semibold">{retailNodes.length}</p>
      </div>
      
      {hasExistingWarehouse && (
        <div>
          <p className="text-sm text-muted-foreground">Existing Warehouses</p>
          <p className="text-2xl font-semibold">{warehouseNodes.length}</p>
        </div>
      )}
      
      <div>
        <p className="text-sm text-muted-foreground">Total Demand Weight</p>
        <p className="text-2xl font-semibold">{totalWeight.toLocaleString()}</p>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground">Distance Calculation</p>
        <p className="text-lg font-medium">{calculationType === 'haversine' ? 'Haversine' : 'Euclidean'}</p>
        <p className="text-xs text-muted-foreground">
          {calculationType === 'haversine' 
            ? 'Accounts for Earth curvature, more accurate for long distances' 
            : 'Straight-line distance, simpler approximation'}
        </p>
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
          
          <div>
            <p className="text-sm text-muted-foreground">Potential Cost Savings</p>
            <p className="text-lg font-medium">
              {(distanceReduction || 0) < 5 ? 'Minimal' : 
               (distanceReduction || 0) < 15 ? 'Moderate' :
               (distanceReduction || 0) < 30 ? 'Significant' : 'Substantial'}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Calculation Approach</p>
            <p className="text-lg font-medium">Center of Gravity</p>
            <p className="text-xs text-muted-foreground mt-1">
              Weighted average location that minimizes the sum of transportation costs
            </p>
          </div>
        </>
      )}
    </div>
  );
};
