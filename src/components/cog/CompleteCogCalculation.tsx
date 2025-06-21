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
      algorithmUsed: `geometric-median`
    };
  };

  const calculateEconomicCenterOfGravity = (): CogCalculationResult => {
    if (demandPoints.length === 0) {
      throw new Error("No demand points provided");
    }

    let totalWeightedCost = 0;
    let weightedLat = 0;
    let weightedLng = 0;

    demandPoints.forEach(point => {
      const weight = point.weight || 1;
      const costPerUnit = point.costPerUnit || 10;
      const transportCost = point.transportCost || 0;
      const facilityCost = point.facilityCost || 0;
      
      const totalCost = weight * costPerUnit + transportCost + facilityCost;
      
      totalWeightedCost += totalCost;
      weightedLat += point.latitude * totalCost;
      weightedLng += point.longitude * totalCost;
    });

    const cogLat = weightedLat / totalWeightedCost;
    const cogLng = weightedLng / totalWeightedCost;

    const distanceFunction = getDistanceFunction(selectedFormula);
    let totalDistance = 0;
    let totalCost = 0;

    demandPoints.forEach(point => {
      const distance = distanceFunction(point.latitude, point.longitude, cogLat, cogLng);
      const weight = point.weight || 1;
      const costPerUnit = point.costPerUnit || 10;
      const transportCost = point.transportCost || 0;
      const facilityCost = point.facilityCost || 0;
      
      totalDistance += distance;
      totalCost += distance * weight * costPerUnit + transportCost + facilityCost;
    });

    const maxPossibleCost = totalWeightedCost * 100;
    const efficiencyScore = Math.max(0, 100 - (totalCost / maxPossibleCost) * 100);

    return {
      latitude: cogLat,
      longitude: cogLng,
      totalDistance,
      totalCost,
      efficiencyScore,
      algorithmUsed: `economic-center-gravity`
    };
  };

  const calculateMultiCriteriaCOG = (): CogCalculationResult => {
    if (demandPoints.length === 0) {
      throw new Error("No demand points provided");
    }

    let totalWeightedScore = 0;
    let weightedLat = 0;
    let weightedLng = 0;

    demandPoints.forEach(point => {
      const weight = point.weight || 1;
      const costPerUnit = point.costPerUnit || 10;
      const marketAccess = point.marketAccess || 5;
      const infrastructure = point.infrastructure || 5;
      const laborAvailability = point.laborAvailability || 5;
      const regulatoryEnvironment = point.regulatoryEnvironment || 5;
      
      const costScore = Math.max(0, 1 - (costPerUnit / 50));
      const marketScore = marketAccess / 10;
      const infraScore = infrastructure / 10;
      const laborScore = laborAvailability / 10;
      const regulatoryScore = regulatoryEnvironment / 10;
      
      const multiCriteriaScore = weight * (
        0.3 * costScore + 
        0.25 * marketScore + 
        0.2 * infraScore + 
        0.15 * laborScore + 
        0.1 * regulatoryScore
      );
      
      totalWeightedScore += multiCriteriaScore;
      weightedLat += point.latitude * multiCriteriaScore;
      weightedLng += point.longitude * multiCriteriaScore;
    });

    const cogLat = weightedLat / totalWeightedScore;
    const cogLng = weightedLng / totalWeightedScore;

    const distanceFunction = getDistanceFunction(selectedFormula);
    let totalDistance = 0;
    let totalCost = 0;

    demandPoints.forEach(point => {
      const distance = distanceFunction(point.latitude, point.longitude, cogLat, cogLng);
      const weight = point.weight || 1;
      const costPerUnit = point.costPerUnit || 10;
      totalDistance += distance;
      totalCost += distance * weight * costPerUnit;
    });

    const maxPossibleCost = totalWeightedScore * 100;
    const efficiencyScore = Math.max(0, 100 - (totalCost / maxPossibleCost) * 100);

    return {
      latitude: cogLat,
      longitude: cogLng,
      totalDistance,
      totalCost,
      efficiencyScore,
      algorithmUsed: `multi-criteria-cog`
    };
  };

  const calculateRiskAdjustedCOG = (): CogCalculationResult => {
    if (demandPoints.length === 0) {
      throw new Error("No demand points provided");
    }

    let totalRiskAdjustedWeight = 0;
    let weightedLat = 0;
    let weightedLng = 0;

    demandPoints.forEach(point => {
      const weight = point.weight || 1;
      const riskFactor = point.riskFactor || 1;
      const supplyRisk = point.supplyRisk || 1;
      const demandRisk = point.demandRisk || 1;
      const geographicRisk = point.geographicRisk || 1;
      
      const combinedRisk = (riskFactor + supplyRisk + demandRisk + geographicRisk) / 4;
      const riskAdjustedWeight = weight / Math.max(1, combinedRisk);
      
      totalRiskAdjustedWeight += riskAdjustedWeight;
      weightedLat += point.latitude * riskAdjustedWeight;
      weightedLng += point.longitude * riskAdjustedWeight;
    });

    const cogLat = weightedLat / totalRiskAdjustedWeight;
    const cogLng = weightedLng / totalRiskAdjustedWeight;

    const distanceFunction = getDistanceFunction(selectedFormula);
    let totalDistance = 0;
    let totalCost = 0;

    demandPoints.forEach(point => {
      const distance = distanceFunction(point.latitude, point.longitude, cogLat, cogLng);
      const weight = point.weight || 1;
      const riskFactor = point.riskFactor || 1;
      const costPerUnit = point.costPerUnit || 10;
      totalDistance += distance;
      totalCost += distance * weight * costPerUnit * riskFactor;
    });

    const maxPossibleCost = totalRiskAdjustedWeight * 1000;
    const efficiencyScore = Math.max(0, 100 - (totalCost / maxPossibleCost) * 100);

    return {
      latitude: cogLat,
      longitude: cogLng,
      totalDistance,
      totalCost,
      efficiencyScore,
      algorithmUsed: `risk-adjusted-cog`
    };
  };

  const calculateRoadNetworkCOG = (): CogCalculationResult => {
    if (demandPoints.length === 0) {
      throw new Error("No demand points provided");
    }

    let totalWeightedScore = 0;
    let weightedLat = 0;
    let weightedLng = 0;

    demandPoints.forEach(point => {
      const weight = point.weight || 1;
      const roadDistance = point.roadDistance;
      const travelTime = point.travelTime;
      const roadQuality = point.roadQuality || 5;
      const congestionFactor = point.congestionFactor || 1;
      
      let effectiveDistance = roadDistance;
      if (!effectiveDistance) {
        effectiveDistance = calculateHaversineDistance(
          point.latitude, point.longitude, 
          demandPoints[0].latitude, demandPoints[0].longitude
        ) * 1.3;
      }
      
      let effectiveTravelTime = travelTime;
      if (!effectiveTravelTime) {
        const avgSpeed = 50;
        effectiveTravelTime = (effectiveDistance / avgSpeed) * 60;
      }
      
      const distanceScore = Math.max(0, 1 - (effectiveDistance / 1000));
      const timeScore = Math.max(0, 1 - (effectiveTravelTime / 480));
      const qualityScore = roadQuality / 10;
      const congestionScore = Math.max(0, 1 - (congestionFactor - 1) / 4);
      
      const roadNetworkScore = weight * (
        0.4 * distanceScore + 
        0.3 * timeScore + 
        0.2 * qualityScore + 
        0.1 * congestionScore
      );
      
      totalWeightedScore += roadNetworkScore;
      weightedLat += point.latitude * roadNetworkScore;
      weightedLng += point.longitude * roadNetworkScore;
    });

    const cogLat = weightedLat / totalWeightedScore;
    const cogLng = weightedLng / totalWeightedScore;

    let totalDistance = 0;
    let totalCost = 0;

    demandPoints.forEach(point => {
      let distance = point.roadDistance;
      if (!distance) {
        distance = calculateHaversineDistance(
          point.latitude, point.longitude, cogLat, cogLng
        ) * 1.3;
      }
      
      const weight = point.weight || 1;
      const costPerUnit = point.costPerUnit || 10;
      totalDistance += distance;
      totalCost += distance * weight * costPerUnit;
    });

    const maxPossibleCost = totalWeightedScore * 100;
    const efficiencyScore = Math.max(0, 100 - (totalCost / maxPossibleCost) * 100);

    return {
      latitude: cogLat,
      longitude: cogLng,
      totalDistance,
      totalCost,
      efficiencyScore,
      algorithmUsed: `road-network-cog`
    };
  };

  const calculateSeasonalCOG = (): CogCalculationResult => {
    if (demandPoints.length === 0) {
      throw new Error("No demand points provided");
    }

    const getCurrentSeason = (): string => {
      const month = new Date().getMonth();
      if (month >= 0 && month <= 2) return 'Q1';
      if (month >= 3 && month <= 5) return 'Q2';
      if (month >= 6 && month <= 8) return 'Q3';
      return 'Q4';
    };

    const currentSeason = getCurrentSeason();
    let totalSeasonalWeight = 0;
    let weightedLat = 0;
    let weightedLng = 0;

    demandPoints.forEach(point => {
      const baseWeight = point.weight || 1;
      const seasonalDemand = point.seasonalDemand || {};
      const peakSeason = point.peakSeason || 'Q2';
      const seasonalVariation = point.seasonalVariation || 1;
      
      let seasonalWeight = baseWeight;
      if (seasonalDemand[currentSeason]) {
        seasonalWeight = seasonalDemand[currentSeason];
      } else if (currentSeason === peakSeason) {
        seasonalWeight = baseWeight * seasonalVariation;
      } else {
        seasonalWeight = baseWeight / seasonalVariation;
      }
      
      totalSeasonalWeight += seasonalWeight;
      weightedLat += point.latitude * seasonalWeight;
      weightedLng += point.longitude * seasonalWeight;
    });

    const cogLat = weightedLat / totalSeasonalWeight;
    const cogLng = weightedLng / totalSeasonalWeight;

    const distanceFunction = getDistanceFunction(selectedFormula);
    let totalDistance = 0;
    let totalCost = 0;

    demandPoints.forEach(point => {
      const distance = distanceFunction(point.latitude, point.longitude, cogLat, cogLng);
      const baseWeight = point.weight || 1;
      const seasonalDemand = point.seasonalDemand || {};
      const seasonalVariation = point.seasonalVariation || 1;
      
      let seasonalWeight = baseWeight;
      if (seasonalDemand[currentSeason]) {
        seasonalWeight = seasonalDemand[currentSeason];
      } else if (currentSeason === point.peakSeason) {
        seasonalWeight = baseWeight * seasonalVariation;
      } else {
        seasonalWeight = baseWeight / seasonalVariation;
      }
      
      const costPerUnit = point.costPerUnit || 10;
      totalDistance += distance;
      totalCost += distance * seasonalWeight * costPerUnit;
    });

    const maxPossibleCost = totalSeasonalWeight * 100;
    const efficiencyScore = Math.max(0, 100 - (totalCost / maxPossibleCost) * 100);

    return {
      latitude: cogLat,
      longitude: cogLng,
      totalDistance,
      totalCost,
      efficiencyScore,
      algorithmUsed: `seasonal-cog`
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
        case 'geometric-median':
          calculationResult = calculateGeometricMedian();
          break;
        case 'economic-center-gravity':
          calculationResult = calculateEconomicCenterOfGravity();
          break;
        case 'multi-criteria-cog':
          calculationResult = calculateMultiCriteriaCOG();
          break;
        case 'risk-adjusted-cog':
          calculationResult = calculateRiskAdjustedCOG();
          break;
        case 'road-network-cog':
          calculationResult = calculateRoadNetworkCOG();
          break;
        case 'seasonal-cog':
          calculationResult = calculateSeasonalCOG();
          break;
        case 'weighted-center-gravity':
        case 'haversine-center-gravity':
        case 'manhattan-center-gravity':
        default:
          // For formulas that need specialized data, fall back to weighted COG
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
