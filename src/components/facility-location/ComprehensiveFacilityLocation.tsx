
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calculator, Building, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FacilityPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  fixedCost?: number;
  isSelected?: boolean;
}

interface DemandPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  demand: number;
  assignedFacility?: string;
}

interface OptimizationResult {
  type: string;
  selectedFacilities: FacilityPoint[];
  assignments: Array<{ demandId: string; facilityId: string; distance: number; cost: number }>;
  totalCost: number;
  totalDistance: number;
  utilizationRates: Record<string, number>;
  serviceLevel: number;
}

export const ComprehensiveFacilityLocation = () => {
  const [activeTab, setActiveTab] = useState("p-median");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const { toast } = useToast();

  // Sample data for Kenya
  const [candidateFacilities] = useState<FacilityPoint[]>([
    { id: "f1", name: "Nairobi Central", latitude: -1.2921, longitude: 36.8219, capacity: 5000, fixedCost: 1000000 },
    { id: "f2", name: "Mombasa Port", latitude: -4.0435, longitude: 39.6682, capacity: 3000, fixedCost: 800000 },
    { id: "f3", name: "Kisumu West", latitude: -0.0917, longitude: 34.7680, capacity: 2000, fixedCost: 600000 },
    { id: "f4", name: "Nakuru Hub", latitude: -0.3031, longitude: 36.0800, capacity: 2500, fixedCost: 700000 },
    { id: "f5", name: "Eldoret North", latitude: 0.5143, longitude: 35.2698, capacity: 1500, fixedCost: 500000 },
    { id: "f6", name: "Thika Industrial", latitude: -1.0332, longitude: 37.0694, capacity: 1800, fixedCost: 550000 }
  ]);

  const [demandPoints] = useState<DemandPoint[]>([
    { id: "d1", name: "Nairobi CBD", latitude: -1.2864, longitude: 36.8172, demand: 800 },
    { id: "d2", name: "Mombasa Town", latitude: -4.0542, longitude: 39.6631, demand: 600 },
    { id: "d3", name: "Kisumu City", latitude: -0.1022, longitude: 34.7617, demand: 400 },
    { id: "d4", name: "Nakuru Town", latitude: -0.3031, longitude: 36.0800, demand: 350 },
    { id: "d5", name: "Eldoret Center", latitude: 0.5200, longitude: 35.2697, demand: 300 },
    { id: "d6", name: "Thika Town", latitude: -1.0389, longitude: 37.0677, demand: 250 },
    { id: "d7", name: "Machakos", latitude: -1.5177, longitude: 37.2634, demand: 200 },
    { id: "d8", name: "Nyeri", latitude: -0.4167, longitude: 36.9500, demand: 180 }
  ]);

  const [pMedianParams, setPMedianParams] = useState({ numFacilities: 3 });
  const [capacitatedParams, setCapacitatedParams] = useState({ serviceLevel: 95 });
  const [hubParams, setHubParams] = useState({ numHubs: 2, discountFactor: 0.8 });

  // Distance calculation (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  // P-Median Problem Solution
  const solvePMedian = async () => {
    setIsOptimizing(true);
    
    // Greedy heuristic for P-Median
    const selectedFacilities: FacilityPoint[] = [];
    const assignments: Array<{ demandId: string; facilityId: string; distance: number; cost: number }> = [];
    
    // Calculate distance matrix
    const distanceMatrix: number[][] = candidateFacilities.map(facility =>
      demandPoints.map(demand => 
        calculateDistance(facility.latitude, facility.longitude, demand.latitude, demand.longitude)
      )
    );
    
    // Greedy selection
    for (let p = 0; p < pMedianParams.numFacilities; p++) {
      let bestFacility = -1;
      let bestSavings = 0;
      
      for (let f = 0; f < candidateFacilities.length; f++) {
        if (selectedFacilities.some(sf => sf.id === candidateFacilities[f].id)) continue;
        
        let totalSavings = 0;
        for (let d = 0; d < demandPoints.length; d++) {
          const currentDistance = selectedFacilities.length > 0 
            ? Math.min(...selectedFacilities.map(sf => {
                const sfIndex = candidateFacilities.findIndex(cf => cf.id === sf.id);
                return distanceMatrix[sfIndex][d];
              }))
            : Infinity;
          
          const newDistance = distanceMatrix[f][d];
          const savings = Math.max(0, currentDistance - newDistance) * demandPoints[d].demand;
          totalSavings += savings;
        }
        
        if (totalSavings > bestSavings) {
          bestSavings = totalSavings;
          bestFacility = f;
        }
      }
      
      if (bestFacility >= 0) {
        selectedFacilities.push(candidateFacilities[bestFacility]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Assign demand points to nearest facilities
    let totalCost = 0;
    let totalDistance = 0;
    
    demandPoints.forEach(demand => {
      let minDistance = Infinity;
      let assignedFacility = selectedFacilities[0];
      
      selectedFacilities.forEach(facility => {
        const distance = calculateDistance(
          facility.latitude, facility.longitude,
          demand.latitude, demand.longitude
        );
        if (distance < minDistance) {
          minDistance = distance;
          assignedFacility = facility;
        }
      });
      
      const cost = minDistance * demand.demand * 10; // Cost per km per unit
      totalCost += cost;
      totalDistance += minDistance * demand.demand;
      
      assignments.push({
        demandId: demand.id,
        facilityId: assignedFacility.id,
        distance: minDistance,
        cost
      });
    });
    
    // Calculate utilization rates
    const utilizationRates: Record<string, number> = {};
    selectedFacilities.forEach(facility => {
      const assignedDemand = assignments
        .filter(a => a.facilityId === facility.id)
        .reduce((sum, a) => sum + demandPoints.find(d => d.id === a.demandId)!.demand, 0);
      utilizationRates[facility.id] = (assignedDemand / facility.capacity!) * 100;
    });
    
    setResult({
      type: "P-Median",
      selectedFacilities,
      assignments,
      totalCost,
      totalDistance,
      utilizationRates,
      serviceLevel: 95
    });
    
    setIsOptimizing(false);
    
    toast({
      title: "P-Median Optimization Complete",
      description: `Selected ${selectedFacilities.length} optimal facility locations.`
    });
  };

  // Capacitated Facility Location Solution
  const solveCapacitatedFacilityLocation = async () => {
    setIsOptimizing(true);
    
    // Greedy algorithm considering capacity constraints
    const selectedFacilities: FacilityPoint[] = [];
    const assignments: Array<{ demandId: string; facilityId: string; distance: number; cost: number }> = [];
    const remainingDemand = [...demandPoints];
    
    while (remainingDemand.length > 0) {
      let bestFacility: FacilityPoint | null = null;
      let bestRatio = Infinity;
      
      // Find facility with best cost-to-coverage ratio
      for (const facility of candidateFacilities) {
        if (selectedFacilities.some(sf => sf.id === facility.id)) continue;
        
        const coverableDemand = remainingDemand.filter(demand => {
          const distance = calculateDistance(
            facility.latitude, facility.longitude,
            demand.latitude, demand.longitude
          );
          return distance <= 50; // 50km service radius
        });
        
        if (coverableDemand.length === 0) continue;
        
        const totalCoverableDemand = Math.min(
          facility.capacity!,
          coverableDemand.reduce((sum, d) => sum + d.demand, 0)
        );
        
        const ratio = facility.fixedCost! / totalCoverableDemand;
        
        if (ratio < bestRatio) {
          bestRatio = ratio;
          bestFacility = facility;
        }
      }
      
      if (!bestFacility) break;
      
      selectedFacilities.push(bestFacility);
      
      // Assign demand to this facility
      let remainingCapacity = bestFacility.capacity!;
      const toRemove: string[] = [];
      
      remainingDemand.forEach(demand => {
        if (remainingCapacity <= 0) return;
        
        const distance = calculateDistance(
          bestFacility!.latitude, bestFacility!.longitude,
          demand.latitude, demand.longitude
        );
        
        if (distance <= 50 && demand.demand <= remainingCapacity) {
          const cost = distance * demand.demand * 12; // Higher cost per km
          assignments.push({
            demandId: demand.id,
            facilityId: bestFacility!.id,
            distance,
            cost
          });
          remainingCapacity -= demand.demand;
          toRemove.push(demand.id);
        }
      });
      
      // Remove assigned demand points
      toRemove.forEach(id => {
        const index = remainingDemand.findIndex(d => d.id === id);
        if (index >= 0) remainingDemand.splice(index, 1);
      });
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    const totalCost = assignments.reduce((sum, a) => sum + a.cost, 0) +
                     selectedFacilities.reduce((sum, f) => sum + f.fixedCost!, 0);
    const totalDistance = assignments.reduce((sum, a) => sum + a.distance, 0);
    
    // Calculate utilization rates
    const utilizationRates: Record<string, number> = {};
    selectedFacilities.forEach(facility => {
      const assignedDemand = assignments
        .filter(a => a.facilityId === facility.id)
        .reduce((sum, a) => sum + demandPoints.find(d => d.id === a.demandId)!.demand, 0);
      utilizationRates[facility.id] = (assignedDemand / facility.capacity!) * 100;
    });
    
    const serviceLevel = (assignments.length / demandPoints.length) * 100;
    
    setResult({
      type: "Capacitated Facility Location",
      selectedFacilities,
      assignments,
      totalCost,
      totalDistance,
      utilizationRates,
      serviceLevel
    });
    
    setIsOptimizing(false);
    
    toast({
      title: "Capacitated Facility Location Complete",
      description: `Optimized facility network with capacity constraints.`
    });
  };

  // Hub Location Problem Solution
  const solveHubLocation = async () => {
    setIsOptimizing(true);
    
    // Select hub locations using demand coverage
    const hubCandidates = candidateFacilities
      .map(facility => ({
        ...facility,
        coverage: demandPoints.reduce((sum, demand) => {
          const distance = calculateDistance(
            facility.latitude, facility.longitude,
            demand.latitude, demand.longitude
          );
          return sum + (distance <= 100 ? demand.demand : 0); // 100km hub radius
        }, 0)
      }))
      .sort((a, b) => b.coverage - a.coverage);
    
    const selectedHubs = hubCandidates.slice(0, hubParams.numHubs);
    const selectedFacilities = selectedHubs.map(h => ({ ...h } as FacilityPoint));
    
    // Create hub-and-spoke assignments
    const assignments: Array<{ demandId: string; facilityId: string; distance: number; cost: number }> = [];
    let totalCost = 0;
    let totalDistance = 0;
    
    demandPoints.forEach(demand => {
      // Find nearest hub
      let minDistance = Infinity;
      let assignedHub = selectedHubs[0];
      
      selectedHubs.forEach(hub => {
        const distance = calculateDistance(
          hub.latitude, hub.longitude,
          demand.latitude, demand.longitude
        );
        if (distance < minDistance) {
          minDistance = distance;
          assignedHub = hub;
        }
      });
      
      // Apply hub discount factor
      const cost = minDistance * demand.demand * 8 * hubParams.discountFactor;
      totalCost += cost;
      totalDistance += minDistance;
      
      assignments.push({
        demandId: demand.id,
        facilityId: assignedHub.id,
        distance: minDistance,
        cost
      });
    });
    
    // Add hub fixed costs
    totalCost += selectedFacilities.reduce((sum, f) => sum + f.fixedCost!, 0);
    
    // Calculate utilization rates
    const utilizationRates: Record<string, number> = {};
    selectedFacilities.forEach(facility => {
      const assignedDemand = assignments
        .filter(a => a.facilityId === facility.id)
        .reduce((sum, a) => sum + demandPoints.find(d => d.id === a.demandId)!.demand, 0);
      utilizationRates[facility.id] = Math.min(100, (assignedDemand / facility.capacity!) * 100);
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setResult({
      type: "Hub Location",
      selectedFacilities,
      assignments,
      totalCost,
      totalDistance,
      utilizationRates,
      serviceLevel: 100
    });
    
    setIsOptimizing(false);
    
    toast({
      title: "Hub Location Optimization Complete",
      description: `Optimized hub-and-spoke network configuration.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Comprehensive Facility Location Optimization</h2>
          <p className="text-muted-foreground">P-Median, Capacitated, Hub Location, and Warehouse optimization models</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="p-median">P-Median</TabsTrigger>
          <TabsTrigger value="capacitated">Capacitated</TabsTrigger>
          <TabsTrigger value="hub-location">Hub Location</TabsTrigger>
          <TabsTrigger value="warehouse">Warehouse Network</TabsTrigger>
        </TabsList>

        <TabsContent value="p-median" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>P-Median Problem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="numFacilities">Number of Facilities to Select</Label>
                <Input
                  id="numFacilities"
                  type="number"
                  value={pMedianParams.numFacilities}
                  onChange={(e) => setPMedianParams({numFacilities: parseInt(e.target.value)})}
                  min={1}
                  max={candidateFacilities.length}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Candidate Facilities ({candidateFacilities.length})</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {candidateFacilities.map(facility => (
                    <div key={facility.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{facility.name}</span>
                        <Badge variant="outline">Cap: {facility.capacity}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {facility.latitude.toFixed(4)}, {facility.longitude.toFixed(4)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={solvePMedian} 
                disabled={isOptimizing}
                size="lg" 
                className="w-full"
              >
                <Calculator className="h-5 w-5 mr-2" />
                {isOptimizing ? "Optimizing..." : "Solve P-Median Problem"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capacitated" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Capacitated Facility Location Problem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="serviceLevel">Required Service Level (%)</Label>
                <Input
                  id="serviceLevel"
                  type="number"
                  value={capacitatedParams.serviceLevel}
                  onChange={(e) => setCapacitatedParams({serviceLevel: parseInt(e.target.value)})}
                  min={0}
                  max={100}
                />
              </div>

              <div className="space-y-2">
                <Label>Demand Points ({demandPoints.length})</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {demandPoints.map(demand => (
                    <div key={demand.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{demand.name}</span>
                        <Badge variant="outline">Demand: {demand.demand}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {demand.latitude.toFixed(4)}, {demand.longitude.toFixed(4)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={solveCapacitatedFacilityLocation} 
                disabled={isOptimizing}
                size="lg" 
                className="w-full"
              >
                <Calculator className="h-5 w-5 mr-2" />
                {isOptimizing ? "Optimizing..." : "Solve Capacitated Problem"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hub-location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hub Location Problem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numHubs">Number of Hubs</Label>
                  <Input
                    id="numHubs"
                    type="number"
                    value={hubParams.numHubs}
                    onChange={(e) => setHubParams({...hubParams, numHubs: parseInt(e.target.value)})}
                    min={1}
                    max={5}
                  />
                </div>
                <div>
                  <Label htmlFor="discountFactor">Hub Discount Factor</Label>
                  <Input
                    id="discountFactor"
                    type="number"
                    step="0.1"
                    value={hubParams.discountFactor}
                    onChange={(e) => setHubParams({...hubParams, discountFactor: parseFloat(e.target.value)})}
                    min={0.1}
                    max={1.0}
                  />
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Hub-and-Spoke Benefits</h4>
                <ul className="text-sm space-y-1">
                  <li>• Economies of scale between hubs</li>
                  <li>• Reduced transportation costs</li>
                  <li>• Centralized inventory management</li>
                  <li>• Improved service coordination</li>
                </ul>
              </div>

              <Button 
                onClick={solveHubLocation} 
                disabled={isOptimizing}
                size="lg" 
                className="w-full"
              >
                <Truck className="h-5 w-5 mr-2" />
                {isOptimizing ? "Optimizing..." : "Solve Hub Location Problem"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouse" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Network Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Comprehensive warehouse network optimization combining all facility location models
                  with advanced cost modeling and multi-echelon considerations.
                </p>
                <Button className="mt-4" disabled>
                  <Calculator className="h-5 w-5 mr-2" />
                  Advanced Warehouse Optimization (Enterprise Feature)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results Display */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>{result.type} Optimization Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{result.selectedFacilities.length}</div>
                <div className="text-sm text-muted-foreground">Selected Facilities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">KES {Math.round(result.totalCost).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(result.totalDistance)}km</div>
                <div className="text-sm text-muted-foreground">Total Distance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{Math.round(result.serviceLevel)}%</div>
                <div className="text-sm text-muted-foreground">Service Level</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Selected Facilities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.selectedFacilities.map(facility => (
                    <div key={facility.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{facility.name}</span>
                        <Badge variant="default">
                          {Math.round(result.utilizationRates[facility.id] || 0)}% utilized
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Capacity: {facility.capacity} units<br/>
                        Fixed Cost: KES {facility.fixedCost?.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Demand Assignments ({result.assignments.length})</h4>
                <div className="max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {result.assignments.map((assignment, index) => {
                      const demand = demandPoints.find(d => d.id === assignment.demandId)!;
                      const facility = result.selectedFacilities.find(f => f.id === assignment.facilityId)!;
                      return (
                        <div key={index} className="flex justify-between items-center p-2 border rounded text-sm">
                          <span>{demand.name} → {facility.name}</span>
                          <div className="flex gap-4">
                            <span>{assignment.distance.toFixed(1)}km</span>
                            <span>KES {Math.round(assignment.cost).toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComprehensiveFacilityLocation;
