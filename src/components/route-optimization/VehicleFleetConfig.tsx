
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash, Truck } from "lucide-react";
import { Vehicle } from "./types";
import { useToast } from "@/components/ui/use-toast";

interface VehicleFleetConfigProps {
  vehicles: Vehicle[];
  onChange: (vehicles: Vehicle[]) => void;
}

export function VehicleFleetConfig({ vehicles, onChange }: VehicleFleetConfigProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    name: "",
    capacity: 1000,
    costPerKm: 2.5,
    fixedCost: 100,
    speed: 60,
    emissions: 200,
    maxDistance: 500,
    tonnageLimit: 10
  });
  const { toast } = useToast();

  const handleAddVehicle = () => {
    if (!newVehicle.name?.trim()) {
      toast({
        title: "Vehicle name required",
        description: "Please provide a name for the vehicle",
        variant: "destructive"
      });
      return;
    }

    const id = crypto.randomUUID();
    onChange([
      ...vehicles,
      {
        id,
        name: newVehicle.name,
        capacity: newVehicle.capacity || 1000,
        costPerKm: newVehicle.costPerKm || 2.5,
        fixedCost: newVehicle.fixedCost || 100,
        speed: newVehicle.speed || 60,
        emissions: newVehicle.emissions || 200,
        maxDistance: newVehicle.maxDistance || 500,
        tonnageLimit: newVehicle.tonnageLimit || 10
      }
    ]);

    setIsAdding(false);
    setNewVehicle({
      name: "",
      capacity: 1000,
      costPerKm: 2.5,
      fixedCost: 100,
      speed: 60,
      emissions: 200,
      maxDistance: 500,
      tonnageLimit: 10
    });

    toast({
      title: "Vehicle added",
      description: `${newVehicle.name} has been added to your fleet`
    });
  };

  const handleRemoveVehicle = (id: string) => {
    onChange(vehicles.filter(v => v.id !== id));
    toast({
      title: "Vehicle removed",
      description: "Vehicle has been removed from your fleet"
    });
  };

  const updateNewVehicleField = (field: keyof Vehicle, value: any) => {
    setNewVehicle(prev => ({
      ...prev,
      [field]: field === "name" ? value : Number(value)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Vehicle Fleet Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vehicles.length > 0 && (
            <div className="grid grid-cols-1 divide-y">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{vehicle.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Capacity: {vehicle.capacity}kg | Cost: ${vehicle.costPerKm}/km + ${vehicle.fixedCost} fixed
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveVehicle(vehicle.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {vehicles.length === 0 && !isAdding && (
            <div className="text-center py-8 text-muted-foreground">
              No vehicles in your fleet. Add a vehicle to get started.
            </div>
          )}

          {isAdding ? (
            <div className="space-y-4 border rounded-md p-4 bg-muted/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicle-name">Vehicle Name</Label>
                  <Input 
                    id="vehicle-name" 
                    value={newVehicle.name} 
                    onChange={e => updateNewVehicleField("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle-capacity">Capacity (kg)</Label>
                  <Input 
                    id="vehicle-capacity" 
                    type="number" 
                    value={newVehicle.capacity} 
                    onChange={e => updateNewVehicleField("capacity", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle-cost">Cost per km ($)</Label>
                  <Input 
                    id="vehicle-cost" 
                    type="number" 
                    step="0.01"
                    value={newVehicle.costPerKm} 
                    onChange={e => updateNewVehicleField("costPerKm", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle-fixed-cost">Fixed Cost ($)</Label>
                  <Input 
                    id="vehicle-fixed-cost" 
                    type="number" 
                    value={newVehicle.fixedCost} 
                    onChange={e => updateNewVehicleField("fixedCost", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle-speed">Average Speed (km/h)</Label>
                  <Input 
                    id="vehicle-speed" 
                    type="number" 
                    value={newVehicle.speed} 
                    onChange={e => updateNewVehicleField("speed", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle-emissions">Emissions (g CO2/km)</Label>
                  <Input 
                    id="vehicle-emissions" 
                    type="number" 
                    value={newVehicle.emissions} 
                    onChange={e => updateNewVehicleField("emissions", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle-max-distance">Max Distance (km)</Label>
                  <Input 
                    id="vehicle-max-distance" 
                    type="number" 
                    value={newVehicle.maxDistance} 
                    onChange={e => updateNewVehicleField("maxDistance", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle-tonnage">Tonnage Limit (tons)</Label>
                  <Input 
                    id="vehicle-tonnage" 
                    type="number" 
                    step="0.1"
                    value={newVehicle.tonnageLimit} 
                    onChange={e => updateNewVehicleField("tonnageLimit", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddVehicle}>
                  Save Vehicle
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
