import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Settings, 
  Activity, 
  TrendingUp, 
  BarChart3,
  Timer,
  Zap
} from 'lucide-react';

const Simulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [iterationCount, setIterationCount] = useState(0);
  const [dataPoints, setDataPoints] = useState([5, 10, 15, 8, 12]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setIterationCount((prevCount) => prevCount + 1);
        // Simulate data changes
        setDataPoints((prevData) => {
          const newData = prevData.map((point) => point + Math.floor(Math.random() * 4) - 1);
          return newData;
        });
      }, 1000 / simulationSpeed);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, simulationSpeed]);

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setIterationCount(0);
    setDataPoints([5, 10, 15, 8, 12]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Supply Chain Simulation</h1>
        <p className="text-muted-foreground mt-2">
          Model and simulate supply chain dynamics in real-time
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Simulation Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Simulation Speed</Label>
            <Input
              type="number"
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
              className="w-24"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Iteration Count</Label>
            <Badge variant="secondary">{iterationCount}</Badge>
          </div>
          <div className="flex justify-around">
            <Button onClick={toggleSimulation} variant={isRunning ? "destructive" : "outline"}>
              {isRunning ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isRunning ? "Stop" : "Start"}
            </Button>
            <Button onClick={resetSimulation} variant="secondary">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Real-time Data Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around">
            {dataPoints.map((point, index) => (
              <div key={index} className="text-center">
                <div className="text-sm">Data Point {index + 1}</div>
                <div className="text-2xl font-bold">{point}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Simulating supply chain dynamics with real-time data updates
        </p>
      </div>
    </div>
  );
};

export default Simulation;
