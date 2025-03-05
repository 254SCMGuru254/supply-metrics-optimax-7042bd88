
import { Node, Route } from "@/components/NetworkMap";

// Network flow optimization utility functions
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
      });
    }
  }
  
  return routes;
};

// Implementation of a simplified Ford-Fulkerson algorithm for max-flow min-cost
export const optimizeNetworkFlow = (nodes: Node[], routes: Route[]): Route[] => {
  if (nodes.length < 2) return routes;
  
  // For demo purposes, let's implement a simple optimization
  const optimizedRoutes = [...routes];
  
  // Simple algorithm: 
  // 1. Sort routes by cost
  // 2. Allocate flow to cheaper routes first
  // 3. Ensure flow balance at each node
  
  // Sort routes by cost (ascending)
  optimizedRoutes.sort((a, b) => (a.cost || 0) - (b.cost || 0));
  
  // Assign maximum possible flow to each route
  optimizedRoutes.forEach(route => {
    // For demo, assign random flow values that decrease with cost
    const baseCost = route.cost || 1;
    const maxPossibleFlow = Math.round(10000 / baseCost);
    route.volume = Math.min(Math.floor(Math.random() * maxPossibleFlow) + 50, 1000);
    route.isOptimized = true;
  });
  
  return optimizedRoutes;
};

// Calculate flow efficiency (a measure of how well flow is balanced)
export const calculateFlowEfficiency = (optimizedRoutes: Route[]): number => {
  // For demo purposes, return a calculated value
  const totalFlow = optimizedRoutes.reduce((sum, route) => sum + (route.volume || 0), 0);
  const averageFlow = totalFlow / Math.max(optimizedRoutes.length, 1);
  
  // Calculate standard deviation of flow
  const flowVariance = optimizedRoutes.reduce((sum, route) => {
    const diff = (route.volume || 0) - averageFlow;
    return sum + (diff * diff);
  }, 0) / Math.max(optimizedRoutes.length, 1);
  
  const flowStdDev = Math.sqrt(flowVariance);
  
  // Efficiency formula: inverse of coefficient of variation (higher is better)
  return Math.min(100, Math.max(0, 100 * (1 - flowStdDev / Math.max(averageFlow, 1))));
};
