import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CogFormulaSelector } from "@/components/cog/CogFormulaSelector";
import { CogMetrics } from "@/components/cog/CogMetrics";
import { CogDataOperations } from "@/components/cog/CogDataOperations";
import { CogInstructions } from "@/components/cog/CogInstructions";
import { CogApplicationSelector } from "@/components/cog/CogApplicationSelector";
import { CogDemandWeights } from "@/components/cog/CogDemandWeights";
import { CogRecommendations } from "@/components/cog/CogRecommendations";
import { CompleteCogCalculation, CogCalculationResult } from "@/components/cog/CompleteCogCalculation";
import { EnterpriseCogCalculators } from "@/components/cog/EnterpriseCogCalculators";
import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";
import { Badge } from "@/components/ui/badge";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { ModelFormulas } from "@/components/shared/ModelFormulas";
import { Calculator, TrendingUp, Target, Building2, Save, FolderOpen, BarChart3, RotateCcw } from "lucide-react";
import { NetworkMap } from "@/components/NetworkMap";
import { toast } from "@/components/ui/use-toast";
import type { Node, Route } from "@/components/map/MapTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";

const CenterOfGravity = () => {
  const [selectedModel, setSelectedModel] = useState("center-of-gravity");
  const [selectedFormulaId, setSelectedFormulaId] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [demandPoints, setDemandPoints] = useState<Node[]>([
    {
      id: "1",
      type: "customer",
      name: "Nairobi Customer Zone",
      latitude: -1.2921,
      longitude: 36.8219,
      weight: 500,
      ownership: 'owned'
    },
    {
      id: "2", 
      type: "customer",
      name: "Mombasa Customer Zone",
      latitude: -4.0435,
      longitude: 39.6682,
      weight: 300,
      ownership: 'owned'
    },
    {
      id: "3",
      type: "customer", 
      name: "Kisumu Customer Zone",
      latitude: -0.0917,
      longitude: 34.7680,
      weight: 200,
      ownership: 'owned'
    }
  ]);
  const [cogResult, setCogResult] = useState<CogCalculationResult | null>(null);
  const [optimizedRoutes, setOptimizedRoutes] = useState<Route[]>([]);
  const [scenarioName, setScenarioName] = useState("");
  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [beforeMetrics, setBeforeMetrics] = useState<any>(null);
  const { user } = useAuth();
  
  const model = modelFormulaRegistry.find(m => m.id === selectedModel);

  useEffect(() => {
    if (model && model.formulas.length > 0) {
      setSelectedFormulaId(model.formulas[0].id);
    }
  }, [selectedModel, model]);

  useEffect(() => {
    loadSavedScenarios();
  }, [user]);

  const selectedFormula = model?.formulas.find(f => f.id === selectedFormulaId);

  const loadSavedScenarios = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('facility_locations')
        .select('*')
        .eq('user_id', user.id)
        .eq('scenario_type', 'center_of_gravity')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedScenarios(data || []);
    } catch (error) {
      console.error('Error loading scenarios:', error);
    }
  };

  const saveScenario = async () => {
    if (!user || !scenarioName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a scenario name.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const scenarioData = {
        project_id: user.id, // Using user ID as project ID for simplicity
        user_id: user.id,
        scenario_name: scenarioName,
        scenario_type: 'center_of_gravity',
        demand_points: demandPoints,
        optimization_params: {
          formula: selectedFormulaId,
          application: selectedApplicationId
        },
        optimization_results: cogResult,
        facilities: cogResult ? [{
          id: 'cog-result',
          type: 'distribution',
          name: 'Optimized Hub',
          latitude: cogResult.latitude,
          longitude: cogResult.longitude,
          ownership: 'owned'
        }] : []
      };

      const { error } = await supabase
        .from('facility_locations')
        .insert(scenarioData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scenario saved successfully.",
      });
      
      setShowSaveDialog(false);
      setScenarioName("");
      loadSavedScenarios();
    } catch (error) {
      console.error('Error saving scenario:', error);
      toast({
        title: "Error",
        description: "Failed to save scenario.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const loadScenario = async (scenarioId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('facility_locations')
        .select('*')
        .eq('id', scenarioId)
        .single();

      if (error) throw error;

      setDemandPoints(data.demand_points || []);
      setCogResult(data.optimization_results);
      setSelectedFormulaId(data.optimization_params?.formula || "");
      setSelectedApplicationId(data.optimization_params?.application || "");

      // Recalculate optimized routes if we have results
      if (data.optimization_results) {
        const newOptimizedRoutes = (data.demand_points || []).map((dp: Node) => ({
          id: `route-${dp.id}-cog`,
          startNodeId: dp.id,
          endNodeId: 'cog-result',
          label: `Optimized route for ${dp.name}`,
          color: '#3b82f6',
          isOptimized: true
        }));
        setOptimizedRoutes(newOptimizedRoutes);
      }

      toast({
        title: "Success",
        description: "Scenario loaded successfully.",
      });
      
      setShowLoadDialog(false);
    } catch (error) {
      console.error('Error loading scenario:', error);
      toast({
        title: "Error",
        description: "Failed to load scenario.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateBeforeMetrics = () => {
    if (demandPoints.length < 2) return null;

    // Calculate metrics for current state (assuming first point as current facility)
    const currentFacility = demandPoints[0];
    let totalDistance = 0;
    let totalCost = 0;

    demandPoints.forEach(point => {
      const distance = calculateHaversineDistance(
        currentFacility.latitude, currentFacility.longitude,
        point.latitude, point.longitude
      );
      const weight = point.weight || 1;
      totalDistance += distance;
      totalCost += distance * weight * 10;
    });

    return { totalDistance, totalCost };
  };

  const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleResultsCalculated = (results: CogCalculationResult) => {
    setCogResult(results);
    
    // Calculate before metrics
    setBeforeMetrics(calculateBeforeMetrics());
    
    const cogNode: Node = {
      id: 'cog-result',
      type: 'distribution',
      name: 'Optimized Hub',
      latitude: results.latitude,
      longitude: results.longitude,
      ownership: 'owned'
    };
    
    const newOptimizedRoutes = demandPoints.map(dp => ({
      id: `route-${dp.id}-cog`,
      startNodeId: dp.id,
      endNodeId: 'cog-result',
      label: `Optimized route for ${dp.name}`,
      color: '#3b82f6',
      isOptimized: true
    }));

    setOptimizedRoutes(newOptimizedRoutes);
    
    toast({
      title: "Optimization Complete",
      description: `New center of gravity calculated at ${results.latitude.toFixed(4)}, ${results.longitude.toFixed(4)}.`,
    });
  };

  const handleMapClick = (lat: number, lng: number) => {
    const newPoint: Node = {
      id: `dp-${Date.now()}`,
      type: 'customer',
      name: `New Demand Point`,
      latitude: lat,
      longitude: lng,
      weight: 100,
      ownership: 'owned',
    };
    setDemandPoints(prevPoints => [...prevPoints, newPoint]);
    toast({
      title: "Node Added",
      description: "A new demand point has been added to the map.",
    });
  };

  const resetScenario = () => {
    setDemandPoints([
      {
        id: "1",
        type: "customer",
        name: "Nairobi Customer Zone",
        latitude: -1.2921,
        longitude: 36.8219,
        weight: 500,
        ownership: 'owned'
      },
      {
        id: "2", 
        type: "customer",
        name: "Mombasa Customer Zone",
        latitude: -4.0435,
        longitude: 39.6682,
        weight: 300,
        ownership: 'owned'
      },
      {
        id: "3",
        type: "customer", 
        name: "Kisumu Customer Zone",
        latitude: -0.0917,
        longitude: 34.7680,
        weight: 200,
        ownership: 'owned'
      }
    ]);
    setCogResult(null);
    setOptimizedRoutes([]);
    setBeforeMetrics(null);
    toast({
      title: "Reset Complete",
      description: "Scenario has been reset to default values.",
    });
  };

  const cogMetrics = cogResult ? {
    totalDistance: cogResult.totalDistance,
    totalCost: cogResult.totalCost,
    efficiencyScore: cogResult.efficiencyScore
  } : null;

  const mapNodes = cogResult ? [...demandPoints, {
    id: 'cog-result',
    type: 'distribution',
    name: 'Optimized Hub',
    latitude: cogResult.latitude,
    longitude: cogResult.longitude,
    ownership: 'owned'
  }] : demandPoints;

  if (!model) {
    return <div>Model not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Target className="h-8 w-8" />
          Center of Gravity Analysis - Enterprise Grade
        </h1>
        <p className="text-muted-foreground">
          Visually plot demand points, run advanced calculations, and see the optimized location instantly on the map.
        </p>
      </div>

      <ModelFormulas modelId="center-of-gravity" />

      <Tabs defaultValue="enterprise-calculators" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enterprise-calculators">
            <Building2 className="h-4 w-4 mr-2" />
            Interactive Map & Calculator
          </TabsTrigger>
          <TabsTrigger value="instructions">Help & Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="enterprise-calculators" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-[600px]">
                <NetworkMap
                  nodes={mapNodes}
                  routes={optimizedRoutes}
                  onMapClick={handleMapClick}
                  onNodesChange={setDemandPoints}
                  showLegend={true}
                />
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Calculation Engine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Formula</label>
                    <CogFormulaSelector
                      formulas={model.formulas}
                      selectedFormulaId={selectedFormulaId}
                      onFormulaChange={setSelectedFormulaId}
                    />
                  </div>
                  <CompleteCogCalculation
                    demandPoints={demandPoints}
                    selectedFormula={selectedFormulaId}
                    onResultsCalculated={handleResultsCalculated}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Scenario Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          Save Scenario
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Save Scenario</DialogTitle>
                          <DialogDescription>
                            Save your current configuration and results for later use.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="scenario-name">Scenario Name</Label>
                            <Input
                              id="scenario-name"
                              value={scenarioName}
                              onChange={(e) => setScenarioName(e.target.value)}
                              placeholder="Enter scenario name..."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={saveScenario} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Scenario"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Load Scenario
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Load Scenario</DialogTitle>
                          <DialogDescription>
                            Load a previously saved scenario.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {savedScenarios.length === 0 ? (
                            <p className="text-muted-foreground">No saved scenarios found.</p>
                          ) : (
                            <div className="space-y-2">
                              {savedScenarios.map((scenario) => (
                                <div
                                  key={scenario.id}
                                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                                  onClick={() => loadScenario(scenario.id)}
                                >
                                  <div>
                                    <p className="font-medium">{scenario.scenario_name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(scenario.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowLoadDialog(false)}>
                            Cancel
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetScenario}
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                </CardContent>
              </Card>

              {cogResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Optimization Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">Optimal Facility Location (Lat, Lng)</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {cogResult.latitude.toFixed(6)}°, {cogResult.longitude.toFixed(6)}°
                        </p>
                      </div>
                      
                      {beforeMetrics && (
                        <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h4 className="font-medium text-sm">Before vs After Comparison</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Distance:</span>
                              <div className="font-medium">
                                {beforeMetrics.totalDistance.toFixed(1)} km → {cogResult.totalDistance.toFixed(1)} km
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Cost:</span>
                              <div className="font-medium">
                                KES {beforeMetrics.totalCost.toLocaleString()} → KES {cogResult.totalCost.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Savings:</span>
                            <div className="font-medium text-green-600">
                              {((beforeMetrics.totalCost - cogResult.totalCost) / beforeMetrics.totalCost * 100).toFixed(1)}% cost reduction
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Optimized Distance:</span>
                          <Badge variant="outline">{cogResult.totalDistance.toFixed(2)} km</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Total Cost:</span>
                          <Badge variant="outline">KES {cogResult.totalCost.toLocaleString()}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Efficiency Score:</span>
                          <Badge variant="default">{cogResult.efficiencyScore.toFixed(1)}%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Algorithm Used:</span>
                          <Badge variant="secondary">{cogResult.algorithmUsed}</Badge>
                        </div>
                      </div>
                      <ExportPdfButton
                        exportId="cog-calculation-results"
                        fileName="cog-analysis-report"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 mt-6">
             <Card>
                <CardHeader>
                  <CardTitle>Demand Points Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CogDemandWeights 
                    points={demandPoints}
                    onPointsChange={setDemandPoints}
                  />
                </CardContent>
              </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="instructions">
          <CogInstructions 
            selectedApplication={selectedApplicationId}
            selectedFormula={selectedFormula?.name || ""}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CenterOfGravity;
