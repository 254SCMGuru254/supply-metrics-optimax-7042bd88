import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface HeuristicSettings {
  algorithmType: 'simulated-annealing' | 'genetic' | 'tabu-search' | 'particle-swarm';
  initialTemperature: number;
  coolingRate: number;
  initialSolutionMethod: 'random' | 'greedy' | 'nearest-neighbor' | 'custom';
  randomizeSeed: boolean;
  seedValue: number;
  maxIterations: number;
  timeLimit: number;
  convergenceThreshold: number;
  enableEarlyStopping: boolean;
}

interface HeuristicContentProps {
  projectId: string;
}

export const HeuristicContent = ({ projectId }: HeuristicContentProps) => {
  const [settings, setSettings] = useState<HeuristicSettings>({
    algorithmType: 'simulated-annealing',
    initialTemperature: 1000,
    coolingRate: 0.95,
    initialSolutionMethod: 'random',
    randomizeSeed: false,
    seedValue: 42,
    maxIterations: 1000,
    timeLimit: 30,
    convergenceThreshold: 0.1,
    enableEarlyStopping: true,
  });

  const handleSettingChange = (key: keyof HeuristicSettings, value: any) => {
    setSettings(prev => ({...prev, [key]: value}));
  };

  // TODO: Add useEffect to fetch/save settings from/to Supabase
  
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
              <Select 
                value={settings.algorithmType}
                onValueChange={(value) => handleSettingChange('algorithmType', value)}
              >
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
                <Label>Initial Temperature: {settings.initialTemperature}</Label>
              </div>
              <Slider 
                value={[settings.initialTemperature]} 
                min={100} 
                max={5000} 
                step={100}
                onValueChange={(vals) => handleSettingChange('initialTemperature', vals[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Cooling Rate: {settings.coolingRate.toFixed(2)}</Label>
              </div>
              <Slider 
                value={[settings.coolingRate * 100]} 
                min={80} 
                max={99} 
                step={1}
                onValueChange={(vals) => handleSettingChange('coolingRate', vals[0] / 100)} 
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
              <Select 
                value={settings.initialSolutionMethod}
                onValueChange={(value) => handleSettingChange('initialSolutionMethod', value)}
              >
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
                <Switch 
                  id="randomize-seed"
                  checked={settings.randomizeSeed}
                  onCheckedChange={(checked) => handleSettingChange('randomizeSeed', checked)}
                />
                <Label htmlFor="randomize-seed">Randomize Seed</Label>
              </div>
              
              <div className="space-y-2">
                <Label>Seed Value</Label>
                <Input 
                  type="number"
                  value={settings.seedValue}
                  onChange={(e) => handleSettingChange('seedValue', parseInt(e.target.value))}
                  min={1}
                  disabled={settings.randomizeSeed}
                />
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
                <Label>Maximum Iterations: {settings.maxIterations}</Label>
              </div>
              <Slider 
                value={[settings.maxIterations]} 
                min={100} 
                max={5000} 
                step={100}
                onValueChange={(vals) => handleSettingChange('maxIterations', vals[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Time Limit (seconds)</Label>
              <Input 
                type="number" 
                value={settings.timeLimit}
                onChange={(e) => handleSettingChange('timeLimit', parseInt(e.target.value))}
                min={1} 
                max={3600} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Convergence Threshold (%)</Label>
              <Input 
                type="number" 
                value={settings.convergenceThreshold}
                onChange={(e) => handleSettingChange('convergenceThreshold', parseFloat(e.target.value))}
                min={0.01} 
                max={10} 
                step={0.01} 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="early-stopping"
                checked={settings.enableEarlyStopping}
                onCheckedChange={(checked) => handleSettingChange('enableEarlyStopping', checked)}
              />
              <Label htmlFor="early-stopping">Enable Early Stopping</Label>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
