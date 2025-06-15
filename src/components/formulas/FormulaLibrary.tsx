
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator, Search, BookOpen, Target, Zap } from 'lucide-react';

interface Formula {
  id: string;
  name: string;
  category: string;
  formula: string;
  description: string;
  complexity: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  accuracy: string;
  variables: { symbol: string; description: string; unit?: string }[];
  useCase: string;
  example?: {
    inputs: Record<string, number>;
    output: number;
    unit?: string;
  };
}

const formulaDatabase: Formula[] = [
  {
    id: 'eoq',
    name: 'Economic Order Quantity',
    category: 'Inventory Management',
    formula: 'EOQ = √(2DS/H)',
    description: 'Determines the optimal order quantity that minimizes total inventory costs',
    complexity: 'Basic',
    accuracy: '95%',
    variables: [
      { symbol: 'D', description: 'Annual demand', unit: 'units/year' },
      { symbol: 'S', description: 'Setup/ordering cost per order', unit: 'KES' },
      { symbol: 'H', description: 'Holding cost per unit per year', unit: 'KES/unit/year' }
    ],
    useCase: 'Minimizing total inventory costs in stable demand environments',
    example: {
      inputs: { D: 1000, S: 50, H: 2 },
      output: 224,
      unit: 'units'
    }
  },
  {
    id: 'tsp_nearest_neighbor',
    name: 'Traveling Salesman - Nearest Neighbor',
    category: 'Route Optimization',
    formula: 'min{d(i,j) : j ∈ unvisited}',
    description: 'Greedy algorithm for TSP that selects the nearest unvisited city',
    complexity: 'Basic',
    accuracy: '70-80%',
    variables: [
      { symbol: 'd(i,j)', description: 'Distance from city i to city j', unit: 'km' },
      { symbol: 'i', description: 'Current city' },
      { symbol: 'j', description: 'Candidate next city' }
    ],
    useCase: 'Quick routing solutions for small to medium route optimization problems'
  },
  {
    id: 'center_of_gravity',
    name: 'Center of Gravity',
    category: 'Facility Location',
    formula: 'COG_x = Σ(W_i × X_i) / ΣW_i, COG_y = Σ(W_i × Y_i) / ΣW_i',
    description: 'Finds optimal facility location based on weighted demand points',
    complexity: 'Basic',
    accuracy: '90%',
    variables: [
      { symbol: 'W_i', description: 'Weight/demand at point i', unit: 'units' },
      { symbol: 'X_i, Y_i', description: 'Coordinates of demand point i', unit: 'degrees' }
    ],
    useCase: 'Single facility location optimization based on transportation costs'
  },
  {
    id: 'min_cost_flow',
    name: 'Minimum Cost Flow',
    category: 'Network Optimization',
    formula: 'Minimize: Σ Σ c_ij × x_ij',
    description: 'Finds minimum cost flow through a network while satisfying constraints',
    complexity: 'Intermediate',
    accuracy: '100%',
    variables: [
      { symbol: 'c_ij', description: 'Cost per unit flow on arc (i,j)', unit: 'KES/unit' },
      { symbol: 'x_ij', description: 'Flow on arc (i,j)', unit: 'units' }
    ],
    useCase: 'Optimizing flow patterns in supply chain networks'
  },
  {
    id: 'newsvendor',
    name: 'Newsvendor Model',
    category: 'Inventory Management',
    formula: 'Q* = F^(-1)((p-c)/(p-s))',
    description: 'Optimal inventory level under demand uncertainty for perishable goods',
    complexity: 'Intermediate',
    accuracy: '85%',
    variables: [
      { symbol: 'F^(-1)', description: 'Inverse demand distribution function' },
      { symbol: 'p', description: 'Selling price per unit', unit: 'KES' },
      { symbol: 'c', description: 'Cost per unit', unit: 'KES' },
      { symbol: 's', description: 'Salvage value per unit', unit: 'KES' }
    ],
    useCase: 'Single-period inventory decisions for perishable or seasonal items'
  },
  {
    id: 'genetic_algorithm',
    name: 'Genetic Algorithm for VRP',
    category: 'Heuristic Optimization',
    formula: 'Fitness = 1 / (Total Distance + Penalty)',
    description: 'Evolutionary algorithm for complex vehicle routing optimization',
    complexity: 'Advanced',
    accuracy: '90%',
    variables: [
      { symbol: 'Total Distance', description: 'Sum of all route distances', unit: 'km' },
      { symbol: 'Penalty', description: 'Constraint violation penalty', unit: 'units' }
    ],
    useCase: 'Complex multi-constraint vehicle routing problems'
  },
  {
    id: 'simulated_annealing',
    name: 'Simulated Annealing',
    category: 'Heuristic Optimization',
    formula: 'P(accept) = exp(-ΔE/T)',
    description: 'Probabilistic optimization technique for escaping local optima',
    complexity: 'Advanced',
    accuracy: '85%',
    variables: [
      { symbol: 'ΔE', description: 'Change in objective function value' },
      { symbol: 'T', description: 'Current temperature parameter' },
      { symbol: 'P(accept)', description: 'Probability of accepting worse solution' }
    ],
    useCase: 'Complex combinatorial optimization problems'
  },
  {
    id: 'monte_carlo',
    name: 'Monte Carlo Simulation',
    category: 'Simulation',
    formula: 'E[f(X)] ≈ (1/n) Σ f(X_i)',
    description: 'Statistical simulation using random sampling for uncertainty analysis',
    complexity: 'Intermediate',
    accuracy: '95%',
    variables: [
      { symbol: 'f(X)', description: 'Function being evaluated' },
      { symbol: 'X_i', description: 'Random sample i from distribution' },
      { symbol: 'n', description: 'Number of simulation iterations' }
    ],
    useCase: 'Risk analysis and uncertainty quantification'
  },
  {
    id: 'arima',
    name: 'ARIMA Forecasting',
    category: 'Demand Forecasting',
    formula: '(1-φ₁L-...-φₚLᵖ)(1-L)ᵈXₜ = (1+θ₁L+...+θₑLᵈ)εₜ',
    description: 'Autoregressive Integrated Moving Average model for time series forecasting',
    complexity: 'Expert',
    accuracy: '85%',
    variables: [
      { symbol: 'φᵢ', description: 'Autoregressive parameters' },
      { symbol: 'θᵢ', description: 'Moving average parameters' },
      { symbol: 'd', description: 'Degree of differencing' },
      { symbol: 'L', description: 'Lag operator' }
    ],
    useCase: 'Time series forecasting with trend and seasonality'
  },
  {
    id: 'multi_echelon',
    name: 'Multi-Echelon Inventory Optimization',
    category: 'Inventory Management',
    formula: 'Min Σ(HC_i × I_i + OC_i × Q_i + SC_i × B_i)',
    description: 'Optimizes inventory across multiple supply chain tiers simultaneously',
    complexity: 'Expert',
    accuracy: '88%',
    variables: [
      { symbol: 'HC_i', description: 'Holding cost at echelon i', unit: 'KES/unit/period' },
      { symbol: 'I_i', description: 'Inventory level at echelon i', unit: 'units' },
      { symbol: 'OC_i', description: 'Ordering cost at echelon i', unit: 'KES/order' },
      { symbol: 'SC_i', description: 'Shortage cost at echelon i', unit: 'KES/unit' }
    ],
    useCase: 'Complex multi-tier supply chain inventory optimization'
  }
];

export const FormulaLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');

  const categories = ['all', ...Array.from(new Set(formulaDatabase.map(f => f.category)))];
  const complexities = ['all', 'Basic', 'Intermediate', 'Advanced', 'Expert'];

  const filteredFormulas = formulaDatabase.filter(formula => {
    const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || formula.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'all' || formula.complexity === selectedComplexity;
    
    return matchesSearch && matchesCategory && matchesComplexity;
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

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Formula Library - {formulaDatabase.length} Mathematical Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search formulas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              {complexities.map(complexity => (
                <option key={complexity} value={complexity}>
                  {complexity === 'all' ? 'All Complexities' : complexity}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFormulas.map((formula) => (
              <Card key={formula.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{formula.name}</CardTitle>
                      <p className="text-sm text-gray-600">{formula.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getComplexityColor(formula.complexity)}>
                        {formula.complexity}
                      </Badge>
                      <Badge variant="outline">
                        {formula.accuracy}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700">{formula.description}</p>
                  
                  <div className="bg-gray-50 p-3 rounded-md font-mono text-sm overflow-x-auto">
                    {formula.formula}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Variables:</h4>
                    <div className="space-y-1">
                      {formula.variables.map((variable, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-mono font-bold">{variable.symbol}:</span>{' '}
                          {variable.description}
                          {variable.unit && <span className="text-gray-500"> ({variable.unit})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-1">Use Case:</h4>
                    <p className="text-sm text-gray-600">{formula.useCase}</p>
                  </div>
                  
                  {formula.example && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h4 className="font-medium text-sm mb-2">Example:</h4>
                      <div className="text-sm">
                        <div>Inputs: {JSON.stringify(formula.example.inputs)}</div>
                        <div>Output: {formula.example.output}{formula.example.unit && ` ${formula.example.unit}`}</div>
                      </div>
                    </div>
                  )}
                  
                  <Button size="sm" className="w-full">
                    <Target className="h-4 w-4 mr-2" />
                    Use Formula
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
