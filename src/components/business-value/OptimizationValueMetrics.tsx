
import { useState } from 'react';
import { ModelValueMetrics } from './ModelValueMetrics';
import { BusinessImpactDashboard } from './BusinessImpactDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Lightbulb } from "lucide-react";

interface OptimizationValueMetricsProps {
  selectedModel: string;
}

export const OptimizationValueMetrics = ({ selectedModel }: OptimizationValueMetricsProps) => {
  const [activeTab, setActiveTab] = useState<string>("metrics");

  // Map model types to value metrics props
  const getModelType = () => {
    switch (selectedModel) {
      case "route-optimization":
        return 'route-optimization' as const;
      case "inventory-management":
        return 'inventory-management' as const;
      case "network-optimization":
        return 'network-optimization' as const;
      case "center-of-gravity":
        return 'center-of-gravity' as const;
      case "heuristic":
        return 'heuristic' as const;
      default:
        return 'route-optimization' as const;
    }
  };

  // Model-specific case studies
  const getCaseStudies = () => {
    switch (selectedModel) {
      case "route-optimization":
        return [
          {
            company: "East African Logistics Ltd.",
            industry: "Distribution",
            challenge: "High fuel costs and inefficient delivery routes",
            solution: "Implemented route optimization with real-time traffic data",
            results: "22% reduction in fuel costs, 18% increase in deliveries per vehicle"
          },
          {
            company: "Nairobi Fresh Produce",
            industry: "Food & Beverage",
            challenge: "Time-sensitive deliveries with product spoilage risk",
            solution: "Multi-stop route optimization with time windows",
            results: "Reduced delivery time by 25%, decreased product loss by 15%"
          }
        ];
      case "inventory-management":
        return [
          {
            company: "Kenya Pharmaceuticals",
            industry: "Healthcare",
            challenge: "High stockout rates and excess safety stock",
            solution: "Implemented multi-echelon inventory optimization",
            results: "Reduced inventory by 24% while improving service levels to 98.5%"
          },
          {
            company: "Mombasa Retail Group",
            industry: "Retail",
            challenge: "Inconsistent inventory across multiple locations",
            solution: "ABC analysis and stock level optimization",
            results: "Working capital reduction of 30%, stockouts decreased by 65%"
          }
        ];
      case "network-optimization":
        return [
          {
            company: "Pan-African Manufacturers",
            industry: "Manufacturing",
            challenge: "Inefficient distribution network with high costs",
            solution: "Complete network redesign with optimal facility locations",
            results: "28% reduction in distribution costs, 35% improvement in delivery times"
          },
          {
            company: "Uganda Coffee Exporters",
            industry: "Agriculture",
            challenge: "Complex supply chain from farms to port",
            solution: "Hub-and-spoke network optimization",
            results: "Reduced transportation costs by 22%, transit time by 40%"
          }
        ];
      case "center-of-gravity":
        return [
          {
            company: "Tanzania Consumer Goods",
            industry: "Consumer Packaged Goods",
            challenge: "Sub-optimal warehouse location causing high logistics costs",
            solution: "Center of gravity analysis for new distribution center",
            results: "32% reduction in distribution costs, 45% improvement in service radius"
          },
          {
            company: "Nairobi Electronics",
            industry: "Electronics",
            challenge: "Rapid customer base expansion requiring new facilities",
            solution: "Weighted COG analysis with projected demand growth",
            results: "New facility reduced last-mile costs by 28%, improved delivery times by 35%"
          }
        ];
      case "heuristic":
        return [
          {
            company: "Rwanda Mining Corporation",
            industry: "Mining",
            challenge: "Complex constraints in supply routing with multiple modes",
            solution: "Implemented simulated annealing algorithm for route planning",
            results: "Reduced planning time from days to hours, 19% cost savings"
          },
          {
            company: "East African Airways",
            industry: "Aviation",
            challenge: "Complex crew scheduling with regulatory constraints",
            solution: "Tabu search algorithm for crew pairing optimization",
            results: "15% reduction in crew costs, improved crew satisfaction metrics"
          }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Business Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="implementation" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Implementation</span>
          </TabsTrigger>
          <TabsTrigger value="case-studies" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span>Case Studies</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="pt-6">
          <ModelValueMetrics modelType={getModelType()} showDescription={true} />
        </TabsContent>
        
        <TabsContent value="implementation" className="pt-6">
          <BusinessImpactDashboard selectedModel={selectedModel} />
        </TabsContent>
        
        <TabsContent value="case-studies" className="pt-6 space-y-4">
          <h2 className="text-xl font-bold">East African Success Stories</h2>
          <p className="text-muted-foreground">Real-world examples of successful implementations in Kenya and neighboring countries</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {getCaseStudies().map((study, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{study.company}</h3>
                  <span className="bg-muted text-xs px-2 py-1 rounded-full">{study.industry}</span>
                </div>
                <div className="mt-4 space-y-2">
                  <div>
                    <p className="text-sm font-medium">Challenge:</p>
                    <p className="text-sm text-muted-foreground">{study.challenge}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Solution:</p>
                    <p className="text-sm text-muted-foreground">{study.solution}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Results:</p>
                    <p className="text-sm text-muted-foreground">{study.results}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
