
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  PlayCircle, 
  StopCircle, 
  RefreshCcw, 
  Activity, 
  Clock, 
  CheckCircle
} from 'lucide-react';

const Simulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const startSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }

    // Mock results
    setResults({
      costSavings: 23.5,
      serviceLevel: 97.2,
      efficiency: 89.1
    });
    setIsRunning(false);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    setProgress(0);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setProgress(0);
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Supply Chain Simulation</h1>
          <p className="text-muted-foreground mt-2">
            Run simulations to test optimization scenarios
          </p>
        </div>
        <Badge variant={isRunning ? "default" : "secondary"}>
          {isRunning ? "Running" : "Ready"}
        </Badge>
      </div>

      <Tabs defaultValue="monte-carlo" className="space-y-6">
        <TabsList>
          <TabsTrigger value="monte-carlo">Monte Carlo</TabsTrigger>
          <TabsTrigger value="discrete-event">Discrete Event</TabsTrigger>
          <TabsTrigger value="agent-based">Agent-Based</TabsTrigger>
        </TabsList>

        <TabsContent value="monte-carlo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monte Carlo Simulation</CardTitle>
                  <CardDescription>
                    Test various scenarios using probabilistic models
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex space-x-4">
                    <Button 
                      onClick={startSimulation} 
                      disabled={isRunning}
                      className="flex items-center space-x-2"
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>Start Simulation</span>
                    </Button>
                    <Button 
                      onClick={stopSimulation} 
                      disabled={!isRunning}
                      variant="destructive"
                      className="flex items-center space-x-2"
                    >
                      <StopCircle className="h-4 w-4" />
                      <span>Stop</span>
                    </Button>
                    <Button 
                      onClick={resetSimulation}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      <span>Reset</span>
                    </Button>
                  </div>

                  {(isRunning || progress > 0) && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Simulation Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )}

                  {results && (
                    <Card className="bg-green-50 border-green-200">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-green-700">
                          <CheckCircle className="h-5 w-5" />
                          <span>Simulation Complete</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{results.costSavings}%</p>
                            <p className="text-sm text-green-700">Cost Savings</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{results.serviceLevel}%</p>
                            <p className="text-sm text-green-700">Service Level</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{results.efficiency}%</p>
                            <p className="text-sm text-green-700">Efficiency</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Simulation Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={isRunning ? "default" : "secondary"}>
                        {isRunning ? "Running" : "Ready"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Progress:</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Iterations:</span>
                      <span>10,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Simulation Parameters</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Model Type:</span>
                      <span>Monte Carlo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Horizon:</span>
                      <span>1 Year</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence Level:</span>
                      <span>95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Random Seed:</span>
                      <span>12345</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="discrete-event">
          <Card>
            <CardHeader>
              <CardTitle>Discrete Event Simulation</CardTitle>
              <CardDescription>
                Model your supply chain as a series of discrete events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Discrete event simulation functionality coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agent-based">
          <Card>
            <CardHeader>
              <CardTitle>Agent-Based Modeling</CardTitle>
              <CardDescription>
                Simulate complex interactions between supply chain agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Agent-based modeling functionality coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Simulation;
