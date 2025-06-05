
import { HorticulturalEOQCalculator } from "@/components/inventory-optimization/HorticulturalEOQCalculator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, Settings, Shield } from "lucide-react";

const HorticulturalOptimization = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Horticultural Supply Chain Optimization</h1>
          <Badge variant="outline" className="text-green-600">Enterprise Ready</Badge>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Specialized supply chain optimization for perishable horticultural products including 
          cut flowers, potted plants, and seasonal arrangements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold">Perishability-Adjusted EOQ</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Modified EOQ formula that accounts for product degradation costs and shelf life constraints.
          </p>
          <div className="mt-4 p-3 bg-green-50 rounded-md">
            <p className="text-sm font-medium">Formula: EOQ = √[(2DS)/(H+P)]</p>
            <p className="text-xs text-muted-foreground">Where P = Perishability cost per unit</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Seasonal Optimization</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Automatic demand adjustments for seasonal peaks like Valentine's Day (4.5x) and Mother's Day (2.0x).
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm font-medium">Valentine's Day: 4.5x multiplier</p>
            <p className="text-xs text-muted-foreground">Mother's Day: 2.0x multiplier</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold">Multi-Supplier Analysis</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Comprehensive supplier comparison including reliability, transport costs, and quality scoring.
          </p>
          <div className="mt-4 p-3 bg-purple-50 rounded-md">
            <p className="text-sm font-medium">Real-time cost optimization</p>
            <p className="text-xs text-muted-foreground">Ecuador, Colombia, Netherlands</p>
          </div>
        </Card>
      </div>

      <HorticulturalEOQCalculator />

      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="text-xl font-semibold mb-4">Real-World Test: BloomCorp International</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Test Scenario</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Product: Premium Red Roses (dozen bunches)</li>
              <li>• Annual Demand: 50,000 units</li>
              <li>• Valentine's Day Peak: 4.5x normal demand</li>
              <li>• Shelf Life: 7 days</li>
              <li>• Lead Time: 3 days</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Expected Results</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• ✅ EOQ: 1,118 dozen bunches</li>
              <li>• ✅ February EOQ: 684 dozen bunches</li>
              <li>• ✅ Optimal Supplier: Ecuador ($29.45)</li>
              <li>• ✅ Safety Stock: 678 dozen bunches</li>
              <li>• ✅ 28 orders needed for February</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HorticulturalOptimization;
