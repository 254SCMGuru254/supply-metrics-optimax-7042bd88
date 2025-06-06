
import type { Node, Route } from "@/components/NetworkMap";

// Simulated annealing parameters
export interface SimulatedAnnealingParams {
  initialTemperature: number;
  coolingRate: number;
  iterations: number;
}

// Utility functions for heuristic algorithm
export const createInitialRoutes = (nodes: Node[]): Route[] => {
  const routes: Route[] = [];
  
  // Create a fully connected network
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
        cost: Math.round(distance * 10), // Cost based on distance
        ownership: 'owned'
      });
    }
  }
  
  return routes;
};

// Calculate total cost of a solution
export const calculateTotalCost = (routes: Route[]): number => {
  return routes.reduce((sum, route) => {
    return sum + ((route.volume || 0) * (route.cost || 0));
  }, 0);
};

// Heuristic algorithm: Simulated Annealing
export const runSimulatedAnnealing = (
  nodes: Node[], 
  routes: Route[], 
  params: SimulatedAnnealingParams
): [Route[], number] => {
  // Clone routes to avoid mutating the original
  let currentSolution = routes.map(r => ({...r}));
  let bestSolution = [...currentSolution];
  
  let currentCost = calculateTotalCost(currentSolution);
  let bestCost = currentCost;
  
  let temperature = params.initialTemperature;
  
  // Iterations counter for progress tracking
  let currentIteration = 0;
  const totalIterations = params.iterations;
  
  // Run the simulated annealing algorithm
  while (currentIteration < totalIterations) {
    // Generate a neighbor solution by randomly modifying flows
    const neighborSolution = currentSolution.map(route => {
      // 30% chance to modify a route
      if (Math.random() < 0.3) {
        const currentVolume = route.volume || 0;
        // Random adjustment between -30% and +30% of current volume
        const adjustment = currentVolume * (Math.random() * 0.6 - 0.3);
        const newVolume = Math.max(10, Math.round(currentVolume + adjustment));
        
        return {
          ...route,
          volume: newVolume,
          isOptimized: true,
        };
      }
      return {...route};
    });
    
    // Calculate cost of neighbor solution
    const neighborCost = calculateTotalCost(neighborSolution);
    
    // Determine if we should accept the neighbor solution
    const costDifference = neighborCost - currentCost;
    
    if (
      costDifference < 0 || // Better solution
      Math.random() < Math.exp(-costDifference / temperature) // Accept worse solution with probability
    ) {
      currentSolution = neighborSolution;
      currentCost = neighborCost;
      
      // Update best solution if current is better
      if (currentCost < bestCost) {
        bestSolution = [...currentSolution];
        bestCost = currentCost;
      }
    }
    
    // Cool temperature
    temperature *= params.coolingRate;
    currentIteration++;
  }
  
  // Calculate improvement percentage
  const initialCost = calculateTotalCost(routes);
  const improvementPercentage = ((initialCost - bestCost) / initialCost) * 100;
  
  // Set isOptimized flag for best solution routes
  bestSolution = bestSolution.map(route => ({...route, isOptimized: true}));
  
  return [bestSolution, improvementPercentage];
};
