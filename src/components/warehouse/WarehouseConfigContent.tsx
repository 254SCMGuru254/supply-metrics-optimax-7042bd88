
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Warehouse, Building } from "lucide-react";
import { Node } from "@/components/map/MapTypes";
import { useState } from "react";

interface WarehouseConfigProps {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
}

export function WarehouseConfigContent({ nodes, setNodes }: WarehouseConfigProps) {
  const [warehouseName, setWarehouseName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });

  const addWarehouse = () => {
    if (!warehouseName || !capacity || !location.lat || !location.lng) {
      return;
    }

    const newWarehouse: Node = {
      id: crypto.randomUUID(),
      name: warehouseName,
      type: "warehouse",
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lng),
      capacity: parseInt(capacity),
      ownership: 'owned'
    };

    setNodes([...nodes, newWarehouse]);
    
    // Reset form
    setWarehouseName("");
    setCapacity("");
    setLocation({ lat: "", lng: "" });
  };

  const removeWarehouse = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            Add Warehouse
          </CardTitle>
          <CardDescription>
            Configure warehouse locations and capacities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="warehouse-name">Warehouse Name</Label>
              <Input
                id="warehouse-name"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                placeholder="Enter warehouse name"
              />
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Storage capacity"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={location.lat}
                onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                placeholder="e.g., -1.2921"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={location.lng}
                onChange={(e) => setLocation({ ...location, lng: e.target.value })}
                placeholder="e.g., 36.8219"
              />
            </div>
          </div>
          <Button onClick={addWarehouse} className="w-full">
            Add Warehouse
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Configured Warehouses
          </CardTitle>
          <CardDescription>
            Currently configured warehouse locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {nodes.filter(node => node.type === 'warehouse').length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No warehouses configured. Add your first warehouse above.
            </p>
          ) : (
            <div className="space-y-2">
              {nodes.filter(node => node.type === 'warehouse').map((warehouse) => (
                <div key={warehouse.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{warehouse.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Capacity: {warehouse.capacity} | Location: [{warehouse.latitude.toFixed(4)}, {warehouse.longitude.toFixed(4)}]
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeWarehouse(warehouse.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
