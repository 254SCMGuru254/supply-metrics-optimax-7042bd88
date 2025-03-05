
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export const HeuristicContent = () => {
  const [iterations, setIterations] = useState(1000);
  const [temperature, setTemperature] = useState(1000);
  const [coolingRate, setCoolingRate] = useState(0.95);
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Heuristic Algorithm Data</h2>
      <Tabs defaultValue="algorithm-params">
        <TabsList className="mb-6">
          <TabsTrigger value="algorithm-params">Algorithm Parameters</TabsTrigger>
          <TabsTrigger value="initial-solution">Initial Solution</TabsTrigger>
          <TabsTrigger value="stopping-criteria">Stopping Criteria</TabsTrigger>
        </TabsList>
        <TabsContent value="algorithm-params">
          <p className="text-muted-foreground mb-4">
            Configure algorithm-specific parameters for the heuristic solver.
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Algorithm Type</Label>
              <Select defaultValue="simulated-annealing">
                <SelectTrigger>
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simulated-annealing">Simulated Annealing</SelectItem>
                  <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                  <SelectItem value="tabu-search">Tabu Search</SelectItem>
                  <SelectItem value="particle-swarm">Particle Swarm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Initial Temperature: {temperature}</Label>
              </div>
              <Slider 
                value={[temperature]} 
                min={100} 
                max={5000} 
                step={100}
                onValueChange={(vals) => setTemperature(vals[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Cooling Rate: {coolingRate.toFixed(2)}</Label>
              </div>
              <Slider 
                value={[coolingRate * 100]} 
                min={80} 
                max={99} 
                step={1}
                onValueChange={(vals) => setCoolingRate(vals[0] / 100)} 
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="initial-solution">
          <p className="text-muted-foreground mb-4">
            Define or import initial solutions for the heuristic algorithm.
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Initial Solution Method</Label>
              <Select defaultValue="random">
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="greedy">Greedy</SelectItem>
                  <SelectItem value="nearest-neighbor">Nearest Neighbor</SelectItem>
                  <SelectItem value="custom">Custom/Import</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="randomize-seed" />
                <Label htmlFor="randomize-seed">Randomize Seed</Label>
              </div>
              
              <div className="space-y-2">
                <Label>Seed Value</Label>
                <Input type="number" defaultValue={42} min={1} />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="stopping-criteria">
          <p className="text-muted-foreground mb-4">
            Set stopping criteria like time limit, iteration count, or solution quality.
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Maximum Iterations: {iterations}</Label>
              </div>
              <Slider 
                value={[iterations]} 
                min={100} 
                max={5000} 
                step={100}
                onValueChange={(vals) => setIterations(vals[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Time Limit (seconds)</Label>
              <Input type="number" defaultValue={30} min={1} max={3600} />
            </div>
            
            <div className="space-y-2">
              <Label>Convergence Threshold (%)</Label>
              <Input type="number" defaultValue={0.1} min={0.01} max={10} step={0.01} />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="early-stopping" defaultChecked />
              <Label htmlFor="early-stopping">Enable Early Stopping</Label>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
