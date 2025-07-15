import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Node, Route, Facility, FacilityType, OwnershipType } from '@/integrations/supabase/types';
import { 
  Network, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Building,
  Calculator,
  BarChart3,
  Settings
} from 'lucide-react';

const NetworkDesign = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  const [newFacility, setNewFacility] = useState({
    name: '',
    latitude: '',
    longitude: '',
    capacity: '',
    fixed_cost: '',
    variable_cost: '',
    facility_type: 'warehouse' as FacilityType,
    ownership: 'owned' as OwnershipType,
  });

  useEffect(() => {
    if (!projectId) {
      navigate('/dashboard');
      return;
    }

    const fetchNetworkData = async () => {
      try {
        const { data: nodesData, error: nodesError } = await supabase
          .from('nodes')
          .select('*')
          .eq('project_id', projectId);

        if (nodesError) {
          console.error("Error fetching nodes:", nodesError);
        } else {
          setNodes(nodesData || []);
        }

        const { data: routesData, error: routesError } = await supabase
          .from('routes')
          .select('*')
          .eq('project_id', projectId);

        if (routesError) {
          console.error("Error fetching routes:", routesError);
        } else {
          setRoutes(routesData || []);
        }

        const { data: facilitiesData, error: facilitiesError } = await supabase
          .from('facilities')
          .select('*')
          .eq('project_id', projectId);

        if (facilitiesError) {
          console.error("Error fetching facilities:", facilitiesError);
        } else {
          setFacilities(facilitiesData || []);
        }
      } catch (error) {
        console.error("Unexpected error fetching network data:", error);
      }
    };

    fetchNetworkData();
  }, [projectId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewFacility(prev => ({ ...prev, [name]: value }));
  };

  const addFacility = async () => {
    const { latitude, longitude, capacity, fixed_cost, variable_cost } = newFacility;

    if (!latitude || !longitude || !capacity || !fixed_cost || !variable_cost) {
      alert("Please fill in all facility details.");
      return;
    }

    const newFacilityData = {
      ...newFacility,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      capacity: parseFloat(capacity),
      fixed_cost: parseFloat(fixed_cost),
      variable_cost: parseFloat(variable_cost),
      project_id: projectId,
      user_id: supabase.auth.user()?.id,
    };

    try {
      const { data, error } = await supabase
        .from('facilities')
        .insert([newFacilityData])
        .select('*');

      if (error) {
        console.error("Error adding facility:", error);
        alert("Failed to add facility. Please check the console for details.");
      } else if (data && data.length > 0) {
        setFacilities([...facilities, data[0]]);
        setNewFacility({
          name: '',
          latitude: '',
          longitude: '',
          capacity: '',
          fixed_cost: '',
          variable_cost: '',
          facility_type: 'warehouse',
          ownership: 'owned',
        });
        alert("Facility added successfully!");
      }
    } catch (error) {
      console.error("Unexpected error adding facility:", error);
      alert("An unexpected error occurred. Please check the console for details.");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2 text-foreground">
          <Building className="h-10 w-10" />
          Network Design & Optimization
        </h1>
        <p className="text-muted-foreground">
          Design and optimize your supply chain network for maximum efficiency and resilience
        </p>
      </div>

      <Tabs defaultValue="design" className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Network Design
          </TabsTrigger>
          <TabsTrigger value="facilities" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Facility Management
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Cost Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="design">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Network Topology</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Visualize and configure your network's structure.</p>
              {/* Add network visualization component here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Add New Facility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Facility Name</Label>
                    <Input type="text" id="name" name="name" value={newFacility.name} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input type="number" id="latitude" name="latitude" value={newFacility.latitude} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input type="number" id="longitude" name="longitude" value={newFacility.longitude} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input type="number" id="capacity" name="capacity" value={newFacility.capacity} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="fixed_cost">Fixed Cost</Label>
                    <Input type="number" id="fixed_cost" name="fixed_cost" value={newFacility.fixed_cost} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="variable_cost">Variable Cost</Label>
                    <Input type="number" id="variable_cost" name="variable_cost" value={newFacility.variable_cost} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="facility_type">Facility Type</Label>
                    <select id="facility_type" name="facility_type" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={newFacility.facility_type} onChange={handleInputChange}>
                      <option value="warehouse">Warehouse</option>
                      <option value="distribution_center">Distribution Center</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail</option>
                      <option value="supplier">Supplier</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="ownership">Ownership</Label>
                    <select id="ownership" name="ownership" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={newFacility.ownership} onChange={handleInputChange}>
                      <option value="owned">Owned</option>
                      <option value="leased">Leased</option>
                      <option value="third_party">Third Party</option>
                    </select>
                  </div>
                </div>
                <Button onClick={addFacility}>Add Facility</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Existing Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {facilities.map(facility => (
                    <li key={facility.id} className="flex items-center justify-between">
                      {facility.name}
                      <Badge variant="secondary">{facility.facility_type}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analyze the costs associated with your network design.</p>
              {/* Add cost analysis component here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetworkDesign;
