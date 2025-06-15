
import { SupplyChainModel } from "../modelFormulaRegistry";

const heuristicOptimization: SupplyChainModel = {
  id: "heuristic-optimization",
  name: "Heuristic Optimization",
  description: "Heuristic and metaheuristic optimization algorithms.",
  category: "Algorithms",
  formulas: [
    {
      id: "simulated-annealing",
      name: "Simulated Annealing",
      description: "Metaheuristic for combinatorial optimization by simulating annealing process.",
      formula: "T_n+1 = α * T_n; accept w.p. exp(-ΔE/T)",
      complexity: "Advanced",
      accuracy: "95%",
      useCase: "Solve complex routing and layout problems",
      backendFunction: "simulatedAnnealing",
      inputs: [
        { name: "initialTemp", label: "Initial Temperature", type: "number" },
        { name: "coolingRate", label: "Cooling Rate", type: "number" }
      ],
      outputs: [
        { name: "bestSolution", label: "Best Solution Found" }
      ]
    },
    {
      id: "genetic-algorithm",
      name: "Genetic Algorithm",
      description: "Evolutionary metaheuristic using populations, recombination, and mutation.",
      formula: "Select | Crossover | Mutate",
      complexity: "Expert",
      accuracy: "92%",
      useCase: "Supply chain model optimization with many variables",
      backendFunction: "geneticAlgorithm",
      inputs: [
        { name: "populationSize", label: "Population Size", type: "number" },
        { name: "generations", label: "Number of Generations", type: "number" }
      ],
      outputs: [
        { name: "optimizedSolution", label: "Optimized Variable Set" }
      ]
    },
    {
      id: "particle-swarm",
      name: "Particle Swarm Optimization",
      description: "Swarm-based optimization using velocity and social learning.",
      formula: "v_i = wv_i + c1r1(p_i-x_i) + c2r2(g-x_i)",
      complexity: "Expert",
      accuracy: "91%",
      useCase: "Complex, non-continuous optimization problems",
      backendFunction: "particleSwarmOptimization",
      inputs: [
        { name: "numParticles", label: "Number of Particles", type: "number" },
        { name: "iterations", label: "Iterations", type: "number" }
      ],
      outputs: [
        { name: "globalBest", label: "Global Best Solution" }
      ]
    },
    {
      id: "tabu-search",
      name: "Tabu Search",
      description: "Improvement metaheuristic with history/memory to avoid local optima.",
      formula: "Use tabu list, move to best non-tabu neighbor",
      complexity: "Advanced",
      accuracy: "90%",
      useCase: "Avoid local optima in hard optimization problems",
      backendFunction: "tabuSearch",
      inputs: [
        { name: "tabuListSize", label: "Tabu List Size", type: "number" },
        { name: "maxIterations", label: "Max Iterations", type: "number" }
      ],
      outputs: [
        { name: "finalSolution", label: "Final Solution" }
      ]
    }
  ]
};

export default heuristicOptimization;
