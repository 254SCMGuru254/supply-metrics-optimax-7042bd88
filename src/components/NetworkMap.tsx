
import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { NodeMarker } from "./map/NodeMarker";
import { RoutePolyline } from "./map/RoutePolyline";
import { MapController } from "./map/MapController";
import { MapEventHandler } from "./map/MapEventHandler";
import { Node, Route } from "./map/MapTypes";
import L from "leaflet";

export { type Node, type Route };

export interface NetworkMapProps {
  nodes: Node[];
  routes: Route[];
  onNodeClick?: (node: Node) => void;
  onMapClick?: (lat: number, lng: number) => void;
  isOptimized?: boolean;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({
  nodes,
  routes,
  onNodeClick,
  onMapClick,
  isOptimized = false,
}) => {
  const mapRef = React.useRef<L.Map | null>(null);

  const handleMapReady = (map: L.Map) => {
    mapRef.current = map;
    
    // Default view if no nodes
    if (nodes.length === 0) {
      map.setView([39.8283, -98.5795], 4); // Center on US
    } else {
      // Calculate bounds from nodes
      const latitudes = nodes.map(node => node.latitude);
      const longitudes = nodes.map(node => node.longitude);
      
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);
      
      // Add padding
      const padding = 0.5; // degrees
      
      if (minLat !== maxLat || minLng !== maxLng) {
        map.fitBounds([
          [minLat - padding, minLng - padding],
          [maxLat + padding, maxLng + padding]
        ]);
      } else {
        // Single point
        map.setView([minLat, minLng], 10);
      }
    }
  };

  return (
    <div className="w-full h-[600px] rounded-md overflow-hidden">
      <MapContainer
        className="h-full w-full"
        zoom={4}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapController onMapReady={handleMapReady} />
        {onMapClick && <MapEventHandler onMapClick={onMapClick} />}
        
        {nodes.map(node => (
          <NodeMarker 
            key={node.id} 
            node={node} 
            onNodeClick={onNodeClick} 
          />
        ))}
        
        {routes.map(route => {
          const fromNode = nodes.find(n => n.id === route.from);
          const toNode = nodes.find(n => n.id === route.to);
          
          if (fromNode && toNode) {
            return (
              <RoutePolyline
                key={route.id}
                route={route}
                fromNode={fromNode}
                toNode={toNode}
                isOptimized={isOptimized || !!route.isOptimized}
              />
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};
