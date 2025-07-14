
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
  Legend
} from 'recharts';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Simulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [parameters, setParameters] = useState({
    duration: 30,
    demandVariability: 0.2,
    leadTime: 7,
    serviceLevel: 0.95
  });
  const { toast } = useToast();

  const runSimulation = () => {
    setIsRunning(true);
    toast({
      title: "Simulation Started",
      description: "Monte Carlo simulation is running..."
    });

    // Simulate data generation
    const data = [];
    for (let i = 0; i < parameters.duration; i++) {
      data.push({
        day: i + 1,
        demand: Math.round(100 + Math.random() * 50),
        inventory: Math.round(200 - i * 2 + Math.random() * 20),
        serviceLevel: 0.9 + Math.random() * 0.1,
        cost: 1000 + Math.random() * 500
      });
    }

    setTimeout(() => {
      setSimulationData(data);
      setIsRunning(false);
      toast({
        title: "Simulation Complete",
        description: "Results are ready for analysis"
      });
    }, 3000);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    toast({
      title: "Simulation Stopped",
      description: "Simulation has been paused"
    });
  };

  const resetSimulation = () => {
    setSimulationData([]);
    setIsRunning(false);
    toast({
      title: "Simulation Reset",
      description: "All simulation data has been cleared"
    });
  };

  const scenarioResults = [
    { scenario: "Best Case", probability: 0.15, cost: 85000, serviceLevel: 0.98 },
    { scenario: "Most Likely", probability: 0.70, cost: 95000, serviceLevel: 0.95 },
    { scenario: "Worst Case", probability: 0.15, cost: 110000, serviceLevel: 0.89 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Supply Chain Simulation
          </h1>
          <p className="text-xl text-gray-600">
            Monte Carlo simulation for supply chain optimization and risk analysis
          </p>
        </div>

        {/* Control Panel */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Simulation Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={parameters.duration}
                  onChange={(e) => setParameters({...parameters, duration: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="variability">Demand Variability</Label>
                <Input
                  id="variability"
                  type="number"
                  step="0.1"
                  value={parameters.demandVariability}
                  onChange={(e) => setParameters({...parameters, demandVariability: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="leadTime">Lead Time (days)</Label>
                <Input
                  id="leadTime"
                  type="number"
                  value={parameters.leadTime}
                  onChange={(e) => setParameters({...parameters, leadTime: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="serviceLevel">Service Level</Label>
                <Input
                  id="serviceLevel"
                  type="number"
                  step="0.01"
                  value={parameters.serviceLevel}
                  onChange={(e) => setParameters({...parameters, serviceLevel: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={runSimulation} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isRunning ? 'Running...' : 'Run Simulation'}
              </Button>
              <Button 
                variant="outline" 
                onClick={stopSimulation}
                disabled={!isRunning}
                className="flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
              <Button 
                variant="outline" 
                onClick={resetSimulation}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Simulation Status */}
        {isRunning && (
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
                  <span className="font-semibold">Simulation Running</span>
                </div>
                <Badge variant="secondary">Monte Carlo Method</Badge>
              </div>
              <Progress value={66} className="mb-2" />
              <p className="text-sm text-gray-600">Processing scenario variations...</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {simulationData.length > 0 && (
          <Tabs defaultValue="timeline" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline">Timeline Analysis</TabsTrigger>
              <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
              <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Demand vs Inventory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={simulationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="demand" stroke="#8884d8" name="Demand" />
                        <Line type="monotone" dataKey="inventory" stroke="#82ca9d" name="Inventory" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Service Level Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={simulationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="serviceLevel" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Cost Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={simulationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cost" fill="#ff7c7c" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Scenario Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scenarioResults.map((scenario, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {scenario.scenario === 'Best Case' && <CheckCircle className="h-5 w-5 text-green-600" />}
                          {scenario.scenario === 'Most Likely' && <Activity className="h-5 w-5 text-blue-600" />}
                          {scenario.scenario === 'Worst Case' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                          <div>
                            <div className="font-semibold">{scenario.scenario}</div>
                            <div className="text-sm text-gray-600">Probability: {(scenario.probability * 100).toFixed(0)}%</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${scenario.cost.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Service Level: {(scenario.serviceLevel * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">94.2%</div>
                        <div className="text-sm text-gray-600">Average Service Level</div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-green-600">$97,500</div>
                        <div className="text-sm text-gray-600">Average Cost</div>
                      </div>
                      <Activity className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">12.3%</div>
                        <div className="text-sm text-gray-600">Cost Variance</div>
                      </div>
                      <Zap className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-orange-600">85%</div>
                        <div className="text-sm text-gray-600">Confidence Level</div>
                      </div>
                      <CheckCircle className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Simulation;
