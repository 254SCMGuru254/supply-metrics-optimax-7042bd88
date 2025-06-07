import type { Node } from "@/components/map/MapTypes";

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
      type: "warehouse" as const, 
      name: `Optimal Facility for Cluster (${cluster.length} points)`,
      latitude: optLat,
      longitude: optLng,
      isOptimal: true,
      ownership: 'owned' as const
    };
  });
};

// Calculate total weighted distance for a network
export const calculateTotalWeightedDistance = (nodes: Node[], facilityLocation: [number, number], useHaversine: boolean = true): number => {
  let totalDist = 0;
  const [facilityLat, facilityLng] = facilityLocation;
  
  nodes.forEach(node => {
    const weight = node.weight || 1;
    let distance;
    
    if (useHaversine) {
      distance = calculateHaversineDistance(node.latitude, node.longitude, facilityLat, facilityLng);
    } else {
      distance = calculateEuclideanDistance(node.latitude, node.longitude, facilityLat, facilityLng);
    }
    
    totalDist += distance * weight;
  });
  
  return totalDist;
};

// Implementation of multi-start local search for finding a more accurate optimal location
// This improves upon the simple COG calculation
export const findOptimalLocationAdvanced = (nodes: Node[], useHaversine: boolean = true): [number, number] => {
  // Start with basic COG
  const [initialLat, initialLng] = calculateEnhancedCOG(nodes, false);
  
  // Initial best solution
  let bestLat = initialLat;
  let bestLng = initialLng;
  let bestDist = calculateTotalWeightedDistance(nodes, [bestLat, bestLng], useHaversine);
  
  // Multi-start approach with local search
  const numStarts = 10;
  const stepSize = 0.05; // in degrees, approximately 5km
  const maxIterations = 50;
  
  for (let start = 0; start < numStarts; start++) {
    // Random starting point near the COG
    let currentLat = initialLat + (Math.random() - 0.5) * 2;
    let currentLng = initialLng + (Math.random() - 0.5) * 2;
    let currentDist = calculateTotalWeightedDistance(nodes, [currentLat, currentLng], useHaversine);
    
    // Local search
    let improved = true;
    let iterations = 0;
    let currentStep = stepSize;
    
    while (improved && iterations < maxIterations) {
      improved = false;
      iterations++;
      
      // Check nearby points
      for (const [dLat, dLng] of [[currentStep, 0], [-currentStep, 0], [0, currentStep], [0, -currentStep]]) {
        const newLat = currentLat + dLat;
        const newLng = currentLng + dLng;
        const newDist = calculateTotalWeightedDistance(nodes, [newLat, newLng], useHaversine);
        
        if (newDist < currentDist) {
          currentLat = newLat;
          currentLng = newLng;
          currentDist = newDist;
          improved = true;
        }
      }
      
      // Reduce step size gradually
      if (!improved) {
        currentStep = currentStep / 2;
        improved = currentStep > 0.001;
      }
    }
    
    // Update best solution if better
    if (currentDist < bestDist) {
      bestLat = currentLat;
      bestLng = currentLng;
      bestDist = currentDist;
    }
  }
  
  return [bestLat, bestLng];
};
