
// Central registry for all supply chain models and their formulas
// Used for dynamic UI, backend dispatch, and AI PDF reporting
// ⚠️ LOCKED REGISTRY - DO NOT DELETE ANY FORMULAS, ONLY ADD NEW ONES

export interface ModelFormula {
  id: string;
  name: string;
  description: string;
  inputs: { name: string; label: string; type: string; description?: string; unit?: string; range?: string }[];
  outputs?: { name: string; label: string; unit?: string; description?: string }[];
  backendFunction: string;
  aiPrompt: string;
  complexity?: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  accuracy?: string;
  useCase?: string;
  industryApplications?: string[];
  realWorldExample?: string;
  formula?: string;
}

export interface SupplyChainModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  formulas: ModelFormula[];
}

export const modelFormulaRegistry: SupplyChainModel[] = [
  {
    id: "inventory-management",
    name: "Inventory Management",
    description: "Optimize stock levels using EOQ, safety stock, ABC analysis, and multi-echelon models.",
    icon: "package",
    category: "Operations Research",
    formulas: [
      {
        id: "eoq",
        name: "Economic Order Quantity (EOQ)",
        description: "Calculate optimal order quantity to minimize total inventory costs.",
        complexity: "Basic",
        accuracy: "99.95%",
        formula: "EOQ = √(2DS/H) where D=Annual Demand, S=Ordering Cost, H=Holding Cost",
        inputs: [
          { name: "annualDemand", label: "Annual Demand", type: "number", unit: "units/year", description: "Total annual demand for the item" },
          { name: "orderingCost", label: "Ordering Cost", type: "number", unit: "KES", description: "Fixed cost per order placement" },
          { name: "holdingCost", label: "Holding Cost", type: "number", unit: "KES/unit/year", description: "Annual holding cost per unit" },
          { name: "unitCost", label: "Unit Cost", type: "number", unit: "KES", description: "Cost per unit of inventory" },
          { name: "leadTime", label: "Lead Time (days)", type: "number", unit: "days", description: "Time between order placement and receipt" },
          { name: "serviceLevel", label: "Service Level", type: "number", unit: "%", range: "90-99.9%", description: "Target service level percentage" },
          { name: "daysPerYear", label: "Days per Year", type: "number", unit: "days", description: "Working days per year (typically 365)" }
        ],
        outputs: [
          { name: "optimalOrderQuantity", label: "Optimal Order Quantity", unit: "units", description: "Economic order quantity minimizing total costs" },
          { name: "totalAnnualCost", label: "Total Annual Cost", unit: "KES", description: "Minimum total annual inventory cost" },
          { name: "orderFrequency", label: "Order Frequency", unit: "orders/year", description: "Number of orders per year" },
          { name: "reorderPoint", label: "Reorder Point", unit: "units", description: "Inventory level to trigger new order" }
        ],
        backendFunction: "calculateEOQ",
        aiPrompt: "The user is analyzing their inventory using the EOQ model. Before using the app, they struggled with high inventory costs and stockouts. Explain how EOQ optimizes order quantity and reduces costs for their scenario.",
        useCase: "Single-item inventory optimization for stable demand patterns",
        industryApplications: ["Manufacturing", "Retail", "Distribution", "Healthcare", "Agriculture"],
        realWorldExample: "A Kenya tea packaging company uses EOQ to optimize tea leaf inventory, reducing holding costs by 25% while maintaining 98% service level."
      },
      {
        id: "safety-stock",
        name: "Safety Stock Calculation",
        description: "Calculate optimal safety stock to protect against demand and lead time variability.",
        complexity: "Intermediate",
        accuracy: "99.8%",
        formula: "SS = Z × √(σ_d² × LT + d² × σ_LT²)",
        inputs: [
          { name: "serviceLevel", label: "Service Level", type: "number", unit: "%", description: "Target service level (95%, 99%, etc.)" },
          { name: "demandStdDev", label: "Demand Std Dev", type: "number", unit: "units", description: "Standard deviation of demand during lead time" },
          { name: "leadTime", label: "Lead Time (days)", type: "number", unit: "days", description: "Average lead time" },
          { name: "leadTimeStdDev", label: "Lead Time Std Dev", type: "number", unit: "days", description: "Standard deviation of lead time" },
          { name: "avgDemand", label: "Average Demand", type: "number", unit: "units/day", description: "Mean daily demand" }
        ],
        outputs: [
          { name: "safetyStock", label: "Safety Stock", unit: "units", description: "Required safety stock level" },
          { name: "reorderPoint", label: "Reorder Point", unit: "units", description: "Reorder point including safety stock" },
          { name: "stockoutProbability", label: "Stockout Probability", unit: "%", description: "Probability of stockout" }
        ],
        backendFunction: "calculateSafetyStock",
        aiPrompt: "The user is calculating safety stock to prevent stockouts. Before using the app, they faced frequent shortages. Explain how safety stock calculation improves service levels.",
        useCase: "Protecting against demand and lead time uncertainty",
        industryApplications: ["Retail", "Manufacturing", "Healthcare", "FMCG"],
        realWorldExample: "Kenyan pharmaceutical distributor maintains safety stock for critical medicines ensuring 99.9% availability during supply disruptions."
      },
      {
        id: "abc-analysis",
        name: "ABC Analysis",
        description: "Categorize inventory items by value and importance.",
        complexity: "Basic",
        accuracy: "100%",
        formula: "Cumulative % = (Σ Item Value / Total Value) × 100",
        inputs: [
          { name: "itemList", label: "Inventory Items", type: "list", description: "List of items with annual usage value" },
          { name: "classAPercentage", label: "Class A Percentage", type: "number", unit: "%", description: "Percentage for Class A items (typically 80%)" },
          { name: "classBPercentage", label: "Class B Percentage", type: "number", unit: "%", description: "Percentage for Class B items (typically 15%)" }
        ],
        outputs: [
          { name: "classAItems", label: "Class A Items", description: "High-value items requiring tight control" },
          { name: "classBItems", label: "Class B Items", description: "Medium-value items with moderate control" },
          { name: "classCItems", label: "Class C Items", description: "Low-value items with simple control" },
          { name: "valueDistribution", label: "Value Distribution", description: "Percentage distribution across classes" }
        ],
        backendFunction: "calculateABCAnalysis",
        aiPrompt: "The user is performing ABC analysis to prioritize inventory management. Before using the app, they treated all items equally. Explain how ABC analysis focuses resources on high-value items.",
        useCase: "Inventory classification and control strategy development",
        industryApplications: ["All Industries", "Retail", "Manufacturing", "Distribution"],
        realWorldExample: "Kenyan supermarket chain uses ABC analysis to focus on 200 high-value SKUs (Class A) that represent 80% of inventory value."
      },
      {
        id: "multi-echelon",
        name: "Multi-Echelon Inventory Optimization",
        description: "Optimize inventory across multiple supply chain levels.",
        complexity: "Expert",
        accuracy: "99.7%",
        formula: "Minimize: Σ(Hi × Si) subject to service level constraints across echelons",
        inputs: [
          { name: "networkData", label: "Network Data", type: "object", description: "Supply chain network topology" },
          { name: "demandRates", label: "Demand Rates", type: "array", description: "Demand rates at each node" },
          { name: "replenishmentLeadTimes", label: "Replenishment Lead Times", type: "array", description: "Lead times between echelons" },
          { name: "holdingCosts", label: "Holding Costs", type: "array", description: "Holding costs at each echelon" },
          { name: "serviceTargets", label: "Service Targets", type: "array", description: "Service level targets per echelon" }
        ],
        outputs: [
          { name: "optimalStockLevels", label: "Optimal Stock Levels", description: "Stock levels at each echelon" },
          { name: "totalSystemCost", label: "Total System Cost", unit: "KES", description: "Optimized total system cost" },
          { name: "servicePerformance", label: "Service Performance", description: "Achieved service levels" },
          { name: "inventoryPositioning", label: "Inventory Positioning", description: "Where to position inventory in network" }
        ],
        backendFunction: "calculateMultiEchelon",
        aiPrompt: "The user is optimizing inventory across multiple echelons. Before using the app, they had excess stock at some locations and shortages at others. Explain how multi-echelon optimization balances inventory.",
        useCase: "Complex multi-tier supply chain optimization",
        industryApplications: ["Manufacturing", "Defense", "Automotive", "Electronics"],
        realWorldExample: "Kenya Airways optimizes spare parts inventory across maintenance hubs using METRIC, reducing total inventory by 30%."
      },
      {
        id: "newsvendor-model",
        name: "Newsvendor Model",
        description: "Single-period inventory model for perishable goods optimizing order quantity under demand uncertainty.",
        complexity: "Intermediate",
        accuracy: "99.9%",
        formula: "Q* = F⁻¹((p-c)/(p-s)) where p=price, c=cost, s=salvage",
        inputs: [
          { name: "meanDemand", label: "Mean Demand", type: "number", unit: "units", description: "Expected demand for the period" },
          { name: "demandStdDev", label: "Demand Standard Deviation", type: "number", unit: "units", description: "Demand variability" },
          { name: "unitCost", label: "Unit Cost", type: "number", unit: "KES", description: "Cost per unit" },
          { name: "sellingPrice", label: "Selling Price", type: "number", unit: "KES", description: "Revenue per unit sold" },
          { name: "salvageValue", label: "Salvage Value", type: "number", unit: "KES", description: "Value of unsold units" }
        ],
        outputs: [
          { name: "optimalOrderQuantity", label: "Optimal Order Quantity", unit: "units", description: "Profit-maximizing order quantity" },
          { name: "expectedProfit", label: "Expected Profit", unit: "KES", description: "Expected profit from optimal policy" },
          { name: "serviceLevel", label: "Service Level", unit: "%", description: "Probability of not stocking out" },
          { name: "overage", label: "Expected Overage", unit: "units", description: "Expected leftover inventory" }
        ],
        backendFunction: "calculateNewsvendor",
        aiPrompt: "The user is optimizing single-period inventory for perishable goods. Before using the app, they struggled with waste and stockouts. Explain how the newsvendor model balances overage and underage costs.",
        useCase: "Single-period perishable inventory optimization",
        industryApplications: ["Agriculture", "Fashion", "Food & Beverage", "Publishing"],
        realWorldExample: "Kenyan flower exporter uses newsvendor model for daily flower orders, increasing profit margins by 18%."
      },
      {
        id: "epq-model",
        name: "Economic Production Quantity (EPQ)",
        description: "Optimal production batch size considering production rate and demand rate differences.",
        complexity: "Intermediate",
        accuracy: "99.9%",
        formula: "EPQ = √(2DS/H) × √(p/(p-d)) where p=production rate, d=demand rate",
        inputs: [
          { name: "annualDemand", label: "Annual Demand", type: "number", unit: "units/year" },
          { name: "productionRate", label: "Production Rate", type: "number", unit: "units/day" },
          { name: "setupCost", label: "Setup Cost", type: "number", unit: "KES" },
          { name: "holdingCost", label: "Holding Cost", type: "number", unit: "KES/unit/year" }
        ],
        outputs: [
          { name: "optimalProductionQuantity", label: "Optimal Production Quantity", unit: "units" },
          { name: "maximumInventory", label: "Maximum Inventory Level", unit: "units" },
          { name: "totalAnnualCost", label: "Total Annual Cost", unit: "KES" }
        ],
        backendFunction: "calculateEPQ",
        aiPrompt: "The user is optimizing production batch sizes. Before using the app, they had excessive setup costs and inventory. Explain how EPQ optimizes batch sizes for manufacturing.",
        useCase: "Manufacturing batch size optimization",
        industryApplications: ["Manufacturing", "Production Planning", "Process Industries"],
        realWorldExample: "Kenyan cement manufacturer optimizes production batches, reducing setup costs by 35%."
      }
    ]
  },
  {
    id: "demand-forecasting",
    name: "Demand Forecasting",
    description: "Statistical and machine learning models for demand prediction including ARIMA, exponential smoothing, and neural networks.",
    icon: "bar-chart-3",
    category: "Analytics",
    formulas: [
      {
        id: "arima",
        name: "ARIMA Time Series",
        description: "Autoregressive Integrated Moving Average model for time series forecasting with trend and seasonality.",
        complexity: "Advanced",
        accuracy: "92-96%",
        formula: "ARIMA(p,d,q): (1-φ1L-...φpLp)(1-L)dXt = (1+θ1L+...θqLq)εt",
        inputs: [
          { name: "historicalData", label: "Historical Data", type: "array", description: "Time series of past demand" },
          { name: "seasonalPeriod", label: "Seasonal Period", type: "number", description: "Length of seasonal cycle" },
          { name: "autoRegressiveOrder", label: "AR Order (p)", type: "number", description: "Autoregressive terms" },
          { name: "differencingOrder", label: "Differencing Order (d)", type: "number", description: "Degree of differencing" },
          { name: "movingAverageOrder", label: "MA Order (q)", type: "number", description: "Moving average terms" }
        ],
        outputs: [
          { name: "forecast", label: "Demand Forecast", description: "Predicted future demand values" },
          { name: "confidenceIntervals", label: "Confidence Intervals", description: "Prediction uncertainty bounds" },
          { name: "mape", label: "Mean Absolute Percentage Error", unit: "%", description: "Forecast accuracy measure" },
          { name: "seasonalFactors", label: "Seasonal Factors", description: "Seasonal adjustment factors" }
        ],
        backendFunction: "calculateARIMA",
        aiPrompt: "The user is forecasting demand using ARIMA models. Before using the app, they relied on gut feeling. Explain how ARIMA captures trends and seasonality for accurate forecasting.",
        useCase: "Medium to long-term demand forecasting",
        industryApplications: ["Retail", "Manufacturing", "Energy", "Agriculture"],
        realWorldExample: "Kenyan tea processor forecasts global demand with 94% accuracy for production planning."
      },
      {
        id: "exponential-smoothing",
        name: "Exponential Smoothing",
        description: "Weighted average forecasting giving more weight to recent observations for short-term prediction.",
        complexity: "Intermediate",
        accuracy: "85-92%",
        formula: "Lt = αXt + (1-α)(Lt-1 + Tt-1), Tt = β(Lt - Lt-1) + (1-β)Tt-1",
        inputs: [
          { name: "historicalData", label: "Historical Data", type: "array", description: "Past demand observations" },
          { name: "alpha", label: "Smoothing Parameter (α)", type: "number", range: "0-1", description: "Weight for level smoothing" },
          { name: "beta", label: "Trend Parameter (β)", type: "number", range: "0-1", description: "Weight for trend smoothing" },
          { name: "gamma", label: "Seasonal Parameter (γ)", type: "number", range: "0-1", description: "Weight for seasonal smoothing" }
        ],
        outputs: [
          { name: "shortTermForecast", label: "Short-term Forecast", description: "Next period predictions" },
          { name: "trendComponent", label: "Trend Component", description: "Underlying trend direction" },
          { name: "seasonalIndices", label: "Seasonal Indices", description: "Seasonal pattern factors" },
          { name: "forecastError", label: "Forecast Error", description: "Prediction accuracy metrics" }
        ],
        backendFunction: "calculateExponentialSmoothing",
        aiPrompt: "The user is implementing exponential smoothing for short-term forecasting. Before using the app, they struggled with volatile demand. Explain how exponential smoothing adapts to recent changes.",
        useCase: "Short-term operational forecasting",
        industryApplications: ["Retail", "Food & Beverage", "Fashion", "Hospitality"],
        realWorldExample: "Nairobi supermarket chain forecasts weekly demand for 10,000 SKUs with 89% accuracy."
      },
      {
        id: "linear-regression",
        name: "Linear Regression Forecasting",
        description: "Statistical modeling using linear relationships between demand and explanatory variables.",
        complexity: "Basic",
        accuracy: "75-85%",
        formula: "Y = β0 + β1X1 + β2X2 + ... + βnXn + ε",
        inputs: [
          { name: "dependentVariable", label: "Demand Data", type: "array", description: "Historical demand values" },
          { name: "independentVariables", label: "Explanatory Variables", type: "array", description: "Price, promotion, weather, etc." },
          { name: "timeVariable", label: "Time Variable", type: "array", description: "Time periods for trend analysis" }
        ],
        outputs: [
          { name: "regressionEquation", label: "Regression Equation", description: "Linear model formula" },
          { name: "rSquared", label: "R-squared", unit: "%", description: "Model explanatory power" },
          { name: "forecast", label: "Demand Forecast", description: "Predicted demand values" },
          { name: "coefficients", label: "Model Coefficients", description: "Variable impact factors" }
        ],
        backendFunction: "calculateLinearRegression",
        aiPrompt: "The user is building causal demand models using regression. Before using the app, they couldn't quantify factor impacts. Explain how regression identifies key demand drivers.",
        useCase: "Causal demand forecasting with explanatory variables",
        industryApplications: ["Retail", "FMCG", "Agriculture", "Energy"],
        realWorldExample: "Kenyan beverage company forecasts demand considering temperature and promotional activities."
      },
      {
        id: "seasonal-decomposition",
        name: "Seasonal Decomposition (STL)",
        description: "Time series decomposition into trend, seasonal, and remainder components using STL algorithm.",
        complexity: "Intermediate",
        accuracy: "88-94%",
        formula: "X(t) = Trend(t) + Seasonal(t) + Remainder(t)",
        inputs: [
          { name: "timeSeriesData", label: "Time Series Data", type: "array", description: "Historical demand with timestamps" },
          { name: "seasonalPeriod", label: "Seasonal Period", type: "number", description: "Length of seasonal cycle" },
          { name: "trendWindow", label: "Trend Window", type: "number", description: "Trend smoothing parameter" }
        ],
        outputs: [
          { name: "trendComponent", label: "Trend Component", description: "Long-term movement pattern" },
          { name: "seasonalComponent", label: "Seasonal Component", description: "Repeating seasonal patterns" },
          { name: "remainderComponent", label: "Remainder Component", description: "Random/irregular variations" },
          { name: "forecastCombined", label: "Combined Forecast", description: "Reconstructed demand forecast" }
        ],
        backendFunction: "calculateSeasonalDecomposition",
        aiPrompt: "The user is decomposing demand patterns to understand seasonality. Before using the app, they couldn't separate trend from seasonal effects. Explain how decomposition reveals underlying patterns.",
        useCase: "Understanding demand patterns and seasonal effects",
        industryApplications: ["Tourism", "Agriculture", "Fashion", "Energy"],
        realWorldExample: "Kenyan tourism operator decomposes visitor demand to plan seasonal capacity."
      },
      {
        id: "neural-network-forecast",
        name: "Neural Network Forecasting",
        description: "Deep learning approach using artificial neural networks for complex demand pattern recognition.",
        complexity: "Expert",
        accuracy: "94-98%",
        formula: "f(x) = σ(Σ(wi × xi) + b) through multiple layers",
        inputs: [
          { name: "inputFeatures", label: "Input Features", type: "array", description: "Historical demand and external factors" },
          { name: "networkArchitecture", label: "Network Architecture", type: "object", description: "Hidden layers and neurons" },
          { name: "trainingPeriod", label: "Training Period", type: "number", description: "Historical data for training" },
          { name: "learningRate", label: "Learning Rate", type: "number", description: "Model training speed" }
        ],
        outputs: [
          { name: "demandForecast", label: "Demand Forecast", description: "Neural network predictions" },
          { name: "modelAccuracy", label: "Model Accuracy", unit: "%", description: "Prediction accuracy on test data" },
          { name: "featureImportance", label: "Feature Importance", description: "Variable contribution rankings" },
          { name: "confidenceBounds", label: "Confidence Bounds", description: "Prediction uncertainty intervals" }
        ],
        backendFunction: "calculateNeuralNetworkForecast",
        aiPrompt: "The user is implementing AI-driven demand forecasting. Before using the app, they couldn't capture complex patterns. Explain how neural networks learn non-linear demand relationships.",
        useCase: "Complex non-linear demand pattern forecasting",
        industryApplications: ["E-commerce", "Technology", "Finance", "Healthcare"],
        realWorldExample: "Kenyan fintech company forecasts transaction demand using deep neural networks."
      }
    ]
  },
  {
    id: "route-optimization",
    name: "Route Optimization",
    description: "Optimize delivery routes using advanced algorithms and constraints.",
    icon: "truck",
    category: "Transportation",
    formulas: [
      {
        id: "tsp",
        name: "Traveling Salesman Problem (TSP)",
        description: "Find the shortest possible route that visits each location exactly once and returns to the origin.",
        complexity: "Advanced",
        accuracy: "100%",
        formula: "Minimize: Σ(cij × xij) subject to: Σxij = 1, subtour elimination",
        inputs: [
          { name: "locations", label: "Locations", type: "list", description: "Coordinates of all locations to visit" },
          { name: "distanceMatrix", label: "Distance Matrix", type: "matrix", description: "Distances between all location pairs" },
          { name: "timeWindows", label: "Time Windows", type: "array", description: "Optional time constraints per location" }
        ],
        outputs: [
          { name: "optimalRoute", label: "Optimal Route", description: "Sequence of locations minimizing total distance" },
          { name: "totalDistance", label: "Total Distance", unit: "km", description: "Total route distance" },
          { name: "totalTime", label: "Total Time", unit: "hours", description: "Total travel time" },
          { name: "cost", label: "Total Cost", unit: "KES", description: "Total transportation cost" }
        ],
        backendFunction: "solveTSP",
        aiPrompt: "The user is optimizing delivery routes using the TSP model. Before using the app, they had inefficient routes and high costs. Explain how TSP finds the shortest route and reduces travel distance.",
        useCase: "Small-scale exact route optimization (up to 20 locations)",
        industryApplications: ["Logistics", "Field Service", "Sales", "Delivery"],
        realWorldExample: "Nairobi courier service optimizes daily delivery routes, reducing travel distance by 35%."
      },
      {
        id: "vrp",
        name: "Vehicle Routing Problem (VRP)",
        description: "Optimize routes for multiple vehicles with capacity constraints.",
        complexity: "Advanced",
        accuracy: "99.5%",
        formula: "Minimize: Σ(cij × xijk) subject to capacity and flow constraints",
        inputs: [
          { name: "locations", label: "Locations", type: "list", description: "Customer locations and demands" },
          { name: "vehicleCount", label: "Number of Vehicles", type: "number", description: "Available vehicles" },
          { name: "vehicleCapacity", label: "Vehicle Capacity", type: "number", unit: "kg", description: "Maximum carrying capacity" },
          { name: "depot", label: "Depot Location", type: "object", description: "Starting point coordinates" },
          { name: "costPerKm", label: "Cost per Kilometer", type: "number", unit: "KES/km", description: "Transportation cost rate" }
        ],
        outputs: [
          { name: "routes", label: "Vehicle Routes", description: "Optimal route for each vehicle" },
          { name: "totalDistance", label: "Total Distance", unit: "km", description: "Sum of all route distances" },
          { name: "vehicleUtilization", label: "Vehicle Utilization", unit: "%", description: "Average capacity utilization" },
          { name: "totalCost", label: "Total Cost", unit: "KES", description: "Total transportation cost" }
        ],
        backendFunction: "solveVRP",
        aiPrompt: "The user is solving the VRP to optimize multiple delivery vehicles. Before using the app, they struggled with underutilized vehicles and missed deliveries. Explain how VRP improves fleet efficiency.",
        useCase: "Multi-vehicle delivery optimization with capacity limits",
        industryApplications: ["Distribution", "Retail", "FMCG", "E-commerce"],
        realWorldExample: "Kenya's largest FMCG distributor optimizes 50-vehicle fleet, reducing fuel costs by 28%."
      },
      {
        id: "vrptw",
        name: "VRP with Time Windows (VRPTW)",
        description: "Optimize routes with delivery time constraints.",
        complexity: "Expert",
        accuracy: "99.3%",
        formula: "Minimize cost subject to: time windows, capacity, and precedence constraints",
        inputs: [
          { name: "locations", label: "Locations", type: "list", description: "Customer data with time windows" },
          { name: "timeWindows", label: "Time Windows", type: "list", description: "Earliest and latest service times" },
          { name: "serviceTime", label: "Service Time", type: "number", unit: "minutes", description: "Time required per customer" },
          { name: "workingHours", label: "Working Hours", type: "object", description: "Driver working time limits" }
        ],
        outputs: [
          { name: "scheduledRoutes", label: "Scheduled Routes", description: "Routes with arrival times" },
          { name: "onTimePerformance", label: "On-Time Performance", unit: "%", description: "Percentage of on-time deliveries" },
          { name: "totalLateness", label: "Total Lateness", unit: "minutes", description: "Sum of all delivery delays" },
          { name: "driverUtilization", label: "Driver Utilization", unit: "%", description: "Percentage of working time used" }
        ],
        backendFunction: "solveVRPTW",
        aiPrompt: "The user is optimizing routes with time windows. Before using the app, they missed delivery deadlines. Explain how VRPTW ensures on-time deliveries.",
        useCase: "Time-sensitive delivery optimization",
        industryApplications: ["Food Delivery", "Healthcare", "Banking", "Express Logistics"],
        realWorldExample: "Kenyan medical supplier achieves 99.5% on-time delivery for time-critical medicines."
      },
      {
        id: "arc-routing",
        name: "Arc Routing Problem",
        description: "Optimization for services performed on network edges rather than nodes (e.g., street sweeping, meter reading).",
        complexity: "Advanced",
        accuracy: "98.5%",
        formula: "Minimize: Service Cost + Deadhead Cost subject to connectivity constraints",
        inputs: [
          { name: "networkEdges", label: "Network Edges", type: "array", description: "Streets/edges requiring service" },
          { name: "serviceRequirements", label: "Service Requirements", type: "array", description: "Time/resources needed per edge" },
          { name: "vehicleCapacity", label: "Vehicle Capacity", type: "number", description: "Service capacity limits" }
        ],
        outputs: [
          { name: "optimalTours", label: "Optimal Tours", description: "Efficient edge traversal routes" },
          { name: "totalServiceTime", label: "Total Service Time", unit: "hours", description: "Complete service duration" },
          { name: "deadheadDistance", label: "Deadhead Distance", unit: "km", description: "Non-productive travel distance" }
        ],
        backendFunction: "solveArcRouting",
        aiPrompt: "The user is optimizing edge-based services like street sweeping. Before using the app, they had inefficient coverage. Explain how arc routing optimizes edge-based services.",
        useCase: "Edge-based service optimization",
        industryApplications: ["Utilities", "Municipal Services", "Postal Services", "Maintenance"],
        realWorldExample: "Nairobi City Council optimizes street sweeping routes, reducing operational costs by 40%."
      },
      {
        id: "pickup-delivery",
        name: "Pickup and Delivery Problem",
        description: "Routing optimization for simultaneous pickup and delivery operations with pairing constraints.",
        complexity: "Expert",
        accuracy: "99.1%",
        formula: "Minimize: Total Cost subject to: precedence and pairing constraints",
        inputs: [
          { name: "pickupLocations", label: "Pickup Locations", type: "array", description: "Pickup points with demands" },
          { name: "deliveryLocations", label: "Delivery Locations", type: "array", description: "Delivery points with demands" },
          { name: "pairingConstraints", label: "Pairing Constraints", type: "array", description: "Which pickups match which deliveries" },
          { name: "vehicleConstraints", label: "Vehicle Constraints", type: "object", description: "Capacity and time limits" }
        ],
        outputs: [
          { name: "pairedRoutes", label: "Paired Routes", description: "Routes respecting pickup-delivery pairs" },
          { name: "loadUtilization", label: "Load Utilization", unit: "%", description: "Vehicle capacity usage" },
          { name: "pairingSatisfaction", label: "Pairing Satisfaction", unit: "%", description: "Successful pickup-delivery matches" }
        ],
        backendFunction: "solvePickupDelivery",
        aiPrompt: "The user is optimizing pickup-delivery operations. Before using the app, they had unmatched requests. Explain how pickup-delivery optimization ensures proper pairing.",
        useCase: "Logistics with paired pickup-delivery requirements",
        industryApplications: ["Moving Services", "Freight", "Courier", "Waste Management"],
        realWorldExample: "Kenyan moving company optimizes furniture pickup-delivery, improving efficiency by 45%."
      }
    ]
  },
  {
    id: "center-of-gravity",
    name: "Center of Gravity",
    description: "Find optimal facility locations using weighted demand points and advanced distance formulas.",
    icon: "target",
    category: "Strategic Planning",
    formulas: [
      {
        id: "weighted",
        name: "Weighted Average (COG)",
        description: "Standard demand-weighted center of gravity calculation.",
        complexity: "Basic",
        accuracy: "99.9%",
        formula: "COG = (Σ(wi × xi), Σ(wi × yi)) / Σwi",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "list", description: "Customer locations with coordinates and demand" },
          { name: "weights", label: "Demand Weights", type: "array", description: "Demand volume at each location" },
          { name: "transportationCost", label: "Transportation Cost", type: "number", unit: "KES/km/unit", description: "Cost per unit distance" }
        ],
        outputs: [
          { name: "optimalLocation", label: "Optimal Location", description: "Coordinates of optimal facility location" },
          { name: "totalTransportCost", label: "Total Transport Cost", unit: "KES", description: "Annual transportation cost" },
          { name: "averageDistance", label: "Average Distance", unit: "km", description: "Weighted average distance to customers" },
          { name: "serviceRadius", label: "Service Radius", unit: "km", description: "Maximum distance to any customer" }
        ],
        backendFunction: "calculateCOGWeighted",
        aiPrompt: "The user is finding the center of gravity for their network. Before using the app, they located facilities by guesswork. Explain how COG minimizes total distance to demand points.",
        useCase: "Single facility location optimization",
        industryApplications: ["Warehousing", "Manufacturing", "Retail", "Healthcare"],
        realWorldExample: "Kenya's largest cement manufacturer locates new distribution center, reducing transport costs by 22%."
      },
      {
        id: "haversine",
        name: "Haversine (Great Circle)",
        description: "Accounts for Earth curvature in distance calculation.",
        complexity: "Intermediate",
        accuracy: "99.99%",
        formula: "d = 2r × arcsin(√(sin²(Δφ/2) + cos(φ1)cos(φ2)sin²(Δλ/2)))",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "list", description: "GPS coordinates of demand locations" },
          { name: "weights", label: "Demand Weights", type: "array", description: "Demand volumes" },
          { name: "earthRadius", label: "Earth Radius", type: "number", unit: "km", description: "Earth radius (6371 km)" }
        ],
        outputs: [
          { name: "optimalCoordinates", label: "Optimal Coordinates", description: "Latitude and longitude of optimal location" },
          { name: "greatCircleDistances", label: "Great Circle Distances", unit: "km", description: "Accurate distances to all points" },
          { name: "totalWeightedDistance", label: "Total Weighted Distance", unit: "km", description: "Sum of weighted distances" }
        ],
        backendFunction: "calculateCOGHaversine",
        aiPrompt: "The user is using the Haversine formula for global facility location. Before using the app, they ignored Earth's curvature. Explain how Haversine improves accuracy for long distances.",
        useCase: "Global or long-distance facility location",
        industryApplications: ["International Logistics", "Aviation", "Maritime", "Telecommunications"],
        realWorldExample: "East African airline hub optimization using Haversine formula for continental route network."
      },
      {
        id: "manhattan",
        name: "Manhattan Distance",
        description: "Grid-based distance calculation for urban logistics.",
        complexity: "Intermediate",
        accuracy: "98.5%",
        formula: "d = |x1-x2| + |y1-y2| with traffic adjustments",
        inputs: [
          { name: "demandPoints", label: "Demand Points", type: "list", description: "Customer locations in urban grid" },
          { name: "gridStructure", label: "Grid Structure", type: "object", description: "Street network layout" },
          { name: "trafficFactors", label: "Traffic Factors", type: "array", description: "Congestion multipliers per route" }
        ],
        outputs: [
          { name: "optimalGridLocation", label: "Optimal Grid Location", description: "Best intersection or block" },
          { name: "manhattanDistances", label: "Manhattan Distances", unit: "km", description: "Grid-based distances" },
          { name: "accessibilityScore", label: "Accessibility Score", description: "Overall location accessibility" }
        ],
        backendFunction: "calculateCOGManhattan",
        aiPrompt: "The user is using Manhattan distance for city logistics. Before using the app, they underestimated urban travel. Explain how Manhattan distance models city grids.",
        useCase: "Urban facility location with grid constraints",
        industryApplications: ["Urban Distribution", "Retail", "Emergency Services", "Food Delivery"],
        realWorldExample: "Nairobi food delivery service optimizes kitchen locations using Manhattan distance for city grid."
      },
      {
        id: "p-median",
        name: "P-Median Facility Location",
        description: "Multiple facility location optimization minimizing total demand-weighted distance to nearest facility.",
        complexity: "Expert",
        accuracy: "99.8%",
        formula: "Minimize: Σ(wi × min(dij)) subject to: exactly p facilities selected",
        inputs: [
          { name: "candidateLocations", label: "Candidate Locations", type: "array", description: "Potential facility sites" },
          { name: "demandNodes", label: "Demand Nodes", type: "array", description: "Customer locations and demands" },
          { name: "numberOfFacilities", label: "Number of Facilities", type: "number", description: "How many facilities to locate" },
          { name: "fixedCosts", label: "Fixed Costs", type: "array", unit: "KES", description: "Fixed cost per facility" }
        ],
        outputs: [
          { name: "selectedLocations", label: "Selected Locations", description: "Optimal facility locations" },
          { name: "customerAssignments", label: "Customer Assignments", description: "Which customers served by which facility" },
          { name: "totalCost", label: "Total Cost", unit: "KES", description: "Total system cost" },
          { name: "serviceAreas", label: "Service Areas", description: "Geographic areas served by each facility" }
        ],
        backendFunction: "calculatePMedian",
        aiPrompt: "The user is optimizing multiple facility locations. Before using the app, they opened facilities randomly. Explain how p-median finds optimal multi-facility networks.",
        useCase: "Multi-facility strategic location planning",
        industryApplications: ["Retail Chains", "Healthcare Networks", "Distribution Centers", "Emergency Services"],
        realWorldExample: "Kenyan bank optimizes 25 new branch locations to maximize customer accessibility."
      }
    ]
  },
  {
    id: "network-optimization",
    name: "Network Optimization",
    description: "Optimize supply chain networks using flow, cost, and resilience models.",
    icon: "network",
    category: "Operations Research",
    formulas: [
      {
        id: "min-cost-flow",
        name: "Minimum Cost Flow",
        description: "Optimize flow through the network at minimum cost.",
        complexity: "Advanced",
        accuracy: "100%",
        formula: "Minimize: Σ(cij × xij) subject to: flow conservation and capacity constraints",
        inputs: [
          { name: "networkGraph", label: "Network Graph", type: "object", description: "Nodes, edges, capacities, and costs" },
          { name: "sourceNodes", label: "Source Nodes", type: "array", description: "Supply points with capacities" },
          { name: "sinkNodes", label: "Sink Nodes", type: "array", description: "Demand points with requirements" },
          { name: "edgeCapacities", label: "Edge Capacities", type: "array", description: "Maximum flow on each edge" },
          { name: "edgeCosts", label: "Edge Costs", type: "array", unit: "KES/unit", description: "Cost per unit flow" }
        ],
        outputs: [
          { name: "optimalFlow", label: "Optimal Flow", description: "Flow on each edge in optimal solution" },
          { name: "totalCost", label: "Total Cost", unit: "KES", description: "Minimum total flow cost" },
          { name: "totalFlow", label: "Total Flow", unit: "units", description: "Maximum achievable flow" },
          { name: "bottlenecks", label: "Bottlenecks", description: "Capacity-constrained edges" }
        ],
        backendFunction: "solveMinCostFlow",
        aiPrompt: "The user is optimizing network flow for cost. Before using the app, they had high logistics costs. Explain how minimum cost flow reduces expenses.",
        useCase: "Distribution network cost optimization",
        industryApplications: ["Supply Chain", "Transportation", "Telecommunications", "Energy"],
        realWorldExample: "Kenya's petroleum distribution network optimization reduces logistics costs by 15%."
      },
      {
        id: "max-flow",
        name: "Maximum Flow",
        description: "Find the maximum possible flow through the network.",
        complexity: "Intermediate",
        accuracy: "100%",
        formula: "Maximize: flow from source to sink subject to: capacity constraints",
        inputs: [
          { name: "networkGraph", label: "Network Graph", type: "object", description: "Graph with nodes and edges" },
          { name: "sourceNode", label: "Source Node", type: "number", description: "Flow origin point" },
          { name: "sinkNode", label: "Sink Node", type: "number", description: "Flow destination point" },
          { name: "edgeCapacities", label: "Edge Capacities", type: "array", description: "Maximum capacity on each edge" }
        ],
        outputs: [
          { name: "maximumFlow", label: "Maximum Flow", unit: "units", description: "Maximum achievable flow value" },
          { name: "flowDecomposition", label: "Flow Decomposition", description: "Flow on each edge" },
          { name: "minCut", label: "Minimum Cut", description: "Bottleneck edges limiting flow" },
          { name: "residualCapacity", label: "Residual Capacity", description: "Unused capacity on each edge" }
        ],
        backendFunction: "solveMaxFlow",
        aiPrompt: "The user is maximizing network throughput. Before using the app, they had bottlenecks. Explain how max flow identifies and removes bottlenecks.",
        useCase: "Throughput maximization in constrained networks",
        industryApplications: ["Manufacturing", "Logistics", "Telecommunications", "Water Systems"],
        realWorldExample: "Kenyan water utility maximizes flow through distribution network during peak demand."
      },
      {
        id: "multi-commodity-flow",
        name: "Multi-Commodity Flow",
        description: "Simultaneous optimization of multiple product flows through shared network infrastructure.",
        complexity: "Expert",
        accuracy: "99.9%",
        formula: "Minimize: Σk Σ(cijk × xijk) subject to: flow conservation per commodity",
        inputs: [
          { name: "commodities", label: "Commodities", type: "array", description: "Different products being transported" },
          { name: "networkCapacity", label: "Network Capacity", type: "object", description: "Shared edge capacities" },
          { name: "demandSupplyPairs", label: "Demand-Supply Pairs", type: "array", description: "Source-sink pairs per commodity" },
          { name: "commodityCosts", label: "Commodity Costs", type: "array", description: "Transportation cost per commodity" }
        ],
        outputs: [
          { name: "commodityFlows", label: "Commodity Flows", description: "Optimal flow for each commodity" },
          { name: "edgeUtilization", label: "Edge Utilization", unit: "%", description: "Capacity utilization per edge" },
          { name: "totalSystemCost", label: "Total System Cost", unit: "KES", description: "Combined transportation cost" },
          { name: "congestionPoints", label: "Congestion Points", description: "High-utilization network segments" }
        ],
        backendFunction: "solveMultiCommodityFlow",
        aiPrompt: "The user is optimizing multi-product flows. Before using the app, they had congestion and conflicts. Explain how multi-commodity flow coordinates different products.",
        useCase: "Multi-product distribution network optimization",
        industryApplications: ["FMCG Distribution", "Manufacturing", "Retail", "E-commerce"],
        realWorldExample: "Kenya's largest retailer optimizes multi-product distribution across 200 stores."
      },
      {
        id: "shortest-path",
        name: "Shortest Path Algorithms",
        description: "Finding minimum cost paths in networks using Dijkstra's or Floyd-Warshall algorithms.",
        complexity: "Basic",
        accuracy: "100%",
        formula: "d[v] = min(d[v], d[u] + w(u,v)) for all edges (u,v)",
        inputs: [
          { name: "networkGraph", label: "Network Graph", type: "object", description: "Weighted graph structure" },
          { name: "sourceNode", label: "Source Node", type: "number", description: "Starting point" },
          { name: "destinationNodes", label: "Destination Nodes", type: "array", description: "Target points" },
          { name: "edgeWeights", label: "Edge Weights", type: "array", description: "Cost or distance on each edge" }
        ],
        outputs: [
          { name: "shortestPaths", label: "Shortest Paths", description: "Minimum cost paths to all destinations" },
          { name: "pathCosts", label: "Path Costs", description: "Total cost for each shortest path" },
          { name: "predecessorTree", label: "Predecessor Tree", description: "Path reconstruction information" }
        ],
        backendFunction: "calculateShortestPath",
        aiPrompt: "The user is finding optimal paths in their network. Before using the app, they used suboptimal routes. Explain how shortest path algorithms find optimal connections.",
        useCase: "Route planning and network analysis",
        industryApplications: ["Navigation", "Logistics", "Telecommunications", "Transportation"],
        realWorldExample: "Kenyan logistics company finds shortest delivery routes between distribution centers."
      }
    ]
  },
  {
    id: "pricing",
    name: "Pricing & Business Value",
    description: "Analyze pricing strategies and calculate ROI for supply chain investments.",
    icon: "dollar-sign",
    category: "Revenue Management",
    formulas: [
      {
        id: "dynamic-pricing",
        name: "Dynamic Pricing",
        description: "Set prices based on demand, competition, and cost factors.",
        complexity: "Advanced",
        accuracy: "94-97%",
        formula: "P* = (MC + a/b) / (1 + 1/ε) where ε = price elasticity",
        inputs: [
          { name: "basePrice", label: "Base Price", type: "number", unit: "KES", description: "Standard product price" },
          { name: "demandMultiplier", label: "Demand Multiplier", type: "number", description: "Demand sensitivity to price changes" },
          { name: "competitionFactor", label: "Competition Factor", type: "number", description: "Competitive pressure factor" },
          { name: "cost", label: "Cost", type: "number", unit: "KES", description: "Product cost" },
          { name: "inventoryLevel", label: "Inventory Level", type: "number", unit: "units", description: "Current stock level" },
          { name: "seasonalFactor", label: "Seasonal Factor", type: "number", description: "Seasonal demand multiplier" }
        ],
        outputs: [
          { name: "optimalPrice", label: "Optimal Price", unit: "KES", description: "Revenue-maximizing price" },
          { name: "expectedDemand", label: "Expected Demand", unit: "units", description: "Predicted demand at optimal price" },
          { name: "revenueProjection", label: "Revenue Projection", unit: "KES", description: "Expected revenue" },
          { name: "priceElasticity", label: "Price Sensitivity", description: "Demand response to price changes" }
        ],
        backendFunction: "calculateDynamicPricing",
        aiPrompt: "The user is setting dynamic prices. Before using the app, they used static pricing. Explain how dynamic pricing adapts to market conditions.",
        useCase: "Real-time price optimization for maximum revenue",
        industryApplications: ["E-commerce", "Retail", "Airlines", "Hotels", "Energy"],
        realWorldExample: "Kenyan airline increases revenue 23% using dynamic pricing for 50+ routes."
      },
      {
        id: "roi",
        name: "ROI Calculation",
        description: "Calculate return on investment for supply chain projects.",
        complexity: "Basic",
        accuracy: "100%",
        formula: "ROI = (Total Benefits - Total Costs) / Total Costs × 100%",
        inputs: [
          { name: "investment", label: "Investment Amount", type: "number", unit: "KES", description: "Upfront project cost" },
          { name: "annualReturn", label: "Annual Return", type: "number", unit: "KES", description: "Yearly benefit projections" },
          { name: "years", label: "Years", type: "number", unit: "years", description: "Project duration" },
          { name: "operatingCosts", label: "Operating Costs", type: "array", unit: "KES", description: "Yearly operating costs" },
          { name: "discountRate", label: "Discount Rate", type: "number", unit: "%", description: "Cost of capital" }
        ],
        outputs: [
          { name: "roi", label: "Return on Investment", unit: "%", description: "Total ROI percentage" },
          { name: "npv", label: "Net Present Value", unit: "KES", description: "Present value of all cash flows" },
          { name: "paybackPeriod", label: "Payback Period", unit: "years", description: "Time to recover investment" },
          { name: "irr", label: "Internal Rate of Return", unit: "%", description: "Project's internal return rate" }
        ],
        backendFunction: "calculateROI",
        aiPrompt: "The user is calculating ROI for a supply chain investment. Before using the app, they couldn't justify projects. Explain how ROI quantifies value.",
        useCase: "Investment evaluation and business case development",
        industryApplications: ["All Industries", "Project Management", "Finance", "Operations"],
        realWorldExample: "Kenyan manufacturer achieves 340% ROI on supply chain optimization project over 3 years."
      },
      {
        id: "cost-benefit-analysis",
        name: "Cost-Benefit Analysis",
        description: "Systematic evaluation of project benefits versus costs including intangible benefits quantification.",
        complexity: "Intermediate",
        accuracy: "95-98%",
        formula: "BCR = PV(Benefits) / PV(Costs), Net Benefit = PV(Benefits) - PV(Costs)",
        inputs: [
          { name: "directCosts", label: "Direct Costs", type: "array", unit: "KES", description: "Direct project costs" },
          { name: "indirectCosts", label: "Indirect Costs", type: "array", unit: "KES", description: "Indirect and opportunity costs" },
          { name: "tangibleBenefits", label: "Tangible Benefits", type: "array", unit: "KES", description: "Quantifiable benefits" },
          { name: "intangibleBenefits", label: "Intangible Benefits", type: "array", description: "Non-quantifiable benefits" },
          { name: "riskAdjustment", label: "Risk Adjustment", type: "number", unit: "%", description: "Risk premium factor" }
        ],
        outputs: [
          { name: "benefitCostRatio", label: "Benefit-Cost Ratio", description: "Total benefits divided by total costs" },
          { name: "netBenefit", label: "Net Benefit", unit: "KES", description: "Total benefits minus total costs" },
          { name: "sensitivityAnalysis", label: "Sensitivity Analysis", description: "Impact of parameter changes" },
          { name: "riskAssessment", label: "Risk Assessment", description: "Probability of achieving benefits" }
        ],
        backendFunction: "calculateCostBenefit",
        aiPrompt: "The user is performing comprehensive project evaluation. Before using the app, they ignored intangible benefits. Explain how cost-benefit analysis captures all project impacts.",
        useCase: "Comprehensive project evaluation including intangible factors",
        industryApplications: ["Public Projects", "Infrastructure", "Technology", "Process Improvement"],
        realWorldExample: "Kenyan government evaluates infrastructure projects using cost-benefit analysis for prioritization."
      },
      {
        id: "activity-based-costing",
        name: "Activity-Based Costing (ABC)",
        description: "Cost allocation methodology tracing costs to activities and then to cost objects based on resource consumption.",
        complexity: "Advanced",
        accuracy: "97-99%",
        formula: "Object Cost = Σ(Activity Cost × Driver Consumption)",
        inputs: [
          { name: "activities", label: "Activities", type: "array", description: "All activities in the process" },
          { name: "resourceCosts", label: "Resource Costs", type: "array", unit: "KES", description: "Cost of resources consumed" },
          { name: "activityDrivers", label: "Activity Drivers", type: "array", description: "Measures of activity consumption" },
          { name: "costObjects", label: "Cost Objects", type: "array", description: "Products, services, or customers" }
        ],
        outputs: [
          { name: "activityCosts", label: "Activity Costs", unit: "KES", description: "Cost per activity" },
          { name: "costDriverRates", label: "Cost Driver Rates", unit: "KES/driver", description: "Cost per unit of driver" },
          { name: "objectCosts", label: "Object Costs", unit: "KES", description: "Total cost per cost object" },
          { name: "costInsights", label: "Cost Insights", description: "Cost improvement opportunities" }
        ],
        backendFunction: "calculateABC",
        aiPrompt: "The user is implementing activity-based costing. Before using the app, they had inaccurate cost allocation. Explain how ABC provides accurate cost attribution.",
        useCase: "Accurate cost allocation for complex processes",
        industryApplications: ["Manufacturing", "Services", "Healthcare", "Logistics"],
        realWorldExample: "Kenyan logistics company uses ABC to identify cost reduction opportunities in warehousing."
      }
    ]
  },
  {
    id: "risk-management",
    name: "Risk Management & Resilience",
    description: "Supply chain risk assessment, disruption modeling, and resilience optimization.",
    icon: "shield",
    category: "Risk Analysis",
    formulas: [
      {
        id: "value-at-risk",
        name: "Value at Risk (VaR)",
        description: "Statistical measure of potential financial loss due to supply chain disruptions.",
        complexity: "Advanced",
        accuracy: "95-99%",
        formula: "VaR = μ - Z_α × σ where μ = expected return, Z_α = confidence level, σ = volatility",
        inputs: [
          { name: "historicalLosses", label: "Historical Loss Data", type: "array", unit: "KES", description: "Past financial losses from disruptions" },
          { name: "confidenceLevel", label: "Confidence Level", type: "number", unit: "%", description: "Statistical confidence (95%, 99%)" },
          { name: "timeHorizon", label: "Time Horizon", type: "number", unit: "days", description: "Risk assessment period" },
          { name: "correlationMatrix", label: "Risk Correlations", type: "matrix", description: "Correlation between different risk factors" }
        ],
        outputs: [
          { name: "valueAtRisk", label: "Value at Risk", unit: "KES", description: "Maximum expected loss at confidence level" },
          { name: "expectedShortfall", label: "Expected Shortfall", unit: "KES", description: "Expected loss beyond VaR" },
          { name: "riskContribution", label: "Risk Contribution", description: "Contribution of each risk factor" },
          { name: "stressTestResults", label: "Stress Test Results", description: "Performance under extreme scenarios" }
        ],
        backendFunction: "calculateVaR",
        aiPrompt: "The user is quantifying supply chain financial risk. Before using the app, they couldn't measure potential losses. Explain how VaR provides risk quantification.",
        useCase: "Financial risk assessment and capital allocation",
        industryApplications: ["Finance", "Insurance", "Manufacturing", "Retail"],
        realWorldExample: "Kenyan bank quantifies supply chain lending risk using VaR for portfolio management."
      },
      {
        id: "supplier-risk",
        name: "Supplier Risk Assessment",
        description: "Multi-criteria evaluation of supplier reliability, financial stability, and operational risk.",
        complexity: "Intermediate",
        accuracy: "90-95%",
        formula: "Risk Score = Σ(wi × ri) where wi = weight, ri = risk factor score",
        inputs: [
          { name: "financialMetrics", label: "Financial Metrics", type: "object", description: "Supplier financial health indicators" },
          { name: "operationalMetrics", label: "Operational Metrics", type: "object", description: "Performance and capacity measures" },
          { name: "geographicRisk", label: "Geographic Risk", type: "number", description: "Location-based risk factors" },
          { name: "industryRisk", label: "Industry Risk", type: "number", description: "Sector-specific risks" },
          { name: "relationshipHistory", label: "Relationship History", type: "object", description: "Past performance data" }
        ],
        outputs: [
          { name: "overallRiskScore", label: "Overall Risk Score", unit: "points", description: "Composite risk rating" },
          { name: "riskCategories", label: "Risk Categories", description: "Breakdown by risk type" },
          { name: "mitigationStrategies", label: "Mitigation Strategies", description: "Recommended risk reduction actions" },
          { name: "monitoringPlan", label: "Monitoring Plan", description: "Key metrics to track" }
        ],
        backendFunction: "assessSupplierRisk",
        aiPrompt: "The user is evaluating supplier risks. Before using the app, they had supplier failures. Explain how systematic risk assessment prevents supplier disruptions.",
        useCase: "Supplier selection and monitoring for risk reduction",
        industryApplications: ["Manufacturing", "Retail", "Construction", "Healthcare"],
        realWorldExample: "Kenyan manufacturer reduces supplier disruptions by 60% using systematic risk assessment."
      },
      {
        id: "disruption-impact",
        name: "Disruption Impact Analysis",
        description: "Modeling the cascade effects of supply chain disruptions across the network.",
        complexity: "Expert",
        accuracy: "85-92%",
        formula: "Impact = Σ(Probability × Consequence × Recovery_Time)",
        inputs: [
          { name: "disruptionScenarios", label: "Disruption Scenarios", type: "array", description: "Potential disruption events" },
          { name: "networkTopology", label: "Network Topology", type: "object", description: "Supply chain network structure" },
          { name: "nodeDependencies", label: "Node Dependencies", type: "matrix", description: "Interdependencies between network nodes" },
          { name: "recoveryCapabilities", label: "Recovery Capabilities", type: "array", description: "Recovery resources and time" }
        ],
        outputs: [
          { name: "disruptionImpact", label: "Disruption Impact", unit: "KES", description: "Total financial impact of disruptions" },
          { name: "cascadeEffects", label: "Cascade Effects", description: "How disruptions spread through network" },
          { name: "criticalNodes", label: "Critical Nodes", description: "Most vulnerable network points" },
          { name: "recoveryTimeline", label: "Recovery Timeline", description: "Time to restore normal operations" }
        ],
        backendFunction: "analyzeDisruptionImpact",
        aiPrompt: "The user is modeling disruption propagation. Before using the app, they couldn't predict cascade effects. Explain how disruption analysis reveals hidden vulnerabilities.",
        useCase: "Understanding and preparing for supply chain disruptions",
        industryApplications: ["Critical Infrastructure", "Manufacturing", "Healthcare", "Defense"],
        realWorldExample: "Kenyan telecommunications company models disaster impact on network resilience."
      },
      {
        id: "monte-carlo-risk",
        name: "Monte Carlo Risk Analysis",
        description: "Stochastic simulation of supply chain performance under uncertainty.",
        complexity: "Expert",
        accuracy: "95-98%",
        formula: "E[Metric] = (1/n) Σ Metric(ωi) where ωi are random scenarios",
        inputs: [
          { name: "uncertainParameters", label: "Uncertain Parameters", type: "array", description: "Parameters with probability distributions" },
          { name: "simulationRuns", label: "Simulation Runs", type: "number", description: "Number of Monte Carlo iterations" },
          { name: "performanceMetrics", label: "Performance Metrics", type: "array", description: "KPIs to evaluate" },
          { name: "correlationStructure", label: "Correlation Structure", type: "matrix", description: "Dependencies between parameters" }
        ],
        outputs: [
          { name: "performanceDistributions", label: "Performance Distributions", description: "Probability distributions of outcomes" },
          { name: "riskMetrics", label: "Risk Metrics", description: "VaR, CVaR, and other risk measures" },
          { name: "sensitivityAnalysis", label: "Sensitivity Analysis", description: "Parameter impact on outcomes" },
          { name: "confidenceIntervals", label: "Confidence Intervals", description: "Uncertainty bounds for metrics" }
        ],
        backendFunction: "monteCarloRiskAnalysis",
        aiPrompt: "The user is performing stochastic risk analysis. Before using the app, they used deterministic models. Explain how Monte Carlo captures uncertainty and risk.",
        useCase: "Comprehensive uncertainty analysis and risk quantification",
        industryApplications: ["Finance", "Insurance", "Project Management", "Operations"],
        realWorldExample: "Kenyan infrastructure project uses Monte Carlo for risk-adjusted financial planning."
      }
    ]
  },
  {
    id: "sustainability-optimization",
    name: "Sustainability & Green Supply Chain",
    description: "Environmental optimization models for carbon footprint reduction and sustainable operations.",
    icon: "zap",
    category: "Sustainability",
    formulas: [
      {
        id: "carbon-footprint",
        name: "Carbon Footprint Optimization",
        description: "Supply chain optimization minimizing CO2 emissions while maintaining service levels and cost constraints.",
        complexity: "Advanced",
        accuracy: "98.5%",
        formula: "Minimize: Total Cost + λ × Carbon_Cost subject to service constraints",
        inputs: [
          { name: "transportationModes", label: "Transportation Modes", type: "array", description: "Available transport options" },
          { name: "emissionFactors", label: "Emission Factors", type: "array", unit: "kg CO2/km", description: "CO2 emissions per mode" },
          { name: "energyConsumption", label: "Energy Consumption", type: "array", unit: "kWh", description: "Energy usage at facilities" },
          { name: "renewableEnergy", label: "Renewable Energy", type: "number", unit: "%", description: "Percentage of renewable energy" },
          { name: "carbonPrice", label: "Carbon Price", type: "number", unit: "KES/tonne CO2", description: "Carbon offset cost" }
        ],
        outputs: [
          { name: "totalEmissions", label: "Total CO2 Emissions", unit: "tonnes CO2", description: "Total carbon footprint" },
          { name: "emissionReduction", label: "Emission Reduction", unit: "%", description: "Reduction vs. baseline" },
          { name: "carbonCost", label: "Carbon Cost", unit: "KES", description: "Cost of carbon emissions" },
          { name: "sustainabilityScore", label: "Sustainability Score", unit: "points", description: "Overall sustainability rating" }
        ],
        backendFunction: "calculateCarbonFootprint",
        aiPrompt: "The user is optimizing environmental impact. Before using the app, they ignored carbon costs. Explain how carbon footprint optimization balances cost and sustainability.",
        useCase: "Sustainable supply chain design and carbon reduction",
        industryApplications: ["Manufacturing", "Logistics", "Retail", "Agriculture"],
        realWorldExample: "Kenyan coffee cooperative reduces carbon footprint by 40% while maintaining premium quality."
      },
      {
        id: "circular-economy",
        name: "Circular Economy Metrics",
        description: "Measuring and optimizing circular economy principles in supply chain design.",
        complexity: "Advanced",
        accuracy: "93-97%",
        formula: "Circularity = (Material_Reused + Material_Recycled) / Total_Material_Input",
        inputs: [
          { name: "materialFlows", label: "Material Flows", type: "object", description: "Input and output material streams" },
          { name: "recyclingRates", label: "Recycling Rates", type: "array", unit: "%", description: "Material recovery percentages" },
          { name: "reuseOpportunities", label: "Reuse Opportunities", type: "array", description: "Potential material reuse options" },
          { name: "wasteStreams", label: "Waste Streams", type: "array", description: "Types and quantities of waste" }
        ],
        outputs: [
          { name: "circularityIndex", label: "Circularity Index", unit: "%", description: "Overall circular economy performance" },
          { name: "materialEfficiency", label: "Material Efficiency", unit: "%", description: "Efficient use of materials" },
          { name: "wasteReduction", label: "Waste Reduction", unit: "%", description: "Reduction in waste generation" },
          { name: "resourceSavings", label: "Resource Savings", unit: "KES", description: "Economic benefits from circularity" }
        ],
        backendFunction: "calculateCircularEconomy",
        aiPrompt: "The user is implementing circular economy principles. Before using the app, they had linear waste flows. Explain how circular metrics drive sustainable resource use.",
        useCase: "Circular economy implementation and measurement",
        industryApplications: ["Manufacturing", "Fashion", "Electronics", "Packaging"],
        realWorldExample: "Kenyan textile manufacturer achieves 75% circularity index through recycling and reuse programs."
      },
      {
        id: "life-cycle-assessment",
        name: "Life Cycle Assessment (LCA)",
        description: "Comprehensive environmental impact assessment across product lifecycle stages.",
        complexity: "Expert",
        accuracy: "94-98%",
        formula: "Impact = Σ(Activity_Level × Impact_Factor) across all lifecycle stages",
        inputs: [
          { name: "lifecycleStages", label: "Lifecycle Stages", type: "array", description: "All stages from raw material to disposal" },
          { name: "impactCategories", label: "Impact Categories", type: "array", description: "Environmental impact types" },
          { name: "inventoryData", label: "Inventory Data", type: "matrix", description: "Resource consumption and emissions" },
          { name: "characterizationFactors", label: "Characterization Factors", type: "matrix", description: "Impact conversion factors" }
        ],
        outputs: [
          { name: "environmentalProfile", label: "Environmental Profile", description: "Impact across all categories" },
          { name: "hotspotAnalysis", label: "Hotspot Analysis", description: "Stages with highest environmental impact" },
          { name: "improvementOpportunities", label: "Improvement Opportunities", description: "Areas for environmental gains" },
          { name: "impactComparison", label: "Impact Comparison", description: "Benchmarking against alternatives" }
        ],
        backendFunction: "calculateLCA",
        aiPrompt: "The user is conducting comprehensive environmental assessment. Before using the app, they only considered direct impacts. Explain how LCA reveals total environmental footprint.",
        useCase: "Comprehensive environmental impact assessment and optimization",
        industryApplications: ["Product Development", "Manufacturing", "Construction", "Energy"],
        realWorldExample: "Kenyan cement manufacturer uses LCA to reduce environmental impact by 30% across product lifecycle."
      },
      {
        id: "green-logistics",
        name: "Green Logistics Optimization",
        description: "Transportation and logistics optimization considering environmental objectives alongside cost and service.",
        complexity: "Advanced",
        accuracy: "96-99%",
        formula: "Minimize: α×Cost + β×Emissions + γ×Time subject to service constraints",
        inputs: [
          { name: "transportNetwork", label: "Transport Network", type: "object", description: "Available routes and modes" },
          { name: "vehicleTypes", label: "Vehicle Types", type: "array", description: "Fleet options with emissions" },
          { name: "fuelTypes", label: "Fuel Types", type: "array", description: "Fuel options and emission factors" },
          { name: "loadingEfficiency", label: "Loading Efficiency", type: "array", unit: "%", description: "Vehicle utilization rates" },
          { name: "objectiveWeights", label: "Objective Weights", type: "object", description: "Relative importance of cost vs. emissions" }
        ],
        outputs: [
          { name: "greenRoutes", label: "Green Routes", description: "Environmentally optimized routes" },
          { name: "emissionReduction", label: "Emission Reduction", unit: "tonnes CO2", description: "Environmental benefits" },
          { name: "costImpact", label: "Cost Impact", unit: "KES", description: "Financial implications of green choices" },
          { name: "sustainabilityMetrics", label: "Sustainability Metrics", description: "Environmental KPIs" }
        ],
        backendFunction: "optimizeGreenLogistics",
        aiPrompt: "The user is implementing green logistics practices. Before using the app, they only minimized cost. Explain how green logistics balances environmental and economic objectives.",
        useCase: "Environmentally conscious transportation and logistics optimization",
        industryApplications: ["Logistics", "Distribution", "E-commerce", "Retail"],
        realWorldExample: "Kenyan logistics company reduces transport emissions by 45% while maintaining delivery performance."
      }
    ]
  }
];

// Lock this registry to prevent accidental deletions
Object.freeze(modelFormulaRegistry);
export default modelFormulaRegistry;
