
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HeuristicContentProps {
  projectId: string;
}

export const HeuristicContent: React.FC<HeuristicContentProps> = ({ projectId }) => {
  const [algorithm, setAlgorithm] = useState('');
  const [parameters, setParameters] = useState({
    populationSize: 100,
    generations: 500,
    mutationRate: 0.01,
    crossoverRate: 0.8,
    iterations: 1000,
    temperature: 100,
    coolingRate: 0.95
  });

  const algorithms = [
    { value: 'genetic', label: 'Genetic Algorithm' },
    { value: 'simulated_annealing', label: 'Simulated Annealing' },
    { value: 'particle_swarm', label: 'Particle Swarm Optimization' },
    { value: 'ant_colony', label: 'Ant Colony Optimization' },
    { value: 'tabu_search', label: 'Tabu Search' }
  ];

  const runOptimization = () => {
    console.log('Running heuristic optimization with:', { algorithm, parameters });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heuristic Optimization Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="algorithm">Select Algorithm</Label>
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an optimization algorithm" />
            </SelectTrigger>
            <SelectContent>
              {algorithms.map((alg) => (
                <SelectItem key={alg.value} value={alg.value}>
                  {alg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="genetic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="genetic">Genetic Algorithm</TabsTrigger>
            <TabsTrigger value="simulated">Simulated Annealing</TabsTrigger>
            <TabsTrigger value="particle">Particle Swarm</TabsTrigger>
          </TabsList>

          <TabsContent value="genetic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="populationSize">Population Size</Label>
                <Input
                  id="populationSize"
                  type="number"
                  value={parameters.populationSize}
                  onChange={(e) => setParameters({...parameters, populationSize: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="generations">Generations</Label>
                <Input
                  id="generations"
                  type="number"
                  value={parameters.generations}
                  onChange={(e) => setParameters({...parameters, generations: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="mutationRate">Mutation Rate</Label>
                <Input
                  id="mutationRate"
                  type="number"
                  step="0.01"
                  value={parameters.mutationRate}
                  onChange={(e) => setParameters({...parameters, mutationRate: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="crossoverRate">Crossover Rate</Label>
                <Input
                  id="crossoverRate"
                  type="number"
                  step="0.01"
                  value={parameters.crossoverRate}
                  onChange={(e) => setParameters({...parameters, crossoverRate: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="simulated" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="iterations">Iterations</Label>
                <Input
                  id="iterations"
                  type="number"
                  value={parameters.iterations}
                  onChange={(e) => setParameters({...parameters, iterations: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="temperature">Initial Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={parameters.temperature}
                  onChange={(e) => setParameters({...parameters, temperature: parseFloat(e.target.value)})}
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
            </div>
          </TabsContent>

          <TabsContent value="particle" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="particles">Number of Particles</Label>
                <Input
                  id="particles"
                  type="number"
                  value={parameters.populationSize}
                  onChange={(e) => setParameters({...parameters, populationSize: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="swarmIterations">Iterations</Label>
                <Input
                  id="swarmIterations"
                  type="number"
                  value={parameters.iterations}
                  onChange={(e) => setParameters({...parameters, iterations: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={runOptimization} className="w-full">
          Run Heuristic Optimization
        </Button>
      </CardContent>
    </Card>
  );
};
