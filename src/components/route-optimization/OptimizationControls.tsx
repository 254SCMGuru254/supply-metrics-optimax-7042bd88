
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Play, StopCircle, Settings, Activity } from "lucide-react";

interface OptimizationControlsProps {
  onOptimize: (params: any) => void;
  isOptimizing: boolean;
  onStop?: () => void;
}

export const OptimizationControls = ({ onOptimize, isOptimizing, onStop }: OptimizationControlsProps) => {
  const [algorithm, setAlgorithm] = useState<string>('nearest_neighbor');
  const [maxDistance, setMaxDistance] = useState<number>(1000);
  const [maxDuration, setMaxDuration] = useState<number>(480); // 8 hours
  const [timeWindows, setTimeWindows] = useState<boolean>(false);
  const [capacityConstraints, setCapacityConstraints] = useState<boolean>(true);

  const handleOptimize = () => {
    const params = {
      algorithm,
      constraints: {
        maxDistance,
        maxDuration,
        timeWindows,
        capacityConstraints
      }
    };
    onOptimize(params);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Optimization Controls
          <Badge variant={isOptimizing ? "default" : "secondary"}>
            {isOptimizing ? "Running" : "Ready"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="algorithm">Optimization Algorithm</Label>
            <Select value={algorithm} onValueChange={setAlgorithm}>
              <SelectTrigger>
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nearest_neighbor">Nearest Neighbor (Fast)</SelectItem>
                <SelectItem value="genetic_algorithm">Genetic Algorithm (Balanced)</SelectItem>
                <SelectItem value="simulated_annealing">Simulated Annealing (Quality)</SelectItem>
                <SelectItem value="or_tools">Google OR-Tools (Advanced)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="maxDistance">Max Distance (km)</Label>
            <Input
              id="maxDistance"
              type="number"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              min="100"
              max="5000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="maxDuration">Max Duration (minutes)</Label>
            <Input
              id="maxDuration"
              type="number"
              value={maxDuration}
              onChange={(e) => setMaxDuration(Number(e.target.value))}
              min="60"
              max="720"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="timeWindows">Time Windows</Label>
              <Switch
                id="timeWindows"
                checked={timeWindows}
                onCheckedChange={setTimeWindows}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="capacity">Capacity Constraints</Label>
              <Switch
                id="capacity"
                checked={capacityConstraints}
                onCheckedChange={setCapacityConstraints}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="flex-1"
          >
            {isOptimizing ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Optimization
              </>
            )}
          </Button>
          
          {isOptimizing && onStop && (
            <Button variant="outline" onClick={onStop}>
              <StopCircle className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <div><strong>Nearest Neighbor:</strong> Fast, good for small problems</div>
          <div><strong>Genetic Algorithm:</strong> Balanced speed and quality</div>
          <div><strong>Simulated Annealing:</strong> High quality solutions</div>
          <div><strong>OR-Tools:</strong> Industry-standard optimization</div>
        </div>
      </CardContent>
    </Card>
  );
};
