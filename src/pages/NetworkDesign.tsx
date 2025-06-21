import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NetworkMap } from '@/components/NetworkMap';
import { Node, Route } from '@/components/map/MapTypes';
import { Plus, Trash, Play, Upload, Download, Building, ShoppingCart, TruckIcon } from 'lucide-react';
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

type FacilityType = 'factory' | 'warehouse' | 'retail';

interface Facility extends Node {
  type: FacilityType;
  cost: number; // monthly operational cost
  capacity: number; // units per month
}

interface Product {
    id: string;
    name: string;
    demand: number; // units per month per customer
}

export default function NetworkDesign() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [products, setProducts] = useState<Product[]>([{id: 'P1', name: 'Standard Widget', demand: 100}]);
  const { toast } = useToast();

  const handleAddFacility = () => {
    const newId = `F${facilities.length + 1}`;
    const newFacility: Facility = {
        id: newId,
        name: `New Facility ${facilities.length + 1}`,
        type: 'warehouse',
        latitude: -1.30 + (Math.random() - 0.5) * 0.2,
        longitude: 36.80 + (Math.random() - 0.5) * 0.2,
        cost: 10000,
        capacity: 5000,
        ownership: 'owned',
    };
    setFacilities([...facilities, newFacility]);
     toast({ title: "Facility Added", description: newFacility.name });
  };
  
  const handleUpdateFacility = (id: string, field: keyof Facility, value: any) => {
    setFacilities(facilities.map(f => f.id === id ? { ...f, [field]: value } : f));
  };
  
  const handleRemoveFacility = (id: string) => {
    setFacilities(facilities.filter(f => f.id !== id));
    setRoutes(routes.filter(r => r.from !== id && r.to !== id));
    toast({ title: "Facility Removed" });
  };

  const handleAddRoute = () => {
      if (facilities.length < 2) {
          toast({ title: "Cannot Add Route", description: "You need at least two facilities to create a route.", variant: "destructive" });
          return;
      }
      const newRoute: Route = {
          id: `R${routes.length + 1}`,
          from: facilities[0].id,
          to: facilities[1].id,
          ownership: 'owned'
      };
      setRoutes([...routes, newRoute]);
      toast({ title: "Route Added" });
  };

  const handleRemoveRoute = (id: string) => {
      setRoutes(routes.filter(r => r.id !== id));
      toast({ title: "Route Removed" });
  };

  const handleOptimize = () => {
    // Placeholder for optimization logic
    toast({
      title: "Optimization Running",
      description: "Connecting to the backend optimization engine...",
    });

    // Simulate a network analysis result
    const optimizedRoutes = routes.map(r => ({...r, color: '#10B981'}));
    const underutilizedFacilities = facilities.filter(f => f.capacity > 10000); // Example logic
    
    setRoutes(optimizedRoutes);
    
    toast({
      title: "Optimization Complete",
      description: `Identified ${underutilizedFacilities.length} underutilized facilities.`,
    });
  };

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
                                <Button onClick={handleAddFacility} size="sm" className="mb-4"><Plus className="mr-2 h-4 w-4"/>Add Facility</Button>
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
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveFacility(f.id)}>
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
                                <Button onClick={handleAddRoute} size="sm" className="mb-4"><Plus className="mr-2 h-4 w-4"/>Add Route</Button>
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
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveRoute(r.id)}>
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
                                {/* Product Management UI Here */}
                                <p className="text-muted-foreground">Product management interface to be built here.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </div>
  );
}
