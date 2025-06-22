import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// DB types
export type VehicleData = {
  id: string;
  project_id: string;
  name: string;
  type: string;
  ownership: "owned" | "outsourced";
  capacity: number;
  capacity_unit: "tons" | "kg" | "pallets" | "cbm";
  fuel_consumption: number;
  maintenance_cost: number;
  driver_cost_per_day: number;
  max_speed: number;
  weight_limit: number;
  height_limit: number;
  width_limit: number;
  misc_expenses: number;
};

export type WarehouseData = {
  id: string;
  project_id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  ownership: "owned" | "outsourced";
  size: number;
  size_unit: "sqm" | "sqft";
  functions: string[];
  automation_level: "automated" | "semi-automated" | "manual";
  cold_chain: boolean;
  cold_chain_temperature?: number;
  monthly_cost: number;
  handling_cost_per_unit: number;
  labor_cost: number;
};

export type RouteConstraintData = {
  id: string;
  project_id: string;
  name: string;
  type: "checkpoint" | "toll" | "weight-restriction" | "time-window" | "environmental-zone";
  latitude?: number;
  longitude?: number;
  cost: number;
  time_delay: number;
  restrictions: string[];
  notes: string;
};

interface ComprehensiveDataContentProps {
  projectId: string;
}

export const ComprehensiveDataContent = ({ projectId }: ComprehensiveDataContentProps) => {
  const [activeTab, setActiveTab] = useState("vehicles");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Local state for forms (will be removed)
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [routeConstraints, setRouteConstraints] = useState<RouteConstraintData[]>([]);

  // Fetching data
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useQuery<VehicleData[]>({
    queryKey: ['vehicles', projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from('vehicles').select('*').eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!projectId,
  });

  const { data: warehousesData, isLoading: isLoadingWarehouses } = useQuery<WarehouseData[]>({
    queryKey: ['warehouses', projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from('warehouses').select('*').eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!projectId,
  });

  const { data: routeConstraintsData, isLoading: isLoadingRouteConstraints } = useQuery<RouteConstraintData[]>({
    queryKey: ['route_constraints', projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from('route_constraints').select('*').eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!projectId,
  });

  // Mutations for adding data
  const addVehicleMutation = useMutation({
    mutationFn: async (newVehicle: Omit<VehicleData, 'id'>) => {
      const { data, error } = await supabase.from('vehicles').insert(newVehicle).select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', projectId] });
      toast({ title: "Success", description: "Vehicle added." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const addWarehouseMutation = useMutation({
    mutationFn: async (newWarehouse: Omit<WarehouseData, 'id'>) => {
      const { data, error } = await supabase.from('warehouses').insert(newWarehouse).select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses', projectId] });
      toast({ title: "Success", description: "Warehouse added." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const addRouteConstraintMutation = useMutation({
    mutationFn: async (newConstraint: Omit<RouteConstraintData, 'id'>) => {
      const { data, error } = await supabase.from('route_constraints').insert(newConstraint).select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['route_constraints', projectId] });
      toast({ title: "Success", description: "Route constraint added." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
  
    // Delete Mutations
  const deleteVehicleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', projectId] });
      toast({ title: 'Success', description: 'Vehicle deleted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Forms
  const vehicleForm = useForm<VehicleData>({
    defaultValues: {
      id: crypto.randomUUID(),
      project_id: projectId,
      name: "",
      type: "truck",
      ownership: "owned",
      capacity: 0,
      capacity_unit: "tons",
      fuel_consumption: 0,
      maintenance_cost: 0,
      driver_cost_per_day: 0,
      max_speed: 80,
      weight_limit: 0,
      height_limit: 0,
      width_limit: 0,
      misc_expenses: 0,
    },
  });
  
  // Submit handlers
  const handleVehicleSubmit = (data: VehicleData) => {
    addVehicleMutation.mutate({...data, project_id: projectId});
    vehicleForm.reset();
  };

  // ... (Similar forms and handlers for warehouse and route constraints)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprehensive Supply Chain Data</CardTitle>
        <CardDescription>
          Enter detailed information about your supply chain components.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vehicles">
          <TabsList className="mb-6 grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
            <TabsTrigger value="route-constraints">Route Constraints</TabsTrigger>
            <TabsTrigger value="existing-data">Existing Data</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            <form onSubmit={vehicleForm.handleSubmit(handleVehicleSubmit)}>
              <div className="grid gap-4 py-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Delivery Truck 01"
                    {...vehicleForm.register("name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Vehicle Type</Label>
                  <Select
                    onValueChange={(value) => vehicleForm.setValue("type", value)}
                    defaultValue="truck"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="train">Train</SelectItem>
                        <SelectItem value="aircraft">Aircraft</SelectItem>
                        <SelectItem value="ship">Ship</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownership">Ownership</Label>
                  <Select
                    onValueChange={(value: "owned" | "outsourced") => vehicleForm.setValue("ownership", value)}
                    defaultValue="owned"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="owned">Owned</SelectItem>
                        <SelectItem value="outsourced">Outsourced</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="0"
                      {...vehicleForm.register("capacity", { valueAsNumber: true })}
                    />
                    <Select
                      onValueChange={(value: "tons" | "kg" | "pallets" | "cbm") => 
                        vehicleForm.setValue("capacity_unit", value)
                      }
                      defaultValue="tons"
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="tons">Tons</SelectItem>
                          <SelectItem value="kg">KG</SelectItem>
                          <SelectItem value="pallets">Pallets</SelectItem>
                          <SelectItem value="cbm">CBM</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuel_consumption">Fuel Consumption (L/100km)</Label>
                  <Input
                    id="fuel_consumption"
                    type="number"
                    placeholder="0"
                    {...vehicleForm.register("fuel_consumption", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenance_cost">Monthly Maintenance Cost (KES)</Label>
                  <Input
                    id="maintenance_cost"
                    type="number"
                    placeholder="0"
                    {...vehicleForm.register("maintenance_cost", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driver_cost_per_day">Driver Cost per Day (KES)</Label>
                  <Input
                    id="driver_cost_per_day"
                    type="number"
                    placeholder="0"
                    {...vehicleForm.register("driver_cost_per_day", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_speed">Maximum Speed (km/h)</Label>
                  <Input
                    id="max_speed"
                    type="number"
                    placeholder="80"
                    {...vehicleForm.register("max_speed", { valueAsNumber: true })}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Vehicle Restrictions</Label>
                  <div className="grid gap-4 mt-2 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="weight_limit">Weight Limit (tons)</Label>
                      <Input
                        id="weight_limit"
                        type="number"
                        placeholder="0"
                        {...vehicleForm.register("weight_limit", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height_limit">Height Limit (m)</Label>
                      <Input
                        id="height_limit"
                        type="number"
                        placeholder="0"
                        {...vehicleForm.register("height_limit", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width_limit">Width Limit (m)</Label>
                      <Input
                        id="width_limit"
                        type="number"
                        placeholder="0"
                        {...vehicleForm.register("width_limit", { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="misc_expenses">Miscellaneous Expenses (KES/month)</Label>
                  <Input
                    id="misc_expenses"
                    type="number"
                    placeholder="0"
                    {...vehicleForm.register("misc_expenses", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <Button type="submit" disabled={addVehicleMutation.isLoading}>
                {addVehicleMutation.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Vehicle
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="warehouses">
            <form onSubmit={warehouseForm.handleSubmit(handleWarehouseSubmit)}>
              <div className="grid gap-4 py-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Warehouse/Facility Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Central Distribution Center"
                    {...warehouseForm.register("name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownership">Ownership</Label>
                  <Select
                    onValueChange={(value: "owned" | "outsourced") => warehouseForm.setValue("ownership", value)}
                    defaultValue="owned"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="owned">Owned</SelectItem>
                        <SelectItem value="outsourced">Outsourced/Leased</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>Location</Label>
                  <div className="grid gap-4 mt-2 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        placeholder="0.0000"
                        {...warehouseForm.register("latitude", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        placeholder="0.0000"
                        {...warehouseForm.register("longitude", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Physical address"
                        {...warehouseForm.register("address")}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Facility Size</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="size"
                      type="number"
                      placeholder="0"
                      {...warehouseForm.register("size", { valueAsNumber: true })}
                    />
                    <Select
                      onValueChange={(value: "sqm" | "sqft") => 
                        warehouseForm.setValue("size_unit", value)
                      }
                      defaultValue="sqm"
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="sqm">m²</SelectItem>
                          <SelectItem value="sqft">ft²</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="automation_level">Automation Level</Label>
                  <Select
                    onValueChange={(value: "automated" | "semi-automated" | "manual") => 
                      warehouseForm.setValue("automation_level", value)
                    }
                    defaultValue="manual"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select automation level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="automated">Fully Automated</SelectItem>
                        <SelectItem value="semi-automated">Semi-Automated</SelectItem>
                        <SelectItem value="manual">Manual Operations</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>Warehouse Functions</Label>
                  <div className="grid gap-2 mt-2 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="storage" onCheckedChange={(checked) => {
                        const functions = warehouseForm.getValues("functions");
                        if (checked) {
                          warehouseForm.setValue("functions", [...functions, "storage"]);
                        } else {
                          warehouseForm.setValue("functions", functions.filter(f => f !== "storage"));
                        }
                      }} />
                      <Label htmlFor="storage">Storage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="crossdocking" onCheckedChange={(checked) => {
                        const functions = warehouseForm.getValues("functions");
                        if (checked) {
                          warehouseForm.setValue("functions", [...functions, "cross-docking"]);
                        } else {
                          warehouseForm.setValue("functions", functions.filter(f => f !== "cross-docking"));
                        }
                      }} />
                      <Label htmlFor="crossdocking">Cross-Docking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="transhipment" onCheckedChange={(checked) => {
                        const functions = warehouseForm.getValues("functions");
                        if (checked) {
                          warehouseForm.setValue("functions", [...functions, "transshipment"]);
                        } else {
                          warehouseForm.setValue("functions", functions.filter(f => f !== "transshipment"));
                        }
                      }} />
                      <Label htmlFor="transhipment">Transshipment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="valueAddition" onCheckedChange={(checked) => {
                        const functions = warehouseForm.getValues("functions");
                        if (checked) {
                          warehouseForm.setValue("functions", [...functions, "value-addition"]);
                        } else {
                          warehouseForm.setValue("functions", functions.filter(f => f !== "value-addition"));
                        }
                      }} />
                      <Label htmlFor="valueAddition">Value Addition</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="distribution" onCheckedChange={(checked) => {
                        const functions = warehouseForm.getValues("functions");
                        if (checked) {
                          warehouseForm.setValue("functions", [...functions, "distribution"]);
                        } else {
                          warehouseForm.setValue("functions", functions.filter(f => f !== "distribution"));
                        }
                      }} />
                      <Label htmlFor="distribution">Distribution</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="customs" onCheckedChange={(checked) => {
                        const functions = warehouseForm.getValues("functions");
                        if (checked) {
                          warehouseForm.setValue("functions", [...functions, "customs"]);
                        } else {
                          warehouseForm.setValue("functions", functions.filter(f => f !== "customs"));
                        }
                      }} />
                      <Label htmlFor="customs">Customs Clearance</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="cold_chain" onCheckedChange={(checked) => {
                      warehouseForm.setValue("cold_chain", checked);
                    }} />
                    <Label htmlFor="cold_chain">Cold Chain Facility</Label>
                  </div>
                </div>

                {warehouseForm.watch("cold_chain") && (
                  <div className="space-y-2">
                    <Label htmlFor="cold_chain_temperature">Temperature Range (°C)</Label>
                    <Input
                      id="cold_chain_temperature"
                      type="number"
                      placeholder="e.g., -18"
                      {...warehouseForm.register("cold_chain_temperature", { valueAsNumber: true })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="monthly_cost">Monthly Operating Cost (KES)</Label>
                  <Input
                    id="monthly_cost"
                    type="number"
                    placeholder="0"
                    {...warehouseForm.register("monthly_cost", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handling_cost_per_unit">Handling Cost per Unit (KES)</Label>
                  <Input
                    id="handling_cost_per_unit"
                    type="number"
                    placeholder="0"
                    {...warehouseForm.register("handling_cost_per_unit", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="labor_cost">Monthly Labor Cost (KES)</Label>
                  <Input
                    id="labor_cost"
                    type="number"
                    placeholder="0"
                    {...warehouseForm.register("labor_cost", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <Button type="submit" className="mt-4">
                Add Warehouse/Facility
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="route-constraints">
            <form onSubmit={routeConstraintForm.handleSubmit(handleRouteConstraintSubmit)}>
              <div className="grid gap-4 py-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Constraint Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Nakuru Weigh Bridge"
                    {...routeConstraintForm.register("name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Constraint Type</Label>
                  <Select
                    onValueChange={(value: "checkpoint" | "toll" | "weight-restriction" | "time-window" | "environmental-zone") => 
                      routeConstraintForm.setValue("type", value)
                    }
                    defaultValue="checkpoint"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select constraint type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="checkpoint">Checkpoint/Weigh Bridge</SelectItem>
                        <SelectItem value="toll">Toll Station</SelectItem>
                        <SelectItem value="weight-restriction">Weight Restriction</SelectItem>
                        <SelectItem value="time-window">Time Window Restriction</SelectItem>
                        <SelectItem value="environmental-zone">Environmental Zone</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>Location (if applicable)</Label>
                  <div className="grid gap-4 mt-2 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="latitudeConstraint">Latitude</Label>
                      <Input
                        id="latitudeConstraint"
                        type="number"
                        placeholder="0.0000"
                        onChange={(e) => {
                          if (!routeConstraintForm.getValues("location")) {
                            routeConstraintForm.setValue("location", { latitude: 0, longitude: 0 });
                          }
                          routeConstraintForm.setValue("location.latitude", parseFloat(e.target.value));
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitudeConstraint">Longitude</Label>
                      <Input
                        id="longitudeConstraint"
                        type="number"
                        placeholder="0.0000"
                        onChange={(e) => {
                          if (!routeConstraintForm.getValues("location")) {
                            routeConstraintForm.setValue("location", { latitude: 0, longitude: 0 });
                          }
                          routeConstraintForm.setValue("location.longitude", parseFloat(e.target.value));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (KES)</Label>
                  <Input
                    id="cost"
                    type="number"
                    placeholder="0"
                    {...routeConstraintForm.register("cost", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time_delay">Time Delay (minutes)</Label>
                  <Input
                    id="time_delay"
                    type="number"
                    placeholder="0"
                    {...routeConstraintForm.register("time_delay", { valueAsNumber: true })}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Specific Restrictions</Label>
                  <div className="grid gap-2 mt-2 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="weightRestriction" onCheckedChange={(checked) => {
                        const restrictions = routeConstraintForm.getValues("restrictions");
                        if (checked) {
                          routeConstraintForm.setValue("restrictions", [...restrictions, "weight"]);
                        } else {
                          routeConstraintForm.setValue("restrictions", restrictions.filter(r => r !== "weight"));
                        }
                      }} />
                      <Label htmlFor="weightRestriction">Weight Restriction</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="heightRestriction" onCheckedChange={(checked) => {
                        const restrictions = routeConstraintForm.getValues("restrictions");
                        if (checked) {
                          routeConstraintForm.setValue("restrictions", [...restrictions, "height"]);
                        } else {
                          routeConstraintForm.setValue("restrictions", restrictions.filter(r => r !== "height"));
                        }
                      }} />
                      <Label htmlFor="heightRestriction">Height Restriction</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="timeRestriction" onCheckedChange={(checked) => {
                        const restrictions = routeConstraintForm.getValues("restrictions");
                        if (checked) {
                          routeConstraintForm.setValue("restrictions", [...restrictions, "time"]);
                        } else {
                          routeConstraintForm.setValue("restrictions", restrictions.filter(r => r !== "time"));
                        }
                      }} />
                      <Label htmlFor="timeRestriction">Time Restriction</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="vehicleTypeRestriction" onCheckedChange={(checked) => {
                        const restrictions = routeConstraintForm.getValues("restrictions");
                        if (checked) {
                          routeConstraintForm.setValue("restrictions", [...restrictions, "vehicle-type"]);
                        } else {
                          routeConstraintForm.setValue("restrictions", restrictions.filter(r => r !== "vehicle-type"));
                        }
                      }} />
                      <Label htmlFor="vehicleTypeRestriction">Vehicle Type Restriction</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="goodsTypeRestriction" onCheckedChange={(checked) => {
                        const restrictions = routeConstraintForm.getValues("restrictions");
                        if (checked) {
                          routeConstraintForm.setValue("restrictions", [...restrictions, "goods-type"]);
                        } else {
                          routeConstraintForm.setValue("restrictions", restrictions.filter(r => r !== "goods-type"));
                        }
                      }} />
                      <Label htmlFor="goodsTypeRestriction">Goods Type Restriction</Label>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    placeholder="Additional details about this constraint"
                    {...routeConstraintForm.register("notes")}
                  />
                </div>
              </div>

              <Button type="submit" className="mt-4">
                Add Route Constraint
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="existing-data" className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Existing Vehicles</h3>
              {isLoadingVehicles ? <Loader2 className="animate-spin" /> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehiclesData?.map(v => (
                      <TableRow key={v.id}>
                        <TableCell>{v.name}</TableCell>
                        <TableCell>{v.type}</TableCell>
                        <TableCell>{v.capacity} {v.capacity_unit}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => deleteVehicleMutation.mutate(v.id)} disabled={deleteVehicleMutation.isLoading}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            
            {/* Tables for warehouses and route constraints */}

          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
