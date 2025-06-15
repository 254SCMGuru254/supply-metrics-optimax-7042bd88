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
import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";
import { Badge } from "@/components/ui/badge";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { ModelFormulas } from "@/components/shared/ModelFormulas";
import { Calculator, TrendingUp, Target } from "lucide-react";
import type { Node } from "@/components/map/MapTypes";

const CenterOfGravity = () => {
  const [selectedModel, setSelectedModel] = useState("center-of-gravity");
  const [selectedFormulaId, setSelectedFormulaId] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [demandPoints, setDemandPoints] = useState<Node[]>([
    {
      id: "1",
      type: "retail",
      name: "Nairobi Customer Zone",
      latitude: -1.2921,
      longitude: 36.8219,
      weight: 500,
      ownership: 'owned'
    },
    {
      id: "2", 
      type: "retail",
      name: "Mombasa Customer Zone",
      latitude: -4.0435,
      longitude: 39.6682,
      weight: 300,
      ownership: 'owned'
    },
    {
      id: "3",
      type: "retail", 
      name: "Kisumu Customer Zone",
      latitude: -0.0917,
      longitude: 34.7680,
      weight: 200,
      ownership: 'owned'
    }
  ]);
  const [cogResult, setCogResult] = useState<CogCalculationResult | null>(null);

  const model = modelFormulaRegistry.find(m => m.id === selectedModel);

  useEffect(() => {
    if (model && model.formulas.length > 0) {
      setSelectedFormulaId(model.formulas[0].id);
    }
  }, [selectedModel, model]);

  const selectedFormula = model?.formulas.find(f => f.id === selectedFormulaId);

  const handleResultsCalculated = (results: CogCalculationResult) => {
    setCogResult(results);
  };

  const cogMetrics = cogResult ? {
    totalDistance: cogResult.totalDistance,
    totalCost: cogResult.totalCost,
    efficiencyScore: cogResult.efficiencyScore
  } : null;

  if (!model) {
    return <div>Model not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Target className="h-8 w-8" />
          Center of Gravity Analysis
        </h1>
        <p className="text-muted-foreground">
          Find optimal facility locations using weighted demand points and advanced distance formulas.
        </p>
      </div>

      <ModelFormulas modelId="center-of-gravity" />

      <Tabs defaultValue="calculation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculation">Calculation</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="results">Results & Metrics</TabsTrigger>
          <TabsTrigger value="instructions">Help & Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="calculation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Formula Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CogFormulaSelector
                    formulas={model.formulas}
                    selectedFormulaId={selectedFormulaId}
                    onFormulaChange={setSelectedFormulaId}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Application Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <CogApplicationSelector
                    selectedApplication={selectedApplicationId}
                    onApplicationChange={setSelectedApplicationId}
                  />
                </CardContent>
              </Card>

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

              <CompleteCogCalculation
                demandPoints={demandPoints}
                selectedFormula={selectedFormulaId}
                onResultsCalculated={handleResultsCalculated}
              />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Quick Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cogResult ? (
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Center of Gravity</p>
                        <p className="text-lg font-bold">
                          {cogResult.latitude.toFixed(6)}°, {cogResult.longitude.toFixed(6)}°
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Distance:</span>
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
                          <span className="text-sm">Algorithm:</span>
                          <Badge variant="secondary">{cogResult.algorithmUsed}</Badge>
                        </div>
                      </div>
                      <ExportPdfButton
                        title="Center of Gravity Analysis Report"
                        fileName="cog-analysis-report"
                        data={cogResult}
                        isOptimized={true}
                        optimizationType="Center of Gravity"
                        results={cogResult}
                        aiPrompt="Analyze this center of gravity calculation and provide strategic recommendations for facility location in Kenya, considering logistics costs, market access, and operational efficiency."
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Configure parameters and calculate COG to see metrics
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data">
          <CogDataOperations 
            nodes={demandPoints}
            onImport={setDemandPoints}
            onAddWarehouse={() => {}}
            optimized={false}
          />
        </TabsContent>

        <TabsContent value="results">
          <div className="space-y-6">
            <CogMetrics 
              result={cogResult ? { latitude: cogResult.latitude, longitude: cogResult.longitude } : null}
              metrics={cogMetrics}
              selectedFormula={selectedFormula?.name || ""}
            />
            <CogRecommendations 
              cogResult={cogResult ? { latitude: cogResult.latitude, longitude: cogResult.longitude } : null}
              metrics={cogMetrics}
              applicationContext={selectedApplicationId}
            />
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
