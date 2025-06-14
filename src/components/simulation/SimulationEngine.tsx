import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SimulationParameters {
  duration: number;
  demandVolatility: number;
  supplyDisruptions: boolean;
  leadTimeVariability: number;
}

interface SimulationResults {
  averageInventoryCost: number;
  serviceLevel: number;
  totalProfit: number;
}

export const SimulationEngine = () => {
  const [parameters, setParameters] = useState<SimulationParameters>({
    duration: 30,
    demandVolatility: 0.1,
    supplyDisruptions: false,
    leadTimeVariability: 0.05,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isRunning && progress < 100) {
      const timer = setTimeout(() => {
        setProgress((prevProgress) => Math.min(prevProgress + 10, 100));
      }, 500);
      return () => clearTimeout(timer);
    } else if (isRunning) {
      setIsRunning(false);
      setResults({
        averageInventoryCost: 15000,
        serviceLevel: 0.95,
        totalProfit: 500000,
      });
      toast({
        title: "Simulation Complete",
        description: "The simulation has finished running and results are ready.",
      });
    }
  }, [isRunning, progress, toast]);

  const startSimulation = () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    toast({
      title: "Simulation Started",
      description: "The simulation is now running. Please wait for the results.",
    });
  };

  const stopSimulation = () => {
    setIsRunning(false);
    toast({
      title: "Simulation Stopped",
      description: "The simulation has been stopped.",
      variant: "destructive",
    });
  };

  return (
    <Card className="space-y-6">
      <CardHeader>
        <CardTitle>Simulation Engine</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Simulation Duration (days)</Label>
          <Input
            id="duration"
            type="number"
            value={parameters.duration}
            onChange={(e) => setParameters({ ...parameters, duration: parseInt(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="demandVolatility">Demand Volatility</Label>
          <Input
            id="demandVolatility"
            type="number"
            step="0.01"
            value={parameters.demandVolatility}
            onChange={(e) => setParameters({ ...parameters, demandVolatility: parseFloat(e.target.value) })}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Input
            id="supplyDisruptions"
            type="checkbox"
            checked={parameters.supplyDisruptions}
            onChange={(e) => setParameters({ ...parameters, supplyDisruptions: e.target.checked })}
          />
          <Label htmlFor="supplyDisruptions">Include Supply Disruptions</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="leadTimeVariability">Lead Time Variability</Label>
          <Input
            id="leadTimeVariability"
            type="number"
            step="0.01"
            value={parameters.leadTimeVariability}
            onChange={(e) => setParameters({ ...parameters, leadTimeVariability: parseFloat(e.target.value) })}
          />
        </div>

        {isRunning ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Simulation Progress:</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
            <Button variant="destructive" onClick={stopSimulation}>
              <Square className="h-4 w-4 mr-2" />
              Stop Simulation
            </Button>
          </div>
        ) : (
          <Button onClick={startSimulation} disabled={isRunning}>
            <Play className="h-4 w-4 mr-2" />
            Start Simulation
          </Button>
        )}

        {results && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold">Simulation Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Badge variant="secondary">
                  Average Inventory Cost: ${results.averageInventoryCost}
                </Badge>
              </div>
              <div>
                <Badge variant="secondary">
                  Service Level: {results.serviceLevel * 100}%
                </Badge>
              </div>
              <div>
                <Badge variant="secondary">
                  Total Profit: ${results.totalProfit}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
