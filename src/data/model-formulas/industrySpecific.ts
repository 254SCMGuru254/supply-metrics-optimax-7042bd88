import { SupplyChainModel } from "../modelFormulaRegistry";

const industrySpecificOptimization: SupplyChainModel = {
  id: "industry-specific",
  name: "Industry Solutions",
  description: "Industry-specific supply chain optimization models",
  category: "Industry",
  formulas: [
    // Agriculture/Farming
    {
      id: "farm-to-market",
      name: "Farm to Market Optimization",
      description: "Optimize farm produce transportation and storage",
      businessContext: {
        problem: "Farmers losing revenue due to spoilage and transport delays",
        impact: "Reduce produce spoilage by up to 30%",
        application: "Small to medium-scale farms",
        constraints: [
          "Perishable goods",
          "Weather conditions",
          "Market price fluctuations"
        ]
      },
      formula: "Min Σ(TC + SC + LC)",
      complexity: "Intermediate",
      accuracy: "85-90%",
      useCase: "Optimize harvest-to-market timing",
      backendFunction: "optimizeFarmLogistics",
      inputs: [
        { name: "harvestSchedule", label: "Harvest Schedule", type: "array" },
        { name: "transportCapacity", label: "Transport Capacity", type: "number" },
        { name: "marketDemand", label: "Market Demand Forecast", type: "array" }
      ],
      outputs: [
        { name: "deliverySchedule", label: "Optimal Delivery Schedule" },
        { name: "storageNeeds", label: "Required Storage Capacity", unit: "tons" }
      ]
    },

    // Retail
    {
      id: "retail-inventory-optimization",
      name: "Retail Stock Optimization",
      description: "Multi-location retail inventory management",
      businessContext: {
        problem: "Stock imbalances across store locations",
        impact: "Improve stock availability while reducing excess inventory",
        application: "Retail chains with multiple locations",
        constraints: [
          "Storage space limitations",
          "Product shelf life",
          "Seasonal demand"
        ]
      },
      formula: "Optimize Σ(Sales - Holding Cost - Stockout Cost)",
      complexity: "Advanced",
      accuracy: "90-95%",
      useCase: "Balance stock across retail network",
      backendFunction: "optimizeRetailNetwork",
      inputs: [
        { name: "storeData", label: "Store Performance Data", type: "array" },
        { name: "productData", label: "Product Information", type: "array" },
        { name: "seasonality", label: "Seasonal Factors", type: "array" }
      ],
      outputs: [
        { name: "stockLevels", label: "Recommended Stock Levels" },
        { name: "reorderPoints", label: "Store-specific Reorder Points" }
      ]
    },

    // Manufacturing
    {
      id: "production-scheduling",
      name: "Production Schedule Optimization",
      description: "Optimize manufacturing schedules and resource allocation",
      businessContext: {
        problem: "Production delays and resource underutilization",
        impact: "Increase production efficiency and reduce delays",
        application: "Manufacturing facilities",
        constraints: [
          "Machine capacity",
          "Labor availability",
          "Material supply"
        ]
      },
      formula: "Max Σ(Production Output - Setup Cost - Holding Cost)",
      complexity: "Advanced",
      accuracy: "92-97%",
      useCase: "Optimize production schedules",
      backendFunction: "optimizeProduction",
      inputs: [
        { name: "orderData", label: "Production Orders", type: "array" },
        { name: "resourceData", label: "Resource Availability", type: "array" },
        { name: "constraints", label: "Production Constraints", type: "array" }
      ],
      outputs: [
        { name: "schedule", label: "Optimized Production Schedule" },
        { name: "utilization", label: "Resource Utilization Plan" }
      ]
    }
  ]
};

export default industrySpecificOptimization;
