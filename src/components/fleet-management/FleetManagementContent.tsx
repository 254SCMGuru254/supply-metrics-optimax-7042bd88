import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { NetworkMap } from '@/components/NetworkMap';
import { Node, Route } from '@/components/map/MapTypes';
import { Truck, MapPin, Warehouse, User, Clock, Battery, Thermometer, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Tables } from '@/types/database';

type Vehicle = Tables<'supply_nodes'> & {
    currentLocation: { lat: number; lng: number };
    driver: string;
    eta: string;
    fuelLevel: number;
    cargoTemp: number;
    originId: string;
    destinationId: string;
    status: 'on-route' | 'idle' | 'down';
};

export const FleetManagementContent = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const { data: nodesData, error: nodesError } = await supabase
                .from('supply_nodes')
                .select('*')
                .eq('user_id', user.id);

            const { data: routesData, error: routesError } = await supabase
                .from('supply_routes')
                .select('*')
                .eq('user_id', user.id);

            if (nodesError) throw nodesError;
            if (routesError) throw routesError;

            const fetchedVehicles: Vehicle[] = nodesData
                ?.filter(n => n.node_type === 'vehicle' && n.latitude && n.longitude)
                .map((n): Vehicle => ({
                    ...(n as Tables<'supply_nodes'>),
                    id: n.id,
                    name: n.name,
                    status: (n.properties as any)?.status || 'idle',
                    currentLocation: { lat: n.latitude!, lng: n.longitude! },
                    driver: (n.properties as any)?.driver || 'N/A',
                    eta: (n.properties as any)?.eta || 'N/A',
                    fuelLevel: (n.properties as any)?.fuelLevel || 0,
                    cargoTemp: (n.properties as any)?.cargoTemp || 0,
                    originId: (n.properties as any)?.originId || '',
                    destinationId: (n.properties as any)?.destinationId || '',
                })) || [];

            const regularNodes: Node[] = nodesData
                ?.filter(n => n.node_type !== 'vehicle' && n.latitude && n.longitude)
                .map(n => ({
                    id: n.id,
                    name: n.name,
                    type: n.node_type || 'warehouse',
                    latitude: n.latitude!,
                    longitude: n.longitude!,
                    ownership: (n.properties as any)?.ownership || 'owned'
                })) || [];

            const fetchedRoutes: Route[] = routesData?.map(r => ({
                id: r.id,
                origin: r.origin_id || '',
                destination: r.destination_id || '',
                transportMode: r.transport_mode || 'truck',
                vehicleId: (r.properties as any)?.vehicle_id,
            })) || [];
            
            setVehicles(fetchedVehicles);
            setNodes(regularNodes);
            setRoutes(fetchedRoutes);

        } catch (error) {
            console.error("Error fetching fleet data:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [user]);
  
  useEffect(() => {
    if (!selectedVehicleId && vehicles.length > 0) {
        setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

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
    return routes.filter(r => (r as any).vehicleId === selectedVehicle.id);
  }, [selectedVehicle, routes]);

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg">Loading Fleet Data...</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>No vehicles found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Add vehicle data to get started with fleet management.</p>
          <Link to="/data-input">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Data
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

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
