
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calculator, MapPin, Download, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NetworkMap, { Node as MapNode, Route } from "@/components/NetworkMap";
import { Node as MapTypesNode } from "@/components/map/MapTypes";

interface DemandPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  demand: number;
  weight?: number;
}

interface COGResult {
  latitude: number;
  longitude: number;
  totalDemand: number;
  totalWeight: number;
  method: string;
}

const CenterOfGravity = () => {
  const [demandPoints, setDemandPoints] = useState<DemandPoint[]>([
    { id: "1", name: "Nairobi", latitude: -1.2921, longitude: 36.8219, demand: 1000, weight: 1 },
    { id: "2", name: "Mombasa", latitude: -4.0435, longitude: 39.6682, demand: 800, weight: 1 },
    { id: "3", name: "Kisumu", latitude: -0.1022, longitude: 34.7617, demand: 600, weight: 1 }
  ]);

  const [newPoint, setNewPoint] = useState<Partial<DemandPoint>>({
    name: "",
    latitude: 0,
    longitude: 0,
    demand: 0,
    weight: 1
  });

  const [cogResult, setCogResult] = useState<COGResult | null>(null);
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  const calculateCOG = () => {
    if (demandPoints.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one demand point.",
        variant: "destructive",
      });
      return;
    }

    let totalWeightedLat = 0;
    let totalWeightedLng = 0;
    let totalWeight = 0;
    let totalDemand = 0;

    demandPoints.forEach(point => {
      const weight = point.demand * (point.weight || 1);
      totalWeightedLat += point.latitude * weight;
      totalWeightedLng += point.longitude * weight;
      totalWeight += weight;
      totalDemand += point.demand;
    });

    const cogLat = totalWeightedLat / totalWeight;
    const cogLng = totalWeightedLng / totalWeight;

    const result: COGResult = {
      latitude: cogLat,
      longitude: cogLng,
      totalDemand,
      totalWeight,
      method: "Weighted Center of Gravity"
    };

    setCogResult(result);
    
    toast({
      title: "Calculation Complete",
      description: "Center of gravity has been calculated successfully.",
    });
  };

  const addDemandPoint = () => {
    if (!newPoint.name || !newPoint.latitude || !newPoint.longitude || !newPoint.demand) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const point: DemandPoint = {
      id: Date.now().toString(),
      name: newPoint.name,
      latitude: newPoint.latitude,
      longitude: newPoint.longitude,
      demand: newPoint.demand,
      weight: newPoint.weight || 1
    };

    setDemandPoints([...demandPoints, point]);
    setNewPoint({ name: "", latitude: 0, longitude: 0, demand: 0, weight: 1 });
  };

  const removeDemandPoint = (id: string) => {
    setDemandPoints(demandPoints.filter(p => p.id !== id));
  };

  // Convert demand points to map nodes
  const mapNodes: MapNode[] = demandPoints.map(point => ({
    id: point.id,
    name: point.name,
    type: "demand",
    latitude: point.latitude,
    longitude: point.longitude,
    weight: point.demand
  }));

  // Add COG result as a node if calculated
  if (cogResult) {
    mapNodes.push({
      id: "cog",
      name: "Center of Gravity",
      type: "facility",
      latitude: cogResult.latitude,
      longitude: cogResult.longitude,
      weight: 0
    });
  }

  // Convert to MapTypes for compatibility
  const mapTypesNodes: MapTypesNode[] = mapNodes.map(node => ({
    ...node,
    ownership: 'owned' as const
  }));

  return (
    <div className="container mx-auto px-4 py-8 space-y-8" ref={contentRef}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Center of Gravity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Calculate the optimal location for facilities based on demand distribution and transportation costs.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="input" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Data Input</TabsTrigger>
          <TabsTrigger value="calculation">Calculation</TabsTrigger>
          <TabsTrigger value="visualization">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Demand Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="name">Location Name</Label>
                  <Input
                    id="name"
                    value={newPoint.name || ""}
                    onChange={(e) => setNewPoint({...newPoint, name: e.target.value})}
                    placeholder="e.g., Nairobi"
                  />
                </div>
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={newPoint.latitude || ""}
                    onChange={(e) => setNewPoint({...newPoint, latitude: parseFloat(e.target.value)})}
                    placeholder="-1.2921"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={newPoint.longitude || ""}
                    onChange={(e) => setNewPoint({...newPoint, longitude: parseFloat(e.target.value)})}
                    placeholder="36.8219"
                  />
                </div>
                <div>
                  <Label htmlFor="demand">Demand</Label>
                  <Input
                    id="demand"
                    type="number"
                    value={newPoint.demand || ""}
                    onChange={(e) => setNewPoint({...newPoint, demand: parseFloat(e.target.value)})}
                    placeholder="1000"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addDemandPoint} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Point
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Current Demand Points</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-2 text-left">Location</th>
                        <th className="border border-border p-2 text-right">Latitude</th>
                        <th className="border border-border p-2 text-right">Longitude</th>
                        <th className="border border-border p-2 text-right">Demand</th>
                        <th className="border border-border p-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demandPoints.map((point) => (
                        <tr key={point.id}>
                          <td className="border border-border p-2">{point.name}</td>
                          <td className="border border-border p-2 text-right">{point.latitude.toFixed(4)}</td>
                          <td className="border border-border p-2 text-right">{point.longitude.toFixed(4)}</td>
                          <td className="border border-border p-2 text-right">{point.demand.toLocaleString()}</td>
                          <td className="border border-border p-2 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeDemandPoint(point.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calculate Center of Gravity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={calculateCOG} className="w-full md:w-auto">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate COG
              </Button>

              {cogResult && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Optimal Location</p>
                      <p className="font-semibold">
                        {cogResult.latitude.toFixed(6)}, {cogResult.longitude.toFixed(6)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Demand</p>
                      <p className="font-semibold">{cogResult.totalDemand.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Method Used</p>
                      <Badge>{cogResult.method}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Weight</p>
                      <p className="font-semibold">{cogResult.totalWeight.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization" className="space-y-4">
          <NetworkMap 
            nodes={mapTypesNodes}
            routes={[]}
            className="h-96"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CenterOfGravity;
