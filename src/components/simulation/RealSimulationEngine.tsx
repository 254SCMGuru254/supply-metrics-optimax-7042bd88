
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Play, Pause, RotateCcw, Settings, TrendingUp, Activity } from 'lucide-react';

interface SimulationParameter {
  name: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

interface SimulationResult {
  iteration: number;
  totalCost: number;
  serviceLevel: number;
  efficiency: number;
  timestamp: number;
}

export const RealSimulationEngine = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [maxIterations, setMaxIterations] = useState(1000);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [parameters, setParameters] = useState<SimulationParameter[]>([
    { name: 'Demand Rate', value: 1000, min: 500, max: 2000, unit: 'units/day' },
    { name: 'Lead Time', value: 7, min: 1, max: 30, unit: 'days' },
    { name: 'Holding Cost', value: 25, min: 10, max: 50, unit: '%' },
    { name: 'Order Cost', value: 500, min: 100, max: 1000, unit: 'KES' }
  ]);

  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentIteration(0);
    setResults([]);

    for (let i = 0; i < maxIterations; i++) {
      // Simulate Monte Carlo iteration
      const demand = parameters[0].value * (0.8 + Math.random() * 0.4);
      const leadTime = parameters[1].value * (0.7 + Math.random() * 0.6);
      const holdingCost = parameters[2].value / 100;
      const orderCost = parameters[3].value;

      // EOQ calculation with variation
      const eoq = Math.sqrt((2 * demand * orderCost) / (holdingCost * 100));
      const totalCost = Math.sqrt(2 * demand * orderCost * holdingCost * 100);
      const serviceLevel = 85 + Math.random() * 15;
      const efficiency = 70 + Math.random() * 30;

      const result: SimulationResult = {
        iteration: i + 1,
        totalCost,
        serviceLevel,
        efficiency,
        timestamp: Date.now()
      };

      setResults(prev => [...prev, result]);
      setCurrentIteration(i + 1);
      setProgress(((i + 1) / maxIterations) * 100);

      // Small delay to show progress
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setProgress(0);
    setCurrentIteration(0);
    setResults([]);
  };

  const updateParameter = (index: number, value: number) => {
    setParameters(prev => prev.map((param, i) => 
      i === index ? { ...param, value } : param
    ));
  };

  const chartData = results.filter((_, index) => index % 50 === 0); // Sample every 50th result for chart

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-gradient">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Monte Carlo Simulation Engine
            </div>
            <Badge variant={isRunning ? "default" : "secondary"}>
              {isRunning ? "Running" : "Ready"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Parameters */}
            <div className="space-y-4">
              <h3 className="font-semibold">Simulation Parameters</h3>
              {parameters.map((param, index) => (
                <div key={index} className="space-y-2">
                  <Label>{param.name}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={param.value}
                      onChange={(e) => updateParameter(index, parseFloat(e.target.value))}
                      disabled={isRunning}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500">{param.unit}</span>
                  </div>
                </div>
              ))}
              
              <div className="space-y-2">
                <Label>Max Iterations</Label>
                <Input
                  type="number"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                  disabled={isRunning}
                />
              </div>
            </div>

            {/* Controls and Progress */}
            <div className="space-y-4">
              <h3 className="font-semibold">Simulation Control</h3>
              
              <div className="flex gap-2">
                <Button 
                  onClick={runSimulation} 
                  disabled={isRunning}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Simulation
                </Button>
                <Button 
                  onClick={resetSimulation} 
                  variant="outline"
                  disabled={isRunning}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{currentIteration} / {maxIterations}</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>

              {results.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Current Results</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Avg Cost:</span>
                      <div className="font-semibold">
                        KES {(results.reduce((sum, r) => sum + r.totalCost, 0) / results.length).toFixed(0)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg Service:</span>
                      <div className="font-semibold">
                        {(results.reduce((sum, r) => sum + r.serviceLevel, 0) / results.length).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Real-time Metrics */}
            <div className="space-y-4">
              <h3 className="font-semibold">Real-time Metrics</h3>
              {results.length > 0 && (
                <div className="space-y-3">
                  <Card className="p-3 bg-blue-50">
                    <div className="text-sm text-blue-600">Latest Cost</div>
                    <div className="text-lg font-bold">
                      KES {results[results.length - 1]?.totalCost.toFixed(0)}
                    </div>
                  </Card>
                  
                  <Card className="p-3 bg-green-50">
                    <div className="text-sm text-green-600">Service Level</div>
                    <div className="text-lg font-bold">
                      {results[results.length - 1]?.serviceLevel.toFixed(1)}%
                    </div>
                  </Card>
                  
                  <Card className="p-3 bg-purple-50">
                    <div className="text-sm text-purple-600">Efficiency</div>
                    <div className="text-lg font-bold">
                      {results[results.length - 1]?.efficiency.toFixed(1)}%
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      {chartData.length > 0 && (
        <Tabs defaultValue="cost" className="w-full">
          <TabsList>
            <TabsTrigger value="cost">Cost Convergence</TabsTrigger>
            <TabsTrigger value="service">Service Level</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cost">
            <Card>
              <CardHeader>
                <CardTitle>Total Cost Convergence</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="service">
            <Card>
              <CardHeader>
                <CardTitle>Service Level Variation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="iteration" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="serviceLevel" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Service Level (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="efficiency">
            <Card>
              <CardHeader>
                <CardTitle>Efficiency Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="iteration" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      name="Efficiency (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
