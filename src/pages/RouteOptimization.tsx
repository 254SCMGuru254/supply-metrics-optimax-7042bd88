import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";
import { optimizationService } from "@/services/OptimizationService";
import { useToast } from "@/hooks/use-toast";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { AdvancedConstraintSolver } from "@/components/constraints/AdvancedConstraintSolver";
import { ModelFormulas } from "@/components/shared/ModelFormulas";
import { Truck, MapPin, Clock, DollarSign, TrendingUp } from "lucide-react";

const routeModel = modelFormulaRegistry.find(m => m.id === "route-optimization");

const RouteOptimization = () => {
  const [selectedFormulaId, setSelectedFormulaId] = useState(routeModel?.formulas[0]?.id || "");
  const [inputValues, setInputValues] = useState<Record<string, any>>({
    algorithm: 'nearest_neighbor',
    vehicleCapacity: 1000,
    maxDistance: 500,
    costPerKm: 1.5,
    timeWindows: false
  });
  const [result, setResult] = useState<any>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [projectId] = useState('demo-project-id'); // In real app, this would come from context
  const { toast } = useToast();

  if (!routeModel) return <div>Model not found.</div>;
  const selectedFormula = routeModel.formulas.find(f => f.id === selectedFormulaId);

  const handleInputChange = (name: string, value: any) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      const response = await optimizationService.optimizeRoute(projectId, inputValues);
      
      if (response.success) {
        setResult(response.results);
        toast({
          title: "Route Optimization Complete",
          description: `Optimization completed in ${response.executionTime}ms. ${response.costSavings ? `Cost savings: ${response.costSavings}%` : ''}`,
        });
      } else {
        toast({
          title: "Optimization Failed",
          description: "Please check your inputs and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Error",
        description: "Failed to run optimization.",
        variant: "destructive"
      });
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Route Optimization</h1>
          <p className="text-muted-foreground">
            Optimize delivery routes to minimize distance and costs while satisfying constraints.
          </p>
        </div>
        <ExportPdfButton fileName="route-optimization" results={result} />
      </div>

      <ModelFormulas modelId="route-optimization" />

      <Tabs defaultValue="optimization" className="space-y-6">
        <TabsList>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="optimization">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Route Parameters</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-medium">Algorithm</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={inputValues.algorithm}
                      onChange={e => handleInputChange('algorithm', e.target.value)}
                    >
                      <option value="nearest_neighbor">Nearest Neighbor</option>
                      <option value="genetic_algorithm">Genetic Algorithm</option>
                      <option value="simulated_annealing">Simulated Annealing</option>
                      <option value="ant_colony">Ant Colony Optimization</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-medium">Vehicle Capacity (kg)</label>
                      <Input
                        type="number"
                        value={inputValues.vehicleCapacity}
                        onChange={e => handleInputChange('vehicleCapacity', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">Max Distance (km)</label>
                      <Input
                        type="number"
                        value={inputValues.maxDistance}
                        onChange={e => handleInputChange('maxDistance', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-medium">Cost per km (KES)</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={inputValues.costPerKm}
                        onChange={e => handleInputChange('costPerKm', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-6">
                      <input
                        type="checkbox"
                        id="timeWindows"
                        checked={inputValues.timeWindows}
                        onChange={e => handleInputChange('timeWindows', e.target.checked)}
                      />
                      <label htmlFor="timeWindows">Enable Time Windows</label>
                    </div>
                  </div>

                  <Button 
                    onClick={handleOptimize} 
                    disabled={optimizing}
                    className="w-full"
                  >
                    {optimizing ? 'Optimizing...' : 'Optimize Routes'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Metrics</h2>
                {result ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Truck className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Vehicles Used</p>
                          <p className="text-2xl font-bold">{result.vehiclesUsed || 1}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <MapPin className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Distance</p>
                          <p className="text-2xl font-bold">{result.totalDistance?.toFixed(1) || 0} km</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <DollarSign className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Cost</p>
                          <p className="text-2xl font-bold">KES {result.totalCost?.toLocaleString() || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <TrendingUp className="h-8 w-8 text-purple-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Efficiency</p>
                          <p className="text-2xl font-bold">{result.metrics?.efficiency || 0}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <ExportPdfButton
                        title="Route Optimization Report"
                        fileName="route-optimization-report"
                        data={result}
                        isOptimized={true}
                        optimizationType="Route Optimization"
                        results={result}
                        aiPrompt="Analyze this route optimization result and provide insights on cost savings, efficiency improvements, and implementation recommendations for a Kenyan logistics company."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Run optimization to see results
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="constraints">
          <AdvancedConstraintSolver 
            projectId={projectId}
            onConstraintsChange={(constraints) => {
              console.log('Constraints updated:', constraints);
            }}
          />
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Detailed Results</h2>
              {result ? (
                <div className="space-y-6">
                  {result.optimizedRoute && (
                    <div>
                      <h3 className="font-medium mb-2">Route Sequence</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.optimizedRoute.map((nodeId: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {nodeId}
                            </span>
                            {index < result.optimizedRoute.length - 1 && (
                              <span className="mx-2 text-muted-foreground">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.metrics && (
                    <div>
                      <h3 className="font-medium mb-2">Performance Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Efficiency Score</p>
                          <p className="text-lg font-semibold">{result.metrics.efficiency}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Service Level</p>
                          <p className="text-lg font-semibold">{result.metrics.serviceLevel || 98}%</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Raw Results</h3>
                    <pre className="text-sm overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No results available. Run optimization first.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RouteOptimization;
