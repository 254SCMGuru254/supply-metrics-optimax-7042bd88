
import { SupplyChainModel } from "../modelFormulaRegistry";

const costModeling: SupplyChainModel = {
  id: "cost-modeling",
  name: "Cost Modeling",
  description: "Total cost, cost-benefit, and financial modeling for supply chain.",
  category: "Finance",
  formulas: [
    {
      id: "activity-based-costing",
      name: "Activity-Based Costing (ABC)",
      description: "Accurately allocates costs to supply chain activities.",
      formula: "Cost = Σ (Activity Rate × Activity Usage)",
      complexity: "Intermediate",
      accuracy: "90%",
      useCase: "Determine true cost by activity",
      backendFunction: "activityBasedCosting",
      inputs: [
        { name: "activityRates", label: "Activity Rates", type: "array" },
        { name: "activityUsage", label: "Activity Usage", type: "array" }
      ],
      outputs: [
        { name: "abcTotalCost", label: "ABC Total Cost", unit: "Ksh" }
      ]
    },
    {
      id: "total-cost-of-ownership",
      name: "Total Cost of Ownership (TCO)",
      description: "Calculates full lifecycle ownership costs.",
      formula: "TCO = Acquisition + Operating + Disposal",
      complexity: "Basic",
      accuracy: "85%",
      useCase: "Full lifecycle cost breakdown",
      backendFunction: "totalCostOfOwnership",
      inputs: [
        { name: "acquisition", label: "Acquisition Cost", type: "number" },
        { name: "operating", label: "Operating Cost", type: "number" },
        { name: "disposal", label: "Disposal Cost", type: "number" }
      ],
      outputs: [
        { name: "tco", label: "Total Cost of Ownership", unit: "Ksh" }
      ]
    },
    {
      id: "cost-benefit-analysis",
      name: "Cost-Benefit Analysis",
      description: "Analyzes investment profitability over time.",
      formula: "NPV = Σ (Benefits - Costs) / (1 + r)^t",
      complexity: "Intermediate",
      accuracy: "80%",
      useCase: "Evaluate supply chain investments",
      backendFunction: "costBenefitAnalysis",
      inputs: [
        { name: "benefits", label: "Benefits", type: "array" },
        { name: "costs", label: "Costs", type: "array" },
        { name: "discountRate", label: "Discount Rate (r)", type: "number" },
        { name: "timePeriods", label: "Time Periods", type: "number" }
      ],
      outputs: [
        { name: "npv", label: "Net Present Value (NPV)", unit: "Ksh" }
      ]
    },
    {
      id: "break-even-analysis",
      name: "Break-Even Analysis",
      description: "Determines profitability threshold for a supply chain investment.",
      formula: "Break-even = Fixed Costs / (Price - Variable Cost)",
      complexity: "Basic",
      accuracy: "95%",
      useCase: "Find profit/loss threshold",
      backendFunction: "breakEvenAnalysis",
      inputs: [
        { name: "fixedCosts", label: "Fixed Costs", type: "number" },
        { name: "price", label: "Selling Price", type: "number" },
        { name: "variableCost", label: "Variable Cost", type: "number" }
      ],
      outputs: [
        { name: "breakEvenVolume", label: "Break-Even Volume", unit: "units" }
      ]
    }
  ]
};

export default costModeling;
