
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  StopCircle, 
  RotateCcw, 
  Settings, 
  TrendingUp, 
  Timer, 
  Activity,
  CheckCircle
} from 'lucide-react';

interface SimulationResult {
  averageDeliveryTime: number;
  totalCost: number;
  successRate: number;
}

const Simulation = () => {
  const [duration, setDuration] = useState<number>(30);
  const [numIterations, setNumIterations] = useState<number>(100);
  const [strategy, setStrategy] = useState<string>('optimize_cost');
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    if (running) {
      const timer = setTimeout(() => {
        // Simulate running the simulation
        const simulatedResults: SimulationResult = {
          averageDeliveryTime: Math.random() * 24 + 12,
          totalCost: Math.random() * 10000 + 5000,
          successRate: Math.random() * 0.4 + 0.6,
        };

        setResults(simulatedResults);
        setRunning(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [running]);

  const startSimulation = () => {
    setRunning(true);
    setResults(null);
  };

  const stopSimulation = () => {
    setRunning(false);
  };

  const resetSimulation = () => {
    setResults(null);
  };

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Supply Chain Simulation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Simulation Duration (days)</Label>
              <Input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="iterations">Number of Iterations</Label>
              <Input
                type="number"
                id="iterations"
                value={numIterations}
                onChange={(e) => setNumIterations(parseInt(e.target.value))}
                min="10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="strategy">Optimization Strategy</Label>
            <Select value={strategy} onValueChange={setStrategy}>
              <SelectTrigger>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="optimize_cost">Optimize Cost</SelectItem>
                <SelectItem value="minimize_time">Minimize Delivery Time</SelectItem>
                <SelectItem value="maximize_success">Maximize Success Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        <CardContent className="flex items-center justify-between">
          <Button
            disabled={running}
            onClick={startSimulation}
          >
            {running ? (
              <>
                <Timer className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Simulation
              </>
            )}
          </Button>
          <Button 
            variant="secondary"
            onClick={resetSimulation}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </CardContent>
        
        {results && (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Simulation Complete!</h3>
            <p className="text-muted-foreground">Results have been generated successfully.</p>
          </div>
        )}
      </Card>

      {results && (
        <div className="max-w-3xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Avg. Delivery Time</p>
              <p className="text-2xl font-bold">
                {results.averageDeliveryTime.toFixed(1)} hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold">
                KES {results.totalCost.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">
                {(results.successRate * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Simulation;
