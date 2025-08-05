
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Network, Plus, Save } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

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
  const [mapNodes, setMapNodes] = useState(nodes);
  const [mapRoutes, setMapRoutes] = useState(routes);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNode, setNewNode] = useState({
    name: '',
    type: 'customer',
    latitude: -1.2921,
    longitude: 36.8219,
    weight: 0
  });

  // Remove the mapRef since MapContainer doesn't support it directly
  const center: [number, number] = [-1.2921, 36.8219]; // Nairobi coordinates

  useEffect(() => {
    setMapNodes(nodes);
    setMapRoutes(routes);
  }, [nodes, routes]);

  // Map click handler component
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (onMapClick) {
          onMapClick(e.latlng.lat, e.latlng.lng);
        }
        setNewNode(prev => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng
        }));
      }
    });
    return null;
  };

  const handleAddNode = () => {
    const nodeId = `node-${Date.now()}`;
    const newNodeData: Node = {
      id: nodeId,
      name: newNode.name,
      type: newNode.type,
      latitude: newNode.latitude,
      longitude: newNode.longitude,
      weight: newNode.weight
    };
    
    setMapNodes(prev => [...prev, newNodeData]);
    
    if (onNodeClick) {
      onNodeClick(newNodeData);
    }
    
    setShowAddForm(false);
    setNewNode({
      name: '',
      type: 'customer',
      latitude: -1.2921,
      longitude: 36.8219,
      weight: 0
    });
  };

  // Create custom icons for different node types
  const getNodeIcon = (nodeType: string) => {
    const colors: Record<string, string> = {
      depot: '#ef4444',
      customer: '#3b82f6',
      warehouse: '#10b981',
      supplier: '#f59e0b',
      default: '#6b7280'
    };
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${colors[nodeType] || colors.default}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Network Map
          </div>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Node
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Node</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nodeName">Name</Label>
                  <Input
                    id="nodeName"
                    value={newNode.name}
                    onChange={(e) => setNewNode(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter node name"
                  />
                </div>
                <div>
                  <Label htmlFor="nodeType">Type</Label>
                  <select
                    id="nodeType"
                    value={newNode.type}
                    onChange={(e) => setNewNode(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="customer">Customer</option>
                    <option value="depot">Depot</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="supplier">Supplier</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={newNode.latitude}
                      onChange={(e) => setNewNode(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={newNode.longitude}
                      onChange={(e) => setNewNode(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="weight">Weight/Demand</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={newNode.weight}
                    onChange={(e) => setNewNode(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <Button onClick={handleAddNode} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Add Node
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Node Statistics */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{mapNodes.length} nodes</Badge>
            <Badge variant="outline">{mapRoutes.length} routes</Badge>
            {isOptimized && <Badge className="bg-green-100 text-green-800">✓ Optimized</Badge>}
          </div>

          {/* Interactive Leaflet Map */}
          <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
            <MapContainer
              center={center}
              zoom={10}
              style={{ height: '100%', width: '100%' }}
            >
              <MapClickHandler />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Render nodes */}
              {mapNodes.map((node) => (
                <Marker
                  key={node.id}
                  position={[node.latitude, node.longitude]}
                  icon={getNodeIcon(node.type)}
                  eventHandlers={{
                    click: () => onNodeClick && onNodeClick(node)
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <h3 className="font-semibold">{node.name}</h3>
                      <p>Type: {node.type}</p>
                      <p>Weight: {node.weight || 0}</p>
                      <p>Coords: {node.latitude.toFixed(4)}, {node.longitude.toFixed(4)}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Render routes */}
              {mapRoutes.map((route) => {
                const fromNode = mapNodes.find(n => n.id === route.from);
                const toNode = mapNodes.find(n => n.id === route.to);
                
                if (!fromNode || !toNode) return null;
                
                return (
                  <Polyline
                    key={route.id}
                    positions={[
                      [fromNode.latitude, fromNode.longitude],
                      [toNode.latitude, toNode.longitude]
                    ]}
                    pathOptions={{
                      color: route.isOptimized ? '#10b981' : '#3b82f6',
                      weight: 3,
                      opacity: 0.7
                    }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <h3 className="font-semibold">{route.label || `${route.from} → ${route.to}`}</h3>
                        <p>Volume: {route.volume || 0}</p>
                        <p>Cost: {route.cost || 0}</p>
                      </div>
                    </Popup>
                  </Polyline>
                );
              })}
            </MapContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span>Depot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span>Customer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span>Warehouse</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span>Supplier</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkMap;
export { NetworkMap };
