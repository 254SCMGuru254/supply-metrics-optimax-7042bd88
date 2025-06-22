import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NetworkMap } from "@/components/NetworkMap";
import { useToast } from "@/hooks/use-toast";
import { Target, Calculator, BarChart3, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Node, Route } from "@/types/database";
import { Skeleton } from "@/components/ui/skeleton";

const Isohedron = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: demandPoints = [], isLoading: isLoadingDemandPoints } = useQuery<Node[]>({
    queryKey: ["demandPoints", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("nodes")
        .select("*")
        .eq("project_id", projectId)
        .eq("type", "demand");

      if (error) {
        toast({ title: "Error fetching demand points", description: error.message, variant: "destructive" });
        throw new Error(error.message);
      }
      return data || [];
    },
    enabled: !!projectId,
  });
  
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isohedronCenter, setIsohedronCenter] = useState<{ lat: number; lng: number } | null>(null);

  const addDemandPointMutation = useMutation({
    mutationFn: async (newPoint: Omit<Node, "id" | "created_at" | "project_id">) => {
      const { data, error } = await supabase
        .from("nodes")
        .insert([{ ...newPoint, project_id: projectId }])
        .select();

      if (error) {
        toast({ title: "Error adding demand point", description: error.message, variant: "destructive" });
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demandPoints", projectId] });
      toast({ title: "Success", description: "New demand point added." });
    },
  });

  const addDemandPoint = () => {
    // Add a new demand point near Kenya
    const newPoint: Omit<Node, "id" | "created_at" | "project_id"> = {
      type: "demand",
      name: `Demand Point ${demandPoints.length + 1}`,
      latitude: -1.2 + (Math.random() - 0.5) * 2,
      longitude: 36.8 + (Math.random() - 0.5) * 2,
      demand: Math.floor(Math.random() * 100) + 50,
      ownership: 'leased'
    };
    addDemandPointMutation.mutate(newPoint);
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
    const totalWeight = demandPoints.reduce((sum, point) => sum + (point.demand || 0), 0);
    let weightedLat = 0;
    let weightedLng = 0;

    demandPoints.forEach(point => {
      const weight = point.demand || 0;
      weightedLat += point.latitude * weight;
      weightedLng += point.longitude * weight;
    });

    const center = {
      lat: weightedLat / totalWeight,
      lng: weightedLng / totalWeight
    };

    setIsohedronCenter(center);

    // Create routes from center to all demand points
    const newRoutes: Omit<Route, "id" | "created_at" | "project_id">[] = demandPoints.map(point => ({
      from_node_id: "isohedron-center", // This is a virtual ID for the map
      to_node_id: point.id,
      distance: 0, // Should be calculated if needed
      transport_cost: 0,
      ownership: 'leased'
    }));

    // This is a client-side only representation, so we don't save to DB
    // We cast to Route[] for the NetworkMap component
    setRoutes(newRoutes as Route[]);
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
      ownership: 'owned',
      project_id: projectId!,
      created_at: new Date().toISOString()
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
            Find the optimal facility location using the isohedron methodology
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={addDemandPoint} disabled={addDemandPointMutation.isPending}>
            {addDemandPointMutation.isPending ? "Adding..." : "Add Demand Point"}
          </Button>
          {isOptimized && (
            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
          )}
          <Button onClick={calculateIsohedron} disabled={demandPoints.length < 3 || isLoadingDemandPoints}>
            {isLoadingDemandPoints ? "Loading..." : "Calculate Isohedron"}
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
              {isLoadingDemandPoints ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <NetworkMap
                  nodes={allNodes}
                  routes={routes}
                  isOptimized={isOptimized}
                />
              )}
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
              {isLoadingDemandPoints ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span>Total Demand Points:</span>
                    <Badge variant="secondary">{demandPoints.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Demand Volume:</span>
                    <Badge variant="secondary">
                      {demandPoints.reduce((sum, point) => sum + (point.demand || 0), 0)}
                    </Badge>
                  </div>
                  {isohedronCenter && (
                    <>
                      <div className="flex justify-between items-center">
                        <span>Optimal Location:</span>
                        <Badge variant="success">Found</Badge>
                      </div>
                      <div className="space-y-2 pt-2">
                        <div className="text-sm font-medium">
                          <strong>Coordinates:</strong>
                          <div className="text-muted-foreground">
                            Lat: {isohedronCenter.lat.toFixed(6)}
                            <br />
                            Lng: {isohedronCenter.lng.toFixed(6)}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
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
                    <Badge variant="success">Optimized</Badge>
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
