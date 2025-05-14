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
import { calculateDistance, calculateCOG } from "@/components/cog/CogUtils";
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
  const { toast } = useToast();

  const walkthroughSteps: WalkthroughStep[] = [
    {
      title: "Add Demand Points",
      description: "Click on the map to add demand points representing customer locations. Each point has a demand weight."
    },
    {
      title: "Add Existing Warehouse",
      description: "Optionally add your current warehouse location to compare with the optimal location."
    },
    {
      title: "Adjust Demand Weights",
      description: "Use the demand weights panel to adjust the weight of each point based on actual volumes or importance."
    },
    {
      title: "Select Calculation Method",
      description: "Choose between Euclidean (straight-line) or Haversine (accounts for Earth's curvature) distance calculation."
    },
    {
      title: "Run the Optimization",
      description: "Click 'Run Optimization' to calculate the center of gravity - the optimal facility location that minimizes weighted distance."
    },
    {
      title: "Analyze Results",
      description: "Review metrics, practical recommendations, and visualize the optimal location on the map with routes to demand points."
    },
    {
      title: "Export Your Analysis",
      description: "Export your data for further analysis, implementation planning, or future reference."
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

  // Calculate center of gravity based on weighted demand points
  const calculateCenterOfGravity = () => {
    // Make sure we have at least two demand points
    const demandPoints = nodes.filter(n => n.type === "retail");
    if (demandPoints.length < 2) {
      toast({
        title: "Not Enough Demand Points",
        description: "Add at least two demand points to calculate center of gravity",
        variant: "destructive",
      });
      return;
    }

    // Calculate optimal location using the COG function
    const [optimalLat, optimalLng] = calculateCOG(demandPoints);

    // Create optimal facility location node
    const optimalNode: Node = {
      id: "optimal-location",
      type: "warehouse",
      name: "Optimal Facility",
      latitude: optimalLat,
      longitude: optimalLng,
      isOptimal: true,
    };

    // Calculate average distance reduction
    let originalTotalDistance = 0;
    let optimizedTotalDistance = 0;

    // If we have an existing warehouse, use that for comparison
    // Otherwise, use the first demand point as a reference
    const referenceNode = existingWarehouse || demandPoints[0];

    demandPoints.forEach(node => {
      const weight = node.weight || 1;
      
      // Calculate distances based on selected calculation type
      let originalDist, optimizedDist;
      
      if (calculationType === 'haversine') {
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
        ) * 111; // Rough km conversion
        
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
      description: "Center of Gravity location has been calculated and added to the map.",
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
    // Validate input
    if (!warehouseData.latitude || !warehouseData.longitude) {
      toast({
        title: "Invalid Coordinates",
        description: "Please enter valid latitude and longitude values.",
        variant: "destructive",
      });
      return;
    }

    // Create warehouse node
    const warehouseNode: Node = {
      id: "existing-warehouse",
      type: "warehouse",
      name: warehouseData.name || "Existing Warehouse",
      latitude: warehouseData.latitude,
      longitude: warehouseData.longitude,
      weight: 0, // Warehouse doesn't have a demand weight
    };

    // Remove any existing warehouse
    const filteredNodes = nodes.filter(n => n.id !== "existing-warehouse");
    
    // Add the new warehouse
    setNodes([...filteredNodes, warehouseNode]);
    setExistingWarehouse(warehouseNode);
    setShowWarehouseDialog(false);

    toast({
      title: "Warehouse Added",
      description: `Added ${warehouseNode.name} at [${warehouseNode.latitude.toFixed(4)}, ${warehouseNode.longitude.toFixed(4)}]`,
    });
  };

  const handleImportNodes = (importedNodes: Node[]) => {
    // Clear any existing optimization
    if (isOptimized) {
      handleReset();
    }

    // Set the imported nodes
    setNodes(importedNodes);
  };

  const handleReset = () => {
    // Keep existing warehouse but remove optimal location
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
            Optimize facility locations based on weighted demand points to minimize transportation costs.
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

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="space-y-4 lg:w-3/4">
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
              disabled={nodes.filter(n => n.type === "retail").length < 2 || isOptimized}
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

        <div className="lg:w-1/4 space-y-4">
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
