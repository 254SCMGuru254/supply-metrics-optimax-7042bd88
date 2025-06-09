
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

export default function CenterOfGravity() {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<string>("");
  const [selectedFormula, setSelectedFormula] = useState<string>("weighted");
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

  useEffect(() => {
    if (demandNodes.length > 0) {
      const result = calculateCenterOfGravity(demandNodes, selectedFormula);
      setCogResult(result);
    }
  }, [demandNodes, selectedFormula]);

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
                <CogFormulaSelector 
                  selectedFormula={selectedFormula}
                  onFormulaChange={setSelectedFormula}
                />
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
                      Total Distance: {calculateTotalDistance(demandNodes, cogResult).toFixed(2)} km
                    </Badge>
                    <Badge variant="secondary">
                      Total Cost: {calculateTotalCost(demandNodes, cogResult, selectedFormula).toFixed(2)}
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
    </div>
  );
}
