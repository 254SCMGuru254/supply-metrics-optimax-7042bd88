
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Upload, Download, Truck, Building, MapPin, Settings } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VehicleData {
  id?: string;
  name: string;
  type: string;
  ownership: string;
  capacity: number;
  capacity_unit: string;
  fuel_consumption: number;
  maintenance_cost: number;
  driver_cost_per_day: number;
  max_speed: number;
  weight_limit: number;
  height_limit: number;
  width_limit: number;
  misc_expenses: number;
}

interface WarehouseData {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  ownership: string;
  size: number;
  size_unit: string;
  functions: string[];
  automation_level: string;
  cold_chain: boolean;
  cold_chain_temperature: number;
  monthly_cost: number;
  handling_cost_per_unit: number;
  labor_cost: number;
}

interface RouteConstraintData {
  id?: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  cost: number;
  time_delay: number;
  restrictions: string[];
  notes: string;
}

interface ComprehensiveDataContentProps {
  projectId: string;
}

export const ComprehensiveDataContent = ({ projectId }: ComprehensiveDataContentProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Vehicle form state
  const [vehicleForm, setVehicleForm] = useState<VehicleData>({
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
  });

  // Warehouse form state
  const [warehouseForm, setWarehouseForm] = useState<WarehouseData>({
    name: "",
    latitude: 0,
    longitude: 0,
    address: "",
    ownership: "owned",
    size: 0,
    size_unit: "sqm",
    functions: [],
    automation_level: "manual",
    cold_chain: false,
    cold_chain_temperature: 0,
    monthly_cost: 0,
    handling_cost_per_unit: 0,
    labor_cost: 0,
  });

  // Route constraint form state
  const [routeConstraintForm, setRouteConstraintForm] = useState<RouteConstraintData>({
    name: "",
    type: "checkpoint",
    latitude: 0,
    longitude: 0,
    cost: 0,
    time_delay: 0,
    restrictions: [],
    notes: "",
  });

  // Fetch vehicles
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ['vehicles', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!projectId,
  });

  // Fetch warehouses
  const { data: warehouses, isLoading: warehousesLoading } = useQuery({
    queryKey: ['warehouses', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!projectId,
  });

  // Fetch route constraints
  const { data: routeConstraints, isLoading: routeConstraintsLoading } = useQuery({
    queryKey: ['routeConstraints', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('route_constraints')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!projectId,
  });

  // Vehicle mutations
  const addVehicleMutation = useMutation({
    mutationFn: async (vehicleData: Omit<VehicleData, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          ...vehicleData,
          project_id: projectId,
          user_id: user.id,
        })
        .select();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', projectId] });
      toast({ title: "Success", description: "Vehicle added successfully." });
      setVehicleForm({
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
      });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Warehouse mutations
  const addWarehouseMutation = useMutation({
    mutationFn: async (warehouseData: Omit<WarehouseData, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('warehouses')
        .insert({
          ...warehouseData,
          project_id: projectId,
          user_id: user.id,
        })
        .select();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses', projectId] });
      toast({ title: "Success", description: "Warehouse added successfully." });
      setWarehouseForm({
        name: "",
        latitude: 0,
        longitude: 0,
        address: "",
        ownership: "owned",
        size: 0,
        size_unit: "sqm",
        functions: [],
        automation_level: "manual",
        cold_chain: false,
        cold_chain_temperature: 0,
        monthly_cost: 0,
        handling_cost_per_unit: 0,
        labor_cost: 0,
      });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Route constraint mutations
  const addRouteConstraintMutation = useMutation({
    mutationFn: async (constraintData: Omit<RouteConstraintData, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('route_constraints')
        .insert({
          ...constraintData,
          project_id: projectId,
          user_id: user.id,
        })
        .select();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routeConstraints', projectId] });
      toast({ title: "Success", description: "Route constraint added successfully." });
      setRouteConstraintForm({
        name: "",
        type: "checkpoint",
        latitude: 0,
        longitude: 0,
        cost: 0,
        time_delay: 0,
        restrictions: [],
        notes: "",
      });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Delete mutations
  const deleteVehicleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', projectId] });
      toast({ title: "Success", description: "Vehicle deleted successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteWarehouseMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('warehouses')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses', projectId] });
      toast({ title: "Success", description: "Warehouse deleted successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteRouteConstraintMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('route_constraints')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routeConstraints', projectId] });
      toast({ title: "Success", description: "Route constraint deleted successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicleMutation.mutate(vehicleForm);
  };

  const handleWarehouseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWarehouseMutation.mutate(warehouseForm);
  };

  const handleRouteConstraintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRouteConstraintMutation.mutate(routeConstraintForm);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Comprehensive Supply Chain Data</h2>
      <Tabs defaultValue="vehicles">
        <TabsList className="mb-6">
          <TabsTrigger value="vehicles">Fleet Management</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="constraints">Route Constraints</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Vehicle Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Add Vehicle
                </CardTitle>
                <CardDescription>Configure your fleet vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVehicleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vehicle-name">Vehicle Name</Label>
                      <Input
                        id="vehicle-name"
                        value={vehicleForm.name}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicle-type">Type</Label>
                      <Select
                        value={vehicleForm.type}
                        onValueChange={(value) => setVehicleForm({ ...vehicleForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="truck">Truck</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="trailer">Trailer</SelectItem>
                          <SelectItem value="pickup">Pickup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ownership">Ownership</Label>
                      <Select
                        value={vehicleForm.ownership}
                        onValueChange={(value) => setVehicleForm({ ...vehicleForm, ownership: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owned">Owned</SelectItem>
                          <SelectItem value="outsourced">Outsourced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <div className="flex gap-2">
                        <Input
                          id="capacity"
                          type="number"
                          value={vehicleForm.capacity}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: parseFloat(e.target.value) || 0 })}
                        />
                        <Select
                          value={vehicleForm.capacity_unit}
                          onValueChange={(value) => setVehicleForm({ ...vehicleForm, capacity_unit: value })}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tons">Tons</SelectItem>
                            <SelectItem value="kg">Kg</SelectItem>
                            <SelectItem value="pallets">Pallets</SelectItem>
                            <SelectItem value="cbm">CBM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fuel-consumption">Fuel Consumption (L/100km)</Label>
                      <Input
                        id="fuel-consumption"
                        type="number"
                        value={vehicleForm.fuel_consumption}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, fuel_consumption: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maintenance-cost">Maintenance Cost/Month</Label>
                      <Input
                        id="maintenance-cost"
                        type="number"
                        value={vehicleForm.maintenance_cost}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, maintenance_cost: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={addVehicleMutation.isPending} className="w-full">
                    {addVehicleMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Vehicle
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Vehicles List */}
            <Card>
              <CardHeader>
                <CardTitle>Fleet Overview</CardTitle>
                <CardDescription>Manage your vehicle fleet</CardDescription>
              </CardHeader>
              <CardContent>
                {vehiclesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : vehicles?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No vehicles configured</p>
                ) : (
                  <div className="space-y-2">
                    {vehicles?.map((vehicle) => (
                      <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{vehicle.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.type} • {vehicle.capacity} {vehicle.capacity_unit} • {vehicle.ownership}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteVehicleMutation.mutate(vehicle.id)}
                          disabled={deleteVehicleMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Warehouse Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Add Warehouse
                </CardTitle>
                <CardDescription>Configure warehouse facilities</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWarehouseSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="warehouse-name">Warehouse Name</Label>
                    <Input
                      id="warehouse-name"
                      value={warehouseForm.name}
                      onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="warehouse-lat">Latitude</Label>
                      <Input
                        id="warehouse-lat"
                        type="number"
                        step="any"
                        value={warehouseForm.latitude}
                        onChange={(e) => setWarehouseForm({ ...warehouseForm, latitude: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="warehouse-lng">Longitude</Label>
                      <Input
                        id="warehouse-lng"
                        type="number"
                        step="any"
                        value={warehouseForm.longitude}
                        onChange={(e) => setWarehouseForm({ ...warehouseForm, longitude: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="warehouse-address">Address</Label>
                    <Textarea
                      id="warehouse-address"
                      value={warehouseForm.address}
                      onChange={(e) => setWarehouseForm({ ...warehouseForm, address: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="warehouse-ownership">Ownership</Label>
                      <Select
                        value={warehouseForm.ownership}
                        onValueChange={(value) => setWarehouseForm({ ...warehouseForm, ownership: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owned">Owned</SelectItem>
                          <SelectItem value="outsourced">Outsourced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="warehouse-size">Size</Label>
                      <div className="flex gap-2">
                        <Input
                          id="warehouse-size"
                          type="number"
                          value={warehouseForm.size}
                          onChange={(e) => setWarehouseForm({ ...warehouseForm, size: parseFloat(e.target.value) || 0 })}
                        />
                        <Select
                          value={warehouseForm.size_unit}
                          onValueChange={(value) => setWarehouseForm({ ...warehouseForm, size_unit: value })}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sqm">m²</SelectItem>
                            <SelectItem value="sqft">ft²</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cold-chain"
                      checked={warehouseForm.cold_chain}
                      onCheckedChange={(checked) => setWarehouseForm({ ...warehouseForm, cold_chain: checked as boolean })}
                    />
                    <Label htmlFor="cold-chain">Cold Chain Facility</Label>
                  </div>

                  <Button type="submit" disabled={addWarehouseMutation.isPending} className="w-full">
                    {addWarehouseMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Warehouse
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Warehouses List */}
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Network</CardTitle>
                <CardDescription>Manage your warehouse facilities</CardDescription>
              </CardHeader>
              <CardContent>
                {warehousesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : warehouses?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No warehouses configured</p>
                ) : (
                  <div className="space-y-2">
                    {warehouses?.map((warehouse) => (
                      <div key={warehouse.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{warehouse.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {warehouse.size} {warehouse.size_unit} • {warehouse.ownership}
                            {warehouse.cold_chain && <Badge className="ml-2" variant="secondary">Cold Chain</Badge>}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteWarehouseMutation.mutate(warehouse.id)}
                          disabled={deleteWarehouseMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="constraints" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Route Constraint Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Add Route Constraint
                </CardTitle>
                <CardDescription>Configure route restrictions and checkpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRouteConstraintSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="constraint-name">Constraint Name</Label>
                    <Input
                      id="constraint-name"
                      value={routeConstraintForm.name}
                      onChange={(e) => setRouteConstraintForm({ ...routeConstraintForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="constraint-type">Type</Label>
                    <Select
                      value={routeConstraintForm.type}
                      onValueChange={(value) => setRouteConstraintForm({ ...routeConstraintForm, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkpoint">Checkpoint</SelectItem>
                        <SelectItem value="toll">Toll Station</SelectItem>
                        <SelectItem value="weight-restriction">Weight Restriction</SelectItem>
                        <SelectItem value="time-window">Time Window</SelectItem>
                        <SelectItem value="environmental-zone">Environmental Zone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="constraint-lat">Latitude</Label>
                      <Input
                        id="constraint-lat"
                        type="number"
                        step="any"
                        value={routeConstraintForm.latitude}
                        onChange={(e) => setRouteConstraintForm({ ...routeConstraintForm, latitude: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="constraint-lng">Longitude</Label>
                      <Input
                        id="constraint-lng"
                        type="number"
                        step="any"
                        value={routeConstraintForm.longitude}
                        onChange={(e) => setRouteConstraintForm({ ...routeConstraintForm, longitude: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="constraint-cost">Additional Cost</Label>
                      <Input
                        id="constraint-cost"
                        type="number"
                        value={routeConstraintForm.cost}
                        onChange={(e) => setRouteConstraintForm({ ...routeConstraintForm, cost: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="constraint-delay">Time Delay (minutes)</Label>
                      <Input
                        id="constraint-delay"
                        type="number"
                        value={routeConstraintForm.time_delay}
                        onChange={(e) => setRouteConstraintForm({ ...routeConstraintForm, time_delay: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="constraint-notes">Notes</Label>
                    <Textarea
                      id="constraint-notes"
                      value={routeConstraintForm.notes}
                      onChange={(e) => setRouteConstraintForm({ ...routeConstraintForm, notes: e.target.value })}
                    />
                  </div>

                  <Button type="submit" disabled={addRouteConstraintMutation.isPending} className="w-full">
                    {addRouteConstraintMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Constraint
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Route Constraints List */}
            <Card>
              <CardHeader>
                <CardTitle>Route Constraints</CardTitle>
                <CardDescription>Manage route restrictions</CardDescription>
              </CardHeader>
              <CardContent>
                {routeConstraintsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : routeConstraints?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No constraints configured</p>
                ) : (
                  <div className="space-y-2">
                    {routeConstraints?.map((constraint) => (
                      <div key={constraint.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{constraint.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {constraint.type} • Cost: ${constraint.cost} • Delay: {constraint.time_delay}min
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteRouteConstraintMutation.mutate(constraint.id)}
                          disabled={deleteRouteConstraintMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="import-export" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Import Data
                </CardTitle>
                <CardDescription>Import data from CSV/Excel files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Data Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vehicles">Vehicles</SelectItem>
                      <SelectItem value="warehouses">Warehouses</SelectItem>
                      <SelectItem value="constraints">Route Constraints</SelectItem>
                      <SelectItem value="demand">Demand Points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>File Upload</Label>
                  <Input type="file" accept=".csv,.xlsx,.xls" />
                </div>
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Data
                </CardTitle>
                <CardDescription>Export data to various formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data Selection</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="export-vehicles" />
                      <Label htmlFor="export-vehicles">Vehicles</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="export-warehouses" />
                      <Label htmlFor="export-warehouses">Warehouses</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="export-constraints" />
                      <Label htmlFor="export-constraints">Route Constraints</Label>
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
