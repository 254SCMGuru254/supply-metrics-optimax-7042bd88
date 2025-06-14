
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CogFormulaSelector } from "@/components/cog/CogFormulaSelector";
import { CogMetrics } from "@/components/cog/CogMetrics";
import { CogDataOperations } from "@/components/cog/CogDataOperations";
import { CogInstructions } from "@/components/cog/CogInstructions";
import { CogApplicationSelector } from "@/components/cog/CogApplicationSelector";
import { CenterOfGravityCalculationModel } from "@/components/cog/CenterOfGravityCalculationModel";
import { CogDemandWeights } from "@/components/cog/CogDemandWeights";
import { CogRecommendations } from "@/components/cog/CogRecommendations";
import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { MapPin, Calculator, TrendingUp, Target } from "lucide-react";

const CenterOfGravity = () => {
  const [selectedModel, setSelectedModel] = useState("center-of-gravity");
  const [selectedFormulaId, setSelectedFormulaId] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [demandPoints, setDemandPoints] = useState([]);
  const [cogResult, setCogResult] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const model = modelFormulaRegistry.find(m => m.id === selectedModel);

  useEffect(() => {
    if (model && model.formulas.length > 0) {
      setSelectedFormulaId(model.formulas[0].id);
    }
  }, [selectedModel, model]);

  const selectedFormula = model?.formulas.find(f => f.id === selectedFormulaId);
  const selectedApplication = model?.applications?.find(a => a.id === selectedApplicationId);

  const handleResultCalculated = (result, calculatedMetrics) => {
    setCogResult(result);
    setMetrics(calculatedMetrics);
  };

  if (!model) {
    return <div>Model not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <MapPin className="h-8 w-8 text-blue-600" />
          Center of Gravity Analysis
        </h1>
        <p className="text-muted-foreground">
          Find the optimal location for facilities, warehouses, or distribution centers using center of gravity calculations.
        </p>
      </div>

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
                    model={model}
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
                    applications={model.applications || []}
                    selectedApplicationId={selectedApplicationId}
                    onApplicationChange={setSelectedApplicationId}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weight Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CogDemandWeights 
                    demandPoints={demandPoints}
                    onWeightsChange={(points) => setDemandPoints(points)}
                  />
                </CardContent>
              </Card>
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
                          {cogResult.latitude?.toFixed(6)}, {cogResult.longitude?.toFixed(6)}
                        </p>
                      </div>
                      {metrics && (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Total Distance:</span>
                            <Badge variant="outline">{metrics.totalDistance?.toFixed(2)} km</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Weighted Cost:</span>
                            <Badge variant="outline">KES {metrics.weightedCost?.toLocaleString()}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Efficiency Score:</span>
                            <Badge variant="default">{metrics.efficiencyScore?.toFixed(1)}%</Badge>
                          </div>
                        </div>
                      )}
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
                      Calculate COG to see metrics
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedApplication && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Application Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="secondary">{selectedApplication.name}</Badge>
                      <p className="text-sm text-muted-foreground">
                        {selectedApplication.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <CenterOfGravityCalculationModel
            selectedFormula={selectedFormula}
            demandPoints={demandPoints}
            onResultCalculated={handleResultCalculated}
          />
        </TabsContent>

        <TabsContent value="data">
          <CogDataOperations 
            onDataLoaded={(points) => setDemandPoints(points)}
            demandPoints={demandPoints}
          />
        </TabsContent>

        <TabsContent value="results">
          <div className="space-y-6">
            <CogMetrics 
              result={cogResult}
              metrics={metrics}
              selectedFormula={selectedFormula}
            />
            <CogRecommendations 
              result={cogResult}
              metrics={metrics}
              selectedApplication={selectedApplication}
            />
          </div>
        </TabsContent>

        <TabsContent value="instructions">
          <CogInstructions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CenterOfGravity;
