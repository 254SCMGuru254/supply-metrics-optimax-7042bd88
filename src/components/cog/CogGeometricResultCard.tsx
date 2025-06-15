
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  result: {
    latitude: number;
    longitude: number;
    totalDistance?: number;
    efficiencyScore?: number;
  } | null;
}

export const CogGeometricResultCard: React.FC<Props> = ({ result }) => {
  if (!result) return null;

  return (
    <Card className="p-6 bg-green-50">
      <div className="text-center">
        <h3 className="font-bold text-xl mb-4">Geometric Median Result</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Optimal Location</p>
            <p className="text-lg font-bold">
              {result.latitude.toFixed(6)}°, {result.longitude.toFixed(6)}°
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Distance</p>
            <p className="text-lg font-bold text-green-600">
              {result.totalDistance?.toFixed(2)} km
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Efficiency Score</p>
            <Badge variant="default" className="text-lg">
              {result.efficiencyScore}%
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CogGeometricResultCard;
