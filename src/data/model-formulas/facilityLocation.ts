
import { SupplyChainModel } from "../modelFormulaRegistry";

const facilityLocation: SupplyChainModel = {
  id: "facility-location",
  name: "Facility Location",
  description: "Facility location, p-median, and candidate site selection models.",
  category: "Facility Location",
  formulas: [
    {
      id: "p-median-problem",
      name: "P-Median Model",
      description: "Selects facility locations to minimize total weighted distance.",
      formula: "Min Σ Σ dᵢⱼ × hᵢ × xᵢⱼ",
      complexity: "Intermediate",
      accuracy: "92%",
      useCase: "Minimize weighted facility distance",
      backendFunction: "pMedian",
      inputs: [
        { name: "distanceMatrix", label: "Distance Matrix", type: "array" },
        { name: "demands", label: "Demand at Points", type: "array" }
      ],
      outputs: [
        { name: "assignedFacilities", label: "Assigned Facilities" }
      ]
    },
    {
      id: "capacitated-facility-location",
      name: "Capacitated Facility Location Problem",
      description: "Assigns facilities with capacity and cost to demand points.",
      formula: "Min Σ fⱼ × yⱼ + Σ Σ cᵢⱼ × xᵢⱼ",
      complexity: "Advanced",
      accuracy: "90%",
      useCase: "Facility site optimization with constraints",
      backendFunction: "capacitatedFacilityLocation",
      inputs: [
        { name: "fixedCosts", label: "Facility Fixed Costs", type: "array" },
        { name: "demands", label: "Demand Points", type: "array" }
      ],
      outputs: [
        { name: "optimizedAssignment", label: "Facility Assignments" }
      ]
    },
    {
      id: "hub-location-problem",
      name: "Hub Location Problem",
      description: "Optimizes placement for hub-and-spoke networks.",
      formula: "Min Σ Σ Σ Σ cᵢₖcₖₗdₗⱼ × xᵢⱼₖₗ",
      complexity: "Expert",
      accuracy: "88%",
      useCase: "Optimal hub placement",
      backendFunction: "hubLocation",
      inputs: [
        { name: "costs", label: "Hub Costs", type: "array" }
      ],
      outputs: [
        { name: "hubs", label: "Selected Hubs" }
      ]
    },
    {
      id: "warehouse-location-optimization",
      name: "Warehouse Location Optimization",
      description: "Full facility network with fixed and operating costs.",
      formula: "Min total cost = Fixed + Transportation + Operating",
      complexity: "Expert",
      accuracy: "85%",
      useCase: "End-to-end warehouse network design",
      backendFunction: "warehouseLocationOptimization",
      inputs: [
        { name: "locations", label: "Facility Locations", type: "array" },
        { name: "fixedCosts", label: "Fixed Costs", type: "array" }
      ],
      outputs: [
        { name: "bestConfig", label: "Best Network Configuration" }
      ]
    }
  ]
};

export default facilityLocation;
