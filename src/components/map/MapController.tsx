
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

type MapControllerProps = {
  onMapReady: (map: L.Map) => void;
};

export const MapController = ({ onMapReady }: MapControllerProps) => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);
  
  return null;
};
