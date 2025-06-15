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
    description: "Facility location optimization using weighted demand points and various methods",
    category: "Location",
    formulas: [
      {
        id: "weighted-center-gravity",
        name: "Weighted Center of Gravity",
        description: "Optimal location based on demand points and weights",
        formula: "COG_x = Σ(Wi×Xi)/ΣWi, COG_y = Σ(Wi×Yi)/ΣWi",
        complexity: "Basic",
        accuracy: "85-95%",
        useCase: "Single facility, network design",
        backendFunction: "calculateWeightedCenterOfGravity",
        inputs: [{ name: "demandPoints", label: "Demand Points", type: "array" }],
        outputs: [
          { name: "latitude", label: "Optimal Latitude", unit: "degrees" },
          { name: "longitude", label: "Optimal Longitude", unit: "degrees" }
        ]
      },
      {
        id: "geometric-median-cog",
        name: "Geometric Median COG",
        description: "Finds the geometric median for minimized total distance to all points",
        formula: "Iterative Weiszfeld algorithm",
        complexity: "Intermediate",
        accuracy: "90-98%",
        useCase: "Robust facility location",
        backendFunction: "calculateGeometricMedianCog",
        inputs: [{ name: "demandPoints", label: "Demand Points", type: "array" }],
        outputs: [
          { name: "latitude", label: "Geometric Median Latitude", unit: "degrees" },
          { name: "longitude", label: "Geometric Median Longitude", unit: "degrees" }
        ]
      },
      {
        id: "economic-center-gravity",
        name: "Economic Center of Gravity",
        description: "Minimizes total cost instead of total distance",
        formula: "COG_x = Σ(Ci×Xi)/ΣCi, COG_y = Σ(Ci×Yi)/ΣCi",
        complexity: "Intermediate",
        accuracy: "89-97%",
        useCase: "Cost-sensitive COG",
        backendFunction: "calculateEconomicCenterOfGravity",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "array" },
          { name: "costs", label: "Cost Weights", type: "array" }
        ],
        outputs: [
          { name: "latitude", label: "Economic Latitude", unit: "degrees" },
          { name: "longitude", label: "Economic Longitude", unit: "degrees" }
        ]
      },
      {
        id: "haversine-cog",
        name: "Haversine Center of Gravity",
        description: "Calculates COG using Haversine distance for greater geo accuracy",
        formula: "Haversine distance minimization",
        complexity: "Intermediate",
        accuracy: "93-99%",
        useCase: "Large-scale geospatial COG",
        backendFunction: "calculateHaversineCog",
        inputs: [{ name: "demandPoints", label: "Demand Points", type: "array" }],
        outputs: [
          { name: "latitude", label: "COG Latitude", unit: "degrees" },
          { name: "longitude", label: "COG Longitude", unit: "degrees" }
        ]
      },
      {
        id: "manhattan-cog",
        name: "Manhattan Center of Gravity",
        description: "COG using sum of absolute differences (for grids/cities)",
        formula: "COG_x = median(Xi), COG_y = median(Yi)",
        complexity: "Basic",
        accuracy: "85-95%",
        useCase: "Urban/grid networks",
        backendFunction: "calculateManhattanCog",
        inputs: [{ name: "demandPoints", label: "Demand Points", type: "array" }],
        outputs: [
          { name: "latitude", label: "Manhattan Latitude", unit: "degrees" },
          { name: "longitude", label: "Manhattan Longitude", unit: "degrees" }
        ]
      },
      {
        id: "road-network-cog",
        name: "Road Network COG",
        description: "COG based on real road travel distances",
        formula: "Network-constrained COG using OpenStreetMap or similar",
        complexity: "Advanced",
        accuracy: "90-100%",
        useCase: "Large road-based logistics",
        backendFunction: "calculateRoadNetworkCog",
        inputs: [{ name: "demandPoints", label: "Demand Points", type: "array" }],
        outputs: [
          { name: "latitude", label: "Road COG Latitude", unit: "degrees" },
          { name: "longitude", label: "Road COG Longitude", unit: "degrees" }
        ]
      },
      {
        id: "multi-criteria-cog",
        name: "Multi-Criteria COG",
        description: "Optimizes location considering multiple weighted factors",
        formula: "Weighted multi-criteria scoring function",
        complexity: "Advanced",
        accuracy: "Variable",
        useCase: "Complex policy/criteria",
        backendFunction: "calculateMultiCriteriaCog",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "array" },
          { name: "weights", label: "Criteria Weights", type: "array" },
          { name: "criteriaValues", label: "Criteria Values", type: "array" }
        ],
        outputs: [
          { name: "latitude", label: "Optimal Latitude", unit: "degrees" },
          { name: "longitude", label: "Optimal Longitude", unit: "degrees" }
        ]
      },
      {
        id: "seasonal-dynamic-cog",
        name: "Seasonal/Dynamic COG",
        description: "COG changes over time due to demand seasonality",
        formula: "Iterative COG by time period",
        complexity: "Advanced",
        accuracy: "Variable",
        useCase: "Seasonal, agricultural, retail",
        backendFunction: "calculateSeasonalDynamicCog",
        inputs: [
          { name: "demandSeries", label: "Time Series Demand Points", type: "array" }
        ],
        outputs: [
          { name: "latitudeSeries", label: "Latitudes by Season", unit: "degrees" },
          { name: "longitudeSeries", label: "Longitudes by Season", unit: "degrees" }
        ]
      },
      {
        id: "risk-adjusted-cog",
        name: "Risk-Adjusted COG",
        description: "Location selection minimizing risk-adjusted total cost",
        formula: "COG with risk weights or VaR scenarios",
        complexity: "Advanced",
        accuracy: "Variable",
        useCase: "Risk/Resilience-focused design",
        backendFunction: "calculateRiskAdjustedCog",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "array" },
          { name: "riskScores", label: "Risk Metrics", type: "array" }
        ],
        outputs: [
          { name: "latitude", label: "Risk-Optimal Latitude", unit: "degrees" },
          { name: "longitude", label: "Risk-Optimal Longitude", unit: "degrees" }
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
  },
  {
    id: "facility-location",
    name: "Facility Location Optimization",
    description: "Mathematical models for optimal location of factories, warehouses, hubs",
    category: "Location",
    formulas: [
      {
        id: "p-median",
        name: "P-median Model",
        description: "Places p facilities to minimize total distance to demand points",
        formula: "min Σi Σj dij * xij subject to Σj xij = 1 ∀i, Σi xij ≤ 1 ∀j, Σj yj = p",
        complexity: "Advanced",
        accuracy: "90-99%",
        useCase: "Factory, warehouse, health facility placement",
        backendFunction: "solvePMedian",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "array" },
          { name: "facilityCandidates", label: "Candidate Locations", type: "array" },
          { name: "p", label: "Number of Facilities", type: "number" }
        ],
        outputs: [
          { name: "selectedFacilities", label: "Optimal Facilities", type: "array" },
          { name: "totalDistance", label: "Total Distance", unit: "km" }
        ]
      },
      {
        id: "capacitated-flp",
        name: "Capacitated Facility Location Problem (CFLP)",
        description: "Assigns demand to facilities under capacity limits",
        formula: "min Σi Σj cij*xij + Σj fj*yj subject to Σj xij=1, Σi di*xij ≤ Cj*yj",
        complexity: "Advanced",
        accuracy: "90-99%",
        useCase: "Capacitated logistics sites",
        backendFunction: "solveCFLP",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "array" },
          { name: "facilities", label: "Facilities", type: "array" },
          { name: "capacities", label: "Facility Capacities", type: "array" }
        ],
        outputs: [
          { name: "allocation", label: "Allocation", type: "array" },
          { name: "totalCost", label: "Total Cost", unit: "KES" }
        ]
      },
      {
        id: "hub-location",
        name: "Hub Location Problem",
        description: "Selects hubs and links in multi-tier networks",
        formula: "min Σi Σj Σk dijh*xijh + hub costs",
        complexity: "Advanced",
        accuracy: "95-100%",
        useCase: "National/regional hub design",
        backendFunction: "solveHubLocation",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "array" },
          { name: "hubCandidates", label: "Hub Candidates", type: "array" }
        ],
        outputs: [
          { name: "selectedHubs", label: "Optimal Hubs", type: "array" }
        ]
      },
      {
        id: "warehouse-location",
        name: "Warehouse Location Optimization",
        description: "Optimizes locations considering fixed/variable costs",
        formula: "min Σ fixed + Σ variable costs + Σ transport",
        complexity: "Intermediate",
        accuracy: "90-97%",
        useCase: "Warehouse networks",
        backendFunction: "solveWarehouseLocation",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "array" },
          { name: "warehouses", label: "Warehouse Candidates", type: "array" },
          { name: "costs", label: "Warehouse Costs", type: "array" }
        ],
        outputs: [
          { name: "selectedWarehouses", label: "Optimal Warehouses", type: "array" },
          { name: "totalCost", label: "Total Cost", unit: "KES" }
        ]
      },
      {
        id: "risk-based-flp",
        name: "Risk-Based Facility Location",
        description: "Selects facilities to minimize cost and disruption risk",
        formula: "minimize cost + risk * penalty",
        complexity: "Advanced",
        accuracy: "Variable",
        useCase: "Disaster/uncertainty planning",
        backendFunction: "solveRiskBasedFacilityLocation",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "array" },
          { name: "riskScores", label: "Risk Scores", type: "array" }
        ],
        outputs: [
          { name: "allocation", label: "Risk-Optimal Allocation", type: "array" }
        ]
      }
    ]
  },
  {
    id: "risk-management",
    name: "Risk Management",
    description: "Analytical and simulation-based risk models for supply chain",
    category: "Resilience",
    formulas: [
      {
        id: "var-risk",
        name: "Value-at-Risk (VaR)",
        description: "VaR for cost/disruption/loss",
        formula: "VaR = μ + z*σ (for normal distribution)",
        complexity: "Intermediate",
        accuracy: "Depends on input data",
        useCase: "Financial/operational risk",
        backendFunction: "calculateVaR",
        inputs: [
          { name: "mean", label: "Mean", type: "number" },
          { name: "stdDev", label: "Std Dev", type: "number" },
          { name: "confidence", label: "Confidence Level", type: "number" }
        ],
        outputs: [
          { name: "var", label: "Value at Risk", unit: "KES" }
        ]
      },
      {
        id: "scenario-risk",
        name: "Scenario Risk Analysis",
        description: "Monte Carlo scenario modeling",
        formula: "Simulate loss/disruption under scenarios",
        complexity: "Advanced",
        accuracy: "Depends on model",
        useCase: "Disruption, multi-echelon risk",
        backendFunction: "analyzeRiskScenario",
        inputs: [
          { name: "scenarios", label: "Scenarios", type: "array" }
        ],
        outputs: [
          { name: "riskDistribution", label: "Risk Distribution", type: "object" }
        ]
      }
    ]
  },
  {
    id: "cost-modeling",
    name: "Cost Modeling",
    description: "Comprehensive cost modeling, TCO, cost-benefit, and break-even",
    category: "Finance",
    formulas: [
      {
        id: "total-cost-ownership",
        name: "Total Cost of Ownership (TCO)",
        description: "Sum of all costs over lifecycle",
        formula: "TCO = Acquisition + Operating + Maintenance + Disposal",
        complexity: "Intermediate",
        accuracy: "Depends on data",
        useCase: "Purchasing, project planning",
        backendFunction: "calculateTCO",
        inputs: [
          { name: "acquisition", label: "Acquisition Cost", type: "number" },
          { name: "operating", label: "Operating Cost", type: "number" },
          { name: "maintenance", label: "Maintenance Cost", type: "number" },
          { name: "disposal", label: "Disposal Cost", type: "number" }
        ],
        outputs: [
          { name: "totalCost", label: "Total Cost", unit: "KES" }
        ]
      },
      {
        id: "break-even",
        name: "Break-even Analysis",
        description: "Point where total revenue equals cost",
        formula: "Q* = Fixed Cost / (Price - Variable Cost)",
        complexity: "Basic",
        accuracy: "99-100%",
        useCase: "Investment/project analysis",
        backendFunction: "calculateBreakEven",
        inputs: [
          { name: "fixedCost", label: "Fixed Cost", type: "number" },
          { name: "price", label: "Unit Price", type: "number" },
          { name: "variableCost", label: "Unit Variable Cost", type: "number" }
        ],
        outputs: [
          { name: "breakEvenQuantity", label: "Break-even Quantity", unit: "units" }
        ]
      },
      {
        id: "abc-costing",
        name: "Activity-Based Costing (ABC)",
        description: "Allocates overhead by activity",
        formula: "ABC = Σ(Activity Rate × Cost Driver Quantity)",
        complexity: "Advanced",
        accuracy: "95-100%",
        useCase: "Cost management",
        backendFunction: "calculateABCCosting",
        inputs: [
          { name: "activityRates", label: "Activity Rates", type: "array" },
          { name: "costDriverQuantities", label: "Cost Drivers", type: "array" }
        ],
        outputs: [
          { name: "totalCost", label: "Total Cost", unit: "KES" }
        ]
      }
    ]
  },
  {
    id: "fleet-management",
    name: "Fleet Management",
    description: "Optimization and analysis for fleet operations",
    category: "Fleet",
    formulas: [
      {
        id: "vehicle-assignment",
        name: "Vehicle Assignment Optimization",
        description: "Assigns optimal vehicles for tasks/routes",
        formula: "min Σi Σj cij*xij subject to assignment/availability/capacity",
        complexity: "Intermediate",
        accuracy: "Depends on model",
        useCase: "Daily planning, dispatch",
        backendFunction: "optimizeVehicleAssignment",
        inputs: [
          { name: "tasks", label: "Tasks", type: "array" },
          { name: "vehicles", label: "Vehicles", type: "array" }
        ],
        outputs: [
          { name: "assignments", label: "Assignment Grid", type: "array" }
        ]
      },
      {
        id: "maintenance-scheduling",
        name: "Maintenance Scheduling",
        description: "Minimizes downtime with optimal maintenance plans",
        formula: "Optimized maintenance windows using constraints",
        complexity: "Advanced",
        accuracy: "Depends on data",
        useCase: "Maintenance ops",
        backendFunction: "scheduleFleetMaintenance",
        inputs: [
          { name: "vehicles", label: "Vehicles", type: "array" },
          { name: "maintenanceWindows", label: "Maintenance Windows", type: "array" }
        ],
        outputs: [
          { name: "maintenancePlan", label: "Maintenance Plan", type: "object" }
        ]
      },
      {
        id: "fleet-utilization",
        name: "Fleet Utilization Calculation",
        description: "Calculates percentage utilization of fleet",
        formula: "UR = (Actual Fleet Load/Total Capacity)×100",
        complexity: "Basic",
        accuracy: "100%",
        useCase: "Performance metrics",
        backendFunction: "calculateFleetUtilization",
        inputs: [
          { name: "actualLoad", label: "Actual Fleet Load", type: "number" },
          { name: "totalCapacity", label: "Total Capacity", type: "number" }
        ],
        outputs: [
          { name: "utilizationPercentage", label: "Utilization (%)", unit: "%" }
        ]
      }
    ]
  }
];
