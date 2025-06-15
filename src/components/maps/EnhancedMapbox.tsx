
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Layers, Filter, Download } from 'lucide-react';

interface MapboxLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'warehouse' | 'customer' | 'supplier' | 'distribution';
  volume?: number;
  efficiency?: number;
}

export const EnhancedMapbox = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapboxToken, setMapboxToken] = useState('');
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

  const initializeMap = async () => {
    if (!mapboxToken || !mapContainer.current) return;

    try {
      // Dynamically import mapbox-gl
      const mapboxgl = await import('mapbox-gl');
      
      mapboxgl.default.accessToken = mapboxToken;
      
      map.current = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [36.8219, -1.2921], // Nairobi
        zoom: 6,
        projection: 'mercator'
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

      // Add markers for each location
      locations.forEach((location) => {
        const markerColor = getMarkerColor(location.type);
        
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.cssText = `
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: ${markerColor};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        `;

        // Add marker
        new mapboxgl.default.Marker(markerElement)
          .setLngLat([location.longitude, location.latitude])
          .setPopup(
            new mapboxgl.default.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-3">
                  <h3 class="font-bold">${location.name}</h3>
                  <p class="text-sm text-gray-600">${location.type}</p>
                  ${location.volume ? `<p class="text-sm">Volume: ${location.volume.toLocaleString()} units</p>` : ''}
                  ${location.efficiency ? `<p class="text-sm">Efficiency: ${location.efficiency}%</p>` : ''}
                </div>
              `)
          )
          .addTo(map.current);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'warehouse': return '#3B82F6';
      case 'customer': return '#10B981';
      case 'supplier': return '#8B5CF6';
      case 'distribution': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken]);

  return (
    <div className="space-y-6">
      {!mapboxToken ? (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <MapPin className="h-5 w-5" />
              Mapbox Configuration Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-yellow-700">
                Enter your Mapbox public token to enable interactive mapping features.
                Get your token from{' '}
                <a 
                  href="https://mapbox.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  mapbox.com
                </a>
              </p>
              <div className="space-y-2">
                <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
                <Input
                  id="mapbox-token"
                  type="text"
                  placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIi..."
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                />
              </div>
              <Button 
                onClick={initializeMap}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Initialize Map
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Supply Chain Network Map
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Layers className="h-4 w-4 mr-2" />
                    Layers
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={mapContainer} className="w-full h-[500px] rounded-b-lg" />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Location Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((location) => (
                  <div key={location.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
        </>
      )}
    </div>
  );
};
