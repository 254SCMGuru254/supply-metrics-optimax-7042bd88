
import { Node } from "@/components/map/MapTypes";

// Haversine formula for accurate distance calculation (equivalent to geopy's distance function)
export const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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

// Euclidean distance in km (approximation)
export const calculateEuclideanDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  // Convert lat/lon to km (rough approximation)
  const latKm = (lat2 - lat1) * 111;
  const lonKm = (lon2 - lon1) * 111 * Math.cos(deg2rad((lat1 + lat2) / 2));
  return Math.sqrt(latKm * latKm + lonKm * lonKm);
};

export const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

// Enhanced Center of Gravity calculation with weighted median option
export const calculateEnhancedCOG = (nodes: Node[], useMedian: boolean = false): [number, number] => {
  if (useMedian) {
    // Weighted median calculation (more robust to outliers)
    const sortedByLat = [...nodes].sort((a, b) => a.latitude - b.latitude);
    const sortedByLng = [...nodes].sort((a, b) => a.longitude - b.longitude);
    
    let runningWeight = 0;
    const totalWeight = nodes.reduce((sum, node) => sum + (node.weight || 1), 0);
    const midWeight = totalWeight / 2;
    
    let medianLat, medianLng;
    
    // Find median latitude
    runningWeight = 0;
    for (const node of sortedByLat) {
      runningWeight += node.weight || 1;
      if (runningWeight >= midWeight) {
        medianLat = node.latitude;
        break;
      }
    }
    
    // Find median longitude
    runningWeight = 0;
    for (const node of sortedByLng) {
      runningWeight += node.weight || 1;
      if (runningWeight >= midWeight) {
        medianLng = node.longitude;
        break;
      }
    }
    
    return [medianLat!, medianLng!];
  } else {
    // Standard weighted mean calculation
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
  }
};

// DBSCAN-inspired clustering for demand points
export const clusterDemandPoints = (nodes: Node[], epsilon: number = 50, minPoints: number = 3): Node[][] => {
  // Mark all nodes as unvisited initially
  const visited = new Map<string, boolean>();
  const clusters: Node[][] = [];
  
  // For each unvisited node
  nodes.forEach(node => {
    if (visited.has(node.id)) return;
    visited.set(node.id, true);
    
    // Find neighbors
    const neighbors = nodes.filter(n => {
      if (n.id === node.id) return false;
      const distance = calculateHaversineDistance(node.latitude, node.longitude, n.latitude, n.longitude);
      return distance <= epsilon;
    });
    
    // If not enough neighbors, mark as noise
    if (neighbors.length < minPoints - 1) return;
    
    // Create new cluster
    const cluster: Node[] = [node];
    
    // Expand cluster
    expandCluster(node, neighbors, cluster, nodes, epsilon, minPoints, visited);
    clusters.push(cluster);
  });
  
  return clusters;
};

function expandCluster(
  node: Node, 
  neighbors: Node[], 
  cluster: Node[], 
  allNodes: Node[], 
  epsilon: number, 
  minPoints: number,
  visited: Map<string, boolean>
) {
  // Process all neighbors
  neighbors.forEach(neighbor => {
    if (!visited.has(neighbor.id)) {
      visited.set(neighbor.id, true);
      
      // Find neighbor's neighbors
      const newNeighbors = allNodes.filter(n => {
        if (n.id === neighbor.id) return false;
        const distance = calculateHaversineDistance(neighbor.latitude, neighbor.longitude, n.latitude, n.longitude);
        return distance <= epsilon;
      });
      
      // If enough neighbors, add them to the processing queue
      if (newNeighbors.length >= minPoints - 1) {
        newNeighbors.forEach(nn => {
          if (!neighbors.some(n => n.id === nn.id)) {
            neighbors.push(nn);
          }
        });
      }
    }
    
    // Add to cluster if not already in a cluster
    if (!cluster.some(n => n.id === neighbor.id)) {
      cluster.push(neighbor);
    }
  });
}

// Optimize cluster locations - find optimal facility for each cluster
export const optimizeClusterLocations = (clusters: Node[][]): Node[] => {
  return clusters.map(cluster => {
    const [optLat, optLng] = calculateEnhancedCOG(cluster);
    
    return {
      id: `optimal-${Math.random().toString(36).substring(2, 9)}`,
      type: "warehouse", 
      name: `Optimal Facility for Cluster (${cluster.length} points)`,
      latitude: optLat,
      longitude: optLng,
      isOptimal: true
    };
  });
};
