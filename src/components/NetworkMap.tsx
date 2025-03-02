
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useToast } from "@/components/ui/use-toast";

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for different facility types
const createCustomIcon = (color: string): L.Icon => 
  new L.Icon({
    iconUrl: `data:image/svg+xml,%3Csvg width='25' height='41' viewBox='0 0 25 41' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 12.5 41 12.5 41C12.5 41 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0Z' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E`,
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
  });

const warehouseIcon = createCustomIcon("#ef4444"); // red
const distributionIcon = createCustomIcon("#22c55e"); // green
const retailIcon = createCustomIcon("#3b82f6"); // blue

export type Node = {
  id: string;
  type: "warehouse" | "distribution" | "retail";
  name: string;
  latitude: number;
  longitude: number;
  capacity?: number;
};

export type Route = {
  id: string;
  from: string;
  to: string;
  volume: number;
  isOptimized?: boolean;
};

type NetworkMapProps = {
  nodes: Node[];
  routes: Route[];
  onNodeClick?: (node: Node) => void;
  onMapClick?: (lat: number, lng: number) => void;
  isOptimized?: boolean;
};

export const NetworkMap = ({
  nodes,
  routes,
  onNodeClick,
  onMapClick,
  isOptimized = false,
}: NetworkMapProps) => {
  const { toast } = useToast();
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (!map || nodes.length === 0) return;

    const bounds = L.latLngBounds(nodes.map(node => [node.latitude, node.longitude]));
    if (bounds.isValid()) {
      map.fitBounds(bounds);
    }
  }, [map, nodes]);

  const getNodeIcon = (type: Node["type"]): L.Icon => {
    switch (type) {
      case "warehouse":
        return warehouseIcon;
      case "distribution":
        return distributionIcon;
      case "retail":
        return retailIcon;
      default:
        return warehouseIcon;
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (onMapClick) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  };

  return (
    <div style={{ height: "600px", width: "100%" }} className="rounded-lg">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        ref={setMap}
        whenReady={(mapInstance) => {
          // Setup click handler for the map
          mapInstance.target.on('click', handleMapClick);
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Render routes */}
        {routes.map((route) => {
          const fromNode = nodes.find((n) => n.id === route.from);
          const toNode = nodes.find((n) => n.id === route.to);
          
          if (!fromNode || !toNode) return null;

          return (
            <Polyline
              key={route.id}
              positions={[
                [fromNode.latitude, fromNode.longitude] as L.LatLngTuple,
                [toNode.latitude, toNode.longitude] as L.LatLngTuple,
              ]}
              pathOptions={{
                color: isOptimized ? "#22c55e" : "#64748b",
                weight: Math.max(1, Math.min(8, route.volume / 100)),
                dashArray: route.isOptimized ? undefined : "5, 10",
              }}
            />
          );
        })}

        {/* Render nodes */}
        {nodes.map((node) => (
          <Marker
            key={node.id}
            position={[node.latitude, node.longitude]}
            icon={getNodeIcon(node.type)}
            eventHandlers={{
              click: () => onNodeClick?.(node),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{node.name}</h3>
                <p className="text-sm text-muted-foreground">Type: {node.type}</p>
                {node.capacity && (
                  <p className="text-sm text-muted-foreground">
                    Capacity: {node.capacity.toLocaleString()}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
