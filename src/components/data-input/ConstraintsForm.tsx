
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Save, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Constraints {
  budget: number;
  timeLimit: number;
  capacity: number;
  serviceLevel: number;
  sustainability: number;
  enforceCapacity: boolean;
  allowPartialFulfillment: boolean;
  customConstraints: string;
}

export const ConstraintsForm = () => {
  const { toast } = useToast();
  const [constraints, setConstraints] = useState<Constraints>({
    budget: 1000000,
    timeLimit: 10,
    capacity: 1000,
    serviceLevel: 95,
    sustainability: 70,
    enforceCapacity: true,
    allowPartialFulfillment: false,
    customConstraints: ""
  });

  const handleSave = () => {
    toast({
      title: "Constraints Saved",
      description: "Your optimization constraints have been saved successfully.",
    });
    console.log("Saved constraints:", constraints);
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Optimization Constraints
        </CardTitle>
        <CardDescription>
          Define constraints and objectives for your optimization model
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="financial">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="operational">Operational</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="financial" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Maximum Budget (KES)</Label>
                  <span className="text-sm text-muted-foreground">
                    {constraints.budget.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[constraints.budget]}
                  onValueChange={(value) => setConstraints({...constraints, budget: value[0]})}
                  min={100000}
                  max={10000000}
                  step={100000}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Service Level Target (%)</Label>
                  <span className="text-sm text-muted-foreground">
                    {constraints.serviceLevel}%
                  </span>
                </div>
                <Slider
                  value={[constraints.serviceLevel]}
                  onValueChange={(value) => setConstraints({...constraints, serviceLevel: value[0]})}
                  min={80}
                  max={99}
                  step={1}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="operational" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Maximum Lead Time (days)</Label>
                  <span className="text-sm text-muted-foreground">
                    {constraints.timeLimit} days
                  </span>
                </div>
                <Slider
                  value={[constraints.timeLimit]}
                  onValueChange={(value) => setConstraints({...constraints, timeLimit: value[0]})}
                  min={1}
                  max={30}
                  step={1}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Sustainability Factor (%)</Label>
                  <span className="text-sm text-muted-foreground">
                    {constraints.sustainability}%
                  </span>
                </div>
                <Slider
                  value={[constraints.sustainability]}
                  onValueChange={(value) => setConstraints({...constraints, sustainability: value[0]})}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enforceCapacity" 
                    checked={constraints.enforceCapacity}
                    onCheckedChange={(checked) => setConstraints({...constraints, enforceCapacity: checked})}
                  />
                  <Label htmlFor="enforceCapacity">Enforce capacity constraints</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="allowPartial" 
                    checked={constraints.allowPartialFulfillment}
                    onCheckedChange={(checked) => setConstraints({...constraints, allowPartialFulfillment: checked})}
                  />
                  <Label htmlFor="allowPartial">Allow partial fulfillment</Label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customConstraints">Custom Constraints</Label>
                <textarea
                  id="customConstraints"
                  className="w-full p-3 border rounded-md"
                  rows={6}
                  placeholder="Enter custom constraints in natural language or mathematical notation..."
                  value={constraints.customConstraints}
                  onChange={(e) => setConstraints({...constraints, customConstraints: e.target.value})}
                />
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    <p className="font-medium mb-1">Examples of custom constraints:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Maximum 5 facilities can be opened</li>
                      <li>At least 80% demand must be fulfilled</li>
                      <li>No facility should handle more than 70% of total demand</li>
                      <li>Priority customers must have lead time ≤ 3 days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Constraints
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
