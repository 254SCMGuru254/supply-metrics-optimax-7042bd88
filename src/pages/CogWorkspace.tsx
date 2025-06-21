import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { NetworkMap } from "@/components/NetworkMap";
import { CogFormulaSelector } from "@/components/cog/CogFormulaSelector";
import { CogDemandWeights } from "@/components/cog/CogDemandWeights";
import { CompleteCogCalculation, CogCalculationResult } from "@/components/cog/CompleteCogCalculation";
import { CogMetrics } from "@/components/cog/CogMetrics";
import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { Node, Route } from "@/components/map/MapTypes";
import { calculateHaversineDistance } from "@/components/cog/CogUtils";
import { Calculator, Map, List, BarChart3, Save, FolderOpen, RotateCcw } from "lucide-react";

export const CogWorkspace = () => {
  const { user } = useAuth();
  const [demandPoints, setDemandPoints] = useState<Node[]>([
    { id: "1", type: "customer", name: "Nairobi", latitude: -1.2921, longitude: 36.8219, weight: 500, ownership: 'owned' },
    { id: "2", type: "customer", name: "Mombasa", latitude: -4.0435, longitude: 39.6682, weight: 300, ownership: 'owned' },
    { id: "3", type: "customer", name: "Kisumu", latitude: -0.0917, longitude: 34.7680, weight: 200, ownership: 'owned' }
  ]);
  
  const [cogResult, setCogResult] = useState<CogCalculationResult | null>(null);
  const [optimizedRoutes, setOptimizedRoutes] = useState<Route[]>([]);
  const [mapNodes, setMapNodes] = useState<Node[]>([]);
  const [selectedFormulaId, setSelectedFormulaId] = useState("weighted-center-gravity");
  const [beforeMetrics, setBeforeMetrics] = useState<any>(null);
  const [scenarioName, setScenarioName] = useState("");
  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  
  const cogModel = modelFormulaRegistry.find(m => m.id === "center-of-gravity");

  useEffect(() => { loadSavedScenarios(); }, [user]);

  useEffect(() => {
    let currentNodes = [...demandPoints];
    if (cogResult) {
      currentNodes.push({ id: 'cog-result', type: 'facility', name: 'Optimized Location', latitude: cogResult.latitude, longitude: cogResult.longitude, ownership: 'proposed' });
    }
    setMapNodes(currentNodes);
  }, [demandPoints, cogResult]);

  const calculateBaselineMetrics = () => {
    if (demandPoints.length < 2) return null;
    const baselineFacility = demandPoints[0];
    let totalDistance = 0;
    let totalCost = 0;
    demandPoints.forEach(point => {
      const distance = calculateHaversineDistance(baselineFacility.latitude, baselineFacility.longitude, point.latitude, point.longitude);
      totalDistance += distance;
      totalCost += distance * (point.weight || 1) * 10;
    });
    const totalWeight = demandPoints.reduce((sum, p) => sum + (p.weight || 1), 0);
    const maxPossibleCost = totalWeight * 10000;
    const efficiencyScore = Math.max(0, 100 - (totalCost / (maxPossibleCost + 1)) * 100);
    return { totalDistance, totalCost, efficiencyScore };
  };

  const handleResultsCalculated = (results: CogCalculationResult) => {
    setCogResult(results);
    setBeforeMetrics(calculateBaselineMetrics());
    const newOptimizedRoutes = demandPoints.map(dp => ({ id: `route-${dp.id}-cog`, startNodeId: dp.id, endNodeId: 'cog-result', label: `Optimized route to ${dp.name}`, color: '#16a34a', isOptimized: true }));
    setOptimizedRoutes(newOptimizedRoutes);
  };
  
  const resetScenario = () => {
    setCogResult(null);
    setOptimizedRoutes([]);
    setBeforeMetrics(null);
    setDemandPoints([
        { id: "1", type: "customer", name: "Nairobi", latitude: -1.2921, longitude: 36.8219, weight: 500, ownership: 'owned' },
        { id: "2", type: "customer", name: "Mombasa", latitude: -4.0435, longitude: 39.6682, weight: 300, ownership: 'owned' },
        { id: "3", type: "customer", name: "Kisumu", latitude: -0.0917, longitude: 34.7680, weight: 200, ownership: 'owned' }
    ]);
    toast({ title: "Scenario Reset", description: "The view has been reset to the default state." });
  };

  const loadSavedScenarios = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('facility_locations').select('*').eq('user_id', user.id).eq('scenario_type', 'center_of_gravity').order('created_at', { ascending: false });
      if (error) throw error;
      setSavedScenarios(data || []);
    } catch (error) { console.error('Error loading scenarios:', error); }
  };

  const saveScenario = async () => {
    if (!user || !scenarioName.trim()) { toast({ title: "Error", description: "Please enter a scenario name.", variant: "destructive" }); return; }
    try {
      const { error } = await supabase.from('facility_locations').insert({ user_id: user.id, scenario_name: scenarioName, scenario_type: 'center_of_gravity', demand_points: demandPoints, optimization_params: { formula: selectedFormulaId }, optimization_results: cogResult });
      if (error) throw error;
      toast({ title: "Success", description: "Scenario saved successfully." });
      setShowSaveDialog(false); setScenarioName(""); loadSavedScenarios();
    } catch (error) { toast({ title: "Error", description: "Failed to save scenario.", variant: "destructive" }); }
  };

  const loadScenario = async (scenarioId: string) => {
    const scenario = savedScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    setDemandPoints(scenario.demand_points || []);
    setSelectedFormulaId(scenario.optimization_params?.formula || "weighted-center-gravity");
    if (scenario.optimization_results) { handleResultsCalculated(scenario.optimization_results); }
    else { setCogResult(null); setOptimizedRoutes([]); setBeforeMetrics(null); }
    toast({ title: "Success", description: `Scenario "${scenario.scenario_name}" loaded.` });
    setShowLoadDialog(false);
  };
  
  const handleMapClick = (lat: number, lng: number) => {
    const newPoint: Node = { id: crypto.randomUUID(), type: 'customer', name: `New Point ${demandPoints.length + 1}`, latitude: lat, longitude: lng, weight: 100, ownership: 'owned' };
    setDemandPoints([...demandPoints, newPoint]);
    toast({ title: 'Demand Point Added', description: 'A new location was added to the map.' });
  };

  return (
    <div className="flex h-full bg-muted/40">
      <div className="w-1/3 xl:w-1/4 p-4 space-y-4 overflow-y-auto">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center"><Calculator className="mr-2 text-primary" /> COG Controls</CardTitle>
            <CardDescription>Configure, run, and manage your analysis.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex gap-2 mb-4">
                 <Button onClick={() => setShowSaveDialog(true)} className="flex-1"><Save className="mr-2 h-4 w-4" /> Save</Button>
                 <Button onClick={() => setShowLoadDialog(true)} variant="outline" className="flex-1"><FolderOpen className="mr-2 h-4 w-4" /> Load</Button>
                 <Button onClick={resetScenario} variant="destructive-outline" size="icon"><RotateCcw className="h-4 w-4" /></Button>
            </div>
             <CompleteCogCalculation demandPoints={demandPoints} selectedFormula={selectedFormulaId} onResultsCalculated={handleResultsCalculated} />
          </CardContent>
        </Card>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">1. Setup</TabsTrigger>
            <TabsTrigger value="data">2. Data</TabsTrigger>
            <TabsTrigger value="results">3. Results</TabsTrigger>
          </TabsList>
          <TabsContent value="setup" className="pt-4"><Card><CardHeader><CardTitle>Select Formula</CardTitle></CardHeader><CardContent>{cogModel && <CogFormulaSelector formulas={cogModel.formulas} selectedFormulaId={selectedFormulaId} onFormulaChange={setSelectedFormulaId} />}</CardContent></Card></TabsContent>
          <TabsContent value="data" className="pt-4"><CogDemandWeights points={demandPoints} onPointsChange={setDemandPoints} /></TabsContent>
          <TabsContent value="results" className="pt-4">
            <Card><CardHeader><CardTitle>Analysis Results</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {cogResult && beforeMetrics ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><h4 className="font-semibold mb-2 text-center">Baseline</h4><CogMetrics result={null} metrics={beforeMetrics} selectedFormula="N/A" /></div>
                    <div><h4 className="font-semibold mb-2 text-center text-green-600">Optimized</h4><CogMetrics result={cogResult} metrics={cogResult} selectedFormula={selectedFormulaId} /></div>
                  </div>
                ) : <div className="text-center text-muted-foreground py-8">Run a calculation to see results.</div>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-2/3 xl:w-3/4 h-full border-l"><NetworkMap nodes={mapNodes} routes={optimizedRoutes} onMapClick={handleMapClick} config={{ isDraggable: true, showToolbar: true }} /></div>
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}><DialogContent><DialogHeader><DialogTitle>Save Scenario</DialogTitle></DialogHeader><div className="py-4"><Label htmlFor="scenario-name">Scenario Name</Label><Input id="scenario-name" value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} /></div><DialogFooter><Button onClick={saveScenario}>Save</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}><DialogContent><DialogHeader><DialogTitle>Load Scenario</DialogTitle></DialogHeader><div className="py-4 space-y-2">{savedScenarios.length > 0 ? savedScenarios.map(s => (<Button key={s.id} variant="outline" className="w-full justify-start" onClick={() => loadScenario(s.id)}>{s.scenario_name}</Button>)) : <p>No saved scenarios found.</p>}</div></DialogContent></Dialog>
    </div>
  );
}; 