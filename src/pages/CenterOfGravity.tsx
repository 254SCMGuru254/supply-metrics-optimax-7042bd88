
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
import { AlertCircle, Package, Loader2, MapPin, Calculator, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
        ownership: 'owned' as const
      }));
    },
    enabled: !!projectId
  });

  const addNodeMutation = useMutation({
    mutationFn: async (newNode: Partial<Node>) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demandPoints', projectId] });
      toast({ title: "Demand Point Added", description: "A new location has been added to your project." });
    },
    onError: (error: Error) => {
      toast({ title: "Error adding point", description: error.message, variant: 'destructive' });
    }
  });

  useEffect(() => {
    let currentNodes: Node[] = [...(demandPoints || [])];
    if (cogResult) {
      currentNodes.push({
        id: 'cog-result',
        type: 'facility',
        name: 'Optimized Location',
        latitude: cogResult.latitude,
        longitude: cogResult.longitude,
        ownership: 'proposed' as const
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
      ownership: 'proposed' as const
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Center of Gravity Analysis</h1>
                <p className="text-gray-600">Find optimal facility locations using mathematical modeling</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Mathematical Optimization
              </Badge>
              <Badge variant="outline">Kenya Focused</Badge>
            </div>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <CardTitle className="text-2xl text-gray-900">No Customer Locations Found</CardTitle>
              <p className="text-gray-600 mt-2">
                The Center of Gravity model requires customer locations (demand points) to calculate the optimal facility location. 
                Add some customer locations to get started.
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to={`/data-input/${projectId}`}>
                  <Button className="w-full">
                    <Package className="mr-2 h-4 w-4" />
                    Add Customer Data
                  </Button>
                </Link>
                <Link to="/documentation">
                  <Button variant="outline" className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    View Documentation
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                You can also click on the map to add demand points directly once you have the interface loaded.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Center of Gravity Analysis</h1>
              <p className="text-gray-600">Mathematical optimization for optimal facility placement</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {demandPoints?.length || 0} Demand Points
            </Badge>
            <Badge variant="outline">Real-time Optimization</Badge>
            {cogResult && (
              <Badge className="bg-green-100 text-green-700">
                Solution Found
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>Interactive Supply Chain Map</span>
                </CardTitle>
                <p className="text-sm text-gray-600">Click on the map to add new demand points</p>
              </CardHeader>
              <CardContent className="p-0 h-[500px]">
                <NetworkMap 
                  nodes={mapNodes} 
                  routes={optimizedRoutes} 
                  onMapClick={handleMapClick} 
                />
              </CardContent>
            </Card>
          </div>

          {/* Controls Section */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  <span>Model Configuration</span>
                </CardTitle>
              </CardHeader>
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

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={`/data-input/${projectId}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Manage Data Input
                  </Button>
                </Link>
                <Link to="/documentation">
                  <Button variant="outline" className="w-full justify-start">
                    <Calculator className="mr-2 h-4 w-4" />
                    View Documentation
                  </Button>
                </Link>
                <Link to={`/analytics-dashboard/${projectId}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analytics Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterOfGravity;
