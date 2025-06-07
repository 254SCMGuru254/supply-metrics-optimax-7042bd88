
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

export interface Vehicle {
  id: string;
  name: string;
  type: "truck" | "van" | "car";
  capacity: number;
  costPerKm: number;
  fuelEfficiency: number;
}

export interface VehicleFleetConfigProps {
  vehicles: Vehicle[];
  onChange: (vehicles: Vehicle[]) => void;
}

export const VehicleFleetConfig = ({ vehicles, onChange }: VehicleFleetConfigProps) => {
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: crypto.randomUUID(),
      name: `Vehicle ${vehicles.length + 1}`,
      type: "truck",
      capacity: 1000,
      costPerKm: 2.5,
      fuelEfficiency: 8.0
    };
    onChange([...vehicles, newVehicle]);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    const updated = vehicles.map(v => v.id === id ? { ...v, ...updates } : v);
    onChange(updated);
  };

  const removeVehicle = (id: string) => {
    onChange(vehicles.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vehicle Fleet Configuration</h3>
        <Button onClick={addVehicle} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                {vehicle.name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVehicle(vehicle.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor={`name-${vehicle.id}`}>Name</Label>
                <Input
                  id={`name-${vehicle.id}`}
                  value={vehicle.name}
                  onChange={(e) => updateVehicle(vehicle.id, { name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor={`type-${vehicle.id}`}>Type</Label>
                <Select
                  value={vehicle.type}
                  onValueChange={(value: "truck" | "van" | "car") => 
                    updateVehicle(vehicle.id, { type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`capacity-${vehicle.id}`}>Capacity (kg)</Label>
                <Input
                  id={`capacity-${vehicle.id}`}
                  type="number"
                  value={vehicle.capacity}
                  onChange={(e) => updateVehicle(vehicle.id, { capacity: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor={`cost-${vehicle.id}`}>Cost per km</Label>
                <Input
                  id={`cost-${vehicle.id}`}
                  type="number"
                  step="0.1"
                  value={vehicle.costPerKm}
                  onChange={(e) => updateVehicle(vehicle.id, { costPerKm: Number(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vehicles.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No vehicles configured</p>
            <Button onClick={addVehicle}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Vehicle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
