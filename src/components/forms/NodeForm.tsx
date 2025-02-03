import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type NodeFormData = {
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  fixedCost: number;
  variableCost: number;
};

export const NodeForm = () => {
  const { register, handleSubmit, reset } = useForm<NodeFormData>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: NodeFormData) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { error } = await supabase.from("nodes").insert({
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        capacity: data.capacity,
        fixed_cost: data.fixedCost,
        variable_cost: data.variableCost,
        user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Node added successfully",
      });
      reset();
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

  return (
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
  );
};