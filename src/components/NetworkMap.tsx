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

// Icon configurations for different node types
const getNodeIcon = (type: string) => {
  const iconColors = {
    depot: '#ef4444',    // red
    customer: '#3b82f6', // blue
    warehouse: '#10b981', // green
    supplier: '#f59e0b',  // yellow
    default: '#6b7280'   // gray
  };

  const color = iconColors[type as keyof typeof iconColors] || iconColors.default;
  
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Map click handler component
const MapClickHandler = ({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
};

const NetworkMap = ({
  nodes = [],
  routes = [],
  className = "",
  onNodeClick,
  onRouteClick,
  onMapClick,
  isOptimized = false,
  highlightNodes = [],
  selectable = false,
  onNodeSelect,
  disruptionData,
  resilienceMetrics,
  airportNodes = []
}: NetworkMapProps) => {
  const [localNodes, setLocalNodes] = useState<Node[]>(nodes);
  const [localRoutes, setLocalRoutes] = useState<Route[]>(routes);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [newNodeData, setNewNodeData] = useState({
    name: '',
    type: 'customer',
    latitude: 0,
    longitude: 0,
    weight: 0
  });
  const [newRouteData, setNewRouteData] = useState({
    from: '',
    to: '',
    volume: 0,
    cost: 0
  });

  useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes]);

  useEffect(() => {
    setLocalRoutes(routes);
  }, [routes]);

  // Calculate map center
  const center: [number, number] = localNodes.length > 0 
    ? [
        localNodes.reduce((sum, node) => sum + node.latitude, 0) / localNodes.length,
        localNodes.reduce((sum, node) => sum + node.longitude, 0) / localNodes.length
      ]
    : [-1.2921, 36.8219]; // Default to Nairobi

  // Convert data for map rendering
  const mapNodes = [...localNodes, ...airportNodes].map(node => ({
    id: node.id,
    name: node.name,
    type: node.type,
    latitude: node.latitude,
    longitude: node.longitude,
    weight: node.weight || 0
  }));

  const mapRoutes = localRoutes.map(route => ({
    id: route.id,
    from: route.from,
    to: route.to,
    volume: route.volume || 0,
    cost: route.cost || 0,
    label: route.label || `${route.from} → ${route.to}`,
    isOptimized: route.isOptimized || isOptimized
  }));

  const handleMapClick = (lat: number, lng: number) => {
    setNewNodeData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    if (onMapClick) {
      onMapClick(lat, lng);
    }
  };

  const handleAddNode = () => {
    if (newNodeData.name && newNodeData.latitude && newNodeData.longitude) {
      const newNode: Node = {
        id: `node-${Date.now()}`,
        name: newNodeData.name,
        type: newNodeData.type,
        latitude: newNodeData.latitude,
        longitude: newNodeData.longitude,
        weight: newNodeData.weight
      };
      
      setLocalNodes(prev => [...prev, newNode]);
      setNewNodeData({ name: '', type: 'customer', latitude: 0, longitude: 0, weight: 0 });
      setShowNodeForm(false);
    }
  };

  const handleAddRoute = () => {
    if (newRouteData.from && newRouteData.to) {
      const newRoute: Route = {
        id: `route-${Date.now()}`,
        from: newRouteData.from,
        to: newRouteData.to,
        volume: newRouteData.volume,
        cost: newRouteData.cost
      };
      
      setLocalRoutes(prev => [...prev, newRoute]);
      setNewRouteData({ from: '', to: '', volume: 0, cost: 0 });
      setShowRouteForm(false);
    }
  };

  const getNodeName = (nodeId: string) => {
    const node = mapNodes.find(n => n.id === nodeId);
    return node ? node.name : nodeId;
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header with controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Supply Network Visualization</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <Dialog open={showNodeForm} onOpenChange={setShowNodeForm}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Node
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Node</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={newNodeData.name}
                        onChange={(e) => setNewNodeData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter node name"
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <select
                        value={newNodeData.type}
                        onChange={(e) => setNewNodeData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full p-2 border rounded"
                      >
                        <option value="customer">Customer</option>
                        <option value="depot">Depot</option>
                        <option value="warehouse">Warehouse</option>
                        <option value="supplier">Supplier</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Latitude</Label>
                        <Input
                          type="number"
                          step="0.0001"
                          value={newNodeData.latitude}
                          onChange={(e) => setNewNodeData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                          placeholder="Latitude"
                        />
                      </div>
                      <div>
                        <Label>Longitude</Label>
                        <Input
                          type="number"
                          step="0.0001"
                          value={newNodeData.longitude}
                          onChange={(e) => setNewNodeData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                          placeholder="Longitude"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Weight/Demand</Label>
                      <Input
                        type="number"
                        value={newNodeData.weight}
                        onChange={(e) => setNewNodeData(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                        placeholder="Weight or demand"
                      />
                    </div>
                    <Button onClick={handleAddNode} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Add Node
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showRouteForm} onOpenChange={setShowRouteForm}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Route
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Route</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>From Node</Label>
                      <select
                        value={newRouteData.from}
                        onChange={(e) => setNewRouteData(prev => ({ ...prev, from: e.target.value }))}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select origin node</option>
                        {mapNodes.map(node => (
                          <option key={node.id} value={node.id}>{node.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>To Node</Label>
                      <select
                        value={newRouteData.to}
                        onChange={(e) => setNewRouteData(prev => ({ ...prev, to: e.target.value }))}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select destination node</option>
                        {mapNodes.map(node => (
                          <option key={node.id} value={node.id}>{node.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Volume</Label>
                        <Input
                          type="number"
                          value={newRouteData.volume}
                          onChange={(e) => setNewRouteData(prev => ({ ...prev, volume: parseInt(e.target.value) }))}
                          placeholder="Volume"
                        />
                      </div>
                      <div>
                        <Label>Cost</Label>
                        <Input
                          type="number"
                          value={newRouteData.cost}
                          onChange={(e) => setNewRouteData(prev => ({ ...prev, cost: parseFloat(e.target.value) }))}
                          placeholder="Cost"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddRoute} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Add Route
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              {isOptimized && <Badge className="bg-green-100 text-green-800">✓ Optimized</Badge>}
            </div>
          </div>

          {/* Interactive Leaflet Map */}
          <div className="relative h-96 bg-muted rounded-lg overflow-hidden z-0">
            <MapContainer
              center={center}
              zoom={10}
              style={{ height: '100%', width: '100%' }}
            >
              <MapClickHandler onMapClick={handleMapClick} />
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

          {/* Data Tables with proper z-index */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
            {/* Nodes Table */}
            <Card className="relative z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Supply Network Nodes ({mapNodes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Location</th>
                        <th className="text-left p-2">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mapNodes.map((node) => (
                        <tr key={node.id} className="border-b hover:bg-muted/30">
                          <td className="p-2 font-medium">{node.name}</td>
                          <td className="p-2">
                            <Badge variant="secondary">{node.type}</Badge>
                          </td>
                          <td className="p-2 text-xs text-muted-foreground">
                            {node.latitude.toFixed(4)}, {node.longitude.toFixed(4)}
                          </td>
                          <td className="p-2">{node.weight || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Routes Table */}
            <Card className="relative z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Supply Routes ({mapRoutes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-2">From</th>
                        <th className="text-left p-2">To</th>
                        <th className="text-left p-2">Volume</th>
                        <th className="text-left p-2">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mapRoutes.map((route) => (
                        <tr key={route.id} className="border-b hover:bg-muted/30">
                          <td className="p-2 font-medium">{getNodeName(route.from)}</td>
                          <td className="p-2 font-medium">{getNodeName(route.to)}</td>
                          <td className="p-2">{route.volume || '-'}</td>
                          <td className="p-2">{route.cost ? `$${route.cost}` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkMap;
export { NetworkMap };