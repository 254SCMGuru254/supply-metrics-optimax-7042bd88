
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calculator, TrendingUp, Package, MapPin, Network, Zap, Search, BookOpen } from 'lucide-react';
import { ModelDataUploader } from '@/components/shared/ModelDataUploader';
import { FormulaComparator } from '@/components/shared/FormulaComparator';
import { EnhancedPDFExporter } from '@/components/shared/EnhancedPDFExporter';

interface Formula {
  id: string;
  name: string;
  description: string;
  formula: string;
  complexity: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  inputs: string[];
  example: any;
}

const formulaDatabase: Formula[] = [
  // Route Optimization
  {
    id: 'tsp-nearest-neighbor',
    name: 'Traveling Salesman Problem - Nearest Neighbor',
    description: 'Heuristic algorithm for finding approximate solutions to TSP',
    formula: 'min Σ(i,j) cij * xij',
    complexity: 'Basic',
    category: 'Route Optimization',
    inputs: ['distance_matrix', 'start_node'],
    example: { nodes: 10, avgDistance: 125.5, totalCost: 1255 }
  },
  {
    id: 'vrp-clarke-wright',
    name: 'Vehicle Routing Problem - Clarke Wright Savings',
    description: 'Savings algorithm for multi-vehicle routing optimization',
    formula: 'S(i,j) = d(0,i) + d(0,j) - d(i,j)',
    complexity: 'Intermediate',
    category: 'Route Optimization',
    inputs: ['customer_locations', 'vehicle_capacity', 'depot_location'],
    example: { vehicles: 5, totalDistance: 485.2, savings: '23%' }
  },
  {
    id: 'genetic-vrp',
    name: 'Genetic Algorithm for VRP',
    description: 'Evolutionary algorithm for complex vehicle routing problems',
    formula: 'Fitness = 1/(Total Distance + Penalty)',
    complexity: 'Advanced',
    category: 'Route Optimization',
    inputs: ['population_size', 'mutation_rate', 'generations'],
    example: { generations: 500, bestFitness: 0.0082, improvement: '15%' }
  },

  // Inventory Management
  {
    id: 'eoq-basic',
    name: 'Economic Order Quantity (EOQ)',
    description: 'Optimal order quantity to minimize total inventory cost',
    formula: 'EOQ = √(2DS/H)',
    complexity: 'Basic',
    category: 'Inventory Management',
    inputs: ['annual_demand', 'ordering_cost', 'holding_cost'],
    example: { optimalQuantity: 447, totalCost: 'KES 25,000', frequency: '8.2 orders/year' }
  },
  {
    id: 'eoq-quantity-discounts',
    name: 'EOQ with Quantity Discounts',
    description: 'EOQ model considering bulk purchase discounts',
    formula: 'TC = DC + (Q/2)H + (D/Q)S',
    complexity: 'Intermediate',
    category: 'Inventory Management',
    inputs: ['demand', 'discount_schedule', 'holding_cost', 'ordering_cost'],
    example: { optimalQuantity: 750, savings: 'KES 15,000', discountLevel: '15%' }
  },
  {
    id: 'newsvendor-model',
    name: 'Newsvendor Model',
    description: 'Optimal stocking for products with uncertain demand',
    formula: 'Q* = F⁻¹((p-c)/(p-s))',
    complexity: 'Intermediate',
    category: 'Inventory Management',
    inputs: ['mean_demand', 'std_deviation', 'unit_cost', 'selling_price'],
    example: { optimalStock: 285, serviceLevel: '92%', expectedProfit: 'KES 45,000' }
  },
  {
    id: 'multi-echelon',
    name: 'Multi-Echelon Inventory Optimization',
    description: 'Inventory optimization across multiple supply chain tiers',
    formula: 'min Σ(Hi*Ii + Bi*Si)',
    complexity: 'Expert',
    category: 'Inventory Management',
    inputs: ['echelon_structure', 'demand_data', 'cost_parameters'],
    example: { totalReduction: '28%', serviceLevel: '98.5%', echelons: 4 }
  },

  // Center of Gravity
  {
    id: 'center-gravity-basic',
    name: 'Center of Gravity Method',
    description: 'Facility location using weighted demand points',
    formula: 'COG_x = Σ(Wi*Xi)/ΣWi, COG_y = Σ(Wi*Yi)/ΣWi',
    complexity: 'Basic',
    category: 'Facility Location',
    inputs: ['demand_points', 'weights', 'coordinates'],
    example: { latitude: -1.2921, longitude: 36.8219, totalCost: 'KES 180,000' }
  },
  {
    id: 'modified-cog',
    name: 'Modified Center of Gravity with Transportation Costs',
    description: 'COG considering variable transportation costs',
    formula: 'COG = argmin Σ(Wi*di*Ci)',
    complexity: 'Intermediate',
    category: 'Facility Location',
    inputs: ['demand_points', 'transport_costs', 'distance_matrix'],
    example: { optimalLocation: 'Nakuru', costReduction: '18%', avgDistance: 245 }
  },

  // Network Optimization
  {
    id: 'min-cost-flow',
    name: 'Minimum Cost Flow',
    description: 'Optimal flow through network at minimum cost',
    formula: 'min Σ(cij*xij) s.t. flow constraints',
    complexity: 'Intermediate',
    category: 'Network Flow',
    inputs: ['network_graph', 'supply_nodes', 'demand_nodes', 'arc_costs'],
    example: { totalFlow: 5000, minCost: 'KES 125,000', utilization: '87%' }
  },
  {
    id: 'max-flow',
    name: 'Maximum Flow Algorithm',
    description: 'Find maximum flow from source to sink',
    formula: 'max Σfij s.t. capacity constraints',
    complexity: 'Basic',
    category: 'Network Flow',
    inputs: ['source', 'sink', 'arc_capacities'],
    example: { maxFlow: 1250, bottlenecks: 2, efficiency: '94%' }
  },

  // Simulation Models
  {
    id: 'monte-carlo',
    name: 'Monte Carlo Simulation',
    description: 'Stochastic simulation for uncertainty analysis',
    formula: 'E[X] ≈ (1/n)Σxi where xi ~ Distribution',
    complexity: 'Advanced',
    category: 'Simulation',
    inputs: ['iterations', 'distribution_parameters', 'model_structure'],
    example: { iterations: 10000, confidence: '95%', variance: 0.125 }
  },
  {
    id: 'discrete-event',
    name: 'Discrete Event Simulation',
    description: 'Simulation of systems with discrete state changes',
    formula: 'State transitions based on event scheduling',
    complexity: 'Expert',
    category: 'Simulation',
    inputs: ['event_list', 'system_state', 'simulation_time'],
    example: { avgWaitTime: '12.5 min', utilization: '78%', throughput: 450 }
  },

  // Forecasting Models
  {
    id: 'arima',
    name: 'ARIMA Forecasting Model',
    description: 'Autoregressive Integrated Moving Average for time series',
    formula: 'ARIMA(p,d,q): (1-φ₁L-...φₚLᵖ)(1-L)ᵈXₜ = (1+θ₁L+...θₑLᵉ)εₜ',
    complexity: 'Advanced',
    category: 'Forecasting',
    inputs: ['time_series_data', 'p_order', 'd_order', 'q_order'],
    example: { mape: '8.5%', forecast: [1200, 1350, 1180], seasonality: 'Detected' }
  },
  {
    id: 'exponential-smoothing',
    name: 'Exponential Smoothing',
    description: 'Weighted average of past observations for forecasting',
    formula: 'Sₜ = αXₜ + (1-α)Sₜ₋₁',
    complexity: 'Basic',
    category: 'Forecasting',
    inputs: ['historical_data', 'smoothing_constant'],
    example: { alpha: 0.3, mape: '12.2%', nextPeriod: 1285 }
  }
];

export const FormulaLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [calculationResults, setCalculationResults] = useState<any>(null);

  const categories = ['All', ...Array.from(new Set(formulaDatabase.map(f => f.category)))];

  const filteredFormulas = formulaDatabase.filter(formula => {
    const matchesCategory = selectedCategory === 'All' || formula.category === selectedCategory;
    const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Basic': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Route Optimization': return <MapPin className="h-4 w-4" />;
      case 'Inventory Management': return <Package className="h-4 w-4" />;
      case 'Facility Location': return <TrendingUp className="h-4 w-4" />;
      case 'Network Flow': return <Network className="h-4 w-4" />;
      case 'Simulation': return <Zap className="h-4 w-4" />;
      case 'Forecasting': return <TrendingUp className="h-4 w-4" />;
      default: return <Calculator className="h-4 w-4" />;
    }
  };

  const runFormula = (formula: Formula) => {
    // Simulate formula calculation
    const results = {
      formulaId: formula.id,
      executionTime: Math.random() * 2000 + 500,
      result: formula.example,
      accuracy: 85 + Math.random() * 15,
      status: 'completed'
    };
    setCalculationResults(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Formula Library
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive collection of supply chain optimization formulas, from basic to expert level
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search formulas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="flex items-center gap-1"
                  >
                    {category !== 'All' && getCategoryIcon(category)}
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formula List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-semibold">Available Formulas ({filteredFormulas.length})</h2>
            
            {filteredFormulas.map(formula => (
              <Card 
                key={formula.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedFormula?.id === formula.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedFormula(formula)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(formula.category)}
                      <h3 className="font-semibold text-lg">{formula.name}</h3>
                    </div>
                    <Badge className={getComplexityColor(formula.complexity)}>
                      {formula.complexity}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{formula.description}</p>
                  
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <code className="text-sm font-mono">{formula.formula}</code>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{formula.category}</Badge>
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        runFormula(formula);
                      }}
                    >
                      Calculate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Formula Details & Tools */}
          <div className="space-y-6">
            {selectedFormula ? (
              <>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Formula Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">{selectedFormula.name}</h4>
                      <p className="text-sm text-gray-600">{selectedFormula.description}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Required Inputs:</Label>
                      <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                        {selectedFormula.inputs.map((input, index) => (
                          <li key={index} className="text-gray-600">{input.replace('_', ' ')}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Example Result:</Label>
                      <div className="bg-gray-50 p-3 rounded-lg mt-1">
                        <pre className="text-xs">{JSON.stringify(selectedFormula.example, null, 2)}</pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <ModelDataUploader 
                  modelType={selectedFormula.category}
                  onDataUploaded={setUploadedData}
                />

                {uploadedData && (
                  <FormulaComparator 
                    modelType={selectedFormula.category}
                    inputData={uploadedData}
                    onRunComparison={() => console.log('Running comparison...')}
                  />
                )}

                {calculationResults && (
                  <EnhancedPDFExporter 
                    modelType={selectedFormula.category}
                    inputData={uploadedData}
                    results={calculationResults}
                  />
                )}
              </>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-8 text-center">
                  <Calculator className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Formula</h3>
                  <p className="text-gray-500">Choose a formula from the list to see details and calculation tools</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
