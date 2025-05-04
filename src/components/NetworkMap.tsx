
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { NodeMarker } from "./map/NodeMarker";
import { RoutePolyline } from "./map/RoutePolyline";
import { MapController } from "./map/MapController";
import { MapEventHandler } from "./map/MapEventHandler";
import { Node, Route } from "./map/MapTypes";
import { Database } from "@/types/network";
import L from "leaflet";

export { type Node, type Route };

export interface NetworkMapProps {
  nodes?: Node[];
  routes?: Route[];
  network?: Database; // Support for network object
  onNodeClick?: (node: Node) => void;
  onMapClick?: (lat: number, lng: number) => void;
  isOptimized?: boolean;
  highlightNodes?: string[]; // Array of node IDs to highlight
}

// Helper to get map bounds based on nodes
const getMapBounds = (nodes: Node[]): L.LatLngBoundsExpression | undefined => {
  if (!nodes || nodes.length === 0) return undefined;
  
  const latLngs = nodes.map(node => [node.latitude, node.longitude] as [number, number]);
  return latLngs;
};

export const NetworkMap: React.FC<NetworkMapProps> = ({
  nodes = [],
  routes = [],
  network,
  onNodeClick,
  onMapClick,
  isOptimized = false,
  highlightNodes = []
}) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [networkNodes, setNetworkNodes] = useState<Node[]>([]);
  const [networkRoutes, setNetworkRoutes] = useState<Route[]>([]);
  
  // Handle network prop if provided
  useEffect(() => {
    if (network) {
      setNetworkNodes(network.nodes || []);
      setNetworkRoutes(network.routes || []);
    } else {
      setNetworkNodes(nodes);
      setNetworkRoutes(routes);
    }
  }, [network, nodes, routes]);
  
  // Create a lookup for nodes by ID for route rendering
  const nodesById = networkNodes.reduce<Record<string, Node>>((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});
  
  // Determine map center and zoom
  const defaultCenter: [number, number] = [0, 0];
  const bounds = getMapBounds(networkNodes);
  
  const handleMapReady = (mapInstance: L.Map) => {
    setMap(mapInstance);
    
    // Fit bounds if we have nodes
    if (bounds && bounds.length > 0) {
      mapInstance.fitBounds(bounds);
    }
  };
  
  const handleMapClick = (lat: number, lng: number) => {
    if (onMapClick) {
      onMapClick(lat, lng);
    }
  };
  
  return (
    <MapContainer
      center={defaultCenter}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
      whenCreated={handleMapReady}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController onMapReady={handleMapReady} />
      
      {onMapClick && <MapEventHandler onMapClick={handleMapClick} />}
      
      {/* Render routes first so nodes appear on top */}
      {networkRoutes.map(route => {
        const fromNode = nodesById[route.from];
        const toNode = nodesById[route.to];
        
        if (!fromNode || !toNode) return null;
        
        return (
          <RoutePolyline
            key={route.id}
            route={route}
            fromNode={fromNode}
            toNode={toNode}
            isOptimized={isOptimized || route.isOptimized}
          />
        );
      })}
      
      {/* Render nodes */}
      {networkNodes.map(node => (
        <NodeMarker
          key={node.id}
          node={{
            ...node,
            isOptimized: isOptimized || node.isOptimized || highlightNodes.includes(node.id)
          }}
          onNodeClick={onNodeClick}
        />
      ))}
    </MapContainer>
  );
};

export default NetworkMap;
