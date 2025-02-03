import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type DemandPointFormData = {
  name: string;
  latitude: number;
  longitude: number;
  demand: number;
  serviceLevel: number;
};

export const DemandPointForm = () => {
  const { register, handleSubmit, reset } = useForm<DemandPointFormData>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: DemandPointFormData) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { error } = await supabase.from("demand_points").insert({
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        demand: data.demand,
        service_level: data.serviceLevel,
        user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Demand point added successfully",
      });
      reset();
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
  );
};