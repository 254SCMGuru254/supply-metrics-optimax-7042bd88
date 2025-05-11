
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Info } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

interface SafetyStockParams {
  averageDemand: number;
  demandStdDev: number;
  averageLeadTime: number;
  leadTimeStdDev: number;
  serviceLevel: number;
  reviewPeriod: number;
}

interface SafetyStockResult {
  safetyStock: number;
  reorderPoint: number;
  stockoutProbability: number;
  fillRate: number;
  cycleServiceLevel: number;
}

export const SafetyStockCalculator = () => {
  const { toast } = useToast();
  
  const [params, setParams] = useState<SafetyStockParams>({
    averageDemand: 100,
    demandStdDev: 20,
    averageLeadTime: 7,
    leadTimeStdDev: 2,
    serviceLevel: 0.95,
    reviewPeriod: 14
  });
  
  const [result, setResult] = useState<SafetyStockResult | null>(null);

  const handleInputChange = (field: keyof SafetyStockParams, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setParams({
        ...params,
        [field]: numValue
      });
    }
  };

  const calculateSafetyStock = () => {
    try {
      // Convert service level to Z-score (normal distribution)
      const zScore = getZScore(params.serviceLevel);
      
      // Calculate demand during lead time standard deviation
      const demandDuringLeadTimeStdDev = Math.sqrt(
        Math.pow(params.averageDemand, 2) * Math.pow(params.leadTimeStdDev, 2) +
        Math.pow(params.averageLeadTime, 2) * Math.pow(params.demandStdDev, 2)
      );
      
      // Calculate safety stock using the formula
      const safetyStock = zScore * demandDuringLeadTimeStdDev;
      
      // Calculate reorder point
      const reorderPoint = params.averageDemand * params.averageLeadTime + safetyStock;
      
      // Calculate stockout probability
      const stockoutProbability = 1 - params.serviceLevel;
      
      // Calculate fill rate (approximate)
      const fillRate = 1 - (stockoutProbability * demandDuringLeadTimeStdDev) / (params.averageDemand * params.averageLeadTime);
      
      // Calculate cycle service level
      const cycleServiceLevel = params.serviceLevel;
      
      setResult({
        safetyStock: roundToTwo(safetyStock),
        reorderPoint: roundToTwo(reorderPoint),
        stockoutProbability: roundToTwo(stockoutProbability * 100),
        fillRate: roundToTwo(fillRate * 100),
        cycleServiceLevel: roundToTwo(cycleServiceLevel * 100)
      });
      
      toast({
        title: "Calculation Complete",
        description: "Safety Stock has been calculated successfully."
      });
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Calculation Error",
        description: "An error occurred while calculating Safety Stock.",
        variant: "destructive"
      });
    }
  };

  // Helper function to get Z-score from service level
  const getZScore = (serviceLevel: number): number => {
    // This is a simplified approximation
    if (serviceLevel >= 0.99) return 2.33;
    if (serviceLevel >= 0.98) return 2.05;
    if (serviceLevel >= 0.97) return 1.88;
    if (serviceLevel >= 0.96) return 1.75;
    if (serviceLevel >= 0.95) return 1.65;
    if (serviceLevel >= 0.94) return 1.56;
    if (serviceLevel >= 0.93) return 1.48;
    if (serviceLevel >= 0.92) return 1.41;
    if (serviceLevel >= 0.91) return 1.34;
    if (serviceLevel >= 0.90) return 1.28;
    if (serviceLevel >= 0.85) return 1.04;
    if (serviceLevel >= 0.80) return 0.84;
    if (serviceLevel >= 0.75) return 0.67;
    if (serviceLevel >= 0.70) return 0.52;
    return 0.25; // Default for lower service levels
  };

  // Helper function to round to two decimal places
  const roundToTwo = (num: number): number => {
    return Math.round(num * 100) / 100;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Safety Stock Calculator</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Calculate the optimal safety stock level to protect against variability in demand and supply lead time.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="averageDemand">Average Daily Demand (units)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Average number of units demanded per day</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="averageDemand"
                type="number"
                value={params.averageDemand}
                onChange={(e) => handleInputChange('averageDemand', e.target.value)}
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="demandStdDev">Demand Standard Deviation</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Standard deviation of daily demand</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="demandStdDev"
                type="number"
                value={params.demandStdDev}
                onChange={(e) => handleInputChange('demandStdDev', e.target.value)}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="averageLeadTime">Average Lead Time (days)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Average time between placing an order and receiving it</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="averageLeadTime"
                type="number"
                value={params.averageLeadTime}
                onChange={(e) => handleInputChange('averageLeadTime', e.target.value)}
                min="1"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="leadTimeStdDev">Lead Time Standard Deviation</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Standard deviation of lead time</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="leadTimeStdDev"
                type="number"
                value={params.leadTimeStdDev}
                onChange={(e) => handleInputChange('leadTimeStdDev', e.target.value)}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="serviceLevel">Service Level (0-1)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Probability of not stockout during lead time (0.95 = 95%)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="serviceLevel"
                type="number"
                value={params.serviceLevel}
                onChange={(e) => handleInputChange('serviceLevel', e.target.value)}
                min="0.5"
                max="0.999"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="reviewPeriod">Review Period (days)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Time between inventory reviews</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="reviewPeriod"
                type="number"
                value={params.reviewPeriod}
                onChange={(e) => handleInputChange('reviewPeriod', e.target.value)}
                min="1"
              />
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={calculateSafetyStock} 
                className="w-full"
              >
                <Shield className="mr-2 h-4 w-4" />
                Calculate Safety Stock
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {result && (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4 bg-primary/5">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Safety Stock</h4>
                <p className="text-2xl font-bold">{result.safetyStock} units</p>
              </Card>
              
              <Card className="p-4 bg-primary/5">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Reorder Point</h4>
                <p className="text-2xl font-bold">{result.reorderPoint} units</p>
              </Card>
              
              <Card className="p-4 bg-primary/5">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Fill Rate</h4>
                <p className="text-2xl font-bold">{result.fillRate}%</p>
              </Card>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Performance Metric</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Stockout Probability</TableCell>
                  <TableCell className="text-right">{result.stockoutProbability}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cycle Service Level</TableCell>
                  <TableCell className="text-right">{result.cycleServiceLevel}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fill Rate</TableCell>
                  <TableCell className="text-right">{result.fillRate}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
      
      <Card className="p-6 bg-muted/50">
        <div className="flex items-start space-x-3">
          <Shield className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="text-lg font-medium">About Safety Stock</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Safety stock is the additional inventory maintained to mitigate the risk of stockouts due to 
              uncertainties in demand and supply lead times. This calculator uses a statistical approach based 
              on service level requirements to determine optimal safety stock levels.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h4 className="text-sm font-medium mb-2">Formulas Used:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>Safety Stock:</strong> Z × σLTD where Z = service level factor, σLTD = standard deviation of lead time demand</li>
                <li><strong>Lead Time Demand Std Dev:</strong> √(L̄ × σ²D + D̄² × σ²L) where L̄ = avg lead time, D̄ = avg demand, σD = demand std dev, σL = lead time std dev</li>
                <li><strong>Reorder Point:</strong> D̄ × L̄ + Safety Stock</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
