import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkMap } from "@/components/NetworkMap";
import { CompleteCogCalculation, CogCalculationResult } from "@/components/cog/CompleteCogCalculation";
import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";
import type { Node, Route } from "@/components/map/MapTypes";
import { CogFormulaSelector } from "@/components/cog/CogFormulaSelector";
import { toast } from "@/components/ui/use-toast";

const CenterOfGravity = () => {
  const [demandPoints, setDemandPoints] = useState<Node[]>([
    { id: "1", type: "customer", name: "Nairobi", latitude: -1.2921, longitude: 36.8219, weight: 500, ownership: 'owned' },
    { id: "2", type: "customer", name: "Mombasa", latitude: -4.0435, longitude: 39.6682, weight: 300, ownership: 'owned' },
    { id: "3", type: "customer", name: "Kisumu", latitude: -0.0917, longitude: 34.7680, weight: 200, ownership: 'owned' }
  ]);
  
  const [cogResult, setCogResult] = useState<CogCalculationResult | null>(null);
  const [optimizedRoutes, setOptimizedRoutes] = useState<Route[]>([]);
  const [mapNodes, setMapNodes] = useState<Node[]>([]);
  const [selectedFormulaId, setSelectedFormulaId] = useState("weighted-center-gravity");

  const cogModel = modelFormulaRegistry.find(m => m.id === "center-of-gravity");

  useEffect(() => {
    let currentNodes = [...demandPoints];
    if (cogResult) {
      currentNodes.push({
        id: 'cog-result',
        type: 'facility',
        name: 'Optimized Location',
        latitude: cogResult.latitude,
        longitude: cogResult.longitude,
        ownership: 'proposed'
      });
    }
    setMapNodes(currentNodes);
  }, [demandPoints, cogResult]);

  const handleResultsCalculated = (results: CogCalculationResult) => {
    setCogResult(results);
    const newOptimizedRoutes = demandPoints.map(dp => ({
      id: `route-${dp.id}-cog`,
      startNodeId: dp.id,
      endNodeId: 'cog-result',
      label: `Optimized route to ${dp.name}`,
      color: '#16a34a',
      isOptimized: true
    }));
    setOptimizedRoutes(newOptimizedRoutes);
  };

  const handleMapClick = (lat: number, lng: number) => {
    const newPoint: Node = {
        id: crypto.randomUUID(),
        type: 'customer',
        name: `New Point`,
        latitude: lat,
        longitude: lng,
        weight: 100,
        ownership: 'owned'
    };
    setDemandPoints([...demandPoints, newPoint]);
    toast({ title: 'Demand Point Added', description: 'A new location was added. You can edit it in the data tab.' });
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Center of Gravity Analysis</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <NetworkMap 
              nodes={mapNodes} 
              routes={optimizedRoutes} 
              onMapClick={handleMapClick} 
            />
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
            <CardContent>
              {cogModel && (
                <CogFormulaSelector
                  formulas={cogModel.formulas}
                  selectedFormulaId={selectedFormulaId}
                  onFormulaChange={setSelectedFormulaId}
                />
              )}
            </CardContent>
          </Card>
          <CompleteCogCalculation
            demandPoints={demandPoints}
            selectedFormula={selectedFormulaId}
            onResultsCalculated={handleResultsCalculated}
          />
        </div>
      </div>
    </div>
  );
};

export default CenterOfGravity;
