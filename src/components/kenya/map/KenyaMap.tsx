
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getMarkerIcon, getRouteColor, getRouteWeight } from "../utils/mapUtils";
import { KenyaLocation, SupplyChainRoute } from "../types/kenyaTypes";

interface KenyaMapProps {
  visibleLocations: KenyaLocation[];
  visibleRoutes: SupplyChainRoute[];
  onLocationSelect: (location: KenyaLocation) => void;
}

export const KenyaMap = ({ 
  visibleLocations, 
  visibleRoutes, 
  onLocationSelect 
}: KenyaMapProps) => {
  return (
    <div className="lg:col-span-3 h-[600px]">
      <MapContainer
        center={[0.0236, 37.9062]}
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
              click: () => onLocationSelect(location),
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
        
        {visibleRoutes.map((route) => {
          const fromLocation = visibleLocations.find(loc => loc.id === route.from);
          const toLocation = visibleLocations.find(loc => loc.id === route.to);
          
          if (fromLocation && toLocation) {
            return (
              <Polyline
                key={route.id}
                positions={[
                  [fromLocation.latitude, fromLocation.longitude],
                  [toLocation.latitude, toLocation.longitude]
                ]}
                color={getRouteColor(route.type)}
                weight={getRouteWeight(route.volume)}
                dashArray={route.type === "rail" ? "10, 10" : undefined}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-base">
                      {route.description || `${fromLocation.name} to ${toLocation.name}`}
                    </h3>
                    <p className="text-sm">Type: {route.type.toUpperCase()}</p>
                    <p className="text-sm">Volume: {route.volume} units/day</p>
                  </div>
                </Popup>
              </Polyline>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};
