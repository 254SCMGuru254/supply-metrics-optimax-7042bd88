
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KenyaMap } from "./map/KenyaMap";
import { MapSidebar } from "./sidebar/MapSidebar";
import { 
  allKenyaLocations, 
  kenyaCities, 
  kenyaDistributionCenters, 
  kenyaMarkets,
  kenyaAirports, 
  kenyaPorts, 
  kenyaFarmCollectionCenters,
} from "@/data/kenya-locations";
import { kenyaSupplyChainRoutes } from "@/data/kenya-routes";
import { KenyaLocation, SupplyChainRoute } from "./types/kenyaTypes";

export const KenyaSupplyChainMap = () => {
  const [visibleLocations, setVisibleLocations] = useState<KenyaLocation[]>(kenyaDistributionCenters);
  const [visibleRoutes, setVisibleRoutes] = useState<SupplyChainRoute[]>(kenyaSupplyChainRoutes);
  const [selectedLocation, setSelectedLocation] = useState<KenyaLocation | null>(null);
  const [activeTab, setActiveTab] = useState("distribution");

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
      case "routes":
        setVisibleLocations(allKenyaLocations);
        break;
      default:
        setVisibleLocations(kenyaDistributionCenters);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "routes") {
      setVisibleRoutes(kenyaSupplyChainRoutes);
    } else {
      const locationIds = visibleLocations.map(loc => loc.id);
      const filteredRoutes = kenyaSupplyChainRoutes.filter(
        route => locationIds.includes(route.from) || locationIds.includes(route.to)
      );
      setVisibleRoutes(filteredRoutes);
    }
  }, [activeTab, visibleLocations]);

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
          <KenyaMap
            visibleLocations={visibleLocations}
            visibleRoutes={visibleRoutes}
            onLocationSelect={setSelectedLocation}
          />
          <MapSidebar selectedLocation={selectedLocation} />
        </div>
      </Tabs>
    </Card>
  );
};
