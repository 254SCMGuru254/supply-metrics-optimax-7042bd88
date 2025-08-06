import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calculator, CheckCircle, Info, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { modelFormulaRegistry } from '@/data/modelFormulaRegistry';

interface SelectedFormulas {
  [key: string]: boolean;
}

interface FormulaSelectionProps {
  onFormulaSelect: (selectedFormulas: string[]) => void;
  preSelected?: string[];
}

export const FormulaSelectionInterface: React.FC<FormulaSelectionProps> = ({ 
  onFormulaSelect, 
  preSelected = [] 
}) => {
  const [selectedFormulas, setSelectedFormulas] = useState<SelectedFormulas>(
    preSelected.reduce((acc, id) => ({ ...acc, [id]: true }), {})
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [complexityFilter, setComplexityFilter] = useState('all');

  const allFormulas = modelFormulaRegistry.flatMap(model => 
    model.formulas.map(formula => ({
      ...formula,
      category: model.category,
      modelName: model.name
    }))
  );

  const categories = [...new Set(modelFormulaRegistry.map(model => model.category))];
  const complexityLevels = [...new Set(allFormulas.map(f => f.complexity))];

  const filteredFormulas = allFormulas.filter(formula => {
    const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || formula.category === categoryFilter;
    const matchesComplexity = complexityFilter === 'all' || formula.complexity === complexityFilter;
    
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  const toggleFormula = (formulaId: string) => {
    const newSelected = {
      ...selectedFormulas,
      [formulaId]: !selectedFormulas[formulaId]
    };
    setSelectedFormulas(newSelected);
    
    const selectedIds = Object.keys(newSelected).filter(id => newSelected[id]);
    onFormulaSelect(selectedIds);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'simple': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAccuracyColor = (accuracy: string) => {
    if (accuracy.includes('95%') || accuracy.includes('High')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (accuracy.includes('85%') || accuracy.includes('Medium')) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const selectedCount = Object.values(selectedFormulas).filter(Boolean).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Formula Selection Interface
          </div>
          <Badge variant="outline" className="ml-2">
            {selectedCount} formula{selectedCount !== 1 ? 's' : ''} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search formulas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={complexityFilter} onValueChange={setComplexityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {complexityLevels.map(level => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Formula List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredFormulas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No formulas match your filters</p>
            </div>
          ) : (
            filteredFormulas.map((formula) => (
              <div
                key={formula.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedFormulas[formula.id]
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleFormula(formula.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{formula.name}</h4>
                      {selectedFormulas[formula.id] && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{formula.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {formula.category}
                      </Badge>
                      <Badge className={`text-xs border ${getComplexityColor(formula.complexity)}`}>
                        {formula.complexity}
                      </Badge>
                      <Badge className={`text-xs border ${getAccuracyColor(formula.accuracy)}`}>
                        {formula.accuracy}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      <strong>Use Case:</strong> {formula.useCase}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selection Summary */}
        {selectedCount > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">
                  {selectedCount} formula{selectedCount !== 1 ? 's' : ''} selected for analysis
                </p>
                <p className="text-blue-700 mt-1">
                  The system will execute all selected formulas and provide comparative results,
                  allowing you to evaluate different approaches to your supply chain optimization.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};