
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Play, Square, RotateCcw, Download } from 'lucide-react';

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
      <Card className="border-l-4 border-l-blue-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Play className="h-6 w-6 text-blue-600" />
            Advanced Monte Carlo Simulation Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Iterations</Label>
              <Input
                type="number"
                value={parameters.iterations}
                onChange={(e) => setParameters({...parameters, iterations: parseInt(e.target.value) || 1000})}
                disabled={isRunning}
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Duration (days)</Label>
              <Input
                type="number"
                value={parameters.duration}
                onChange={(e) => setParameters({...parameters, duration: parseInt(e.target.value) || 365})}
                disabled={isRunning}
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Volatility</Label>
              <Input
                type="number"
                step="0.01"
                value={parameters.volatility}
                onChange={(e) => setParameters({...parameters, volatility: parseFloat(e.target.value) || 0.15})}
                disabled={isRunning}
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Target Service Level (%)</Label>
              <Input
                type="number"
                value={parameters.serviceLevel}
                onChange={(e) => setParameters({...parameters, serviceLevel: parseInt(e.target.value) || 95})}
                disabled={isRunning}
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Scenario Type</Label>
              <Select 
                value={parameters.scenarioType} 
                onValueChange={(value) => setParameters({...parameters, scenarioType: value})}
                disabled={isRunning}
              >
                <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-blue-500">
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
          
          <div className="flex gap-3 mt-8">
            <Button 
              onClick={runSimulation} 
              disabled={isRunning}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isRunning ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Simulation
                </>
              )}
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
            <div className="mt-6 space-y-2">
              <Label className="text-sm font-medium">Progress</Label>
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-muted-foreground">{progress.toFixed(1)}% complete</p>
            </div>
          )}
        </CardContent>
      </Card>

      {results && (
        <Card className="border-l-4 border-l-green-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-xl text-green-800">Simulation Results Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">Average Total Cost</p>
                <p className="text-3xl font-bold text-blue-800 mt-2">
                  KES {results.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <p className="text-sm text-green-600 font-medium">Service Level</p>
                <p className="text-3xl font-bold text-green-800 mt-2">{results.serviceLevel.toFixed(1)}%</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                <p className="text-sm text-red-600 font-medium">Stockout Events</p>
                <p className="text-3xl font-bold text-red-800 mt-2">{results.stockouts}</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <p className="text-sm text-purple-600 font-medium">Efficiency Score</p>
                <p className="text-3xl font-bold text-purple-800 mt-2">{results.efficiency.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3 flex-wrap">
              <Badge variant="outline" className="px-3 py-1">
                {results.iterations.toLocaleString()} iterations
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                {results.convergenceTime}ms execution time
              </Badge>
              <Badge variant={results.serviceLevel >= parameters.serviceLevel ? 'default' : 'destructive'} className="px-3 py-1">
                {results.serviceLevel >= parameters.serviceLevel ? 'Target Met' : 'Below Target'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
