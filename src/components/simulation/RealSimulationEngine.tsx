import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Play, StopCircle, RotateCcw, Download } from 'lucide-react';

interface SimulationParameters {
  iterations: number;
  duration: number;
  volatility: number;
  serviceLevel: number;
  scenarioType: string;
}

interface SimulationResult {
  totalCost: number;
  serviceLevel: number;
  stockouts: number;
  efficiency: number;
  iterations: number;
  convergenceTime: number;
}

export const RealSimulationEngine = () => {
  const [parameters, setParameters] = useState<SimulationParameters>({
    iterations: 1000,
    duration: 365,
    volatility: 0.15,
    serviceLevel: 95,
    scenarioType: 'monte-carlo'
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const { toast } = useToast();

  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 10, 95));
      }, 200);

      // Run actual simulation
      const result = await executeSimulation(parameters);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResults(result);
      
      toast({
        title: "Simulation Complete",
        description: `Completed ${parameters.iterations} iterations successfully.`
      });
    } catch (error) {
      toast({
        title: "Simulation Failed",
        description: "An error occurred during simulation.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const executeSimulation = async (params: SimulationParameters): Promise<SimulationResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Monte Carlo simulation logic
        let totalCost = 0;
        let stockoutEvents = 0;
        const startTime = Date.now();

        for (let i = 0; i < params.iterations; i++) {
          // Simulate demand with volatility
          const baseDemand = 100;
          const demand = baseDemand * (1 + (Math.random() - 0.5) * params.volatility * 2);
          
          // Simulate costs
          const holdingCost = demand * 0.2;
          const orderingCost = 50 + Math.random() * 20;
          const stockoutCost = Math.max(0, (demand - baseDemand * 1.1)) * 10;
          
          totalCost += holdingCost + orderingCost + stockoutCost;
          
          if (stockoutCost > 0) stockoutEvents++;
        }

        const avgCost = totalCost / params.iterations;
        const actualServiceLevel = ((params.iterations - stockoutEvents) / params.iterations) * 100;
        const efficiency = Math.max(0, 100 - (avgCost / 200) * 100);
        const convergenceTime = Date.now() - startTime;

        resolve({
          totalCost: avgCost,
          serviceLevel: actualServiceLevel,
          stockouts: stockoutEvents,
          efficiency,
          iterations: params.iterations,
          convergenceTime
        });
      }, 2000);
    });
  };

  const resetSimulation = () => {
    setProgress(0);
    setResults(null);
    setIsRunning(false);
  };

  const exportResults = () => {
    if (!results) return;
    
    const data = {
      parameters,
      results,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulation_results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Monte Carlo Simulation Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Iterations</Label>
              <Input
                type="number"
                value={parameters.iterations}
                onChange={(e) => setParameters({...parameters, iterations: parseInt(e.target.value) || 1000})}
                disabled={isRunning}
              />
            </div>
            
            <div>
              <Label>Duration (days)</Label>
              <Input
                type="number"
                value={parameters.duration}
                onChange={(e) => setParameters({...parameters, duration: parseInt(e.target.value) || 365})}
                disabled={isRunning}
              />
            </div>
            
            <div>
              <Label>Volatility</Label>
              <Input
                type="number"
                step="0.01"
                value={parameters.volatility}
                onChange={(e) => setParameters({...parameters, volatility: parseFloat(e.target.value) || 0.15})}
                disabled={isRunning}
              />
            </div>
            
            <div>
              <Label>Target Service Level (%)</Label>
              <Input
                type="number"
                value={parameters.serviceLevel}
                onChange={(e) => setParameters({...parameters, serviceLevel: parseInt(e.target.value) || 95})}
                disabled={isRunning}
              />
            </div>
            
            <div>
              <Label>Scenario Type</Label>
              <Select 
                value={parameters.scenarioType} 
                onValueChange={(value) => setParameters({...parameters, scenarioType: value})}
                disabled={isRunning}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monte-carlo">Monte Carlo</SelectItem>
                  <SelectItem value="stochastic">Stochastic</SelectItem>
                  <SelectItem value="inventory">Inventory Analysis</SelectItem>
                  <SelectItem value="disruption">Supply Disruption</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button onClick={runSimulation} disabled={isRunning}>
              {isRunning ? <StopCircle className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isRunning ? 'Running...' : 'Run Simulation'}
            </Button>
            
            <Button variant="outline" onClick={resetSimulation} disabled={isRunning}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            {results && (
              <Button variant="outline" onClick={exportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            )}
          </div>
          
          {isRunning && (
            <div className="mt-4">
              <Label>Progress</Label>
              <Progress value={progress} className="mt-2" />
              <p className="text-sm text-muted-foreground mt-1">{progress.toFixed(1)}% complete</p>
            </div>
          )}
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Average Total Cost</p>
                <p className="text-2xl font-bold text-blue-600">
                  KES {results.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Service Level</p>
                <p className="text-2xl font-bold text-green-600">{results.serviceLevel.toFixed(1)}%</p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Stockout Events</p>
                <p className="text-2xl font-bold text-red-600">{results.stockouts}</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Efficiency Score</p>
                <p className="text-2xl font-bold text-purple-600">{results.efficiency.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Badge variant="outline">
                {results.iterations.toLocaleString()} iterations
              </Badge>
              <Badge variant="outline">
                {results.convergenceTime}ms execution time
              </Badge>
              <Badge variant={results.serviceLevel >= parameters.serviceLevel ? 'default' : 'destructive'}>
                {results.serviceLevel >= parameters.serviceLevel ? 'Target Met' : 'Below Target'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
