
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface FormulaResult {
  formulaName: string;
  result: number;
  accuracy: number;
  executionTime: number;
  complexity: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  recommendation: string;
}

interface FormulaComparatorProps {
  modelType: string;
  inputData: any;
  onRunComparison: () => void;
}

export const FormulaComparator = ({ modelType, inputData, onRunComparison }: FormulaComparatorProps) => {
  const [results, setResults] = useState<FormulaResult[]>([]);
  const [running, setRunning] = useState(false);

  const runAllFormulas = async () => {
    setRunning(true);
    onRunComparison();

    // Simulate running different formulas for the model type
    const simulatedResults: FormulaResult[] = [];

    if (modelType === 'Route Optimization') {
      simulatedResults.push(
        {
          formulaName: 'Nearest Neighbor',
          result: 1250.5,
          accuracy: 75,
          executionTime: 150,
          complexity: 'Basic',
          recommendation: 'Good for quick solutions, limited optimality'
        },
        {
          formulaName: 'Genetic Algorithm',
          result: 1089.2,
          accuracy: 92,
          executionTime: 2500,
          complexity: 'Advanced',
          recommendation: 'Excellent balance of quality and computation time'
        },
        {
          formulaName: 'Simulated Annealing',
          result: 1095.8,
          accuracy: 90,
          executionTime: 1800,
          complexity: 'Advanced',
          recommendation: 'Very good results with moderate computation'
        },
        {
          formulaName: 'Ant Colony Optimization',
          result: 1078.5,
          accuracy: 94,
          executionTime: 3200,
          complexity: 'Expert',
          recommendation: 'Best solution quality but requires more time'
        }
      );
    } else if (modelType === 'Inventory Management') {
      simulatedResults.push(
        {
          formulaName: 'Economic Order Quantity (EOQ)',
          result: 447.2,
          accuracy: 85,
          executionTime: 50,
          complexity: 'Basic',
          recommendation: 'Classical approach, good for stable demand'
        },
        {
          formulaName: 'Newsvendor Model',
          result: 423.8,
          accuracy: 88,
          executionTime: 120,
          complexity: 'Intermediate',
          recommendation: 'Better for uncertain demand scenarios'
        },
        {
          formulaName: 'Multi-Echelon Optimization',
          result: 398.5,
          accuracy: 96,
          executionTime: 1500,
          complexity: 'Expert',
          recommendation: 'Optimal for complex supply networks'
        }
      );
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResults(simulatedResults);
    setRunning(false);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Basic': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBestResult = () => {
    return results.reduce((best, current) => 
      current.accuracy > best.accuracy ? current : best, results[0]
    );
  };

  const chartData = results.map(result => ({
    name: result.formulaName,
    accuracy: result.accuracy,
    executionTime: result.executionTime / 1000, // Convert to seconds
    result: result.result
  }));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Formula Comparison for {modelType}</span>
          <Button 
            onClick={runAllFormulas} 
            disabled={running || !inputData}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            {running ? 'Running...' : 'Compare All Formulas'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {running && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Running comparative analysis across all available formulas...</p>
          </div>
        )}

        {results.length > 0 && (
          <Tabs defaultValue="results" className="space-y-4">
            <TabsList>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="comparison">Visual Comparison</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-4">
              {results.map((result, index) => (
                <Card key={index} className={`${result === getBestResult() ? 'border-green-500 border-2' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{result.formulaName}</h3>
                        {result === getBestResult() && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Best Result
                          </Badge>
                        )}
                      </div>
                      <Badge className={getComplexityColor(result.complexity)}>
                        {result.complexity}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Result</p>
                        <p className="font-bold text-lg">{result.result.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <div className="flex items-center gap-2">
                          <Progress value={result.accuracy} className="flex-1" />
                          <span className="font-medium">{result.accuracy}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Execution Time</p>
                        <p className="font-medium">{result.executionTime}ms</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{result.recommendation}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="comparison">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#3B82F6" name="Accuracy %" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="recommendations">
              <div className="space-y-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Recommended Formula</h3>
                    </div>
                    <p className="text-green-700">
                      <span className="font-medium">{getBestResult()?.formulaName}</span> provides the best 
                      balance of accuracy ({getBestResult()?.accuracy}%) and practical implementation.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Selection Criteria</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        <span><strong>Basic formulas:</strong> Quick results, suitable for simple scenarios</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span><strong>Advanced formulas:</strong> Better accuracy, moderate computation time</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span><strong>Expert formulas:</strong> Highest accuracy, requires more resources</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
