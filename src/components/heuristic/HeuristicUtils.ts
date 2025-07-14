import type { Node, Route } from "@/components/map/MapTypes";

// Simulated annealing parameters
export interface SimulatedAnnealingParams {
  initialTemperature: number;
  coolingRate: number;
  iterations: number;
}

// Utility functions for heuristic algorithm
export const createInitialRoutes = (nodes: Node[]): Route[] => {
  const routes: Route[] = [];
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].latitude - nodes[j].latitude;
      const dy = nodes[i].longitude - nodes[j].longitude;
      const distance = Math.sqrt(dx * dx + dy * dy) * 111;
      
      routes.push({
        id: crypto.randomUUID(),
        from: nodes[i].id,
        to: nodes[j].id,
        volume: Math.floor(Math.random() * 100) + 50,
        cost: Math.round(distance * 10),
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
  let currentSolution = routes.map(r => ({...r}));
  let bestSolution = [...currentSolution];
  
  let currentCost = calculateTotalCost(currentSolution);
  let bestCost = currentCost;
  
  let temperature = params.initialTemperature;
  
  let currentIteration = 0;
  const totalIterations = params.iterations;
  
  while (currentIteration < totalIterations) {
    const neighborSolution = currentSolution.map(route => {
      if (Math.random() < 0.3) {
        const currentVolume = route.volume || 0;
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
    
    const neighborCost = calculateTotalCost(neighborSolution);
    const costDifference = neighborCost - currentCost;
    
    if (
      costDifference < 0 || 
      Math.random() < Math.exp(-costDifference / temperature)
    ) {
      currentSolution = neighborSolution;
      currentCost = neighborCost;
      
      if (currentCost < bestCost) {
        bestSolution = [...currentSolution];
        bestCost = currentCost;
      }
    }
    
    temperature *= params.coolingRate;
    currentIteration++;
  }
  
  const initialCost = calculateTotalCost(routes);
  const improvementPercentage = ((initialCost - bestCost) / initialCost) * 100;
  
  bestSolution = bestSolution.map(route => ({...route, isOptimized: true}));
  
  return [bestSolution, improvementPercentage];
};
