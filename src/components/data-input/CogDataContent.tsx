import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type DemandPoint = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  demand: number;
};

interface CogDataContentProps {
  projectId: string;
}

// Settings Types
type DistanceSettings = {
  primaryMethod: 'euclidean' | 'manhattan' | 'haversine' | 'drivedistance';
  unit: 'km' | 'miles' | 'm';
  useRealRoads: boolean;
  considerElevation: boolean;
  avoidWater: boolean;
};

type CostFactor = {
  factor: string;
  weight: number;
  appliedTo: string;
};

type CostSettings = {
  costModel: 'linear' | 'piecewise' | 'exponential' | 'custom';
  baseCostPerUnit: number;
  additionalFactors: CostFactor[];
};

export const CogDataContent = ({ projectId }: CogDataContentProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: demandPoints, isLoading: isLoadingDemandPoints } = useQuery<DemandPoint[]>({
    queryKey: ['demandPointsForCog', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demand_points')
        .select('id, name, latitude, longitude, demand')
        .eq('project_id', projectId);
      
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!projectId,
  });

  const updateDemandMutation = useMutation({
    mutationFn: async ({ id, demand }: { id: number, demand: number }) => {
      const { data, error } = await supabase
        .from('demand_points')
        .update({ demand })
        .eq('id', id);

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demandPointsForCog', projectId] });
      toast({ title: "Success", description: "Demand weight updated." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleWeightChange = (id: number, newDemand: string) => {
    const demand = parseInt(newDemand, 10);
    if (!isNaN(demand)) {
      updateDemandMutation.mutate({ id, demand });
    }
  };

  // Local state for settings
  const [distanceSettings, setDistanceSettings] = useState<DistanceSettings>({
    primaryMethod: 'haversine',
    unit: 'km',
    useRealRoads: true,
    considerElevation: false,
    avoidWater: true,
  });

  const [costSettings, setCostSettings] = useState<CostSettings>({
    costModel: 'linear',
    baseCostPerUnit: 1.5,
    additionalFactors: [
      { factor: 'Fuel Price', weight: 1.0, appliedTo: 'All routes' },
      { factor: 'Traffic Congestion', weight: 0.8, appliedTo: 'Urban areas' },
      { factor: 'Toll Roads', weight: 0.6, appliedTo: 'Highway routes' },
    ],
  });

  // Handlers for settings changes
  const handleDistanceSettingChange = (key: keyof DistanceSettings, value: any) => {
    setDistanceSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCostSettingChange = (key: keyof CostSettings, value: any) => {
    setCostSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAdditionalFactorChange = (index: number, key: keyof CostFactor, value: any) => {
    const updatedFactors = [...costSettings.additionalFactors];
    updatedFactors[index] = { ...updatedFactors[index], [key]: value };
    setCostSettings(prev => ({ ...prev, additionalFactors: updatedFactors }));
  };

  // TODO: Add mutations to save these settings to the database when available
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Center of Gravity Data</h2>
      <Tabs defaultValue="demand-weights">
        <TabsList className="mb-6">
          <TabsTrigger value="demand-weights">Demand Weights</TabsTrigger>
          <TabsTrigger value="distance-metrics">Distance Metrics</TabsTrigger>
          <TabsTrigger value="cost-factors">Cost Factors</TabsTrigger>
        </TabsList>
        <TabsContent value="demand-weights">
          <p className="text-muted-foreground mb-4">
            Configure demand weights for Center of Gravity calculation. Weights determine the "pull" of each demand point.
          </p>
          <div className="mb-4 flex justify-between">
            <h3 className="text-lg font-medium">Demand Point Weights</h3>
            <Button variant="outline" size="sm">Import Demand Data</Button>
          </div>
          {isLoadingDemandPoints ? (
             <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Location (Lat, Lng)</TableHead>
                  <TableHead className="text-right">Weight (Demand)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demandPoints?.map((point) => (
                  <TableRow key={point.id}>
                    <TableCell>{point.name}</TableCell>
                    <TableCell>{`${point.latitude}, ${point.longitude}`}</TableCell>
                    <TableCell className="text-right">
                      <Input 
                        type="number" 
                        defaultValue={point.demand} 
                        className="w-32 ml-auto"
                        onBlur={(e) => handleWeightChange(point.id, e.target.value)}
                        disabled={updateDemandMutation.isLoading}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        <TabsContent value="distance-metrics">
          <p className="text-muted-foreground mb-4">
            Set up distance calculation methods (Euclidean, Manhattan, etc.) for the analysis.
          </p>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Distance Calculation Method</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Method</Label>
                  <Select
                    value={distanceSettings.primaryMethod}
                    onValueChange={(value) => handleDistanceSettingChange('primaryMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="euclidean">Euclidean (Straight-line)</SelectItem>
                      <SelectItem value="manhattan">Manhattan (City Block)</SelectItem>
                      <SelectItem value="haversine">Haversine (Great Circle)</SelectItem>
                      <SelectItem value="drivedistance">Driving Distance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Unit of Measurement</Label>
                  <Select
                    value={distanceSettings.unit}
                    onValueChange={(value) => handleDistanceSettingChange('unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Kilometers</SelectItem>
                      <SelectItem value="miles">Miles</SelectItem>
                      <SelectItem value="m">Meters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Advanced Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-real-roads"
                    checked={distanceSettings.useRealRoads}
                    onCheckedChange={(checked) => handleDistanceSettingChange('useRealRoads', checked)}
                  />
                  <Label htmlFor="use-real-roads">Use real road network when available</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="consider-elevation"
                    checked={distanceSettings.considerElevation}
                    onCheckedChange={(checked) => handleDistanceSettingChange('considerElevation', checked)}
                  />
                  <Label htmlFor="consider-elevation">Consider elevation changes</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="avoid-water"
                    checked={distanceSettings.avoidWater}
                    onCheckedChange={(checked) => handleDistanceSettingChange('avoidWater', checked)}
                  />
                  <Label htmlFor="avoid-water">Avoid water bodies when placing facilities</Label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="cost-factors">
          <p className="text-muted-foreground mb-4">
            Define cost factors that vary with distance for a more accurate facility location.
          </p>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Transportation Cost Model</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cost Model</Label>
                  <Select
                    value={costSettings.costModel}
                    onValueChange={(value) => handleCostSettingChange('costModel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="piecewise">Piecewise Linear</SelectItem>
                      <SelectItem value="exponential">Exponential</SelectItem>
                      <SelectItem value="custom">Custom Function</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Base Cost per Unit Distance</Label>
                  <Input
                    type="number"
                    value={costSettings.baseCostPerUnit}
                    onChange={(e) => handleCostSettingChange('baseCostPerUnit', parseFloat(e.target.value))}
                    min={0}
                    step={0.1}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Cost Factors</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factor</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Applied To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costSettings.additionalFactors.map((factor, index) => (
                    <TableRow key={index}>
                      <TableCell>{factor.factor}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={factor.weight}
                          onChange={(e) => handleAdditionalFactorChange(index, 'weight', parseFloat(e.target.value))}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>{factor.appliedTo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
