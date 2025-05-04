
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OptimizationValueMetrics } from "@/components/business-value/OptimizationValueMetrics";
import { ROICalculator } from "@/components/business-value/ROICalculator";
import { BarChart3, Calculator, LineChart, TrendingUp } from "lucide-react";

const BusinessValue = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Business Value & ROI</h1>
        <p className="text-muted-foreground mt-2">
          Quantifying the impact of supply chain optimization through measurable outcomes
        </p>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Optimization Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="roi" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span>ROI Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="case-studies" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Case Studies</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="mt-6">
          <OptimizationValueMetrics />
        </TabsContent>
        
        <TabsContent value="roi" className="mt-6">
          <ROICalculator />
        </TabsContent>
        
        <TabsContent value="case-studies" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">Global Manufacturing Company</h2>
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <span>Manufacturing Industry</span>
                <span>Implementation Period: 6 months</span>
              </div>
              
              <p className="mb-4">
                A global manufacturing company with operations in 12 countries implemented our
                network optimization and inventory management solutions to address increasing
                logistics costs and inventory inefficiencies.
              </p>
              
              <div className="space-y-2">
                <h3 className="font-medium">Key Results:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>23% reduction in transportation costs</li>
                  <li>31% decrease in inventory holding costs</li>
                  <li>17% improvement in on-time delivery performance</li>
                  <li>ROI of 342% over three years</li>
                  <li>Payback period of 8.2 months</li>
                </ul>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">National Retail Chain</h2>
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <span>Retail Industry</span>
                <span>Implementation Period: 4 months</span>
              </div>
              
              <p className="mb-4">
                A retail chain with over 200 locations nationwide implemented our route optimization
                and demand forecasting solutions to improve last-mile delivery and reduce stockouts.
              </p>
              
              <div className="space-y-2">
                <h3 className="font-medium">Key Results:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>28% reduction in last-mile delivery costs</li>
                  <li>42% decrease in stockout incidents</li>
                  <li>19% improvement in vehicle utilization</li>
                  <li>ROI of 278% over three years</li>
                  <li>Payback period of 10.5 months</li>
                </ul>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">Agricultural Cooperative</h2>
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <span>Agricultural Industry</span>
                <span>Implementation Period: 5 months</span>
              </div>
              
              <p className="mb-4">
                An agricultural cooperative serving over 2,000 farmers implemented our center of
                gravity and fleet management solutions to optimize distribution center locations
                and improve fleet efficiency.
              </p>
              
              <div className="space-y-2">
                <h3 className="font-medium">Key Results:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>26% reduction in total distribution distance</li>
                  <li>34% decrease in transportation costs</li>
                  <li>22% improvement in warehouse utilization</li>
                  <li>ROI of 305% over three years</li>
                  <li>Payback period of 9.8 months</li>
                </ul>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">Pharmaceutical Distributor</h2>
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <span>Healthcare Industry</span>
                <span>Implementation Period: 7 months</span>
              </div>
              
              <p className="mb-4">
                A pharmaceutical distribution company serving hospitals and pharmacies implemented
                our network optimization and heuristic solutions to improve delivery times and
                reduce costs while maintaining strict temperature controls.
              </p>
              
              <div className="space-y-2">
                <h3 className="font-medium">Key Results:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>18% reduction in delivery times</li>
                  <li>25% decrease in distribution costs</li>
                  <li>99.8% temperature compliance (up from 98.2%)</li>
                  <li>ROI of 264% over three years</li>
                  <li>Payback period of 11.4 months</li>
                </ul>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessValue;
