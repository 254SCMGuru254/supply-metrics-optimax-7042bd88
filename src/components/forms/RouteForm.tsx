import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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

type RouteFormData = {
  originId: string;
  destinationId: string;
  distance: number;
  costPerUnit: number;
  transitTime: number;
};

type Node = {
  id: string;
  name: string;
};

type DemandPoint = {
  id: string;
  name: string;
};

export const RouteForm = () => {
  const { register, handleSubmit, reset } = useForm<RouteFormData>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [demandPoints, setDemandPoints] = useState<DemandPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: nodesData } = await supabase.from("nodes").select("id, name");
      const { data: demandData } = await supabase
        .from("demand_points")
        .select("id, name");

      if (nodesData) setNodes(nodesData);
      if (demandData) setDemandPoints(demandData);
    };

    fetchData();
  }, []);

  const onSubmit = async (data: RouteFormData) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { error } = await supabase.from("routes").insert({
        origin_id: data.originId,
        destination_id: data.destinationId,
        distance: data.distance,
        cost_per_unit: data.costPerUnit,
        transit_time: data.transitTime,
        user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Route added successfully",
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add route",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="originId">Origin Node</Label>
          <Select {...register("originId", { required: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Select origin node" />
            </SelectTrigger>
            <SelectContent>
              {nodes.map((node) => (
                <SelectItem key={node.id} value={node.id}>
                  {node.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="destinationId">Destination Point</Label>
          <Select {...register("destinationId", { required: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination point" />
            </SelectTrigger>
            <SelectContent>
              {demandPoints.map((point) => (
                <SelectItem key={point.id} value={point.id}>
                  {point.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="distance">Distance</Label>
          <Input
            id="distance"
            type="number"
            step="any"
            {...register("distance", { required: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="costPerUnit">Cost per Unit</Label>
          <Input
            id="costPerUnit"
            type="number"
            step="any"
            {...register("costPerUnit", { required: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="transitTime">Transit Time (hours)</Label>
          <Input
            id="transitTime"
            type="number"
            step="any"
            {...register("transitTime", { required: true })}
          />
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Route"}
      </Button>
    </form>
  );
};