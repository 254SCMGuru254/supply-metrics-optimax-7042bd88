
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// Types for territory division
type TerritoryDivisionMethod = 'voronoi' | 'kmeans' | 'hierarchical';
type BalanceFactor = 'equal' | 'demand' | 'distance' | 'custom';

// Utility functions for Isohedron analysis
const createInitialDemandPoints = (facilityNodes: Node[]): Node[] => {
  // For demo purposes, we'll generate random demand points around each facility
  const demandPoints: Node[] = [];
  
  facilityNodes.forEach(facility => {
    // Generate 3-6 demand points around each facility
    const numPoints = Math.floor(Math.random() * 4) + 3;
    
    for (let i = 0; i < numPoints; i++) {
      // Random offset within approximately 100-300 km
      const latOffset = (Math.random() * 2 - 1) * 3;
      const lngOffset = (Math.random() * 2 - 1) * 3;
      
      demandPoints.push({
        id: crypto.randomUUID(),
        type: "retail",
        name: `Demand ${demandPoints.length + 1}`,
        latitude: facility.latitude + latOffset,
        longitude: facility.longitude + lngOffset,
        weight: Math.floor(Math.random() * 90) + 10,
      });
    }
  });
  
  return demandPoints;
};

// Assign demand points to closest facility (Voronoi partition)
const assignToClosestFacility = (
  facilities: Node[], 
  demandPoints: Node[]
): Record<string, string[]> => {
  const assignments: Record<string, string[]> = {};
  
  // Initialize assignments object
  facilities.forEach(facility => {
    assignments[facility.id] = [];
  });
  
  // Assign each demand point to closest facility
  demandPoints.forEach(point => {
    let closestFacility = facilities[0];
    let minDistance = Number.MAX_VALUE;
    
    facilities.forEach(facility => {
      const distance = Math.sqrt(
        Math.pow(point.latitude - facility.latitude, 2) + 
        Math.pow(point.longitude - facility.longitude, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestFacility = facility;
      }
    });
    
    assignments[closestFacility.id].push(point.id);
  });
  
  return assignments;
};

// K-means clustering
const kMeansClustering = (
  facilities: Node[],
  demandPoints: Node[]
): Record<string, string[]> => {
  const k = facilities.length;
  const assignments: Record<string, string[]> = {};
  
  // Initialize with random assignments
  facilities.forEach(facility => {
    assignments[facility.id] = [];
  });
  
  // Simple simulation of k-means result
  // In a real implementation this would run multiple iterations
  demandPoints.forEach(point => {
    const facilityIndex = Math.floor(Math.random() * k);
    assignments[facilities[facilityIndex].id].push(point.id);
  });
  
  return assignments;
};

// Hierarchical clustering
const hierarchicalClustering = (
  facilities: Node[],
  demandPoints: Node[]
): Record<string, string[]> => {
  // This is a simplified mock of hierarchical clustering
  const assignments: Record<string, string[]> = {};
  
  facilities.forEach(facility => {
    assignments[facility.id] = [];
  });
  
  // Distribution that tends to group nearby points
  // (More sophisticated algorithm would be needed for actual hierarchical clustering)
  demandPoints.forEach(point => {
    let bestFacility = facilities[0];
    let highestScore = -Infinity;
    
    facilities.forEach(facility => {
      // Combination of distance and some randomness for demo
      const distance = Math.sqrt(
        Math.pow(point.latitude - facility.latitude, 2) + 
        Math.pow(point.longitude - facility.longitude, 2)
      );
      
      const score = -distance + Math.random() * 2;
      
      if (score > highestScore) {
        highestScore = score;
        bestFacility = facility;
      }
    });
    
    assignments[bestFacility.id].push(point.id);
  });
  
  return assignments;
};

// Create routes based on assignments
const createAssignmentRoutes = (
  assignments: Record<string, string[]>,
  nodes: Node[]
): Route[] => {
  const routes: Route[] = [];
  
  // Create a route from each facility to its assigned demand points
  Object.entries(assignments).forEach(([facilityId, demandPointIds]) => {
    demandPointIds.forEach(demandId => {
      routes.push({
        id: crypto.randomUUID(),
        from: facilityId,
        to: demandId,
        volume: nodes.find(n => n.id === demandId)?.weight || 10,
        isOptimized: true,
      });
    });
  });
  
  return routes;
};

// Calculate balance metrics
const calculateBalanceMetrics = (
  assignments: Record<string, string[]>,
  nodes: Node[]
): {
  balanceScore: number,
  avgPointsPerTerritory: number,
  maxPoints: number,
  minPoints: number,
  stdDev: number
} => {
  const pointCounts = Object.values(assignments).map(points => points.length);
  const totalPoints = pointCounts.reduce((sum, count) => sum + count, 0);
  const avgPoints = totalPoints / Math.max(1, pointCounts.length);
  
  const maxPoints = Math.max(...pointCounts, 0);
  const minPoints = Math.min(...pointCounts, 0);
  
  // Calculate standard deviation
  const squaredDiffs = pointCounts.map(count => Math.pow(count - avgPoints, 2));
  const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / Math.max(1, pointCounts.length);
  const stdDev = Math.sqrt(avgSquaredDiff);
  
  // Calculate balance score (higher is better)
  // Score approaches 100 when territories are perfectly balanced
  const balanceScore = Math.max(0, 100 - (stdDev / avgPoints) * 100);
  
  return {
    balanceScore,
    avgPointsPerTerritory: avgPoints,
    maxPoints,
    minPoints,
    stdDev
  };
};

const Isohedron = () => {
  const [facilityNodes, setFacilityNodes] = useState<Node[]>([]);
  const [demandNodes, setDemandNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [divisionMethod, setDivisionMethod] = useState<TerritoryDivisionMethod>('voronoi');
  const [balanceFactor, setBalanceFactor] = useState<BalanceFactor>('equal');
  const [balanceWeight, setBalanceWeight] = useState<number>(50);
  const [balanceMetrics, setBalanceMetrics] = useState<{
    balanceScore: number,
    avgPointsPerTerritory: number,
    maxPoints: number,
    minPoints: number,
    stdDev: number
  } | null>(null);
  const { toast } = useToast();
  
  // All nodes (facilities + demand points)
  const allNodes = [...facilityNodes, ...demandNodes];

  const handleMapClick = (lat: number, lng: number) => {
    if (isOptimized) return;
    
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: "warehouse",
      name: `Facility ${facilityNodes.length + 1}`,
      latitude: lat,
      longitude: lng,
      capacity: 1000,
    };

    const updatedFacilities = [...facilityNodes, newNode];
    setFacilityNodes(updatedFacilities);
    
    // Generate demand points around the new facility
    if (facilityNodes.length === 0) {
      // Only generate demand points for first facility to avoid too many points
      const newDemandPoints = createInitialDemandPoints([newNode]);
      setDemandNodes([...demandNodes, ...newDemandPoints]);
    }
    
    toast({
      title: "Facility Added",
      description: `Added ${newNode.name} at [${lat.toFixed(4)}, ${lng.toFixed(4)}]`,
    });
  };

  const handleNodeClick = (node: Node) => {
    const nodeType = node.type === "warehouse" ? "Facility" : "Demand Point";
    toast({
      title: `${nodeType} Selected`,
      description: `Selected ${node.name}${node.weight ? ` with weight ${node.weight}` : ""}`,
    });
  };

  const runTerritoryDivision = () => {
    if (facilityNodes.length < 2) {
      toast({
        title: "Not Enough Facilities",
        description: "Add at least two facility nodes to run territory division",
        variant: "destructive"
      });
      return;
    }
    
    if (demandNodes.length === 0) {
      // Generate demand points for all facilities
      const newDemandPoints = createInitialDemandPoints(facilityNodes);
      setDemandNodes(newDemandPoints);
    }
    
    // Run territory division based on selected method
    let assignments: Record<string, string[]>;
    
    switch (divisionMethod) {
      case 'kmeans':
        assignments = kMeansClustering(facilityNodes, demandNodes);
        break;
      case 'hierarchical':
        assignments = hierarchicalClustering(facilityNodes, demandNodes);
        break;
      case 'voronoi':
      default:
        assignments = assignToClosestFacility(facilityNodes, demandNodes);
        break;
    }
    
    // Create routes based on assignments
    const newRoutes = createAssignmentRoutes(assignments, [...facilityNodes, ...demandNodes]);
    
    // Calculate balance metrics
    const metrics = calculateBalanceMetrics(assignments, [...facilityNodes, ...demandNodes]);
    
    // Update state
    setRoutes(newRoutes);
    setIsOptimized(true);
    setBalanceMetrics(metrics);
    
    toast({
      title: "Territory Division Complete",
      description: `Assigned demand points to facilities using ${divisionMethod} method.`,
    });
  };

  const handleReset = () => {
    setIsOptimized(false);
    setRoutes([]);
    setBalanceMetrics(null);
  };

  const generateDemandPoints = () => {
    if (facilityNodes.length === 0) {
      toast({
        title: "No Facilities",
        description: "Add at least one facility node to generate demand points",
        variant: "destructive"
      });
      return;
    }
    
    const newDemandPoints = createInitialDemandPoints(facilityNodes);
    setDemandNodes([...demandNodes, ...newDemandPoints]);
    
    toast({
      title: "Demand Points Generated",
      description: `Added ${newDemandPoints.length} random demand points around facilities.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Isohedron Territory Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Divide regions into balanced territories based on geographic and demand data.
          </p>
        </div>
        <div className="space-x-2">
          {!isOptimized && (
            <Button variant="outline" onClick={generateDemandPoints}>
              Generate Demand Points
            </Button>
          )}
          {isOptimized ? (
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          ) : (
            <Button onClick={runTerritoryDivision} disabled={facilityNodes.length < 2}>
              Run Territory Division
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-4">
          <NetworkMap
            nodes={allNodes}
            routes={routes}
            onNodeClick={handleNodeClick}
            onMapClick={handleMapClick}
            isOptimized={isOptimized}
          />
        </Card>

        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Network Metrics</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Facilities</p>
                <p className="text-2xl font-semibold">{facilityNodes.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Demand Points</p>
                <p className="text-2xl font-semibold">{demandNodes.length}</p>
              </div>
              {isOptimized && balanceMetrics && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Balance Score</p>
                    <p className="text-2xl font-semibold text-primary">{balanceMetrics.balanceScore.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Points per Territory</p>
                    <p className="text-lg font-medium">Avg: {balanceMetrics.avgPointsPerTerritory.toFixed(1)}</p>
                    <p className="text-lg font-medium">Min: {balanceMetrics.minPoints} | Max: {balanceMetrics.maxPoints}</p>
                  </div>
                </>
              )}
            </div>
          </Card>

          {!isOptimized && (
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Division Settings</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Division Method</Label>
                  <RadioGroup 
                    value={divisionMethod} 
                    onValueChange={(value) => setDivisionMethod(value as TerritoryDivisionMethod)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="voronoi" id="voronoi" />
                      <Label htmlFor="voronoi">Voronoi Tessellation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="kmeans" id="kmeans" />
                      <Label htmlFor="kmeans">K-Means Clustering</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hierarchical" id="hierarchical" />
                      <Label htmlFor="hierarchical">Hierarchical Clustering</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Balance Factor</Label>
                  <RadioGroup 
                    value={balanceFactor} 
                    onValueChange={(value) => setBalanceFactor(value as BalanceFactor)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="equal" id="equal" />
                      <Label htmlFor="equal">Equal Size Territories</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="demand" id="demand" />
                      <Label htmlFor="demand">Balanced Demand Weight</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="distance" id="distance" />
                      <Label htmlFor="distance">Minimize Distances</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="balance-weight">Balance Weight: {balanceWeight}%</Label>
                  </div>
                  <Slider
                    id="balance-weight"
                    min={0}
                    max={100}
                    step={5}
                    value={[balanceWeight]}
                    onValueChange={(vals) => setBalanceWeight(vals[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher values prioritize balanced territories over proximity
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">How to Use</h2>
        <div className="space-y-2">
          <p>1. Click on the map to add facility locations</p>
          <p>2. Use "Generate Demand Points" to add random demand around facilities</p>
          <p>3. Select your division method and balance preferences</p>
          <p>4. Click "Run Territory Division" to assign territories</p>
          <p>5. Review the balance metrics to evaluate your territory design</p>
        </div>
      </Card>
    </div>
  );
};

export default Isohedron;
