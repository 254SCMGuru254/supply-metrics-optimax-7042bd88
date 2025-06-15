
import { SupplyChainModel } from "../modelFormulaRegistry";

const networkOptimization: SupplyChainModel = {
  id: "network-optimization",
  name: "Network Optimization",
  description: "Network flow, cost, and supply chain network optimization models.",
  category: "Network",
  formulas: [
    {
      id: "min-cost-flow",
      name: "Minimum Cost Flow",
      description: "Optimizes cost in network flows with capacity limits.",
      formula: "Min Σ Σ c_ij × x_ij",
      complexity: "Advanced",
      accuracy: "98%",
      useCase: "Least cost flow through network",
      backendFunction: "solveMinCostFlow",
      inputs: [
        { name: "arcCosts", label: "Arc Costs Matrix", type: "array" },
        { name: "capacities", label: "Arc Capacities", type: "array" }
      ],
      outputs: [
        { name: "flowResults", label: "Optimal Flow Assignment" }
      ]
    },
    {
      id: "max-flow",
      name: "Maximum Flow",
      description: "Finds maximum feasible flow from source to sink.",
      formula: "Max f subject to capacity constraints",
      complexity: "Intermediate",
      accuracy: "100%",
      useCase: "Maximize throughput in network",
      backendFunction: "solveMaxFlow",
      inputs: [
        { name: "capacityMatrix", label: "Capacity Matrix", type: "array" }
      ],
      outputs: [
        { name: "maxFlow", label: "Max Flow", unit: "units" }
      ]
    },
    {
      id: "network-simplex",
      name: "Network Simplex Method",
      description: "Solves minimum cost flow with network constraints using simplex.",
      formula: "LP improvement with network structure basis",
      complexity: "Expert",
      accuracy: "95%",
      useCase: "Large-scale network optimization",
      backendFunction: "networkSimplex",
      inputs: [
        { name: "supplyDemandData", label: "Supply/Demand", type: "array" }
      ],
      outputs: [
        { name: "optimalNetworkFlow", label: "Optimal Network Flow" }
      ]
    },
    {
      id: "shortest-path",
      name: "Shortest Path Flow Distribution",
      description: "Shortest route or path in weighted supply chain network.",
      formula: "d(v)=min{d(u)+w(u,v):(u,v)∈E}",
      complexity: "Basic",
      accuracy: "99%",
      useCase: "Routing and emergency flows",
      backendFunction: "calculateShortestPath",
      inputs: [
        { name: "adjacencyMatrix", label: "Adjacency Matrix", type: "array" }
      ],
      outputs: [
        { name: "shortestPath", label: "Path List" }
      ]
    },
    {
      id: "capacitated-flow",
      name: "Capacitated Network Flow",
      description: "Flow solving with explicit capacity on nodes/edges.",
      formula: "Σ(x_ij) ≤ capacity(i), x_ij ≤ capacity(i,j)",
      complexity: "Advanced",
      accuracy: "93%",
      useCase: "Model real-world network bottlenecks",
      backendFunction: "capacitatedFlow",
      inputs: [
        { name: "nodeCaps", label: "Node Capacities", type: "array" },
        { name: "edgeCaps", label: "Edge Capacities", type: "array" }
      ],
      outputs: [
        { name: "flowAssignment", label: "Edge Flows" }
      ]
    },
    {
      id: "multi-commodity-flow",
      name: "Multi-Commodity Flow",
      description: "Supports multi-product flows through a network.",
      formula: "Σk(xijk) ≤ uij ∀ edges, flow conservation by commodity",
      complexity: "Expert",
      accuracy: "90%",
      useCase: "Multi-product supply/distribution",
      backendFunction: "multiCommodityFlow",
      inputs: [
        { name: "commodityData", label: "Commodity List", type: "array" }
      ],
      outputs: [
        { name: "commodityFlows", label: "Flows by Commodity" }
      ]
    }
  ]
};

export default networkOptimization;
