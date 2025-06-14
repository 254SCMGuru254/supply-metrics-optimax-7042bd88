
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, RotateCcw, TrendingUp, AlertTriangle } from 'lucide-react';

interface SimulationResult {
  scenario: string;
  iterations: number;
  meanCost: number;
  variance: number;
  confidenceInterval: [number, number];
  riskMetrics: {
    valueAtRisk: number;
    conditionalValueAtRisk: number;
    maxLoss: number;
  };
}

interface SimulationEngineProps {
  projectId: string;
}

export function SimulationEngine({ projectId }: SimulationEngineProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [parameters, setParameters] = useState({
    iterations: 1000,
    demandVariability: 0.2,
    leadTimeVariability: 0.15,
    costVariability: 0.1,
    disruptionProbability: 0.05
  });
  const { toast } = useToast();

  const runMonteCarloSimulation = async () => {
    setIsRunning(true);
    setProgress(0);

    try {
      // Fetch project data
      const { data: nodes } = await supabase
        .from('supply_nodes')
        .select('*')
        .eq('project_id', projectId);

      const { data: routes } = await supabase
        .from('supply_routes')
        .select('*')
        .eq('project_id', projectId);

      if (!nodes || !routes) {
        throw new Error('No data found for simulation');
      }

      const simulationResults: SimulationResult[] = [];
      const scenarios = ['baseline', 'demand_spike', 'supply_disruption', 'cost_increase'];

      for (const scenario of scenarios) {
        const iterationResults: number[] = [];

        for (let i = 0; i < parameters.iterations; i++) {
          const cost = calculateScenarioCost(nodes, routes, scenario, parameters);
          iterationResults.push(cost);
          setProgress((scenarios.indexOf(scenario) * parameters.iterations + i + 1) / (scenarios.length * parameters.iterations) * 100);
          
          // Yield control to prevent UI blocking
          if (i % 100 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }

        const meanCost = iterationResults.reduce((sum, cost) => sum + cost, 0) / iterationResults.length;
        const variance = iterationResults.reduce((sum, cost) => sum + Math.pow(cost - meanCost, 2), 0) / iterationResults.length;
        const sortedResults = [...iterationResults].sort((a, b) => a - b);
        
        const var95 = sortedResults[Math.floor(0.95 * iterationResults.length)];
        const cvar95 = sortedResults.slice(Math.floor(0.95 * iterationResults.length)).reduce((sum, val) => sum + val, 0) / 
                      sortedResults.slice(Math.floor(0.95 * iterationResults.length)).length;

        simulationResults.push({
          scenario,
          iterations: parameters.iterations,
          meanCost,
          variance,
          confidenceInterval: [
            meanCost - 1.96 * Math.sqrt(variance / parameters.iterations),
            meanCost + 1.96 * Math.sqrt(variance / parameters.iterations)
          ],
          riskMetrics: {
            valueAtRisk: var95,
            conditionalValueAtRisk: cvar95,
            maxLoss: Math.max(...iterationResults)
          }
        });
      }

      setResults(simulationResults);

      // Save results to database
      await supabase.from('simulation_scenarios').insert({
        project_id: projectId,
        scenario_name: `Monte Carlo Analysis - ${new Date().toISOString()}`,
        scenario_type: 'optimization',
        parameters,
        results: simulationResults,
        status: 'completed'
      });

      toast({
        title: "Simulation Complete",
        description: `Monte Carlo simulation completed with ${parameters.iterations} iterations across ${scenarios.length} scenarios.`
      });

    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: "Simulation Error",
        description: "Failed to complete simulation analysis.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
      setProgress(100);
    }
  };

  const calculateScenarioCost = (nodes: any[], routes: any[], scenario: string, params: any): number => {
    let baseCost = routes.reduce((sum, route) => sum + (route.cost_per_unit * route.distance || 0), 0);
    
    // Add stochastic variations based on scenario
    switch (scenario) {
      case 'demand_spike':
        baseCost *= (1 + Math.random() * params.demandVariability * 2);
        break;
      case 'supply_disruption':
        if (Math.random() < params.disruptionProbability) {
          baseCost *= (1.5 + Math.random() * 0.5); // 50-100% cost increase
        }
        break;
      case 'cost_increase':
        baseCost *= (1 + Math.random() * params.costVariability);
        break;
      default:
        baseCost *= (1 + (Math.random() - 0.5) * params.demandVariability);
    }

    // Add lead time variations
    const leadTimePenalty = Math.random() * params.leadTimeVariability * baseCost * 0.1;
    
    return baseCost + leadTimePenalty;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monte Carlo Simulation Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="parameters">
            <TabsList>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="parameters" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Iterations</Label>
                  <Input
                    type="number"
                    value={parameters.iterations}
                    onChange={(e) => setParameters({...parameters, iterations: parseInt(e.target.value)})}
                    min="100"
                    max="10000"
                  />
                </div>
                <div>
                  <Label>Demand Variability</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={parameters.demandVariability}
                    onChange={(e) => setParameters({...parameters, demandVariability: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Lead Time Variability</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={parameters.leadTimeVariability}
                    onChange={(e) => setParameters({...parameters, leadTimeVariability: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Disruption Probability</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={parameters.disruptionProbability}
                    onChange={(e) => setParameters({...parameters, disruptionProbability: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={runMonteCarloSimulation} disabled={isRunning}>
                  {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isRunning ? 'Running...' : 'Start Simulation'}
                </Button>
                <Button variant="outline" onClick={() => setResults([])}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
              
              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Simulation Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="results">
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {result.scenario === 'supply_disruption' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          {result.scenario.replace('_', ' ').toUpperCase()}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Mean Cost</p>
                            <p className="text-2xl font-bold">${result.meanCost.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Standard Deviation</p>
                            <p className="text-xl">${Math.sqrt(result.variance).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">95% Confidence Interval</p>
                            <p>${result.confidenceInterval[0].toLocaleString()} - ${result.confidenceInterval[1].toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Value at Risk (95%)</p>
                            <p className="text-red-600 font-semibold">${result.riskMetrics.valueAtRisk.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Run simulation to see results
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
