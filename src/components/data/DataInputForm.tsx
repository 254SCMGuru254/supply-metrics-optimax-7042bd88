
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save } from 'lucide-react';

interface DataInputFormProps {
  projectId: string;
}

export const DataInputForm: React.FC<DataInputFormProps> = ({ projectId }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'demand',
    latitude: 0,
    longitude: 0,
    capacity: 0,
    demand: 0,
    fixed_cost: 0,
    variable_cost: 0
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically save to Supabase
    toast({
      title: "Data Saved",
      description: "Your data has been saved successfully!",
    });

    // Reset form
    setFormData({
      name: '',
      type: 'demand',
      latitude: 0,
      longitude: 0,
      capacity: 0,
      demand: 0,
      fixed_cost: 0,
      variable_cost: 0
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Manual Data Entry</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Location Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
              />
            </div>

            <div>
              <Label htmlFor="demand">Demand</Label>
              <Input
                id="demand"
                type="number"
                value={formData.demand}
                onChange={(e) => setFormData(prev => ({ ...prev, demand: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Data
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DataInputForm;
