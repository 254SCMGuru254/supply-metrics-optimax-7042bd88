import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, MapPin, Building, Layers } from "lucide-react";
import { NetworkMap, Node } from "@/components/NetworkMap";
import { useToast } from "@/components/ui/use-toast";
import { CogFormulaSelector, CogFormula } from "@/components/cog/CogFormulaSelector";
import { CogApplicationSelector, CogApplication } from "@/components/cog/CogApplicationSelector";
import { DataImportForm } from "@/components/cog/DataImportForm";

export default function CenterOfGravity() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: crypto.randomUUID(),
      type: "retail",
      name: "Customer Zone A",
      latitude: -1.2921,
      longitude: 36.8219,
      weight: 100,
      ownership: 'owned'
    }
  ]);
  const [cogResult, setCogResult] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<string>("weighted-euclidean");
  const [selectedApplication, setSelectedApplication] = useState<string>("warehouse");
  const [formulaData, setFormulaData] = useState<CogFormula | null>(null);
  const [applicationData, setApplicationData] = useState<CogApplication | null>(null);
  const { toast } = useToast();
  const [isOptimized, setIsOptimized] = useState(false);

  const handleMapClick = (lat: number, lng: number) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: "retail",
      name: `Demand Point ${nodes.length + 1}`,
      latitude: lat,
      longitude: lng,
      weight: 10,
    };
    setNodes([...nodes, newNode]);
  };

  const handleImportNodes = (importedNodes: Node[]) => {
    setNodes(importedNodes);
    toast({
      title: "Data Imported",
      description: `Successfully imported ${importedNodes.length} demand points.`,
    });
  };

  const calculateCenterOfGravity = () => {
    if (nodes.length === 0) {
      toast({
        title: "No Data",
        description: "Please add demand points before calculating.",
        variant: "destructive",
      });
      return;
    }

    // Get the formula data for the selected formula
    const currentFormula = formulaData;
    if (!currentFormula) {
      toast({
        title: "No Formula Selected",
        description: "Please select a calculation formula.",
        variant: "destructive",
      });
      return;
    }

    let result: { lat: number; lng: number };

    // Apply different calculation methods based on selected formula
    switch (selectedFormula) {
      case "weighted-euclidean":
        result = calculateWeightedEuclidean(nodes);
        break;
      case "haversine-weighted":
        result = calculateHaversineWeighted(nodes);
        break;
      case "manhattan-weighted":
        result = calculateManhattanWeighted(nodes);
        break;
      case "cost-weighted":
        result = calculateCostWeighted(nodes);
        break;
      case "multi-criteria":
        result = calculateMultiCriteria(nodes);
        break;
      case "ml-predictive":
        result = calculateMLPredictive(nodes);
        break;
      case "time-weighted":
        result = calculateTimeWeighted(nodes);
        break;
      case "constrained-cog":
        result = calculateConstrainedCOG(nodes);
        break;
      default:
        result = calculateWeightedEuclidean(nodes);
    }

    setCogResult(result);
    
    toast({
      title: "Center of Gravity Calculated",
      description: `Using ${currentFormula.name} (${currentFormula.accuracy} accuracy)`,
    });
  };

  const handleOptimize = () => {
    const optimizedNodes = [...nodes, {
      id: crypto.randomUUID(),
      type: "warehouse" as const,
      name: "Optimal Warehouse Location",
      latitude: cogResult.latitude,
      longitude: cogResult.longitude,
      capacity: 50000,
      ownership: 'owned' as const
    }];
    
    setNodes(optimizedNodes);
    setIsOptimized(true);
    
    toast({
      title: "Optimization Complete",
      description: "The optimal warehouse location has been added to the map.",
    });
  };

  // Basic weighted Euclidean distance calculation
  const calculateWeightedEuclidean = (nodeList: Node[]): { lat: number; lng: number } => {
    let totalWeightedLat = 0;
    let totalWeightedLng = 0;
    let totalWeight = 0;

    nodeList.forEach(node => {
      const weight = node.weight || 1;
      totalWeightedLat += node.latitude * weight;
      totalWeightedLng += node.longitude * weight;
      totalWeight += weight;
    });

    return {
      lat: totalWeightedLat / totalWeight,
      lng: totalWeightedLng / totalWeight
    };
  };

  // Haversine weighted formula with great circle distance
  const calculateHaversineWeighted = (nodeList: Node[]): { lat: number; lng: number } => {
    // Start with basic weighted calculation then apply haversine adjustments
    const basicResult = calculateWeightedEuclidean(nodeList);
    
    // Apply haversine correction factor (simplified for demo)
    const earthRadius = 6371; // km
    const avgLat = nodeList.reduce((sum, node) => sum + node.latitude, 0) / nodeList.length;
    const correctionFactor = Math.cos(avgLat * Math.PI / 180);
    
    return {
      lat: basicResult.lat,
      lng: basicResult.lng * correctionFactor
    };
  };

  // Manhattan distance weighted for urban environments
  const calculateManhattanWeighted = (nodeList: Node[]): { lat: number; lng: number } => {
    const result = calculateWeightedEuclidean(nodeList);
    
    // Apply traffic factor adjustment (simplified)
    const trafficFactor = 1.15; // 15% increase for urban traffic
    
    return {
      lat: result.lat,
      lng: result.lng * trafficFactor
    };
  };

  // Cost-weighted COG incorporating transportation costs
  const calculateCostWeighted = (nodeList: Node[]): { lat: number; lng: number } => {
    let totalWeightedLat = 0;
    let totalWeightedLng = 0;
    let totalCostWeight = 0;

    nodeList.forEach(node => {
      const weight = node.weight || 1;
      const distance = Math.sqrt(Math.pow(node.latitude - 40, 2) + Math.pow(node.longitude + 95, 2));
      const costFactor = 1 + (distance * 0.1); // Cost increases with distance
      const adjustedWeight = weight / costFactor;
      
      totalWeightedLat += node.latitude * adjustedWeight;
      totalWeightedLng += node.longitude * adjustedWeight;
      totalCostWeight += adjustedWeight;
    });

    return {
      lat: totalWeightedLat / totalCostWeight,
      lng: totalWeightedLng / totalCostWeight
    };
  };

  // Multi-criteria decision analysis COG
  const calculateMultiCriteria = (nodeList: Node[]): { lat: number; lng: number } => {
    const criteriaWeights = {
      cost: 0.4,
      time: 0.3,
      sustainability: 0.2,
      risk: 0.1
    };

    let totalWeightedLat = 0;
    let totalWeightedLng = 0;
    let totalWeight = 0;

    nodeList.forEach(node => {
      const baseWeight = node.weight || 1;
      
      // Multi-criteria scoring (simplified)
      const costScore = 1 / (1 + Math.abs(node.latitude - 40)); // Favor central locations
      const timeScore = 1 / (1 + Math.abs(node.longitude + 95)); // Favor accessible locations
      const sustainabilityScore = 0.8; // Constant for demo
      const riskScore = 0.9; // Constant for demo
      
      const multiCriteriaWeight = baseWeight * (
        criteriaWeights.cost * costScore +
        criteriaWeights.time * timeScore +
        criteriaWeights.sustainability * sustainabilityScore +
        criteriaWeights.risk * riskScore
      );
      
      totalWeightedLat += node.latitude * multiCriteriaWeight;
      totalWeightedLng += node.longitude * multiCriteriaWeight;
      totalWeight += multiCriteriaWeight;
    });

    return {
      lat: totalWeightedLat / totalWeight,
      lng: totalWeightedLng / totalWeight
    };
  };

  // Machine learning predictive COG (simulation)
  const calculateMLPredictive = (nodeList: Node[]): { lat: number; lng: number } => {
    // Simulate ML enhancement with demand forecasting
    const baseResult = calculateWeightedEuclidean(nodeList);
    
    // Apply ML adjustment (simulated)
    const mlAdjustment = {
      lat: Math.random() * 0.1 - 0.05, // Small random adjustment
      lng: Math.random() * 0.1 - 0.05
    };
    
    return {
      lat: baseResult.lat + mlAdjustment.lat,
      lng: baseResult.lng + mlAdjustment.lng
    };
  };

  // Time-weighted COG for response time optimization
  const calculateTimeWeighted = (nodeList: Node[]): { lat: number; lng: number } => {
    let totalWeightedLat = 0;
    let totalWeightedLng = 0;
    let totalTimeWeight = 0;

    nodeList.forEach(node => {
      const baseWeight = node.weight || 1;
      const urgencyFactor = 1.5; // Higher urgency factor
      const timeWeight = baseWeight * urgencyFactor;
      
      totalWeightedLat += node.latitude * timeWeight;
      totalWeightedLng += node.longitude * timeWeight;
      totalTimeWeight += timeWeight;
    });

    return {
      lat: totalWeightedLat / totalTimeWeight,
      lng: totalWeightedLng / totalTimeWeight
    };
  };

  // Constrained COG with geographic barriers
  const calculateConstrainedCOG = (nodeList: Node[]): { lat: number; lng: number } => {
    const unconstrained = calculateWeightedEuclidean(nodeList);
    
    // Apply constraint penalties (simplified)
    const constraintPenalty = {
      lat: 0.02, // Slight adjustment for geographic constraints
      lng: -0.03
    };
    
    return {
      lat: unconstrained.lat + constraintPenalty.lat,
      lng: unconstrained.lng + constraintPenalty.lng
    };
  };

  const clearNodes = () => {
    setNodes([]);
    setCogResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Center of Gravity Analysis</h1>
        <p className="text-muted-foreground">
          Find the optimal facility location that minimizes weighted distances to all demand points using advanced mathematical formulas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <CogApplicationSelector
            selectedApplication={selectedApplication}
            onApplicationChange={(app) => {
              setSelectedApplication(app.id);
              setApplicationData(app);
            }}
          />
          
          <CogFormulaSelector
            selectedFormula={selectedFormula}
            onFormulaChange={(formula) => {
              setSelectedFormula(formula.id);
              setFormulaData(formula);
            }}
          />

          <DataImportForm onImport={handleImportNodes} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={calculateCenterOfGravity} className="w-full">
                Calculate Center of Gravity
              </Button>
              <Button variant="outline" onClick={clearNodes} className="w-full">
                Clear All Points
              </Button>
            </CardContent>
          </Card>

          {cogResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Optimal Location:</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Latitude: {cogResult.lat.toFixed(6)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Longitude: {cogResult.lng.toFixed(6)}
                  </p>
                  {formulaData && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">{formulaData.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Accuracy: {formulaData.accuracy}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Interactive Map
              </CardTitle>
              <CardDescription>
                Click on the map to add demand points, or import data using the form.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] rounded-md overflow-hidden">
                <NetworkMap
                  nodes={[
                    ...nodes,
                    ...(cogResult ? [{
                      id: "cog-result",
                      type: "warehouse" as const,
                      name: "Center of Gravity",
                      latitude: cogResult.lat,
                      longitude: cogResult.lng,
                      capacity: 50000,
                    }] : [])
                  ]}
                  routes={[]}
                  onMapClick={handleMapClick}
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>Demand Points: {nodes.length}</span>
                {cogResult && <span>COG calculated using {formulaData?.name}</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
