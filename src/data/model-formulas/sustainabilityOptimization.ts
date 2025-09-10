import { SupplyChainModel } from '../modelFormulaRegistry';

const sustainabilityOptimization: SupplyChainModel = {
  id: "sustainability-optimization",
  name: "Sustainability Optimization",
  description: "Green logistics, carbon footprint optimization, and sustainable supply chain models.",
  category: "Sustainability",
  formulas: [
    {
      id: "carbon-footprint-optimization",
      name: "Carbon Footprint Optimization",
      description: "Minimize CO2 emissions across transportation and warehouse operations.",
      formula: "Min Σ(d_ij × e_k × x_ijk) where e_k is emission factor for transport mode k",
      complexity: "High",
      accuracy: "95-98%",
      useCase: "Reduce environmental impact while maintaining service levels",
      backendFunction: "carbonFootprintOptimization",
      inputs: [
        { name: "routes", label: "Transportation Routes", type: "array" },
        { name: "transport_modes", label: "Transport Modes", type: "array" },
        { name: "emission_factors", label: "CO2 Emission Factors", type: "array", unit: "kg CO2/km" },
        { name: "service_constraints", label: "Service Level Constraints", type: "number", defaultValue: 95 }
      ],
      outputs: [
        { name: "optimized_routes", label: "Green Optimized Routes", unit: "routes" },
        { name: "total_emissions", label: "Total CO2 Emissions", unit: "kg CO2" },
        { name: "emission_reduction", label: "Emission Reduction", unit: "%" },
        { name: "cost_impact", label: "Cost Impact", unit: "currency" }
      ]
    },
    {
      id: "green-warehouse-optimization",
      name: "Green Warehouse Optimization",
      description: "Optimize warehouse operations for energy efficiency and sustainability.",
      formula: "Min Σ(E_i × C_i) subject to throughput and sustainability constraints",
      complexity: "Medium",
      accuracy: "90-95%",
      useCase: "Reduce warehouse energy consumption and environmental impact",
      backendFunction: "greenWarehouseOptimization",
      inputs: [
        { name: "warehouse_size", label: "Warehouse Size", type: "number", unit: "sqm" },
        { name: "throughput", label: "Required Throughput", type: "number", unit: "units/day" },
        { name: "energy_costs", label: "Energy Costs", type: "number", unit: "currency/kWh" },
        { name: "solar_potential", label: "Solar Energy Potential", type: "number", unit: "kWh/day" }
      ],
      outputs: [
        { name: "energy_consumption", label: "Optimized Energy Use", unit: "kWh/day" },
        { name: "renewable_percentage", label: "Renewable Energy %", unit: "%" },
        { name: "cost_savings", label: "Energy Cost Savings", unit: "currency/year" },
        { name: "carbon_savings", label: "CO2 Reduction", unit: "kg CO2/year" }
      ]
    },
    {
      id: "circular-economy-optimization",
      name: "Circular Economy Optimization",
      description: "Optimize supply chains for circular economy principles including recycling and reuse.",
      formula: "Max Σ(R_i × V_i) - Σ(W_j × C_j) where R is recovery value, W is waste cost",
      complexity: "High",
      accuracy: "88-92%",
      useCase: "Implement circular economy principles in supply chain design",
      backendFunction: "circularEconomyOptimization",
      inputs: [
        { name: "material_flows", label: "Material Flow Data", type: "array" },
        { name: "recycling_rates", label: "Recycling Rates", type: "array", unit: "%" },
        { name: "recovery_values", label: "Material Recovery Values", type: "array", unit: "currency/kg" },
        { name: "waste_costs", label: "Waste Disposal Costs", type: "array", unit: "currency/kg" }
      ],
      outputs: [
        { name: "circular_design", label: "Circular Supply Chain Design", unit: "structure" },
        { name: "waste_reduction", label: "Waste Reduction", unit: "%" },
        { name: "material_recovery", label: "Material Recovery Rate", unit: "%" },
        { name: "economic_value", label: "Economic Value Created", unit: "currency" }
      ]
    },
    {
      id: "sustainable-supplier-selection",
      name: "Sustainable Supplier Selection",
      description: "Multi-criteria supplier selection incorporating environmental and social factors.",
      formula: "Max Σ(w_i × s_ij) where w_i are sustainability weights, s_ij are supplier scores",
      complexity: "Medium",
      accuracy: "85-90%",
      useCase: "Select suppliers based on sustainability, cost, and performance criteria",
      backendFunction: "sustainableSupplierSelection",
      inputs: [
        { name: "suppliers", label: "Supplier Data", type: "array" },
        { name: "sustainability_weights", label: "Sustainability Criteria Weights", type: "array" },
        { name: "cost_weight", label: "Cost Weight", type: "number", defaultValue: 0.3 },
        { name: "quality_weight", label: "Quality Weight", type: "number", defaultValue: 0.3 },
        { name: "sustainability_weight", label: "Sustainability Weight", type: "number", defaultValue: 0.4 }
      ],
      outputs: [
        { name: "supplier_rankings", label: "Supplier Rankings", unit: "ranking" },
        { name: "sustainability_scores", label: "Sustainability Scores", unit: "score" },
        { name: "optimal_mix", label: "Optimal Supplier Mix", unit: "allocation" },
        { name: "impact_assessment", label: "Environmental Impact", unit: "assessment" }
      ]
    }
  ]
};

export default sustainabilityOptimization;