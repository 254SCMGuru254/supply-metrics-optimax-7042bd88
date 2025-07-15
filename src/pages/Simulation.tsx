import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Square, 
  RefreshCcw,
  BarChart3,
  Activity,
  Clock,
  Zap,
  Settings,
  AlertTriangle
} from 'lucide-react';

const Simulation = () => {
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState({
    totalOrders: 12500,
    fulfilledOrders: 11875,
    averageDeliveryTime: 2.3,
    costSavings: 45000,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (simulationStatus === 'running' && progress < 100) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = Math.min(prevProgress + 10, 100);
          if (newProgress === 100) {
            setSimulationStatus('completed');
            clearInterval(interval);
          }
          return newProgress;
        });
      }, 500);
    }

    return () => clearInterval(interval);
  }, [simulationStatus, progress]);

  const startSimulation = () => {
    setSimulationStatus('running');
    setProgress(0);
  };

  const pauseSimulation = () => {
    setSimulationStatus('paused');
  };

  const resumeSimulation = () => {
    setSimulationStatus('running');
  };

  const resetSimulation = () => {
    setSimulationStatus('idle');
    setProgress(0);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2 text-foreground">
          <Activity className="h-8 w-8" />
          Supply Chain Simulation
        </h1>
        <p className="text-muted-foreground">
          Simulate and analyze your supply chain performance under various conditions
        </p>
      </div>

      <Tabs defaultValue="control" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="control" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Simulation Control
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Square className="h-4 w-4" />
            Simulation Status
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Simulation Results
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Simulation Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="control">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Control Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Simulation Progress:</span>
                <Badge variant="secondary">{progress}%</Badge>
              </div>
              <Progress value={progress} />
              <div className="flex justify-center gap-4">
                {simulationStatus === 'idle' && (
                  <Button onClick={startSimulation}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Simulation
                  </Button>
                )}
                {simulationStatus === 'running' && (
                  <Button variant="outline" onClick={pauseSimulation}>
                    <Square className="h-4 w-4 mr-2" />
                    Pause Simulation
                  </Button>
                )}
                {simulationStatus === 'paused' && (
                  <Button onClick={resumeSimulation}>
                    <Play className="h-4 w-4 mr-2" />
                    Resume Simulation
                  </Button>
                )}
                {(simulationStatus === 'paused' || simulationStatus === 'completed') && (
                  <Button variant="destructive" onClick={resetSimulation}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Reset Simulation
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Simulation Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>Status:</span>
                <Badge variant={simulationStatus === 'running' ? 'default' : simulationStatus === 'completed' ? 'success' : 'secondary'}>
                  {simulationStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-muted-foreground" />
                <span>Progress:</span>
                <span>{progress}%</span>
              </div>
              {simulationStatus === 'completed' && (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                  <span>Simulation Completed Successfully!</span>
                </div>
              )}
              {simulationStatus === 'paused' && (
                <div className="flex items-center gap-2 text-yellow-500">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Simulation Paused. Resume to continue.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Key Simulation Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Total Orders</div>
                  <div className="text-2xl font-bold text-foreground">{results.totalOrders}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Fulfilled Orders</div>
                  <div className="text-2xl font-bold text-green-600">{results.fulfilledOrders}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Average Delivery Time (Days)</div>
                  <div className="text-2xl font-bold text-blue-600">{results.averageDeliveryTime}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Cost Savings ($)</div>
                  <div className="text-2xl font-bold text-green-600">${results.costSavings}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Configure simulation parameters and scenarios.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Simulation;
