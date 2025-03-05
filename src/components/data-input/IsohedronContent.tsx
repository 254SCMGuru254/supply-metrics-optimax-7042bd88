
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const IsohedronContent = () => {
  const [tessellationMethod, setTessellationMethod] = useState("voronoi");
  const [cellSize, setCellSize] = useState(25);
  const [smoothingFactor, setSmoothingFactor] = useState(50);
  const [balanceFactor, setBalanceFactor] = useState(50);
  const [territoryCount, setTerritoryCount] = useState(6);
  
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
              <Select value={tessellationMethod} onValueChange={setTessellationMethod}>
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
                <Label>Cell Size (km): {cellSize}</Label>
              </div>
              <Slider 
                value={[cellSize]} 
                min={5} 
                max={100} 
                step={1} 
                onValueChange={(values) => setCellSize(values[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Smoothing Factor: {smoothingFactor}%</Label>
              </div>
              <Slider 
                value={[smoothingFactor]} 
                min={0} 
                max={100} 
                step={1} 
                onValueChange={(values) => setSmoothingFactor(values[0])} 
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
                value={territoryCount} 
                min={1} 
                max={20} 
                onChange={(e) => setTerritoryCount(parseInt(e.target.value, 10) || 1)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Division Method</Label>
              <Select defaultValue="population">
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
                <Label>Balance Priority: {balanceFactor}%</Label>
              </div>
              <Slider 
                value={[balanceFactor]} 
                min={0} 
                max={100} 
                step={1} 
                onValueChange={(values) => setBalanceFactor(values[0])} 
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
                <Slider defaultValue={[70]} min={0} max={100} step={1} />
              </div>
              <div className="space-y-2">
                <Label>Distance Weight</Label>
                <Slider defaultValue={[50]} min={0} max={100} step={1} />
              </div>
              <div className="space-y-2">
                <Label>Revenue Weight</Label>
                <Slider defaultValue={[60]} min={0} max={100} step={1} />
              </div>
              <div className="space-y-2">
                <Label>Workload Weight</Label>
                <Slider defaultValue={[40]} min={0} max={100} step={1} />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
