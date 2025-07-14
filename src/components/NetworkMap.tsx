
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Network } from "lucide-react";

interface NetworkMapProps {
  nodes?: any[];
  routes?: any[];
  className?: string;
  onNodeClick?: (node: any) => void;
  onRouteClick?: (route: any) => void;
}

const NetworkMap: React.FC<NetworkMapProps> = ({ 
  nodes = [], 
  routes = [], 
  className = "",
  onNodeClick,
  onRouteClick 
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Network Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gray-50 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Interactive network map will be displayed here</p>
            <p className="text-sm text-gray-400 mt-1">
              {nodes.length} nodes, {routes.length} routes
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkMap;
