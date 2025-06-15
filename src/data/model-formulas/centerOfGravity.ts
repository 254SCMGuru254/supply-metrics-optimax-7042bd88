
import { SupplyChainModel } from "../modelFormulaRegistry";

const centerOfGravity: SupplyChainModel = {
  id: "center-of-gravity",
  name: "Center of Gravity",
  description: "Center of gravity models for facility location and logistics.",
  category: "Location",
  formulas: [
    {
      id: "weighted-center-gravity",
      name: "Weighted Average (COG)",
      description: "Finds optimal facility location by demand and coordinate weighting.",
      formula: "X = Σ(w_i × x_i) / Σw_i, Y = Σ(w_i × y_i) / Σw_i",
      complexity: "Basic",
      accuracy: "96%",
      useCase: "Find optimal facility location",
      backendFunction: "calculateWeightedCenterOfGravity",
      inputs: [
        { name: "demandPoints", label: "Demand Points", type: "array" }
      ],
      outputs: [
        { name: "coordinates", label: "Optimal Coordinates" }
      ]
    },
    {
      id: "geometric-median",
      name: "Geometric Median COG",
      description: "COG minimizing total Euclidean distance to all points.",
      formula: "Min Σ √[(x - x_i)² + (y - y_i)²]",
      complexity: "Advanced",
      accuracy: "97%",
      useCase: "Center minimizing actual travel distance",
      backendFunction: "calculateGeometricMedian",
      inputs: [
        { name: "pointArray", label: "Point Array", type: "array" }
      ],
      outputs: [
        { name: "centerPoint", label: "Geometric Median" }
      ]
    },
    {
      id: "economic-center-gravity",
      name: "Economic Center of Gravity",
      description: "COG optimizing for economic/transport cost.",
      formula: "Min Σ (weight_i × cost_i × d_i)",
      complexity: "Intermediate",
      accuracy: "94%",
      useCase: "Cost-minimizing facility location",
      backendFunction: "calculateEconomicCenter",
      inputs: [
        { name: "costPoints", label: "Cost Points", type: "array" }
      ],
      outputs: [
        { name: "econCOG", label: "Economic Center Coordinates" }
      ]
    },
    {
      id: "haversine-center-gravity",
      name: "Haversine (Great Circle)",
      description: "COG calculation using haversine formula for geodesic distances.",
      formula: "d = 2r × arcsin(√(sin²(Δφ/2) + cos φ₁ × cos φ₂ × sin²(Δλ/2)))",
      complexity: "Advanced",
      accuracy: "99%",
      useCase: "Geographical location optimization",
      backendFunction: "calculateHaversineCOG",
      inputs: [
        { name: "latLngPoints", label: "Geo Points", type: "array" }
      ],
      outputs: [
        { name: "centerLatLng", label: "COG Lat/Lon" }
      ]
    },
    {
      id: "manhattan-center-gravity",
      name: "Manhattan Center of Gravity",
      description: "Finds COG with grid (L1) distance.",
      formula: "d = |x₁ - x₂| + |y₁ - y₂|",
      complexity: "Intermediate",
      accuracy: "100%",
      useCase: "Grid-based distance calculations",
      backendFunction: "calculateManhattanCOG",
      inputs: [
        { name: "gridCoords", label: "Grid Coordinates", type: "array" }
      ],
      outputs: [
        { name: "centerPoint", label: "Manhattan COG" }
      ]
    },
    {
      id: "road-network-cog",
      name: "Road Network COG",
      description: "Optimizes location using road network cost/distance.",
      formula: "Min Σ(travel_time_ij × demand_j) / Σdemand_j",
      complexity: "Advanced",
      accuracy: "95%",
      useCase: "Facility location using road network data",
      backendFunction: "roadNetworkCOG",
      inputs: [
        { name: "roadData", label: "Road Distance Matrix", type: "array" }
      ],
      outputs: [
        { name: "roadCOG", label: "Network COG" }
      ]
    },
    {
      id: "multi-criteria-cog",
      name: "Multi-Criteria COG",
      description: "COG based on weighted multiple factors (cost/risk/time/market).",
      formula: "COG = Σ(w_i × f_i(x, y)) / Σw_i",
      complexity: "Expert",
      accuracy: "89%",
      useCase: "Location analysis with multiple objectives",
      backendFunction: "multiCriteriaCOG",
      inputs: [
        { name: "criteria", label: "Criteria Weights", type: "array" }
      ],
      outputs: [
        { name: "coord", label: "COG Coordinates" }
      ]
    },
    {
      id: "seasonal-cog",
      name: "Seasonal/Dynamic COG",
      description: "Adjusts COG based on changing/seasonal demand.",
      formula: "COG(t) = Σ(w_i(t) × x_i) / Σw_i(t)",
      complexity: "Advanced",
      accuracy: "87%",
      useCase: "Seasonal warehouse location analysis",
      backendFunction: "seasonalCOG",
      inputs: [
        { name: "seasonalData", label: "Seasonal Demand Points", type: "array" }
      ],
      outputs: [
        { name: "seasonalCOG", label: "COG per Season" }
      ]
    },
    {
      id: "risk-adjusted-cog",
      name: "Risk-Adjusted COG",
      description: "COG with weighted risk factors for resiliency.",
      formula: "COG = Σ(w_i × r_i × x_i) / Σ(w_i × r_i)",
      complexity: "Expert",
      accuracy: "86%",
      useCase: "Location selection with supply chain risk",
      backendFunction: "riskAdjustedCOG",
      inputs: [
        { name: "riskData", label: "Risk Points", type: "array" }
      ],
      outputs: [
        { name: "riskCOG", label: "Risk-Adjusted COG" }
      ]
    }
  ]
};

export default centerOfGravity;
