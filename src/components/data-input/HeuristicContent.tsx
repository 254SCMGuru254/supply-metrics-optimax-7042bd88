
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calculator, Settings, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeuristicContentProps {
  projectId: string;
}

export const HeuristicContent: React.FC<HeuristicContentProps> = ({ projectId }) => {
  const [parameters, setParameters] = useState({
    maxIterations: 1000,
    coolingRate: 0.95,
    initialTemperature: 100,
    minTemperature: 0.01
  });
  const { toast } = useToast();

  const runHeuristic = () => {
    toast({
      title: "Heuristic Algorithm Started",
      description: "Running optimization with current parameters"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Heuristic Algorithm Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="simulated-annealing">
          <TabsList>
            <TabsTrigger value="simulated-annealing">Simulated Annealing</TabsTrigger>
            <TabsTrigger value="genetic">Genetic Algorithm</TabsTrigger>
            <TabsTrigger value="tabu">Tabu Search</TabsTrigger>
          </TabsList>

          <TabsContent value="simulated-annealing" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxIterations">Max Iterations</Label>
                <Input
                  id="maxIterations"
                  type="number"
                  value={parameters.maxIterations}
                  onChange={(e) => setParameters({...parameters, maxIterations: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="coolingRate">Cooling Rate</Label>
                <Input
                  id="coolingRate"
                  type="number"
                  step="0.01"
                  value={parameters.coolingRate}
                  onChange={(e) => setParameters({...parameters, coolingRate: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="initialTemp">Initial Temperature</Label>
                <Input
                  id="initialTemp"
                  type="number"
                  value={parameters.initialTemperature}
                  onChange={(e) => setParameters({...parameters, initialTemperature: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="minTemp">Minimum Temperature</Label>
                <Input
                  id="minTemp"
                  type="number"
                  step="0.01"
                  value={parameters.minTemperature}
                  onChange={(e) => setParameters({...parameters, minTemperature: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <Button onClick={runHeuristic} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Run Simulated Annealing
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
