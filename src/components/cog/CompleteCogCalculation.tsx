import { useState } from "react";
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

  // --- DISTANCE CALCULATION HELPERS ---

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
      case 'weighted-center-gravity':
        return calculateEuclideanDistance;
      case 'manhattan':
      case 'manhattan-center-gravity':
        return calculateManhattanDistance;
      case 'haversine':
      case 'haversine-center-gravity':
      case 'great-circle':
      default:
        return calculateHaversineDistance;
    }
  };

  // --- COG CALCULATION ALGORITHMS ---

  const calculateWeightedCenterOfGravity = (): CogCalculationResult => {
    if (demandPoints.length === 0) throw new Error("No demand points provided");
    
    let totalWeight = 0;
    let weightedLat = 0;
    let weightedLng = 0;

    demandPoints.forEach(point => {
      const weight = point.weight || 1;
      totalWeight += weight;
      weightedLat += point.latitude * weight;
      weightedLng += point.longitude * weight;
    });

    const cogLat = totalWeight > 0 ? weightedLat / totalWeight : 0;
    const cogLng = totalWeight > 0 ? weightedLng / totalWeight : 0;
    
    const distanceFunction = getDistanceFunction(selectedFormula);
    let totalDistance = 0;
    let totalCost = 0;

    demandPoints.forEach(point => {
      const distance = distanceFunction(point.latitude, point.longitude, cogLat, cogLng);
      const weight = point.weight || 1;
      totalDistance += distance;
      totalCost += distance * weight * 10;
    });

    const maxPossibleCost = totalWeight * 10000;
    const efficiencyScore = Math.max(0, 100 - (totalCost / (maxPossibleCost + 1)) * 100);

    return { latitude: cogLat, longitude: cogLng, totalDistance, totalCost, efficiencyScore, algorithmUsed: selectedFormula };
  };

  const calculateGeometricMedian = (): CogCalculationResult => {
     if (demandPoints.length === 0) throw new Error("No demand points provided");

    let totalWeight = demandPoints.reduce((sum, p) => sum + (p.weight || 1), 0);
    let lat = demandPoints.reduce((sum, p) => sum + p.latitude * (p.weight || 1), 0) / totalWeight;
    let lng = demandPoints.reduce((sum, p) => sum + p.longitude * (p.weight || 1), 0) / totalWeight;
    
    const maxIterations = 100;
    const tolerance = 1e-6;
    const distanceFunction = getDistanceFunction(selectedFormula);

    for (let i = 0; i < maxIterations; i++) {
      let numLat = 0, numLng = 0, den = 0;
      for (const p of demandPoints) {
        const d = distanceFunction(p.latitude, p.longitude, lat, lng);
        if (d > tolerance) {
          const w = (p.weight || 1) / d;
          numLat += p.latitude * w;
          numLng += p.longitude * w;
          den += w;
        }
      }
      if (den === 0) break;
      const newLat = numLat / den;
      const newLng = numLng / den;
      if (Math.abs(newLat - lat) < tolerance && Math.abs(newLng - lng) < tolerance) break;
      lat = newLat;
      lng = newLng;
    }
    
    let totalDistance = 0, totalCost = 0;
    demandPoints.forEach(p => {
        const d = distanceFunction(p.latitude, p.longitude, lat, lng);
        totalDistance += d;
        totalCost += d * (p.weight || 1) * 10;
    });
    
    const maxCost = totalWeight * 10000;
    const efficiency = Math.max(0, 100 - (totalCost / (maxCost + 1)) * 100);
    
    return { latitude: lat, longitude: lng, totalDistance, totalCost, efficiencyScore: efficiency, algorithmUsed: 'geometric-median' };
  };
  
  // Placeholder for Economic COG
  const calculateEconomicCenterOfGravity = (): CogCalculationResult => {
    toast({ title: "Notice", description: "Economic COG is using Weighted Average as a placeholder."});
    return calculateWeightedCenterOfGravity();
  };

  // Placeholder for Multi-Criteria COG
  const calculateMultiCriteriaCOG = (): CogCalculationResult => {
    toast({ title: "Notice", description: "Multi-Criteria COG is using Weighted Average as a placeholder."});
    return calculateWeightedCenterOfGravity();
  };

  // Placeholder for Risk-Adjusted COG
  const calculateRiskAdjustedCOG = (): CogCalculationResult => {
    toast({ title: "Notice", description: "Risk-Adjusted COG is using Weighted Average as a placeholder."});
    return calculateWeightedCenterOfGravity();
  };
  
  // Placeholder for Road Network COG
  const calculateRoadNetworkCOG = async (): Promise<CogCalculationResult> => {
    toast({ title: "Notice", description: "Road Network COG is not implemented and uses Weighted Average as a fallback."});
    await new Promise(resolve => setTimeout(resolve, 500));
    return calculateWeightedCenterOfGravity();
  };

  // Placeholder for Seasonal COG
  const calculateSeasonalCOG = (): CogCalculationResult => {
    toast({ title: "Notice", description: "Seasonal COG is not implemented and uses Weighted Average as a fallback."});
    return calculateWeightedCenterOfGravity();
  };
  
  // --- MAIN CALCULATION HANDLER ---

  const runCogCalculation = async () => {
    setIsCalculating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay for UX

      let result: CogCalculationResult;
      switch (selectedFormula) {
        case 'weighted-center-gravity':
          result = calculateWeightedCenterOfGravity();
          break;
        case 'geometric-median':
          result = calculateGeometricMedian();
          break;
        case 'economic-center-gravity':
          result = calculateEconomicCenterOfGravity();
          break;
        case 'haversine-center-gravity':
        case 'great-circle':
          result = calculateWeightedCenterOfGravity();
          break;
        case 'manhattan-center-gravity':
          result = calculateWeightedCenterOfGravity();
          break;
        case 'road-network-cog':
          result = await calculateRoadNetworkCOG();
          break;
        case 'multi-criteria-cog':
          result = calculateMultiCriteriaCOG();
          break;
        case 'seasonal-cog':
          result = calculateSeasonalCOG();
          break;
        case 'risk-adjusted-cog':
          result = calculateRiskAdjustedCOG();
          break;
        default:
          toast({
            title: "Error: Calculation method not found",
            description: `The formula "${selectedFormula}" is not recognized.`,
            variant: "destructive",
          });
          setIsCalculating(false);
          return;
      }
      
      setResults(result);
      onResultsCalculated(result);
      toast({
        title: "Calculation Complete",
        description: `Calculated using ${result.algorithmUsed} method.`,
      });

    } catch (error) {
      console.error('COG calculation error:', error);
      toast({
        title: "Calculation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCalculate = () => {
    if (demandPoints.length === 0) {
      toast({
        title: "Cannot Calculate",
        description: "Please add at least one demand point on the map.",
        variant: "destructive",
      });
      return;
    }
    runCogCalculation();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-6 w-6" />
            Center of Gravity Calculation
          </CardTitle>
          <Badge variant={results ? "secondary" : "outline"}>
            {results ? 'Complete' : 'Pending'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={handleCalculate} disabled={isCalculating} className="w-full">
            {isCalculating ? "Calculating..." : "Run Calculation"}
          </Button>
          
          {results && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-semibold flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                Optimized Location
              </h4>
              <p className="text-sm">
                Latitude: {results.latitude.toFixed(4)}, Longitude: {results.longitude.toFixed(4)}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm pt-2">
                <div className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <span>Total Cost: ${results.totalCost.toFixed(0)}</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="default">Efficiency: {results.efficiencyScore.toFixed(1)}%</Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
