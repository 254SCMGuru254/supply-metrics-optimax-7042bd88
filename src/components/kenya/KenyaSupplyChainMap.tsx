
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet"; // Import L from leaflet
import "leaflet/dist/leaflet.css"; // Make sure CSS is imported
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  allKenyaLocations, 
  kenyaCities, 
  kenyaDistributionCenters, 
  kenyaMarkets,
  kenyaAirports, 
  kenyaPorts, 
  kenyaFarmCollectionCenters,
  KenyaLocation,
  calculateDistance
} from "@/data/kenya-locations";

// Define color coding for different location types
const locationColors: Record<string, string> = {
  city: "#3B82F6", // blue
  market: "#10B981", // green
  distribution: "#F59E0B", // amber
  airport: "#6366F1", // indigo
  farm_collection: "#84CC16", // lime
  port: "#EC4899", // pink
  border: "#8B5CF6", // purple
};

// Define supply chain route type
interface SupplyChainRoute {
  id: string;
  from: string;
  to: string;
  type: "road" | "rail" | "air" | "sea";
  volume: number;
  description?: string;
}

// Sample Kenya supply chain routes
const kenyaSupplyChainRoutes: SupplyChainRoute[] = [
  {
    id: "route1",
    from: "mombasa_port",
    to: "nairobi_dc",
    type: "rail",
    volume: 1200,
    description: "Standard Gauge Railway (SGR) main freight route"
  },
  {
    id: "route2",
    from: "nairobi_dc",
    to: "kisumu_dc",
    type: "road",
    volume: 800,
    description: "Western Kenya distribution route"
  },
  {
    id: "route3",
    from: "nairobi_dc",
    to: "eldoret_dc",
    type: "road",
    volume: 650,
    description: "North Rift distribution route"
  },
  {
    id: "route4",
    from: "jkia",
    to: "nairobi_dc",
    type: "road",
    volume: 350,
    description: "Air cargo to distribution center route"
  },
  {
    id: "route5",
    from: "mombasa_port",
    to: "voi_dc",
    type: "road",
    volume: 450,
    description: "Coastal distribution route"
  },
  {
    id: "route6",
    from: "nairobi_dc",
    to: "nakuru_dc",
    type: "road",
    volume: 750,
    description: "Central Rift Valley distribution route"
  },
  {
    id: "route7",
    from: "nakuru_dc",
    to: "kisumu_dc",
    type: "road",
    volume: 500,
    description: "Inter-regional distribution route"
  },
  {
    id: "route8",
    from: "busia_border",
    to: "kisumu_dc",
    type: "road",
    volume: 350,
    description: "Uganda import route"
  },
  {
    id: "route9",
    from: "namanga_border",
    to: "nairobi_dc",
    type: "road",
    volume: 300,
    description: "Tanzania import route"
  },
  {
    id: "route10",
    from: "ktda_kericho",
    to: "mombasa_port",
    type: "road",
    volume: 250,
    description: "Tea export route"
  }
];

// Get route color based on type
const getRouteColor = (type: string): string => {
  switch (type) {
    case "road":
      return "#3B82F6"; // blue
    case "rail":
      return "#10B981"; // green
    case "air":
      return "#8B5CF6"; // purple
    case "sea":
      return "#EC4899"; // pink
    default:
      return "#6B7280"; // gray
  }
};

// Get route weight based on volume
const getRouteWeight = (volume: number): number => {
  if (volume > 1000) return 5;
  if (volume > 500) return 4;
  if (volume > 250) return 3;
  return 2;
};

// Get icon URL based on location type
const getMarkerIcon = (type: string): string => {
  switch (type) {
    case "city":
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png";
    case "market":
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png";
    case "distribution":
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png";
    case "airport":
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png";
    case "farm_collection":
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png";
    case "port":
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png";
    case "border":
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png";
    default:
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png";
  }
};

export const KenyaSupplyChainMap = () => {
  const [visibleLocations, setVisibleLocations] = useState<KenyaLocation[]>(kenyaDistributionCenters);
  const [visibleRoutes, setVisibleRoutes] = useState<SupplyChainRoute[]>(kenyaSupplyChainRoutes);
  const [selectedLocation, setSelectedLocation] = useState<KenyaLocation | null>(null);
  const [activeTab, setActiveTab] = useState("distribution");
  const [mapCenter, setMapCenter] = useState<[number, number]>([0.0236, 37.9062]); // Kenya center

  // Function to find location by ID
  const findLocationById = (id: string): KenyaLocation | undefined => {
    return allKenyaLocations.find(location => location.id === id);
  };

  // Filter visible routes based on selected locations
  useEffect(() => {
    if (activeTab === "routes") {
      setVisibleRoutes(kenyaSupplyChainRoutes);
    } else {
      // Only show routes connected to the current location type
      const locationIds = visibleLocations.map(loc => loc.id);
      const filteredRoutes = kenyaSupplyChainRoutes.filter(
        route => locationIds.includes(route.from) || locationIds.includes(route.to)
      );
      setVisibleRoutes(filteredRoutes);
    }
  }, [activeTab, visibleLocations]);

  // Update visible locations based on selected tab
  useEffect(() => {
    switch (activeTab) {
      case "cities":
        setVisibleLocations(kenyaCities);
        break;
      case "distribution":
        setVisibleLocations(kenyaDistributionCenters);
        break;
      case "markets":
        setVisibleLocations(kenyaMarkets);
        break;
      case "airports":
        setVisibleLocations(kenyaAirports);
        break;
      case "ports":
        setVisibleLocations([...kenyaPorts, ...kenyaFarmCollectionCenters]);
        break;
      case "all":
        setVisibleLocations(allKenyaLocations);
        break;
      case "routes":
        setVisibleLocations(allKenyaLocations);
        break;
      default:
        setVisibleLocations(kenyaDistributionCenters);
    }
  }, [activeTab]);

  // Handle location selection
  const handleLocationSelect = (location: KenyaLocation) => {
    setSelectedLocation(location);
    setMapCenter([location.latitude, location.longitude]);
  };

  // Render polylines for supply chain routes
  const renderRoutes = () => {
    return visibleRoutes.map(route => {
      const fromLocation = findLocationById(route.from);
      const toLocation = findLocationById(route.to);
      
      if (!fromLocation || !toLocation) return null;
      
      const positions: [number, number][] = [
        [fromLocation.latitude, fromLocation.longitude],
        [toLocation.latitude, toLocation.longitude]
      ];
      
      return (
        <Polyline
          key={route.id}
          positions={positions}
          color={getRouteColor(route.type)}
          weight={getRouteWeight(route.volume)}
          dashArray={route.type === "rail" ? "10, 10" : undefined}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-base">{route.description || `${fromLocation.name} to ${toLocation.name}`}</h3>
              <p className="text-sm">Type: {route.type.toUpperCase()}</p>
              <p className="text-sm">Volume: {route.volume} units/day</p>
              <p className="text-sm">
                Distance: {calculateDistance(
                  fromLocation.latitude, 
                  fromLocation.longitude, 
                  toLocation.latitude, 
                  toLocation.longitude
                ).toFixed(1)} km
              </p>
            </div>
          </Popup>
        </Polyline>
      );
    });
  };

  return (
    <Card className="overflow-hidden">
      <Tabs defaultValue="distribution" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-4">Kenya Supply Chain Network</h2>
          <TabsList className="grid grid-cols-3 md:grid-cols-7 gap-2">
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="cities">Cities</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="airports">Airports</TabsTrigger>
            <TabsTrigger value="ports">Ports & Farms</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </div>

        <div className="grid lg:grid-cols-4">
          <div className="lg:col-span-3 h-[600px]">
            <MapContainer
              center={mapCenter}
              zoom={7}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {visibleLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={[location.latitude, location.longitude]}
                  icon={L.icon({
                    iconUrl: getMarkerIcon(location.type),
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                  })}
                  eventHandlers={{
                    click: () => handleLocationSelect(location),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-base">{location.name}</h3>
                      <p className="text-sm">Type: {location.type.replace("_", " ")}</p>
                      <p className="text-sm">Region: {location.region}</p>
                      {location.capacity && (
                        <p className="text-sm">Capacity: {location.capacity} units</p>
                      )}
                      {location.description && (
                        <p className="text-sm">{location.description}</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {renderRoutes()}
            </MapContainer>
          </div>

          <div className="p-4 space-y-4 lg:border-l border-t lg:border-t-0 max-h-[600px] overflow-y-auto">
            <div>
              <h3 className="font-semibold mb-2">Location Legend</h3>
              <div className="space-y-1">
                {Object.entries(locationColors).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm capitalize">{type.replace("_", " ")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Route Legend</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1" style={{ backgroundColor: getRouteColor("road") }} />
                  <span className="text-sm">Road Transport</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 border-t-2 border-dashed border-green-500" />
                  <span className="text-sm">Rail Transport (SGR)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1" style={{ backgroundColor: getRouteColor("air") }} />
                  <span className="text-sm">Air Transport</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1" style={{ backgroundColor: getRouteColor("sea") }} />
                  <span className="text-sm">Sea Transport</span>
                </div>
              </div>
            </div>

            {selectedLocation && (
              <div className="border p-3 rounded-md bg-muted/50">
                <h3 className="font-semibold">{selectedLocation.name}</h3>
                <p className="text-sm">Type: {selectedLocation.type.replace("_", " ")}</p>
                <p className="text-sm">Region: {selectedLocation.region}</p>
                {selectedLocation.capacity && (
                  <p className="text-sm">Capacity: {selectedLocation.capacity} units</p>
                )}
                {selectedLocation.description && (
                  <p className="text-sm mt-1">{selectedLocation.description}</p>
                )}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Optimize</Button>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Key Supply Chain Corridors</h3>
              <div className="space-y-1 text-sm">
                <p>• Northern Corridor: Mombasa - Nairobi - Kampala</p>
                <p>• LAPSSET Corridor: Lamu - South Sudan - Ethiopia</p>
                <p>• Central Corridor: Dar es Salaam - Great Lakes Region</p>
                <p>• Nairobi - Addis Ababa Corridor</p>
                <p>• Mombasa - Bujumbura Corridor</p>
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </Card>
  );
};
