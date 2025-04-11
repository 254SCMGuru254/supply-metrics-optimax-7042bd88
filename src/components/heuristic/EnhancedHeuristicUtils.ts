import { Node, Route } from "@/components/map/MapTypes";

// Enhanced simulated annealing parameters with cooling schedule options
export interface EnhancedSimulatedAnnealingParams {
  initialTemperature: number;
  coolingRate: number;
  iterations: number;
  coolingSchedule: "linear" | "exponential" | "logarithmic";
  acceptanceFunction: "metropolis" | "glauber";
  neighborhoodSize: number;
}

// Parameters for genetic algorithm
export interface GeneticAlgorithmParams {
  populationSize: number;
  generations: number;
  crossoverRate: number;
  mutationRate: number;
  elitismCount: number;
  selectionMethod: "tournament" | "roulette" | "rank";
  tournamentSize?: number;
}

// Parameters for multi-objective optimization
export interface MultiObjectiveParams {
  objectives: {
    name: string;
    weight: number;
    minimize: boolean;
  }[];
}

// Utility functions for heuristic algorithms
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

// Calculate multi-objective fitness
export const calculateMultiObjectiveFitness = (
  routes: Route[], 
  objectives: MultiObjectiveParams["objectives"]
): { [key: string]: number } => {
  const metrics: { [key: string]: number } = {};
  
  // Calculate base metrics
  const totalCost = routes.reduce((sum, route) => sum + ((route.volume || 0) * (route.cost || 0)), 0);
  const totalVolume = routes.reduce((sum, route) => sum + (route.volume || 0), 0);
  const maxVolume = Math.max(...routes.map(route => route.volume || 0));
  const totalTransitTime = routes.reduce((sum, route) => sum + (route.transitTime || 0) * (route.volume || 0), 0);
  
  // Calculate flow balance (how evenly distributed the flow is)
  const avgVolume = totalVolume / Math.max(routes.length, 1);
  const volumeVariance = routes.reduce((sum, route) => {
    const diff = (route.volume || 0) - avgVolume;
    return sum + (diff * diff);
  }, 0) / Math.max(routes.length, 1);
  const flowBalance = 1 / (1 + Math.sqrt(volumeVariance) / Math.max(avgVolume, 1));
  
  // Store all metrics
  metrics["cost"] = totalCost;
  metrics["volume"] = totalVolume;
  metrics["transitTime"] = totalTransitTime;
  metrics["maxVolume"] = maxVolume;
  metrics["flowBalance"] = flowBalance * 100; // Scale to 0-100
  
  // Calculate weighted sum based on objectives
  let weightedSum = 0;
  objectives.forEach(obj => {
    const value = metrics[obj.name];
    if (value !== undefined) {
      const normalizedValue = obj.minimize ? 100000 / (1 + value) : value;
      weightedSum += normalizedValue * obj.weight;
    }
  });
  
  metrics["weightedSum"] = weightedSum;
  
  return metrics;
};

// Enhanced simulated annealing with configurable cooling schedule
export const runEnhancedSimulatedAnnealing = (
  nodes: Node[], 
  routes: Route[], 
  params: EnhancedSimulatedAnnealingParams,
  objectives?: MultiObjectiveParams
): [Route[], number, { [key: string]: number }] => {
  // Clone routes to avoid mutating the original
  let currentSolution = routes.map(r => ({...r}));
  let bestSolution = [...currentSolution];
  
  // Initialize fitness based on objectives or default to total cost
  let currentFitness: { [key: string]: number };
  let bestFitness: { [key: string]: number };
  
  if (objectives && objectives.objectives.length > 0) {
    currentFitness = calculateMultiObjectiveFitness(currentSolution, objectives.objectives);
    bestFitness = {...currentFitness};
  } else {
    const currentCost = calculateTotalCost(currentSolution);
    currentFitness = { "cost": currentCost };
    bestFitness = { "cost": currentCost };
  }
  
  let temperature = params.initialTemperature;
  
  // Iterations counter for progress tracking
  let currentIteration = 0;
  const totalIterations = params.iterations;
  
  // Run the enhanced simulated annealing algorithm
  while (currentIteration < totalIterations) {
    // Generate a neighbor solution by randomly modifying flows
    const neighborSolution = generateNeighborSolution(currentSolution, params.neighborhoodSize);
    
    // Calculate fitness of neighbor solution
    const neighborFitness = objectives && objectives.objectives.length > 0
      ? calculateMultiObjectiveFitness(neighborSolution, objectives.objectives)
      : { "cost": calculateTotalCost(neighborSolution) };
    
    // Calculate the change in fitness (if multi-objective, use weighted sum)
    const fitnessKey = objectives && objectives.objectives.length > 0 ? "weightedSum" : "cost";
    const currentFitnessValue = currentFitness[fitnessKey];
    const neighborFitnessValue = neighborFitness[fitnessKey];
    
    // Adjust for minimization/maximization
    const fitnessDifference = objectives && objectives.objectives.length > 0
      ? neighborFitnessValue - currentFitnessValue // For weighted sum, higher is better
      : currentFitnessValue - neighborFitnessValue; // For cost, lower is better
    
    // Determine if we should accept the neighbor solution based on acceptance function
    let acceptProbability: number;
    if (params.acceptanceFunction === "metropolis") {
      // Metropolis criterion: e^(-ΔE/T)
      acceptProbability = Math.exp(fitnessDifference / temperature);
    } else {
      // Glauber criterion: 1/(1+e^(-ΔE/T))
      acceptProbability = 1 / (1 + Math.exp(-fitnessDifference / temperature));
    }
    
    if (
      fitnessDifference > 0 || // Better solution
      Math.random() < acceptProbability // Accept worse solution with probability
    ) {
      currentSolution = neighborSolution;
      currentFitness = neighborFitness;
      
      // Update best solution if current is better
      if (
        (objectives && objectives.objectives.length > 0 && neighborFitnessValue > bestFitness[fitnessKey]) ||
        (!objectives && neighborFitness["cost"] < bestFitness["cost"])
      ) {
        bestSolution = [...currentSolution];
        bestFitness = {...neighborFitness};
      }
    }
    
    // Cool temperature based on selected cooling schedule
    switch (params.coolingSchedule) {
      case "linear":
        temperature = params.initialTemperature * (1 - currentIteration / totalIterations);
        break;
      case "exponential":
        temperature *= params.coolingRate;
        break;
      case "logarithmic":
        temperature = params.initialTemperature / (1 + Math.log(1 + currentIteration));
        break;
      default:
        temperature *= params.coolingRate; // Default to exponential
    }
    
    currentIteration++;
  }
  
  // Calculate improvement percentage for reporting
  const initialFitness = objectives && objectives.objectives.length > 0
    ? calculateMultiObjectiveFitness(routes, objectives.objectives)
    : { "cost": calculateTotalCost(routes) };
    
  const fitnessKey = objectives && objectives.objectives.length > 0 ? "weightedSum" : "cost";
  
  let improvementPercentage: number;
  if (objectives && objectives.objectives.length > 0) {
    // For weighted sum, higher is better
    improvementPercentage = ((bestFitness[fitnessKey] - initialFitness[fitnessKey]) / initialFitness[fitnessKey]) * 100;
  } else {
    // For cost, lower is better
    improvementPercentage = ((initialFitness[fitnessKey] - bestFitness[fitnessKey]) / initialFitness[fitnessKey]) * 100;
  }
  
  // Set isOptimized flag for best solution routes
  bestSolution = bestSolution.map(route => ({...route, isOptimized: true}));
  
  return [bestSolution, improvementPercentage, bestFitness];
};

// Generate a neighbor solution - with configurable neighborhood size
function generateNeighborSolution(currentSolution: Route[], neighborhoodSize: number): Route[] {
  const neighborSolution = currentSolution.map(route => ({...route}));
  
  // Number of routes to potentially modify
  const numToModify = Math.max(1, Math.floor(neighborSolution.length * neighborhoodSize / 100));
  
  // Randomly select routes to modify
  for (let i = 0; i < numToModify; i++) {
    const routeIndex = Math.floor(Math.random() * neighborSolution.length);
    const route = neighborSolution[routeIndex];
    
    // 30% chance to modify a route
    if (Math.random() < 0.3) {
      const currentVolume = route.volume || 0;
      // Random adjustment between -30% and +30% of current volume
      const adjustment = currentVolume * (Math.random() * 0.6 - 0.3);
      const newVolume = Math.max(10, Math.round(currentVolume + adjustment));
      
      route.volume = newVolume;
      route.isOptimized = true;
    }
  }
  
  return neighborSolution;
}

// DEAP-like genetic algorithm implementation for route optimization
export const runGeneticAlgorithm = (
  nodes: Node[], 
  routes: Route[], 
  params: GeneticAlgorithmParams,
  objectives?: MultiObjectiveParams
): [Route[], number, { [key: string]: number }] => {
  // Generate initial population
  const population: Route[][] = [];
  for (let i = 0; i < params.populationSize; i++) {
    // Create a new solution by modifying the initial routes
    const solution = routes.map(r => ({...r}));
    
    // Random volume assignments
    solution.forEach(route => {
      // Random volume between 50% and 150% of original
      const originalVolume = routes.find(r => r.id === route.id)?.volume || 0;
      const newVolume = Math.max(10, Math.round(originalVolume * (0.5 + Math.random())));
      route.volume = newVolume;
    });
    
    population.push(solution);
  }
  
  // Track best solution
  let bestSolution = routes.map(r => ({...r}));
  let bestFitness: { [key: string]: number };
  
  if (objectives && objectives.objectives.length > 0) {
    bestFitness = calculateMultiObjectiveFitness(bestSolution, objectives.objectives);
  } else {
    bestFitness = { "cost": calculateTotalCost(bestSolution) };
  }
  
  // Run genetic algorithm
  for (let generation = 0; generation < params.generations; generation++) {
    // Evaluate fitness for all solutions
    const fitnessValues: { solution: Route[], fitness: { [key: string]: number } }[] = population.map(solution => {
      let fitness: { [key: string]: number };
      if (objectives && objectives.objectives.length > 0) {
        fitness = calculateMultiObjectiveFitness(solution, objectives.objectives);
      } else {
        fitness = { "cost": calculateTotalCost(solution) };
      }
      return { solution, fitness };
    });
    
    // Sort solutions by fitness (weighted sum for multi-objective, cost for single objective)
    const fitnessKey = objectives && objectives.objectives.length > 0 ? "weightedSum" : "cost";
    fitnessValues.sort((a, b) => {
      if (objectives && objectives.objectives.length > 0) {
        // For weighted sum, higher is better
        return b.fitness[fitnessKey] - a.fitness[fitnessKey];
      } else {
        // For cost, lower is better
        return a.fitness[fitnessKey] - b.fitness[fitnessKey];
      }
    });
    
    // Update best solution if needed
    const currentBest = fitnessValues[0];
    if ((objectives && objectives.objectives.length > 0 && currentBest.fitness[fitnessKey] > bestFitness[fitnessKey]) ||
        (!objectives && currentBest.fitness[fitnessKey] < bestFitness[fitnessKey])) {
      bestSolution = currentBest.solution.map(r => ({...r}));
      bestFitness = {...currentBest.fitness};
    }
    
    // Create new population
    const newPopulation: Route[][] = [];
    
    // Elitism - keep best solutions
    for (let i = 0; i < params.elitismCount; i++) {
      newPopulation.push(fitnessValues[i].solution.map(r => ({...r})));
    }
    
    // Fill the rest of the population with crossover and mutation
    while (newPopulation.length < params.populationSize) {
      // Select parents
      const parent1 = selectParent(fitnessValues, params);
      const parent2 = selectParent(fitnessValues, params);
      
      // Crossover
      if (Math.random() < params.crossoverRate) {
        const [child1, child2] = crossover(parent1, parent2);
        newPopulation.push(child1);
        if (newPopulation.length < params.populationSize) {
          newPopulation.push(child2);
        }
      } else {
        // No crossover, just copy parents
        newPopulation.push(parent1.map(r => ({...r})));
        if (newPopulation.length < params.populationSize) {
          newPopulation.push(parent2.map(r => ({...r})));
        }
      }
    }
    
    // Apply mutation to all except the elite solutions
    for (let i = params.elitismCount; i < newPopulation.length; i++) {
      mutate(newPopulation[i], params.mutationRate);
    }
    
    // Replace old population
    population.splice(0, population.length, ...newPopulation);
  }
  
  // Calculate improvement percentage
  const initialFitness = objectives && objectives.objectives.length > 0
    ? calculateMultiObjectiveFitness(routes, objectives.objectives)
    : { "cost": calculateTotalCost(routes) };
    
  const fitnessKey = objectives && objectives.objectives.length > 0 ? "weightedSum" : "cost";
  
  let improvementPercentage: number;
  if (objectives && objectives.objectives.length > 0) {
    // For weighted sum, higher is better
    improvementPercentage = ((bestFitness[fitnessKey] - initialFitness[fitnessKey]) / initialFitness[fitnessKey]) * 100;
  } else {
    // For cost, lower is better
    improvementPercentage = ((initialFitness[fitnessKey] - bestFitness[fitnessKey]) / initialFitness[fitnessKey]) * 100;
  }
  
  // Set isOptimized flag for best solution routes
  bestSolution = bestSolution.map(route => ({...route, isOptimized: true}));
  
  return [bestSolution, improvementPercentage, bestFitness];
};

// Parent selection based on method
function selectParent(fitnessValues: { solution: Route[], fitness: { [key: string]: number } }[], params: GeneticAlgorithmParams): Route[] {
  switch (params.selectionMethod) {
    case "tournament":
      // Tournament selection
      const tournamentSize = params.tournamentSize || Math.max(2, Math.floor(fitnessValues.length * 0.1));
      const participants: typeof fitnessValues = [];
      
      // Select random participants
      for (let i = 0; i < tournamentSize; i++) {
        const index = Math.floor(Math.random() * fitnessValues.length);
        participants.push(fitnessValues[index]);
      }
      
      // Find best participant
      let bestParticipant = participants[0];
      const fitnessKey = bestParticipant.fitness["weightedSum"] !== undefined ? "weightedSum" : "cost";
      
      for (let i = 1; i < participants.length; i++) {
        const isBetter = fitnessKey === "weightedSum" 
          ? participants[i].fitness[fitnessKey] > bestParticipant.fitness[fitnessKey]
          : participants[i].fitness[fitnessKey] < bestParticipant.fitness[fitnessKey];
        
        if (isBetter) {
          bestParticipant = participants[i];
        }
      }
      
      return bestParticipant.solution;
      
    case "roulette":
      // Roulette wheel selection
      const fitnessKey = fitnessValues[0].fitness["weightedSum"] !== undefined ? "weightedSum" : "cost";
      let totalFitness = 0;
      
      // Adjust fitness for minimization problems
      const adjustedFitness = fitnessValues.map(entry => {
        if (fitnessKey === "cost") {
          // For cost (minimization), invert fitness
          const max = Math.max(...fitnessValues.map(f => f.fitness[fitnessKey]));
          return { solution: entry.solution, adjustedValue: max - entry.fitness[fitnessKey] + 1 };
        } else {
          // For weighted sum (maximization), use as-is
          return { solution: entry.solution, adjustedValue: entry.fitness[fitnessKey] };
        }
      });
      
      totalFitness = adjustedFitness.reduce((sum, entry) => sum + entry.adjustedValue, 0);
      
      // Spin the wheel
      const spin = Math.random() * totalFitness;
      let runningTotal = 0;
      
      for (const entry of adjustedFitness) {
        runningTotal += entry.adjustedValue;
        if (runningTotal >= spin) {
          return entry.solution;
        }
      }
      
      return adjustedFitness[0].solution; // Fallback
      
    case "rank":
      // Rank-based selection
      const ranks = fitnessValues.map((_, i) => fitnessValues.length - i); // Higher rank for better solutions
      const totalRank = ranks.reduce((sum, rank) => sum + rank, 0);
      
      // Spin the wheel
      const rankSpin = Math.random() * totalRank;
      let runningRankTotal = 0;
      
      for (let i = 0; i < ranks.length; i++) {
        runningRankTotal += ranks[i];
        if (runningRankTotal >= rankSpin) {
          return fitnessValues[i].solution;
        }
      }
      
      return fitnessValues[0].solution; // Fallback
      
    default:
      // Default to random selection
      const index = Math.floor(Math.random() * fitnessValues.length);
      return fitnessValues[index].solution;
  }
}

// Crossover operation
function crossover(parent1: Route[], parent2: Route[]): [Route[], Route[]] {
  const child1: Route[] = [];
  const child2: Route[] = [];
  
  // Ensure both parents have the same route structure (they should based on our implementation)
  for (let i = 0; i < parent1.length; i++) {
    // Find corresponding route in parent2
    const route1 = parent1[i];
    const route2 = parent2.find(r => r.id === route1.id) || route1;
    
    // Create children with crossover
    const crossoverPoint = Math.random();
    const vol1 = route1.volume || 0;
    const vol2 = route2.volume || 0;
    
    child1.push({...route1, volume: Math.round(vol1 * crossoverPoint + vol2 * (1 - crossoverPoint))});
    child2.push({...route2, volume: Math.round(vol2 * crossoverPoint + vol1 * (1 - crossoverPoint))});
  }
  
  return [child1, child2];
}

// Mutation operation
function mutate(solution: Route[], mutationRate: number): void {
  for (const route of solution) {
    if (Math.random() < mutationRate) {
      // Apply mutation - adjust volume by up to ±20%
      const currentVolume = route.volume || 0;
      const adjustment = currentVolume * (Math.random() * 0.4 - 0.2);
      route.volume = Math.max(10, Math.round(currentVolume + adjustment));
    }
  }
}
