
import { SupplyChainModel } from "../modelFormulaRegistry";

const fleetManagement: SupplyChainModel = {
  id: "fleet-management",
  name: "Fleet Management",
  description: "Fleet management, vehicle assignment, maintenance algorithms.",
  category: "Fleet",
  formulas: [
    {
      id: "vehicle-assignment-optimization",
      name: "Vehicle Assignment Optimization",
      description: "Optimizes assignment of vehicles to routes/deliveries.",
      formula: "Max Σ assignment_score(i,j) subject to capacity/constraints",
      complexity: "Advanced",
      accuracy: "92%",
      useCase: "Optimal matching of vehicles to jobs",
      backendFunction: "vehicleAssignmentOptimization",
      inputs: [
        { name: "vehicleData", label: "Vehicle Data", type: "array" },
        { name: "routeData", label: "Route Data", type: "array" }
      ],
      outputs: [
        { name: "assignments", label: "Vehicle Assignments" }
      ]
    },
    {
      id: "maintenance-scheduling",
      name: "Maintenance Scheduling",
      description: "Creates optimal maintenance plans for fleet vehicles.",
      formula: "Min Σ downtime × cost, subject to maintenance intervals",
      complexity: "Intermediate",
      accuracy: "89%",
      useCase: "Reduce fleet downtime and costs",
      backendFunction: "maintenanceScheduling",
      inputs: [
        { name: "maintenanceData", label: "Maintenance Intervals", type: "array" },
        { name: "costs", label: "Costs", type: "array" }
      ],
      outputs: [
        { name: "schedule", label: "Maintenance Schedule" }
      ]
    },
    {
      id: "fleet-utilization-calculation",
      name: "Fleet Utilization Calculation",
      description: "Analyzes utilization rate for fleet vehicles.",
      formula: "Utilization = Used Hours / Total Available Hours",
      complexity: "Basic",
      accuracy: "87%",
      useCase: "Monitor and improve fleet efficiency",
      backendFunction: "fleetUtilization",
      inputs: [
        { name: "usedHours", label: "Used Hours", type: "number" },
        { name: "totalHours", label: "Total Available Hours", type: "number" }
      ],
      outputs: [
        { name: "utilization", label: "Utilization Rate", unit: "%" }
      ]
    }
  ]
};

export default fleetManagement;
