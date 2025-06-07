
import { Node, Route } from "@/components/map/MapTypes";

// OSRM-like parameters for route optimization
export interface RouteOptimizationParams {
  routeType: "fastest" | "shortest" | "balanced";
  considerTraffic: boolean;
  avoidTolls: boolean;
  avoidHighways: boolean;
  vehicleType: "car" | "truck" | "van";
  maxHeight?: number;
  maxWeight?: number;
  maxWidth?: number;
  departureTime?: Date;
  considerTimeWindows: boolean;
}

// Time window constraints for nodes
export interface TimeWindow {
  nodeId: string;
  earliestArrival: number; // minutes from start
  latestArrival: number; // minutes from start
}

// Vehicle constraints
export interface Vehicle {
  id: string;
  capacity: number;
  costPerKm: number;
  costPerHour: number;
  maxDistance: number;
  height: number;
  width: number;
  weight: number;
  emissions: number;
}

// Calculate distance between two nodes using haversine formula
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

// Check if route is feasible based on constraints
export const isRouteFeasible = (
  fromNode: Node, 
  toNode: Node, 
  vehicle: Vehicle,
  params: RouteOptimizationParams
): boolean => {
  // Check height restriction
  if (toNode.metadata?.restrictions?.heightLimit && 
      vehicle.height > toNode.metadata.restrictions.heightLimit) {
    return false;
  }
  
  // Check weight restriction
  if (toNode.metadata?.restrictions?.weightLimit && 
      vehicle.weight > toNode.metadata.restrictions.weightLimit) {
    return false;
  }
  
  // Check width restriction
  if (toNode.metadata?.restrictions?.widthLimit && 
      vehicle.width > toNode.metadata.restrictions.widthLimit) {
    return false;
  }
  
  // Check environmental zone restriction
  if (toNode.metadata?.restrictions?.environmentalZone && 
      vehicle.emissions > 3) { // Assuming emissions level 3 is the limit
    return false;
  }
  
  // Check permit requirement
  if (toNode.metadata?.restrictions?.permitRequired) {
    // In a real system, we'd check if the vehicle has the required permit
    // For this demo, we'll assume it doesn't
    return false;
  }
  
  return true;
};

// Calculate travel time between nodes, considering traffic and other factors
export const calculateTravelTime = (
  fromNode: Node, 
  toNode: Node,
  params: RouteOptimizationParams
): number => {
  const distance = calculateDistance(
    fromNode.latitude, fromNode.longitude,
    toNode.latitude, toNode.longitude
  );
  
  // Base speed in km/h based on route type
  let baseSpeed: number;
  switch (params.routeType) {
    case "fastest":
      baseSpeed = 90; // Highway preference
      break;
    case "shortest":
      baseSpeed = 60; // Direct routes
      break;
    default:
      baseSpeed = 75; // Balanced
  }
  
  // Apply traffic factor if enabled
  let adjustedSpeed = baseSpeed;
  if (params.considerTraffic) {
    const trafficFactor = fromNode.metadata?.trafficFactor || 1.0;
    adjustedSpeed = baseSpeed / trafficFactor;
  }
  
  // Calculate hours and convert to minutes
  const hours = distance / adjustedSpeed;
  return hours * 60; // Return minutes
};

// Calculate route cost based on distance, tolls, etc.
export const calculateRouteCost = (
  fromNode: Node, 
  toNode: Node,
  vehicle: Vehicle,
  params: RouteOptimizationParams
): number => {
  const distance = calculateDistance(
    fromNode.latitude, fromNode.longitude,
    toNode.latitude, toNode.longitude
  );
  
  // Base cost using vehicle's cost per km
  let cost = distance * vehicle.costPerKm;
  
  // Add toll cost if applicable and not avoiding tolls
  if (!params.avoidTolls && (fromNode.metadata?.tollCost || toNode.metadata?.tollCost)) {
    cost += (fromNode.metadata?.tollCost || 0) + (toNode.metadata?.tollCost || 0);
  }
  
  // Calculate time cost
  const travelTimeHours = calculateTravelTime(fromNode, toNode, params) / 60;
  cost += travelTimeHours * vehicle.costPerHour;
  
  return cost;
};

// Create initial routes between nodes
export const createInitialRoutes = (nodes: Node[], vehicle: Vehicle, params: RouteOptimizationParams): Route[] => {
  const routes: Route[] = [];
  
  // Create feasible routes between nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i !== j) {
        const fromNode = nodes[i];
        const toNode = nodes[j];
        
        // Check if route is feasible
        if (isRouteFeasible(fromNode, toNode, vehicle, params)) {
          // Calculate travel time and cost
          const transitTime = calculateTravelTime(fromNode, toNode, params);
          const cost = calculateRouteCost(fromNode, toNode, vehicle, params);
          
          // Create route
          routes.push({
            id: crypto.randomUUID(),
            from: fromNode.id,
            to: toNode.id,
            volume: 0, // Initial volume
            cost,
            transitTime,
            type: "road", // Default to road
            ownership: 'owned' // Add ownership property
          });
        }
      }
    }
  }
  
  return routes;
};

// Optimize routes using OSRM-like approach
export const optimizeRoutes = (
  nodes: Node[], 
  routes: Route[],
  vehicle: Vehicle,
  params: RouteOptimizationParams,
  timeWindows?: TimeWindow[]
): [Route[], number] => {
  // Copy routes to avoid mutating input
  const feasibleRoutes = [...routes];
  
  // Create a lookup of nodes by ID
  const nodesById = new Map<string, Node>();
  nodes.forEach(node => nodesById.set(node.id, node));
  
  // Create time window lookup by node ID
  const timeWindowByNodeId = new Map<string, TimeWindow>();
  if (timeWindows) {
    timeWindows.forEach(tw => timeWindowByNodeId.set(tw.nodeId, tw));
  }
  
  // Identify depot nodes (sources/sinks)
  const depots = nodes.filter(n => n.type === "warehouse" || n.type === "distribution");
  if (depots.length === 0) {
    // Fallback to first node as depot
    depots.push(nodes[0]);
  }
  
  // Identify customer nodes
  const customers = nodes.filter(n => n.type === "retail");
  
  // Solution representation: order of visits
  // Start with a simple solution: depot -> all customers in order -> back to depot
  let currentSolution: string[] = [depots[0].id];
  customers.forEach(c => currentSolution.push(c.id));
  currentSolution.push(depots[0].id); // Return to depot
  
  // Calculate initial solution cost and time
  let currentCost = calculateSolutionCost(currentSolution, nodesById, feasibleRoutes);
  
  // Local search optimization
  const maxIterations = 1000;
  let bestSolution = [...currentSolution];
  let bestCost = currentCost;
  
  // Try different local search operators
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Apply random operator
    const operator = Math.floor(Math.random() * 3);
    let newSolution: string[];
    
    switch (operator) {
      case 0:
        // Swap two random non-depot nodes
        newSolution = [...currentSolution];
        if (newSolution.length > 3) { // Need at least 2 non-depot nodes
          const idx1 = 1 + Math.floor(Math.random() * (newSolution.length - 2));
          let idx2;
          do {
            idx2 = 1 + Math.floor(Math.random() * (newSolution.length - 2));
          } while (idx1 === idx2);
          
          const temp = newSolution[idx1];
          newSolution[idx1] = newSolution[idx2];
          newSolution[idx2] = temp;
        } else {
          continue; // Skip iteration if not enough nodes
        }
        break;
        
      case 1:
        // 2-opt: reverse a segment of the route
        newSolution = [...currentSolution];
        if (newSolution.length > 3) {
          const idx1 = 1 + Math.floor(Math.random() * (newSolution.length - 3));
          const idx2 = idx1 + 1 + Math.floor(Math.random() * (newSolution.length - idx1 - 1));
          
          // Reverse the segment
          const segment = newSolution.slice(idx1, idx2 + 1).reverse();
          for (let i = 0; i < segment.length; i++) {
            newSolution[idx1 + i] = segment[i];
          }
        } else {
          continue; // Skip iteration if not enough nodes
        }
        break;
        
      case 2:
        // Relocate: move a node to a new position
        newSolution = [...currentSolution];
        if (newSolution.length > 3) {
          const idx1 = 1 + Math.floor(Math.random() * (newSolution.length - 2));
          let idx2;
          do {
            idx2 = 1 + Math.floor(Math.random() * (newSolution.length - 2));
          } while (idx1 === idx2);
          
          const node = newSolution[idx1];
          newSolution.splice(idx1, 1); // Remove node
          newSolution.splice(idx2, 0, node); // Insert at new position
        } else {
          continue; // Skip iteration if not enough nodes
        }
        break;
    }
    
    // Check if solution is feasible
    if (params.considerTimeWindows) {
      if (!checkTimeWindowFeasibility(newSolution, nodesById, feasibleRoutes, timeWindowByNodeId)) {
        continue; // Skip infeasible solution
      }
    }
    
    // Calculate cost of new solution
    const newCost = calculateSolutionCost(newSolution, nodesById, feasibleRoutes);
    
    // Accept solution if better
    if (newCost < currentCost) {
      currentSolution = newSolution;
      currentCost = newCost;
      
      // Update best solution if applicable
      if (currentCost < bestCost) {
        bestSolution = [...currentSolution];
        bestCost = currentCost;
      }
    }
  }
  
  // Convert best solution to optimized routes
  const optimizedRoutes: Route[] = [];
  for (let i = 0; i < bestSolution.length - 1; i++) {
    const fromId = bestSolution[i];
    const toId = bestSolution[i + 1];
    
    // Find corresponding route
    const route = feasibleRoutes.find(r => r.from === fromId && r.to === toId);
    
    if (route) {
      // Create a copy with optimized flag and volume
      optimizedRoutes.push({
        ...route,
        volume: vehicle.capacity, // Assume full vehicle capacity
        isOptimized: true,
      });
    }
  }
  
  // Calculate cost reduction percentage
  const initialCost = calculateSolutionCost(currentSolution, nodesById, feasibleRoutes);
  const costReduction = ((initialCost - bestCost) / initialCost) * 100;
  
  return [optimizedRoutes, costReduction];
};

// Calculate total cost of a solution
function calculateSolutionCost(
  solution: string[], 
  nodesById: Map<string, Node>, 
  routes: Route[]
): number {
  let totalCost = 0;
  
  for (let i = 0; i < solution.length - 1; i++) {
    const fromId = solution[i];
    const toId = solution[i + 1];
    
    // Find corresponding route
    const route = routes.find(r => r.from === fromId && r.to === toId);
    
    if (route) {
      totalCost += route.cost || 0;
    } else {
      // If no direct route exists, add a large penalty
      totalCost += 1000000;
    }
  }
  
  return totalCost;
}

// Check time window feasibility
function checkTimeWindowFeasibility(
  solution: string[], 
  nodesById: Map<string, Node>, 
  routes: Route[],
  timeWindows: Map<string, TimeWindow>
): boolean {
  let currentTime = 0; // Start time in minutes
  
  for (let i = 0; i < solution.length - 1; i++) {
    const fromId = solution[i];
    const toId = solution[i + 1];
    
    // Find corresponding route
    const route = routes.find(r => r.from === fromId && r.to === toId);
    
    if (route) {
      // Add travel time
      currentTime += route.transitTime || 0;
      
      // Check time window constraint for destination
      const timeWindow = timeWindows.get(toId);
      if (timeWindow) {
        if (currentTime < timeWindow.earliestArrival) {
          // Arrived too early, wait
          currentTime = timeWindow.earliestArrival;
        } else if (currentTime > timeWindow.latestArrival) {
          // Arrived too late, infeasible
          return false;
        }
      }
      
      // Add service time (10 minutes)
      currentTime += 10;
    } else {
      // No route exists
      return false;
    }
  }
  
  return true;
}

// Generate multi-modal routes
export const generateMultiModalRoutes = (nodes: Node[]): Route[] => {
  const routes: Route[] = [];
  
  // Create connections between appropriate nodes based on type
  nodes.forEach(fromNode => {
    nodes.forEach(toNode => {
      if (fromNode.id !== toNode.id) {
        // Determine route type based on node types
        let routeType: "road" | "rail" | "air" | "sea" | undefined;
        
        // Air routes: airport to airport
        if (fromNode.type === "airport" && toNode.type === "airport") {
          routeType = "air";
        }
        // Rail routes: railhub to railhub
        else if (fromNode.type === "railhub" && toNode.type === "railhub") {
          routeType = "rail";
        }
        // Sea routes: port to port
        else if (fromNode.type === "port" && toNode.type === "port") {
          routeType = "sea";
        }
        // Road routes: between any nodes (default)
        else {
          routeType = "road";
        }
        
        // Calculate distance and costs based on route type
        const distance = calculateDistance(
          fromNode.latitude, fromNode.longitude,
          toNode.latitude, toNode.longitude
        );
        
        let costFactor: number;
        let timeFactor: number;
        
        switch (routeType) {
          case "air":
            costFactor = 5.0; // Most expensive
            timeFactor = 0.5; // Fastest
            break;
          case "sea":
            costFactor = 0.5; // Cheapest
            timeFactor = 4.0; // Slowest
            break;
          case "rail":
            costFactor = 0.8; // Economical
            timeFactor = 1.5; // Moderate speed
            break;
          case "road":
          default:
            costFactor = 1.0; // Baseline
            timeFactor = 1.0; // Baseline
        }
        
        const cost = distance * costFactor;
        const transitTime = (distance / 60) * timeFactor * 60; // Convert to minutes
        
        // Create route
        routes.push({
          id: crypto.randomUUID(),
          from: fromNode.id,
          to: toNode.id,
          volume: 0, // Initial volume
          cost,
          transitTime,
          type: routeType,
          ownership: 'owned' // Add ownership property
        });
      }
    });
  });
  
  return routes;
};

// Plan multi-modal route with transfers
export const planMultiModalRoute = (
  sourceId: string,
  destinationId: string,
  nodes: Node[],
  routes: Route[],
  preferredMode?: "road" | "rail" | "air" | "sea"
): Route[] | null => {
  // Create a graph representation
  const graph = new Map<string, {nodeId: string, cost: number, route: Route}[]>();
  
  // Initialize graph
  nodes.forEach(node => {
    graph.set(node.id, []);
  });
  
  // Populate graph with routes
  routes.forEach(route => {
    const neighbors = graph.get(route.from) || [];
    
    // Apply mode preference (reduce cost for preferred mode)
    let adjustedCost = route.cost || 0;
    if (preferredMode && route.type === preferredMode) {
      adjustedCost *= 0.7; // 30% discount for preferred mode
    }
    
    neighbors.push({
      nodeId: route.to,
      cost: adjustedCost,
      route,
    });
    
    graph.set(route.from, neighbors);
  });
  
  // Dijkstra's algorithm for shortest path
  const distance = new Map<string, number>();
  const previous = new Map<string, string>();
  const previousRoute = new Map<string, Route>();
  const visited = new Set<string>();
  
  // Initialize distances
  nodes.forEach(node => {
    distance.set(node.id, Infinity);
  });
  distance.set(sourceId, 0);
  
  // Process nodes
  while (visited.size < nodes.length) {
    // Find node with minimum distance
    let minDistance = Infinity;
    let current: string | null = null;
    
    nodes.forEach(node => {
      const nodeId = node.id;
      if (!visited.has(nodeId) && (distance.get(nodeId) || Infinity) < minDistance) {
        minDistance = distance.get(nodeId) || Infinity;
        current = nodeId;
      }
    });
    
    // Break if no path found or destination reached
    if (current === null || current === destinationId || minDistance === Infinity) {
      break;
    }
    
    visited.add(current);
    
    // Process neighbors
    const neighbors = graph.get(current) || [];
    neighbors.forEach(neighbor => {
      if (visited.has(neighbor.nodeId)) return;
      
      const alt = (distance.get(current) || 0) + neighbor.cost;
      if (alt < (distance.get(neighbor.nodeId) || Infinity)) {
        distance.set(neighbor.nodeId, alt);
        previous.set(neighbor.nodeId, current);
        previousRoute.set(neighbor.nodeId, neighbor.route);
      }
    });
  }
  
  // Reconstruct path
  if (previous.get(destinationId) === undefined) {
    return null; // No path found
  }
  
  const routePath: Route[] = [];
  let current = destinationId;
  
  while (current !== sourceId) {
    const prev = previous.get(current);
    if (!prev) break;
    
    const route = previousRoute.get(current);
    if (route) {
      routePath.unshift({...route, isOptimized: true});
    }
    
    current = prev;
  }
  
  return routePath;
};

// Generate optimized routes
export const generateOptimizedRoutes = (nodes: Node[]): Route[] => {
  const routes: Route[] = [];
  
  // Create a fully connected network for optimization
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      // Calculate distance
      const dx = nodes[i].latitude - nodes[j].latitude;
      const dy = nodes[i].longitude - nodes[j].longitude;
      const distance = Math.sqrt(dx * dx + dy * dy) * 111; // Rough km conversion
      
      routes.push({
        id: crypto.randomUUID(),
        from: nodes[i].id,
        to: nodes[j].id,
        volume: Math.floor(Math.random() * 100) + 50,
        cost: Math.round(distance * 10),
        transitTime: Math.round(distance / 50), // Assumed 50 km/h average speed
        type: "road",
        ownership: 'owned' // Add ownership property
      });
    }
  }
  
  return routes;
};

// Optimize multi-modal network
export const optimizeMultiModalNetwork = (nodes: Node[]): Route[] => {
  const routes: Route[] = [];
  
  // Generate multi-modal routes
  const transportModes: Array<"road" | "rail" | "air" | "sea"> = ["road", "rail", "air", "sea"];
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].latitude - nodes[j].latitude;
      const dy = nodes[i].longitude - nodes[j].longitude;
      const distance = Math.sqrt(dx * dx + dy * dy) * 111;
      
      // Choose transport mode based on distance and node types
      let mode: "road" | "rail" | "air" | "sea" = "road";
      if (distance > 500) mode = "air";
      else if (distance > 200) mode = "rail";
      else if (nodes[i].type === "port" || nodes[j].type === "port") mode = "sea";
      
      routes.push({
        id: crypto.randomUUID(),
        from: nodes[i].id,
        to: nodes[j].id,
        volume: Math.floor(Math.random() * 100) + 50,
        cost: Math.round(distance * (mode === "air" ? 50 : mode === "rail" ? 15 : 10)),
        transitTime: Math.round(distance / (mode === "air" ? 800 : mode === "rail" ? 100 : 50)),
        type: mode,
        ownership: 'owned' // Add ownership property
      });
    }
  }
  
  return routes;
};
