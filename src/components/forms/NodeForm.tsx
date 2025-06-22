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

type Node = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  fixed_cost: number;
  variable_cost: number;
};

type NodeFormData = {
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  fixedCost: number;
  variableCost: number;
};

export const NodeForm = ({ projectId }: { projectId: string }) => {
  const { register, handleSubmit, reset } = useForm<NodeFormData>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: nodes, isLoading: isLoadingNodes } = useQuery<Node[]>({
    queryKey: ['nodes', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nodes')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  const onSubmit = async (data: NodeFormData) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No authenticated user found");
      if (!projectId) throw new Error("No project selected");

      const { error } = await supabase.from("nodes").insert({
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        capacity: data.capacity,
        fixed_cost: data.fixedCost,
        variable_cost: data.variableCost,
        user_id: user.id,
        project_id: projectId,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Node added successfully",
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ['nodes', projectId] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add node",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteNode = async (nodeId: number) => {
    try {
      const { error } = await supabase.from('nodes').delete().eq('id', nodeId);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Node deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['nodes', projectId] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete node",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Supply Node</CardTitle>
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
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  {...register("capacity", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fixedCost">Fixed Cost</Label>
                <Input
                  id="fixedCost"
                  type="number"
                  {...register("fixedCost", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variableCost">Variable Cost</Label>
                <Input
                  id="variableCost"
                  type="number"
                  {...register("variableCost", { required: true })}
                />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Node"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Supply Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingNodes ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : nodes && nodes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Fixed Cost</TableHead>
                  <TableHead>Variable Cost</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nodes.map((node) => (
                  <TableRow key={node.id}>
                    <TableCell>{node.name}</TableCell>
                    <TableCell>{node.capacity}</TableCell>
                    <TableCell>{node.fixed_cost}</TableCell>
                    <TableCell>{node.variable_cost}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => deleteNode(node.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No nodes found for this project.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};