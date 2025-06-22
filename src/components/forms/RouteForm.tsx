import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";

type RouteFormData = {
  originId: number;
  destinationId: number;
  distance: number;
  costPerUnit: number;
  transitTime: number;
};

type Node = {
  id: number;
  name: string;
};

type DemandPoint = {
  id: number;
  name: string;
};

type Route = {
  id: number;
  origin_id: number;
  destination_id: number;
  distance: number;
  cost_per_unit: number;
  transit_time: number;
  nodes: { name: string };
  demand_points: { name: string };
};

export const RouteForm = ({ projectId }: { projectId: string }) => {
  const { register, handleSubmit, reset, control } = useForm<RouteFormData>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: nodes, isLoading: isLoadingNodes } = useQuery<Node[]>({
    queryKey: ['nodes', projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from('nodes').select('id, name').eq('project_id', projectId);
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  const { data: demandPoints, isLoading: isLoadingDemandPoints } = useQuery<DemandPoint[]>({
    queryKey: ['demandPoints', projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from('demand_points').select('id, name').eq('project_id', projectId);
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  const { data: routes, isLoading: isLoadingRoutes } = useQuery<Route[]>({
    queryKey: ['routes', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select('*, nodes(name), demand_points(name)')
        .eq('project_id', projectId);
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  const onSubmit = async (data: RouteFormData) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No authenticated user found");
      if (!projectId) throw new Error("No project selected");

      const { error } = await supabase.from("routes").insert({
        origin_id: data.originId,
        destination_id: data.destinationId,
        distance: data.distance,
        cost_per_unit: data.costPerUnit,
        transit_time: data.transitTime,
        user_id: user.id,
        project_id: projectId
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Route added successfully",
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ['routes', projectId] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add route",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const deleteRoute = async (routeId: number) => {
    try {
      const { error } = await supabase.from('routes').delete().eq('id', routeId);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Route deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['routes', projectId] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete route",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Route</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originId">Origin Node</Label>
                <Controller
                  name="originId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value?.toString()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin node" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingNodes ? <SelectItem value="loading" disabled>Loading...</SelectItem> : 
                          nodes?.map((node) => (
                          <SelectItem key={node.id} value={node.id.toString()}>
                            {node.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationId">Destination Point</Label>
                <Controller
                  name="destinationId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value?.toString()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination point" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingDemandPoints ? <SelectItem value="loading" disabled>Loading...</SelectItem> :
                          demandPoints?.map((point) => (
                          <SelectItem key={point.id} value={point.id.toString()}>
                            {point.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input id="distance" type="number" step="any" {...register("distance", { required: true, valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPerUnit">Cost per Unit</Label>
                <Input id="costPerUnit" type="number" step="any" {...register("costPerUnit", { required: true, valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transitTime">Transit Time (hours)</Label>
                <Input id="transitTime" type="number" step="any" {...register("transitTime", { required: true, valueAsNumber: true })} />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Route"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Existing Routes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRoutes ? (
             <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : routes && routes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Cost/Unit</TableHead>
                  <TableHead>Transit Time</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>{route.nodes.name}</TableCell>
                    <TableCell>{route.demand_points.name}</TableCell>
                    <TableCell>{route.distance} km</TableCell>
                    <TableCell>{route.cost_per_unit}</TableCell>
                    <TableCell>{route.transit_time} hrs</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => deleteRoute(route.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No routes found for this project.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};