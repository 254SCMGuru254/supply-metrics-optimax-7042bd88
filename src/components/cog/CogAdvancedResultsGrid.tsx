
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdvancedResult {
  latitude: number;
  longitude: number;
  totalDistance?: number;
  totalWeight?: number;
  efficiencyScore?: number;
  algorithm: string;
}

interface SeasonalResult extends AdvancedResult {
  season?: string;
}

interface Props {
  manhattan?: AdvancedResult;
  multiCriteria?: AdvancedResult;
  riskAdjusted?: AdvancedResult;
  seasonalPoints: { season: string }[];
  cogResults: { [key: string]: AdvancedResult };
}

export const CogAdvancedResultsGrid: React.FC<Props> = ({
  manhattan,
  multiCriteria,
  riskAdjusted,
  seasonalPoints,
  cogResults
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {manhattan && (
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-lg">Manhattan COG</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm">
              <strong>Location:</strong> {manhattan.latitude.toFixed(4)}°, {manhattan.longitude.toFixed(4)}°
            </div>
            <div className="text-sm">
              <strong>Distance:</strong> {manhattan.totalDistance?.toFixed(2)} km
            </div>
            <Badge variant="outline">
              Efficiency: {manhattan.efficiencyScore}%
            </Badge>
          </div>
        </CardContent>
      </Card>
    )}

    {multiCriteria && (
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-lg">Multi-Criteria COG</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm">
              <strong>Location:</strong> {multiCriteria.latitude.toFixed(4)}°, {multiCriteria.longitude.toFixed(4)}°
            </div>
            <div className="text-sm">
              <strong>Criteria:</strong> Weight (40%), Cost (30%), Risk (30%)
            </div>
            <Badge variant="outline">
              Efficiency: {multiCriteria.efficiencyScore}%
            </Badge>
          </div>
        </CardContent>
      </Card>
    )}

    {riskAdjusted && (
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-lg">Risk-Adjusted COG</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm">
              <strong>Location:</strong> {riskAdjusted.latitude.toFixed(4)}°, {riskAdjusted.longitude.toFixed(4)}°
            </div>
            <div className="text-sm">
              <strong>Risk Factors:</strong> Supply chain resilience optimized
            </div>
            <Badge variant="outline">
              Efficiency: {riskAdjusted.efficiencyScore}%
            </Badge>
          </div>
        </CardContent>
      </Card>
    )}

    {/* Seasonal Results */}
    {seasonalPoints.map(season => {
      const result = cogResults[season.season];
      return result ? (
        <Card key={season.season} className="p-4">
          <CardHeader>
            <CardTitle className="text-lg">Seasonal COG - {season.season}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <strong>Location:</strong> {result.latitude.toFixed(4)}°, {result.longitude.toFixed(4)}°
              </div>
              <div className="text-sm">
                <strong>Total Weight:</strong> {result.totalWeight}
              </div>
              <Badge variant="outline">
                Efficiency: {result.efficiencyScore}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : null;
    })}
  </div>
);

export default CogAdvancedResultsGrid;
