import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NetworkMap } from '@/components/NetworkMap';
import { Plus, MapPin, Trash2, Settings, Download, Upload, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/auth/AuthProvider';
import { Node, Route, Facility, FacilityType, OwnershipType } from '@/integrations/supabase/types';

interface NetworkDesignProps {
  projectId?: string;
}

const NetworkDesign: React.FC<NetworkDesignProps> = ({ projectId }) => {
  const [newFacility, setNewFacility] = useState<Omit<Facility, "id" | "ownership">>({
    name: 'New Facility',
    type: 'warehouse',
    latitude: -1.2921,
    longitude: 36.8219,
    cost: 50000,
    capacity: 10000
  });
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: facilities, isLoading } = useQuery<Facility[]>({
    queryKey: ['facilities', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from('supply_nodes')
        .select('*')
        .eq('project_id', projectId)
        .eq('node_type', 'facility');

      if (error) throw new Error(error.message);
      return data.map(f => ({
        id: f.id,
        name: f.name,
        type: f.node_type as FacilityType,
        latitude: f.latitude,
        longitude: f.longitude,
        cost: f.fixed_cost,
        capacity: f.capacity,
        ownership: 'owned' as OwnershipType
      }));
    },
    enabled: !!projectId
  });

  const addFacilityMutation = useMutation({
    mutationFn: async (newFacility: Omit<Facility, "id" | "ownership">) => {
      const facility: Facility = {
        ...newFacility,
        id: crypto.randomUUID(),
        ownership: 'owned' as OwnershipType
      };
      const { data, error } = await supabase.from('supply_nodes').insert([{
        id: facility.id,
        project_id: projectId,
        user_id: user?.id,
        name: facility.name,
        latitude: facility.latitude,
        longitude: facility.longitude,
        fixed_cost: facility.cost,
        capacity: facility.capacity,
        node_type: facility.type,
      }]).select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities', projectId] });
      toast({ title: "Facility Added", description: "New facility has been added to your network." });
    },
    onError: (error: Error) => {
      toast({ title: "Error adding facility", description: error.message, variant: 'destructive' });
    }
  });

  const deleteFacilityMutation = useMutation({
    mutationFn: async (facilityId: string) => {
      const { data, error } = await supabase.from('supply_nodes').delete().eq('id', facilityId);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities', projectId] });
      toast({ title: "Facility Deleted", description: "Facility has been removed from your network." });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting facility", description: error.message, variant: 'destructive' });
    }
  });

  const handleAddFacility = async () => {
    try {
      await addFacilityMutation.mutateAsync(newFacility);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteFacility = async (facilityId: string) => {
    try {
      await deleteFacilityMutation.mutateAsync(facilityId);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const mapNodes: Node[] = (facilities || []).map(facility => ({
    id: facility.id,
    name: facility.name,
    type: 'facility',
    latitude: facility.latitude,
    longitude: facility.longitude,
    capacity: facility.capacity,
    ownership: 'owned' as OwnershipType
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewFacility(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Network Design
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Design and optimize your supply chain network with interactive tools and real-time feedback
        </p>
      </div>

      <Tabs defaultValue="design" className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="design">Network Design</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Interactive Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <NetworkMap nodes={mapNodes} routes={[]} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Manage Facilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={newFacility.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    name="type"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newFacility.type}
                    onChange={handleInputChange}
                  >
                    <option value="warehouse">Warehouse</option>
                    <option value="distribution_center">Distribution Center</option>
                    <option value="manufacturing">Manufacturing Plant</option>
                    <option value="retail">Retail Store</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    type="number"
                    id="latitude"
                    name="latitude"
                    value={newFacility.latitude}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    type="number"
                    id="longitude"
                    name="longitude"
                    value={newFacility.longitude}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    type="number"
                    id="cost"
                    name="cost"
                    value={newFacility.cost}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={newFacility.capacity}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <Button onClick={handleAddFacility} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Facility
              </Button>

              <h3 className="text-lg font-semibold mt-6">Existing Facilities</h3>
              <div className="space-y-2">
                {facilities?.map((facility) => (
                  <Card key={facility.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <h4 className="font-semibold">{facility.name}</h4>
                        <p className="text-sm text-gray-500">{facility.type}</p>
                      </div>
                      <div className="md:text-center">
                        <Badge variant="secondary">Capacity: {facility.capacity}</Badge>
                      </div>
                      <div className="md:text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteFacility(facility.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {!facilities || facilities.length === 0 && (
                  <p className="text-gray-500">No facilities added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Optimization Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Configure optimization parameters here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetworkDesign;
