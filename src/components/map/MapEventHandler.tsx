
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

type MapEventHandlerProps = {
  onMapClick?: (lat: number, lng: number) => void;
};

export const MapEventHandler = ({ onMapClick }: MapEventHandlerProps) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map || !onMapClick) return;
    
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
