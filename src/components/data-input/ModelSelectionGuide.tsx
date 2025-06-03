
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, Building, Route, Package, BarChart3, 
  Calculator, Network, Hexagon, Clock, Target,
  HelpCircle, CheckCircle, ArrowRight
} from "lucide-react";

interface ModelInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  bestFor: string[];
  complexity: 'Basic' | 'Intermediate' | 'Advanced';
  timeToResults: string;
  dataRequirements: string[];
  businessValue: string;
  examples: string[];
}

export const ModelSelectionGuide: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const models: ModelInfo[] = [
    {
      id: 'center-of-gravity',
      name: 'Center of Gravity',
      icon: <MapPin className="h-5 w-5" />,
      description: 'Find optimal facility locations to minimize weighted transportation costs',
      bestFor: [
        'Warehouse location planning',
        'Distribution center placement', 
        'Manufacturing plant positioning',
        'Emergency response centers',
        'Retail store location analysis'
      ],
      complexity: 'Basic',
      timeToResults: '5-10 minutes',
      dataRequirements: ['Customer locations', 'Demand volumes', 'Transportation costs'],
      businessValue: 'Reduce transportation costs by 15-25%',
      examples: [
        'Amazon choosing warehouse locations',
        'McDonald\'s selecting new restaurant sites',
        'Emergency services positioning ambulances'
      ]
    },
    {
      id: 'network-optimization',
      name: 'Network Flow Optimization',
      icon: <Network className="h-5 w-5" />,
      description: 'Optimize flows through complex multi-node networks to minimize total costs',
      bestFor: [
        'Multi-tier distribution networks',
        'Supply chain flow optimization',
        'Capacity utilization improvement',
        'Cost reduction across network'
      ],
      complexity: 'Intermediate',
      timeToResults: '10-20 minutes',
      dataRequirements: ['Network topology', 'Capacities', 'Demand patterns', 'Cost structures'],
      businessValue: 'Reduce network costs by 10-20%',
      examples: [
        'Walmart optimizing distribution flows',
        'Manufacturing supply chains',
        'Telecommunications network routing'
      ]
    },
    {
      id: 'route-optimization',
      name: 'Route Optimization',
      icon: <Route className="h-5 w-5" />,
      description: 'Create optimal delivery routes considering constraints and multiple objectives',
      bestFor: [
        'Last-mile delivery optimization',
        'Fleet route planning',
        'Multi-modal transportation',
        'Dynamic routing with constraints'
      ],
      complexity: 'Intermediate',
      timeToResults: '15-30 minutes',
      dataRequirements: ['Customer locations', 'Vehicle constraints', 'Time windows', 'Driver schedules'],
      businessValue: 'Reduce delivery costs by 20-30%',
      examples: [
        'UPS package delivery routes',
        'Food delivery optimization',
        'Service technician scheduling'
      ]
    },
    {
      id: 'inventory-optimization',
      name: 'Inventory Management',
      icon: <Package className="h-5 w-5" />,
      description: 'Optimize inventory levels, safety stock, and reorder policies',
      bestFor: [
        'Multi-echelon inventory systems',
        'Safety stock optimization',
        'EOQ calculations',
        'ABC analysis and classification'
      ],
      complexity: 'Basic',
      timeToResults: '5-15 minutes',
      dataRequirements: ['Demand history', 'Lead times', 'Carrying costs', 'Service levels'],
      businessValue: 'Reduce inventory costs by 15-25%',
      examples: [
        'Retail inventory management',
        'Manufacturing parts inventory',
        'Hospital supply management'
      ]
    },
    {
      id: 'heuristic',
      name: 'Heuristic Optimization',
      icon: <Target className="h-5 w-5" />,
      description: 'Fast approximate solutions for complex problems using intelligent algorithms',
      bestFor: [
        'Large-scale problems',
        'Quick feasible solutions',
        'Real-time optimization',
        'Complex constraint handling'
      ],
      complexity: 'Advanced',
      timeToResults: '2-10 minutes',
      dataRequirements: ['Problem parameters', 'Constraints', 'Objective functions'],
      businessValue: 'Fast solutions for complex problems',
      examples: [
        'Large delivery networks',
        'Production scheduling',
        'Resource allocation'
      ]
    },
    {
      id: 'simulation',
      name: 'Simulation Modeling',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Model complex systems to understand behavior and test scenarios',
      bestFor: [
        'System behavior analysis',
        'Scenario planning',
        'Risk assessment',
        'Capacity planning'
      ],
      complexity: 'Advanced',
      timeToResults: '20-45 minutes',
      dataRequirements: ['Process flows', 'Variability parameters', 'Resource constraints'],
      businessValue: 'Identify bottlenecks and improve system performance',
      examples: [
        'Manufacturing line simulation',
        'Airport operations modeling',
        'Healthcare system analysis'
      ]
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Basic': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Model Selection Guide</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Choose the right optimization model for your specific supply chain challenge. Each model is designed for different types of problems and complexity levels.
        </p>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="comparison">Compare Models</TabsTrigger>
            <TabsTrigger value="recommendations">Get Recommendation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models.map((model) => (
                <Card 
                  key={model.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedModel === model.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {model.icon}
                    <h3 className="font-medium">{model.name}</h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {model.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getComplexityColor(model.complexity)}>
                      {model.complexity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {model.timeToResults}
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {model.businessValue}
                  </div>
                  
                  {selectedModel === model.id && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Best For:</h4>
                        <ul className="text-xs space-y-1">
                          {model.bestFor.map((item, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-1">Data Requirements:</h4>
                        <ul className="text-xs space-y-1">
                          {model.dataRequirements.map((req, index) => (
                            <li key={index} className="text-muted-foreground">• {req}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button size="sm" className="w-full">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Start with {model.name}
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="comparison">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-2 text-left">Model</th>
                    <th className="border border-gray-200 p-2 text-left">Complexity</th>
                    <th className="border border-gray-200 p-2 text-left">Time to Results</th>
                    <th className="border border-gray-200 p-2 text-left">Business Value</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map((model) => (
                    <tr key={model.id}>
                      <td className="border border-gray-200 p-2">
                        <div className="flex items-center gap-2">
                          {model.icon}
                          <span className="font-medium">{model.name}</span>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2">
                        <Badge className={getComplexityColor(model.complexity)}>
                          {model.complexity}
                        </Badge>
                      </td>
                      <td className="border border-gray-200 p-2 text-sm">
                        {model.timeToResults}
                      </td>
                      <td className="border border-gray-200 p-2 text-sm">
                        {model.businessValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <div className="space-y-4">
              <h3 className="font-medium">Find the Right Model for Your Needs</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">New to Supply Chain Optimization?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Start with simpler models to understand the basics.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Center of Gravity - Facility Location
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Inventory Management - Stock Optimization
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Complex Enterprise Networks?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use advanced models for comprehensive optimization.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Network className="h-4 w-4 mr-2" />
                      Network Optimization - End-to-End
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Simulation - Scenario Analysis
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ModelSelectionGuide;
