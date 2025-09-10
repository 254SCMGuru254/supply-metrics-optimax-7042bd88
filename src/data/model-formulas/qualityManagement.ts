import { SupplyChainModel } from '../modelFormulaRegistry';

const qualityManagement: SupplyChainModel = {
  id: "quality-management",
  name: "Quality Management",
  description: "Quality control, Six Sigma, and statistical process control models for supply chain quality.",
  category: "Quality",
  formulas: [
    {
      id: "six-sigma-analysis",
      name: "Six Sigma DMAIC Analysis",
      description: "Define, Measure, Analyze, Improve, Control methodology for quality improvement.",
      formula: "Sigma Level = (USL - LSL) / (6 × σ), Defect Rate = NORMSDIST(-Sigma Level) × 1,000,000",
      complexity: "High",
      accuracy: "95-99%",
      useCase: "Systematic quality improvement and defect reduction",
      backendFunction: "sixSigmaAnalysis",
      inputs: [
        { name: "process_data", label: "Process Performance Data", type: "array" },
        { name: "usl", label: "Upper Specification Limit", type: "number" },
        { name: "lsl", label: "Lower Specification Limit", type: "number" },
        { name: "target_value", label: "Target Value", type: "number" },
        { name: "sample_size", label: "Sample Size", type: "number", defaultValue: 100 }
      ],
      outputs: [
        { name: "sigma_level", label: "Current Sigma Level", unit: "σ" },
        { name: "defect_rate", label: "Defects Per Million Opportunities", unit: "DPMO" },
        { name: "process_capability", label: "Process Capability (Cpk)", unit: "index" },
        { name: "improvement_recommendations", label: "Improvement Actions", unit: "recommendations" }
      ]
    },
    {
      id: "statistical-process-control",
      name: "Statistical Process Control (SPC)",
      description: "Monitor and control process variation using control charts and statistical methods.",
      formula: "UCL = μ + 3σ, LCL = μ - 3σ, Control Limits for X̄ chart",
      complexity: "Medium",
      accuracy: "92-96%",
      useCase: "Real-time process monitoring and quality control",
      backendFunction: "statisticalProcessControl",
      inputs: [
        { name: "measurement_data", label: "Process Measurements", type: "array" },
        { name: "subgroup_size", label: "Subgroup Size", type: "number", defaultValue: 5 },
        { name: "chart_type", label: "Control Chart Type", type: "select", defaultValue: "x_bar_r" },
        { name: "confidence_level", label: "Confidence Level", type: "number", defaultValue: 99.7 }
      ],
      outputs: [
        { name: "control_limits", label: "Control Limits", unit: "limits" },
        { name: "out_of_control_points", label: "Out of Control Points", unit: "points" },
        { name: "process_stability", label: "Process Stability Index", unit: "index" },
        { name: "control_charts", label: "Control Charts", unit: "charts" }
      ]
    },
    {
      id: "quality-cost-optimization",
      name: "Quality Cost Optimization",
      description: "Optimize the total cost of quality including prevention, appraisal, and failure costs.",
      formula: "Total Quality Cost = Prevention + Appraisal + Internal Failure + External Failure",
      complexity: "Medium",
      accuracy: "88-93%",
      useCase: "Balance quality investment with defect costs",
      backendFunction: "qualityCostOptimization",
      inputs: [
        { name: "prevention_costs", label: "Prevention Costs", type: "number", unit: "currency" },
        { name: "appraisal_costs", label: "Appraisal Costs", type: "number", unit: "currency" },
        { name: "internal_failure_costs", label: "Internal Failure Costs", type: "number", unit: "currency" },
        { name: "external_failure_costs", label: "External Failure Costs", type: "number", unit: "currency" },
        { name: "quality_improvement_investment", label: "Quality Investment", type: "number", unit: "currency" }
      ],
      outputs: [
        { name: "optimal_quality_investment", label: "Optimal Quality Investment", unit: "currency" },
        { name: "total_quality_cost", label: "Total Cost of Quality", unit: "currency" },
        { name: "roi_quality_investment", label: "ROI on Quality Investment", unit: "%" },
        { name: "cost_breakdown", label: "Quality Cost Breakdown", unit: "breakdown" }
      ]
    },
    {
      id: "supplier-quality-assessment",
      name: "Supplier Quality Assessment",
      description: "Evaluate and score supplier quality performance using multiple quality metrics.",
      formula: "Quality Score = Σ(w_i × Q_i) where w_i are weights, Q_i are quality metrics",
      complexity: "Medium",
      accuracy: "90-94%",
      useCase: "Assess and improve supplier quality performance",
      backendFunction: "supplierQualityAssessment",
      inputs: [
        { name: "supplier_data", label: "Supplier Performance Data", type: "array" },
        { name: "defect_rates", label: "Defect Rates", type: "array", unit: "%" },
        { name: "delivery_performance", label: "On-Time Delivery", type: "array", unit: "%" },
        { name: "certification_scores", label: "Quality Certifications", type: "array" }
      ],
      outputs: [
        { name: "supplier_scores", label: "Quality Scores by Supplier", unit: "score" },
        { name: "quality_rankings", label: "Supplier Quality Rankings", unit: "ranking" },
        { name: "improvement_areas", label: "Quality Improvement Areas", unit: "areas" },
        { name: "risk_assessment", label: "Quality Risk Assessment", unit: "risk_level" }
      ]
    }
  ]
};

export default qualityManagement;