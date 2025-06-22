import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";

type DemandPoint = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  demand: number;
  service_level: number;
};

type DemandPointFormData = {
  name: string;
  latitude: number;
  longitude: number;
  demand: number;
  serviceLevel: number;
};

export const DemandPointForm = ({ projectId }: { projectId: string }) => {
  const { register, handleSubmit, reset } = useForm<DemandPointFormData>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: demandPoints, isLoading: isLoadingDemandPoints } = useQuery<DemandPoint[]>({
    queryKey: ['demandPoints', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demand_points')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  const onSubmit = async (data: DemandPointFormData) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No authenticated user found");
      if (!projectId) throw new Error("No project selected");

      const { error } = await supabase.from("demand_points").insert({
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        demand: data.demand,
        service_level: data.serviceLevel,
        user_id: user.id,
        project_id: projectId
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Demand point added successfully",
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ['demandPoints', projectId] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add demand point",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDemandPoint = async (pointId: number) => {
    try {
      const { error } = await supabase.from('demand_points').delete().eq('id', pointId);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Demand point deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['demandPoints', projectId] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete demand point",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Demand Point</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  {...register("latitude", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  {...register("longitude", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demand">Demand</Label>
                <Input
                  id="demand"
                  type="number"
                  {...register("demand", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceLevel">Service Level (%)</Label>
                <Input
                  id="serviceLevel"
                  type="number"
                  min="0"
                  max="100"
                  {...register("serviceLevel", { required: true })}
                />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Demand Point"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Existing Demand Points</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingDemandPoints ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : demandPoints && demandPoints.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Demand</TableHead>
                  <TableHead>Service Level</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demandPoints.map((point) => (
                  <TableRow key={point.id}>
                    <TableCell>{point.name}</TableCell>
                    <TableCell>{point.demand}</TableCell>
                    <TableCell>{point.service_level}%</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => deleteDemandPoint(point.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No demand points found for this project.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};