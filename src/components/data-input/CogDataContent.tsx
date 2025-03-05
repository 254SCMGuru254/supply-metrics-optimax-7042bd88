
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const CogDataContent = () => {
  const [demandPoints] = useState([
    { id: 1, name: "Customer 1", location: "New York", weight: 80 },
    { id: 2, name: "Customer 2", location: "Chicago", weight: 120 },
    { id: 3, name: "Customer 3", location: "Los Angeles", weight: 150 },
    { id: 4, name: "Customer 4", location: "Dallas", weight: 90 },
    { id: 5, name: "Customer 5", location: "Denver", weight: 60 },
  ]);
  
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demandPoints.map((point) => (
                <TableRow key={point.id}>
                  <TableCell>{point.id}</TableCell>
                  <TableCell>{point.name}</TableCell>
                  <TableCell>{point.location}</TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      defaultValue={point.weight} 
                      className="w-24" 
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                  <Select defaultValue="haversine">
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
                  <Select defaultValue="km">
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
                  <Switch id="use-real-roads" defaultChecked />
                  <Label htmlFor="use-real-roads">Use real road network when available</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="consider-elevation" />
                  <Label htmlFor="consider-elevation">Consider elevation changes</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="avoid-water" defaultChecked />
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
                  <Select defaultValue="linear">
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
                  <Input type="number" defaultValue={1.5} min={0} step={0.1} />
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
                  <TableRow>
                    <TableCell>Fuel Price</TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={1.0} className="w-24" />
                    </TableCell>
                    <TableCell>All routes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Traffic Congestion</TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={0.8} className="w-24" />
                    </TableCell>
                    <TableCell>Urban areas</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Toll Roads</TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={0.6} className="w-24" />
                    </TableCell>
                    <TableCell>Highway routes</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
