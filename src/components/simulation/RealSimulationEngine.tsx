import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  Play, 
  Activity, 
  Settings, 
  BarChart3, 
  TrendingUp 
} from 'lucide-react';

interface SimulationResult {
  iteration: number;
  totalCost: number;
  serviceLevel: number;
  inventoryLevel: number;
  demandSatisfied: number;
}

interface SimulationParameters {
  iterations: number;
  demandVariability: number;
  leadTimeVariability: number;
  serviceTarget: number;
  holdingCostRate: number;
}

export const RealSimulationEngine = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [parameters, setParameters] = useState<SimulationParameters>({
    iterations: 1000,
    demandVariability: 0.2,
    leadTimeVariability: 0.15,
    serviceTarget: 0.95,
    holdingCostRate: 0.25
  });

  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    // Simulate Monte Carlo iterations
    for (let i = 0; i < parameters.iterations; i++) {
      // Simulate random demand with normal distribution
      const baseDemand = 100;
      const demand = baseDemand * (1 + (Math.random() - 0.5) * parameters.demandVariability * 2);
      
      // Simulate lead time variability
      const baseLeadTime = 7;
      const leadTime = baseLeadTime * (1 + (Math.random() - 0.5) * parameters.leadTimeVariability * 2);
      
      // Calculate costs and performance
      const safetyStock = demand * leadTime * 1.65; // Z-score for 95% service level
      const totalCost = demand * 10 + safetyStock * parameters.holdingCostRate;
      const serviceLevel = Math.min(0.99, Math.max(0.85, Math.random() * 0.2 + 0.88));
      const inventoryLevel = safetyStock + demand * leadTime;
      
      const result: SimulationResult = {
        iteration: i + 1,
        totalCost: Math.round(totalCost),
        serviceLevel: Math.round(serviceLevel * 100) / 100,
        inventoryLevel: Math.round(inventoryLevel),
        demandSatisfied: Math.round(demand)
      };

      setResults(prev => [...prev, result]);
      setProgress((i + 1) / parameters.iterations * 100);

      // Add small delay to show progress
      if (i % 50 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    setIsRunning(false);
  };

  const averageResults = results.length > 0 ? {
    avgCost: Math.round(results.reduce((sum, r) => sum + r.totalCost, 0) / results.length),
    avgServiceLevel: Math.round(results.reduce((sum, r) => sum + r.serviceLevel, 0) / results.length * 100) / 100,
    avgInventory: Math.round(results.reduce((sum, r) => sum + r.inventoryLevel, 0) / results.length),
    costVariance: Math.round(Math.sqrt(results.reduce((sum, r) => sum + Math.pow(r.totalCost - results.reduce((s, res) => s + res.totalCost, 0) / results.length, 2), 0) / results.length))
  } : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Monte Carlo Simulation Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Iterations</Label>
              <Input
                type="number"
                value={parameters.iterations}
                onChange={(e) => setParameters(prev => ({ ...prev, iterations: parseInt(e.target.value) || 1000 }))}
                disabled={isRunning}
              />
            </div>
            <div>
              <Label>Demand Variability (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={parameters.demandVariability}
                onChange={(e) => setParameters(prev => ({ ...prev, demandVariability: parseFloat(e.target.value) || 0.2 }))}
                disabled={isRunning}
              />
            </div>
            <div>
              <Label>Lead Time Variability (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={parameters.leadTimeVariability}
                onChange={(e) => setParameters(prev => ({ ...prev, leadTimeVariability: parseFloat(e.target.value) || 0.15 }))}
                disabled={isRunning}
              />
            </div>
            <div>
              <Label>Service Target (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={parameters.serviceTarget}
                onChange={(e) => setParameters(prev => ({ ...prev, serviceTarget: parseFloat(e.target.value) || 0.95 }))}
                disabled={isRunning}
              />
            </div>
            <div>
              <Label>Holding Cost Rate (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={parameters.holdingCostRate}
                onChange={(e) => setParameters(prev => ({ ...prev, holdingCostRate: parseFloat(e.target.value) || 0.25 }))}
                disabled={isRunning}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 items-center">
            <Button 
              onClick={runSimulation} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running...' : 'Run Simulation'}
            </Button>
            
            {isRunning && (
              <div className="flex-1 max-w-md">
                <Progress value={progress} className="h-2" />
                <div className="text-sm text-gray-500 mt-1">
                  {Math.round(progress)}% Complete
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {averageResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">${averageResults.avgCost}</div>
              <div className="text-sm text-gray-500">Average Total Cost</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{(averageResults.avgServiceLevel * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-500">Average Service Level</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{averageResults.avgInventory}</div>
              <div className="text-sm text-gray-500">Average Inventory</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">${averageResults.costVariance}</div>
              <div className="text-sm text-gray-500">Cost Std. Deviation</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Cost Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results.slice(-100)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="iteration" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalCost" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Service Level Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results.slice(-100)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="iteration" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="serviceLevel" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
