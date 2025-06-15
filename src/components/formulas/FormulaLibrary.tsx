import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Search, Settings } from 'lucide-react';

interface Formula {
  id: string;
  name: string;
  formula: string;
  description: string;
  category: string;
  complexity: 'Basic' | 'Intermediate' | 'Advanced';
  parameters: string[];
  example?: string;
}

const formulas: Formula[] = [
  // Route Optimization
  {
    id: 'tsp',
    name: 'Traveling Salesman Problem (TSP)',
    formula: 'min Σ(i,j)∈E c(i,j) × x(i,j)',
    description: 'Find the shortest possible route that visits each city exactly once',
    category: 'Route Optimization',
    complexity: 'Advanced',
    parameters: ['Distance matrix', 'Number of cities', 'Starting point']
  },
  {
    id: 'vrp',
    name: 'Vehicle Routing Problem (VRP)',
    formula: 'min Σk Σ(i,j) c(i,j) × x(k,i,j)',
    description: 'Optimize routes for multiple vehicles with capacity constraints',
    category: 'Route Optimization',
    complexity: 'Advanced',
    parameters: ['Vehicle capacity', 'Customer demands', 'Distance matrix', 'Number of vehicles']
  },
  // Inventory Management
  {
    id: 'eoq',
    name: 'Economic Order Quantity (EOQ)',
    formula: 'Q* = √(2DS/H)',
    description: 'Optimal order quantity that minimizes total inventory costs',
    category: 'Inventory Management',
    complexity: 'Basic',
    parameters: ['Annual demand (D)', 'Setup cost (S)', 'Holding cost (H)']
  },
  {
    id: 'safety_stock',
    name: 'Safety Stock',
    formula: 'SS = Z × σ × √L',
    description: 'Buffer stock to protect against demand and lead time variability',
    category: 'Inventory Management',
    complexity: 'Intermediate',
    parameters: ['Service level (Z)', 'Demand std dev (σ)', 'Lead time (L)']
  },
  // Network Optimization
  {
    id: 'facility_location',
    name: 'Facility Location',
    formula: 'min Σi Σj c(i,j) × x(i,j) + Σi f(i) × y(i)',
    description: 'Optimal location for facilities to minimize total costs',
    category: 'Network Optimization',
    complexity: 'Advanced',
    parameters: ['Fixed costs', 'Transportation costs', 'Demand points', 'Candidate locations']
  },
  // Center of Gravity
  {
    id: 'cog_x',
    name: 'Center of Gravity X-coordinate',
    formula: 'X = Σ(Wi × Xi) / ΣWi',
    description: 'X-coordinate of the optimal facility location',
    category: 'Center of Gravity',
    complexity: 'Basic',
    parameters: ['Weights (Wi)', 'X-coordinates (Xi)']
  },
  {
    id: 'cog_y',
    name: 'Center of Gravity Y-coordinate',
    formula: 'Y = Σ(Wi × Yi) / ΣWi',
    description: 'Y-coordinate of the optimal facility location',
    category: 'Center of Gravity',
    complexity: 'Basic',
    parameters: ['Weights (Wi)', 'Y-coordinates (Yi)']
  }
];

export const FormulaLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedComplexity, setSelectedComplexity] = useState('All');

  const categories = ['All', ...Array.from(new Set(formulas.map(f => f.category)))];
  const complexities = ['All', 'Basic', 'Intermediate', 'Advanced'];

  const filteredFormulas = formulas.filter(formula => {
    const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || formula.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'All' || formula.complexity === selectedComplexity;
    
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Formula Library
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive collection of supply chain optimization formulas with explanations and parameters
        </p>
      </div>

      {/* Search and Filters */}
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
        
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={selectedComplexity}
            onChange={(e) => setSelectedComplexity(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            {complexities.map(complexity => (
              <option key={complexity} value={complexity}>{complexity}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredFormulas.length} of {formulas.length} formulas
      </div>

      {/* Formula Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFormulas.map(formula => (
          <Card key={formula.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{formula.name}</CardTitle>
                <Badge variant={
                  formula.complexity === 'Basic' ? 'secondary' :
                  formula.complexity === 'Intermediate' ? 'default' : 'destructive'
                }>
                  {formula.complexity}
                </Badge>
              </div>
              <Badge variant="outline" className="w-fit">
                {formula.category}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{formula.description}</p>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <code className="text-sm font-mono">{formula.formula}</code>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Parameters:</h4>
                <ul className="text-xs space-y-1">
                  {formula.parameters.map((param, index) => (
                    <li key={index} className="text-gray-600">• {param}</li>
                  ))}
                </ul>
              </div>

              <Button className="w-full" size="sm">
                <Calculator className="h-4 w-4 mr-2" />
                Use Formula
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFormulas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No formulas found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
