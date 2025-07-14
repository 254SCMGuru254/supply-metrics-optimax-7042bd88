
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface CogDataContentProps {
  projectId: string;
}

interface DemandPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  demand: number;
}

export const CogDataContent: React.FC<CogDataContentProps> = ({ projectId }) => {
  const [demandPoints, setDemandPoints] = useState<DemandPoint[]>([]);

  const addDemandPoint = () => {
    const newPoint: DemandPoint = {
      id: Date.now().toString(),
      name: `Location ${demandPoints.length + 1}`,
      latitude: -1.2921,
      longitude: 36.8219,
      demand: 100
    };
    setDemandPoints([...demandPoints, newPoint]);
  };

  const removeDemandPoint = (id: string) => {
    setDemandPoints(demandPoints.filter(point => point.id !== id));
  };

  const updateDemandPoint = (id: string, field: keyof DemandPoint, value: string | number) => {
    setDemandPoints(demandPoints.map(point =>
      point.id === id ? { ...point, [field]: value } : point
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Center of Gravity Data Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Demand Points</h3>
          <Button onClick={addDemandPoint} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Point
          </Button>
        </div>
        
        {demandPoints.map((point) => (
          <div key={point.id} className="grid grid-cols-5 gap-4 p-4 border rounded-lg">
            <div>
              <Label htmlFor={`name-${point.id}`}>Name</Label>
              <Input
                id={`name-${point.id}`}
                value={point.name}
                onChange={(e) => updateDemandPoint(point.id, 'name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`lat-${point.id}`}>Latitude</Label>
              <Input
                id={`lat-${point.id}`}
                type="number"
                step="0.0001"
                value={point.latitude}
                onChange={(e) => updateDemandPoint(point.id, 'latitude', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor={`lng-${point.id}`}>Longitude</Label>
              <Input
                id={`lng-${point.id}`}
                type="number"
                step="0.0001"
                value={point.longitude}
                onChange={(e) => updateDemandPoint(point.id, 'longitude', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor={`demand-${point.id}`}>Demand</Label>
              <Input
                id={`demand-${point.id}`}
                type="number"
                value={point.demand}
                onChange={(e) => updateDemandPoint(point.id, 'demand', parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeDemandPoint(point.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {demandPoints.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No demand points added yet. Click "Add Point" to get started.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
