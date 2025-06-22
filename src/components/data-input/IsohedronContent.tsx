import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface IsohedronSettings {
  tessellationMethod: 'voronoi' | 'hexagonal' | 'triangular' | 'square';
  cellSize: number;
  smoothingFactor: number;
  divisionMethod: 'population' | 'geographic' | 'demand' | 'hybrid';
  territoryCount: number;
  balanceFactor: number;
  populationWeight: number;
  distanceWeight: number;
  revenueWeight: number;
  workloadWeight: number;
}

interface IsohedronContentProps {
  projectId: string;
}

export const IsohedronContent = ({ projectId }: IsohedronContentProps) => {
  const [settings, setSettings] = useState<IsohedronSettings>({
    tessellationMethod: 'voronoi',
    cellSize: 25,
    smoothingFactor: 50,
    divisionMethod: 'population',
    territoryCount: 6,
    balanceFactor: 50,
    populationWeight: 70,
    distanceWeight: 50,
    revenueWeight: 60,
    workloadWeight: 40,
  });

  const handleSettingChange = (key: keyof IsohedronSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // TODO: Add useEffect to fetch/save settings from/to Supabase

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Isohedron Analysis Data</h2>
      <Tabs defaultValue="spatial-params">
        <TabsList className="mb-6">
          <TabsTrigger value="spatial-params">Spatial Parameters</TabsTrigger>
          <TabsTrigger value="territory-divisions">Territory Divisions</TabsTrigger>
          <TabsTrigger value="balance-factors">Balance Factors</TabsTrigger>
        </TabsList>
        <TabsContent value="spatial-params">
          <p className="text-muted-foreground mb-4">
            Configure spatial parameters for isohedron tessellation and optimization.
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tessellation Method</Label>
              <Select value={settings.tessellationMethod} onValueChange={(value) => handleSettingChange('tessellationMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="voronoi">Voronoi</SelectItem>
                  <SelectItem value="hexagonal">Hexagonal</SelectItem>
                  <SelectItem value="triangular">Triangular</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Cell Size (km): {settings.cellSize}</Label>
              </div>
              <Slider 
                value={[settings.cellSize]} 
                min={5} 
                max={100} 
                step={1} 
                onValueChange={(values) => handleSettingChange('cellSize', values[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Smoothing Factor: {settings.smoothingFactor}%</Label>
              </div>
              <Slider 
                value={[settings.smoothingFactor]} 
                min={0} 
                max={100} 
                step={1} 
                onValueChange={(values) => handleSettingChange('smoothingFactor', values[0])} 
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="territory-divisions">
          <p className="text-muted-foreground mb-4">
            Define territory division methods and constraints.
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Number of Territories</Label>
              <Input 
                type="number" 
                value={settings.territoryCount} 
                min={1} 
                max={20} 
                onChange={(e) => handleSettingChange('territoryCount', parseInt(e.target.value, 10) || 1)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Division Method</Label>
              <Select value={settings.divisionMethod} onValueChange={(value) => handleSettingChange('divisionMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="population">Population-based</SelectItem>
                  <SelectItem value="geographic">Geographic</SelectItem>
                  <SelectItem value="demand">Demand-based</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Balance Priority: {settings.balanceFactor}%</Label>
              </div>
              <Slider 
                value={[settings.balanceFactor]} 
                min={0} 
                max={100} 
                step={1} 
                onValueChange={(values) => handleSettingChange('balanceFactor', values[0])} 
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="balance-factors">
          <p className="text-muted-foreground mb-4">
            Set balance factors for territory size, demand, and other attributes.
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Population Weight</Label>
                <Slider value={[settings.populationWeight]} onValueChange={(v) => handleSettingChange('populationWeight', v[0])} min={0} max={100} step={1} />
              </div>
              <div className="space-y-2">
                <Label>Distance Weight</Label>
                <Slider value={[settings.distanceWeight]} onValueChange={(v) => handleSettingChange('distanceWeight', v[0])} min={0} max={100} step={1} />
              </div>
              <div className="space-y-2">
                <Label>Revenue Weight</Label>
                <Slider value={[settings.revenueWeight]} onValueChange={(v) => handleSettingChange('revenueWeight', v[0])} min={0} max={100} step={1} />
              </div>
              <div className="space-y-2">
                <Label>Workload Weight</Label>
                <Slider value={[settings.workloadWeight]} onValueChange={(v) => handleSettingChange('workloadWeight', v[0])} min={0} max={100} step={1} />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
