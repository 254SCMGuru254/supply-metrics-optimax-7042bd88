import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Toggle } from '@/components/ui/toggle';
import {
  Play, 
  Square as Stop, 
  RotateCcw as Reset,
  Settings,
  BarChart3,
  Timer as Clock,
  Zap as Lightning
} from 'lucide-react';

const Simulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [algorithm, setAlgorithm] = useState('genetic');
  const [dataPoints, setDataPoints] = useState(100);
  const [realTime, setRealTime] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && progress < 100) {
      intervalId = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + simulationSpeed;
          return Math.min(newProgress, 100);
        });
      }, 100);
    } else {
      setIsRunning(false);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, simulationSpeed]);

  const startSimulation = () => {
    setIsRunning(true);
  };

  const stopSimulation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setProgress(0);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <Lightning className="h-6 w-6" />
          Supply Chain Simulation
        </h1>
        <p className="text-muted-foreground">Model and analyze supply chain scenarios in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulation Controls */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Simulation Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="algorithm" className="text-foreground">Algorithm</Label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger className="bg-background text-foreground">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                    <SelectItem value="simulated-annealing">Simulated Annealing</SelectItem>
                    <SelectItem value="monte-carlo">Monte Carlo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dataPoints" className="text-foreground">Data Points</Label>
                <Input
                  id="dataPoints"
                  type="number"
                  value={dataPoints}
                  onChange={(e) => setDataPoints(Number(e.target.value))}
                  className="bg-background text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="simulationSpeed" className="text-foreground">Simulation Speed</Label>
                <Input
                  id="simulationSpeed"
                  type="number"
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                  className="bg-background text-foreground"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="realTime" className="text-foreground">Real-time Analysis</Label>
                <Toggle id="realTime" checked={realTime} onCheckedChange={setRealTime} />
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={startSimulation}
                  disabled={isRunning || progress === 100}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
                <Button
                  onClick={stopSimulation}
                  disabled={!isRunning}
                  variant="destructive"
                >
                  <Stop className="h-4 w-4 mr-2" />
                  Stop
                </Button>
                <Button
                  onClick={resetSimulation}
                  disabled={isRunning}
                  variant="secondary"
                >
                  <Reset className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simulation Progress */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Simulation Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Progress value={progress} />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
            </CardContent>
          </Card>

          {/* Simulation Results */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Simulation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed simulation results and analytics will be displayed here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
