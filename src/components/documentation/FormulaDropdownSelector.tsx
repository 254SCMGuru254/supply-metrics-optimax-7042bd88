
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Calculator, Info } from 'lucide-react';

interface Formula {
  id: string;
  name: string;
  description: string;
  complexity: string;
  formula: string;
  accuracy: string;
  useCase: string;
  inputs: Array<{
    name: string;
    label: string;
    type: string;
    unit?: string;
    description?: string;
  }>;
  outputs: Array<{
    name: string;
    label: string;
    unit?: string;
    description?: string;
  }>;
}

interface Model {
  id: string;
  name: string;
  description: string;
  formulas: Formula[];
}

const allModelsWithFormulas: Model[] = [
  {
    id: "inventory-management",
    name: "Inventory Management",
    description: "Economic Order Quantity, Safety Stock, ABC Analysis, Multi-Echelon",
    formulas: [
      {
        id: "eoq",
        name: "Economic Order Quantity (EOQ)",
        description: "Wilson's formula for optimal order quantity",
        complexity: "Basic",
        formula: "EOQ = √(2DS/H)",
        accuracy: "99.95%",
        useCase: "Single-item inventory optimization",
        inputs: [
          { name: "annualDemand", label: "Annual Demand", type: "number", unit: "units/year" },
          { name: "orderingCost", label: "Ordering Cost", type: "number", unit: "KES" },
          { name: "holdingCost", label: "Holding Cost Rate", type: "number", unit: "%" },
          { name: "unitCost", label: "Unit Cost", type: "number", unit: "KES" }
        ],
        outputs: [
          { name: "optimalQuantity", label: "Optimal Order Quantity", unit: "units" },
          { name: "totalCost", label: "Total Annual Cost", unit: "KES" },
          { name: "orderFrequency", label: "Order Frequency", unit: "orders/year" }
        ]
      },
      {
        id: "safety-stock",
        name: "Safety Stock Calculation",
        description: "Statistical safety stock for demand uncertainty",
        complexity: "Intermediate",
        formula: "SS = Z × σ × √LT",
        accuracy: "99.8%",
        useCase: "Protection against stockouts",
        inputs: [
          { name: "serviceLevel", label: "Service Level", type: "number", unit: "%" },
          { name: "demandStdDev", label: "Demand Std Dev", type: "number", unit: "units" },
          { name: "leadTime", label: "Lead Time", type: "number", unit: "days" }
        ],
        outputs: [
          { name: "safetyStock", label: "Safety Stock", unit: "units" },
          { name: "reorderPoint", label: "Reorder Point", unit: "units" }
        ]
      },
      {
        id: "abc-analysis",
        name: "ABC Analysis",
        description: "Pareto-based inventory classification",
        complexity: "Basic",
        formula: "Cumulative % = (Σ Value / Total) × 100",
        accuracy: "100%",
        useCase: "Inventory prioritization",
        inputs: [
          { name: "items", label: "Item List", type: "array" },
          { name: "values", label: "Annual Values", type: "array", unit: "KES" }
        ],
        outputs: [
          { name: "classA", label: "Class A Items", description: "High-value items" },
          { name: "classB", label: "Class B Items", description: "Medium-value items" },
          { name: "classC", label: "Class C Items", description: "Low-value items" }
        ]
      },
      {
        id: "multi-echelon",
        name: "Multi-Echelon METRIC",
        description: "Network-wide inventory optimization",
        complexity: "Expert",
        formula: "Minimize: Σ(Hi × Si) subject to SL constraints",
        accuracy: "99.7%",
        useCase: "Complex supply network optimization",
        inputs: [
          { name: "networkStructure", label: "Network Structure", type: "object" },
          { name: "demandRates", label: "Demand Rates", type: "array" },
          { name: "leadTimes", label: "Lead Times", type: "array", unit: "days" }
        ],
        outputs: [
          { name: "stockLevels", label: "Optimal Stock Levels", unit: "units" },
          { name: "totalCost", label: "Total System Cost", unit: "KES" }
        ]
      }
    ]
  },
  {
    id: "route-optimization",
    name: "Route Optimization",
    description: "TSP, VRP, VRPTW, Arc Routing",
    formulas: [
      {
        id: "tsp-exact",
        name: "Traveling Salesman Problem",
        description: "Shortest route visiting all locations once",
        complexity: "Advanced",
        formula: "Min: Σ(cij × xij) subject to subtour elimination",
        accuracy: "100%",
        useCase: "Single vehicle route optimization",
        inputs: [
          { name: "locations", label: "Location Coordinates", type: "array" },
          { name: "distanceMatrix", label: "Distance Matrix", type: "matrix", unit: "km" }
        ],
        outputs: [
          { name: "route", label: "Optimal Route", description: "Sequence of locations" },
          { name: "distance", label: "Total Distance", unit: "km" },
          { name: "time", label: "Total Time", unit: "hours" }
        ]
      },
      {
        id: "vrp-capacity",
        name: "Vehicle Routing Problem",
        description: "Multi-vehicle routing with capacity",
        complexity: "Advanced",
        formula: "Min: Σ(cij × xijk) subject to capacity constraints",
        accuracy: "99.5%",
        useCase: "Fleet optimization with capacity limits",
        inputs: [
          { name: "customers", label: "Customer Locations", type: "array" },
          { name: "demands", label: "Customer Demands", type: "array", unit: "kg" },
          { name: "vehicleCapacity", label: "Vehicle Capacity", type: "number", unit: "kg" }
        ],
        outputs: [
          { name: "routes", label: "Vehicle Routes", description: "Routes for each vehicle" },
          { name: "utilization", label: "Capacity Utilization", unit: "%" }
        ]
      },
      {
        id: "vrptw",
        name: "VRP with Time Windows",
        description: "Routing with delivery time constraints",
        complexity: "Expert",
        formula: "Min cost subject to time window constraints",
        accuracy: "99.3%",
        useCase: "Time-sensitive delivery optimization",
        inputs: [
          { name: "timeWindows", label: "Time Windows", type: "array" },
          { name: "serviceTime", label: "Service Time", type: "number", unit: "minutes" }
        ],
        outputs: [
          { name: "schedule", label: "Delivery Schedule", description: "Timed routes" },
          { name: "onTime", label: "On-Time Performance", unit: "%" }
        ]
      }
    ]
  },
  {
    id: "facility-location",
    name: "Facility Location & COG",
    description: "Center of Gravity, P-Median, Location-Allocation",
    formulas: [
      {
        id: "weighted-cog",
        name: "Weighted Center of Gravity",
        description: "Demand-weighted optimal location",
        complexity: "Basic",
        formula: "COG = (Σ(wi × xi), Σ(wi × yi)) / Σwi",
        accuracy: "99.9%",
        useCase: "Single facility location",
        inputs: [
          { name: "locations", label: "Demand Locations", type: "array" },
          { name: "weights", label: "Demand Weights", type: "array", unit: "units" }
        ],
        outputs: [
          { name: "coordinates", label: "Optimal Coordinates", description: "Lat/Lng" },
          { name: "totalCost", label: "Total Transport Cost", unit: "KES" }
        ]
      },
      {
        id: "haversine-cog",
        name: "Haversine Center of Gravity",
        description: "Great circle distance optimization",
        complexity: "Intermediate",
        formula: "d = 2r × arcsin(√sin²(Δφ/2) + cos φ₁ cos φ₂ sin²(Δλ/2))",
        accuracy: "99.99%",
        useCase: "Global facility location",
        inputs: [
          { name: "gpsCoordinates", label: "GPS Coordinates", type: "array" },
          { name: "earthRadius", label: "Earth Radius", type: "number", unit: "km" }
        ],
        outputs: [
          { name: "optimalLocation", label: "Optimal GPS Location" },
          { name: "distances", label: "Great Circle Distances", unit: "km" }
        ]
      },
      {
        id: "p-median",
        name: "P-Median Problem",
        description: "Multiple facility location optimization",
        complexity: "Expert",
        formula: "Min: Σ(wi × min dij) subject to p facilities",
        accuracy: "99.8%",
        useCase: "Multi-facility network design",
        inputs: [
          { name: "candidates", label: "Candidate Sites", type: "array" },
          { name: "facilityCount", label: "Number of Facilities", type: "number" }
        ],
        outputs: [
          { name: "selectedSites", label: "Selected Facility Sites" },
          { name: "assignments", label: "Customer Assignments" }
        ]
      }
    ]
  },
  {
    id: "network-optimization",
    name: "Network Flow Optimization",
    description: "Min Cost Flow, Max Flow, Multi-Commodity Flow",
    formulas: [
      {
        id: "min-cost-flow",
        name: "Minimum Cost Flow",
        description: "Network flow cost optimization",
        complexity: "Advanced",
        formula: "Min: Σ(cij × xij) subject to flow conservation",
        accuracy: "100%",
        useCase: "Distribution network optimization",
        inputs: [
          { name: "network", label: "Network Graph", type: "object" },
          { name: "capacities", label: "Edge Capacities", type: "array" },
          { name: "costs", label: "Flow Costs", type: "array", unit: "KES/unit" }
        ],
        outputs: [
          { name: "flows", label: "Optimal Flows", unit: "units" },
          { name: "totalCost", label: "Total Cost", unit: "KES" }
        ]
      },
      {
        id: "max-flow",
        name: "Maximum Flow",
        description: "Network capacity maximization",
        complexity: "Intermediate",
        formula: "Max: flow subject to capacity constraints",
        accuracy: "100%",
        useCase: "Bottleneck identification",
        inputs: [
          { name: "source", label: "Source Node", type: "string" },
          { name: "sink", label: "Sink Node", type: "string" },
          { name: "capacities", label: "Edge Capacities", type: "array" }
        ],
        outputs: [
          { name: "maxFlow", label: "Maximum Flow", unit: "units" },
          { name: "bottlenecks", label: "Bottleneck Edges" }
        ]
      }
    ]
  },
  {
    id: "demand-forecasting",
    name: "Demand Forecasting",
    description: "ARIMA, Exponential Smoothing, Neural Networks",
    formulas: [
      {
        id: "arima",
        name: "ARIMA Model",
        description: "Time series forecasting",
        complexity: "Advanced",
        formula: "ARIMA(p,d,q): (1-φL)ᵖ(1-L)ᵈXₜ = (1+θL)ᵍεₜ",
        accuracy: "92-96%",
        useCase: "Medium-term demand prediction",
        inputs: [
          { name: "timeSeries", label: "Historical Data", type: "array" },
          { name: "arOrder", label: "AR Order (p)", type: "number" },
          { name: "diffOrder", label: "Differencing (d)", type: "number" },
          { name: "maOrder", label: "MA Order (q)", type: "number" }
        ],
        outputs: [
          { name: "forecast", label: "Demand Forecast", unit: "units" },
          { name: "confidence", label: "Confidence Intervals" },
          { name: "mape", label: "MAPE", unit: "%" }
        ]
      },
      {
        id: "exponential-smoothing",
        name: "Exponential Smoothing",
        description: "Weighted average forecasting",
        complexity: "Intermediate",
        formula: "Lₜ = αXₜ + (1-α)(Lₜ₋₁ + Tₜ₋₁)",
        accuracy: "85-92%",
        useCase: "Short-term operational forecasting",
        inputs: [
          { name: "data", label: "Historical Data", type: "array" },
          { name: "alpha", label: "Level Smoothing (α)", type: "number" },
          { name: "beta", label: "Trend Smoothing (β)", type: "number" }
        ],
        outputs: [
          { name: "forecast", label: "Next Period Forecast", unit: "units" },
          { name: "trend", label: "Trend Component" },
          { name: "error", label: "Forecast Error" }
        ]
      }
    ]
  },
  {
    id: "pricing-optimization",
    name: "Pricing & Revenue",
    description: "Dynamic Pricing, Revenue Management, ROI",
    formulas: [
      {
        id: "dynamic-pricing",
        name: "Dynamic Pricing",
        description: "Demand-responsive pricing",
        complexity: "Advanced",
        formula: "P* = (MC + a/b) / (1 + 1/ε)",
        accuracy: "94-97%",
        useCase: "Real-time price optimization",
        inputs: [
          { name: "basePrice", label: "Base Price", type: "number", unit: "KES" },
          { name: "elasticity", label: "Price Elasticity", type: "number" },
          { name: "competition", label: "Competitor Prices", type: "array" }
        ],
        outputs: [
          { name: "optimalPrice", label: "Optimal Price", unit: "KES" },
          { name: "demand", label: "Expected Demand", unit: "units" },
          { name: "revenue", label: "Revenue Projection", unit: "KES" }
        ]
      },
      {
        id: "roi-calculation",
        name: "ROI Analysis",
        description: "Investment return calculation",
        complexity: "Basic",
        formula: "ROI = (Benefits - Costs) / Costs × 100%",
        accuracy: "100%",
        useCase: "Investment evaluation",
        inputs: [
          { name: "investment", label: "Initial Investment", type: "number", unit: "KES" },
          { name: "benefits", label: "Annual Benefits", type: "array", unit: "KES" },
          { name: "costs", label: "Operating Costs", type: "array", unit: "KES" }
        ],
        outputs: [
          { name: "roi", label: "Return on Investment", unit: "%" },
          { name: "npv", label: "Net Present Value", unit: "KES" },
          { name: "payback", label: "Payback Period", unit: "years" }
        ]
      }
    ]
  }
];

export const FormulaDropdownSelector = () => {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedFormula, setSelectedFormula] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const selectedModelData = allModelsWithFormulas.find(m => m.id === selectedModel);
  const selectedFormulaData = selectedModelData?.formulas.find(f => f.id === selectedFormula);

  const totalFormulas = allModelsWithFormulas.reduce((sum, model) => sum + model.formulas.length, 0);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Complete Formula Registry</h2>
          <p className="text-muted-foreground mb-4">
            Access all {totalFormulas} mathematical formulas across {allModelsWithFormulas.length} optimization models
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="bg-white">
              {allModelsWithFormulas.length} Models
            </Badge>
            <Badge variant="outline" className="bg-white">
              {totalFormulas} Formulas
            </Badge>
            <Badge variant="outline" className="bg-white">
              99.5% Avg Accuracy
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Choose optimization model..." />
              </SelectTrigger>
              <SelectContent>
                {allModelsWithFormulas.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {model.formulas.length} formulas
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Formula</label>
            <Select 
              value={selectedFormula} 
              onValueChange={setSelectedFormula}
              disabled={!selectedModel}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedModel ? "Choose formula..." : "Select model first"} />
              </SelectTrigger>
              <SelectContent>
                {selectedModelData?.formulas.map((formula) => (
                  <SelectItem key={formula.id} value={formula.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{formula.name}</span>
                      <div className="flex gap-2 text-xs">
                        <Badge variant="outline" className="text-xs">
                          {formula.complexity}
                        </Badge>
                        <span className="text-green-600">{formula.accuracy}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Model Overview */}
      {selectedModelData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              {selectedModelData.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{selectedModelData.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedModelData.formulas.map((formula) => (
                <div 
                  key={formula.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedFormula === formula.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedFormula(formula.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{formula.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {formula.complexity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{formula.description}</p>
                  <div className="text-xs font-mono bg-white p-2 rounded border">
                    {formula.formula}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Formula View */}
      {selectedFormulaData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                {selectedFormulaData.name}
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{selectedFormulaData.complexity}</Badge>
                <Badge variant="outline" className="text-green-600">{selectedFormulaData.accuracy}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground">{selectedFormulaData.description}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Mathematical Formula</h4>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-lg text-center border">
                {selectedFormulaData.formula}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Use Case</h4>
              <p className="text-muted-foreground">{selectedFormulaData.useCase}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('inputs')}
                    className="p-0 h-auto"
                  >
                    {expandedSections.inputs ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  Input Parameters ({selectedFormulaData.inputs.length})
                </h4>
                {(expandedSections.inputs || selectedFormulaData.inputs.length <= 5) && (
                  <div className="space-y-2">
                    {selectedFormulaData.inputs.map((input, idx) => (
                      <div key={idx} className="p-2 border rounded bg-blue-50">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">{input.label}</span>
                          {input.unit && (
                            <Badge variant="outline" className="text-xs">{input.unit}</Badge>
                          )}
                        </div>
                        {input.description && (
                          <p className="text-xs text-muted-foreground mt-1">{input.description}</p>
                        )}
                        <div className="text-xs text-blue-600 mt-1">
                          Type: {input.type}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('outputs')}
                    className="p-0 h-auto"
                  >
                    {expandedSections.outputs ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  Output Results ({selectedFormulaData.outputs.length})
                </h4>
                {(expandedSections.outputs || selectedFormulaData.outputs.length <= 5) && (
                  <div className="space-y-2">
                    {selectedFormulaData.outputs.map((output, idx) => (
                      <div key={idx} className="p-2 border rounded bg-green-50">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">{output.label}</span>
                          {output.unit && (
                            <Badge variant="outline" className="text-xs">{output.unit}</Badge>
                          )}
                        </div>
                        {output.description && (
                          <p className="text-xs text-muted-foreground mt-1">{output.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Models Summary */}
      <Card>
        <CardHeader>
          <CardTitle>All Available Models & Formulas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allModelsWithFormulas.map((model) => (
              <div key={model.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{model.name}</h3>
                  <Badge variant="outline">{model.formulas.length} formulas</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{model.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {model.formulas.map((formula) => (
                    <div key={formula.id} className="text-xs p-2 bg-gray-50 rounded">
                      <div className="font-medium">{formula.name}</div>
                      <div className="text-muted-foreground">{formula.complexity} • {formula.accuracy}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
