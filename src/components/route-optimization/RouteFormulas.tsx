
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, MapPin } from 'lucide-react';

interface FormulaCalculation {
  name: string;
  formula: string;
  description: string;
  inputs: { name: string; symbol: string; value: number; unit: string }[];
  result: number | null;
  category: string;
}

export const RouteFormulas = () => {
  const [calculations, setCalculations] = useState<FormulaCalculation[]>([
    {
      name: 'Traveling Salesman Problem (TSP)',
      formula: 'min Σ(i,j)∈E c(i,j) × x(i,j)',
      description: 'Find shortest route visiting all cities exactly once',
      category: 'core',
      inputs: [
        { name: 'Number of Cities', symbol: 'n', value: 5, unit: 'cities' },
        { name: 'Average Distance', symbol: 'd_avg', value: 100, unit: 'km' }
      ],
      result: null
    },
    {
      name: 'Vehicle Routing Problem (VRP)',
      formula: 'min Σk Σ(i,j) c(i,j) × x(k,i,j)',
      description: 'Optimize routes for multiple vehicles with capacity constraints',
      category: 'core',
      inputs: [
        { name: 'Number of Vehicles', symbol: 'K', value: 3, unit: 'vehicles' },
        { name: 'Vehicle Capacity', symbol: 'Q', value: 1000, unit: 'kg' },
        { name: 'Cost per km', symbol: 'c', value: 2.5, unit: 'KES/km' },
        { name: 'Total Distance', symbol: 'D', value: 500, unit: 'km' }
      ],
      result: null
    },
    {
      name: 'Dijkstra Shortest Path',
      formula: 'd(v) = min{d(u) + w(u,v) : (u,v) ∈ E}',
      description: 'Find shortest path between two nodes in weighted graph',
      category: 'algorithms',
      inputs: [
        { name: 'Source to Target Distance', symbol: 'd', value: 150, unit: 'km' },
        { name: 'Fuel Cost per km', symbol: 'f', value: 3.2, unit: 'KES/km' }
      ],
      result: null
    },
    {
      name: 'Clarke-Wright Savings Algorithm',
      formula: 'S(i,j) = d(0,i) + d(0,j) - d(i,j)',
      description: 'Heuristic for vehicle routing problem construction',
      category: 'algorithms',
      inputs: [
        { name: 'Depot to Customer i', symbol: 'd0i', value: 80, unit: 'km' },
        { name: 'Depot to Customer j', symbol: 'd0j', value: 120, unit: 'km' },
        { name: 'Customer i to j', symbol: 'dij', value: 60, unit: 'km' }
      ],
      result: null
    },
    {
      name: '2-opt Route Improvement',
      formula: 'Δ = d(A,C) + d(B,D) - d(A,B) - d(C,D)',
      description: 'Local search improvement for route optimization',
      category: 'improvement',
      inputs: [
        { name: 'Distance A-C', symbol: 'dAC', value: 45, unit: 'km' },
        { name: 'Distance B-D', symbol: 'dBD', value: 65, unit: 'km' },
        { name: 'Distance A-B', symbol: 'dAB', value: 80, unit: 'km' },
        { name: 'Distance C-D', symbol: 'dCD', value: 70, unit: 'km' }
      ],
      result: null
    },
    {
      name: 'Vehicle Utilization Rate',
      formula: 'UR = (Actual Load / Vehicle Capacity) × 100',
      description: 'Measure vehicle capacity efficiency',
      category: 'metrics',
      inputs: [
        { name: 'Actual Load', symbol: 'L', value: 750, unit: 'kg' },
        { name: 'Vehicle Capacity', symbol: 'C', value: 1000, unit: 'kg' }
      ],
      result: null
    },
    {
      name: 'Route Density',
      formula: 'RD = Number of Stops / Total Distance',
      description: 'Measure route efficiency by stops per distance',
      category: 'metrics',
      inputs: [
        { name: 'Number of Stops', symbol: 'S', value: 12, unit: 'stops' },
        { name: 'Total Distance', symbol: 'D', value: 180, unit: 'km' }
      ],
      result: null
    },
    {
      name: 'Fuel Efficiency Optimization',
      formula: 'FC = D × FR × FP',
      description: 'Calculate total fuel cost for route',
      category: 'cost',
      inputs: [
        { name: 'Distance', symbol: 'D', value: 200, unit: 'km' },
        { name: 'Fuel Rate', symbol: 'FR', value: 0.12, unit: 'L/km' },
        { name: 'Fuel Price', symbol: 'FP', value: 140, unit: 'KES/L' }
      ],
      result: null
    }
  ]);

  const calculateFormula = (index: number) => {
    const calc = calculations[index];
    let result = 0;

    switch (calc.name) {
      case 'Traveling Salesman Problem (TSP)':
        // Approximate TSP cost using nearest neighbor heuristic
        const n = calc.inputs[0].value;
        const d_avg = calc.inputs[1].value;
        result = n * d_avg * 1.25; // 25% overhead for TSP vs optimal tour
        break;

      case 'Vehicle Routing Problem (VRP)':
        const K = calc.inputs[0].value;
        const c = calc.inputs[2].value;
        const D = calc.inputs[3].value;
        result = K * c * D;
        break;

      case 'Dijkstra Shortest Path':
        const d = calc.inputs[0].value;
        const f = calc.inputs[1].value;
        result = d * f;
        break;

      case 'Clarke-Wright Savings Algorithm':
        const d0i = calc.inputs[0].value;
        const d0j = calc.inputs[1].value;
        const dij = calc.inputs[2].value;
        result = d0i + d0j - dij;
        break;

      case '2-opt Route Improvement':
        const dAC = calc.inputs[0].value;
        const dBD = calc.inputs[1].value;
        const dAB = calc.inputs[2].value;
        const dCD = calc.inputs[3].value;
        result = (dAC + dBD) - (dAB + dCD);
        break;

      case 'Vehicle Utilization Rate':
        const L = calc.inputs[0].value;
        const C = calc.inputs[1].value;
        result = (L / C) * 100;
        break;

      case 'Route Density':
        const S = calc.inputs[0].value;
        const D_density = calc.inputs[1].value;
        result = S / D_density;
        break;

      case 'Fuel Efficiency Optimization':
        const D_fuel = calc.inputs[0].value;
        const FR = calc.inputs[1].value;
        const FP = calc.inputs[2].value;
        result = D_fuel * FR * FP;
        break;
    }

    const updatedCalculations = [...calculations];
    updatedCalculations[index].result = Math.round(result * 100) / 100;
    setCalculations(updatedCalculations);
  };

  const updateInput = (calcIndex: number, inputIndex: number, value: number) => {
    const updatedCalculations = [...calculations];
    updatedCalculations[calcIndex].inputs[inputIndex].value = value;
    setCalculations(updatedCalculations);
  };

  const categories = [
    { id: 'core', name: 'Core Algorithms', count: calculations.filter(c => c.category === 'core').length },
    { id: 'algorithms', name: 'Path Algorithms', count: calculations.filter(c => c.category === 'algorithms').length },
    { id: 'improvement', name: 'Optimization', count: calculations.filter(c => c.category === 'improvement').length },
    { id: 'metrics', name: 'Performance Metrics', count: calculations.filter(c => c.category === 'metrics').length },
    { id: 'cost', name: 'Cost Analysis', count: calculations.filter(c => c.category === 'cost').length }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Route Optimization Formulas</h2>
        <p className="text-gray-600">Complete mathematical foundation for route optimization</p>
      </div>

      <Tabs defaultValue="core" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs md:text-sm">
              {category.name} ({category.count})
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {calculations
                .filter(calc => calc.category === category.id)
                .map((calc, index) => {
                  const globalIndex = calculations.findIndex(c => c === calc);
                  return (
                    <Card key={globalIndex} className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <MapPin className="h-5 w-5" />
                          {calc.name}
                        </CardTitle>
                        <Badge variant="secondary">{category.name}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">{calc.description}</p>
                        
                        <div className="bg-gray-50 p-3 rounded-md">
                          <Label className="text-xs font-semibold">Formula:</Label>
                          <code className="block mt-1 text-sm font-mono bg-white p-2 rounded border">
                            {calc.formula}
                          </code>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-semibold">Parameters:</Label>
                          {calc.inputs.map((input, inputIndex) => (
                            <div key={inputIndex} className="grid grid-cols-2 gap-2 items-center">
                              <Label className="text-xs">
                                {input.symbol}: {input.name}
                              </Label>
                              <div className="flex gap-1">
                                <Input
                                  type="number"
                                  value={input.value}
                                  onChange={(e) => updateInput(globalIndex, inputIndex, parseFloat(e.target.value) || 0)}
                                  className="text-xs"
                                />
                                <span className="text-xs text-gray-500 self-center">{input.unit}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Button 
                          onClick={() => calculateFormula(globalIndex)}
                          className="w-full"
                          size="sm"
                        >
                          <Calculator className="h-4 w-4 mr-2" />
                          Calculate
                        </Button>

                        {calc.result !== null && (
                          <div className="bg-blue-50 p-3 rounded-md text-center">
                            <Label className="text-xs font-semibold text-blue-800">Result:</Label>
                            <div className="text-2xl font-bold text-blue-600 mt-1">
                              {calc.result}
                              {calc.name.includes('Utilization') ? '%' : 
                               calc.name.includes('Density') ? ' stops/km' :
                               calc.name.includes('Improvement') ? ' km saved' :
                               calc.name.includes('Savings') ? ' km saved' : ' KES'}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
