
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import type { Node } from "@/components/map/MapTypes";

export interface CogDemandWeightsProps {
  points: Node[];
  onPointsChange: (points: Node[]) => void;
}

export function CogDemandWeights({ 
  points, 
  onPointsChange 
}: CogDemandWeightsProps) {
  const addNode = () => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: "retail",
      name: `Location ${points.length + 1}`,
      latitude: -1.2921 + (Math.random() - 0.5) * 2,
      longitude: 36.8219 + (Math.random() - 0.5) * 2,
      weight: 100,
      ownership: 'owned'
    };
    onPointsChange([...points, newNode]);
  };

  const removeNode = (id: string) => {
    onPointsChange(points.filter(node => node.id !== id));
  };

  const updateNode = (id: string, field: keyof Node, value: any) => {
    onPointsChange(points.map(node => 
      node.id === id ? { ...node, [field]: value } : node
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Demand Points</h3>
        <Button onClick={addNode} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>
      
      <div className="space-y-3">
        {points.map((node) => (
          <Card key={node.id}>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                <div>
                  <Label htmlFor={`name-${node.id}`}>Name</Label>
                  <Input
                    id={`name-${node.id}`}
                    value={node.name}
                    onChange={(e) => updateNode(node.id, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`lat-${node.id}`}>Latitude</Label>
                  <Input
                    id={`lat-${node.id}`}
                    type="number"
                    step="0.0001"
                    value={node.latitude}
                    onChange={(e) => updateNode(node.id, 'latitude', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor={`lng-${node.id}`}>Longitude</Label>
                  <Input
                    id={`lng-${node.id}`}
                    type="number"
                    step="0.0001"
                    value={node.longitude}
                    onChange={(e) => updateNode(node.id, 'longitude', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor={`weight-${node.id}`}>Demand Weight</Label>
                  <Input
                    id={`weight-${node.id}`}
                    type="number"
                    value={node.weight || 0}
                    onChange={(e) => updateNode(node.id, 'weight', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeNode(node.id)}
                    disabled={points.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
