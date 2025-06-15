import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Zap } from 'lucide-react';

interface SimulationParams {
  iterations: number;
  demandMean: number;
  demandStdDev: number;
  leadTimeMean: number;
  leadTimeStdDev: number;
  orderingCost: number;
  holdingCost: number;
  stockoutCost: number;
  initialStock: number;
}

interface SimulationResult {
  iteration: number;
  demand: number;
  leadTime: number;
  orderQuantity: number;
  stockLevel: number;
  totalCost: number;
  stockouts: number;
}

const generateNormalRandom = (mean: number, stdDev: number): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z0 * stdDev;
};

const calculateEOQ = (demand: number, orderingCost: number, holdingCost: number): number => {
  return Math.sqrt((2 * demand * orderingCost) / holdingCost);
};

export const RealSimulationEngine = () => {
  const [params, setParams] = useState<SimulationParams>({
    iterations: 1000,
    demandMean: 100,
    demandStdDev: 20,
    leadTimeMean: 7,
    leadTimeStdDev: 2,
    orderingCost: 500,
    holdingCost: 25,
    stockoutCost: 100,
    initialStock: 200
  });

  const [results, setResults] = useState<SimulationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState<any>(null);

  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    const simulationResults: SimulationResult[] = [];

    for (let i = 0; i < params.iterations; i++) {
      // Generate random variables
      const demand = Math.max(0, generateNormalRandom(params.demandMean, params.demandStdDev));
      const leadTime = Math.max(1, generateNormalRandom(params.leadTimeMean, params.leadTimeStdDev));
      
      // Calculate optimal order quantity using EOQ
      const orderQuantity = calculateEOQ(demand, params.orderingCost, params.holdingCost);
      
      // Simulate stock level and costs
      const stockLevel = Math.max(0, params.initialStock + orderQuantity - demand);
      const stockouts = Math.max(0, demand - (params.initialStock + orderQuantity));
      
      const orderingCostTotal = (orderQuantity > 0) ? params.orderingCost : 0;
      const holdingCostTotal = stockLevel * params.holdingCost;
      const stockoutCostTotal = stockouts * params.stockoutCost;
      const totalCost = orderingCostTotal + holdingCostTotal + stockoutCostTotal;

      simulationResults.push({
        iteration: i + 1,
        demand: Math.round(demand),
        leadTime: Math.round(leadTime * 10) / 10,
        orderQuantity: Math.round(orderQuantity),
        stockLevel: Math.round(stockLevel),
        totalCost: Math.round(totalCost),
        stockouts: Math.round(stockouts)
      });

      // Update progress
      if (i % 10 === 0) {
        setProgress((i / params.iterations) * 100);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }

    // Calculate summary statistics
    const avgTotalCost = simulationResults.reduce((sum, r) => sum + r.totalCost, 0) / simulationResults.length;
    const avgStockLevel = simulationResults.reduce((sum, r) => sum + r.stockLevel, 0) / simulationResults.length;
    const stockoutRate = simulationResults.filter(r => r.stockouts > 0).length / simulationResults.length;
    const avgDemand = simulationResults.reduce((sum, r) => sum + r.demand, 0) / simulationResults.length;

    setSummary({
      avgTotalCost: Math.round(avgTotalCost),
      avgStockLevel: Math.round(avgStockLevel),
      stockoutRate: Math.round(stockoutRate * 100),
      avgDemand: Math.round(avgDemand),
      totalSimulations: params.iterations
    });

    setResults(simulationResults.slice(0, 100)); // Show first 100 results for visualization
    setProgress(100);
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setResults([]);
    setSummary(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameters Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Simulation Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Iterations</Label>
              <Input
                type="number"
                value={params.iterations}
                onChange={(e) => setParams({...params, iterations: parseInt(e.target.value)})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Demand Mean</Label>
                <Input
                  type="number"
                  value={params.demandMean}
                  onChange={(e) => setParams({...params, demandMean: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Demand Std Dev</Label>
                <Input
                  type="number"
                  value={params.demandStdDev}
                  onChange={(e) => setParams({...params, demandStdDev: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Lead Time Mean</Label>
                <Input
                  type="number"
                  value={params.leadTimeMean}
                  onChange={(e) => setParams({...params, leadTimeMean: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Lead Time Std Dev</Label>
                <Input
                  type="number"
                  value={params.leadTimeStdDev}
                  onChange={(e) => setParams({...params, leadTimeStdDev: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ordering Cost (KES)</Label>
              <Input
                type="number"
                value={params.orderingCost}
                onChange={(e) => setParams({...params, orderingCost: parseFloat(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label>Holding Cost (KES/unit)</Label>
              <Input
                type="number"
                value={params.holdingCost}
                onChange={(e) => setParams({...params, holdingCost: parseFloat(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label>Stockout Cost (KES/unit)</Label>
              <Input
                type="number"
                value={params.stockoutCost}
                onChange={(e) => setParams({...params, stockoutCost: parseFloat(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label>Initial Stock</Label>
              <Input
                type="number"
                value={params.initialStock}
                onChange={(e) => setParams({...params, initialStock: parseInt(e.target.value)})}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={runSimulation} 
                disabled={isRunning}
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Simulation'}
              </Button>
              <Button 
                onClick={resetSimulation} 
                variant="outline"
                disabled={isRunning}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {isRunning && (
              <div className="space-y-2">
                <Label>Progress</Label>
                <Progress value={progress} />
                <p className="text-sm text-gray-600">{Math.round(progress)}% complete</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            {summary ? (
              <div className="space-y-6">
                {/* Summary Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{summary.avgTotalCost}</div>
                    <div className="text-sm text-gray-600">Avg Total Cost (KES)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{summary.avgStockLevel}</div>
                    <div className="text-sm text-gray-600">Avg Stock Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{summary.stockoutRate}%</div>
                    <div className="text-sm text-gray-600">Stockout Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{summary.avgDemand}</div>
                    <div className="text-sm text-gray-600">Avg Demand</div>
                  </div>
                </div>

                {/* Charts */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Total Cost Distribution (First 100 Simulations)</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={results}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="iteration" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="totalCost" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          name="Total Cost (KES)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Stock Level vs Demand (First 20 Simulations)</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={results.slice(0, 20)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="iteration" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="stockLevel" fill="#10B981" name="Stock Level" />
                        <Bar dataKey="demand" fill="#F59E0B" name="Demand" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Zap className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready to Simulate</h3>
                <p className="text-gray-500">Configure parameters and click "Run Simulation" to begin</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
