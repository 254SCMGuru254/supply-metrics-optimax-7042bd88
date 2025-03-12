
export const locationColors: Record<string, string> = {
  city: "#3B82F6",
  market: "#10B981",
  distribution: "#F59E0B",
  airport: "#6366F1",
  farm_collection: "#84CC16",
  port: "#EC4899",
  border: "#8B5CF6",
};

export const getMarkerIcon = (type: string): string => {
  switch (type) {
    case "city":
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png";
    case "market":
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png";
    case "distribution":
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png";
    case "airport":
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png";
    case "farm_collection":
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png";
    case "port":
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png";
    case "border":
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png";
    default:
      return "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png";
  }
};

export const getRouteColor = (type: string): string => {
  switch (type) {
    case "road":
      return "#3B82F6";
    case "rail":
      return "#10B981";
    case "air":
      return "#8B5CF6";
    case "sea":
      return "#EC4899";
    default:
      return "#6B7280";
  }
};

export const getRouteWeight = (volume: number): number => {
  if (volume > 1000) return 5;
  if (volume > 500) return 4;
  if (volume > 250) return 3;
  return 2;
};
