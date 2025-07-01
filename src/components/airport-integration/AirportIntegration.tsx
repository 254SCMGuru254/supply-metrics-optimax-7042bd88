
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import NetworkMap from "@/components/NetworkMap";
import { TimePicker } from "@/components/ui/time-picker-demo";
import { safeClick } from "@/utils/domUtils";
import { Database } from "@/types/network";
import { AirportNode, AirportRoute } from "@/components/kenya/types/kenyaTypes";

const initialAirports: AirportNode[] = [
  {
    id: "airport1",
    name: "Jomo Kenyatta International Airport",
    type: "airport",
    latitude: -1.3192,
    longitude: 36.9277,
    hub_type: "International",
    capacity: 10000000,
    utilization: 0.75,
    delay_probability: 0.05,
  },
  {
    id: "airport2",
    name: "Moi International Airport",
    type: "airport",
    latitude: -4.0343,
    longitude: 39.5942,
    hub_type: "Regional",
    capacity: 5000000,
    utilization: 0.60,
    delay_probability: 0.03,
  },
];

const initialRoutes: AirportRoute[] = [
  {
    id: "route1",
    from: "airport1",
    to: "airport2",
    type: "air",
    volume: 1000,
    distance: 480,
    transit_time: 1,
    mode: "air",
    cost: 5000,
  },
];

interface AirportIntegrationProps {
  database?: Database;
  airportNodes?: AirportNode[];
}

export const AirportIntegration: React.FC<AirportIntegrationProps> = ({ database, airportNodes }) => {
  const [airports, setAirports] = useState<AirportNode[]>(initialAirports);
  const [routes, setRoutes] = useState<AirportRoute[]>(initialRoutes);
  const [selectedAirport, setSelectedAirport] = useState<AirportNode | null>(null);
  const [newAirport, setNewAirport] = useState<AirportNode>({
    id: "",
    name: "",
    type: "airport",
    latitude: 0,
    longitude: 0,
    hub_type: "International",
    capacity: 0,
    utilization: 0,
    delay_probability: 0,
  });
  const [newRoute, setNewRoute] = useState<AirportRoute>({
    id: "",
    from: "",
    to: "",
    type: "air",
    volume: 0,
    distance: 0,
    transit_time: 0,
    mode: "air",
    cost: 0,
  });
  const [isOptimized, setIsOptimized] = useState(false);
  const [highlightNodes, setHighlightNodes] = useState<string[]>([]);
  const [selectable, setSelectable] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [disruptionData, setDisruptionData] = useState<any>(null);
  const [resilienceMetrics, setResilienceMetrics] = useState<any>(null);

  useEffect(() => {
    if (airportNodes) {
      setAirports(airportNodes);
    }
  }, [airportNodes]);

  const handleAirportClick = (airport: AirportNode) => {
    setSelectedAirport(airport);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, setter: (value: any) => void) => {
    setter({ ...newAirport, [e.target.name]: e.target.value });
  };

  const handleAddAirport = () => {
    setAirports([...airports, newAirport]);
    setNewAirport({
      id: "",
      name: "",
      type: "airport",
      latitude: 0,
      longitude: 0,
      hub_type: "International",
      capacity: 0,
      utilization: 0,
      delay_probability: 0,
    });
  };

  const handleRouteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, setter: (value: any) => void) => {
    setter({ ...newRoute, [e.target.name]: e.target.value });
  };

  const handleAddRoute = () => {
    setRoutes([...routes, newRoute]);
    setNewRoute({
      id: "",
      from: "",
      to: "",
      type: "air",
      volume: 0,
      distance: 0,
      transit_time: 0,
      mode: "air",
      cost: 0,
    });
  };

  const handleOptimize = () => {
    setIsOptimized(true);
    setHighlightNodes(["airport1", "airport2"]);
  };

  const handleNodeSelect = (nodes: string[]) => {
    setSelectedNodes(nodes);
  };

  const handleDisrupt = () => {
    setDisruptionData({ airport1: 0.5, airport2: 0.3 });
  };

  const handleCalculateResilience = () => {
    setResilienceMetrics({
      robustness: 0.85,
      recovery: 0.92,
    });
  };

  return (
    <Card className="overflow-hidden">
      <Tabs defaultValue="airports" className="w-full">
        <TabsList className="p-4 border-b">
          <TabsTrigger value="airports">Airports</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="resilience">Resilience</TabsTrigger>
        </TabsList>

        <TabsContent value="airports" className="p-4">
          <h2 className="text-xl font-semibold mb-4">Airport Management</h2>
          <Table>
            <TableCaption>A list of airports in the network.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead>Hub Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Delay Probability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {airports.map((airport) => (
                <TableRow key={airport.id}>
                  <TableCell className="font-medium">{airport.id}</TableCell>
                  <TableCell>{airport.name}</TableCell>
                  <TableCell>{airport.latitude}</TableCell>
                  <TableCell>{airport.longitude}</TableCell>
                  <TableCell>{airport.hub_type}</TableCell>
                  <TableCell>{airport.capacity}</TableCell>
                  <TableCell>{airport.utilization}</TableCell>
                  <TableCell>{airport.delay_probability}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <h3 className="text-lg font-semibold mt-4 mb-2">Add New Airport</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="id">ID</Label>
              <Input type="text" name="id" value={newAirport.id} onChange={(e) => handleInputChange(e, setNewAirport)} />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input type="text" name="name" value={newAirport.name} onChange={(e) => handleInputChange(e, setNewAirport)} />
            </div>
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input type="number" name="latitude" value={newAirport.latitude} onChange={(e) => handleInputChange(e, setNewAirport)} />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input type="number" name="longitude" value={newAirport.longitude} onChange={(e) => handleInputChange(e, setNewAirport)} />
            </div>
            <div>
              <Label htmlFor="hub_type">Hub Type</Label>
              <Select onValueChange={(value) => setNewAirport({ ...newAirport, hub_type: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={newAirport.hub_type} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="International">International</SelectItem>
                  <SelectItem value="Regional">Regional</SelectItem>
                  <SelectItem value="Domestic">Domestic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input type="number" name="capacity" value={newAirport.capacity} onChange={(e) => handleInputChange(e, setNewAirport)} />
            </div>
            <div>
              <Label htmlFor="utilization">Utilization</Label>
              <Input type="number" name="utilization" value={newAirport.utilization} onChange={(e) => handleInputChange(e, setNewAirport)} />
            </div>
            <div>
              <Label htmlFor="delay_probability">Delay Probability</Label>
              <Input type="number" name="delay_probability" value={newAirport.delay_probability} onChange={(e) => handleInputChange(e, setNewAirport)} />
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddAirport}>
            Add Airport
          </Button>
        </TabsContent>

        <TabsContent value="routes" className="p-4">
          <h2 className="text-xl font-semibold mb-4">Route Management</h2>
          <Table>
            <TableCaption>A list of routes between airports.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Transit Time</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.id}</TableCell>
                  <TableCell>{route.from}</TableCell>
                  <TableCell>{route.to}</TableCell>
                  <TableCell>{route.distance}</TableCell>
                  <TableCell>{route.transit_time}</TableCell>
                  <TableCell>{route.mode}</TableCell>
                  <TableCell>{route.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <h3 className="text-lg font-semibold mt-4 mb-2">Add New Route</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="id">ID</Label>
              <Input type="text" name="id" value={newRoute.id} onChange={(e) => handleRouteInputChange(e, setNewRoute)} />
            </div>
            <div>
              <Label htmlFor="from">From</Label>
              <Input type="text" name="from" value={newRoute.from} onChange={(e) => handleRouteInputChange(e, setNewRoute)} />
            </div>
            <div>
              <Label htmlFor="to">To</Label>
              <Input type="text" name="to" value={newRoute.to} onChange={(e) => handleRouteInputChange(e, setNewRoute)} />
            </div>
            <div>
              <Label htmlFor="distance">Distance</Label>
              <Input type="number" name="distance" value={newRoute.distance} onChange={(e) => handleRouteInputChange(e, setNewRoute)} />
            </div>
            <div>
              <Label htmlFor="transit_time">Transit Time</Label>
              <Input type="number" name="transit_time" value={newRoute.transit_time} onChange={(e) => handleRouteInputChange(e, setNewRoute)} />
            </div>
            <div>
              <Label htmlFor="mode">Mode</Label>
              <Select onValueChange={(value) => setNewRoute({ ...newRoute, mode: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={newRoute.mode} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="air">Air</SelectItem>
                  <SelectItem value="road">Road</SelectItem>
                  <SelectItem value="rail">Rail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cost">Cost</Label>
              <Input type="number" name="cost" value={newRoute.cost} onChange={(e) => handleRouteInputChange(e, setNewRoute)} />
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddRoute}>
            Add Route
          </Button>
        </TabsContent>

        <TabsContent value="map" className="p-4">
          <h2 className="text-xl font-semibold mb-4">Network Map</h2>
          <NetworkMap
            nodes={airports as any}
            routes={routes as any}
            onNodeClick={(node) => handleAirportClick(node as any)}
            isOptimized={isOptimized}
            highlightNodes={highlightNodes}
            selectable={selectable}
            onNodeSelect={handleNodeSelect}
            disruptionData={disruptionData}
            resilienceMetrics={resilienceMetrics}
            airportNodes={airports}
          />
          <div className="mt-4">
            <Button onClick={handleOptimize}>Optimize Network</Button>
            <Button className="ml-2" onClick={() => setSelectable(!selectable)}>
              {selectable ? "Disable Selection" : "Enable Selection"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="simulation" className="p-4">
          <h2 className="text-xl font-semibold mb-4">Simulation</h2>
          <p>Configure simulation parameters and run simulations to test network resilience.</p>
          <Button onClick={handleDisrupt}>Simulate Disruption</Button>
        </TabsContent>

        <TabsContent value="resilience" className="p-4">
          <h2 className="text-xl font-semibold mb-4">Resilience Metrics</h2>
          <p>Calculate resilience metrics based on simulation results.</p>
          <Button onClick={handleCalculateResilience}>Calculate Resilience Metrics</Button>
          {resilienceMetrics && (
            <div className="mt-4">
              <p>Robustness: {resilienceMetrics.robustness}</p>
              <p>Recovery: {resilienceMetrics.recovery}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};
