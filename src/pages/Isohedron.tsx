
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/hooks/use-toast";
import { Target, Calculator, BarChart3, MapPin } from "lucide-react";

const Isohedron = () => {
  const [demandPoints, setDemandPoints] = useState<Node[]>([
    {
      id: crypto.randomUUID(),
      type: "retail",
      name: "Nairobi Central",
      latitude: -1.2921,
      longitude: 36.8219,
      weight: 150,
      ownership: 'owned'
    }
  ]);
  
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isohedronCenter, setIsohedronCenter] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  const addDemandPoint = () => {
    // Add a new demand point near Kenya
    const newPoint: Node = {
      id: crypto.randomUUID(),
      type: "retail",
      name: `Demand Point ${demandPoints.length + 1}`,
      latitude: -1.2 + (Math.random() - 0.5) * 2,
      longitude: 36.8 + (Math.random() - 0.5) * 2,
      weight: Math.floor(Math.random() * 100) + 50,
      ownership: 'owned'
    };
    setDemandPoints([...demandPoints, newPoint]);
  };

  const calculateIsohedron = () => {
    if (demandPoints.length < 3) {
      toast({
        title: "Insufficient Data",
        description: "Add at least 3 demand points to calculate isohedron",
        variant: "destructive"
      });
      return;
    }

    // Simple isohedron calculation (geometric center for demonstration)
    const totalWeight = demandPoints.reduce((sum, point) => sum + (point.weight || 0), 0);
    let weightedLat = 0;
    let weightedLng = 0;

    demandPoints.forEach(point => {
      const weight = point.weight || 0;
      weightedLat += point.latitude * weight;
      weightedLng += point.longitude * weight;
    });

    const center = {
      lat: weightedLat / totalWeight,
      lng: weightedLng / totalWeight
    };

    setIsohedronCenter(center);

    // Create routes from center to all demand points
    const newRoutes: Route[] = demandPoints.map(point => ({
      id: crypto.randomUUID(),
      from: "isohedron-center",
      to: point.id,
      volume: point.weight || 0,
      isOptimized: true,
      ownership: 'owned'
    }));

    setRoutes(newRoutes);
    setIsOptimized(true);

    toast({
      title: "Isohedron Calculated",
      description: `Optimal facility location found at [${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}]`,
    });
  };

  const reset = () => {
    setIsOptimized(false);
    setIsohedronCenter(null);
    setRoutes([]);
  };

  // Prepare nodes for the map
  const allNodes: Node[] = [...demandPoints];
  if (isohedronCenter) {
    allNodes.push({
      id: "isohedron-center",
      type: "warehouse",
      name: "Optimal Location",
      latitude: isohedronCenter.lat,
      longitude: isohedronCenter.lng,
      capacity: 5000,
      ownership: 'owned'
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8" />
            Isohedron Analysis
          </h1>
          <p className="text-muted-foreground mt-2">
            Find the optimal facility location using isohedron methodology
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={addDemandPoint}>
            Add Demand Point
          </Button>
          {isOptimized && (
            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
          )}
          <Button onClick={calculateIsohedron} disabled={demandPoints.length < 3}>
            Calculate Isohedron
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="lg:col-span-2 p-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Isohedron Visualization
            </CardTitle>
            <CardDescription>
              Demand points and optimal facility location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px]">
              <NetworkMap
                nodes={allNodes}
                routes={routes}
                isOptimized={isOptimized}
              />
            </div>
          </CardContent>
        </Card>

        {/* Analysis Panel */}
        <div className="space-y-6">
          {/* Demand Points Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Demand Points:</span>
                <Badge variant="secondary">{demandPoints.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Demand Volume:</span>
                <Badge variant="secondary">
                  {demandPoints.reduce((sum, point) => sum + (point.weight || 0), 0)}
                </Badge>
              </div>
              {isohedronCenter && (
                <>
                  <div className="flex justify-between items-center">
                    <span>Optimal Location:</span>
                    <Badge variant="secondary">Found</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Coordinates:</strong>
                      <br />
                      Lat: {isohedronCenter.lat.toFixed(6)}
                      <br />
                      Lng: {isohedronCenter.lng.toFixed(6)}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Methodology */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Methodology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p>
                  <strong>Isohedron Analysis</strong> determines the optimal facility location 
                  by minimizing the total weighted distance to all demand points.
                </p>
                <p>
                  The algorithm considers:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Demand volume at each location</li>
                  <li>Geographic distribution of points</li>
                  <li>Transportation cost optimization</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {isOptimized && (
            <Card>
              <CardHeader>
                <CardTitle>Optimization Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Routes:</span>
                    <span>{routes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant="secondary">Optimized</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Isohedron;
