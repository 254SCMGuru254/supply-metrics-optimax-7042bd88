// Central registry for all supply chain models and their formulas
// Used for dynamic UI, backend dispatch, and AI PDF reporting

export interface ModelFormula {
  id: string;
  name: string;
  description: string;
  inputs: { name: string; label: string; type: string; description?: string }[];
  backendFunction: string;
  aiPrompt: string;
}

export interface SupplyChainModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  formulas: ModelFormula[];
}

export const modelFormulaRegistry: SupplyChainModel[] = [
  {
    id: "inventory-management",
    name: "Inventory Management",
    description: "Optimize stock levels using EOQ, safety stock, ABC analysis, and multi-echelon models.",
    icon: "package",
    formulas: [
      {
        id: "eoq",
        name: "Economic Order Quantity (EOQ)",
        description: "Calculate optimal order quantity to minimize total inventory costs.",
        inputs: [
          { name: "annualDemand", label: "Annual Demand", type: "number" },
          { name: "orderingCost", label: "Ordering Cost", type: "number" },
          { name: "holdingCost", label: "Holding Cost", type: "number" },
          { name: "unitCost", label: "Unit Cost", type: "number" },
          { name: "leadTime", label: "Lead Time (days)", type: "number" },
          { name: "serviceLevel", label: "Service Level", type: "number" },
          { name: "daysPerYear", label: "Days per Year", type: "number" }
        ],
        backendFunction: "calculateEOQ",
        aiPrompt: "The user is analyzing their inventory using the EOQ model. Before using the app, they struggled with high inventory costs and stockouts. Explain how EOQ optimizes order quantity and reduces costs for their scenario."
      },
      {
        id: "safety-stock",
        name: "Safety Stock Calculation",
        description: "Calculate optimal safety stock to protect against demand and lead time variability.",
        inputs: [
          { name: "serviceLevel", label: "Service Level", type: "number" },
          { name: "demandStdDev", label: "Demand Std Dev", type: "number" },
          { name: "leadTime", label: "Lead Time (days)", type: "number" }
        ],
        backendFunction: "calculateSafetyStock",
        aiPrompt: "The user is calculating safety stock to prevent stockouts. Before using the app, they faced frequent shortages. Explain how safety stock calculation improves service levels."
      },
      {
        id: "abc-analysis",
        name: "ABC Analysis",
        description: "Categorize inventory items by value and importance.",
        inputs: [
          { name: "itemList", label: "Inventory Items", type: "list" }
        ],
        backendFunction: "calculateABCAnalysis",
        aiPrompt: "The user is performing ABC analysis to prioritize inventory management. Before using the app, they treated all items equally. Explain how ABC analysis focuses resources on high-value items."
      },
      {
        id: "multi-echelon",
        name: "Multi-Echelon Inventory Optimization",
        description: "Optimize inventory across multiple supply chain levels.",
        inputs: [
          { name: "networkData", label: "Network Data", type: "object" }
        ],
        backendFunction: "calculateMultiEchelon",
        aiPrompt: "The user is optimizing inventory across multiple echelons. Before using the app, they had excess stock at some locations and shortages at others. Explain how multi-echelon optimization balances inventory."
      }
    ]
  },
  {
    id: "route-optimization",
    name: "Route Optimization",
    description: "Optimize delivery routes using advanced algorithms and constraints.",
    icon: "truck",
    formulas: [
      {
        id: "tsp",
        name: "Traveling Salesman Problem (TSP)",
        description: "Find the shortest possible route that visits each location exactly once and returns to the origin.",
        inputs: [
          { name: "locations", label: "Locations", type: "list" }
        ],
        backendFunction: "solveTSP",
        aiPrompt: "The user is optimizing delivery routes using the TSP model. Before using the app, they had inefficient routes and high costs. Explain how TSP finds the shortest route and reduces travel distance."
      },
      {
        id: "vrp",
        name: "Vehicle Routing Problem (VRP)",
        description: "Optimize routes for multiple vehicles with capacity constraints.",
        inputs: [
          { name: "locations", label: "Locations", type: "list" },
          { name: "vehicleCount", label: "Number of Vehicles", type: "number" },
          { name: "vehicleCapacity", label: "Vehicle Capacity", type: "number" }
        ],
        backendFunction: "solveVRP",
        aiPrompt: "The user is solving the VRP to optimize multiple delivery vehicles. Before using the app, they struggled with underutilized vehicles and missed deliveries. Explain how VRP improves fleet efficiency."
      },
      {
        id: "vrptw",
        name: "VRP with Time Windows (VRPTW)",
        description: "Optimize routes with delivery time constraints.",
        inputs: [
          { name: "locations", label: "Locations", type: "list" },
          { name: "timeWindows", label: "Time Windows", type: "list" }
        ],
        backendFunction: "solveVRPTW",
        aiPrompt: "The user is optimizing routes with time windows. Before using the app, they missed delivery deadlines. Explain how VRPTW ensures on-time deliveries."
      }
    ]
  },
  {
    id: "center-of-gravity",
    name: "Center of Gravity",
    description: "Find optimal facility locations using weighted demand points and advanced distance formulas.",
    icon: "target",
    formulas: [
      {
        id: "weighted",
        name: "Weighted Average (COG)",
        description: "Standard demand-weighted center of gravity calculation.",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "list" }
        ],
        backendFunction: "calculateCOGWeighted",
        aiPrompt: "The user is finding the center of gravity for their network. Before using the app, they located facilities by guesswork. Explain how COG minimizes total distance to demand points."
      },
      {
        id: "haversine",
        name: "Haversine (Great Circle)",
        description: "Accounts for Earth curvature in distance calculation.",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "list" }
        ],
        backendFunction: "calculateCOGHaversine",
        aiPrompt: "The user is using the Haversine formula for global facility location. Before using the app, they ignored Earth's curvature. Explain how Haversine improves accuracy for long distances."
      },
      {
        id: "manhattan",
        name: "Manhattan Distance",
        description: "Grid-based distance calculation for urban logistics.",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "list" }
        ],
        backendFunction: "calculateCOGManhattan",
        aiPrompt: "The user is using Manhattan distance for city logistics. Before using the app, they underestimated urban travel. Explain how Manhattan distance models city grids."
      }
    ]
  },
  {
    id: "network-optimization",
    name: "Network Optimization",
    description: "Optimize supply chain networks using flow, cost, and resilience models.",
    icon: "network",
    formulas: [
      {
        id: "min-cost-flow",
        name: "Minimum Cost Flow",
        description: "Optimize flow through the network at minimum cost.",
        inputs: [
          { name: "networkGraph", label: "Network Graph", type: "object" }
        ],
        backendFunction: "solveMinCostFlow",
        aiPrompt: "The user is optimizing network flow for cost. Before using the app, they had high logistics costs. Explain how minimum cost flow reduces expenses."
      },
      {
        id: "max-flow",
        name: "Maximum Flow",
        description: "Find the maximum possible flow through the network.",
        inputs: [
          { name: "networkGraph", label: "Network Graph", type: "object" }
        ],
        backendFunction: "solveMaxFlow",
        aiPrompt: "The user is maximizing network throughput. Before using the app, they had bottlenecks. Explain how max flow identifies and removes bottlenecks."
      }
    ]
  },
  {
    id: "pricing",
    name: "Pricing & Business Value",
    description: "Analyze pricing strategies and calculate ROI for supply chain investments.",
    icon: "dollar-sign",
    formulas: [
      {
        id: "dynamic-pricing",
        name: "Dynamic Pricing",
        description: "Set prices based on demand, competition, and cost factors.",
        inputs: [
          { name: "basePrice", label: "Base Price", type: "number" },
          { name: "demandMultiplier", label: "Demand Multiplier", type: "number" },
          { name: "competitionFactor", label: "Competition Factor", type: "number" },
          { name: "cost", label: "Cost", type: "number" }
        ],
        backendFunction: "calculateDynamicPricing",
        aiPrompt: "The user is setting dynamic prices. Before using the app, they used static pricing. Explain how dynamic pricing adapts to market conditions."
      },
      {
        id: "roi",
        name: "ROI Calculation",
        description: "Calculate return on investment for supply chain projects.",
        inputs: [
          { name: "investment", label: "Investment Amount", type: "number" },
          { name: "annualReturn", label: "Annual Return", type: "number" },
          { name: "years", label: "Years", type: "number" }
        ],
        backendFunction: "calculateROI",
        aiPrompt: "The user is calculating ROI for a supply chain investment. Before using the app, they couldn't justify projects. Explain how ROI quantifies value."
      }
    ]
  },
  // ... Add other models and formulas here (Routing, COG, Network, Pricing, etc.)
]; 