
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/components/ui/use-toast";

// Utility function to calculate distance between two points (haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

// Utility function to calculate the Center of Gravity
const calculateCOG = (nodes: Node[]): [number, number] => {
  let weightedSumLat = 0;
  let weightedSumLng = 0;
  let totalWeight = 0;

  nodes.forEach(node => {
    const weight = node.weight || 1;
    weightedSumLat += node.latitude * weight;
    weightedSumLng += node.longitude * weight;
    totalWeight += weight;
  });

  return [
    weightedSumLat / totalWeight,
    weightedSumLng / totalWeight
  ];
};

const CenterOfGravity = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [optimalLocation, setOptimalLocation] = useState<{lat: number, lng: number} | null>(null);
  const [distanceReduction, setDistanceReduction] = useState<number | null>(null);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [calculationType, setCalculationType] = useState<'euclidean' | 'haversine'>('haversine');
  const { toast } = useToast();

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
      type: "retail", // Changed to retail since these are demand points
      name: `Demand Point ${nodes.length + 1}`,
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
      title: "Demand Point Selected",
      description: `Selected ${node.name} with weight ${node.weight || 'not set'}`,
    });
  };

  // Calculate center of gravity based on weighted demand points
  const calculateCenterOfGravity = () => {
    if (nodes.length < 2) {
      toast({
        title: "Not Enough Points",
        description: "Add at least two demand points to calculate center of gravity",
        variant: "destructive",
      });
      return;
    }

    // Calculate optimal location using the COG function
    const [optimalLat, optimalLng] = calculateCOG(nodes);

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

    // If we have nodes, use the first one as reference for "before optimization"
    const referenceNodeIdx = nodes.findIndex(n => n.type === "warehouse");
    const referenceNode = referenceNodeIdx >= 0 ? nodes[referenceNodeIdx] : nodes[0];

    nodes.forEach(node => {
      if (node.type === "retail") {
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
      }
    });

    const reduction = ((originalTotalDistance - optimizedTotalDistance) / originalTotalDistance) * 100;
    setDistanceReduction(reduction);

    // Create routes from optimal location to each demand point
    const newRoutes = nodes
      .filter(node => node.type === "retail")
      .map(node => ({
        id: `route-${optimalNode.id}-${node.id}`,
        from: optimalNode.id,
        to: node.id,
        volume: node.weight || 1,
        isOptimized: true,
      }));

    // Update state with optimal location and routes
    setNodes([...nodes, optimalNode]);
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

  const handleReset = () => {
    // Filter out the optimal node and reset routes
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Center of Gravity Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Optimize facility locations based on weighted demand points.
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={toggleCalculationType}>
            {calculationType === 'haversine' ? 'Using Haversine' : 'Using Euclidean'}
          </Button>
          {isOptimized && (
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          )}
          <Button onClick={calculateCenterOfGravity} disabled={nodes.length < 2 || isOptimized}>
            Run Optimization
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-4">
          <NetworkMap
            nodes={nodes}
            routes={routes}
            onNodeClick={handleNodeClick}
            onMapClick={!isOptimized ? handleMapClick : undefined}
            isOptimized={isOptimized}
          />
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Network Metrics</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Demand Points</p>
              <p className="text-2xl font-semibold">{nodes.filter(n => n.type === "retail").length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Demand Weight</p>
              <p className="text-2xl font-semibold">{totalWeight}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Distance Calculation</p>
              <p className="text-lg font-medium">{calculationType === 'haversine' ? 'Haversine (accounts for Earth curvature)' : 'Euclidean (straight-line)'}</p>
            </div>
            {isOptimized && optimalLocation && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Optimal Location</p>
                  <p className="text-lg font-medium">[{optimalLocation.lat.toFixed(4)}, {optimalLocation.lng.toFixed(4)}]</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Distance Reduction</p>
                  <p className="text-2xl font-semibold text-primary">{distanceReduction?.toFixed(1)}%</p>
                </div>
              </>
            )}
          </div>

          {!isOptimized && nodes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Demand Weights</h3>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {nodes.map((node) => (
                  <div key={node.id} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Label htmlFor={`weight-${node.id}`}>{node.name}</Label>
                    </div>
                    <Input
                      id={`weight-${node.id}`}
                      type="number"
                      min="1"
                      className="w-24"
                      value={node.weight || 1}
                      onChange={(e) => handleUpdateWeight(node.id, parseInt(e.target.value) || 1)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">How to Use</h2>
        <div className="space-y-2">
          <p>1. Click on the map to add demand points</p>
          <p>2. Adjust the weights to represent demand volumes</p>
          <p>3. Toggle calculation method if needed (Euclidean vs. Haversine)</p>
          <p>4. Click "Run Optimization" to calculate the center of gravity</p>
          <p>5. View the results and metrics in the panel</p>
        </div>
      </Card>
    </div>
  );
};

export default CenterOfGravity;
