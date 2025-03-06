
import { Node } from "@/components/NetworkMap";

// Utility function to calculate distance between two points (haversine formula)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
};

export const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

// Utility function to calculate the Center of Gravity
export const calculateCOG = (nodes: Node[]): [number, number] => {
  let weightedSumLat = 0;
  let weightedSumLng = 0;
  let totalWeight = 0;

  nodes.forEach(node => {
    const weight = node.weight || 1;
    weightedSumLat += node.latitude * weight;
    weightedSumLng += node.longitude * weight;
    totalWeight += weight;
  });

  return [
    weightedSumLat / totalWeight,
    weightedSumLng / totalWeight
  ];
};
