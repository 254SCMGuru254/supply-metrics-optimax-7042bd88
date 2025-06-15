
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface DemandPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  weight: number;
  cost?: number;
  risk?: number;
}

interface Props {
  demandPoints: DemandPoint[];
}

export const CogDemandPointsGrid: React.FC<Props> = ({ demandPoints }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {demandPoints.map((point, index) => (
      <Card key={point.id} className="p-4">
        <div className="space-y-2">
          <Label>Location {index + 1}: {point.name}</Label>
          <div className="text-sm space-y-1">
            <div>Lat: {point.latitude.toFixed(4)}</div>
            <div>Lng: {point.longitude.toFixed(4)}</div>
            <div>Weight: {point.weight}</div>
            <div>Cost: KES {point.cost}</div>
            <div>Risk: {((point.risk || 0) * 100).toFixed(1)}%</div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default CogDemandPointsGrid;
