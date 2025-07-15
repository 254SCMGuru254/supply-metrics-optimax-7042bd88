
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Play, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeuristicContentProps {
  projectId: string;
}

export const HeuristicContent: React.FC<HeuristicContentProps> = ({ projectId }) => {
  const [algorithm, setAlgorithm] = useState('');
  const [parameters, setParameters] = useState({
    iterations: 1000,
    populationSize: 50,
    mutationRate: 0.01,
    crossoverRate: 0.8,
    temperature: 1000,
    coolingRate: 0.95
  });
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const algorithms = [
    { value: 'genetic', label: 'Genetic Algorithm', description: 'Evolutionary optimization technique' },
    { value: 'simulated_annealing', label: 'Simulated Annealing', description: 'Probabilistic optimization method' },
    { value: 'tabu_search', label: 'Tabu Search', description: 'Local search with memory' },
    { value: 'ant_colony', label: 'Ant Colony Optimization', description: 'Swarm intelligence approach' },
    { value: 'particle_swarm', label: 'Particle Swarm Optimization', description: 'Population-based optimization' }
  ];

  const runOptimization = async () => {
    if (!algorithm) {
      toast({
        title: "Algorithm Required",
        description: "Please select an algorithm to run",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    
    // Simulate optimization run
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsRunning(false);
    toast({
      title: "Optimization Complete",
      description: `${algorithms.find(a => a.value === algorithm)?.label} completed successfully`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Heuristic Algorithm Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="algorithm">Select Algorithm</Label>
            <Select value={algorithm} onValueChange={setAlgorithm}>
              <SelectTrigger>
                <SelectValue placeholder="Choose heuristic algorithm" />
              </SelectTrigger>
              <SelectContent>
                {algorithms.map((alg) => (
                  <SelectItem key={alg.value} value={alg.value}>
                    <div>
                      <div className="font-medium">{alg.label}</div>
                      <div className="text-sm text-gray-500">{alg.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {algorithm && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="iterations">Iterations</Label>
                <Input
                  id="iterations"
                  type="number"
                  value={parameters.iterations}
                  onChange={(e) => setParameters({ ...parameters, iterations: parseInt(e.target.value) || 1000 })}
                />
              </div>

              {(algorithm === 'genetic' || algorithm === 'particle_swarm') && (
                <div>
                  <Label htmlFor="population">Population Size</Label>
                  <Input
                    id="population"
                    type="number"
                    value={parameters.populationSize}
                    onChange={(e) => setParameters({ ...parameters, populationSize: parseInt(e.target.value) || 50 })}
                  />
                </div>
              )}

              {algorithm === 'genetic' && (
                <>
                  <div>
                    <Label htmlFor="mutation">Mutation Rate</Label>
                    <Input
                      id="mutation"
                      type="number"
                      step="0.001"
                      value={parameters.mutationRate}
                      onChange={(e) => setParameters({ ...parameters, mutationRate: parseFloat(e.target.value) || 0.01 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="crossover">Crossover Rate</Label>
                    <Input
                      id="crossover"
                      type="number"
                      step="0.01"
                      value={parameters.crossoverRate}
                      onChange={(e) => setParameters({ ...parameters, crossoverRate: parseFloat(e.target.value) || 0.8 })}
                    />
                  </div>
                </>
              )}

              {algorithm === 'simulated_annealing' && (
                <>
                  <div>
                    <Label htmlFor="temperature">Initial Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      value={parameters.temperature}
                      onChange={(e) => setParameters({ ...parameters, temperature: parseFloat(e.target.value) || 1000 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cooling">Cooling Rate</Label>
                    <Input
                      id="cooling"
                      type="number"
                      step="0.01"
                      value={parameters.coolingRate}
                      onChange={(e) => setParameters({ ...parameters, coolingRate: parseFloat(e.target.value) || 0.95 })}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={runOptimization} disabled={isRunning || !algorithm} className="flex-1">
              {isRunning ? (
                <>
                  <Settings className="h-4 w-4 mr-2 animate-spin" />
                  Running Optimization...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Optimization
                </>
              )}
            </Button>
            
            {algorithm && (
              <Badge variant="outline" className="px-4 py-2">
                <BarChart3 className="h-4 w-4 mr-2" />
                {algorithms.find(a => a.value === algorithm)?.label}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
