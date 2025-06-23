import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkMap } from "@/components/NetworkMap";
import { CompleteCogCalculation, CogCalculationResult } from "@/components/cog/CompleteCogCalculation";
import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";
import type { Node, Route } from "@/components/map/MapTypes";
import { CogFormulaSelector } from "@/components/cog/CogFormulaSelector";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthProvider";
import { AlertCircle, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CenterOfGravity = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [cogResult, setCogResult] = useState<CogCalculationResult | null>(null);
  const [optimizedRoutes, setOptimizedRoutes] = useState<Route[]>([]);
  const [mapNodes, setMapNodes] = useState<Node[]>([]);
  const [selectedFormulaId, setSelectedFormulaId] = useState("weighted-center-gravity");

  const cogModel = modelFormulaRegistry.find(m => m.id === "center-of-gravity");

  const { data: demandPoints, isLoading } = useQuery<Node[]>({
    queryKey: ['demandPoints', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from('nodes')
        .select('*')
        .eq('project_id', projectId)
        .eq('type', 'demand');

      if (error) throw new Error(error.message);
      
      return data.map(n => ({
        id: n.id,
        name: n.name,
        type: n.type,
        latitude: n.latitude,
        longitude: n.longitude,
        weight: n.demand,
        ownership: 'owned'
      }));
    },
    enabled: !!projectId
  });

  const addNodeMutation = useMutation(
    async (newNode: Partial<Node>) => {
      const { data, error } = await supabase.from('nodes').insert([{ 
        ...newNode, 
        project_id: projectId, 
        user_id: user?.id,
        name: `New Demand Point ${demandPoints?.length || 0 + 1}`,
        type: 'demand',
        demand: 100, // Default demand
       }]).select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['demandPoints', projectId]);
        toast({ title: "Demand Point Added", description: "A new location has been added to your project." });
      },
      onError: (error: Error) => {
        toast({ title: "Error adding point", description: error.message, variant: 'destructive' });
      }
    }
  );

  useEffect(() => {
    let currentNodes: Node[] = [...(demandPoints || [])];
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
    const newOptimizedRoutes = (demandPoints || []).map(dp => ({
      id: `route-${dp.id}-cog`,
      from: dp.id,
      to: 'cog-result',
      label: `Optimized route to ${dp.name}`,
      ownership: 'proposed'
    }));
    setOptimizedRoutes(newOptimizedRoutes);
  };

  const handleMapClick = (lat: number, lng: number) => {
    addNodeMutation.mutate({ latitude: lat, longitude: lng });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading Demand Points...</span>
      </div>
    );
  }

  if (!demandPoints || demandPoints.length === 0) {
    return (
      <Card className="m-4 p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-xl font-semibold text-gray-900">No Customer Locations Found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The Center of Gravity model requires customer locations (demand points) to calculate the optimal facility location. Click on the map to add one.
        </p>
        <div className="mt-6">
          <Link to={`/data-input/${projectId}`}>
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Add Customer Data Manually
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

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
            demandPoints={demandPoints || []}
            selectedFormula={selectedFormulaId}
            onResultsCalculated={handleResultsCalculated}
          />
        </div>
      </div>
    </div>
  );
};

export default CenterOfGravity;
