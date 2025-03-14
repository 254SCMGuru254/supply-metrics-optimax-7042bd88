
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Factory, Truck, Warehouse, AlertCircle, Download, Upload, PlusCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export const MILPDataContent = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("facilities");
  const [facilities, setFacilities] = useState<{id: string, name: string, type: string, capacity: number, fixedCost: number, variableCost: number}[]>([
    { id: "f1", name: "Nairobi Warehouse", type: "warehouse", capacity: 1000, fixedCost: 500000, variableCost: 250 },
    { id: "f2", name: "Mombasa Port", type: "port", capacity: 2000, fixedCost: 750000, variableCost: 300 },
  ]);
  const [customers, setCustomers] = useState<{id: string, name: string, demand: number, priority: number, location: string}[]>([
    { id: "c1", name: "Nakuru Retail", demand: 200, priority: 1, location: "Nakuru" },
    { id: "c2", name: "Kisumu Distribution", demand: 350, priority: 2, location: "Kisumu" },
  ]);
  const [transportRoutes, setTransportRoutes] = useState<{id: string, from: string, to: string, cost: number, capacity: number, time: number}[]>([
    { id: "r1", from: "f1", to: "c1", cost: 15000, capacity: 500, time: 3 },
    { id: "r2", from: "f1", to: "c2", cost: 25000, capacity: 500, time: 6 },
    { id: "r3", from: "f2", to: "c1", cost: 40000, capacity: 800, time: 8 },
  ]);
  const [constraints, setConstraints] = useState({
    maxBudget: 1000000,
    maxLeadTime: 10,
    serviceLevelTarget: 95,
    sustainabilityFactor: 0.7,
    enforceCapacity: true,
    allowPartialFulfillment: true,
  });
  
  const [newFacility, setNewFacility] = useState({
    name: "",
    type: "warehouse",
    capacity: 1000,
    fixedCost: 500000,
    variableCost: 250,
  });
  
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    demand: 100,
    priority: 1,
    location: "",
  });
  
  const [newRoute, setNewRoute] = useState({
    from: "",
    to: "",
    cost: 10000,
    capacity: 500,
    time: 4,
  });

  const addFacility = () => {
    if (!newFacility.name) {
      toast({
        title: "Error",
        description: "Facility name is required",
        variant: "destructive",
      });
      return;
    }
    
    const facility = {
      id: `f${facilities.length + 1}`,
      ...newFacility,
    };
    
    setFacilities([...facilities, facility]);
    setNewFacility({
      name: "",
      type: "warehouse",
      capacity: 1000,
      fixedCost: 500000,
      variableCost: 250,
    });
    
    toast({
      title: "Facility added",
      description: `${facility.name} has been added successfully`,
    });
  };
  
  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.location) {
      toast({
        title: "Error",
        description: "Customer name and location are required",
        variant: "destructive",
      });
      return;
    }
    
    const customer = {
      id: `c${customers.length + 1}`,
      ...newCustomer,
    };
    
    setCustomers([...customers, customer]);
    setNewCustomer({
      name: "",
      demand: 100,
      priority: 1,
      location: "",
    });
    
    toast({
      title: "Customer added",
      description: `${customer.name} has been added successfully`,
    });
  };
  
  const addRoute = () => {
    if (!newRoute.from || !newRoute.to) {
      toast({
        title: "Error",
        description: "Origin and destination are required",
        variant: "destructive",
      });
      return;
    }
    
    const route = {
      id: `r${transportRoutes.length + 1}`,
      ...newRoute,
    };
    
    setTransportRoutes([...transportRoutes, route]);
    setNewRoute({
      from: "",
      to: "",
      cost: 10000,
      capacity: 500,
      time: 4,
    });
    
    toast({
      title: "Route added",
      description: "Transport route has been added successfully",
    });
  };
  
  const deleteFacility = (id: string) => {
    setFacilities(facilities.filter(f => f.id !== id));
    toast({
      title: "Facility deleted",
      description: "The facility has been removed",
    });
  };
  
  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    toast({
      title: "Customer deleted",
      description: "The customer has been removed",
    });
  };
  
  const deleteRoute = (id: string) => {
    setTransportRoutes(transportRoutes.filter(r => r.id !== id));
    toast({
      title: "Route deleted",
      description: "The transport route has been removed",
    });
  };
  
  const runOptimization = () => {
    toast({
      title: "Optimization started",
      description: "The MILP optimization model is now running...",
    });
    
    // In a real app, this would call the backend with the data
    setTimeout(() => {
      toast({
        title: "Optimization complete",
        description: "The model has completed. View results in the Analytics dashboard.",
      });
    }, 3000);
  };
  
  const exportData = () => {
    const data = {
      facilities,
      customers,
      transportRoutes,
      constraints,
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = href;
    link.download = "milp_optimization_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Data exported",
      description: "Your MILP data has been exported successfully",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            MILP Optimization Model Configuration
          </CardTitle>
          <CardDescription>
            Configure your Mixed-Integer Linear Programming model for multi-echelon supply chain optimization.
            This model is ideal for complex network design with multiple constraints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="facilities">
                <Factory className="h-4 w-4 mr-2" />
                Facilities
              </TabsTrigger>
              <TabsTrigger value="customers">
                <Warehouse className="h-4 w-4 mr-2" />
                Customers
              </TabsTrigger>
              <TabsTrigger value="transport">
                <Truck className="h-4 w-4 mr-2" />
                Transport
              </TabsTrigger>
              <TabsTrigger value="constraints">
                <AlertCircle className="h-4 w-4 mr-2" />
                Constraints
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="facilities" className="pt-6">
              <div className="space-y-6">
                <Alert variant="outline" className="bg-primary/5 border-primary/50">
                  <AlertTitle>About Facilities</AlertTitle>
                  <AlertDescription>
                    Define potential facility locations, capacity, and costs. These can be warehouses, 
                    distribution centers, or manufacturing plants.
                  </AlertDescription>
                </Alert>
                
                <Table>
                  <TableCaption>List of facilities for optimization</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Fixed Cost (KES)</TableHead>
                      <TableHead>Variable Cost (KES)</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facilities.map((facility) => (
                      <TableRow key={facility.id}>
                        <TableCell>{facility.name}</TableCell>
                        <TableCell>{facility.type}</TableCell>
                        <TableCell>{facility.capacity}</TableCell>
                        <TableCell>{facility.fixedCost.toLocaleString()}</TableCell>
                        <TableCell>{facility.variableCost.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => deleteFacility(facility.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Add New Facility</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facilityName">Facility Name *</Label>
                      <Input 
                        id="facilityName" 
                        value={newFacility.name}
                        onChange={(e) => setNewFacility({...newFacility, name: e.target.value})}
                        placeholder="e.g., Nairobi Warehouse"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facilityType">Facility Type</Label>
                      <Select 
                        value={newFacility.type}
                        onValueChange={(value) => setNewFacility({...newFacility, type: value})}
                      >
                        <SelectTrigger id="facilityType">
                          <SelectValue placeholder="Select facility type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="distribution">Distribution Center</SelectItem>
                          <SelectItem value="factory">Factory</SelectItem>
                          <SelectItem value="port">Port</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input 
                        id="capacity" 
                        type="number"
                        value={newFacility.capacity}
                        onChange={(e) => setNewFacility({...newFacility, capacity: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fixedCost">Fixed Cost (KES)</Label>
                      <Input 
                        id="fixedCost" 
                        type="number"
                        value={newFacility.fixedCost}
                        onChange={(e) => setNewFacility({...newFacility, fixedCost: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variableCost">Variable Cost (KES)</Label>
                      <Input 
                        id="variableCost" 
                        type="number"
                        value={newFacility.variableCost}
                        onChange={(e) => setNewFacility({...newFacility, variableCost: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <Button className="mt-2" onClick={addFacility}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Facility
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="customers" className="pt-6">
              <div className="space-y-6">
                <Alert variant="outline" className="bg-primary/5 border-primary/50">
                  <AlertTitle>About Customers</AlertTitle>
                  <AlertDescription>
                    Define customer locations, demand, and priority levels. These represent the demand points in your network.
                  </AlertDescription>
                </Alert>
                
                <Table>
                  <TableCaption>List of customer demand points</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Demand</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.location}</TableCell>
                        <TableCell>{customer.demand}</TableCell>
                        <TableCell>{customer.priority}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => deleteCustomer(customer.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Add New Customer</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input 
                        id="customerName" 
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                        placeholder="e.g., Nakuru Retail"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input 
                        id="location" 
                        value={newCustomer.location}
                        onChange={(e) => setNewCustomer({...newCustomer, location: e.target.value})}
                        placeholder="e.g., Nakuru"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="demand">Demand</Label>
                      <Input 
                        id="demand" 
                        type="number"
                        value={newCustomer.demand}
                        onChange={(e) => setNewCustomer({...newCustomer, demand: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority (1-5)</Label>
                      <Input 
                        id="priority" 
                        type="number"
                        min={1}
                        max={5}
                        value={newCustomer.priority}
                        onChange={(e) => setNewCustomer({...newCustomer, priority: parseInt(e.target.value) || 1})}
                      />
                    </div>
                  </div>
                  <Button className="mt-2" onClick={addCustomer}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="transport" className="pt-6">
              <div className="space-y-6">
                <Alert variant="outline" className="bg-primary/5 border-primary/50">
                  <AlertTitle>About Transport Routes</AlertTitle>
                  <AlertDescription>
                    Define the transportation options between facilities and customers, including costs, 
                    capacity, and lead times.
                  </AlertDescription>
                </Alert>
                
                <Table>
                  <TableCaption>List of transport routes</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Cost (KES)</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Time (days)</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transportRoutes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell>
                          {facilities.find(f => f.id === route.from)?.name || route.from}
                        </TableCell>
                        <TableCell>
                          {customers.find(c => c.id === route.to)?.name || route.to}
                        </TableCell>
                        <TableCell>{route.cost.toLocaleString()}</TableCell>
                        <TableCell>{route.capacity}</TableCell>
                        <TableCell>{route.time}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => deleteRoute(route.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Add New Transport Route</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fromFacility">From Facility *</Label>
                      <Select 
                        value={newRoute.from}
                        onValueChange={(value) => setNewRoute({...newRoute, from: value})}
                      >
                        <SelectTrigger id="fromFacility">
                          <SelectValue placeholder="Select origin facility" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilities.map(facility => (
                            <SelectItem key={facility.id} value={facility.id}>
                              {facility.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="toCustomer">To Customer *</Label>
                      <Select 
                        value={newRoute.to}
                        onValueChange={(value) => setNewRoute({...newRoute, to: value})}
                      >
                        <SelectTrigger id="toCustomer">
                          <SelectValue placeholder="Select destination customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map(customer => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost">Cost (KES)</Label>
                      <Input 
                        id="cost" 
                        type="number"
                        value={newRoute.cost}
                        onChange={(e) => setNewRoute({...newRoute, cost: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="routeCapacity">Capacity</Label>
                      <Input 
                        id="routeCapacity" 
                        type="number"
                        value={newRoute.capacity}
                        onChange={(e) => setNewRoute({...newRoute, capacity: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Lead Time (days)</Label>
                      <Input 
                        id="time" 
                        type="number"
                        value={newRoute.time}
                        onChange={(e) => setNewRoute({...newRoute, time: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <Button className="mt-2" onClick={addRoute}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Route
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="constraints" className="pt-6">
              <div className="space-y-6">
                <Alert variant="outline" className="bg-primary/5 border-primary/50">
                  <AlertTitle>About Constraints</AlertTitle>
                  <AlertDescription>
                    Define global constraints and objectives for the optimization model. These parameters 
                    will affect how the model balances various trade-offs.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Budget & Timing Constraints</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="maxBudget">Maximum Budget (KES)</Label>
                          <span className="text-sm text-muted-foreground">
                            {constraints.maxBudget.toLocaleString()}
                          </span>
                        </div>
                        <Slider
                          id="maxBudget"
                          min={100000}
                          max={10000000}
                          step={100000}
                          value={[constraints.maxBudget]}
                          onValueChange={(value) => setConstraints({...constraints, maxBudget: value[0]})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="maxLeadTime">Maximum Lead Time (days)</Label>
                          <span className="text-sm text-muted-foreground">
                            {constraints.maxLeadTime} days
                          </span>
                        </div>
                        <Slider
                          id="maxLeadTime"
                          min={1}
                          max={30}
                          step={1}
                          value={[constraints.maxLeadTime]}
                          onValueChange={(value) => setConstraints({...constraints, maxLeadTime: value[0]})}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Service & Sustainability Goals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="serviceLevelTarget">Service Level Target (%)</Label>
                          <span className="text-sm text-muted-foreground">
                            {constraints.serviceLevelTarget}%
                          </span>
                        </div>
                        <Slider
                          id="serviceLevelTarget"
                          min={80}
                          max={99.9}
                          step={0.1}
                          value={[constraints.serviceLevelTarget]}
                          onValueChange={(value) => setConstraints({...constraints, serviceLevelTarget: value[0]})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="sustainabilityFactor">Sustainability Factor (0-1)</Label>
                          <span className="text-sm text-muted-foreground">
                            {constraints.sustainabilityFactor.toFixed(1)}
                          </span>
                        </div>
                        <Slider
                          id="sustainabilityFactor"
                          min={0}
                          max={1}
                          step={0.1}
                          value={[constraints.sustainabilityFactor]}
                          onValueChange={(value) => setConstraints({...constraints, sustainabilityFactor: value[0]})}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Additional Options</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="enforceCapacity" 
                            checked={constraints.enforceCapacity}
                            onCheckedChange={(checked) => setConstraints({...constraints, enforceCapacity: checked})}
                          />
                          <Label htmlFor="enforceCapacity">Enforce facility capacity constraints</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="allowPartialFulfillment" 
                            checked={constraints.allowPartialFulfillment}
                            onCheckedChange={(checked) => setConstraints({...constraints, allowPartialFulfillment: checked})}
                          />
                          <Label htmlFor="allowPartialFulfillment">Allow partial demand fulfillment</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-3">
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>
          <Button onClick={runOptimization}>
            <Calculator className="h-4 w-4 mr-2" />
            Run Optimization
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
