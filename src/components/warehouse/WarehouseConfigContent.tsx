import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useToast } from "@/components/ui/use-toast";
import type { Node } from "@/components/map/MapTypes";

interface WarehouseConfigProps {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
}

// Leaflet icon configuration
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function LocationPicker({ onLocationSelect }: { onLocationSelect: (location: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export const WarehouseConfigContent = ({ nodes, setNodes }: WarehouseConfigProps) => {
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [warehouseName, setWarehouseName] = useState("");

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    setWarehouseName(`Warehouse ${nodes.length + 1}`);
  };

  const handleCreateWarehouse = () => {
    if (selectedLocation) {
      const newNode: Node = {
        id: crypto.randomUUID(),
        type: "warehouse",
        name: `Warehouse ${nodes.length + 1}`,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        capacity: 10000,
        ownership: 'owned'
      };
      
      setNodes([...nodes, newNode]);
      setSelectedLocation(null);
      
      toast({
        title: "Warehouse Created",
        description: `Created warehouse at [${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}]`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Configuration</CardTitle>
          <CardDescription>Add and configure warehouses in your supply chain network</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="warehouseName">Warehouse Name</Label>
              <Input
                type="text"
                id="warehouseName"
                placeholder="Enter warehouse name"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
              />
            </div>
            <div>
              <Label>Select Location</Label>
              {selectedLocation ? (
                <p className="text-sm text-muted-foreground">
                  Selected Location: [{selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}]
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Click on the map to select a location</p>
              )}
            </div>
          </div>
          
          <div className="h-[400px] border rounded-md overflow-hidden">
            <MapContainer
              center={[-1.2921, 36.8219]}
              zoom={6}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationPicker onLocationSelect={handleLocationSelect} />
              {selectedLocation && (
                <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
              )}
            </MapContainer>
          </div>
          
          <Button onClick={handleCreateWarehouse} disabled={!selectedLocation}>
            Create Warehouse
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
