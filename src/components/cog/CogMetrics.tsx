
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, MapPin, TrendingUp } from "lucide-react";
import type { Node } from "@/components/map/MapTypes";

export interface CogMetricsProps {
  result: { latitude: number; longitude: number } | null;
  metrics: {
    totalDistance: number;
    totalCost: number;
    efficiencyScore: number;
  } | null;
  selectedFormula: string;
}

export function CogMetrics({ 
  result, 
  metrics, 
  selectedFormula 
}: CogMetricsProps) {
  if (!result) {
    return (
      <div className="text-center py-8">
        <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Add demand points to calculate center of gravity</p>
      </div>
    );
  }

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
              {result.latitude?.toFixed(4)}, {result.longitude?.toFixed(4)}
            </div>
            <p className="text-xs text-muted-foreground">
              Optimal facility location
            </p>
          </CardContent>
        </Card>

        {metrics && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalDistance.toFixed(2)} km</div>
                <p className="text-xs text-muted-foreground">
                  Sum of all distances
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.efficiencyScore.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Optimization efficiency
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Calculation Details</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span>Formula Used:</span>
            <Badge variant="secondary">{selectedFormula}</Badge>
          </div>
          {metrics && (
            <div className="flex justify-between">
              <span>Total Cost:</span>
              <span>{metrics.totalCost.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
