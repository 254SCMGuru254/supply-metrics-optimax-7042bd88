
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Network } from "lucide-react";

export interface Node {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  weight?: number;
  ownership?: string;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  volume?: number;
  cost?: number;
  ownership?: string;
  label?: string;
  isOptimized?: boolean;
}

export interface NetworkMapProps {
  nodes?: Node[];
  routes?: Route[];
  className?: string;
  onNodeClick?: (node: Node) => void;
  onRouteClick?: (route: Route) => void;
  onMapClick?: (lat: number, lng: number) => void;
  isOptimized?: boolean;
  highlightNodes?: string[];
  selectable?: boolean;
  onNodeSelect?: (nodes: string[]) => void;
  disruptionData?: any;
  resilienceMetrics?: any;
  airportNodes?: any[];
}

const NetworkMap: React.FC<NetworkMapProps> = ({ 
  nodes = [], 
  routes = [], 
  className = "",
  onNodeClick,
  onRouteClick,
  onMapClick,
  isOptimized,
  highlightNodes,
  selectable,
  onNodeSelect,
  disruptionData,
  resilienceMetrics,
  airportNodes
}) => {
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onMapClick) {
      // Mock coordinates for demo - in real implementation would convert pixel coordinates
      const lat = -1.2921 + (Math.random() - 0.5) * 2;
      const lng = 36.8219 + (Math.random() - 0.5) * 2;
      onMapClick(lat, lng);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Network Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="relative bg-gray-50 rounded-lg p-4 min-h-[300px] flex items-center justify-center cursor-pointer"
          onClick={handleMapClick}
        >
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Interactive network map will be displayed here</p>
            <p className="text-sm text-gray-400 mt-1">
              {nodes.length} nodes, {routes.length} routes
            </p>
            {isOptimized && (
              <p className="text-sm text-green-600 mt-2">✓ Network Optimized</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkMap;
export { NetworkMap };
