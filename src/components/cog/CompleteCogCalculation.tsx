
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, MapPin, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Node } from "@/components/map/MapTypes";

export interface CogCalculationResult {
  latitude: number;
  longitude: number;
  totalDistance: number;
  totalCost: number;
  efficiencyScore: number;
  algorithmUsed: string;
}

interface CompleteCogCalculationProps {
  demandPoints: Node[];
  selectedFormula: string;
  onResultsCalculated: (results: CogCalculationResult) => void;
}

export function CompleteCogCalculation({ 
  demandPoints, 
  selectedFormula, 
  onResultsCalculated 
}: CompleteCogCalculationProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<CogCalculationResult | null>(null);
  const { toast } = useToast();

  const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateEuclideanDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const latKm = (lat2 - lat1) * 111;
    const lonKm = (lon2 - lon1) * 111 * Math.cos((lat1 + lat2) / 2 * Math.PI / 180);
    return Math.sqrt(latKm * latKm + lonKm * lonKm);
  };

  const calculateManhattanDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    return Math.abs(lat1 - lat2) * 111 + Math.abs(lon1 - lon2) * 111;
  };

  const getDistanceFunction = (formula: string) => {
    switch (formula) {
      case 'euclidean':
        return calculateEuclideanDistance;
      case 'manhattan':
        return calculateManhattanDistance;
      case 'haversine':
      case 'great-circle':
      default:
        return calculateHaversineDistance;
    }
  };

  const calculateWeightedCenterOfGravity = (): CogCalculationResult => {
    if (demandPoints.length === 0) {
      throw new Error("No demand points provided");
    }

    let totalWeight = 0;
    let weightedLat = 0;
    let weightedLng = 0;

    // Calculate weighted center
    demandPoints.forEach(point => {
      const weight = point.weight || 1;
      totalWeight += weight;
      weightedLat += point.latitude * weight;
      weightedLng += point.longitude * weight;
    });

    const cogLat = weightedLat / totalWeight;
    const cogLng = weightedLng / totalWeight;

    // Calculate metrics
    const distanceFunction = getDistanceFunction(selectedFormula);
    let totalDistance = 0;
    let totalCost = 0;

    demandPoints.forEach(point => {
      const distance = distanceFunction(point.latitude, point.longitude, cogLat, cogLng);
      const weight = point.weight || 1;
      totalDistance += distance;
      totalCost += distance * weight * 10; // Assume $10 per km per unit weight
    });

    // Calculate efficiency score (100 - normalized total cost)
    const maxPossibleCost = totalWeight * 1000; // Theoretical maximum
    const efficiencyScore = Math.max(0, 100 - (totalCost / maxPossibleCost) * 100);

    return {
      latitude: cogLat,
      longitude: cogLng,
      totalDistance,
      totalCost,
      efficiencyScore,
      algorithmUsed: selectedFormula
    };
  };

  const calculateGeometricMedian = (): CogCalculationResult => {
    if (demandPoints.length === 0) {
      throw new Error("No demand points provided");
    }

    // Start with weighted mean as initial guess
    let totalWeight = 0;
    let lat = 0;
    let lng = 0;

    demandPoints.forEach(point => {
      const weight = point.weight || 1;
      totalWeight += weight;
      lat += point.latitude * weight;
      lng += point.longitude * weight;
    });

    lat /= totalWeight;
    lng /= totalWeight;

    // Iterative refinement using Weiszfeld algorithm
    const maxIterations = 100;
    const tolerance = 1e-6;
    const distanceFunction = getDistanceFunction(selectedFormula);

    for (let iter = 0; iter < maxIterations; iter++) {
      let numeratorLat = 0;
      let numeratorLng = 0;
      let denominator = 0;

      demandPoints.forEach(point => {
        const distance = distanceFunction(point.latitude, point.longitude, lat, lng);
        const weight = point.weight || 1;
        
        if (distance > tolerance) {
          const weightOverDistance = weight / distance;
          numeratorLat += point.latitude * weightOverDistance;
          numeratorLng += point.longitude * weightOverDistance;
          denominator += weightOverDistance;
        }
      });

      if (denominator === 0) break;

      const newLat = numeratorLat / denominator;
      const newLng = numeratorLng / denominator;

      if (Math.abs(newLat - lat) < tolerance && Math.abs(newLng - lng) < tolerance) {
        break;
      }

      lat = newLat;
      lng = newLng;
    }

    // Calculate metrics
    let totalDistance = 0;
    let totalCost = 0;

    demandPoints.forEach(point => {
      const distance = distanceFunction(point.latitude, point.longitude, lat, lng);
      const weight = point.weight || 1;
      totalDistance += distance;
      totalCost += distance * weight * 10;
    });

    const maxPossibleCost = totalWeight * 1000;
    const efficiencyScore = Math.max(0, 100 - (totalCost / maxPossibleCost) * 100);

    return {
      latitude: lat,
      longitude: lng,
      totalDistance,
      totalCost,
      efficiencyScore,
      algorithmUsed: `geometric-${selectedFormula}`
    };
  };

  const runCogCalculation = async () => {
    if (demandPoints.length === 0) {
      toast({
        title: "No Data",
        description: "Please add demand points to calculate center of gravity.",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    try {
      // Simulate calculation time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      let calculationResult: CogCalculationResult;

      switch (selectedFormula) {
        case 'geometric':
          calculationResult = calculateGeometricMedian();
          break;
        case 'weighted':
        case 'euclidean':
        case 'haversine':
        case 'manhattan':
        default:
          calculationResult = calculateWeightedCenterOfGravity();
          break;
      }

      setResults(calculationResult);
      onResultsCalculated(calculationResult);

      toast({
        title: "Calculation Complete",
        description: `Center of gravity calculated using ${selectedFormula} method.`
      });

    } catch (error) {
      console.error('COG calculation error:', error);
      toast({
        title: "Calculation Error",
        description: "Failed to calculate center of gravity. Please check your data.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Center of Gravity Calculation Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {demandPoints.length} demand points loaded
            </p>
            <p className="text-sm text-muted-foreground">
              Algorithm: <Badge variant="outline">{selectedFormula}</Badge>
            </p>
          </div>
          <Button 
            onClick={runCogCalculation}
            disabled={isCalculating || demandPoints.length === 0}
          >
            {isCalculating ? "Calculating..." : "Calculate COG"}
          </Button>
        </div>

        {results && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Optimal Location
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg font-bold">
                  {results.latitude.toFixed(6)}°, {results.longitude.toFixed(6)}°
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Distance
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg font-bold">
                  {results.totalDistance.toFixed(2)} km
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Efficiency Score
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg font-bold text-green-600">
                  {results.efficiencyScore.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
