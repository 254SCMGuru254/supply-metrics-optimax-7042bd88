
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapControllerProps {
  onMapReady?: (map: L.Map) => void;
}

export const MapController: React.FC<MapControllerProps> = ({ onMapReady }) => {
  const map = useMap();
  
  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
};

export default MapController;
