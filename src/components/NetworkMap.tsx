
import { useState, useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Warehouse, Factory, Store, Truck, MapPin, Edit, Save, X } from "lucide-react";
import type { Node, Route, NodeType, OwnershipType } from "@/components/map/MapTypes";

export type { Node, Route, NodeType, OwnershipType };

export interface NetworkMapProps {
  nodes: Node[];
  routes: Route[];
  onNodeClick?: (node: Node) => void;
  onMapClick?: (lat: number, lng: number) => void;
  isOptimized?: boolean;
  highlightNodes?: string[];
  selectable?: boolean;
  onNodeSelect?: (nodes: string[]) => void;
  onNodesChange?: (nodes: Node[]) => void;
  onRoutesChange?: (routes: Route[]) => void;
  disruptionData?: any;
  resilienceMetrics?: any;
  airportNodes?: any[];
  showLegend?: boolean;
}

// Custom hook to get map instance
const MapClickHandler = ({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!onMapClick) return;
    
    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };
    
    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);
  
  return null;
};

// Node editing dialog component
const NodeEditDialog = ({ 
  node, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  node: Node | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedNode: Node) => void;
}) => {
  const [editedNode, setEditedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (node) {
      setEditedNode({ ...node });
    }
  }, [node]);

  if (!editedNode) return null;

  const handleSave = () => {
    onSave(editedNode);
    onClose();
  };

  const nodeTypeOptions: { value: NodeType; label: string; icon: React.ReactNode }[] = [
    { value: 'warehouse', label: 'Warehouse', icon: <Warehouse className="h-4 w-4" /> },
    { value: 'distribution', label: 'Distribution Center', icon: <Store className="h-4 w-4" /> },
    { value: 'supplier', label: 'Supplier', icon: <Factory className="h-4 w-4" /> },
    { value: 'customer', label: 'Customer', icon: <MapPin className="h-4 w-4" /> },
    { value: 'factory', label: 'Factory', icon: <Factory className="h-4 w-4" /> },
    { value: 'retail', label: 'Retail Store', icon: <Store className="h-4 w-4" /> },
  ];

  const ownershipOptions: { value: OwnershipType; label: string; description: string }[] = [
    { value: 'owned', label: 'Owned', description: 'Company-owned asset' },
    { value: 'hired', label: 'Hired/Leased', description: 'Leased or rented asset' },
    { value: 'outsourced', label: 'Outsourced', description: 'Third-party managed' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Node: {editedNode.name}
          </DialogTitle>
          <DialogDescription>
            Modify node properties, type, and ownership details
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="ownership">Ownership</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editedNode.name}
                  onChange={(e) => setEditedNode({ ...editedNode, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="type">Node Type</Label>
                <Select
                  value={editedNode.type}
                  onValueChange={(value: NodeType) => setEditedNode({ ...editedNode, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nodeTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {option.icon}
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={editedNode.capacity || ''}
                  onChange={(e) => setEditedNode({ ...editedNode, capacity: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div>
                <Label htmlFor="cost">Monthly Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  value={editedNode.cost || ''}
                  onChange={(e) => setEditedNode({ ...editedNode, cost: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editedNode.notes || ''}
                onChange={(e) => setEditedNode({ ...editedNode, notes: e.target.value })}
                placeholder="Additional notes about this node..."
              />
            </div>
          </TabsContent>
          
          <TabsContent value="ownership" className="space-y-4">
            <div>
              <Label htmlFor="ownership">Ownership Type</Label>
              <Select
                value={editedNode.ownership}
                onValueChange={(value: OwnershipType) => setEditedNode({ ...editedNode, ownership: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ownershipOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  value={editedNode.latitude}
                  onChange={(e) => setEditedNode({ ...editedNode, latitude: parseFloat(e.target.value) })}
                />
              </div>
              
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  value={editedNode.longitude}
                  onChange={(e) => setEditedNode({ ...editedNode, longitude: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const NetworkMap: React.FC<NetworkMapProps> = ({
  nodes,
  routes = [],
  onNodeClick,
  onMapClick,
  isOptimized = false,
  highlightNodes = [],
  selectable = false,
  onNodeSelect,
  onNodesChange,
  onRoutesChange,
  disruptionData,
  resilienceMetrics,
  airportNodes = [],
  showLegend = true
}) => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Default center - Kenya coordinates
  const defaultCenter: [number, number] = [-1.286389, 36.817223];
  const defaultZoom = 7;

  // Calculate map center based on nodes
  const mapCenter = useMemo(() => {
    if (nodes.length === 0) return defaultCenter;
    
    const validNodes = nodes.filter(node => 
      typeof node.latitude === 'number' && 
      typeof node.longitude === 'number' &&
      !isNaN(node.latitude) && 
      !isNaN(node.longitude)
    );
    
    if (validNodes.length === 0) return defaultCenter;
    
    const avgLat = validNodes.reduce((sum, node) => sum + node.latitude, 0) / validNodes.length;
    const avgLng = validNodes.reduce((sum, node) => sum + node.longitude, 0) / validNodes.length;
    
    return [avgLat, avgLng] as [number, number];
  }, [nodes]);

  // Icon creation functions
  const createIcon = (type: NodeType, ownership: OwnershipType = 'owned', isHighlighted = false) => {
    const colors = {
      owned: '#10B981',
      hired: '#F59E0B', 
      outsourced: '#8B5CF6',
      proposed: '#EF4444'
    };
    
    const color = colors[ownership] || colors.owned;
    const size = isHighlighted ? 40 : 30;
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${isHighlighted ? '16px' : '12px'};
        ">
          ${getNodeSymbol(type)}
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  };

  const getNodeSymbol = (type: NodeType): string => {
    const symbols = {
      warehouse: 'W',
      factory: 'F',
      distribution: 'D',
      supplier: 'S',
      customer: 'C',
      retail: 'R',
      facility: 'F',
      demand: 'D'
    };
    return symbols[type] || 'N';
  };

  // Handle node selection
  const handleNodeClick = (node: Node) => {
    if (selectable) {
      const newSelection = selectedNodes.includes(node.id)
        ? selectedNodes.filter(id => id !== node.id)
        : [...selectedNodes, node.id];
      
      setSelectedNodes(newSelection);
      onNodeSelect?.(newSelection);
    }
    
    onNodeClick?.(node);
  };

  const handleNodeEdit = (node: Node) => {
    setEditingNode(node);
    setIsEditDialogOpen(true);
  };

  const handleNodeSave = (updatedNode: Node) => {
    if (onNodesChange) {
      const updatedNodes = nodes.map(n => n.id === updatedNode.id ? updatedNode : n);
      onNodesChange(updatedNodes);
    }
    setIsEditDialogOpen(false);
    setEditingNode(null);
  };

  // Route line colors
  const getRouteColor = (route: Route) => {
    if (route.ownership === 'proposed') return '#EF4444';
    if (isOptimized) return '#10B981';
    return '#3B82F6';
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
        
        {/* Render routes */}
        {routes.map((route) => {
          const fromNode = nodes.find(n => n.id === route.from);
          const toNode = nodes.find(n => n.id === route.to);
          
          if (!fromNode || !toNode) return null;
          
          return (
            <Polyline
              key={route.id}
              positions={[
                [fromNode.latitude, fromNode.longitude],
                [toNode.latitude, toNode.longitude]
              ]}
              color={getRouteColor(route)}
              weight={3}
              opacity={0.7}
            >
              <Popup>
                <div>
                  <strong>{route.label || `Route ${route.id}`}</strong>
                  <br />
                  From: {fromNode.name}
                  <br />
                  To: {toNode.name}
                </div>
              </Popup>
            </Polyline>
          );
        })}
        
        {/* Render nodes */}
        {nodes.map((node) => (
          <Marker
            key={node.id}
            position={[node.latitude, node.longitude]}
            icon={createIcon(
              node.type, 
              node.ownership,
              highlightNodes.includes(node.id) || selectedNodes.includes(node.id)
            )}
            eventHandlers={{
              click: () => handleNodeClick(node),
              dblclick: () => handleNodeEdit(node)
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-lg">{node.name}</strong>
                  <Badge variant="outline">{node.type}</Badge>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div>Type: {node.type}</div>
                  <div>Ownership: {node.ownership}</div>
                  {node.capacity && <div>Capacity: {node.capacity}</div>}
                  {node.cost && <div>Cost: ${node.cost}</div>}
                  {node.weight && <div>Weight: {node.weight}</div>}
                  <div>Location: {node.latitude.toFixed(4)}, {node.longitude.toFixed(4)}</div>
                </div>
                
                {node.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    {node.notes}
                  </div>
                )}
                
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleNodeEdit(node)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      {showLegend && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
          <h4 className="font-semibold mb-3">Map Legend</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span>Owned Assets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span>Hired/Leased</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span>Outsourced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span>Proposed</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Node Edit Dialog */}
      <NodeEditDialog
        node={editingNode}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleNodeSave}
      />
    </div>
  );
};

export default NetworkMap;
