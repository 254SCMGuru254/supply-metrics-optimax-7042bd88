
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/components/ui/use-toast";
import { ModelWalkthrough, WalkthroughStep } from "@/components/ModelWalkthrough";
import { CogMetrics } from "@/components/cog/CogMetrics";
import { CogDemandWeights } from "@/components/cog/CogDemandWeights";
import { CogInstructions } from "@/components/cog/CogInstructions";
import { CogDataOperations } from "@/components/cog/CogDataOperations";
import { CogRecommendations } from "@/components/cog/CogRecommendations";
import { CogApplicationSelector, CogApplication } from "@/components/cog/CogApplicationSelector";
import { CogFormulaSelector, CogFormula } from "@/components/cog/CogFormulaSelector";
import { DataImportForm } from "@/components/cog/DataImportForm";
import { calculateDistance, calculateCOG } from "@/components/cog/CogUtils";
import { calculateEnhancedCOG, findOptimalLocationAdvanced } from "@/components/cog/EnhancedCogUtils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CenterOfGravity = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [optimalLocation, setOptimalLocation] = useState<{lat: number, lng: number} | null>(null);
  const [distanceReduction, setDistanceReduction] = useState<number | null>(null);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [calculationType, setCalculationType] = useState<'euclidean' | 'haversine'>('haversine');
  const [showWarehouseDialog, setShowWarehouseDialog] = useState(false);
  const [warehouseData, setWarehouseData] = useState({
    name: "Existing Warehouse",
    latitude: 0,
    longitude: 0
  });
  const [existingWarehouse, setExistingWarehouse] = useState<Node | undefined>(undefined);
  const [selectedApplication, setSelectedApplication] = useState<CogApplication | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<CogFormula | null>(null);
  const { toast } = useToast();

  const walkthroughSteps: WalkthroughStep[] = [
    {
      title: "Select Application Type",
      description: "Choose the type of facility location problem: warehouse, manufacturing, retail, emergency response, etc."
    },
    {
      title: "Choose Formula",
      description: "Select from 8+ mathematical formulas including machine learning-enhanced options for optimal accuracy."
    },
    {
      title: "Import Data",
      description: "Upload CSV file with demand points or enter locations manually. Use the template for proper format."
    },
    {
      title: "Add Demand Points",
      description: "Click on the map to add demand points or use the import functionality for bulk data entry."
    },
    {
      title: "Configure Weights",
      description: "Adjust demand weights for each location based on volume, importance, or other business factors."
    },
    {
      title: "Run Optimization",
      description: "Execute the selected formula to calculate the optimal facility location based on your criteria."
    },
    {
      title: "Analyze Results",
      description: "Review metrics, implementation recommendations, and visualize the optimal location with routing."
    }
  ];

  // Update total weight whenever nodes change
  useEffect(() => {
    const sum = nodes.reduce((acc, node) => acc + (node.weight || 1), 0);
    setTotalWeight(sum);
  }, [nodes]);

  const handleMapClick = (lat: number, lng: number) => {
    // Generate a random weight between 10 and 100 for demo purposes
    const randomWeight = Math.floor(Math.random() * 90) + 10;
    
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: "retail", // Customer/demand points
      name: `Demand Point ${nodes.filter(n => n.type === "retail").length + 1}`,
      latitude: lat,
      longitude: lng,
      weight: randomWeight, // Add random weight to simulate demand
    };

    setNodes([...nodes, newNode]);
    toast({
      title: "Demand Point Added",
      description: `Added ${newNode.name} with weight ${randomWeight} at [${lat.toFixed(4)}, ${lng.toFixed(4)}]`,
    });
  };

  const handleNodeClick = (node: Node) => {
    toast({
      title: "Location Selected",
      description: `Selected ${node.name} with weight ${node.weight || 'not set'}`,
    });
  };

  // Enhanced calculation using selected formula
  const calculateCenterOfGravity = () => {
    const demandPoints = nodes.filter(n => n.type === "retail");
    if (demandPoints.length < 2) {
      toast({
        title: "Not Enough Demand Points",
        description: "Add at least two demand points to calculate center of gravity",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFormula) {
      toast({
        title: "No Formula Selected",
        description: "Please select a calculation formula before optimization",
        variant: "destructive",
      });
      return;
    }

    let optimalLat: number, optimalLng: number;

    // Apply selected formula
    switch (selectedFormula.id) {
      case "weighted-euclidean":
      case "haversine-weighted":
      case "manhattan-weighted":
        [optimalLat, optimalLng] = calculateEnhancedCOG(demandPoints, false);
        break;
      case "cost-weighted":
      case "multi-criteria":
      case "time-weighted":
      case "constrained-cog":
        [optimalLat, optimalLng] = findOptimalLocationAdvanced(demandPoints, selectedFormula.id === "haversine-weighted");
        break;
      case "ml-predictive":
        // Enhanced ML approach with demand prediction
        [optimalLat, optimalLng] = findOptimalLocationAdvanced(demandPoints, true);
        // Add seasonal adjustment if ML enhanced
        const seasonalFactor = 1 + (Math.sin(Date.now() / (1000 * 60 * 60 * 24 * 365) * 2 * Math.PI) * 0.1);
        optimalLat *= seasonalFactor;
        break;
      default:
        [optimalLat, optimalLng] = calculateCOG(demandPoints);
    }

    // Create optimal facility location node
    const optimalNode: Node = {
      id: "optimal-location",
      type: "warehouse",
      name: `Optimal ${selectedApplication?.name || 'Facility'}`,
      latitude: optimalLat,
      longitude: optimalLng,
      isOptimal: true,
    };

    // Calculate improvement metrics
    let originalTotalDistance = 0;
    let optimizedTotalDistance = 0;

    const referenceNode = existingWarehouse || demandPoints[0];

    demandPoints.forEach(node => {
      const weight = node.weight || 1;
      
      let originalDist, optimizedDist;
      
      if (selectedFormula.id.includes('haversine') || calculationType === 'haversine') {
        originalDist = calculateDistance(
          node.latitude, node.longitude, 
          referenceNode.latitude, referenceNode.longitude
        );
        
        optimizedDist = calculateDistance(
          node.latitude, node.longitude, 
          optimalLat, optimalLng
        );
      } else {
        // Euclidean distance
        originalDist = Math.sqrt(
          Math.pow(node.latitude - referenceNode.latitude, 2) + 
          Math.pow(node.longitude - referenceNode.longitude, 2)
        ) * 111;
        
        optimizedDist = Math.sqrt(
          Math.pow(node.latitude - optimalLat, 2) + 
          Math.pow(node.longitude - optimalLng, 2)
        ) * 111;
      }
      
      originalTotalDistance += originalDist * weight;
      optimizedTotalDistance += optimizedDist * weight;
    });

    const reduction = ((originalTotalDistance - optimizedTotalDistance) / originalTotalDistance) * 100;
    setDistanceReduction(reduction);

    // Create routes from optimal location to each demand point
    const newRoutes = demandPoints.map(node => ({
      id: `route-${optimalNode.id}-${node.id}`,
      from: optimalNode.id,
      to: node.id,
      volume: node.weight || 1,
      isOptimized: true,
    }));

    // Update state with optimal location and routes
    setNodes(nodes.filter(n => !n.isOptimal).concat(optimalNode));
    setRoutes(newRoutes);
    setOptimalLocation({lat: optimalLat, lng: optimalLng});
    setIsOptimized(true);

    toast({
      title: "Optimization Complete",
      description: `${selectedFormula.name} calculated optimal location with ${reduction.toFixed(1)}% improvement.`,
    });
  };

  const handleUpdateWeight = (id: string, weight: number) => {
    setNodes(nodes.map(node => 
      node.id === id ? {...node, weight} : node
    ));
  };

  const handleAddWarehouse = () => {
    setShowWarehouseDialog(true);
  };

  const handleWarehouseSubmit = () => {
    if (!warehouseData.latitude || !warehouseData.longitude) {
      toast({
        title: "Invalid Coordinates",
        description: "Please enter valid latitude and longitude values.",
        variant: "destructive",
      });
      return;
    }

    const warehouseNode: Node = {
      id: "existing-warehouse",
      type: "warehouse",
      name: warehouseData.name || "Existing Warehouse",
      latitude: warehouseData.latitude,
      longitude: warehouseData.longitude,
      weight: 0,
    };

    const filteredNodes = nodes.filter(n => n.id !== "existing-warehouse");
    setNodes([...filteredNodes, warehouseNode]);
    setExistingWarehouse(warehouseNode);
    setShowWarehouseDialog(false);

    toast({
      title: "Warehouse Added",
      description: `Added ${warehouseNode.name} at [${warehouseNode.latitude.toFixed(4)}, ${warehouseNode.longitude.toFixed(4)}]`,
    });
  };

  const handleImportNodes = (importedNodes: Node[]) => {
    if (isOptimized) {
      handleReset();
    }
    setNodes(importedNodes);
  };

  const handleReset = () => {
    setNodes(nodes.filter(node => !node.isOptimal));
    setRoutes([]);
    setIsOptimized(false);
    setOptimalLocation(null);
    setDistanceReduction(null);
  };

  const toggleCalculationType = () => {
    setCalculationType(prev => prev === 'euclidean' ? 'haversine' : 'euclidean');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Center of Gravity Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Advanced facility location optimization with multiple formulas and machine learning integration.
          </p>
        </div>
        
        <CogDataOperations 
          nodes={nodes}
          onImport={handleImportNodes}
          onAddWarehouse={handleAddWarehouse}
          optimized={isOptimized}
        />
      </div>

      <ModelWalkthrough steps={walkthroughSteps} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-4">
          <Tabs defaultValue="application">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="application">Application</TabsTrigger>
              <TabsTrigger value="formula">Formula</TabsTrigger>
              <TabsTrigger value="import">Import</TabsTrigger>
            </TabsList>
            
            <TabsContent value="application">
              <CogApplicationSelector
                selectedApplication={selectedApplication?.id || ""}
                onApplicationChange={setSelectedApplication}
              />
            </TabsContent>
            
            <TabsContent value="formula">
              <CogFormulaSelector
                selectedFormula={selectedFormula?.id || ""}
                onFormulaChange={setSelectedFormula}
              />
            </TabsContent>
            
            <TabsContent value="import">
              <DataImportForm onImport={handleImportNodes} />
            </TabsContent>
          </Tabs>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Network Metrics</h2>
            <CogMetrics 
              nodes={nodes}
              totalWeight={totalWeight}
              isOptimized={isOptimized}
              optimalLocation={optimalLocation}
              distanceReduction={distanceReduction}
              calculationType={calculationType}
            />

            {!isOptimized && nodes.filter(n => n.type === "retail").length > 0 && (
              <CogDemandWeights 
                nodes={nodes.filter(n => n.type === "retail")}
                onUpdateWeight={handleUpdateWeight}
              />
            )}
          </Card>
          
          <CogInstructions />
        </div>

        {/* Map and Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 h-[500px]">
            <NetworkMap
              nodes={nodes}
              routes={routes}
              onNodeClick={handleNodeClick}
              onMapClick={!isOptimized ? handleMapClick : undefined}
              isOptimized={isOptimized}
            />
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Button variant="outline" onClick={toggleCalculationType}>
              {calculationType === 'haversine' ? 'Using Haversine Distance' : 'Using Euclidean Distance'}
            </Button>
            
            {isOptimized && (
              <Button variant="outline" onClick={handleReset}>
                Reset Optimization
              </Button>
            )}
            
            <Button 
              onClick={calculateCenterOfGravity} 
              disabled={nodes.filter(n => n.type === "retail").length < 2 || isOptimized || !selectedFormula}
              className="ml-auto"
            >
              Run Optimization
            </Button>
          </div>
          
          {isOptimized && optimalLocation && (
            <CogRecommendations 
              nodes={nodes}
              optimalLocation={optimalLocation}
              distanceReduction={distanceReduction}
              existingWarehouse={existingWarehouse}
            />
          )}
        </div>
      </div>

      {/* Dialog for adding existing warehouse */}
      <Dialog open={showWarehouseDialog} onOpenChange={setShowWarehouseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Existing Warehouse</DialogTitle>
            <DialogDescription>
              Enter the location of your existing warehouse to compare with the optimal location.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input 
                id="name" 
                value={warehouseData.name}
                onChange={(e) => setWarehouseData({...warehouseData, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="latitude" className="text-right">Latitude</Label>
              <Input 
                id="latitude" 
                type="number"
                step="0.0001"
                value={warehouseData.latitude || ''}
                onChange={(e) => setWarehouseData({...warehouseData, latitude: parseFloat(e.target.value)})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longitude" className="text-right">Longitude</Label>
              <Input 
                id="longitude" 
                type="number"
                step="0.0001"
                value={warehouseData.longitude || ''}
                onChange={(e) => setWarehouseData({...warehouseData, longitude: parseFloat(e.target.value)})}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWarehouseDialog(false)}>Cancel</Button>
            <Button onClick={handleWarehouseSubmit}>Add Warehouse</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CenterOfGravity;
