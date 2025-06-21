import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { fleetColumns } from './fleetColumns';
import { NetworkMap } from '@/components/NetworkMap';
import { Node, Route } from '@/components/map/MapTypes';
import { Truck, MapPin, Warehouse, User, Clock, Battery, Thermometer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockVehicles, mockFleetNodes, mockFleetRoutes } from '@/data/mock-fleet-data';

export const FleetManagementContent = () => {
  const [vehicles] = useState(mockVehicles);
  const [nodes] = useState<Node[]>(mockFleetNodes);
  const [routes] = useState<Route[]>(mockFleetRoutes);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(vehicles[0]?.id || null);

  const vehicleNodes: Node[] = useMemo(() => {
    return vehicles.map(v => ({
      id: `v-${v.id}`,
      name: v.name,
      type: 'customer', // Using a generic type, icon will be custom
      latitude: v.currentLocation.lat,
      longitude: v.currentLocation.lng,
      ownership: 'owned'
    }));
  }, [vehicles]);

  const mapNodes = useMemo(() => [...nodes, ...vehicleNodes], [nodes, vehicleNodes]);

  const selectedVehicle = useMemo(() => {
    return vehicles.find(v => v.id === selectedVehicleId);
  }, [selectedVehicleId, vehicles]);

  const selectedVehicleRoute = useMemo(() => {
    if (!selectedVehicle) return [];
    return routes.filter(r => r.vehicleId === selectedVehicle.id);
  }, [selectedVehicle, routes]);

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card className="h-[700px]">
          <NetworkMap 
            nodes={mapNodes}
            routes={selectedVehicleRoute}
            onNodeClick={(node) => {
              if (node.id.startsWith('v-')) {
                handleVehicleSelect(node.id.substring(2));
              }
            }}
            highlightNodes={selectedVehicleId ? [`v-${selectedVehicleId}`] : []}
          />
        </Card>
      </div>
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-y-auto">
            <ul className="divide-y">
              {vehicles.map(v => (
                <li 
                  key={v.id} 
                  className={`p-3 cursor-pointer ${selectedVehicleId === v.id ? 'bg-muted' : ''}`}
                  onClick={() => handleVehicleSelect(v.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className={`h-5 w-5 ${
                        v.status === 'on-route' ? 'text-green-500' :
                        v.status === 'idle' ? 'text-amber-500' : 'text-red-500'
                      }`} />
                      <span className="font-medium">{v.name}</span>
                    </div>
                    <Badge variant={
                      v.status === 'on-route' ? 'default' :
                      v.status === 'idle' ? 'secondary' : 'destructive'
                    }>{v.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        {selectedVehicle && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details: {selectedVehicle.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span><User className="inline-block mr-2 h-4 w-4"/>Driver</span> <span>{selectedVehicle.driver}</span></div>
                <div className="flex justify-between"><span><MapPin className="inline-block mr-2 h-4 w-4"/>Origin</span> <span>{nodes.find(n => n.id === selectedVehicle.originId)?.name}</span></div>
                <div className="flex justify-between"><span><Warehouse className="inline-block mr-2 h-4 w-4"/>Destination</span> <span>{nodes.find(n => n.id === selectedVehicle.destinationId)?.name}</span></div>
                <div className="flex justify-between"><span><Clock className="inline-block mr-2 h-4 w-4"/>ETA</span> <span>{selectedVehicle.eta}</span></div>
                <div className="flex justify-between"><span><Battery className="inline-block mr-2 h-4 w-4"/>Fuel</span> <span>{selectedVehicle.fuelLevel}%</span></div>
                <div className="flex justify-between"><span><Thermometer className="inline-block mr-2 h-4 w-4"/>Cargo Temp.</span> <span>{selectedVehicle.cargoTemp}°C</span></div>
              </div>
              <Button className="w-full">Dispatch New Route</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
