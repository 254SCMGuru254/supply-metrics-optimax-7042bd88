
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Trash2, Calculator } from 'lucide-react';

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
  const [newPoint, setNewPoint] = useState({
    name: '',
    latitude: 0,
    longitude: 0,
    demand: 0
  });

  const addDemandPoint = () => {
    if (newPoint.name && newPoint.latitude && newPoint.longitude && newPoint.demand) {
      const point: DemandPoint = {
        id: Date.now().toString(),
        ...newPoint
      };
      setDemandPoints([...demandPoints, point]);
      setNewPoint({ name: '', latitude: 0, longitude: 0, demand: 0 });
    }
  };

  const removeDemandPoint = (id: string) => {
    setDemandPoints(demandPoints.filter(point => point.id !== id));
  };

  const calculateCenterOfGravity = () => {
    if (demandPoints.length === 0) return;

    const totalDemand = demandPoints.reduce((sum, point) => sum + point.demand, 0);
    const weightedLat = demandPoints.reduce((sum, point) => sum + (point.latitude * point.demand), 0);
    const weightedLng = demandPoints.reduce((sum, point) => sum + (point.longitude * point.demand), 0);

    const cogLat = weightedLat / totalDemand;
    const cogLng = weightedLng / totalDemand;

    alert(`Center of Gravity: Latitude ${cogLat.toFixed(4)}, Longitude ${cogLng.toFixed(4)}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Center of Gravity Data Input
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <Label htmlFor="point-name">Location Name</Label>
              <Input
                id="point-name"
                value={newPoint.name}
                onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
                placeholder="Enter location name"
              />
            </div>
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                value={newPoint.latitude}
                onChange={(e) => setNewPoint({ ...newPoint, latitude: parseFloat(e.target.value) || 0 })}
                placeholder="Latitude"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                value={newPoint.longitude}
                onChange={(e) => setNewPoint({ ...newPoint, longitude: parseFloat(e.target.value) || 0 })}
                placeholder="Longitude"
              />
            </div>
            <div>
              <Label htmlFor="demand">Demand Weight</Label>
              <Input
                id="demand"
                type="number"
                value={newPoint.demand}
                onChange={(e) => setNewPoint({ ...newPoint, demand: parseFloat(e.target.value) || 0 })}
                placeholder="Demand"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addDemandPoint} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Point
              </Button>
            </div>
          </div>

          {demandPoints.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Demand Points</h3>
                <Badge variant="outline">{demandPoints.length} points</Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Latitude</th>
                      <th className="text-left p-2">Longitude</th>
                      <th className="text-left p-2">Demand</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demandPoints.map((point) => (
                      <tr key={point.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{point.name}</td>
                        <td className="p-2">{point.latitude}</td>
                        <td className="p-2">{point.longitude}</td>
                        <td className="p-2">{point.demand}</td>
                        <td className="p-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeDemandPoint(point.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button onClick={calculateCenterOfGravity} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Center of Gravity
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
