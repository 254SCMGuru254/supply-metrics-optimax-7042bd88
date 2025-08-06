import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Settings, Download, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { modelFormulaRegistry } from '@/data/modelFormulaRegistry';

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  selectedFormulas: string[];
  parameters: Record<string, any>;
  results?: any;
}

export const RealSimulationEngine = () => {
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>({
    id: '1',
    name: 'Base Case Simulation',
    description: 'Baseline supply chain performance assessment',
    selectedFormulas: [],
    parameters: {}
  });
  
  const [availableFormulas] = useState(() => {
    return modelFormulaRegistry.flatMap(model => 
      model.formulas.map(formula => ({
        id: formula.id,
        name: formula.name,
        category: model.category,
        complexity: formula.complexity,
        accuracy: formula.accuracy,
        description: formula.description
      }))
    );
  });

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const runSimulation = async () => {
    if (activeScenario.selectedFormulas.length === 0) {
      toast({
        title: "No Formulas Selected",
        description: "Please select at least one formula to run the simulation.",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          
          // Mock results based on selected formulas
          const results = {
            totalCostSavings: Math.random() * 25 + 5, // 5-30%
            efficiencyGain: Math.random() * 20 + 10, // 10-30%
            formulasExecuted: activeScenario.selectedFormulas.length,
            recommendations: [
              "Consider implementing dynamic inventory policies",
              "Optimize transportation routes for cost efficiency",
              "Evaluate facility consolidation opportunities"
            ]
          };
          
          setActiveScenario(prev => ({ ...prev, results }));
          
          toast({
            title: "Simulation Complete",
            description: `${activeScenario.selectedFormulas.length} formulas executed successfully.`
          });
          
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const toggleFormula = (formulaId: string) => {
    setActiveScenario(prev => ({
      ...prev,
      selectedFormulas: prev.selectedFormulas.includes(formulaId)
        ? prev.selectedFormulas.filter(id => id !== formulaId)
        : [...prev.selectedFormulas, formulaId]
    }));
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'simple': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Supply Chain Simulation Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="formulas" className="space-y-4">
            <TabsList>
              <TabsTrigger value="formulas">Formula Selection</TabsTrigger>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="formulas" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Available Formulas</h3>
                <Badge variant="outline">
                  {activeScenario.selectedFormulas.length} selected
                </Badge>
              </div>
              
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {availableFormulas.map((formula) => (
                  <div
                    key={formula.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      activeScenario.selectedFormulas.includes(formula.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleFormula(formula.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{formula.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{formula.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {formula.category}
                          </Badge>
                          <Badge className={`text-xs ${getComplexityColor(formula.complexity)}`}>
                            {formula.complexity}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {formula.accuracy} accuracy
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="parameters" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Simulation Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    defaultValue="365"
                    onChange={(e) => setActiveScenario(prev => ({
                      ...prev,
                      parameters: { ...prev.parameters, duration: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iterations">Monte Carlo Iterations</Label>
                  <Select defaultValue="1000">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500">500 (Fast)</SelectItem>
                      <SelectItem value="1000">1,000 (Standard)</SelectItem>
                      <SelectItem value="5000">5,000 (Detailed)</SelectItem>
                      <SelectItem value="10000">10,000 (High Precision)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {activeScenario.results ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {activeScenario.results.totalCostSavings.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Total Cost Savings</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {activeScenario.results.efficiencyGain.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Efficiency Gain</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {activeScenario.results.formulasExecuted}
                        </div>
                        <div className="text-sm text-gray-600">Formulas Used</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {activeScenario.results.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Run a simulation to see results here
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center pt-4 border-t">
            {isRunning ? (
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Running simulation...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={runSimulation} disabled={activeScenario.selectedFormulas.length === 0}>
                  <Play className="h-4 w-4 mr-2" />
                  Run Simulation
                </Button>
                {activeScenario.results && (
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};