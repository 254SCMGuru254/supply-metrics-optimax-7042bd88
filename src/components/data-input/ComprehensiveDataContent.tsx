
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

export type VehicleData = {
  id: string;
  name: string;
  type: string;
  ownership: "owned" | "outsourced";
  capacity: number;
  capacityUnit: "tons" | "kg" | "pallets" | "cbm";
  fuelConsumption: number;
  maintenanceCost: number;
  driverCostPerDay: number;
  maxSpeed: number;
  restrictions: {
    weightLimit: number;
    heightLimit: number;
    widthLimit: number;
  };
  miscExpenses: number;
};

export type WarehouseData = {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  ownership: "owned" | "outsourced";
  size: number;
  sizeUnit: "sqm" | "sqft";
  functions: string[];
  automationLevel: "automated" | "semi-automated" | "manual";
  coldChain: boolean;
  coldChainTemperature?: number;
  monthlyCost: number;
  handlingCostPerUnit: number;
  laborCost: number;
};

export type RouteConstraintData = {
  id: string;
  name: string;
  type: "checkpoint" | "toll" | "weight-restriction" | "time-window" | "environmental-zone";
  location?: {
    latitude: number;
    longitude: number;
  };
  cost: number;
  timeDelay: number;
  restrictions: string[];
  notes: string;
};

export const ComprehensiveDataContent = () => {
  const [activeTab, setActiveTab] = useState("vehicles");
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [routeConstraints, setRouteConstraints] = useState<RouteConstraintData[]>([]);

  const vehicleForm = useForm<VehicleData>({
    defaultValues: {
      id: crypto.randomUUID(),
      name: "",
      type: "truck",
      ownership: "owned",
      capacity: 0,
      capacityUnit: "tons",
      fuelConsumption: 0,
      maintenanceCost: 0,
      driverCostPerDay: 0,
      maxSpeed: 80,
      restrictions: {
        weightLimit: 0,
        heightLimit: 0,
        widthLimit: 0,
      },
      miscExpenses: 0,
    },
  });

  const warehouseForm = useForm<WarehouseData>({
    defaultValues: {
      id: crypto.randomUUID(),
      name: "",
      location: {
        latitude: 0,
        longitude: 0,
        address: "",
      },
      ownership: "owned",
      size: 0,
      sizeUnit: "sqm",
      functions: [],
      automationLevel: "manual",
      coldChain: false,
      monthlyCost: 0,
      handlingCostPerUnit: 0,
      laborCost: 0,
    },
  });

  const routeConstraintForm = useForm<RouteConstraintData>({
    defaultValues: {
      id: crypto.randomUUID(),
      name: "",
      type: "checkpoint",
      cost: 0,
      timeDelay: 0,
      restrictions: [],
      notes: "",
    },
  });

  const handleVehicleSubmit = (data: VehicleData) => {
    setVehicles([...vehicles, { ...data, id: crypto.randomUUID() }]);
    vehicleForm.reset();
  };

  const handleWarehouseSubmit = (data: WarehouseData) => {
    setWarehouses([...warehouses, { ...data, id: crypto.randomUUID() }]);
    warehouseForm.reset();
  };

  const handleRouteConstraintSubmit = (data: RouteConstraintData) => {
    setRouteConstraints([...routeConstraints, { ...data, id: crypto.randomUUID() }]);
    routeConstraintForm.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprehensive Supply Chain Data</CardTitle>
        <CardDescription>
          Enter detailed information about your supply chain components 
          including vehicles, warehouses, and route constraints.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="vehicles">Vehicles & Transport</TabsTrigger>
            <TabsTrigger value="warehouses">Warehouses & Facilities</TabsTrigger>
            <TabsTrigger value="route-constraints">Route Constraints</TabsTrigger>
            <TabsTrigger value="existing-data">Your Data</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            <form onSubmit={vehicleForm.handleSubmit(handleVehicleSubmit)}>
              <div className="grid gap-4 py-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Delivery Truck 01"
                    {...vehicleForm.register("name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Vehicle Type</Label>
                  <Select
                    onValueChange={(value) => vehicleForm.setValue("type", value)}
                    defaultValue="truck"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="train">Train</SelectItem>
                        <SelectItem value="aircraft">Aircraft</SelectItem>
                        <SelectItem value="ship">Ship</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownership">Ownership</Label>
                  <Select
                    onValueChange={(value: "owned" | "outsourced") => vehicleForm.setValue("ownership", value)}
                    defaultValue="owned"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="owned">Owned</SelectItem>
                        <SelectItem value="outsourced">Outsourced</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="0"
                      {...vehicleForm.register("capacity", { valueAsNumber: true })}
                    />
                    <Select
                      onValueChange={(value: "tons" | "kg" | "pallets" | "cbm") => 
                        vehicleForm.setValue("capacityUnit", value)
                      }
                      defaultValue="tons"
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="tons">Tons</SelectItem>
                          <SelectItem value="kg">KG</SelectItem>
                          <SelectItem value="pallets">Pallets</SelectItem>
                          <SelectItem value="cbm">CBM</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuelConsumption">Fuel Consumption (L/100km)</Label>
                  <Input
                    id="fuelConsumption"
                    type="number"
                    placeholder="0"
                    {...vehicleForm.register("fuelConsumption", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenanceCost">Monthly Maintenance Cost (KES)</Label>
                  <Input
                    id="maintenanceCost"
                    type="number"
                    placeholder="0"
                    {...vehicleForm.register("maintenanceCost", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverCostPerDay">Driver Cost per Day (KES)</Label>
                  <Input
                    id="driverCostPerDay"
                    type="number"
                    placeholder="0"
                    {...vehicleForm.register("driverCostPerDay", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxSpeed">Maximum Speed (km/h)</Label>
                  <Input
                    id="maxSpeed"
                    type="number"
                    placeholder="80"
                    {...vehicleForm.register("maxSpeed", { valueAsNumber: true })}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Vehicle Restrictions</Label>
                  <div className="grid gap-4 mt-2 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="weightLimit">Weight Limit (tons)</Label>
                      <Input
                        id="weightLimit"
                        type="number"
                        placeholder="0"
                        {...vehicleForm.register("restrictions.weightLimit", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heightLimit">Height Limit (m)</Label>
                      <Input
                        id="heightLimit"
                        type="number"
                        placeholder="0"
                        {...vehicleForm.register("restrictions.heightLimit", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="widthLimit">Width Limit (m)</Label>
                      <Input
                        id="widthLimit"
                        type="number"
                        placeholder="0"
                        {...vehicleForm.register("restrictions.widthLimit", { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="miscExpenses">Miscellaneous Expenses (KES/month)</Label>
                  <Input
                    id="miscExpenses"
                    type="number"
                    placeholder="0"
                    {...vehicleForm.register("miscExpenses", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <Button type="submit" className="mt-4">
                Add Vehicle
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="warehouses">
            <form onSubmit={warehouseForm.handleSubmit(handleWarehouseSubmit)}>
              <div className="grid gap-4 py-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Warehouse/Facility Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Central Distribution Center"
                    {...warehouseForm.register("name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownership">Ownership</Label>
                  <Select
                    onValueChange={(value: "owned" | "outsourced") => warehouseForm.setValue("ownership", value)}
                    defaultValue="owned"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="owned">Owned</SelectItem>
                        <SelectItem value="outsourced">Outsourced/Leased</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>Location</Label>
                  <div className="grid gap-4 mt-2 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        placeholder="0.0000"
                        {...warehouseForm.register("location.latitude", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        placeholder="0.0000"
                        {...warehouseForm.register("location.longitude", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Physical address"
                        {...warehouseForm.register("location.address")}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Facility Size</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="size"
                      type="number"
                      placeholder="0"
                      {...warehouseForm.register("size", { valueAsNumber: true })}
                    />
                    <Select
                      onValueChange={(value: "sqm" | "sqft") => 
                        warehouseForm.setValue("sizeUnit", value)
                      }
                      defaultValue="sqm"
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="sqm">m²</SelectItem>
                          <SelectItem value="sqft">ft²</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="automationLevel">Automation Level</Label>
                  <Select
                    onValueChange={(value: "automated" | "semi-automated" | "manual") => 
                      warehouseForm.setValue("automationLevel", value)
                    }
                    defaultValue="manual"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select automation level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="automated">Fully Automated</SelectItem>
                        <SelectItem value="semi-automated">Semi-Automated</SelectItem>
                        <SelectItem value="manual">Manual Operations</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>Warehouse Functions</Label>
                  <div className="grid gap-2 mt-2 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="storage" onCheckedChange={(checked) => {
                        const functions = warehouseForm.getValues("functions");
                        if (checked) {
                          warehouseForm.setValue("functions", [...functions, "storage"]);
                        } else {
                          warehouseForm.setValue("functions", functions.filter(f => f !== "storage"));
                        }
                      }} />
                      <Label htmlFor="storage">Storage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="crossdocking" onCheckedChange={(checked) => {
                        const functions = warehouseForm.getValues("functions");
                        if (checked) {
                          warehouseForm.setValue("functions", [...functions, "cross-docking"]);
                        } else {
                          warehouseForm.setValue("functions", functions.filter(f => f !== "cross-docking"));
                        }
                      }} />
                      <Label htmlFor="crossdocking">Cross-Docking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="transhipment" onCheckedChange={(checked) => {
                        const functions = warehouseForm.getValues("functions");
                        if (checked) {
                          warehouseForm.setValue("functions", [...functions, "transshipment"]);
                        } else {
                          warehouseForm.setValue("functions", functions.filter(f => f !== "transshipment"));
                        }
                      }} />
                      <Label htmlFor="transhipment">Transshipment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="valueAddition" onCheckedChange={(checked) => {
                        const functions = warehouseForm.getValues("functions");
                        if (checked) {
                          warehouseForm.setValue("functions", [...functions, "value-addition"]);
                        } else {
                          warehouseForm.setValue("functions", functions.filter(f => f !== "value-addition"));
                        }
                      }} />
                      <Label htmlFor="valueAddition">Value Addition</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="distribution" onCheckedChange={(checked) => {
                        const functions = warehouseForm.getValues("functions");
                        if (checked) {
                          warehouseForm.setValue("functions", [...functions, "distribution"]);
                        } else {
                          warehouseForm.setValue("functions", functions.filter(f => f !== "distribution"));
                        }
                      }} />
                      <Label htmlFor="distribution">Distribution</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="customs" onCheckedChange={(checked) => {
                        const functions = warehouseForm.getValues("functions");
                        if (checked) {
                          warehouseForm.setValue("functions", [...functions, "customs"]);
                        } else {
                          warehouseForm.setValue("functions", functions.filter(f => f !== "customs"));
                        }
                      }} />
                      <Label htmlFor="customs">Customs Clearance</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="coldChain" onCheckedChange={(checked) => {
                      warehouseForm.setValue("coldChain", checked);
                    }} />
                    <Label htmlFor="coldChain">Cold Chain Facility</Label>
                  </div>
                </div>

                {warehouseForm.watch("coldChain") && (
                  <div className="space-y-2">
                    <Label htmlFor="coldChainTemperature">Temperature Range (°C)</Label>
                    <Input
                      id="coldChainTemperature"
                      type="number"
                      placeholder="e.g., -18"
                      {...warehouseForm.register("coldChainTemperature", { valueAsNumber: true })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="monthlyCost">Monthly Operating Cost (KES)</Label>
                  <Input
                    id="monthlyCost"
                    type="number"
                    placeholder="0"
                    {...warehouseForm.register("monthlyCost", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handlingCostPerUnit">Handling Cost per Unit (KES)</Label>
                  <Input
                    id="handlingCostPerUnit"
                    type="number"
                    placeholder="0"
                    {...warehouseForm.register("handlingCostPerUnit", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="laborCost">Monthly Labor Cost (KES)</Label>
                  <Input
                    id="laborCost"
                    type="number"
                    placeholder="0"
                    {...warehouseForm.register("laborCost", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <Button type="submit" className="mt-4">
                Add Warehouse/Facility
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="route-constraints">
            <form onSubmit={routeConstraintForm.handleSubmit(handleRouteConstraintSubmit)}>
              <div className="grid gap-4 py-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Constraint Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Nakuru Weigh Bridge"
                    {...routeConstraintForm.register("name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Constraint Type</Label>
                  <Select
                    onValueChange={(value: "checkpoint" | "toll" | "weight-restriction" | "time-window" | "environmental-zone") => 
                      routeConstraintForm.setValue("type", value)
                    }
                    defaultValue="checkpoint"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select constraint type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="checkpoint">Checkpoint/Weigh Bridge</SelectItem>
                        <SelectItem value="toll">Toll Station</SelectItem>
                        <SelectItem value="weight-restriction">Weight Restriction</SelectItem>
                        <SelectItem value="time-window">Time Window Restriction</SelectItem>
                        <SelectItem value="environmental-zone">Environmental Zone</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>Location (if applicable)</Label>
                  <div className="grid gap-4 mt-2 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="latitudeConstraint">Latitude</Label>
                      <Input
                        id="latitudeConstraint"
                        type="number"
                        placeholder="0.0000"
                        onChange={(e) => {
                          if (!routeConstraintForm.getValues("location")) {
                            routeConstraintForm.setValue("location", { latitude: 0, longitude: 0 });
                          }
                          routeConstraintForm.setValue("location.latitude", parseFloat(e.target.value));
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitudeConstraint">Longitude</Label>
                      <Input
                        id="longitudeConstraint"
                        type="number"
                        placeholder="0.0000"
                        onChange={(e) => {
                          if (!routeConstraintForm.getValues("location")) {
                            routeConstraintForm.setValue("location", { latitude: 0, longitude: 0 });
                          }
                          routeConstraintForm.setValue("location.longitude", parseFloat(e.target.value));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (KES)</Label>
                  <Input
                    id="cost"
                    type="number"
                    placeholder="0"
                    {...routeConstraintForm.register("cost", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeDelay">Time Delay (minutes)</Label>
                  <Input
                    id="timeDelay"
                    type="number"
                    placeholder="0"
                    {...routeConstraintForm.register("timeDelay", { valueAsNumber: true })}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Specific Restrictions</Label>
                  <div className="grid gap-2 mt-2 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="weightRestriction" onCheckedChange={(checked) => {
                        const restrictions = routeConstraintForm.getValues("restrictions");
                        if (checked) {
                          routeConstraintForm.setValue("restrictions", [...restrictions, "weight"]);
                        } else {
                          routeConstraintForm.setValue("restrictions", restrictions.filter(r => r !== "weight"));
                        }
                      }} />
                      <Label htmlFor="weightRestriction">Weight Restriction</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="heightRestriction" onCheckedChange={(checked) => {
                        const restrictions = routeConstraintForm.getValues("restrictions");
                        if (checked) {
                          routeConstraintForm.setValue("restrictions", [...restrictions, "height"]);
                        } else {
                          routeConstraintForm.setValue("restrictions", restrictions.filter(r => r !== "height"));
                        }
                      }} />
                      <Label htmlFor="heightRestriction">Height Restriction</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="timeRestriction" onCheckedChange={(checked) => {
                        const restrictions = routeConstraintForm.getValues("restrictions");
                        if (checked) {
                          routeConstraintForm.setValue("restrictions", [...restrictions, "time"]);
                        } else {
                          routeConstraintForm.setValue("restrictions", restrictions.filter(r => r !== "time"));
                        }
                      }} />
                      <Label htmlFor="timeRestriction">Time Restriction</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="vehicleTypeRestriction" onCheckedChange={(checked) => {
                        const restrictions = routeConstraintForm.getValues("restrictions");
                        if (checked) {
                          routeConstraintForm.setValue("restrictions", [...restrictions, "vehicle-type"]);
                        } else {
                          routeConstraintForm.setValue("restrictions", restrictions.filter(r => r !== "vehicle-type"));
                        }
                      }} />
                      <Label htmlFor="vehicleTypeRestriction">Vehicle Type Restriction</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="goodsTypeRestriction" onCheckedChange={(checked) => {
                        const restrictions = routeConstraintForm.getValues("restrictions");
                        if (checked) {
                          routeConstraintForm.setValue("restrictions", [...restrictions, "goods-type"]);
                        } else {
                          routeConstraintForm.setValue("restrictions", restrictions.filter(r => r !== "goods-type"));
                        }
                      }} />
                      <Label htmlFor="goodsTypeRestriction">Goods Type Restriction</Label>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    placeholder="Additional details about this constraint"
                    {...routeConstraintForm.register("notes")}
                  />
                </div>
              </div>

              <Button type="submit" className="mt-4">
                Add Route Constraint
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="existing-data">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Vehicles & Transport ({vehicles.length})</h3>
                <Separator className="my-2" />
                {vehicles.length > 0 ? (
                  <div className="grid gap-4 mt-2 md:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((vehicle) => (
                      <Card key={vehicle.id} className="overflow-hidden">
                        <CardHeader className="bg-muted p-4">
                          <CardTitle className="text-base">{vehicle.name}</CardTitle>
                          <CardDescription>{vehicle.type} - {vehicle.ownership}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <p className="text-sm">Capacity: {vehicle.capacity} {vehicle.capacityUnit}</p>
                          <p className="text-sm">Fuel: {vehicle.fuelConsumption} L/100km</p>
                          <p className="text-sm">Driver: {vehicle.driverCostPerDay} KES/day</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No vehicles added yet</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium">Warehouses & Facilities ({warehouses.length})</h3>
                <Separator className="my-2" />
                {warehouses.length > 0 ? (
                  <div className="grid gap-4 mt-2 md:grid-cols-2 lg:grid-cols-3">
                    {warehouses.map((warehouse) => (
                      <Card key={warehouse.id} className="overflow-hidden">
                        <CardHeader className="bg-muted p-4">
                          <CardTitle className="text-base">{warehouse.name}</CardTitle>
                          <CardDescription>
                            {warehouse.ownership} - {warehouse.size} {warehouse.sizeUnit}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <p className="text-sm">Functions: {warehouse.functions.join(", ") || "N/A"}</p>
                          <p className="text-sm">Automation: {warehouse.automationLevel}</p>
                          {warehouse.coldChain && (
                            <p className="text-sm">Cold chain: {warehouse.coldChainTemperature}°C</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No warehouses added yet</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium">Route Constraints ({routeConstraints.length})</h3>
                <Separator className="my-2" />
                {routeConstraints.length > 0 ? (
                  <div className="grid gap-4 mt-2 md:grid-cols-2 lg:grid-cols-3">
                    {routeConstraints.map((constraint) => (
                      <Card key={constraint.id} className="overflow-hidden">
                        <CardHeader className="bg-muted p-4">
                          <CardTitle className="text-base">{constraint.name}</CardTitle>
                          <CardDescription>{constraint.type}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <p className="text-sm">Cost: {constraint.cost} KES</p>
                          <p className="text-sm">Delay: {constraint.timeDelay} min</p>
                          {constraint.restrictions.length > 0 && (
                            <p className="text-sm">Restrictions: {constraint.restrictions.join(", ")}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No route constraints added yet</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
