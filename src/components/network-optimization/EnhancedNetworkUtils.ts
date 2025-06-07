
import type { Node, Route } from "@/components/map/MapTypes";

// Create baseline network configuration
export const createInitialNetwork = (nodes: Node[]): Route[] => {
  const routes: Route[] = [];
  
  // Create a fully connected network for demo purposes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      // Calculate distance
      const dx = nodes[i].latitude - nodes[j].latitude;
      const dy = nodes[i].longitude - nodes[j].longitude;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Create route with cost based on distance
      routes.push({
        id: crypto.randomUUID(),
        from: nodes[i].id,
        to: nodes[j].id,
        volume: 0, // Initial flow
        cost: Math.round(distance * 100), // Cost proportional to distance
        ownership: 'owned'
      });
    }
  }
  
  return routes;
};

// Find sources and sinks in the network
export const identifySourcesAndSinks = (nodes: Node[], routes: Route[]): { sources: Node[], sinks: Node[] } => {
  const sources: Node[] = [];
  const sinks: Node[] = [];
  
  nodes.forEach(node => {
    // Count outgoing and incoming connections
    const outgoing = routes.filter(r => r.from === node.id).length;
    const incoming = routes.filter(r => r.to === node.id).length;
    
    if (incoming === 0 && outgoing > 0) {
      sources.push(node);
    } else if (outgoing === 0 && incoming > 0) {
      sinks.push(node);
    }
  });
  
  // If no explicit sources/sinks, use heuristics based on node type
  if (sources.length === 0) {
    const potentialSources = nodes.filter(n => n.type === "warehouse" || n.type === "airport" || n.type === "port");
    if (potentialSources.length > 0) {
      sources.push(...potentialSources);
    } else {
      sources.push(nodes[0]); // Default to first node
    }
  }
  
  if (sinks.length === 0) {
    const potentialSinks = nodes.filter(n => n.type === "retail");
    if (potentialSinks.length > 0) {
      sinks.push(...potentialSinks);
    } else {
      sinks.push(nodes[nodes.length - 1]); // Default to last node
    }
  }
  
  return { sources, sinks };
};

// Enhanced Min-Cost Flow algorithm implementation (simplified version of OR-Tools approach)
export const computeMinCostFlow = (nodes: Node[], routes: Route[]): Route[] => {
  // Identify sources and sinks
  const { sources, sinks } = identifySourcesAndSinks(nodes, routes);
  
  // Set up capacities based on node capacity
  const capacities = new Map<string, number>();
  nodes.forEach(node => {
    capacities.set(node.id, node.capacity || 1000);
  });
  
  // Sort routes by cost (ascending)
  const sortedRoutes = [...routes].sort((a, b) => (a.cost || 0) - (b.cost || 0));
  
  // Assign flows to routes using a greedy approach
  const resultRoutes = [...sortedRoutes].map(route => ({ ...route, volume: 0 }));
  
  // Calculate total supply/demand
  const totalSupply = sources.reduce((sum, node) => sum + (node.capacity || 1000), 0);
  const perSinkDemand = Math.floor(totalSupply / Math.max(sinks.length, 1));
  
  // Track remaining capacity at each node
  const remainingCapacity = new Map<string, number>(capacities);
  
  // First, handle direct source-to-sink routes (most efficient)
  resultRoutes.forEach(route => {
    const fromNode = nodes.find(n => n.id === route.from);
    const toNode = nodes.find(n => n.id === route.to);
    
    if (!fromNode || !toNode) return;
    
    const isSourceToSink = sources.some(s => s.id === fromNode.id) && sinks.some(s => s.id === toNode.id);
    
    if (isSourceToSink) {
      const sourceCapacity = remainingCapacity.get(fromNode.id) || 0;
      const sinkCapacity = remainingCapacity.get(toNode.id) || 0;
      const flow = Math.min(sourceCapacity, perSinkDemand, sinkCapacity);
      
      if (flow > 0) {
        route.volume = flow;
        route.isOptimized = true;
        
        // Update remaining capacities
        remainingCapacity.set(fromNode.id, sourceCapacity - flow);
        remainingCapacity.set(toNode.id, sinkCapacity - flow);
      }
    }
  });
  
  // Then, handle remaining flow with transshipment
  let iteration = 0;
  const maxIterations = 100; // Prevent infinite loops
  
  while (iteration < maxIterations) {
    let flowAssigned = false;
    
    for (const route of resultRoutes) {
      const fromCapacity = remainingCapacity.get(route.from) || 0;
      const toCapacity = remainingCapacity.get(route.to) || 0;
      
      if (fromCapacity > 0 && toCapacity > 0) {
        const flow = Math.min(fromCapacity, toCapacity, 100); // Cap flow at 100 units for this demo
        
        if (flow > 0) {
          route.volume += flow;
          route.isOptimized = true;
          
          // Update remaining capacities
          remainingCapacity.set(route.from, fromCapacity - flow);
          remainingCapacity.set(route.to, toCapacity - flow);
          
          flowAssigned = true;
        }
      }
    }
    
    if (!flowAssigned) break; // No more flow can be assigned
    iteration++;
  }
  
  return resultRoutes;
};

// Calculate network efficiency metrics
export const calculateNetworkMetrics = (nodes: Node[], routes: Route[]): {
  totalFlow: number;
  totalCost: number;
  averageUtilization: number;
  bottlenecks: {nodeId: string, utilization: number}[];
} => {
  const totalFlow = routes.reduce((sum, route) => sum + route.volume, 0);
  const totalCost = routes.reduce((sum, route) => sum + (route.volume * (route.cost || 0)), 0);
  
  // Calculate node utilization
  const nodeInFlow = new Map<string, number>();
  const nodeOutFlow = new Map<string, number>();
  
  routes.forEach(route => {
    nodeOutFlow.set(route.from, (nodeOutFlow.get(route.from) || 0) + route.volume);
    nodeInFlow.set(route.to, (nodeInFlow.get(route.to) || 0) + route.volume);
  });
  
  const nodeUtilization = new Map<string, number>();
  
  nodes.forEach(node => {
    const inFlow = nodeInFlow.get(node.id) || 0;
    const outFlow = nodeOutFlow.get(node.id) || 0;
    const totalNodeFlow = inFlow + outFlow;
    const utilization = totalNodeFlow / (2 * (node.capacity || 1000));
    nodeUtilization.set(node.id, utilization);
  });
  
  // Calculate average utilization
  let totalUtilization = 0;
  nodeUtilization.forEach(utilization => {
    totalUtilization += utilization;
  });
  const averageUtilization = totalUtilization / Math.max(1, nodeUtilization.size);
  
  // Identify bottlenecks (nodes with high utilization)
  const bottlenecks: {nodeId: string, utilization: number}[] = [];
  nodeUtilization.forEach((utilization, nodeId) => {
    if (utilization > 0.8) { // 80% or more is considered a bottleneck
      bottlenecks.push({ nodeId, utilization });
    }
  });
  
  return {
    totalFlow,
    totalCost,
    averageUtilization,
    bottlenecks
  };
};
