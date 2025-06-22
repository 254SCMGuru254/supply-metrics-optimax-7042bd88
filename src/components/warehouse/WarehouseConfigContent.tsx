import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Warehouse, Building, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type WarehouseNode = {
  id: string;
  name: string;
  type: 'warehouse';
  latitude: number;
  longitude: number;
  capacity: number;
}

interface WarehouseConfigProps {
  projectId: string;
}

export function WarehouseConfigContent({ projectId }: WarehouseConfigProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [warehouseName, setWarehouseName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });

  const { data: warehouses, isLoading } = useQuery<WarehouseNode[]>({
    queryKey: ['warehouses', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nodes')
        .select('*')
        .eq('project_id', projectId)
        .eq('type', 'warehouse');
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!projectId,
  });

  const addWarehouseMutation = useMutation({
    mutationFn: async (newWarehouse: Omit<WarehouseNode, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.from('nodes').insert({
        ...newWarehouse,
        user_id: user.id,
        project_id: projectId
      }).select();
      if(error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses', projectId] });
      toast({ title: 'Success', description: 'Warehouse added successfully.' });
      // Reset form
      setWarehouseName("");
      setCapacity("");
      setLocation({ lat: "", lng: "" });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteWarehouseMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('nodes').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses', projectId] });
      toast({ title: 'Success', description: 'Warehouse removed successfully.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });


  const addWarehouse = () => {
    if (!warehouseName || !capacity || !location.lat || !location.lng) {
      toast({ title: 'Error', description: 'All fields are required.', variant: 'destructive' });
      return;
    }

    addWarehouseMutation.mutate({
      name: warehouseName,
      type: "warehouse",
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lng),
      capacity: parseInt(capacity),
    });
  };

  const removeWarehouse = (id: string) => {
    deleteWarehouseMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            Add Warehouse
          </CardTitle>
          <CardDescription>
            Configure warehouse locations and capacities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="warehouse-name">Warehouse Name</Label>
              <Input
                id="warehouse-name"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                placeholder="Enter warehouse name"
              />
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Storage capacity"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={location.lat}
                onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                placeholder="e.g., -1.2921"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={location.lng}
                onChange={(e) => setLocation({ ...location, lng: e.target.value })}
                placeholder="e.g., 36.8219"
              />
            </div>
          </div>
          <Button onClick={addWarehouse} className="w-full" disabled={addWarehouseMutation.isLoading}>
            {addWarehouseMutation.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add Warehouse
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Configured Warehouses
          </CardTitle>
          <CardDescription>
            Currently configured warehouse locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : warehouses?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No warehouses configured. Add your first warehouse above.
            </p>
          ) : (
            <div className="space-y-2">
              {warehouses?.map((warehouse) => (
                <div key={warehouse.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{warehouse.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Capacity: {warehouse.capacity} | Location: [{warehouse.latitude.toFixed(4)}, {warehouse.longitude.toFixed(4)}]
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeWarehouse(warehouse.id)}
                    disabled={deleteWarehouseMutation.isLoading}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
