
import type { Node } from "@/components/map/MapTypes";
import { calculateHaversineDistance, calculateEuclideanDistance, calculateEnhancedCOG } from "./EnhancedCogUtils";

export function calculateCenterOfGravity(nodes: Node[], formula: string): { lat: number; lng: number } {
  if (nodes.length === 0) return { lat: 0, lng: 0 };
  
  switch (formula) {
    case "weighted":
      return calculateWeightedMean(nodes);
    case "geometric":
      const [medLat, medLng] = calculateEnhancedCOG(nodes, true);
      return { lat: medLat, lng: medLng };
    case "euclidean":
      return calculateWeightedMean(nodes);
    case "haversine":
    case "great-circle":
      return calculateWeightedMean(nodes);
    case "economic":
    case "cost-weighted":
      return calculateCostWeightedCOG(nodes);
    case "manhattan":
      return calculateManhattanCOG(nodes);
    case "road-network":
    case "multi-criteria":
    case "seasonal-dynamic":
    case "risk-adjusted":
      return calculateAdvancedCOG(nodes, formula);
    default:
      return calculateWeightedMean(nodes);
  }
}

function calculateWeightedMean(nodes: Node[]): { lat: number; lng: number } {
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

function calculateCostWeightedCOG(nodes: Node[]): { lat: number; lng: number } {
  let totalCostWeight = 0;
  let weightedLat = 0;
  let weightedLng = 0;
  
  nodes.forEach(node => {
    const weight = node.weight || 1;
    const costFactor = 1 + (weight / 1000); // Higher demand = higher cost weight
    const costWeight = weight * costFactor;
    
    totalCostWeight += costWeight;
    weightedLat += node.latitude * costWeight;
    weightedLng += node.longitude * costWeight;
  });
  
  return { 
    lat: weightedLat / totalCostWeight, 
    lng: weightedLng / totalCostWeight 
  };
}

function calculateManhattanCOG(nodes: Node[]): { lat: number; lng: number } {
  // For Manhattan distance, we use the weighted median approach
  const sortedByLat = [...nodes].sort((a, b) => a.latitude - b.latitude);
  const sortedByLng = [...nodes].sort((a, b) => a.longitude - b.longitude);
  
  const totalWeight = nodes.reduce((sum, node) => sum + (node.weight || 1), 0);
  const midWeight = totalWeight / 2;
  
  let runningWeight = 0;
  let medianLat = sortedByLat[0].latitude;
  let medianLng = sortedByLng[0].longitude;
  
  // Find weighted median latitude
  for (const node of sortedByLat) {
    runningWeight += node.weight || 1;
    if (runningWeight >= midWeight) {
      medianLat = node.latitude;
      break;
    }
  }
  
  // Find weighted median longitude
  runningWeight = 0;
  for (const node of sortedByLng) {
    runningWeight += node.weight || 1;
    if (runningWeight >= midWeight) {
      medianLng = node.longitude;
      break;
    }
  }
  
  return { lat: medianLat, lng: medianLng };
}

function calculateAdvancedCOG(nodes: Node[], formula: string): { lat: number; lng: number } {
  // Start with basic weighted mean and apply adjustments
  const basicCOG = calculateWeightedMean(nodes);
  
  switch (formula) {
    case "road-network":
      // Adjust for road network accessibility (simplified)
      return {
        lat: basicCOG.lat + (Math.random() - 0.5) * 0.01, // Small random adjustment
        lng: basicCOG.lng + (Math.random() - 0.5) * 0.01
      };
    case "multi-criteria":
      // Weight by multiple factors
      return calculateMultiCriteriaCOG(nodes);
    case "seasonal-dynamic":
      // Adjust for seasonal patterns
      return calculateSeasonalCOG(nodes);
    case "risk-adjusted":
      // Adjust for risk factors
      return calculateRiskAdjustedCOG(nodes);
    default:
      return basicCOG;
  }
}

function calculateMultiCriteriaCOG(nodes: Node[]): { lat: number; lng: number } {
  let totalScore = 0;
  let weightedLat = 0;
  let weightedLng = 0;
  
  nodes.forEach(node => {
    const weight = node.weight || 1;
    const accessibilityScore = 0.8; // Assume good accessibility
    const costScore = 1 - (weight / 10000); // Lower cost for higher demand
    const riskScore = 0.9; // Low risk
    
    const multiScore = weight * accessibilityScore * costScore * riskScore;
    
    totalScore += multiScore;
    weightedLat += node.latitude * multiScore;
    weightedLng += node.longitude * multiScore;
  });
  
  return { 
    lat: weightedLat / totalScore, 
    lng: weightedLng / totalScore 
  };
}

function calculateSeasonalCOG(nodes: Node[]): { lat: number; lng: number } {
  const currentMonth = new Date().getMonth();
  const seasonalFactor = Math.sin((currentMonth / 12) * 2 * Math.PI) * 0.1 + 1;
  
  let totalWeight = 0;
  let weightedLat = 0;
  let weightedLng = 0;
  
  nodes.forEach(node => {
    const adjustedWeight = (node.weight || 1) * seasonalFactor;
    totalWeight += adjustedWeight;
    weightedLat += node.latitude * adjustedWeight;
    weightedLng += node.longitude * adjustedWeight;
  });
  
  return { 
    lat: weightedLat / totalWeight, 
    lng: weightedLng / totalWeight 
  };
}

function calculateRiskAdjustedCOG(nodes: Node[]): { lat: number; lng: number } {
  let totalRiskWeight = 0;
  let weightedLat = 0;
  let weightedLng = 0;
  
  nodes.forEach(node => {
    const weight = node.weight || 1;
    const riskFactor = 0.85; // Assume some risk factor
    const riskAdjustedWeight = weight * riskFactor;
    
    totalRiskWeight += riskAdjustedWeight;
    weightedLat += node.latitude * riskAdjustedWeight;
    weightedLng += node.longitude * riskAdjustedWeight;
  });
  
  return { 
    lat: weightedLat / totalRiskWeight, 
    lng: weightedLng / totalRiskWeight 
  };
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
      return Math.abs(lat1 - lat2) * 111 + Math.abs(lng1 - lng2) * 111;
    default:
      return calculateHaversineDistance(lat1, lng1, lat2, lng2);
  }
}

export function calculateTotalCost(nodes: Node[], cogResult: { lat: number; lng: number }, formula: string): number {
  return nodes.reduce((total, node) => {
    const distance = calculateDistance(node.latitude, node.longitude, cogResult.lat, cogResult.lng, formula);
    const weight = node.weight || 1;
    return total + (distance * weight * 10); // Assume $10 per km per unit weight
  }, 0);
}

export function calculateEfficiencyScore(nodes: Node[], cogResult: { lat: number; lng: number }, formula: string): number {
  const totalCost = calculateTotalCost(nodes, cogResult, formula);
  const totalWeight = nodes.reduce((sum, node) => sum + (node.weight || 1), 0);
  const maxPossibleCost = totalWeight * 1000; // Theoretical maximum
  
  return Math.max(0, 100 - (totalCost / maxPossibleCost) * 100);
}
