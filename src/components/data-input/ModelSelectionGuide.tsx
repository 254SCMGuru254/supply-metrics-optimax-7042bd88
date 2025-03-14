
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Truck, Building2, Network, Target, Calculator, BarChart4, Hexagon, Database, CheckCircle2, ArrowRight, ArrowLeft, LineChart } from "lucide-react";
import { HelpSystem } from "@/components/HelpSystem";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ModelOption = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  advantages: string[];
  disadvantages: string[];
  bestFor: string[];
  tools: string;
};

const modelOptions: ModelOption[] = [
  {
    id: "cog",
    name: "Center of Gravity",
    description: "A mathematical method to determine the optimal location of a distribution center by calculating the weighted average of existing locations.",
    icon: Target,
    advantages: [
      "Simple to understand and implement",
      "Computationally efficient",
      "Good starting point for facility location"
    ],
    disadvantages: [
      "Assumes straight-line distances",
      "Limited to single facility optimization",
      "Doesn't account for complex constraints"
    ],
    bestFor: [
      "Initial warehouse location planning",
      "Simple distribution networks",
      "Quick preliminary analysis"
    ],
    tools: "Built-in CoG calculator in Chainalyze.io"
  },
  {
    id: "network",
    name: "Network Flow Models",
    description: "Optimizes flow of goods across a supply chain network while balancing costs and meeting demand requirements.",
    icon: Network,
    advantages: [
      "Balances cost vs. demand across multiple nodes",
      "Optimizes for multiple warehouse locations",
      "Supports multi-modal transportation"
    ],
    disadvantages: [
      "Works best for stable demand",
      "May struggle with uncertainty",
      "Requires accurate transportation cost data"
    ],
    bestFor: [
      "Multi-echelon supply chains",
      "Transportation optimization",
      "Distribution network design"
    ],
    tools: "Network optimization module in Chainalyze.io"
  },
  {
    id: "milp",
    name: "Mixed-Integer Linear Programming",
    description: "Mathematical optimization approach that finds the optimal solution where some variables must be integers while minimizing costs and satisfying constraints.",
    icon: Calculator,
    advantages: [
      "Finds truly optimal solutions",
      "Handles complex constraints",
      "Supports multi-echelon supply chains"
    ],
    disadvantages: [
      "Requires significant computational power",
      "Can be difficult to model complex scenarios",
      "May be overkill for simple problems"
    ],
    bestFor: [
      "Factory → warehouse → customer networks",
      "Complex supply chain design",
      "Cases where optimality is critical"
    ],
    tools: "PuLP, Gurobi, CPLEX integration in Chainalyze.io"
  },
  {
    id: "heuristic",
    name: "Metaheuristic Models",
    description: "Problem-solving methods that use intelligent search strategies to find near-optimal solutions to complex problems.",
    icon: BarChart4,
    advantages: [
      "Handles uncertainty and complexity",
      "Works well with real-time adjustments",
      "Adaptable to changing conditions"
    ],
    disadvantages: [
      "Harder to implement than other methods",
      "Solutions are near-optimal, not guaranteed optimal",
      "Requires careful parameter tuning"
    ],
    bestFor: [
      "Dynamic routing problems",
      "Kenyan logistics with variable conditions",
      "Complex scenarios with many constraints"
    ],
    tools: "Genetic algorithms, simulated annealing, and machine learning modules"
  },
  {
    id: "simulation",
    name: "Simulation",
    description: "Creating a digital replica of your supply chain to test different scenarios and strategies over time.",
    icon: LineChart,
    advantages: [
      "Tests real-world scenarios before implementation",
      "Identifies bottlenecks and vulnerabilities",
      "Allows for what-if analysis"
    ],
    disadvantages: [
      "Can be time-consuming to build accurate models",
      "Requires significant data inputs",
      "Results depend on accuracy of assumptions"
    ],
    bestFor: [
      "Risk analysis and planning",
      "Testing resilience to disruptions",
      "Long-term strategic planning"
    ],
    tools: "Discrete event simulation module in Chainalyze.io"
  },
  {
    id: "isohedron",
    name: "Isohedron Modeling",
    description: "Advanced geometric modeling approach that divides geographic space into equal areas for balanced logistics planning.",
    icon: Hexagon,
    advantages: [
      "Provides balanced spatial coverage",
      "Works well for regional planning",
      "Reduces computational complexity"
    ],
    disadvantages: [
      "Specialized for specific use cases",
      "Less common than other approaches",
      "Requires geographic data expertise"
    ],
    bestFor: [
      "Regional distribution planning",
      "Service area optimization",
      "Specialized logistics applications"
    ],
    tools: "Custom isohedron modeling module in Chainalyze.io"
  },
  {
    id: "comprehensive",
    name: "Integrated Approach",
    description: "Combines multiple optimization methods for a holistic supply chain solution.",
    icon: Database,
    advantages: [
      "Leverages strengths of multiple methods",
      "Provides more robust solutions",
      "Addresses different aspects of the supply chain"
    ],
    disadvantages: [
      "More complex to implement",
      "Requires expertise in multiple areas",
      "May have higher computational requirements"
    ],
    bestFor: [
      "End-to-end supply chain optimization",
      "Complex logistics networks",
      "Strategic and tactical planning"
    ],
    tools: "All modules in Chainalyze.io working together"
  }
];

type Question = {
  id: string;
  text: string;
  options: {
    text: string;
    points: Record<string, number>;
  }[];
};

const questions: Question[] = [
  {
    id: "complexity",
    text: "How complex is your supply chain network?",
    options: [
      { 
        text: "Simple (single origin to few destinations)", 
        points: { cog: 3, network: 1, milp: 0, heuristic: 0, simulation: 0, isohedron: 1, comprehensive: 0 } 
      },
      { 
        text: "Moderate (multiple facilities, standard routes)", 
        points: { cog: 1, network: 3, milp: 2, heuristic: 1, simulation: 1, isohedron: 2, comprehensive: 1 } 
      },
      { 
        text: "Complex (multiple echelons, many facilities)", 
        points: { cog: 0, network: 2, milp: 3, heuristic: 2, simulation: 2, isohedron: 1, comprehensive: 3 } 
      },
      { 
        text: "Very complex (global, multi-modal, highly variable)", 
        points: { cog: 0, network: 1, milp: 2, heuristic: 3, simulation: 3, isohedron: 1, comprehensive: 3 } 
      }
    ]
  },
  {
    id: "resources",
    text: "What computational and expertise resources do you have available?",
    options: [
      { 
        text: "Limited (basic tools, minimal expertise)", 
        points: { cog: 3, network: 2, milp: 0, heuristic: 0, simulation: 1, isohedron: 0, comprehensive: 0 } 
      },
      { 
        text: "Moderate (standard business software, some expertise)", 
        points: { cog: 2, network: 3, milp: 1, heuristic: 1, simulation: 2, isohedron: 1, comprehensive: 1 } 
      },
      { 
        text: "Substantial (specialized software, dedicated team)", 
        points: { cog: 1, network: 2, milp: 3, heuristic: 2, simulation: 3, isohedron: 2, comprehensive: 2 } 
      },
      { 
        text: "Advanced (enterprise solutions, expert analysts)", 
        points: { cog: 0, network: 1, milp: 3, heuristic: 3, simulation: 3, isohedron: 3, comprehensive: 3 } 
      }
    ]
  },
  {
    id: "objective",
    text: "What is your primary optimization objective?",
    options: [
      { 
        text: "Finding optimal facility locations", 
        points: { cog: 3, network: 2, milp: 3, heuristic: 1, simulation: 1, isohedron: 2, comprehensive: 2 } 
      },
      { 
        text: "Optimizing transportation routes and costs", 
        points: { cog: 0, network: 3, milp: 2, heuristic: 3, simulation: 1, isohedron: 1, comprehensive: 2 } 
      },
      { 
        text: "Testing resilience to disruptions", 
        points: { cog: 0, network: 1, milp: 1, heuristic: 2, simulation: 3, isohedron: 0, comprehensive: 2 } 
      },
      { 
        text: "Comprehensive supply chain design", 
        points: { cog: 1, network: 2, milp: 3, heuristic: 2, simulation: 2, isohedron: 1, comprehensive: 3 } 
      }
    ]
  },
  {
    id: "environment",
    text: "How stable is your operating environment?",
    options: [
      { 
        text: "Very stable (predictable demand, reliable infrastructure)", 
        points: { cog: 3, network: 3, milp: 3, heuristic: 1, simulation: 2, isohedron: 2, comprehensive: 2 } 
      },
      { 
        text: "Mostly stable with occasional variations", 
        points: { cog: 2, network: 2, milp: 2, heuristic: 2, simulation: 2, isohedron: 2, comprehensive: 2 } 
      },
      { 
        text: "Variable (seasonal changes, some unpredictability)", 
        points: { cog: 1, network: 1, milp: 1, heuristic: 3, simulation: 3, isohedron: 1, comprehensive: 2 } 
      },
      { 
        text: "Highly variable (unpredictable demand, infrastructure challenges)", 
        points: { cog: 0, network: 0, milp: 0, heuristic: 3, simulation: 3, isohedron: 1, comprehensive: 3 } 
      }
    ]
  },
  {
    id: "timeframe",
    text: "What is your planning timeframe?",
    options: [
      { 
        text: "Short-term operational (days to weeks)", 
        points: { cog: 1, network: 2, milp: 1, heuristic: 3, simulation: 1, isohedron: 0, comprehensive: 1 } 
      },
      { 
        text: "Medium-term tactical (months to a year)", 
        points: { cog: 2, network: 3, milp: 2, heuristic: 2, simulation: 2, isohedron: 1, comprehensive: 2 } 
      },
      { 
        text: "Long-term strategic (years)", 
        points: { cog: 3, network: 2, milp: 3, heuristic: 1, simulation: 3, isohedron: 3, comprehensive: 3 } 
      },
      { 
        text: "Mixed (need solutions for multiple timeframes)", 
        points: { cog: 1, network: 2, milp: 2, heuristic: 2, simulation: 2, isohedron: 1, comprehensive: 3 } 
      }
    ]
  }
];

export const ModelSelectionGuide = ({ 
  onModelSelect 
}: { 
  onModelSelect: (model: string) => void 
}) => {
  const [step, setStep] = useState<"intro" | "questionnaire" | "results">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Record<string, number>>>({});
  const [recommendedModels, setRecommendedModels] = useState<{id: string, score: number}[]>([]);
  const [selectedTab, setSelectedTab] = useState("overview");

  const handleStartQuestionnaire = () => {
    setStep("questionnaire");
  };

  const handleSelectAnswer = (questionId: string, points: Record<string, number>) => {
    const newAnswers = { ...answers, [questionId]: points };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      const modelScores: Record<string, number> = {};
      
      Object.values(newAnswers).forEach(pointsObj => {
        Object.entries(pointsObj).forEach(([modelId, points]) => {
          modelScores[modelId] = (modelScores[modelId] || 0) + points;
        });
      });
      
      // Sort models by score
      const sortedModels = Object.entries(modelScores)
        .map(([id, score]) => ({ id, score }))
        .sort((a, b) => b.score - a.score);
      
      setRecommendedModels(sortedModels);
      setStep("results");
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSelectModel = (modelId: string) => {
    onModelSelect(modelId);
  };

  const handleRestart = () => {
    setStep("intro");
    setCurrentQuestion(0);
    setAnswers({});
    setRecommendedModels([]);
  };

  const modelHelpSections = [
    {
      title: "Types of Optimization Models",
      content: "Supply chain optimization uses different mathematical approaches depending on your goals. Center of Gravity (CoG) finds optimal locations, Network Flow models optimize transportation, MILP handles complex constraints, and Metaheuristics adapt to changing conditions."
    },
    {
      title: "When to Use Each Model",
      content: "Use CoG for simple location problems, Network Flow for distribution planning, MILP for complex multi-echelon networks, and Metaheuristics for dynamic routing in uncertain conditions like Kenyan logistics with variable road conditions."
    },
    {
      title: "Combining Models",
      content: "For best results, use a combination approach: CoG + MILP for location optimization, Network Flow + Metaheuristics for route optimization, and integrate real-time data for dynamic routing in Kenya."
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Supply Chain Model Selection Guide</CardTitle>
          <CardDescription>
            Find the right optimization approach for your supply chain needs
          </CardDescription>
        </div>
        <HelpSystem sections={modelHelpSections} title="Model Selection Help" />
      </CardHeader>
      
      <CardContent>
        {step === "intro" && (
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Choosing the right model is crucial</AlertTitle>
              <AlertDescription>
                Different supply chain challenges require different optimization approaches. 
                This guide will help you select the most appropriate model for your specific needs.
              </AlertDescription>
            </Alert>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-4 border-primary/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium">Location Optimization</h3>
                  <p className="text-sm text-muted-foreground">Find optimal facility locations</p>
                </div>
              </Card>
              
              <Card className="p-4 border-primary/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Truck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium">Route Optimization</h3>
                  <p className="text-sm text-muted-foreground">Plan efficient delivery routes</p>
                </div>
              </Card>
              
              <Card className="p-4 border-primary/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium">Network Design</h3>
                  <p className="text-sm text-muted-foreground">Design your entire supply chain</p>
                </div>
              </Card>
            </div>
            
            <p className="text-muted-foreground">
              This guide will ask you 5 short questions about your supply chain needs and recommend 
              the most appropriate optimization models. You can then explore detailed information 
              about each recommended model.
            </p>
          </div>
        )}
        
        {step === "questionnaire" && (
          <div className="space-y-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete</span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            
            <h3 className="text-lg font-medium mt-6">
              {questions[currentQuestion].text}
            </h3>
            
            <div className="space-y-3 mt-4">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4 text-left"
                  onClick={() => handleSelectAnswer(questions[currentQuestion].id, option.points)}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {step === "results" && (
          <div className="space-y-6">
            <Alert className="bg-primary/10 border-primary">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertTitle>Analysis Complete</AlertTitle>
              <AlertDescription>
                Based on your answers, we've identified the most suitable optimization models for your needs.
              </AlertDescription>
            </Alert>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="overview">Recommendations</TabsTrigger>
                <TabsTrigger value="details">Model Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 pt-4">
                <p className="text-muted-foreground mb-4">
                  Here are our recommended models ranked by suitability for your needs:
                </p>
                
                {recommendedModels.slice(0, 3).map((model, index) => {
                  const modelData = modelOptions.find(m => m.id === model.id);
                  if (!modelData) return null;
                  
                  return (
                    <Card key={model.id} className="border-primary/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-full ${index === 0 ? 'bg-primary/20' : 'bg-muted'}`}>
                            <modelData.icon className={`h-5 w-5 ${index === 0 ? 'text-primary' : ''}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{modelData.name}</CardTitle>
                            <CardDescription>
                              {index === 0 ? 'Best match for your needs' : `Match score: ${Math.round((model.score / (questions.length * 3)) * 100)}%`}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm">{modelData.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant={index === 0 ? "default" : "outline"} 
                          className="w-full"
                          onClick={() => handleSelectModel(model.id)}
                        >
                          Select This Model
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
                
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    For a more detailed comparison, check the Model Details tab.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6 pt-4">
                <p className="text-muted-foreground mb-4">
                  Compare features and capabilities of different optimization models:
                </p>
                
                <div className="space-y-8">
                  {modelOptions.map(model => {
                    const recommendedModel = recommendedModels.find(m => m.id === model.id);
                    const matchScore = recommendedModel 
                      ? Math.round((recommendedModel.score / (questions.length * 3)) * 100) 
                      : 0;
                    
                    return (
                      <Card key={model.id} className="overflow-hidden">
                        <CardHeader className="pb-2 bg-muted/50">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-full bg-background">
                                <model.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{model.name}</CardTitle>
                                <CardDescription>
                                  {recommendedModel ? `Match score: ${matchScore}%` : 'Not recommended for your needs'}
                                </CardDescription>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSelectModel(model.id)}
                            >
                              Select
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="mb-4">{model.description}</p>
                          
                          <div className="grid md:grid-cols-3 gap-4 mt-4">
                            <div>
                              <h4 className="font-medium text-sm mb-2">Advantages</h4>
                              <ul className="text-sm space-y-1">
                                {model.advantages.map((adv, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span>{adv}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm mb-2">Limitations</h4>
                              <ul className="text-sm space-y-1">
                                {model.disadvantages.map((dis, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                                    <span>{dis}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm mb-2">Best For</h4>
                              <ul className="text-sm space-y-1">
                                {model.bestFor.map((use, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5" />
                                    <span>{use}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {step === "intro" ? (
          <div className="w-full">
            <Button 
              className="w-full"
              onClick={handleStartQuestionnaire}
            >
              Start Model Selection Guide
            </Button>
          </div>
        ) : step === "questionnaire" ? (
          <>
            <Button 
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button 
              variant="ghost"
              onClick={handleRestart}
            >
              Restart
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline"
              onClick={handleRestart}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Start Over
            </Button>
            <Button 
              variant="ghost"
              onClick={() => onModelSelect("")}
            >
              Back to Model Selection
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
