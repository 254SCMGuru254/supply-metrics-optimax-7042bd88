
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/components/ui/use-toast";
import { ModelWalkthrough, WalkthroughStep } from "@/components/ModelWalkthrough";
import { CogMetrics } from "@/components/cog/CogMetrics";
import { CogDemandWeights } from "@/components/cog/CogDemandWeights";
import { CogInstructions } from "@/components/cog/CogInstructions";
import { calculateDistance, calculateCOG } from "@/components/cog/CogUtils";

const CenterOfGravity = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [optimalLocation, setOptimalLocation] = useState<{lat: number, lng: number} | null>(null);
  const [distanceReduction, setDistanceReduction] = useState<number | null>(null);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [calculationType, setCalculationType] = useState<'euclidean' | 'haversine'>('haversine');
  const { toast } = useToast();

  const walkthroughSteps: WalkthroughStep[] = [
    {
      title: "Add Demand Points",
      description: "Click on the map to add demand points. Each point represents a customer location with a demand weight."
    },
    {
      title: "Adjust Demand Weights",
      description: "Use the demand weights panel to adjust the weight of each point. Higher weights represent locations with greater demand or importance."
    },
    {
      title: "Select Calculation Method",
      description: "Choose between Euclidean (straight-line) or Haversine (accounts for Earth's curvature) distance calculation methods."
    },
    {
      title: "Run the Optimization",
      description: "Click 'Run Optimization' to calculate the center of gravity - the optimal facility location that minimizes the weighted distance to all demand points."
    },
    {
      title: "Analyze Results",
      description: "Review the metrics panel to see the distance reduction and optimal location coordinates. The map will show the optimal facility location and routes."
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

      <ModelWalkthrough steps={walkthroughSteps} />

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
          <CogMetrics 
            nodes={nodes}
            totalWeight={totalWeight}
            isOptimized={isOptimized}
            optimalLocation={optimalLocation}
            distanceReduction={distanceReduction}
            calculationType={calculationType}
          />

          {!isOptimized && nodes.length > 0 && (
            <CogDemandWeights 
              nodes={nodes}
              onUpdateWeight={handleUpdateWeight}
            />
          )}
        </Card>
      </div>

      <CogInstructions />
    </div>
  );
};

export default CenterOfGravity;
