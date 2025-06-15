
import { SupplyChainModel } from "../modelFormulaRegistry";

const simulation: SupplyChainModel = {
  id: "simulation",
  name: "Simulation",
  description: "Stochastic simulation models and Monte Carlo for supply chain.",
  category: "Simulation",
  formulas: [
    {
      id: "monte-carlo",
      name: "Monte Carlo Simulation",
      description: "Uses random sampling to model system performance/risk.",
      formula: "Simulate scenario outcomes by sampling random variables",
      complexity: "Advanced",
      accuracy: "88%",
      useCase: "Assess uncertainty in supply chains",
      backendFunction: "monteCarloSimulation",
      inputs: [
        { name: "numTrials", label: "Number of Trials", type: "number" },
        { name: "inputDistributions", label: "Input Distributions", type: "array" }
      ],
      outputs: [
        { name: "simulationResults", label: "Simulation Results" }
      ]
    },
    {
      id: "discrete-event",
      name: "Discrete Event Simulation",
      description: "Models supply chain as sequence of discrete events.",
      formula: "Advance clock to next event, update system state",
      complexity: "Expert",
      accuracy: "91%",
      useCase: "Detailed process and queue modeling",
      backendFunction: "discreteEventSimulation",
      inputs: [
        { name: "eventList", label: "Event List", type: "array" }
      ],
      outputs: [
        { name: "eventSimResults", label: "Event Sim Results" }
      ]
    },
    {
      id: "system-dynamics",
      name: "System Dynamics Simulation",
      description: "System-wide, continuous simulation with stocks and flows.",
      formula: "dS/dt = inflow - outflow",
      complexity: "Expert",
      accuracy: "90%",
      useCase: "Assess policy/systemic effects in supply networks",
      backendFunction: "systemDynamicsSimulation",
      inputs: [
        { name: "stocks", label: "Stock Variables", type: "array" },
        { name: "flows", label: "Flow Functions", type: "array" }
      ],
      outputs: [
        { name: "dynamicSimResults", label: "System Dynamics Results" }
      ]
    }
  ]
};

export default simulation;
