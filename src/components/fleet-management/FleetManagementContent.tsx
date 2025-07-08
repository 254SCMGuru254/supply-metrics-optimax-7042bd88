
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  Clock,
  Settings,
  BarChart3
} from "lucide-react";

interface FleetManagementContentProps {
  projectId?: string;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: 'active' | 'maintenance' | 'inactive';
  location: string;
  fuelConsumption: number;
  lastMaintenance: string;
}

export const FleetManagementContent: React.FC<FleetManagementContentProps> = ({ projectId }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      name: 'Truck Alpha',
      type: 'Heavy Truck',
      capacity: 20,
      status: 'active',
      location: 'Nairobi Depot',
      fuelConsumption: 12.5,
      lastMaintenance: '2024-01-15'
    },
    {
      id: '2',
      name: 'Van Beta',
      type: 'Delivery Van',
      capacity: 5,
      status: 'maintenance',
      location: 'Mombasa Hub',
      fuelConsumption: 8.2,
      lastMaintenance: '2024-01-10'
    },
    {
      id: '3',
      name: 'Truck Gamma',
      type: 'Medium Truck',
      capacity: 15,
      status: 'active',
      location: 'Kisumu Center',
      fuelConsumption: 10.8,
      lastMaintenance: '2024-01-20'
    }
  ]);

  const [newVehicle, setNewVehicle] = useState({
    name: '',
    type: '',
    capacity: 0,
    location: '',
    fuelConsumption: 0
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addVehicle = () => {
    if (newVehicle.name && newVehicle.type) {
      const vehicle: Vehicle = {
        id: (vehicles.length + 1).toString(),
        ...newVehicle,
        status: 'active',
        lastMaintenance: new Date().toISOString().split('T')[0]
      };
      setVehicles([...vehicles, vehicle]);
      setNewVehicle({
        name: '',
        type: '',
        capacity: 0,
        location: '',
        fuelConsumption: 0
      });
    }
  };

  const deleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const updateVehicleStatus = (id: string, status: Vehicle['status']) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, status } : v));
  };

  return (
    <div className="space-y-6">
      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {vehicles.filter(v => v.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <Settings className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {vehicles.filter(v => v.status === 'maintenance').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {vehicles.reduce((sum, v) => sum + v.capacity, 0)} tons
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Vehicle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Vehicle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="name">Vehicle Name</Label>
              <Input
                id="name"
                value={newVehicle.name}
                onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
                placeholder="Enter vehicle name"
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={newVehicle.type}
                onChange={(e) => setNewVehicle({...newVehicle, type: e.target.value})}
                placeholder="e.g., Heavy Truck"
              />
            </div>
            <div>
              <Label htmlFor="capacity">Capacity (tons)</Label>
              <Input
                id="capacity"
                type="number"
                value={newVehicle.capacity}
                onChange={(e) => setNewVehicle({...newVehicle, capacity: parseFloat(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newVehicle.location}
                onChange={(e) => setNewVehicle({...newVehicle, location: e.target.value})}
                placeholder="Enter location"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addVehicle} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Management</CardTitle>
          <CardDescription>Manage your vehicle fleet and track performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{vehicle.name}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {vehicle.location}
                      </span>
                      <span className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last maintenance: {vehicle.lastMaintenance}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold">{vehicle.capacity} tons</div>
                    <div className="text-sm text-muted-foreground">
                      {vehicle.fuelConsumption} L/100km
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateVehicleStatus(
                        vehicle.id, 
                        vehicle.status === 'active' ? 'maintenance' : 'active'
                      )}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteVehicle(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
