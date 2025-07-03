
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Warehouse, Building, Loader2, MapPin, Thermometer } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WarehouseConfigProps {
  projectId: string;
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

const warehouseFunctions = [
  "Storage",
  "Cross-docking",
  "Order fulfillment",
  "Packaging",
  "Quality control",
  "Returns processing",
  "Value-added services"
];

export function WarehouseConfigContent({ projectId }: WarehouseConfigProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
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

  const { data: warehouses, isLoading } = useQuery({
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

  const addWarehouseMutation = useMutation({
    mutationFn: async (warehouseData: Omit<WarehouseData, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.from('warehouses').insert({
        ...warehouseData,
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
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteWarehouseMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('warehouses').delete().eq('id', id);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWarehouseMutation.mutate(warehouseForm);
  };

  const handleFunctionToggle = (func: string) => {
    setWarehouseForm(prev => ({
      ...prev,
      functions: prev.functions.includes(func)
        ? prev.functions.filter(f => f !== func)
        : [...prev.functions, func]
    }));
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
            Add Warehouse Configuration
          </CardTitle>
          <CardDescription>
            Configure warehouse facilities with detailed specifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="warehouse-name">Warehouse Name</Label>
                <Input
                  id="warehouse-name"
                  value={warehouseForm.name}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                  placeholder="Enter warehouse name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="ownership">Ownership Type</Label>
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
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={warehouseForm.latitude}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, latitude: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g., -1.2921"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={warehouseForm.longitude}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, longitude: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g., 36.8219"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  value={warehouseForm.address}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, address: e.target.value })}
                  placeholder="Enter complete address"
                />
              </div>
            </div>

            {/* Physical Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Physical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size">Size</Label>
                  <div className="flex gap-2">
                    <Input
                      id="size"
                      type="number"
                      value={warehouseForm.size}
                      onChange={(e) => setWarehouseForm({ ...warehouseForm, size: parseFloat(e.target.value) || 0 })}
                      placeholder="Storage area"
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
                <div>
                  <Label htmlFor="automation">Automation Level</Label>
                  <Select
                    value={warehouseForm.automation_level}
                    onValueChange={(value) => setWarehouseForm({ ...warehouseForm, automation_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="semi-automated">Semi-Automated</SelectItem>
                      <SelectItem value="automated">Fully Automated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Functions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Warehouse Functions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {warehouseFunctions.map((func) => (
                  <div key={func} className="flex items-center space-x-2">
                    <Checkbox
                      id={`function-${func}`}
                      checked={warehouseForm.functions.includes(func)}
                      onCheckedChange={() => handleFunctionToggle(func)}
                    />
                    <Label htmlFor={`function-${func}`} className="text-sm">
                      {func}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Cold Chain */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Cold Chain Configuration
              </h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cold-chain"
                  checked={warehouseForm.cold_chain}
                  onCheckedChange={(checked) => setWarehouseForm({ ...warehouseForm, cold_chain: checked as boolean })}
                />
                <Label htmlFor="cold-chain">Cold Chain Facility</Label>
              </div>
              {warehouseForm.cold_chain && (
                <div>
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={warehouseForm.cold_chain_temperature}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, cold_chain_temperature: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g., -18 for frozen, 2-8 for chilled"
                  />
                </div>
              )}
            </div>

            {/* Cost Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cost Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="monthly-cost">Monthly Cost ($)</Label>
                  <Input
                    id="monthly-cost"
                    type="number"
                    value={warehouseForm.monthly_cost}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, monthly_cost: parseFloat(e.target.value) || 0 })}
                    placeholder="Monthly operational cost"
                  />
                </div>
                <div>
                  <Label htmlFor="handling-cost">Handling Cost per Unit ($)</Label>
                  <Input
                    id="handling-cost"
                    type="number"
                    step="0.01"
                    value={warehouseForm.handling_cost_per_unit}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, handling_cost_per_unit: parseFloat(e.target.value) || 0 })}
                    placeholder="Cost per unit handled"
                  />
                </div>
                <div>
                  <Label htmlFor="labor-cost">Labor Cost ($)</Label>
                  <Input
                    id="labor-cost"
                    type="number"
                    value={warehouseForm.labor_cost}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, labor_cost: parseFloat(e.target.value) || 0 })}
                    placeholder="Monthly labor cost"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={addWarehouseMutation.isPending}>
              {addWarehouseMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Warehouse Configuration
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Configured Warehouses
          </CardTitle>
          <CardDescription>
            Currently configured warehouse facilities
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
            <div className="space-y-4">
              {warehouses?.map((warehouse) => (
                <div key={warehouse.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{warehouse.name}</h4>
                      <p className="text-sm text-muted-foreground">{warehouse.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={warehouse.ownership === 'owned' ? 'default' : 'secondary'}>
                        {warehouse.ownership}
                      </Badge>
                      {warehouse.cold_chain && (
                        <Badge variant="outline" className="text-blue-600">
                          <Thermometer className="h-3 w-3 mr-1" />
                          Cold Chain
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Size:</span> {warehouse.size} {warehouse.size_unit}
                    </div>
                    <div>
                      <span className="font-medium">Automation:</span> {warehouse.automation_level}
                    </div>
                    <div>
                      <span className="font-medium">Monthly Cost:</span> ${warehouse.monthly_cost}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> [{warehouse.latitude.toFixed(4)}, {warehouse.longitude.toFixed(4)}]
                    </div>
                  </div>

                  {warehouse.functions && warehouse.functions.length > 0 && (
                    <div>
                      <span className="font-medium text-sm">Functions: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {warehouse.functions.map((func) => (
                          <Badge key={func} variant="outline" className="text-xs">
                            {func}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeWarehouse(warehouse.id)}
                      disabled={deleteWarehouseMutation.isPending}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
