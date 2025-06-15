
import { SupplyChainModel } from "../modelFormulaRegistry";

const routeOptimization: SupplyChainModel = {
  id: "route-optimization",
  name: "Route Optimization",
  description: "Vehicle routing and transportation optimization algorithms",
  category: "Transportation",
  formulas: [
    {
      id: "nearest-neighbor",
      name: "Nearest Neighbor Algorithm",
      description: "Simple heuristic for solving traveling salesman problems",
      formula: "d(i,j) = min{distance from current node i to unvisited node j}",
      complexity: "Basic",
      accuracy: "70-80%",
      useCase: "Quick routing solutions",
      backendFunction: "nearestNeighborAlgorithm",
      inputs: [
        { name: "nodes", label: "Route Nodes", type: "array" },
        { name: "startNode", label: "Starting Node", type: "number", defaultValue: 0 }
      ],
      outputs: [
        { name: "totalDistance", label: "Total Distance", unit: "km" },
        { name: "route", label: "Optimal Route" }
      ]
    },
    {
      id: "clarke-wright",
      name: "Clarke-Wright Savings Algorithm",
      description: "Calculates savings from combining routes",
      formula: "S(i,j) = d(0,i) + d(0,j) - d(i,j)",
      complexity: "Intermediate",
      accuracy: "75-85%",
      useCase: "Multi-vehicle routing",
      backendFunction: "clarkeWrightSavings",
      inputs: [
        { name: "nodes", label: "Customer Nodes", type: "array" },
        { name: "depot", label: "Depot Location", type: "number", defaultValue: 0 },
        { name: "vehicleCapacity", label: "Vehicle Capacity", type: "number", defaultValue: 1000 }
      ],
      outputs: [
        { name: "savings", label: "Total Savings", unit: "%" },
        { name: "routes", label: "Vehicle Routes" }
      ]
    },
    {
      id: "genetic-algorithm-vrp",
      name: "Genetic Algorithm for VRP",
      description: "Evolutionary algorithm for vehicle routing optimization",
      formula: "Fitness = 1 / (Total Distance + Penalty)",
      complexity: "Advanced",
      accuracy: "85-95%",
      useCase: "Complex multi-constraint routing",
      backendFunction: "geneticAlgorithmVRP",
      inputs: [
        { name: "populationSize", label: "Population Size", type: "number", defaultValue: 50 },
        { name: "generations", label: "Generations", type: "number", defaultValue: 100 },
        { name: "mutationRate", label: "Mutation Rate", type: "number", defaultValue: 0.1 }
      ],
      outputs: [
        { name: "bestFitness", label: "Best Fitness Score", unit: "%" },
        { name: "generations", label: "Generations Used" }
      ]
    }
  ]
};

export default routeOptimization;
