
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { NetworkMap } from "@/components/NetworkMap";
import { Node, Route } from "@/components/map/MapTypes";
import { MapPin, Truck, Train, Ship, Plane, AlertTriangle, BarChart, Clock, DollarSign } from "lucide-react";
import { kenyaLocationsWithRestrictions } from "@/data/kenya-route-data";

export const RouteOptimizationContent = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState("dynamic");
  const [selectedCountry, setSelectedCountry] = useState("kenya");
  const [routeNodes, setRouteNodes] = useState<Node[]>(kenyaLocationsWithRestrictions.map(loc => ({
    id: loc.id,
    name: loc.name,
    type: loc.type as Node["type"],
    latitude: loc.latitude,
    longitude: loc.longitude,
    metadata: {
      restrictions: loc.restrictions,
      trafficFactor: loc.trafficFactor || 1.0,
      tollCost: loc.tollCost || 0,
      checkpointWaitTime: loc.checkpointWaitTime
    }
  })));
  const [routePaths, setRoutePaths] = useState<Route[]>([]);
  const [dynamicOptions, setDynamicOptions] = useState({
    considerTraffic: true,
    considerCheckpoints: true,
    considerTolls: true,
    considerWeather: true
  });
  const [transportModes, setTransportModes] = useState({
    road: true,
    rail: true,
    sea: true,
    air: false
  });
  const [tonnage, setTonnage] = useState(20); // in metric tons
  const [routePreference, setRoutePreference] = useState("balanced");
  
  const { toast } = useToast();

  const handleOptimizeRoute = () => {
    if (routeNodes.length < 2) {
      toast({
        title: "Not enough locations",
        description: "Please select at least an origin and destination",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    toast({
      title: "Optimizing Route",
      description: "Calculating optimal routes based on selected parameters..."
    });

    // Simulate API call to backend route optimization service
    setTimeout(() => {
      // Generate optimized routes based on preferences
      const origin = routeNodes[0];
      const destination = routeNodes[routeNodes.length - 1];
      
      const newRoutes: Route[] = [];
      
      // Base direct route
      newRoutes.push({
        id: "direct-road",
        from: origin.id,
        to: destination.id,
        type: "road",
        volume: tonnage,
        cost: calculateRouteCost(origin, destination, "road", tonnage, routePreference),
        transitTime: calculateRouteTime(origin, destination, "road", dynamicOptions.considerTraffic),
        isOptimized: true
      });
      
      // Add multi-modal options if enabled
      if (transportModes.rail) {
        const railHub = routeNodes.find(n => n.type === "railhub");
        if (railHub) {
          newRoutes.push({
            id: "origin-to-rail",
            from: origin.id,
            to: railHub.id,
            type: "road",
            volume: tonnage,
            transitTime: calculateRouteTime(origin, railHub, "road", dynamicOptions.considerTraffic),
            isOptimized: true
          });
          
          newRoutes.push({
            id: "rail-to-dest",
            from: railHub.id,
            to: destination.id,
            type: "rail",
            volume: tonnage,
            transitTime: calculateRouteTime(railHub, destination, "rail", false),
            isOptimized: true
          });
        }
      }
      
      // Add sea routes if enabled
      if (transportModes.sea) {
        const port = routeNodes.find(n => n.type === "port");
        if (port) {
          newRoutes.push({
            id: "sea-route",
            from: origin.id,
            to: port.id,
            type: "sea",
            volume: tonnage,
            transitTime: calculateRouteTime(origin, port, "sea", false),
            isOptimized: true
          });
        }
      }
      
      // Add air routes if enabled
      if (transportModes.air) {
        const airport = routeNodes.find(n => n.type === "airport");
        if (airport) {
          newRoutes.push({
            id: "air-route",
            from: origin.id,
            to: airport.id,
            type: "air",
            volume: tonnage,
            transitTime: calculateRouteTime(origin, airport, "air", false),
            isOptimized: true
          });
        }
      }
      
      setRoutePaths(newRoutes);
      setIsOptimizing(false);
      
      toast({
        title: "Routes Optimized",
        description: `${newRoutes.length} route options generated based on your preferences`
      });
    }, 2000);
  };

  const calculateRouteCost = (from: Node, to: Node, mode: string, weight: number, preference: string) => {
    // Calculate distance in km (simplified)
    const R = 6371; // Earth radius in km
    const dLat = (to.latitude - from.latitude) * Math.PI / 180;
    const dLon = (to.longitude - from.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(from.latitude * Math.PI / 180) * Math.cos(to.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Base transport costs per km per ton (in USD)
    const baseCostPerKm = {
      road: 0.12,
      rail: 0.08,
      sea: 0.04,
      air: 0.60
    };
    
    // Adjust cost based on preference
    let costMultiplier = 1.0;
    if (preference === "cheapest") costMultiplier = 0.9;
    if (preference === "fastest") costMultiplier = 1.2;
    
    // Consider tolls if enabled and mode is road
    let tollCost = 0;
    if (dynamicOptions.considerTolls && mode === "road") {
      tollCost = (from.metadata?.tollCost || 0) + (to.metadata?.tollCost || 0);
    }
    
    // Calculate total cost
    let totalCost = distance * baseCostPerKm[mode as keyof typeof baseCostPerKm] * weight * costMultiplier;
    totalCost += tollCost;
    
    return Math.round(totalCost);
  };

  const calculateRouteTime = (from: Node, to: Node, mode: string, considerTraffic: boolean) => {
    // Calculate distance in km (same as cost function)
    const R = 6371; // Earth radius in km
    const dLat = (to.latitude - from.latitude) * Math.PI / 180;
    const dLon = (to.longitude - from.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(from.latitude * Math.PI / 180) * Math.cos(to.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Average speeds by mode (km/h)
    const avgSpeed = {
      road: 60,
      rail: 80,
      sea: 30,
      air: 700
    };
    
    // Traffic factor if enabled (1.0 = no traffic, 2.0 = heavy traffic)
    let trafficFactor = 1.0;
    if (considerTraffic && mode === "road") {
      trafficFactor = from.metadata?.trafficFactor || 1.0;
    }
    
    // Calculate time in hours
    const time = distance / (avgSpeed[mode as keyof typeof avgSpeed] / trafficFactor);
    
    return parseFloat(time.toFixed(2));
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    if (value === "kenya") {
      setRouteNodes(kenyaLocationsWithRestrictions.map(loc => ({
        id: loc.id,
        name: loc.name,
        type: loc.type as Node["type"],
        latitude: loc.latitude,
        longitude: loc.longitude,
        metadata: {
          restrictions: loc.restrictions,
          trafficFactor: loc.trafficFactor || 1.0,
          tollCost: loc.tollCost || 0,
          checkpointWaitTime: loc.checkpointWaitTime
        }
      })));
    } else {
      // For other countries, we'll allow user input
      setRouteNodes([]);
    }
    setRoutePaths([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Route Planning Map</h2>
            <Select value={selectedCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kenya">Kenya</SelectItem>
                <SelectItem value="tanzania">Tanzania</SelectItem>
                <SelectItem value="uganda">Uganda</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="h-[400px] border rounded-md overflow-hidden mb-4">
            <NetworkMap
              nodes={routeNodes}
              routes={routePaths}
              isOptimized={true}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleOptimizeRoute} 
              disabled={isOptimizing || routeNodes.length < 2}
            >
              {isOptimizing ? "Optimizing..." : "Optimize Route"}
            </Button>
          </div>
        </Card>
        
        <div className="space-y-6">
          <Card className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="dynamic" className="flex-1">Dynamic</TabsTrigger>
                <TabsTrigger value="modal" className="flex-1">Transport</TabsTrigger>
                <TabsTrigger value="tonnage" className="flex-1">Tonnage</TabsTrigger>
                <TabsTrigger value="cost" className="flex-1">Cost</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dynamic" className="space-y-4 pt-4">
                <h3 className="font-medium">Dynamic Routing Factors</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label htmlFor="traffic">Traffic Conditions</Label>
                      <p className="text-sm text-muted-foreground">
                        Consider real-time traffic data
                      </p>
                    </div>
                    <Switch
                      id="traffic"
                      checked={dynamicOptions.considerTraffic}
                      onCheckedChange={(checked) => 
                        setDynamicOptions({...dynamicOptions, considerTraffic: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label htmlFor="checkpoints">Border Checkpoints</Label>
                      <p className="text-sm text-muted-foreground">
                        Include border crossing wait times
                      </p>
                    </div>
                    <Switch
                      id="checkpoints"
                      checked={dynamicOptions.considerCheckpoints}
                      onCheckedChange={(checked) => 
                        setDynamicOptions({...dynamicOptions, considerCheckpoints: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label htmlFor="tolls">Road Tolls</Label>
                      <p className="text-sm text-muted-foreground">
                        Include toll costs and locations
                      </p>
                    </div>
                    <Switch
                      id="tolls"
                      checked={dynamicOptions.considerTolls}
                      onCheckedChange={(checked) => 
                        setDynamicOptions({...dynamicOptions, considerTolls: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label htmlFor="weather">Weather Conditions</Label>
                      <p className="text-sm text-muted-foreground">
                        Account for weather impacts
                      </p>
                    </div>
                    <Switch
                      id="weather"
                      checked={dynamicOptions.considerWeather}
                      onCheckedChange={(checked) => 
                        setDynamicOptions({...dynamicOptions, considerWeather: checked})
                      }
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="modal" className="space-y-4 pt-4">
                <h3 className="font-medium">Multi-Modal Transport Options</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Truck size={18} />
                      <Label htmlFor="road">Road Transport</Label>
                    </div>
                    <Switch
                      id="road"
                      checked={transportModes.road}
                      onCheckedChange={(checked) => 
                        setTransportModes({...transportModes, road: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Train size={18} />
                      <Label htmlFor="rail">Rail Transport</Label>
                    </div>
                    <Switch
                      id="rail"
                      checked={transportModes.rail}
                      onCheckedChange={(checked) => 
                        setTransportModes({...transportModes, rail: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Ship size={18} />
                      <Label htmlFor="sea">Sea Transport</Label>
                    </div>
                    <Switch
                      id="sea"
                      checked={transportModes.sea}
                      onCheckedChange={(checked) => 
                        setTransportModes({...transportModes, sea: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Plane size={18} />
                      <Label htmlFor="air">Air Transport</Label>
                    </div>
                    <Switch
                      id="air"
                      checked={transportModes.air}
                      onCheckedChange={(checked) => 
                        setTransportModes({...transportModes, air: checked})
                      }
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tonnage" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Cargo Weight (Tonnage)</h3>
                  <span className="text-sm font-medium">{tonnage} tons</span>
                </div>
                
                <Slider
                  value={[tonnage]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(value) => setTonnage(value[0])}
                />
                
                <div className="flex items-center mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                  <AlertTriangle size={16} className="text-yellow-600 mr-2" />
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Some routes have weight restrictions and may not be available for loads over certain tonnage.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="cost" className="space-y-4 pt-4">
                <h3 className="font-medium">Route Optimization Preference</h3>
                
                <RadioGroup
                  value={routePreference}
                  onValueChange={setRoutePreference}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cheapest" id="cheapest" />
                    <Label htmlFor="cheapest" className="flex items-center">
                      <DollarSign size={16} className="mr-1" />
                      Cheapest Route
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balanced" id="balanced" />
                    <Label htmlFor="balanced" className="flex items-center">
                      <BarChart size={16} className="mr-1" />
                      Balanced (Cost/Time)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fastest" id="fastest" />
                    <Label htmlFor="fastest" className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      Fastest Route
                    </Label>
                  </div>
                </RadioGroup>
              </TabsContent>
            </Tabs>
          </Card>
          
          {routePaths.length > 0 && (
            <Card className="p-4">
              <h3 className="font-medium mb-3">Route Analysis</h3>
              <div className="space-y-3">
                {routePaths.map((route, index) => (
                  <div key={route.id} className="p-3 border rounded-md">
                    <div className="flex justify-between">
                      <div className="font-medium">Route {index + 1}</div>
                      <div className="text-sm">
                        {route.type === "road" && <Truck size={16} className="inline mr-1" />}
                        {route.type === "rail" && <Train size={16} className="inline mr-1" />}
                        {route.type === "sea" && <Ship size={16} className="inline mr-1" />}
                        {route.type === "air" && <Plane size={16} className="inline mr-1" />}
                        {route.type}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                      <div className="text-muted-foreground">Cost:</div>
                      <div>${route.cost}</div>
                      <div className="text-muted-foreground">Time:</div>
                      <div>{route.transitTime} hours</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
