
import { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import { MapEventHandlerProps } from './MapTypes';

export const MapEventHandler: React.FC<MapEventHandlerProps> = ({ onMapClick }) => {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    }
  });

  useEffect(() => {
    // Additional setup for map events can be done here
  }, [map]);

  return null;
};
