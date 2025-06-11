import { useState, useEffect } from "react";
import { CogApplicationSelector } from "@/components/cog/CogApplicationSelector";
import { CogFormulaSelector } from "@/components/cog/CogFormulaSelector";
import { CogDemandWeights } from "@/components/cog/CogDemandWeights";
import { CogMetrics } from "@/components/cog/CogMetrics";
import { CogRecommendations } from "@/components/cog/CogRecommendations";
import { CogInstructions } from "@/components/cog/CogInstructions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { BookOpen, Target, Calculator, BarChart3 } from "lucide-react";
import type { Node } from "@/components/map/MapTypes";
import { NetworkMap } from "@/components/NetworkMap";
import { calculateCenterOfGravity, calculateTotalCost, calculateTotalDistance } from "@/components/cog/CogUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";

const cogModel = modelFormulaRegistry.find(m => m.id === "center-of-gravity");

// Dynamic dispatcher for backend functions
const formulaDispatcher: Record<string, Function> = {
  calculateCOGWeighted: (values: any) => calculateCenterOfGravity(values.demandPoints || [], "weighted"),
  calculateCOGHaversine: (values: any) => calculateCenterOfGravity(values.demandPoints || [], "haversine"),
  calculateCOGManhattan: (values: any) => calculateCenterOfGravity(values.demandPoints || [], "manhattan"),
  // Add other mappings as you implement more formulas
};

export default function CenterOfGravity() {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<string>("");
  const [selectedFormulaId, setSelectedFormulaId] = useState(cogModel?.formulas[0]?.id || "");
  const [demandNodes, setDemandNodes] = useState<Node[]>([
    {
      id: crypto.randomUUID(),
      type: "retail",
      name: "Nairobi Store",
      latitude: -1.2921,
      longitude: 36.8219,
      weight: 100,
      ownership: 'owned'
    }
  ]);
  const [cogResult, setCogResult] = useState<{ lat: number; lng: number } | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (demandNodes.length > 0) {
      const result = calculateCenterOfGravity(demandNodes, selectedFormulaId);
      setCogResult(result);
    }
  }, [demandNodes, selectedFormulaId]);

  const allNodes: Node[] = [...demandNodes];
  
  if (cogResult) {
    allNodes.push({
      id: "cog",
      type: "warehouse",
      name: "Center of Gravity",
      latitude: cogResult.lat,
      longitude: cogResult.lng,
      capacity: 50000,
      ownership: 'owned'
    });
  }

  if (!cogModel) return <div>Model not found.</div>;
  const selectedFormula = cogModel.formulas.find(f => f.id === selectedFormulaId);

  const handleInputChange = (name: string, value: any) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleCalculate = () => {
    if (selectedFormula && selectedFormula.backendFunction && formulaDispatcher[selectedFormula.backendFunction]) {
      const output = formulaDispatcher[selectedFormula.backendFunction](inputValues);
      setResult(output);
    } else {
      setResult({ message: `Calculated using ${selectedFormula?.name}` });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8" id="cog-analysis-content">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Center of Gravity Analysis</h1>
          <p className="text-gray-600">
            Mathematical model for optimal facility location using weighted demand centers
          </p>
        </div>
        <ExportPdfButton 
          title="Center of Gravity Analysis Report"
          exportId="cog-analysis-content"
          fileName="cog_analysis_report"
        />
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Setup
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Data Input
          </TabsTrigger>
          <TabsTrigger value="calculate" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculate
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Map View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Application Selection
                </CardTitle>
                <CardDescription>
                  Choose your specific supply chain application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CogApplicationSelector 
                  selectedApplication={selectedApplication}
                  onApplicationChange={setSelectedApplication}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Formula Selection
                </CardTitle>
                <CardDescription>
                  Select the mathematical approach for COG calculation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <label className="block font-medium mb-2">Select Formula</label>
                  <select
                    className="border rounded px-3 py-2"
                    value={selectedFormulaId}
                    onChange={e => setSelectedFormulaId(e.target.value)}
                  >
                    {cogModel.formulas.map(formula => (
                      <option key={formula.id} value={formula.id}>{formula.name}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          <CogInstructions 
            selectedApplication={selectedApplication}
            selectedFormula={selectedFormula}
          />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Demand Points Configuration</CardTitle>
              <CardDescription>
                Add and configure demand centers with their weights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CogDemandWeights 
                demandNodes={demandNodes}
                setDemandNodes={setDemandNodes}
                selectedFormula={selectedFormula}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>COG Calculation Results</CardTitle>
              <CardDescription>
                Mathematical computation results and key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CogMetrics 
                demandNodes={demandNodes}
                cogResult={cogResult}
                selectedFormula={selectedFormula}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Analysis & Recommendations</CardTitle>
              <CardDescription>
                Business insights and implementation guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CogRecommendations 
                selectedApplication={selectedApplication}
                cogResult={cogResult}
                demandNodes={demandNodes}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Visualization</CardTitle>
              <CardDescription>
                Interactive map showing demand points and calculated center of gravity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cogResult && (
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      COG Coordinates: {cogResult.lat.toFixed(4)}, {cogResult.lng.toFixed(4)}
                    </Badge>
                    <Badge variant="secondary">
                      Total Distance: {calculateTotalDistance(demandNodes, cogResult, selectedFormulaId).toFixed(2)} km
                    </Badge>
                    <Badge variant="secondary">
                      Total Cost: {calculateTotalCost(demandNodes, cogResult, selectedFormulaId).toFixed(2)}
                    </Badge>
                  </div>
                )}
                
                <div className="h-[500px] w-full">
                  <NetworkMap nodes={allNodes} routes={[]} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedFormula && (
        <Card className="p-4 mt-4">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">{selectedFormula.name}</h2>
            <p className="text-muted-foreground mb-4">{selectedFormula.description}</p>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleCalculate(); }}>
              {selectedFormula.inputs.map(input => (
                <div key={input.name}>
                  <label className="block mb-1 font-medium">{input.label}</label>
                  <Input
                    type={input.type === "number" ? "number" : "text"}
                    value={inputValues[input.name] || ""}
                    onChange={e => handleInputChange(input.name, e.target.value)}
                  />
                </div>
              ))}
              <Button type="submit" className="mt-4">Calculate</Button>
            </form>
            {result && (
              <div className="mt-6 p-4 bg-muted rounded">
                <strong>Result:</strong> <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
