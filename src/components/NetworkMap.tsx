
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Factory, Store, Warehouse, Truck } from "lucide-react";

export type NodeType = "warehouse" | "distribution" | "supplier" | "customer" | "factory";

export interface Node {
  id: string;
  type: NodeType;
  name: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  demand?: number;
  cost?: number;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  volume?: number;
  cost?: number;
  distance?: number;
  isOptimized?: boolean;
  vehicleId?: string;
  vehicleName?: string;
}

interface NetworkMapProps {
  nodes?: Node[];
  routes?: Route[];
  onNodeClick?: (node: Node) => void;
  onMapClick?: (lat: number, lng: number) => void;
  isOptimized?: boolean;
  showLegend?: boolean;
}

export const NetworkMap = ({
  nodes = [],
  routes = [],
  onNodeClick,
  onMapClick,
  isOptimized = false,
  showLegend = true,
}: NetworkMapProps) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Kenya coordinates for default view
  const defaultCenter = { lat: -1.2921, lng: 36.8219 }; // Nairobi
  const bounds = {
    north: 5.0,
    south: -5.0,
    east: 42.0,
    west: 33.0
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case "warehouse": return <Warehouse className="h-4 w-4" />;
      case "distribution": return <Store className="h-4 w-4" />;
      case "supplier": return <Factory className="h-4 w-4" />;
      case "customer": return <MapPin className="h-4 w-4" />;
      case "factory": return <Factory className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case "warehouse": return "bg-blue-500";
      case "distribution": return "bg-green-500";
      case "supplier": return "bg-purple-500";
      case "customer": return "bg-orange-500";
      case "factory": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onMapClick) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert pixel coordinates to lat/lng (simplified)
    const lat = bounds.north - (y / rect.height) * (bounds.north - bounds.south);
    const lng = bounds.west + (x / rect.width) * (bounds.east - bounds.west);
    
    onMapClick(lat, lng);
  };

  const normalizePosition = (lat: number, lng: number) => {
    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  return (
    <div className="space-y-4">
      <Card className="h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Network Map</span>
            {isOptimized && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Optimized
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] relative">
          <div 
            className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden cursor-crosshair"
            onClick={handleMapClick}
          >
            {/* Kenya outline background */}
            <div className="absolute inset-0 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M30,20 L70,20 L80,40 L75,60 L65,80 L35,80 L25,60 L20,40 Z"
                  fill="currentColor"
                  stroke="currentColor"
                />
              </svg>
            </div>

            {/* Routes */}
            {routes.map((route) => {
              const fromNode = nodes.find(n => n.id === route.from);
              const toNode = nodes.find(n => n.id === route.to);
              
              if (!fromNode || !toNode) return null;
              
              const fromPos = normalizePosition(fromNode.latitude, fromNode.longitude);
              const toPos = normalizePosition(toNode.latitude, toNode.longitude);
              
              return (
                <svg key={route.id} className="absolute inset-0 w-full h-full pointer-events-none">
                  <line
                    x1={`${fromPos.x}%`}
                    y1={`${fromPos.y}%`}
                    x2={`${toPos.x}%`}
                    y2={`${toPos.y}%`}
                    stroke={route.isOptimized ? "#10b981" : "#6b7280"}
                    strokeWidth={route.volume ? Math.max(1, (route.volume / 100)) : 2}
                    strokeDasharray={route.isOptimized ? "none" : "5,5"}
                    opacity={0.7}
                  />
                  {route.volume && (
                    <text
                      x={`${(fromPos.x + toPos.x) / 2}%`}
                      y={`${(fromPos.y + toPos.y) / 2}%`}
                      fontSize="10"
                      fill="#374151"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="pointer-events-none"
                    >
                      {route.volume}
                    </text>
                  )}
                </svg>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = normalizePosition(node.latitude, node.longitude);
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode === node.id;
              
              return (
                <div
                  key={node.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                    isSelected ? 'scale-125 z-20' : isHovered ? 'scale-110 z-10' : 'z-0'
                  }`}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                    onNodeClick?.(node);
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className={`w-8 h-8 rounded-full ${getNodeColor(node.type)} flex items-center justify-center text-white shadow-lg ${
                    isSelected ? 'ring-4 ring-blue-300' : ''
                  }`}>
                    {getNodeIcon(node.type)}
                  </div>
                  
                  {/* Node label */}
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap border">
                    <div className="font-medium">{node.name}</div>
                    {node.capacity && (
                      <div className="text-gray-500">Cap: {node.capacity}</div>
                    )}
                    {node.demand && (
                      <div className="text-gray-500">Demand: {node.demand}</div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Instructions overlay */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-lg font-medium">Click to add network nodes</p>
                  <p className="text-sm">Start building your supply chain network</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      {showLegend && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Network Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <Warehouse className="h-2 w-2" />
                </div>
                <span>Warehouse</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <Store className="h-2 w-2" />
                </div>
                <span>Distribution</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  <Factory className="h-2 w-2" />
                </div>
                <span>Supplier</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white">
                  <MapPin className="h-2 w-2" />
                </div>
                <span>Customer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white">
                  <Factory className="h-2 w-2" />
                </div>
                <span>Factory</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Node Details */}
      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              {getNodeIcon(selectedNode.type)}
              {selectedNode.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Type:</span> {selectedNode.type}
              </div>
              <div>
                <span className="font-medium">Location:</span> 
                {selectedNode.latitude.toFixed(4)}, {selectedNode.longitude.toFixed(4)}
              </div>
              {selectedNode.capacity && (
                <div>
                  <span className="font-medium">Capacity:</span> {selectedNode.capacity}
                </div>
              )}
              {selectedNode.demand && (
                <div>
                  <span className="font-medium">Demand:</span> {selectedNode.demand}
                </div>
              )}
              {selectedNode.cost && (
                <div>
                  <span className="font-medium">Cost:</span> ${selectedNode.cost}
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => setSelectedNode(null)}
            >
              Close Details
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
