import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Layers, Search, Download, Compass } from 'lucide-react';

interface MapboxLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'warehouse' | 'customer' | 'supplier' | 'distribution';
  volume?: number;
  efficiency?: number;
}

export const LeafletMapbox = () => {
  const [selectedLocation, setSelectedLocation] = useState<MapboxLocation | null>(null);
  const [locations, setLocations] = useState<MapboxLocation[]>([
    {
      id: 'nairobi-hub',
      name: 'Nairobi Distribution Hub',
      latitude: -1.2921,
      longitude: 36.8219,
      type: 'warehouse',
      volume: 15000,
      efficiency: 94
    },
    {
      id: 'mombasa-port',
      name: 'Mombasa Port Terminal',
      latitude: -4.0435,
      longitude: 39.6682,
      type: 'distribution',
      volume: 25000,
      efficiency: 87
    },
    {
      id: 'kisumu-center',
      name: 'Kisumu Regional Center',
      latitude: -0.0917,
      longitude: 34.7578,
      type: 'customer',
      volume: 8000,
      efficiency: 91
    }
  ]);

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'warehouse': return '#3B82F6';
      case 'customer': return '#10B981';
      case 'supplier': return '#8B5CF6';
      case 'distribution': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const createCustomIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const updateLocation = (updatedLocation: MapboxLocation) => {
    setLocations(prev => 
      prev.map(loc => loc.id === updatedLocation.id ? updatedLocation : loc)
    );
    setSelectedLocation(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Interactive Supply Chain Network Map
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Free & Open Source
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Layers className="h-4 w-4 mr-2" />
                    Layers
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[600px] rounded-b-lg overflow-hidden">
                <MapContainer
                  center={[-1.2921, 36.8219]}
                  zoom={6}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {locations.map((location) => (
                    <Marker
                      key={location.id}
                      position={[location.latitude, location.longitude]}
                      icon={createCustomIcon(getMarkerColor(location.type))}
                      eventHandlers={{
                        click: () => setSelectedLocation(location)
                      }}
                    >
                      <Popup>
                        <div className="p-3">
                          <h3 className="font-bold">{location.name}</h3>
                          <p className="text-sm text-gray-600">{location.type}</p>
                          {location.volume && (
                            <p className="text-sm">Volume: {location.volume.toLocaleString()} units</p>
                          )}
                          {location.efficiency && (
                            <p className="text-sm">Efficiency: {location.efficiency}%</p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  
                  {/* Example route lines */}
                  <Polyline
                    positions={[
                      [-1.2921, 36.8219], // Nairobi
                      [-4.0435, 39.6682]  // Mombasa
                    ]}
                    pathOptions={{ color: '#3B82F6', weight: 3 }}
                  />
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {selectedLocation && (
            <Card className="shadow-lg border-blue-500">
              <CardHeader>
                <CardTitle>Edit Location Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input 
                    value={selectedLocation.name}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation, 
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Volume</Label>
                  <Input 
                    type="number"
                    value={selectedLocation.volume || 0}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation, 
                      volume: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Efficiency (%)</Label>
                  <Input 
                    type="number"
                    value={selectedLocation.efficiency || 0}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation, 
                      efficiency: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => updateLocation(selectedLocation)}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedLocation(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-5 w-5" />
                Map Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No API tokens required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Completely free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Open source mapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Global coverage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Privacy friendly</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Location Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locations.map((location) => (
                  <div 
                    key={location.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{location.name}</h3>
                      <Badge variant="outline" style={{ color: getMarkerColor(location.type) }}>
                        {location.type}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</div>
                      {location.volume && (
                        <div>Volume: {location.volume.toLocaleString()} units</div>
                      )}
                      {location.efficiency && (
                        <div>Efficiency: {location.efficiency}%</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
