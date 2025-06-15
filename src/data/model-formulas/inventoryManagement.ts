
import { SupplyChainModel } from "../modelFormulaRegistry";

const inventoryManagement: SupplyChainModel = {
  id: "inventory-management",
  name: "Inventory Management",
  description: "Models and formulas for inventory optimization.",
  category: "Inventory",
  formulas: [
    {
      id: "basic-eoq",
      name: "Economic Order Quantity (EOQ)",
      description: "Calculates the optimal order quantity to minimize total inventory costs.",
      formula: "EOQ = √(2DS/H)",
      complexity: "Basic",
      accuracy: "95%",
      useCase: "Minimize total inventory cost",
      backendFunction: "calculateEOQ",
      inputs: [
        { name: "annualDemand", label: "Annual Demand (D)", type: "number", unit: "units" },
        { name: "orderingCost", label: "Ordering Cost (S)", type: "number", unit: "Ksh" },
        { name: "holdingCostRate", label: "Holding Cost Rate (H)", type: "number", unit: "Ksh/unit/year", defaultValue: 0.25 },
        { name: "unitCost", label: "Unit Cost (C)", type: "number", unit: "Ksh" }
      ],
      outputs: [
        { name: "orderQuantity", label: "EOQ", unit: "units" },
        { name: "ordersPerYear", label: "Orders per Year" },
        { name: "totalAnnualCost", label: "Total Annual Cost", unit: "Ksh" }
      ]
    },
    {
      id: "eoq-quantity-discounts",
      name: "EOQ with Quantity Discounts",
      description: "EOQ model accounting for supplier quantity discount pricing.",
      formula: "EOQ = √(2DS/H), piecewise by price level",
      complexity: "Intermediate",
      accuracy: "92%",
      useCase: "Order optimization with tiered pricing",
      backendFunction: "calculateEOQWithDiscounts",
      inputs: [
        { name: "annualDemand", label: "Annual Demand", type: "number" },
        { name: "orderingCost", label: "Ordering Cost", type: "number" },
        { name: "holdingCostRate", label: "Holding Cost Rate", type: "number" },
        { name: "discountTiers", label: "Discount Tiers", type: "array" }
      ],
      outputs: [
        { name: "orderQuantity", label: "EOQ", unit: "units" },
        { name: "orderCost", label: "Total Cost", unit: "Ksh" }
      ]
    },
    {
      id: "newsvendor-model",
      name: "Newsvendor Model",
      description: "Single-period stochastic inventory optimization.",
      formula: "Q* = F^(-1)(p/(p+h))",
      complexity: "Intermediate",
      accuracy: "85%",
      useCase: "Single-period inventory decisions",
      backendFunction: "calculateNewsvendor",
      inputs: [
        { name: "mean", label: "Mean Demand", type: "number", unit: "units" },
        { name: "stdDev", label: "Std Dev of Demand", type: "number", unit: "units" },
        { name: "unitCost", label: "Unit Cost", type: "number", unit: "Ksh" },
        { name: "sellingPrice", label: "Selling Price", type: "number", unit: "Ksh" },
        { name: "salvageValue", label: "Salvage Value", type: "number", unit: "Ksh" },
      ],
      outputs: [
        { name: "optimalOrder", label: "Optimal Order Quantity", unit: "units" },
        { name: "expectedProfit", label: "Expected Profit", unit: "Ksh" }
      ]
    },
    {
      id: "base-stock-policy",
      name: "Base Stock Policy",
      description: "Continuous review policy for inventory orders.",
      formula: "S = μ_LT + SS",
      complexity: "Intermediate",
      accuracy: "90%",
      useCase: "Continuous review inventory systems",
      backendFunction: "calculateBaseStock",
      inputs: [
        { name: "meanLeadTimeDemand", label: "Mean Lead Time Demand (μ_LT)", type: "number" },
        { name: "safetyStock", label: "Safety Stock (SS)", type: "number" }
      ],
      outputs: [
        { name: "baseStockLevel", label: "Base Stock Level", unit: "units" }
      ]
    },
    {
      id: "min-max-inventory",
      name: "Min-Max Inventory Policy",
      description: "Maintains inventory within preset lower and upper bounds.",
      formula: "Order when inventory ≤ min. Order up to max.",
      complexity: "Basic",
      accuracy: "88%",
      useCase: "Simple warehouse management",
      backendFunction: "calculateMinMax",
      inputs: [
        { name: "minLevel", label: "Min Level", type: "number" },
        { name: "maxLevel", label: "Max Level", type: "number" }
      ],
      outputs: [
        { name: "orderQuantity", label: "Order Quantity", unit: "units" }
      ]
    },
    {
      id: "abc-analysis",
      name: "ABC Analysis",
      description: "Classifies inventory by value and criticality to prioritize management.",
      formula: "Class A: 70-80% value, B: 15-25%, C: 5-10%",
      complexity: "Basic",
      accuracy: "90%",
      useCase: "Segment inventory for control",
      backendFunction: "performABCAnalysis",
      inputs: [
        { name: "usageValues", label: "Annual Usage Value Data", type: "array" }
      ],
      outputs: [
        { name: "classifiedItems", label: "Classified Items" }
      ]
    },
    {
      id: "multi-echelon-inventory",
      name: "Multi-Echelon Inventory Optimization",
      description: "Optimizes inventory across multiple supply chain tiers.",
      formula: "Min Σ(HC_i × I_i + OC_i × Q_i + SC_i × B_i)",
      complexity: "Advanced",
      accuracy: "88%",
      useCase: "Supply chain-wide inventory optimization",
      backendFunction: "multiEchelonInventory",
      inputs: [
        { name: "tiers", label: "Tiers Data", type: "array" },
        { name: "demandPatterns", label: "Demand Patterns", type: "array" }
      ],
      outputs: [
        { name: "optimizedLevels", label: "Optimized Inventory Levels" }
      ]
    },
    {
      id: "safety-stock",
      name: "Safety Stock Calculation",
      description: "Calculates safety stock level for targeted service level.",
      formula: "SS = Z × σ_LT × √LT",
      complexity: "Intermediate",
      accuracy: "92%",
      useCase: "Buffer against uncertainty",
      backendFunction: "calculateSafetyStock",
      inputs: [
        { name: "zValue", label: "Service Level Factor (Z)", type: "number" },
        { name: "leadTimeStdDev", label: "Lead Time Std Dev (σ_LT)", type: "number" },
        { name: "leadTime", label: "Lead Time (LT)", type: "number" }
      ],
      outputs: [
        { name: "safetyStockLevel", label: "Safety Stock", unit: "units" }
      ]
    },
    {
      id: "economic-production-quantity",
      name: "Economic Production Quantity (EPQ)",
      description: "Calculates production batch size to minimize costs.",
      formula: "EPQ = √(2DS/(H(1-d/p)))",
      complexity: "Advanced",
      accuracy: "93%",
      useCase: "Production lot sizing",
      backendFunction: "calculateEPQ",
      inputs: [
        { name: "annualDemand", label: "Annual Demand (D)", type: "number" },
        { name: "setupCost", label: "Setup Cost (S)", type: "number" },
        { name: "holdingCost", label: "Holding Cost (H)", type: "number" },
        { name: "demandRate", label: "Demand Rate (d)", type: "number" },
        { name: "productionRate", label: "Production Rate (p)", type: "number" }
      ],
      outputs: [
        { name: "productionBatch", label: "EPQ Batch", unit: "units" }
      ]
    },
    {
      id: "qr-policy-optimization",
      name: "(Q, r) Policy Optimization",
      description: "Optimizes fixed order quantity and reorder point.",
      formula: "Q = EOQ, r = μ_LT + SS",
      complexity: "Intermediate",
      accuracy: "87%",
      useCase: "Fixed order quantity systems",
      backendFunction: "optimizeQRPolicy",
      inputs: [
        { name: "eoq", label: "EOQ", type: "number" },
        { name: "meanLeadTimeDemand", label: "Mean Lead Time Demand", type: "number" },
        { name: "safetyStock", label: "Safety Stock", type: "number" }
      ],
      outputs: [
        { name: "reorderPoint", label: "Reorder Point (r)", unit: "units" }
      ]
    }
  ]
};

export default inventoryManagement;
