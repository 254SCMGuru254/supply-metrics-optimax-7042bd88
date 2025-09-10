import { SupplyChainModel } from '../modelFormulaRegistry';

const supplierManagement: SupplyChainModel = {
  id: "supplier-management",
  name: "Supplier Management",
  description: "Supplier selection, evaluation, risk assessment, and relationship optimization models.",
  category: "Supplier Management",
  formulas: [
    {
      id: "multi-criteria-supplier-selection",
      name: "Multi-Criteria Supplier Selection",
      description: "AHP-based supplier selection considering cost, quality, delivery, and service factors.",
      formula: "Supplier Score = Σ(w_i × r_ij) where w_i are criteria weights, r_ij are ratings",
      complexity: "High",
      accuracy: "92-96%",
      useCase: "Systematic supplier selection with multiple evaluation criteria",
      backendFunction: "multiCriteriaSupplierSelection",
      inputs: [
        { name: "suppliers", label: "Supplier Candidates", type: "array" },
        { name: "cost_weight", label: "Cost Weight", type: "number", defaultValue: 0.25 },
        { name: "quality_weight", label: "Quality Weight", type: "number", defaultValue: 0.30 },
        { name: "delivery_weight", label: "Delivery Weight", type: "number", defaultValue: 0.25 },
        { name: "service_weight", label: "Service Weight", type: "number", defaultValue: 0.20 }
      ],
      outputs: [
        { name: "supplier_rankings", label: "Supplier Rankings", unit: "ranking" },
        { name: "composite_scores", label: "Composite Scores", unit: "score" },
        { name: "sensitivity_analysis", label: "Weight Sensitivity Analysis", unit: "analysis" },
        { name: "recommendations", label: "Selection Recommendations", unit: "recommendations" }
      ]
    },
    {
      id: "supplier-risk-assessment",
      name: "Supplier Risk Assessment",
      description: "Evaluate and quantify supplier risks including financial, operational, and geographic risks.",
      formula: "Risk Score = Σ(P_i × I_i) where P_i is probability, I_i is impact of risk i",
      complexity: "High",
      accuracy: "88-93%",
      useCase: "Identify and mitigate supplier-related risks",
      backendFunction: "supplierRiskAssessment",
      inputs: [
        { name: "supplier_profiles", label: "Supplier Risk Profiles", type: "array" },
        { name: "financial_indicators", label: "Financial Health Indicators", type: "array" },
        { name: "geographic_risks", label: "Geographic Risk Factors", type: "array" },
        { name: "operational_metrics", label: "Operational Performance Metrics", type: "array" }
      ],
      outputs: [
        { name: "risk_scores", label: "Overall Risk Scores", unit: "score" },
        { name: "risk_categories", label: "Risk by Category", unit: "breakdown" },
        { name: "mitigation_strategies", label: "Risk Mitigation Strategies", unit: "strategies" },
        { name: "monitoring_plan", label: "Risk Monitoring Plan", unit: "plan" }
      ]
    },
    {
      id: "supplier-portfolio-optimization",
      name: "Supplier Portfolio Optimization",
      description: "Optimize the mix of suppliers to minimize cost and risk while maximizing performance.",
      formula: "Min Σ(C_i × x_i) + λ × Risk(x) subject to capacity and service constraints",
      complexity: "Very High",
      accuracy: "94-97%",
      useCase: "Balance supplier portfolio for optimal cost, risk, and performance",
      backendFunction: "supplierPortfolioOptimization",
      inputs: [
        { name: "supplier_costs", label: "Supplier Unit Costs", type: "array", unit: "currency/unit" },
        { name: "supplier_capacities", label: "Supplier Capacities", type: "array", unit: "units" },
        { name: "risk_tolerance", label: "Risk Tolerance Level", type: "number", defaultValue: 0.1 },
        { name: "demand_requirements", label: "Demand Requirements", type: "number", unit: "units" }
      ],
      outputs: [
        { name: "optimal_allocation", label: "Optimal Supplier Allocation", unit: "allocation" },
        { name: "total_cost", label: "Total Cost", unit: "currency" },
        { name: "portfolio_risk", label: "Portfolio Risk Level", unit: "risk_score" },
        { name: "diversification_index", label: "Supplier Diversification Index", unit: "index" }
      ]
    },
    {
      id: "vendor-managed-inventory",
      name: "Vendor Managed Inventory (VMI)",
      description: "Optimize inventory levels when suppliers manage customer inventory.",
      formula: "Min Σ(h_i × I_i + s_i × O_i) subject to service level and capacity constraints",
      complexity: "High",
      accuracy: "90-95%",
      useCase: "Optimize VMI agreements for mutual benefit",
      backendFunction: "vendorManagedInventory",
      inputs: [
        { name: "demand_patterns", label: "Customer Demand Patterns", type: "array" },
        { name: "holding_costs", label: "Inventory Holding Costs", type: "number", unit: "currency/unit/period" },
        { name: "service_level_target", label: "Service Level Target", type: "number", defaultValue: 95, unit: "%" },
        { name: "lead_times", label: "Supplier Lead Times", type: "array", unit: "days" }
      ],
      outputs: [
        { name: "optimal_inventory_levels", label: "Optimal Inventory Levels", unit: "units" },
        { name: "reorder_points", label: "Reorder Points", unit: "units" },
        { name: "cost_savings", label: "Total Cost Savings", unit: "currency" },
        { name: "service_performance", label: "Service Level Achievement", unit: "%" }
      ]
    },
    {
      id: "supplier-development-optimization",
      name: "Supplier Development Optimization",
      description: "Optimize investments in supplier development programs for maximum ROI.",
      formula: "Max ROI = (Benefits - Investment) / Investment where Benefits = Performance Improvement Value",
      complexity: "Medium",
      accuracy: "85-90%",
      useCase: "Prioritize and optimize supplier development investments",
      backendFunction: "supplierDevelopmentOptimization",
      inputs: [
        { name: "supplier_performance_gaps", label: "Performance Gaps", type: "array" },
        { name: "development_costs", label: "Development Program Costs", type: "array", unit: "currency" },
        { name: "improvement_potential", label: "Improvement Potential", type: "array", unit: "%" },
        { name: "development_budget", label: "Available Budget", type: "number", unit: "currency" }
      ],
      outputs: [
        { name: "development_priorities", label: "Development Priorities", unit: "ranking" },
        { name: "investment_allocation", label: "Optimal Investment Allocation", unit: "allocation" },
        { name: "expected_roi", label: "Expected ROI by Supplier", unit: "%" },
        { name: "performance_projections", label: "Performance Improvement Projections", unit: "projections" }
      ]
    }
  ]
};

export default supplierManagement;