import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NetworkMap } from '@/components/NetworkMap';
import { Node, Route } from '@/components/map/MapTypes';
import { Plus, Trash, Play, Upload, Download, Building, ShoppingCart, TruckIcon, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

type FacilityType = 'factory' | 'warehouse' | 'retail';

interface Facility extends Node {
  type: FacilityType;
  cost: number;
  capacity: number;
}

interface Product {
    id: string;
    name: string;
    demand: number;
}

export default function NetworkDesign() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: facilities = [], isLoading: isLoadingFacilities, error: facilitiesError } = useQuery<Facility[]>({
    queryKey: ['facilities', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supply_nodes')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data.map(d => ({...d, cost: d.cost || 0, capacity: d.capacity || 0})) as Facility[];
    },
    enabled: !!projectId,
  });

  const { data: routes = [], isLoading: isLoadingRoutes, error: routesError } = useQuery<Route[]>({
    queryKey: ['routes', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw new Error(error.message);
      return data as Route[];
    },
    enabled: !!projectId,
  });

  const addFacilityMutation = useMutation(
    async (newFacility: Omit<Facility, 'id' | 'ownership'>) => {
      const { data, error } = await supabase.from('supply_nodes').insert([{ ...newFacility, project_id: projectId, user_id: user?.id }]).select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['facilities', projectId]);
        toast({ title: "Facility Added" });
      },
      onError: (error: Error) => {
        toast({ title: "Error", description: error.message, variant: 'destructive' });
      }
    }
  );

  const removeFacilityMutation = useMutation(
    async (id: string) => {
      const { error } = await supabase.from('supply_nodes').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['facilities', projectId]);
        queryClient.invalidateQueries(['routes', projectId]);
        toast({ title: "Facility Removed" });
      },
      onError: (error: Error) => {
        toast({ title: "Error", description: error.message, variant: 'destructive' });
      }
    }
  );
  
  const addRouteMutation = useMutation(
    async (newRoute: Omit<Route, 'id' | 'ownership'>) => {
      const { data, error } = await supabase.from('routes').insert([{ ...newRoute, project_id: projectId, user_id: user?.id }]).select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['routes', projectId]);
        toast({ title: "Route Added" });
      },
      onError: (error: Error) => {
        toast({ title: "Error", description: error.message, variant: 'destructive' });
      }
    }
  );

  const removeRouteMutation = useMutation(
    async (id: string) => {
      const { error } = await supabase.from('routes').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['routes', projectId]);
        toast({ title: "Route Removed" });
      },
      onError: (error: Error) => {
        toast({ title: "Error", description: error.message, variant: 'destructive' });
      }
    }
  );


  const [products, setProducts] = useState<Product[]>([{id: 'P1', name: 'Standard Widget', demand: 100}]);

  const handleAddFacility = () => {
    const newFacility = {
        name: `New Facility ${facilities.length + 1}`,
        type: 'warehouse' as FacilityType,
        latitude: -1.30 + (Math.random() - 0.5) * 0.2,
        longitude: 36.80 + (Math.random() - 0.5) * 0.2,
        cost: 10000,
        capacity: 5000,
    };
    addFacilityMutation.mutate(newFacility);
  };
  
  const handleRemoveFacility = (id: string) => {
    removeFacilityMutation.mutate(id);
  };

  const handleAddRoute = () => {
      if (facilities.length < 2) {
          toast({ title: "Cannot Add Route", description: "You need at least two facilities to create a route.", variant: "destructive" });
          return;
      }
      const newRoute = {
          from: facilities[0].id,
          to: facilities[1].id,
      };
      addRouteMutation.mutate(newRoute);
  };

  const handleRemoveRoute = (id: string) => {
      removeRouteMutation.mutate(id);
  };

  const handleOptimize = () => {
    toast({
      title: "Optimization Running",
      description: "This feature is not yet connected to the backend.",
    });
  };

  if (isLoadingFacilities || isLoadingRoutes) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (facilitiesError || routesError) {
      return <div className="flex justify-center items-center h-screen text-red-500">
          Error loading data: {(facilitiesError as Error)?.message || (routesError as Error)?.message}
      </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
          Supply Chain Network Design
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Visually build, analyze, and optimize your end-to-end supply chain network.
        </p>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[75vh]">
            <div className="lg:col-span-3 h-full">
                <Card className="h-full">
                    <NetworkMap nodes={facilities} routes={routes} />
                </Card>
            </div>
            <div className="lg:col-span-2 h-full flex flex-col gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                         <Button onClick={handleOptimize}><Play className="mr-2 h-4 w-4"/> Analyze Network</Button>
                         <Button variant="outline"><Download className="mr-2 h-4 w-4"/> Export</Button>
                         <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> Import</Button>
                    </CardContent>
                </Card>
                <Tabs defaultValue="facilities" className="flex-grow flex flex-col">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="facilities"><Building className="mr-2 h-4 w-4"/>Facilities</TabsTrigger>
                        <TabsTrigger value="routes"><TruckIcon className="mr-2 h-4 w-4"/>Routes</TabsTrigger>
                        <TabsTrigger value="products"><ShoppingCart className="mr-2 h-4 w-4"/>Products</TabsTrigger>
                    </TabsList>
                    <TabsContent value="facilities" className="flex-grow overflow-y-auto">
                        <Card className="h-full">
                            <CardContent className="p-4">
                                <Button onClick={handleAddFacility} size="sm" className="mb-4" disabled={addFacilityMutation.isLoading}><Plus className="mr-2 h-4 w-4"/>Add Facility</Button>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Capacity</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {facilities.map(f => (
                                            <TableRow key={f.id}>
                                                <TableCell>{f.name}</TableCell>
                                                <TableCell>{f.type}</TableCell>
                                                <TableCell>{f.capacity}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveFacility(f.id)} disabled={removeFacilityMutation.isLoading}>
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="routes" className="flex-grow overflow-y-auto">
                         <Card className="h-full">
                            <CardContent className="p-4">
                                <Button onClick={handleAddRoute} size="sm" className="mb-4" disabled={addRouteMutation.isLoading}><Plus className="mr-2 h-4 w-4"/>Add Route</Button>
                                 <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>From</TableHead>
                                            <TableHead>To</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {routes.map(r => (
                                            <TableRow key={r.id}>
                                                <TableCell>{facilities.find(f=>f.id === r.from)?.name}</TableCell>
                                                <TableCell>{facilities.find(f=>f.id === r.to)?.name}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveRoute(r.id)} disabled={removeRouteMutation.isLoading}>
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="products" className="flex-grow overflow-y-auto">
                         <Card className="h-full">
                            <CardContent className="p-4">
                                <p className="text-muted-foreground">Product management is not yet implemented.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </div>
  );
}
