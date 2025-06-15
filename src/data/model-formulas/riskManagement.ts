
import { SupplyChainModel } from "../modelFormulaRegistry";

const riskManagement: SupplyChainModel = {
  id: "risk-management",
  name: "Risk Management",
  description: "Supply chain risk management and scenario models.",
  category: "Resilience",
  formulas: [
    {
      id: "value-at-risk",
      name: "Value at Risk (VaR)",
      description: "Quantifies worst expected loss for a given confidence level.",
      formula: "VaR = μ - z_α × σ",
      complexity: "Advanced",
      accuracy: "85%",
      useCase: "Quantify potential supply chain losses",
      backendFunction: "valueAtRisk",
      inputs: [
        { name: "meanReturn", label: "Mean Return (μ)", type: "number" },
        { name: "confidenceLevel", label: "Confidence Level (z_α)", type: "number" },
        { name: "stdDev", label: "Standard Deviation (σ)", type: "number" }
      ],
      outputs: [
        { name: "varAmount", label: "Value at Risk", unit: "Ksh" }
      ]
    },
    {
      id: "supplier-risk-assessment",
      name: "Supplier Risk Assessment",
      description: "Scores supplier risk for reliability and performance.",
      formula: "Risk Score = Σ wᵢ × rᵢ",
      complexity: "Intermediate",
      accuracy: "80%",
      useCase: "Supplier reliability ranking",
      backendFunction: "supplierRiskAssessment",
      inputs: [
        { name: "weights", label: "Weight Factors", type: "array" },
        { name: "riskScores", label: "Supplier Scores", type: "array" }
      ],
      outputs: [
        { name: "riskScore", label: "Supplier Risk Score" }
      ]
    },
    {
      id: "disruption-impact-analysis",
      name: "Disruption Impact Analysis",
      description: "Estimates impact of supply disruption dangers.",
      formula: "Impact = Probability × Severity × Recovery Time",
      complexity: "Intermediate",
      accuracy: "75%",
      useCase: "Scenario analysis of disruption events",
      backendFunction: "disruptionImpactAnalysis",
      inputs: [
        { name: "probability", label: "Probability", type: "number" },
        { name: "severity", label: "Severity", type: "number" },
        { name: "recoveryTime", label: "Recovery Time", type: "number" }
      ],
      outputs: [
        { name: "impactScore", label: "Disruption Impact" }
      ]
    },
    {
      id: "monte-carlo-risk",
      name: "Monte Carlo Risk Analysis",
      description: "Monte Carlo simulation of combined supply risk.",
      formula: "Simulate random scenarios and risk metrics",
      complexity: "Expert",
      accuracy: "88%",
      useCase: "Comprehensive risk assessment",
      backendFunction: "monteCarloRiskAnalysis",
      inputs: [
        { name: "riskVariables", label: "Risk Variables", type: "array" }
      ],
      outputs: [
        { name: "riskSimResults", label: "Risk Simulation Outcomes" }
      ]
    },
    {
      id: "scenario-risk-analysis",
      name: "Scenario Risk Analysis",
      description: "Models multiple supply chain failure and risk recovery scenarios.",
      formula: "Simulate scenario tree and enumerate recoveries",
      complexity: "Advanced",
      accuracy: "90%",
      useCase: "Resiliency planning",
      backendFunction: "scenarioRiskAnalysis",
      inputs: [
        { name: "scenarioTree", label: "Scenario Tree", type: "array" },
        { name: "recoveryTimes", label: "Possible Recoveries", type: "array" }
      ],
      outputs: [
        { name: "scenarioResults", label: "Scenario Outcomes" }
      ]
    }
  ]
};

export default riskManagement;
