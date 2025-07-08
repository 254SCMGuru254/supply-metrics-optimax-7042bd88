
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import NetworkMap from "@/components/NetworkMap";
import { 
  Truck, 
  Settings, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Clock, 
  Activity,
  TrendingUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface Vehicle {
  id: string;
  name: string;
  type: string;
  ownership: string;
  capacity: number;
  capacity_unit: string;
  fuel_consumption: number;
  maintenance_cost: number;
  driver_cost_per_day: number;
}

interface FleetRoute {
  id: string;
  origin: string;
  destination: string;
  transportMode: string;
  vehicleId: string;
}

interface FleetManagementContentProps {
  projectId: string;
}

export const FleetManagementContent = ({ projectId }: FleetManagementContentProps) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<FleetRoute[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFleetData();
  }, [projectId, user]);

  const fetchFleetData = async () => {
    if (!user || !projectId) return;

    setLoading(true);
    try {
      const { data: vehiclesData } = await supabase
        .from('vehicles')
        .select('*')
        .eq('project_id', projectId);

      if (vehiclesData) {
        setVehicles(vehiclesData);
      }

      // Mock routes data for demonstration
      setRoutes([
        { id: '1', origin: 'Warehouse A', destination: 'Customer 1', transportMode: 'Road', vehicleId: 'v1' },
        { id: '2', origin: 'Warehouse B', destination: 'Customer 2', transportMode: 'Road', vehicleId: 'v2' },
      ]);

    } catch (error) {
      console.error('Error fetching fleet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const vehicleColumns = [
    {
      key: 'name' as keyof Vehicle,
      header: 'Vehicle Name',
    },
    {
      key: 'type' as keyof Vehicle,
      header: 'Type',
    },
    {
      key: 'ownership' as keyof Vehicle,
      header: 'Ownership',
      render: (value: string) => (
        <Badge variant={value === 'owned' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'capacity' as keyof Vehicle,
      header: 'Capacity',
      render: (value: number, item: Vehicle) => (
        `${value} ${item.capacity_unit}`
      ),
    },
    {
      key: 'fuel_consumption' as keyof Vehicle,
      header: 'Fuel Consumption',
      render: (value: number) => `${value} L/100km`,
    },
  ];

  const fleetMetrics = [
    {
      title: "Total Vehicles",
      value: vehicles.length,
      icon: <Truck className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      title: "Fleet Utilization",
      value: "87%",
      icon: <Activity className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      title: "Avg Fuel Cost",
      value: "$2,450",
      icon: <Settings className="h-5 w-5" />,
      color: "text-orange-600",
    },
    {
      title: "Cost Savings",
      value: "23%",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fleet Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fleetMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fleet Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Fleet Location Map
          </CardTitle>
          <CardDescription>
            Real-time fleet tracking and route visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <NetworkMap 
              nodes={[]}
              routes={[]}
              onNodesChange={() => {}}
              onRoutesChange={() => {}}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Vehicle Fleet
          </CardTitle>
          <CardDescription>
            Manage your vehicle fleet and track performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vehicles.length > 0 ? (
            <DataTable
              data={vehicles}
              columns={vehicleColumns}
            />
          ) : (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No vehicles found. Add vehicles to get started.</p>
              <Button className="mt-4">Add Vehicle</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Route Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Route Performance
          </CardTitle>
          <CardDescription>
            Monitor route efficiency and delivery performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routes.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{route.origin}</span>
                    <span className="text-gray-500">→</span>
                    <span className="font-medium">{route.destination}</span>
                  </div>
                  <Badge variant="outline">{route.transportMode}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Vehicle ID</p>
                  <p className="font-medium">{route.vehicleId}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
