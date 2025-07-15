
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Calculator, 
  Settings, 
  BarChart3, 
  Code, 
  ArrowRight,
  HelpCircle,
  FileText,
  Lightbulb,
  Activity
} from 'lucide-react';

const Documentation = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2 text-foreground">
          <BookOpen className="h-10 w-10" />
          Documentation & Resources
        </h1>
        <p className="text-muted-foreground">
          Explore our comprehensive guides and resources to optimize your supply chain
        </p>
      </div>

      <Tabs defaultValue="getting-started" className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <TabsTrigger value="getting-started" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Getting Started
          </TabsTrigger>
          <TabsTrigger value="formulas" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Key Formulas
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics & Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <HelpCircle className="h-5 w-5" />
                Introduction to Supply Chain Optimization
              </CardTitle>
              <CardDescription>
                Learn the basics of supply chain management and optimization techniques.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Supply chain optimization is the process of improving the efficiency and effectiveness of a supply chain by
                reducing costs, improving service levels, and minimizing risks.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Demand Forecasting:</strong> Predicting future demand to optimize inventory levels.</li>
                <li><strong>Inventory Management:</strong> Balancing inventory costs with service level targets.</li>
                <li><strong>Route Optimization:</strong> Finding the most efficient routes for transportation.</li>
                <li><strong>Network Design:</strong> Designing the optimal network of facilities and transportation links.</li>
              </ul>
              <Button variant="link" className="pl-0">
                Read More <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Calculator className="h-5 w-5" />
                Key Supply Chain Formulas
              </CardTitle>
              <CardDescription>
                Essential formulas for supply chain analysis and optimization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Economic Order Quantity (EOQ)</h4>
                  <p className="text-sm text-muted-foreground">
                    EOQ = √(2DS / H), where D is annual demand, S is order cost, and H is holding cost.
                  </p>
                  <Badge variant="secondary">
                    <Code className="h-3 w-3 mr-1" />
                    Formula
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Safety Stock Calculation</h4>
                  <p className="text-sm text-muted-foreground">
                    Safety Stock = Z * σLT * √T, where Z is service level, σLT is lead time standard deviation, and T is review
                    period.
                  </p>
                  <Badge variant="secondary">
                    <Code className="h-3 w-3 mr-1" />
                    Formula
                  </Badge>
                </div>
              </div>
              <Button variant="link" className="pl-0">
                Explore All Formulas <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BarChart3 className="h-5 w-5" />
                Analytics and Performance Metrics
              </CardTitle>
              <CardDescription>
                Key performance indicators (KPIs) for supply chain management.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Inventory Turnover Ratio</h4>
                  <p className="text-sm text-muted-foreground">
                    Measures how many times inventory is sold and replaced over a period.
                  </p>
                  <Badge variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Analytics
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Order Fill Rate</h4>
                  <p className="text-sm text-muted-foreground">
                    Percentage of orders fulfilled completely on the first attempt.
                  </p>
                  <Badge variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Metrics
                  </Badge>
                </div>
              </div>
              <Button variant="link" className="pl-0">
                View Detailed Analytics <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
