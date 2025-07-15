
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Trash2, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CogDataContentProps {
  projectId: string;
}

export const CogDataContent: React.FC<CogDataContentProps> = ({ projectId }) => {
  const [demandPoints, setDemandPoints] = useState<any[]>([]);
  const { toast } = useToast();

  const addDemandPoint = () => {
    const newPoint = {
      id: crypto.randomUUID(),
      name: `Point ${demandPoints.length + 1}`,
      latitude: -1.2921 + (Math.random() - 0.5) * 2,
      longitude: 36.8219 + (Math.random() - 0.5) * 2,
      demand: Math.floor(Math.random() * 500) + 100
    };
    setDemandPoints([...demandPoints, newPoint]);
    
    toast({
      title: "Demand Point Added",
      description: "New demand point has been added to your project"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Center of Gravity Data Input
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Demand Points</h3>
          <Button onClick={addDemandPoint}>
            <Plus className="h-4 w-4 mr-2" />
            Add Point
          </Button>
        </div>

        <div className="grid gap-4">
          {demandPoints.map((point, index) => (
            <Card key={point.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={point.name} readOnly />
                </div>
                <div>
                  <Label>Latitude</Label>
                  <Input value={point.latitude.toFixed(6)} readOnly />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input value={point.longitude.toFixed(6)} readOnly />
                </div>
                <div>
                  <Label>Demand</Label>
                  <Input value={point.demand} readOnly />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {demandPoints.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No demand points added yet. Click "Add Point" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
