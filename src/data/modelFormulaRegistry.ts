export interface SupplyChainModel {
  id: string;
  name: string;
  description: string;
  category: string;
  formulas: ModelFormula[];
}

export interface ModelFormula {
  id: string;
  name: string;
  description: string;
  formula: string;
  complexity: string;
  accuracy: string;
  useCase: string;
  backendFunction: string;
  inputs: ModelInput[];
  outputs: ModelOutput[];
}

export interface ModelInput {
  name: string;
  label: string;
  type: string;
  unit?: string;
  defaultValue?: any;
}

export interface ModelOutput {
  name: string;
  label: string;
  unit?: string;
}

export const modelFormulaRegistry: SupplyChainModel[] = [
  {
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
  },
  {
    id: "inventory-management", 
    name: "Inventory Management",
    description: "Inventory optimization and control algorithms",
    category: "Inventory",
    formulas: [
      {
        id: "basic-eoq",
        name: "Economic Order Quantity (EOQ)",
        description: "Determines optimal order quantity to minimize total inventory cost",
        formula: "EOQ = √(2DS/H)",
        complexity: "Basic",
        accuracy: "90-95%",
        useCase: "Standard inventory management",
        backendFunction: "calculateEOQ",
        inputs: [
          { name: "annualDemand", label: "Annual Demand", type: "number", unit: "units" },
          { name: "orderingCost", label: "Ordering Cost", type: "number", unit: "KES" },
          { name: "holdingCostRate", label: "Holding Cost Rate", type: "number", unit: "%", defaultValue: 0.25 },
          { name: "unitCost", label: "Unit Cost", type: "number", unit: "KES" }
        ],
        outputs: [
          { name: "optimalQuantity", label: "Optimal Order Quantity", unit: "units" },
          { name: "totalCost", label: "Total Annual Cost", unit: "KES" }
        ]
      },
      {
        id: "newsvendor-model",
        name: "Newsvendor Model",
        description: "Optimal inventory level under demand uncertainty",
        formula: "Q* = F⁻¹((p-c)/(p-s))",
        complexity: "Intermediate",
        accuracy: "80-90%",
        useCase: "Perishable goods inventory",
        backendFunction: "calculateNewsvendor",
        inputs: [
          { name: "mean", label: "Mean Demand", type: "number", unit: "units" },
          { name: "stdDev", label: "Standard Deviation", type: "number", unit: "units" },
          { name: "unitCost", label: "Unit Cost", type: "number", unit: "KES" },
          { name: "sellingPrice", label: "Selling Price", type: "number", unit: "KES" },
          { name: "salvageValue", label: "Salvage Value", type: "number", unit: "KES" }
        ],
        outputs: [
          { name: "optimalQuantity", label: "Optimal Stock Level", unit: "units" },
          { name: "expectedProfit", label: "Expected Profit", unit: "KES" }
        ]
      }
    ]
  },
  {
    id: "center-of-gravity",
    name: "Center of Gravity",
    description: "Facility location optimization using weighted demand points",
    category: "Location",
    formulas: [
      {
        id: "weighted-center-gravity",
        name: "Weighted Center of Gravity",
        description: "Finds optimal facility location based on weighted demand points",
        formula: "COG_x = Σ(Wi × Xi) / ΣWi, COG_y = Σ(Wi × Yi) / ΣWi",
        complexity: "Basic",
        accuracy: "85-95%",
        useCase: "Single facility location",
        backendFunction: "calculateWeightedCenterOfGravity",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "array" }
        ],
        outputs: [
          { name: "latitude", label: "Optimal Latitude", unit: "degrees" },
          { name: "longitude", label: "Optimal Longitude", unit: "degrees" }
        ]
      }
    ]
  },
  {
    id: "network-optimization",
    name: "Network Optimization", 
    description: "Supply chain network flow and design optimization",
    category: "Network",
    formulas: [
      {
        id: "min-cost-flow",
        name: "Minimum Cost Flow",
        description: "Finds minimum cost to satisfy demand while respecting capacity constraints",
        formula: "Minimize: Σ(cij × xij) subject to flow constraints",
        complexity: "Intermediate",
        accuracy: "95-100%",
        useCase: "Network flow optimization",
        backendFunction: "solveMinCostFlow",
        inputs: [
          { name: "networkGraph", label: "Network Graph", type: "object" },
          { name: "supply", label: "Supply Nodes", type: "array" },
          { name: "demand", label: "Demand Nodes", type: "array" }
        ],
        outputs: [
          { name: "totalCost", label: "Total Cost", unit: "KES" },
          { name: "flowPattern", label: "Optimal Flow Pattern" }
        ]
      }
    ]
  },
  {
    id: "heuristic-optimization",
    name: "Heuristic Optimization",
    description: "Advanced metaheuristic algorithms for complex optimization",
    category: "Algorithms",
    formulas: [
      {
        id: "simulated-annealing",
        name: "Simulated Annealing",
        description: "Probabilistic optimization technique inspired by metallurgy",
        formula: "P(accept) = exp(-ΔE/T)",
        complexity: "Advanced",
        accuracy: "80-95%",
        useCase: "Complex combinatorial optimization",
        backendFunction: "simulatedAnnealing",
        inputs: [
          { name: "initialTemperature", label: "Initial Temperature", type: "number", defaultValue: 1000 },
          { name: "coolingRate", label: "Cooling Rate", type: "number", defaultValue: 0.95 },
          { name: "iterations", label: "Max Iterations", type: "number", defaultValue: 1000 }
        ],
        outputs: [
          { name: "bestSolution", label: "Best Solution Found" },
          { name: "finalTemperature", label: "Final Temperature" }
        ]
      }
    ]
  },
  {
    id: "simulation",
    name: "Supply Chain Simulation",
    description: "Monte Carlo and discrete event simulation models",
    category: "Simulation", 
    formulas: [
      {
        id: "monte-carlo",
        name: "Monte Carlo Simulation",
        description: "Statistical simulation using random sampling",
        formula: "Result = (1/n) × Σf(xi) where xi ~ Distribution",
        complexity: "Intermediate",
        accuracy: "90-98%",
        useCase: "Risk analysis and uncertainty modeling",
        backendFunction: "monteCarloSimulation",
        inputs: [
          { name: "iterations", label: "Number of Simulations", type: "number", defaultValue: 10000 },
          { name: "distribution", label: "Probability Distribution", type: "string", defaultValue: "normal" },
          { name: "parameters", label: "Distribution Parameters", type: "object" }
        ],
        outputs: [
          { name: "mean", label: "Mean Result" },
          { name: "confidence95", label: "95% Confidence Interval" }
        ]
      }
    ]
  }
];
