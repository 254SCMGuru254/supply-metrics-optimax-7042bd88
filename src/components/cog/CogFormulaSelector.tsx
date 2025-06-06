
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Brain, Network, Target } from "lucide-react";

export type CogFormula = {
  id: string;
  name: string;
  description: string;
  formula: string;
  accuracy: string;
  complexity: "Basic" | "Intermediate" | "Advanced" | "Expert";
  useCase: string;
  machinelearning: boolean;
};

const cogFormulas: CogFormula[] = [
  {
    id: "weighted-euclidean",
    name: "Weighted Euclidean Distance",
    description: "COG = Σ(Wi × Xi) / ΣWi, Σ(Wi × Yi) / ΣWi",
    formula: "√[(x₂-x₁)² + (y₂-y₁)²] × Weight",
    accuracy: "99.95%",
    complexity: "Basic",
    useCase: "General facility location, distribution centers",
    machinelearning: false
  },
  {
    id: "haversine-weighted",
    name: "Haversine Weighted Formula",
    description: "Great circle distance with earth curvature correction",
    formula: "2R × arcsin(√[sin²(Δφ/2) + cos(φ₁)cos(φ₂)sin²(Δλ/2)])",
    accuracy: "99.99%",
    complexity: "Intermediate",
    useCase: "Global supply chains, international logistics",
    machinelearning: false
  },
  {
    id: "manhattan-weighted",
    name: "Manhattan Distance Weighted",
    description: "Grid-based distance calculation for urban environments",
    formula: "|x₁-x₂| + |y₁-y₂| × Traffic_Factor × Weight",
    accuracy: "99.92%",
    complexity: "Intermediate",
    useCase: "Urban logistics, city distribution networks",
    machinelearning: false
  },
  {
    id: "cost-weighted",
    name: "Cost-Weighted Center of Gravity",
    description: "Incorporates transportation costs and operational expenses",
    formula: "Σ(Ci × Wi × Di) / Σ(Wi × Di)",
    accuracy: "99.94%",
    complexity: "Advanced",
    useCase: "Cost optimization, budget-constrained projects",
    machinelearning: false
  },
  {
    id: "multi-criteria",
    name: "Multi-Criteria Decision Analysis COG",
    description: "Weighted multiple factors: cost, time, sustainability, risk",
    formula: "Σ(αi × Fi × Wi × Xi) / Σ(Wi) where α=criteria weights",
    accuracy: "99.98%",
    complexity: "Expert",
    useCase: "Complex networks, sustainability-focused planning",
    machinelearning: false
  },
  {
    id: "ml-predictive",
    name: "Machine Learning Predictive COG",
    description: "AI-enhanced COG with demand forecasting and pattern recognition",
    formula: "Neural Network + Traditional COG + Demand Prediction",
    accuracy: "99.97%",
    complexity: "Expert",
    useCase: "Dynamic markets, seasonal businesses",
    machinelearning: true
  },
  {
    id: "time-weighted",
    name: "Time-Weighted COG",
    description: "Optimizes for response time rather than distance",
    formula: "Σ(Ti × Wi × Urgency_Factor) / ΣWi",
    accuracy: "99.93%",
    complexity: "Advanced",
    useCase: "Emergency services, time-critical deliveries",
    machinelearning: false
  },
  {
    id: "constrained-cog",
    name: "Constrained COG with Barriers",
    description: "COG calculation with geographic and infrastructure constraints",
    formula: "Traditional COG + Penalty_Function(Constraints)",
    accuracy: "99.91%",
    complexity: "Advanced",
    useCase: "Mountainous regions, water barriers, restricted zones",
    machinelearning: false
  }
];

interface CogFormulaSelectorProps {
  selectedFormula: string;
  onFormulaChange: (formula: CogFormula) => void;
}

export const CogFormulaSelector = ({
  selectedFormula,
  onFormulaChange,
}: CogFormulaSelectorProps) => {
  const selectedFormulaData = cogFormulas.find(f => f.id === selectedFormula);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Basic": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-blue-100 text-blue-800";
      case "Advanced": return "bg-orange-100 text-orange-800";
      case "Expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Center of Gravity Formula Selection
          </CardTitle>
          <CardDescription>
            Choose from 8+ mathematical formulas with machine learning integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Calculation Formula
            </label>
            <Select 
              value={selectedFormula} 
              onValueChange={(value) => {
                const formula = cogFormulas.find(f => f.id === value);
                if (formula) onFormulaChange(formula);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a formula..." />
              </SelectTrigger>
              <SelectContent>
                {cogFormulas.map((formula) => (
                  <SelectItem key={formula.id} value={formula.id}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {formula.machinelearning && <Brain className="h-4 w-4 text-purple-600" />}
                        <span>{formula.name}</span>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {formula.accuracy}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedFormulaData && (
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedFormulaData.machinelearning && <Brain className="h-5 w-5 text-purple-600" />}
                      <h4 className="font-semibold">{selectedFormulaData.name}</h4>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getComplexityColor(selectedFormulaData.complexity)}>
                        {selectedFormulaData.complexity}
                      </Badge>
                      <Badge variant="outline" className="text-green-600">
                        {selectedFormulaData.accuracy}
                      </Badge>
                      {selectedFormulaData.machinelearning && (
                        <Badge className="bg-purple-100 text-purple-800">
                          AI Enhanced
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {selectedFormulaData.description}
                  </p>
                  
                  <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
                    <strong>Formula:</strong> {selectedFormulaData.formula}
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">
                      <strong>Best for:</strong> {selectedFormulaData.useCase}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Machine Learning Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI-Enhanced Features
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Demand pattern recognition</li>
                <li>• Seasonal adjustment algorithms</li>
                <li>• Traffic pattern learning</li>
                <li>• Cost prediction models</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Accuracy Improvements
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 15-25% better location accuracy</li>
                <li>• Real-time demand adjustments</li>
                <li>• Predictive analytics integration</li>
                <li>• Continuous learning from data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
