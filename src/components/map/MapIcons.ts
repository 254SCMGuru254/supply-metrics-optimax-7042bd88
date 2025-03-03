
import L from "leaflet";

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for different facility types
export const createCustomIcon = (color: string): L.Icon => 
  new L.Icon({
    iconUrl: `data:image/svg+xml,%3Csvg width='25' height='41' viewBox='0 0 25 41' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 12.5 41 12.5 41C12.5 41 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0Z' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E`,
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
  });

export const warehouseIcon = createCustomIcon("#ef4444"); // red
export const distributionIcon = createCustomIcon("#22c55e"); // green
export const retailIcon = createCustomIcon("#3b82f6"); // blue

export const getNodeIcon = (type: "warehouse" | "distribution" | "retail"): L.Icon => {
  switch (type) {
    case "warehouse":
      return warehouseIcon;
    case "distribution":
      return distributionIcon;
    case "retail":
      return retailIcon;
    default:
      return warehouseIcon;
  }
};
