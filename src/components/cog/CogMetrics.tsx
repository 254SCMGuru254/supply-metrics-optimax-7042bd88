import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, MapPin, TrendingUp } from "lucide-react";
import type { Node } from "@/components/map/MapTypes";
import { calculateTotalDistance, calculateTotalCost } from "./CogUtils";

export interface CogMetricsProps {
  demandNodes: Node[];
  cogResult: { lat: number; lng: number } | null;
  selectedFormula: string;
}

export function CogMetrics({ 
  demandNodes, 
  cogResult, 
  selectedFormula 
}: CogMetricsProps) {
  if (!cogResult) {
    return (
      <div className="text-center py-8">
        <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Add demand points to calculate center of gravity</p>
      </div>
    );
  }

  const totalDistance = calculateTotalDistance(demandNodes, cogResult, selectedFormula);
  const totalCost = calculateTotalCost(demandNodes, cogResult, selectedFormula);
  const avgDistance = totalDistance / demandNodes.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">COG Coordinates</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cogResult.lat.toFixed(4)}, {cogResult.lng.toFixed(4)}
            </div>
            <p className="text-xs text-muted-foreground">
              Optimal facility location
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistance.toFixed(2)} km</div>
            <p className="text-xs text-muted-foreground">
              Sum of all distances
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weighted Cost</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Distance × demand weight
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Calculation Details</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span>Formula Used:</span>
            <Badge variant="secondary">{selectedFormula}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Demand Points:</span>
            <span>{demandNodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Average Distance:</span>
            <span>{avgDistance.toFixed(2)} km</span>
          </div>
          <div className="flex justify-between">
            <span>Total Demand:</span>
            <span>{demandNodes.reduce((sum, node) => sum + (node.weight || 0), 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
