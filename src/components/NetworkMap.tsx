
import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, AttributionControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useToast } from "@/components/ui/use-toast";
import { Node, Route, NetworkMapProps } from "./map/MapTypes";
import { MapController } from "./map/MapController";
import { MapEventHandler } from "./map/MapEventHandler";
import { NodeMarker } from "./map/NodeMarker";
import { RoutePolyline } from "./map/RoutePolyline";

export type { Node, Route };

export const NetworkMap = ({
  nodes,
  routes,
  onNodeClick,
  onMapClick,
  isOptimized = false,
}: NetworkMapProps) => {
  const { toast } = useToast();
  const [map, setMap] = useState<L.Map | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Function to set the map reference
  const onMapReady = (map: L.Map) => {
    setMap(map);
    mapRef.current = map;
  };

  // Fit bounds to nodes when they change
  useEffect(() => {
    if (map && nodes.length > 0) {
      const bounds = L.latLngBounds(nodes.map(node => [node.latitude, node.longitude]));
      if (bounds.isValid()) {
        map.fitBounds(bounds);
      }
    }
  }, [map, nodes]);

  // Set default position for the map
  const defaultPosition: [number, number] = [40, -95]; // Center of US
  const defaultZoom = 4;
  
  // Get initial position for the map
  const initialPosition = nodes.length > 0 
    ? [nodes[0].latitude, nodes[0].longitude] as [number, number]
    : defaultPosition;

  return (
    <div style={{ height: "600px", width: "100%" }} className="rounded-lg">
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={initialPosition as any}
        zoom={defaultZoom as any}
        attributionControl={false as any}
      >
        {/* Add MapController for map reference */}
        <MapController onMapReady={onMapReady} />
        
        {/* Add map event handler component */}
        {onMapClick && <MapEventHandler onMapClick={onMapClick} />}
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <AttributionControl position="bottomright" />
        
        {/* Render routes */}
        {routes.map((route) => {
          const fromNode = nodes.find((n) => n.id === route.from);
          const toNode = nodes.find((n) => n.id === route.to);
          
          if (!fromNode || !toNode) return null;

          return (
            <RoutePolyline
              key={route.id}
              route={route}
              fromNode={fromNode}
              toNode={toNode}
              isOptimized={isOptimized}
            />
          );
        })}

        {/* Render nodes */}
        {nodes.map((node) => (
          <NodeMarker
            key={node.id}
            node={node}
            onNodeClick={onNodeClick}
          />
        ))}
      </MapContainer>
    </div>
  );
};
