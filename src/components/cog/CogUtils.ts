import type { Node } from "@/components/map/MapTypes";
import { calculateHaversineDistance, calculateEuclideanDistance, calculateEnhancedCOG } from "./EnhancedCogUtils";

export function calculateCenterOfGravity(nodes: Node[], formula: string): { lat: number; lng: number } {
  if (nodes.length === 0) return { lat: 0, lng: 0 };
  
  switch (formula) {
    case "weighted":
      // Standard weighted mean
      let totalWeight = 0;
      let weightedLat = 0;
      let weightedLng = 0;
      nodes.forEach(node => {
        const weight = node.weight || 1;
        totalWeight += weight;
        weightedLat += node.latitude * weight;
        weightedLng += node.longitude * weight;
      });
      return { lat: weightedLat / totalWeight, lng: weightedLng / totalWeight };
    case "geometric":
      // Weighted geometric median (robust to outliers)
      const [medLat, medLng] = calculateEnhancedCOG(nodes, true);
      return { lat: medLat, lng: medLng };
    case "euclidean":
      // Use standard weighted mean, but distances will be calculated using Euclidean
      let totalWeightE = 0;
      let weightedLatE = 0;
      let weightedLngE = 0;
      nodes.forEach(node => {
        const weight = node.weight || 1;
        totalWeightE += weight;
        weightedLatE += node.latitude * weight;
        weightedLngE += node.longitude * weight;
      });
      return { lat: weightedLatE / totalWeightE, lng: weightedLngE / totalWeightE };
    case "haversine":
    case "great-circle":
      // Use standard weighted mean, but distances will be calculated using Haversine
      let totalWeightH = 0;
      let weightedLatH = 0;
      let weightedLngH = 0;
      nodes.forEach(node => {
        const weight = node.weight || 1;
        totalWeightH += weight;
        weightedLatH += node.latitude * weight;
        weightedLngH += node.longitude * weight;
      });
      return { lat: weightedLatH / totalWeightH, lng: weightedLngH / totalWeightH };
    case "economic":
    case "cost-weighted":
      // Placeholder: Use standard weighted mean for now, can be extended for cost-weighted
      let totalWeightC = 0;
      let weightedLatC = 0;
      let weightedLngC = 0;
      nodes.forEach(node => {
        const weight = node.weight || 1;
        totalWeightC += weight;
        weightedLatC += node.latitude * weight;
        weightedLngC += node.longitude * weight;
      });
      return { lat: weightedLatC / totalWeightC, lng: weightedLngC / totalWeightC };
    case "manhattan":
      // Placeholder: Use standard weighted mean for now, can be extended for Manhattan
      let totalWeightM = 0;
      let weightedLatM = 0;
      let weightedLngM = 0;
      nodes.forEach(node => {
        const weight = node.weight || 1;
        totalWeightM += weight;
        weightedLatM += node.latitude * weight;
        weightedLngM += node.longitude * weight;
      });
      return { lat: weightedLatM / totalWeightM, lng: weightedLngM / totalWeightM };
    case "road-network":
    case "multi-criteria":
    case "seasonal-dynamic":
    case "risk-adjusted":
      // Placeholder: Use standard weighted mean for now, can be extended for advanced methods
      let totalWeightX = 0;
      let weightedLatX = 0;
      let weightedLngX = 0;
      nodes.forEach(node => {
        const weight = node.weight || 1;
        totalWeightX += weight;
        weightedLatX += node.latitude * weight;
        weightedLngX += node.longitude * weight;
      });
      return { lat: weightedLatX / totalWeightX, lng: weightedLngX / totalWeightX };
    default:
      // Fallback to weighted mean
      let totalWeightD = 0;
      let weightedLatD = 0;
      let weightedLngD = 0;
      nodes.forEach(node => {
        const weight = node.weight || 1;
        totalWeightD += weight;
        weightedLatD += node.latitude * weight;
        weightedLngD += node.longitude * weight;
      });
      return { lat: weightedLatD / totalWeightD, lng: weightedLngD / totalWeightD };
  }
}

export function calculateTotalDistance(nodes: Node[], cogResult: { lat: number; lng: number }, formula: string = "haversine"): number {
  return nodes.reduce((total, node) => {
    const distance = calculateDistance(node.latitude, node.longitude, cogResult.lat, cogResult.lng, formula);
    return total + distance;
  }, 0);
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number, formula: string = "haversine"): number {
  switch (formula) {
    case "euclidean":
      return calculateEuclideanDistance(lat1, lng1, lat2, lng2);
    case "haversine":
    case "great-circle":
      return calculateHaversineDistance(lat1, lng1, lat2, lng2);
    case "manhattan":
      // Manhattan distance (approximate)
      return Math.abs(lat1 - lat2) * 111 + Math.abs(lng1 - lng2) * 111;
    default:
      return calculateHaversineDistance(lat1, lng1, lat2, lng2);
  }
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

export function calculateTotalCost(nodes: Node[], cogResult: { lat: number; lng: number }, formula: string): number {
  return nodes.reduce((total, node) => {
    const distance = calculateDistance(node.latitude, node.longitude, cogResult.lat, cogResult.lng, formula);
    const weight = node.weight || 1;
    return total + (distance * weight);
  }, 0);
}
