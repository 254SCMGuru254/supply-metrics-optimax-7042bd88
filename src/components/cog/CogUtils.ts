
import type { Node } from "@/components/map/MapTypes";

export function calculateCenterOfGravity(nodes: Node[], formula: string): { lat: number; lng: number } {
  if (nodes.length === 0) return { lat: 0, lng: 0 };
  
  let totalWeight = 0;
  let weightedLat = 0;
  let weightedLng = 0;
  
  nodes.forEach(node => {
    const weight = node.weight || 1;
    totalWeight += weight;
    weightedLat += node.latitude * weight;
    weightedLng += node.longitude * weight;
  });
  
  return {
    lat: weightedLat / totalWeight,
    lng: weightedLng / totalWeight
  };
}

export function calculateTotalDistance(nodes: Node[], cogResult: { lat: number; lng: number }): number {
  return nodes.reduce((total, node) => {
    const distance = calculateDistance(node.latitude, node.longitude, cogResult.lat, cogResult.lng);
    return total + distance;
  }, 0);
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

export function calculateTotalCost(nodes: Node[], cogResult: { lat: number; lng: number }, formula: string): number {
  return nodes.reduce((total, node) => {
    const distance = calculateDistance(node.latitude, node.longitude, cogResult.lat, cogResult.lng);
    const weight = node.weight || 1;
    return total + (distance * weight);
  }, 0);
}
