
import { useMapEvents } from 'react-leaflet';

interface MapEventHandlerProps {
  onMapClick?: (lat: number, lng: number) => void;
}

export const MapEventHandler: React.FC<MapEventHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
};

export default MapEventHandler;
