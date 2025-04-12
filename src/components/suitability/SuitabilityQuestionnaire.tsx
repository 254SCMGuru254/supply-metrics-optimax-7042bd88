
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { 
  HelpCircle, 
  CheckCircle, 
  Route, 
  Package, 
  Network,
  Target,
  BarChart4,
  ArrowRight,
  ListChecks
} from "lucide-react";
import { SuitabilityQuestion, SuitabilityResults } from "@/components/map/MapTypes";

// Define the questions for the suitability questionnaire
const questions: SuitabilityQuestion[] = [
  {
    id: "q1",
    text: "What is your primary goal for supply chain optimization?",
    category: "general",
    options: [
      { text: "Reduce transportation/delivery costs", score: { route: 5, inventory: 1, network: 3, cog: 2, simulation: 2 } },
      { text: "Optimize inventory levels and reduce stockouts", score: { route: 1, inventory: 5, network: 2, cog: 1, simulation: 3 } },
      { text: "Find optimal facility locations", score: { route: 2, inventory: 1, network: 3, cog: 5, simulation: 1 } },
      { text: "Improve overall network flow", score: { route: 3, inventory: 2, network: 5, cog: 3, simulation: 3 } },
      { text: "Test different supply chain scenarios", score: { route: 2, inventory: 3, network: 3, cog: 2, simulation: 5 } }
    ]
  },
  {
    id: "q2",
    text: "What type of business are you optimizing for?",
    category: "general",
    options: [
      { text: "Retail/distribution (multiple delivery points)", score: { route: 5, inventory: 4, network: 3, cog: 3, simulation: 3 } },
      { text: "Manufacturing (production planning)", score: { route: 2, inventory: 4, network: 3, cog: 3, simulation: 5 } },
      { text: "Warehousing/storage facilities", score: { route: 2, inventory: 5, network: 3, cog: 4, simulation: 3 } },
      { text: "Transportation/logistics company", score: { route: 5, inventory: 2, network: 4, cog: 3, simulation: 3 } },
      { text: "Agriculture/food supply chain", score: { route: 4, inventory: 4, network: 3, cog: 2, simulation: 4 } }
    ]
  },
  {
    id: "q3",
    text: "How would you describe your delivery needs?",
    category: "route",
    options: [
      { text: "Multiple vehicles serving many destinations daily", score: { route: 5, inventory: 2, network: 3, cog: 1, simulation: 3 } },
      { text: "Fixed routes with occasional changes", score: { route: 4, inventory: 2, network: 2, cog: 3, simulation: 2 } },
      { text: "On-demand delivery with changing destinations", score: { route: 5, inventory: 1, network: 2, cog: 1, simulation: 4 } },
      { text: "Long-distance transportation between few locations", score: { route: 3, inventory: 2, network: 4, cog: 3, simulation: 2 } },
      { text: "We don't handle delivery/transportation directly", score: { route: 1, inventory: 4, network: 2, cog: 3, simulation: 2 } }
    ]
  },
  {
    id: "q4",
    text: "How would you describe your inventory management challenges?",
    category: "inventory",
    options: [
      { text: "Frequent stockouts affecting customer satisfaction", score: { route: 1, inventory: 5, network: 2, cog: 1, simulation: 3 } },
      { text: "High holding costs from excess inventory", score: { route: 1, inventory: 5, network: 2, cog: 2, simulation: 3 } },
      { text: "Seasonal demand fluctuations", score: { route: 2, inventory: 5, network: 2, cog: 1, simulation: 4 } },
      { text: "Managing perishable/time-sensitive goods", score: { route: 4, inventory: 5, network: 2, cog: 1, simulation: 3 } },
      { text: "Balancing inventory across multiple locations", score: { route: 3, inventory: 4, network: 4, cog: 3, simulation: 3 } }
    ]
  },
  {
    id: "q5",
    text: "Are you considering opening new facilities or relocating existing ones?",
    category: "cog",
    options: [
      { text: "Yes, planning new facilities in the near future", score: { route: 2, inventory: 2, network: 4, cog: 5, simulation: 3 } },
      { text: "Yes, evaluating if current locations are optimal", score: { route: 2, inventory: 2, network: 3, cog: 5, simulation: 3 } },
      { text: "Not new facilities, but optimizing within existing ones", score: { route: 3, inventory: 4, network: 4, cog: 2, simulation: 3 } },
      { text: "No, our facility locations are fixed", score: { route: 4, inventory: 4, network: 3, cog: 1, simulation: 2 } }
    ]
  },
  {
    id: "q6",
    text: "How complex is your supply network?",
    category: "network",
    options: [
      { text: "Simple: few suppliers, facilities, and customers", score: { route: 3, inventory: 3, network: 2, cog: 4, simulation: 2 } },
      { text: "Moderate: multiple suppliers and distribution points", score: { route: 3, inventory: 3, network: 4, cog: 3, simulation: 3 } },
      { text: "Complex: many nodes with various constraints", score: { route: 4, inventory: 3, network: 5, cog: 3, simulation: 4 } },
      { text: "Very complex: global network with many variables", score: { route: 4, inventory: 4, network: 5, cog: 3, simulation: 5 } }
    ]
  },
  {
    id: "q7",
    text: "What data do you have available for optimization?",
    category: "technical",
    options: [
      { text: "Complete historical delivery/routing data", score: { route: 5, inventory: 3, network: 3, cog: 3, simulation: 3 } },
      { text: "Detailed inventory and demand history", score: { route: 2, inventory: 5, network: 3, cog: 2, simulation: 3 } },
      { text: "Facility locations and capacity information", score: { route: 2, inventory: 3, network: 4, cog: 5, simulation: 3 } },
      { text: "Complete supply chain cost structure", score: { route: 3, inventory: 4, network: 4, cog: 3, simulation: 4 } },
      { text: "Limited data, seeking insights with available information", score: { route: 2, inventory: 2, network: 2, cog: 3, simulation: 2 } }
    ]
  },
  {
    id: "q8",
    text: "Do you need to account for uncertainty and risk in your supply chain?",
    category: "simulation",
    options: [
      { text: "Yes, we deal with highly variable demand", score: { route: 3, inventory: 4, network: 3, cog: 2, simulation: 5 } },
      { text: "Yes, we face potential supply disruptions", score: { route: 2, inventory: 4, network: 3, cog: 2, simulation: 5 } },
      { text: "Yes, both demand and supply are uncertain", score: { route: 3, inventory: 4, network: 3, cog: 2, simulation: 5 } },
      { text: "No, our environment is relatively stable", score: { route: 4, inventory: 3, network: 4, cog: 4, simulation: 2 } }
    ]
  },
  {
    id: "q9",
    text: "What's your implementation timeframe?",
    category: "general",
    options: [
      { text: "Need quick wins immediately", score: { route: 4, inventory: 4, network: 2, cog: 3, simulation: 1 } },
      { text: "Planning for medium-term improvements (3-6 months)", score: { route: 3, inventory: 3, network: 4, cog: 4, simulation: 3 } },
      { text: "Looking for long-term strategic solutions (6+ months)", score: { route: 3, inventory: 3, network: 4, cog: 4, simulation: 5 } }
    ]
  },
  {
    id: "q10",
    text: "Which Kenya-specific challenges most affect your supply chain?",
    category: "general",
    options: [
      { text: "Poor road infrastructure in rural areas", score: { route: 5, inventory: 3, network: 3, cog: 4, simulation: 3 } },
      { text: "Seasonal weather affecting transport (e.g., rainy season)", score: { route: 4, inventory: 3, network: 3, cog: 2, simulation: 5 } },
      { text: "High costs of inventory storage/warehousing", score: { route: 2, inventory: 5, network: 3, cog: 4, simulation: 3 } },
      { text: "Border crossing delays for regional trade", score: { route: 5, inventory: 3, network: 4, cog: 3, simulation: 4 } },
      { text: "Last-mile delivery in unstructured areas", score: { route: 5, inventory: 2, network: 3, cog: 3, simulation: 4 } }
    ]
  }
];

interface ScoringObject {
  route: number;
  inventory: number;
  network: number;
  cog: number;
  simulation: number;
}

export const SuitabilityQuestionnaire = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scores, setScores] = useState<ScoringObject>({
    route: 0,
    inventory: 0,
    network: 0,
    cog: 0,
    simulation: 0
  });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SuitabilityResults | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];
  
  const handleAnswer = (questionId: string, optionIndex: number) => {
    // Update answers
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
    
    // Update scores
    const option = currentQuestion.options[optionIndex];
    const optionScore = option.score as unknown as ScoringObject;
    
    setScores({
      route: scores.route + optionScore.route,
      inventory: scores.inventory + optionScore.inventory,
      network: scores.network + optionScore.network,
      cog: scores.cog + optionScore.cog,
      simulation: scores.simulation + optionScore.simulation
    });
    
    // Move to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
    }
  };

  const handleFeatureToggle = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };
  
  const calculateResults = () => {
    // Determine the highest score
    const scoreValues = Object.entries(scores);
    scoreValues.sort((a, b) => b[1] - a[1]);
    
    const highestScore = scoreValues[0];
    const secondHighest = scoreValues[1];
    
    // Create personalized recommendation
    let recommendedModel = "";
    let explanation = "";
    
    switch (highestScore[0]) {
      case "route":
        recommendedModel = "Route Optimization";
        explanation = "Based on your answers, route optimization would provide the most immediate value. Your focus on transportation efficiency, multiple delivery points, and reducing logistics costs aligns well with this solution.";
        break;
      case "inventory":
        recommendedModel = "Inventory Optimization";
        explanation = "Your responses indicate inventory management is your primary concern. Optimizing inventory levels will help reduce stockouts, minimize holding costs, and improve your cash flow.";
        break;
      case "network":
        recommendedModel = "Network Flow Optimization";
        explanation = "The complexity of your supply network and your focus on improving overall flow suggests network optimization would be most beneficial for your operations.";
        break;
      case "cog":
        recommendedModel = "Center of Gravity";
        explanation = "Your interest in facility location and distribution network design makes Center of Gravity analysis an ideal starting point to optimize your physical footprint.";
        break;
      case "simulation":
        recommendedModel = "Supply Chain Simulation";
        explanation = "Given the uncertainties and complexities you described, simulation would help you test different scenarios and make more robust decisions in your dynamic environment.";
        break;
    }
    
    // Add information about the second highest score if it's close
    if (secondHighest[1] >= highestScore[1] * 0.8) {
      explanation += ` You might also benefit from ${getModelName(secondHighest[0])} as a complementary approach.`;
    }
    
    setResults({
      routeOptimizationScore: scores.route,
      inventoryOptimizationScore: scores.inventory,
      networkFlowScore: scores.network,
      cogScore: scores.cog,
      simulationScore: scores.simulation,
      recommendedModel,
      explanation
    });
    
    setShowResults(true);
  };
  
  const getModelName = (key: string): string => {
    switch (key) {
      case "route": return "Route Optimization";
      case "inventory": return "Inventory Optimization";
      case "network": return "Network Flow Optimization";
      case "cog": return "Center of Gravity";
      case "simulation": return "Supply Chain Simulation";
      default: return key;
    }
  };
  
  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScores({
      route: 0,
      inventory: 0,
      network: 0,
      cog: 0,
      simulation: 0
    });
    setShowResults(false);
    setResults(null);
    setSelectedFeatures([]);
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const getModelIcon = (model: string) => {
    switch (model) {
      case "Route Optimization":
        return <Route className="h-6 w-6 text-blue-500" />;
      case "Inventory Optimization":
        return <Package className="h-6 w-6 text-green-500" />;
      case "Network Flow Optimization":
        return <Network className="h-6 w-6 text-purple-500" />;
      case "Center of Gravity":
        return <Target className="h-6 w-6 text-red-500" />;
      case "Supply Chain Simulation":
        return <BarChart4 className="h-6 w-6 text-amber-500" />;
      default:
        return <HelpCircle className="h-6 w-6" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Supply Chain Optimization Suitability</h1>
      </div>
      
      {!showResults ? (
        <Card className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium">{getProgressPercentage()}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
          
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
          
          <RadioGroup 
            value={answers[currentQuestion.id]?.toString()} 
            className="space-y-4"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-md border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleAnswer(currentQuestion.id, index)}
              >
                <RadioGroupItem value={index.toString()} id={`q${currentQuestion.id}-${index}`} />
                <div className="flex-1">
                  <Label
                    htmlFor={`q${currentQuestion.id}-${index}`}
                    className="text-base font-medium cursor-pointer"
                  >
                    {option.text}
                  </Label>
                  {option.explanation && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
          
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                }
              }}
              disabled={currentQuestionIndex === 0}
            >
              Previous Question
            </Button>
            
            <Button
              onClick={() => {
                if (currentQuestionIndex < questions.length - 1) {
                  // If user hasn't answered yet, prompt them
                  if (answers[currentQuestion.id] === undefined) {
                    toast({
                      title: "Please select an answer",
                      description: "Choose an option before proceeding",
                      variant: "destructive"
                    });
                    return;
                  }
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                } else {
                  // If user hasn't answered the last question yet
                  if (answers[currentQuestion.id] === undefined) {
                    toast({
                      title: "Please select an answer",
                      description: "Choose an option before seeing results",
                      variant: "destructive"
                    });
                    return;
                  }
                  calculateResults();
                }
              }}
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">Your Results</h2>
                <p className="text-muted-foreground">
                  Based on your responses, we've identified the most suitable optimization approaches
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center mb-2">
                {results && getModelIcon(results.recommendedModel)}
                <h3 className="text-xl font-semibold ml-2">
                  Recommended: {results?.recommendedModel}
                </h3>
              </div>
              <p className="text-muted-foreground mb-4">
                {results?.explanation}
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Model Suitability Scores</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Route Optimization</span>
                    <span className="text-sm font-medium">{Math.round((scores.route / 50) * 100)}%</span>
                  </div>
                  <Progress value={(scores.route / 50) * 100} className="h-2 bg-blue-100 dark:bg-blue-900/20">
                    <div className="h-full bg-blue-500 rounded-full" />
                  </Progress>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Inventory Optimization</span>
                    <span className="text-sm font-medium">{Math.round((scores.inventory / 50) * 100)}%</span>
                  </div>
                  <Progress value={(scores.inventory / 50) * 100} className="h-2 bg-green-100 dark:bg-green-900/20">
                    <div className="h-full bg-green-500 rounded-full" />
                  </Progress>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Network Flow Optimization</span>
                    <span className="text-sm font-medium">{Math.round((scores.network / 50) * 100)}%</span>
                  </div>
                  <Progress value={(scores.network / 50) * 100} className="h-2 bg-purple-100 dark:bg-purple-900/20">
                    <div className="h-full bg-purple-500 rounded-full" />
                  </Progress>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Center of Gravity</span>
                    <span className="text-sm font-medium">{Math.round((scores.cog / 50) * 100)}%</span>
                  </div>
                  <Progress value={(scores.cog / 50) * 100} className="h-2 bg-red-100 dark:bg-red-900/20">
                    <div className="h-full bg-red-500 rounded-full" />
                  </Progress>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Supply Chain Simulation</span>
                    <span className="text-sm font-medium">{Math.round((scores.simulation / 50) * 100)}%</span>
                  </div>
                  <Progress value={(scores.simulation / 50) * 100} className="h-2 bg-amber-100 dark:bg-amber-900/20">
                    <div className="h-full bg-amber-500 rounded-full" />
                  </Progress>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
            
            <div className="mb-6">
              <p className="mb-3">Select the features you want to implement:</p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="route" 
                    checked={selectedFeatures.includes("route")}
                    onCheckedChange={() => handleFeatureToggle("route")}
                  />
                  <div>
                    <Label htmlFor="route" className="font-medium">Route Optimization</Label>
                    <p className="text-sm text-muted-foreground">
                      Optimize delivery routes to minimize distance, time, and cost
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="inventory" 
                    checked={selectedFeatures.includes("inventory")}
                    onCheckedChange={() => handleFeatureToggle("inventory")}
                  />
                  <div>
                    <Label htmlFor="inventory" className="font-medium">Inventory Optimization</Label>
                    <p className="text-sm text-muted-foreground">
                      Determine optimal order quantities and safety stock levels
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="network" 
                    checked={selectedFeatures.includes("network")}
                    onCheckedChange={() => handleFeatureToggle("network")}
                  />
                  <div>
                    <Label htmlFor="network" className="font-medium">Network Flow Optimization</Label>
                    <p className="text-sm text-muted-foreground">
                      Optimize the flow of goods through your supply network
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="cog" 
                    checked={selectedFeatures.includes("cog")}
                    onCheckedChange={() => handleFeatureToggle("cog")}
                  />
                  <div>
                    <Label htmlFor="cog" className="font-medium">Center of Gravity Analysis</Label>
                    <p className="text-sm text-muted-foreground">
                      Find optimal facility locations based on customer demand
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="simulation" 
                    checked={selectedFeatures.includes("simulation")}
                    onCheckedChange={() => handleFeatureToggle("simulation")}
                  />
                  <div>
                    <Label htmlFor="simulation" className="font-medium">Supply Chain Simulation</Label>
                    <p className="text-sm text-muted-foreground">
                      Simulate different supply chain scenarios to evaluate performance
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
                Start Over
              </Button>
              
              <Button 
                onClick={() => {
                  if (selectedFeatures.length === 0) {
                    toast({
                      title: "No features selected",
                      description: "Please select at least one feature to implement",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  toast({
                    title: "Ready to implement",
                    description: `Selected ${selectedFeatures.length} features for implementation`,
                  });
                }}
                disabled={selectedFeatures.length === 0}
              >
                <ListChecks className="mr-2 h-4 w-4" />
                Implement Selected Features
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
