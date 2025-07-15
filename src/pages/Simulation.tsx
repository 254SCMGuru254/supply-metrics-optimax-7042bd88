
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Play, Pause, RotateCcw, Settings, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

const Simulation = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const { toast } = useToast();

  const runSimulation = () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate running Monte Carlo simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          generateResults();
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const generateResults = () => {
    const results = Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      cost: Math.random() * 100000 + 50000,
      demand: Math.random() * 1000 + 500,
      serviceLevel: Math.random() * 20 + 80
    }));
    setSimulationData(results);
    
    toast({
      title: "Simulation Complete",
      description: "Monte Carlo simulation finished successfully"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Supply Chain Simulation
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Run Monte Carlo simulations and scenario analysis to test different supply chain configurations
        </p>
      </div>

      <Tabs defaultValue="monte-carlo" className="space-y-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="monte-carlo">Monte Carlo</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="monte-carlo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Monte Carlo Simulation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="iterations">Iterations</Label>
                  <Input id="iterations" type="number" defaultValue="1000" />
                </div>
                <div>
                  <Label htmlFor="confidence">Confidence Level (%)</Label>
                  <Input id="confidence" type="number" defaultValue="95" />
                </div>
                <div>
                  <Label htmlFor="timeHorizon">Time Horizon (months)</Label>
                  <Input id="timeHorizon" type="number" defaultValue="12" />
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={runSimulation}
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isRunning ? 'Running...' : 'Run Simulation'}
                </Button>
                <Button variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>

              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {simulationData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={simulationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Cost']} />
                      <Line type="monotone" dataKey="cost" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Level Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={simulationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Service Level']} />
                      <Bar dataKey="serviceLevel" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Simulation;
