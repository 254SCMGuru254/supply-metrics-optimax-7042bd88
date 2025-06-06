
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target, Brain } from "lucide-react";

interface SuitabilityQuestion {
  id: string;
  text: string;
  category: string;
  options: {
    text: string;
    score: any;
    explanation?: string;
  }[];
}

interface SuitabilityResults {
  routeOptimizationScore: number;
  inventoryOptimizationScore: number;
  networkFlowScore: number;
  cogScore: number;
  simulationScore: number;
  recommendedModel: string;
  explanation: string;
}

interface SuitabilityQuestionnaireProps {
  onModelSelect: (model: string) => void;
}

const questions: SuitabilityQuestion[] = [
  {
    id: "business_size",
    text: "What is the size of your business operation?",
    category: "Business Scale",
    options: [
      { text: "Small (1-10 locations)", score: { cog: 3, route: 2, inventory: 2, network: 1, simulation: 1 } },
      { text: "Medium (11-50 locations)", score: { cog: 2, route: 3, inventory: 3, network: 2, simulation: 2 } },
      { text: "Large (51-200 locations)", score: { cog: 1, route: 3, inventory: 3, network: 3, simulation: 3 } },
      { text: "Enterprise (200+ locations)", score: { cog: 1, route: 2, inventory: 3, network: 3, simulation: 3 } }
    ]
  },
  {
    id: "primary_challenge",
    text: "What is your primary supply chain challenge?",
    category: "Challenge Type",
    options: [
      { text: "Finding optimal facility locations", score: { cog: 5, route: 1, inventory: 1, network: 2, simulation: 1 } },
      { text: "Route planning and vehicle optimization", score: { cog: 1, route: 5, inventory: 1, network: 2, simulation: 2 } },
      { text: "Inventory management and stock levels", score: { cog: 1, route: 1, inventory: 5, network: 1, simulation: 2 } },
      { text: "Network flow optimization", score: { cog: 2, route: 2, inventory: 2, network: 5, simulation: 3 } },
      { text: "Understanding complex system behaviors", score: { cog: 1, route: 2, inventory: 2, network: 3, simulation: 5 } }
    ]
  },
  {
    id: "data_availability",
    text: "How much historical data do you have available?",
    category: "Data Readiness",
    options: [
      { text: "Very limited data", score: { cog: 3, route: 2, inventory: 1, network: 2, simulation: 1 } },
      { text: "Some historical data (6-12 months)", score: { cog: 3, route: 3, inventory: 2, network: 3, simulation: 2 } },
      { text: "Good historical data (1-3 years)", score: { cog: 2, route: 3, inventory: 3, network: 3, simulation: 3 } },
      { text: "Extensive historical data (3+ years)", score: { cog: 2, route: 3, inventory: 3, network: 3, simulation: 4 } }
    ]
  },
  {
    id: "decision_urgency",
    text: "How quickly do you need optimization results?",
    category: "Timeline",
    options: [
      { text: "Immediate (same day)", score: { cog: 4, route: 3, inventory: 2, network: 2, simulation: 1 } },
      { text: "Within a week", score: { cog: 3, route: 3, inventory: 3, network: 3, simulation: 2 } },
      { text: "Within a month", score: { cog: 2, route: 3, inventory: 3, network: 3, simulation: 3 } },
      { text: "Long-term strategic planning", score: { cog: 2, route: 2, inventory: 3, network: 3, simulation: 4 } }
    ]
  },
  {
    id: "complexity_tolerance",
    text: "What level of model complexity can your team handle?",
    category: "Technical Capability",
    options: [
      { text: "Simple, intuitive models", score: { cog: 4, route: 3, inventory: 3, network: 2, simulation: 1 } },
      { text: "Moderate complexity with guidance", score: { cog: 3, route: 3, inventory: 3, network: 3, simulation: 2 } },
      { text: "Advanced models with technical support", score: { cog: 2, route: 3, inventory: 3, network: 3, simulation: 3 } },
      { text: "Highly complex models", score: { cog: 1, route: 2, inventory: 3, network: 4, simulation: 4 } }
    ]
  }
];

export const SuitabilityQuestionnaire: React.FC<SuitabilityQuestionnaireProps> = ({ onModelSelect }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<SuitabilityResults | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleAnswer = (questionId: string, score: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    setSelectedOption("");
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const scores = {
      cog: 0,
      route: 0,
      inventory: 0,
      network: 0,
      simulation: 0
    };

    Object.values(answers).forEach((answer: any) => {
      scores.cog += answer.cog || 0;
      scores.route += answer.route || 0;
      scores.inventory += answer.inventory || 0;
      scores.network += answer.network || 0;
      scores.simulation += answer.simulation || 0;
    });

    const maxScore = Math.max(scores.cog, scores.route, scores.inventory, scores.network, scores.simulation);
    let recommendedModel = "";
    let explanation = "";

    if (scores.cog === maxScore) {
      recommendedModel = "cog";
      explanation = "Center of Gravity optimization is ideal for your facility location challenges and business size.";
    } else if (scores.route === maxScore) {
      recommendedModel = "route";
      explanation = "Route Optimization will help you solve vehicle routing and delivery planning challenges efficiently.";
    } else if (scores.inventory === maxScore) {
      recommendedModel = "inventory";
      explanation = "Inventory Optimization is perfect for managing stock levels and reducing carrying costs.";
    } else if (scores.network === maxScore) {
      recommendedModel = "network";
      explanation = "Network Flow Optimization will help you optimize flows across your entire supply chain network.";
    } else {
      recommendedModel = "simulation";
      explanation = "Simulation models will help you understand complex system behaviors and test scenarios.";
    }

    const calculatedResults: SuitabilityResults = {
      routeOptimizationScore: Math.round((scores.route / (questions.length * 5)) * 100),
      inventoryOptimizationScore: Math.round((scores.inventory / (questions.length * 5)) * 100),
      networkFlowScore: Math.round((scores.network / (questions.length * 5)) * 100),
      cogScore: Math.round((scores.cog / (questions.length * 5)) * 100),
      simulationScore: Math.round((scores.simulation / (questions.length * 5)) * 100),
      recommendedModel,
      explanation
    };

    setResults(calculatedResults);
  };

  const resetQuestionnaire = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
    setSelectedOption("");
  };

  const getModelDisplayName = (model: string) => {
    const names = {
      cog: "Center of Gravity",
      route: "Route Optimization", 
      inventory: "Inventory Optimization",
      network: "Network Flow",
      simulation: "Simulation"
    };
    return names[model as keyof typeof names] || model;
  };

  if (results) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Suitability Assessment Complete
          </CardTitle>
          <CardDescription>
            Based on your responses, here are your model suitability scores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Center of Gravity</span>
                <span className="text-sm font-mono">{results.cogScore}%</span>
              </div>
              <Progress value={results.cogScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Route Optimization</span>
                <span className="text-sm font-mono">{results.routeOptimizationScore}%</span>
              </div>
              <Progress value={results.routeOptimizationScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Inventory Optimization</span>
                <span className="text-sm font-mono">{results.inventoryOptimizationScore}%</span>
              </div>
              <Progress value={results.inventoryOptimizationScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Network Flow</span>
                <span className="text-sm font-mono">{results.networkFlowScore}%</span>
              </div>
              <Progress value={results.networkFlowScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Simulation</span>
                <span className="text-sm font-mono">{results.simulationScore}%</span>
              </div>
              <Progress value={results.simulationScore} className="h-2" />
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Recommended Model</h3>
            </div>
            <div className="space-y-2">
              <Badge variant="default" className="text-sm">
                {getModelDisplayName(results.recommendedModel)}
              </Badge>
              <p className="text-sm text-blue-700">{results.explanation}</p>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={() => onModelSelect(results.recommendedModel)}>
              <Brain className="h-4 w-4 mr-2" />
              Start with {getModelDisplayName(results.recommendedModel)}
            </Button>
            <Button variant="outline" onClick={resetQuestionnaire}>
              Retake Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Supply Chain Model Suitability Assessment</CardTitle>
          <Badge variant="outline">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
        </div>
        <CardDescription>
          This assessment will help determine the most suitable optimization model for your needs
        </CardDescription>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Badge variant="secondary" className="mb-2">
              {question.category}
            </Badge>
            <h3 className="text-lg font-medium">{question.text}</h3>
          </div>
          
          <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-start space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 text-sm leading-relaxed cursor-pointer"
                >
                  {option.text}
                  {option.explanation && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {option.explanation}
                    </div>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => handleAnswer(question.id, question.options[parseInt(selectedOption)].score)}
            disabled={selectedOption === ""}
          >
            {currentQuestion === questions.length - 1 ? 'Calculate Results' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
