
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, MapPin, Package, Zap, Network } from 'lucide-react';

interface Formula {
  id: string;
  name: string;
  category: string;
  description: string;
  formula: string;
  parameters: { name: string; symbol: string; unit: string }[];
  example: string;
}

const formulas: Formula[] = [
  {
    id: 'eoq',
    name: 'Economic Order Quantity (EOQ)',
    category: 'Inventory',
    description: 'Optimal order quantity that minimizes total holding and ordering costs',
    formula: 'EOQ = √(2DS/H)',
    parameters: [
      { name: 'Demand', symbol: 'D', unit: 'units/year' },
      { name: 'Setup Cost', symbol: 'S', unit: 'KES/order' },
      { name: 'Holding Cost', symbol: 'H', unit: 'KES/unit/year' }
    ],
    example: 'For D=1000, S=500, H=25: EOQ = √(2×1000×500/25) = 200 units'
  },
  {
    id: 'tsp',
    name: 'Traveling Salesman Problem',
    category: 'Routing',
    description: 'Shortest route visiting all locations exactly once',
    formula: 'min Σ(i,j)∈E c(i,j) × x(i,j)',
    parameters: [
      { name: 'Distance Matrix', symbol: 'c(i,j)', unit: 'km' },
      { name: 'Decision Variable', symbol: 'x(i,j)', unit: 'binary' }
    ],
    example: 'Minimize total distance for route optimization'
  },
  {
    id: 'cog',
    name: 'Center of Gravity',
    category: 'Location',
    description: 'Optimal facility location based on demand weights',
    formula: 'X = Σ(Wi×Xi)/ΣWi, Y = Σ(Wi×Yi)/ΣWi',
    parameters: [
      { name: 'Weight', symbol: 'Wi', unit: 'tons' },
      { name: 'X Coordinate', symbol: 'Xi', unit: 'km' },
      { name: 'Y Coordinate', symbol: 'Yi', unit: 'km' }
    ],
    example: 'Find optimal warehouse location based on customer demands'
  },
  {
    id: 'monte_carlo',
    name: 'Monte Carlo Simulation',
    category: 'Simulation',
    description: 'Stochastic simulation for uncertainty analysis',
    formula: 'E[X] = (1/n)Σx(i), Var[X] = E[X²] - (E[X])²',
    parameters: [
      { name: 'Iterations', symbol: 'n', unit: 'count' },
      { name: 'Random Variable', symbol: 'x(i)', unit: 'various' }
    ],
    example: 'Simulate demand variability over 1000 iterations'
  },
  {
    id: 'arima',
    name: 'ARIMA Forecasting',
    category: 'Forecasting',
    description: 'Auto-Regressive Integrated Moving Average model',
    formula: 'ARIMA(p,d,q): (1-φ₁L-...-φₚLᵖ)(1-L)ᵈXₜ = (1+θ₁L+...+θₑLᵈ)εₜ',
    parameters: [
      { name: 'AR Order', symbol: 'p', unit: 'integer' },
      { name: 'Differencing', symbol: 'd', unit: 'integer' },
      { name: 'MA Order', symbol: 'q', unit: 'integer' }
    ],
    example: 'ARIMA(2,1,1) for seasonal demand forecasting'
  },
  {
    id: 'newsvendor',
    name: 'Newsvendor Model',
    category: 'Inventory',
    description: 'Optimal inventory for perishable goods',
    formula: 'Q* = F⁻¹(cu/(cu+co))',
    parameters: [
      { name: 'Underage Cost', symbol: 'cu', unit: 'KES/unit' },
      { name: 'Overage Cost', symbol: 'co', unit: 'KES/unit' },
      { name: 'CDF', symbol: 'F⁻¹', unit: 'probability' }
    ],
    example: 'Optimal order for fresh produce with spoilage risk'
  },
  {
    id: 'safety_stock',
    name: 'Safety Stock',
    category: 'Inventory',
    description: 'Buffer inventory for demand uncertainty',
    formula: 'SS = z × σL',
    parameters: [
      { name: 'Service Level', symbol: 'z', unit: 'standard deviations' },
      { name: 'Lead Time Std Dev', symbol: 'σL', unit: 'units' }
    ],
    example: 'For 95% service level: SS = 1.65 × σL'
  },
  {
    id: 'bullwhip',
    name: 'Bullwhip Effect',
    category: 'Analysis',
    description: 'Demand variability amplification measure',
    formula: 'BE = Var(Orders)/Var(Demand)',
    parameters: [
      { name: 'Order Variance', symbol: 'Var(Orders)', unit: 'units²' },
      { name: 'Demand Variance', symbol: 'Var(Demand)', unit: 'units²' }
    ],
    example: 'Measure supply chain stability and information distortion'
  },
  {
    id: 'vehicle_routing',
    name: 'Vehicle Routing Problem',
    category: 'Routing',
    description: 'Optimal vehicle routes with capacity constraints',
    formula: 'min Σk Σ(i,j) ckij × xkij',
    parameters: [
      { name: 'Vehicle Cost', symbol: 'ckij', unit: 'KES/km' },
      { name: 'Route Variable', symbol: 'xkij', unit: 'binary' },
      { name: 'Vehicle Capacity', symbol: 'Q', unit: 'tons' }
    ],
    example: 'Optimize delivery routes with truck capacity limits'
  },
  {
    id: 'facility_location',
    name: 'Facility Location',
    category: 'Location',
    description: 'Optimal facility placement with fixed costs',
    formula: 'min Σi fi×yi + Σi Σj cij×xij',
    parameters: [
      { name: 'Fixed Cost', symbol: 'fi', unit: 'KES' },
      { name: 'Transport Cost', symbol: 'cij', unit: 'KES/unit' },
      { name: 'Allocation', symbol: 'xij', unit: 'units' }
    ],
    example: 'Select warehouse locations minimizing total costs'
  },
  {
    id: 'abc_analysis',
    name: 'ABC Analysis',
    category: 'Analysis',
    description: 'Inventory classification by value contribution',
    formula: 'Value% = (Item Value / Total Value) × 100',
    parameters: [
      { name: 'Item Value', symbol: 'Vi', unit: 'KES' },
      { name: 'Total Value', symbol: 'V', unit: 'KES' },
      { name: 'Cumulative %', symbol: 'C%', unit: 'percentage' }
    ],
    example: 'A-items: 80% value, B-items: 15% value, C-items: 5% value'
  },
  {
    id: 'network_flow',
    name: 'Minimum Cost Flow',
    category: 'Network',
    description: 'Optimal flow through network with costs',
    formula: 'min Σ(i,j) cij×fij',
    parameters: [
      { name: 'Arc Cost', symbol: 'cij', unit: 'KES/unit' },
      { name: 'Flow', symbol: 'fij', unit: 'units' },
      { name: 'Capacity', symbol: 'uij', unit: 'units' }
    ],
    example: 'Minimize transport costs in supply network'
  },
  {
    id: 'reorder_point',
    name: 'Reorder Point',
    category: 'Inventory',
    description: 'When to place replenishment orders',
    formula: 'ROP = (Average Demand × Lead Time) + Safety Stock',
    parameters: [
      { name: 'Average Demand', symbol: 'D̄', unit: 'units/day' },
      { name: 'Lead Time', symbol: 'L', unit: 'days' },
      { name: 'Safety Stock', symbol: 'SS', unit: 'units' }
    ],
    example: 'For D̄=100, L=5, SS=50: ROP = 550 units'
  },
  {
    id: 'genetic_algorithm',
    name: 'Genetic Algorithm',
    category: 'Optimization',
    description: 'Evolutionary optimization metaheuristic',
    formula: 'Population → Selection → Crossover → Mutation → New Population',
    parameters: [
      { name: 'Population Size', symbol: 'N', unit: 'individuals' },
      { name: 'Crossover Rate', symbol: 'pc', unit: 'probability' },
      { name: 'Mutation Rate', symbol: 'pm', unit: 'probability' }
    ],
    example: 'Optimize complex routing with N=100, pc=0.8, pm=0.1'
  },
  {
    id: 'little_law',
    name: "Little's Law",
    category: 'Analysis',
    description: 'Relationship between inventory, flow rate, and flow time',
    formula: 'L = λ × W',
    parameters: [
      { name: 'Average Inventory', symbol: 'L', unit: 'units' },
      { name: 'Arrival Rate', symbol: 'λ', unit: 'units/time' },
      { name: 'Average Time', symbol: 'W', unit: 'time' }
    ],
    example: 'If λ=100 units/day and W=5 days, then L=500 units'
  }
];

export const FormulaLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = ['all', 'Inventory', 'Routing', 'Location', 'Simulation', 'Forecasting', 'Analysis', 'Network', 'Optimization'];
  
  const filteredFormulas = formulas.filter(formula => {
    const matchesCategory = selectedCategory === 'all' || formula.category === selectedCategory;
    const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Inventory': return <Package className="h-4 w-4" />;
      case 'Routing': return <MapPin className="h-4 w-4" />;
      case 'Location': return <MapPin className="h-4 w-4" />;
      case 'Simulation': return <Zap className="h-4 w-4" />;
      case 'Forecasting': return <TrendingUp className="h-4 w-4" />;
      case 'Analysis': return <Calculator className="h-4 w-4" />;
      case 'Network': return <Network className="h-4 w-4" />;
      case 'Optimization': return <Zap className="h-4 w-4" />;
      default: return <Calculator className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Formula Library</h2>
          <p className="text-gray-600">Comprehensive collection of supply chain optimization formulas</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Search formulas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-64"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-3 md:grid-cols-9 gap-1">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="text-xs md:text-sm">
              {category === 'all' ? 'All' : category}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormulas.map((formula) => (
            <Card key={formula.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {getCategoryIcon(formula.category)}
                  {formula.name}
                </CardTitle>
                <Badge variant="secondary" className="w-fit">
                  {formula.category}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{formula.description}</p>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <Label className="text-xs font-semibold">Formula:</Label>
                  <code className="block mt-1 text-sm font-mono bg-white p-2 rounded border">
                    {formula.formula}
                  </code>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Parameters:</Label>
                  {formula.parameters.map((param, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span><strong>{param.symbol}:</strong> {param.name}</span>
                      <span className="text-gray-500">{param.unit}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 p-3 rounded-md">
                  <Label className="text-xs font-semibold text-blue-800">Example:</Label>
                  <p className="text-xs text-blue-700 mt-1">{formula.example}</p>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Use Formula
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Tabs>

      {filteredFormulas.length === 0 && (
        <div className="text-center py-12">
          <Calculator className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No formulas found</h3>
          <p className="text-gray-500">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
};
