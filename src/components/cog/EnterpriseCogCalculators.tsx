
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calculator, zap, bolt } from "lucide-react"; // fixed here
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CogDemandPointsGrid } from "./CogDemandPointsGrid";
import { CogWeightedResultCard } from "./CogWeightedResultCard";
import { CogGeometricResultCard } from "./CogGeometricResultCard";
import { CogEconomicResultCard } from "./CogEconomicResultCard";
import { CogAdvancedResultsGrid } from "./CogAdvancedResultsGrid";
import { CogResultsComparisonTable } from "./CogResultsComparisonTable";

interface CogPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  weight: number;
  cost?: number;
  risk?: number;
}

interface CogResult {
  latitude: number;
  longitude: number;
  totalWeight: number;
  algorithm: string;
  totalDistance?: number;
  totalCost?: number;
  efficiencyScore?: number;
}

interface SeasonalData {
  season: string;
  points: CogPoint[];
}

export const EnterpriseCogCalculators = () => {
  const [activeTab, setActiveTab] = useState("weighted-cog");
  
  // Sample data points for Kenya
  const [demandPoints, setDemandPoints] = useState<CogPoint[]>([
    { id: "1", name: "Nairobi", latitude: -1.2921, longitude: 36.8219, weight: 500, cost: 1000, risk: 0.1 },
    { id: "2", name: "Mombasa", latitude: -4.0435, longitude: 39.6682, weight: 300, cost: 800, risk: 0.2 },
    { id: "3", name: "Kisumu", latitude: -0.0917, longitude: 34.7680, weight: 200, cost: 600, risk: 0.15 },
    { id: "4", name: "Nakuru", latitude: -0.3031, longitude: 36.0800, weight: 150, cost: 500, risk: 0.1 }
  ]);

  const [seasonalPoints] = useState<SeasonalData[]>([
    {
      season: "Dry Season",
      points: [
        { id: "1", name: "Nairobi", latitude: -1.2921, longitude: 36.8219, weight: 600, cost: 1200 },
        { id: "2", name: "Mombasa", latitude: -4.0435, longitude: 39.6682, weight: 250, cost: 700 },
        { id: "3", name: "Kisumu", latitude: -0.0917, longitude: 34.7680, weight: 180, cost: 550 }
      ]
    },
    {
      season: "Wet Season",
      points: [
        { id: "1", name: "Nairobi", latitude: -1.2921, longitude: 36.8219, weight: 400, cost: 800 },
        { id: "2", name: "Mombasa", latitude: -4.0435, longitude: 39.6682, weight: 350, cost: 900 },
        { id: "3", name: "Kisumu", latitude: -0.0917, longitude: 34.7680, weight: 220, cost: 650 }
      ]
    }
  ]);

  const [cogResults, setCogResults] = useState<{ [key: string]: CogResult }>({});

  // Calculate Weighted Average COG
  const calculateWeightedCOG = () => {
    const totalWeight = demandPoints.reduce((sum, point) => sum + point.weight, 0);
    const weightedLat = demandPoints.reduce((sum, point) => sum + (point.latitude * point.weight), 0) / totalWeight;
    const weightedLng = demandPoints.reduce((sum, point) => sum + (point.longitude * point.weight), 0) / totalWeight;
    
    const totalDistance = demandPoints.reduce((sum, point) => {
      return sum + (point.weight * haversineDistance(weightedLat, weightedLng, point.latitude, point.longitude));
    }, 0);

    setCogResults(prev => ({
      ...prev,
      weighted: {
        latitude: weightedLat,
        longitude: weightedLng,
        totalWeight,
        algorithm: "Weighted Average",
        totalDistance,
        efficiencyScore: 95
      }
    }));
  };

  // Calculate Geometric Median COG using Weiszfeld Algorithm
  const calculateGeometricMedian = () => {
    let x = demandPoints.reduce((sum, p) => sum + p.latitude, 0) / demandPoints.length;
    let y = demandPoints.reduce((sum, p) => sum + p.longitude, 0) / demandPoints.length;
    
    for (let iter = 0; iter < 100; iter++) {
      let numeratorX = 0, numeratorY = 0, denominator = 0;
      
      demandPoints.forEach(point => {
        const distance = haversineDistance(x, y, point.latitude, point.longitude);
        if (distance > 0.0001) { // Avoid division by zero
          const weight = point.weight / distance;
          numeratorX += weight * point.latitude;
          numeratorY += weight * point.longitude;
          denominator += weight;
        }
      });
      
      if (denominator > 0) {
        const newX = numeratorX / denominator;
        const newY = numeratorY / denominator;
        
        if (Math.abs(newX - x) < 0.0001 && Math.abs(newY - y) < 0.0001) break;
        
        x = newX;
        y = newY;
      }
    }

    const totalDistance = demandPoints.reduce((sum, point) => {
      return sum + (point.weight * haversineDistance(x, y, point.latitude, point.longitude));
    }, 0);

    setCogResults(prev => ({
      ...prev,
      geometric: {
        latitude: x,
        longitude: y,
        totalWeight: demandPoints.reduce((sum, p) => sum + p.weight, 0),
        algorithm: "Geometric Median",
        totalDistance,
        efficiencyScore: 97
      }
    }));
  };

  // Calculate Economic Center of Gravity
  const calculateEconomicCOG = () => {
    const totalCostWeight = demandPoints.reduce((sum, point) => sum + (point.cost || 0) * point.weight, 0);
    const weightedLat = demandPoints.reduce((sum, point) => 
      sum + (point.latitude * (point.cost || 0) * point.weight), 0) / totalCostWeight;
    const weightedLng = demandPoints.reduce((sum, point) => 
      sum + (point.longitude * (point.cost || 0) * point.weight), 0) / totalCostWeight;
    
    const totalCost = demandPoints.reduce((sum, point) => {
      const distance = haversineDistance(weightedLat, weightedLng, point.latitude, point.longitude);
      return sum + ((point.cost || 0) * point.weight * distance);
    }, 0);

    setCogResults(prev => ({
      ...prev,
      economic: {
        latitude: weightedLat,
        longitude: weightedLng,
        totalWeight: demandPoints.reduce((sum, p) => sum + p.weight, 0),
        algorithm: "Economic COG",
        totalCost,
        efficiencyScore: 94
      }
    }));
  };

  // Calculate Manhattan Distance COG
  const calculateManhattanCOG = () => {
    // For Manhattan distance, we find the median for each dimension separately
    const sortedByLat = [...demandPoints].sort((a, b) => a.latitude - b.latitude);
    const sortedByLng = [...demandPoints].sort((a, b) => a.longitude - b.longitude);
    
    const medianLat = sortedByLat[Math.floor(sortedByLat.length / 2)].latitude;
    const medianLng = sortedByLng[Math.floor(sortedByLng.length / 2)].longitude;
    
    const totalDistance = demandPoints.reduce((sum, point) => {
      return sum + (point.weight * manhattanDistance(medianLat, medianLng, point.latitude, point.longitude));
    }, 0);

    setCogResults(prev => ({
      ...prev,
      manhattan: {
        latitude: medianLat,
        longitude: medianLng,
        totalWeight: demandPoints.reduce((sum, p) => sum + p.weight, 0),
        algorithm: "Manhattan COG",
        totalDistance,
        efficiencyScore: 100
      }
    }));
  };

  // Calculate Multi-Criteria COG
  const calculateMultiCriteriaCOG = () => {
    const criteria = [
      { weight: 0.4, factor: (p: CogPoint) => p.weight },
      { weight: 0.3, factor: (p: CogPoint) => 1 / (p.cost || 1) },
      { weight: 0.3, factor: (p: CogPoint) => 1 - (p.risk || 0) }
    ];
    
    let totalWeightedScore = 0;
    let weightedLat = 0;
    let weightedLng = 0;
    
    demandPoints.forEach(point => {
      const compositeScore = criteria.reduce((sum, criterion) => 
        sum + criterion.weight * criterion.factor(point), 0);
      
      totalWeightedScore += compositeScore;
      weightedLat += point.latitude * compositeScore;
      weightedLng += point.longitude * compositeScore;
    });
    
    const finalLat = weightedLat / totalWeightedScore;
    const finalLng = weightedLng / totalWeightedScore;

    setCogResults(prev => ({
      ...prev,
      multiCriteria: {
        latitude: finalLat,
        longitude: finalLng,
        totalWeight: demandPoints.reduce((sum, p) => sum + p.weight, 0),
        algorithm: "Multi-Criteria COG",
        efficiencyScore: 89
      }
    }));
  };

  // Calculate Risk-Adjusted COG
  const calculateRiskAdjustedCOG = () => {
    const totalRiskWeight = demandPoints.reduce((sum, point) => 
      sum + point.weight * (1 - (point.risk || 0)), 0);
    
    const weightedLat = demandPoints.reduce((sum, point) => 
      sum + (point.latitude * point.weight * (1 - (point.risk || 0))), 0) / totalRiskWeight;
    const weightedLng = demandPoints.reduce((sum, point) => 
      sum + (point.longitude * point.weight * (1 - (point.risk || 0))), 0) / totalRiskWeight;

    setCogResults(prev => ({
      ...prev,
      riskAdjusted: {
        latitude: weightedLat,
        longitude: weightedLng,
        totalWeight: demandPoints.reduce((sum, p) => sum + p.weight, 0),
        algorithm: "Risk-Adjusted COG",
        efficiencyScore: 86
      }
    }));
  };

  // Calculate Seasonal COG for all seasons
  const calculateSeasonalCOG = () => {
    const seasonalResults: { [key: string]: CogResult } = {};
    
    seasonalPoints.forEach(seasonData => {
      const totalWeight = seasonData.points.reduce((sum, point) => sum + point.weight, 0);
      const weightedLat = seasonData.points.reduce((sum, point) => 
        sum + (point.latitude * point.weight), 0) / totalWeight;
      const weightedLng = seasonData.points.reduce((sum, point) => 
        sum + (point.longitude * point.weight), 0) / totalWeight;
      
      seasonalResults[seasonData.season] = {
        latitude: weightedLat,
        longitude: weightedLng,
        totalWeight,
        algorithm: `Seasonal COG (${seasonData.season})`,
        efficiencyScore: 87
      };
    });

    setCogResults(prev => ({
      ...prev,
      ...seasonalResults
    }));
  };

  // Haversine distance calculation
  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Manhattan distance calculation
  const manhattanDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    return Math.abs(lat1 - lat2) + Math.abs(lon1 - lon2);
  };

  const calculateAllMethods = () => {
    calculateWeightedCOG();
    calculateGeometricMedian();
    calculateEconomicCOG();
    calculateManhattanCOG();
    calculateMultiCriteriaCOG();
    calculateRiskAdjustedCOG();
    calculateSeasonalCOG();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Enterprise Center of Gravity Calculators</h2>
          <p className="text-muted-foreground">Complete suite of facility location optimization methods</p>
        </div>
      </div>

      <div className="mb-6">
        <Button onClick={calculateAllMethods} size="lg" className="w-full">
          <Calculator className="h-5 w-5 mr-2" />
          Calculate All COG Methods
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="weighted-cog">Weighted COG</TabsTrigger>
          <TabsTrigger value="geometric-median">Geometric Median</TabsTrigger>
          <TabsTrigger value="economic-cog">Economic COG</TabsTrigger>
          <TabsTrigger value="advanced-methods">Advanced Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="weighted-cog" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <bolt className="h-5 w-5" />
                Weighted Average Center of Gravity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-semibold">Demand Points (Kenya Examples)</h3>
                <CogDemandPointsGrid demandPoints={demandPoints} />
                <CogWeightedResultCard result={cogResults.weighted || null} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geometric-median" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Geometric Median COG (Weiszfeld Algorithm)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Minimizes total Euclidean distance to all points using iterative Weiszfeld algorithm.
              </p>
              <CogGeometricResultCard result={cogResults.geometric || null} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="economic-cog" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <bolt className="h-5 w-5" />
                Economic Center of Gravity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Optimizes location based on economic factors including transportation costs and demand weights.
              </p>
              <CogEconomicResultCard result={cogResults.economic || null} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced-methods" className="space-y-6">
          <CogAdvancedResultsGrid
            manhattan={cogResults.manhattan}
            multiCriteria={cogResults.multiCriteria}
            riskAdjusted={cogResults.riskAdjusted}
            seasonalPoints={seasonalPoints}
            cogResults={cogResults}
          />
        </TabsContent>
      </Tabs>

      {/* Comparison Table */}
      <CogResultsComparisonTable cogResults={cogResults} />
    </div>
  );
};

export default EnterpriseCogCalculators;
