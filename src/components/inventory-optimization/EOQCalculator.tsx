import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calculator, Package, TrendingUp, Info, AlertCircle } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Link } from 'react-router-dom';

export interface EOQParams {
  annualDemand: number;
  orderingCost: number;
  holdingCost: number;
  unitCost: number;
  leadTime: number;
  serviceLevel: number;
  daysPerYear: number;
}

interface EOQResult {
  eoq: number;
  reorderPoint: number;
  safetyStock: number;
  orderFrequency: number;
  orderCycle: number;
  annualOrderingCost: number;
  annualHoldingCost: number;
  totalAnnualCost: number;
}

export const EOQCalculator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const [params, setParams] = useState<EOQParams>({
    annualDemand: 0,
    orderingCost: 0,
    holdingCost: 0,
    unitCost: 0,
    leadTime: 7,
    serviceLevel: 0.95,
    daysPerYear: 365
  });

  const [hasData, setHasData] = useState(false);
  const [result, setResult] = useState<EOQResult | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const firstItem = data[0];
          setParams(prev => ({
            ...prev,
            annualDemand: firstItem.annual_demand || 1000,
            orderingCost: firstItem.ordering_cost || 100,
            holdingCost: firstItem.holding_cost || 0.2,
            unitCost: firstItem.unit_cost || 50,
            leadTime: firstItem.lead_time || 7,
          }));
          setHasData(true);
        } else {
          setHasData(false);
        }
      } catch (error) {
        console.error("Error fetching initial inventory data:", error);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [user]);

  const handleInputChange = (field: keyof EOQParams, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setParams({
        ...params,
        [field]: numValue
      });
    }
  };

  const calculateEOQ = () => {
    try {
      // Standard EOQ formula (Wilson formula)
      const eoq = Math.sqrt((2 * params.annualDemand * params.orderingCost) / (params.holdingCost * params.unitCost));
      
      // Safety stock calculation using service level
      // Convert service level to Z-score (normal distribution)
      const zScore = getZScore(params.serviceLevel);
      
      // Standard deviation of lead time demand (assumed as 30% of average lead time demand for this example)
      const leadTimeDemandMean = params.annualDemand * (params.leadTime / params.daysPerYear);
      const leadTimeDemandStdDev = leadTimeDemandMean * 0.3;
      
      const safetyStock = zScore * leadTimeDemandStdDev;
      
      // Reorder point = Lead time demand + Safety stock
      const reorderPoint = leadTimeDemandMean + safetyStock;
      
      // Order frequency per year
      const orderFrequency = params.annualDemand / eoq;
      
      // Order cycle in days
      const orderCycle = params.daysPerYear / orderFrequency;
      
      // Annual ordering cost
      const annualOrderingCost = orderFrequency * params.orderingCost;
      
      // Annual holding cost
      const annualHoldingCost = (eoq / 2) * params.holdingCost * params.unitCost;
      
      // Total annual cost
      const totalAnnualCost = annualOrderingCost + annualHoldingCost;
      
      setResult({
        eoq: roundToTwo(eoq),
        reorderPoint: roundToTwo(reorderPoint),
        safetyStock: roundToTwo(safetyStock),
        orderFrequency: roundToTwo(orderFrequency),
        orderCycle: roundToTwo(orderCycle),
        annualOrderingCost: roundToTwo(annualOrderingCost),
        annualHoldingCost: roundToTwo(annualHoldingCost),
        totalAnnualCost: roundToTwo(totalAnnualCost)
      });
      
      toast({
        title: "Calculation Complete",
        description: "EOQ has been calculated successfully."
      });
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Calculation Error",
        description: "An error occurred while calculating EOQ.",
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

  if (loading) {
    return <div className="text-center p-6">Loading calculator...</div>;
  }

  if (!hasData) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Inventory Data Found</h3>
        <p className="mt-1 text-sm text-gray-500">Please add inventory items to use the EOQ calculator.</p>
        <div className="mt-6">
          <Link to="/data-input">
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Add Inventory Data
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calculator className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Economic Order Quantity (EOQ) Calculator</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Calculate the optimal order quantity that minimizes total inventory costs using the Wilson formula.
          Also computes safety stock, reorder points, and other inventory parameters.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="annualDemand">Annual Demand (units)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Total number of units demanded per year</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="annualDemand"
                type="number"
                value={params.annualDemand}
                onChange={(e) => handleInputChange('annualDemand', e.target.value)}
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="orderingCost">Ordering Cost ($)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Fixed cost incurred for placing an order</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="orderingCost"
                type="number"
                value={params.orderingCost}
                onChange={(e) => handleInputChange('orderingCost', e.target.value)}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="holdingCost">Holding Cost Rate (fraction of unit cost)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Annual holding cost as a fraction of unit cost (0.2 = 20%)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="holdingCost"
                type="number"
                value={params.holdingCost}
                onChange={(e) => handleInputChange('holdingCost', e.target.value)}
                min="0.01"
                max="1"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="unitCost">Unit Cost ($)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Cost per unit of inventory</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="unitCost"
                type="number"
                value={params.unitCost}
                onChange={(e) => handleInputChange('unitCost', e.target.value)}
                min="0.01"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="leadTime">Lead Time (days)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Time between placing an order and receiving it</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="leadTime"
                type="number"
                value={params.leadTime}
                onChange={(e) => handleInputChange('leadTime', e.target.value)}
                min="1"
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
                <Label htmlFor="daysPerYear">Days Per Year</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Number of operating days per year</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="daysPerYear"
                type="number"
                value={params.daysPerYear}
                onChange={(e) => handleInputChange('daysPerYear', e.target.value)}
                min="1"
                max="365"
              />
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={calculateEOQ} 
                className="w-full"
              >
                <Calculator className="mr-2 h-4 w-4" />
                Calculate EOQ
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {result && (
          <div className="space-y-6">
            <h3 className="text-xl font-medium flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-primary/5">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Economic Order Quantity</h4>
                <p className="text-2xl font-bold">{result.eoq} units</p>
              </Card>
              
              <Card className="p-4 bg-primary/5">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Reorder Point</h4>
                <p className="text-2xl font-bold">{result.reorderPoint} units</p>
              </Card>
              
              <Card className="p-4 bg-primary/5">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Safety Stock</h4>
                <p className="text-2xl font-bold">{result.safetyStock} units</p>
              </Card>
              
              <Card className="p-4 bg-primary/5">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Order Cycle</h4>
                <p className="text-2xl font-bold">{result.orderCycle} days</p>
              </Card>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cost Component</TableHead>
                  <TableHead className="text-right">Amount ($)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Annual Ordering Cost</TableCell>
                  <TableCell className="text-right">${result.annualOrderingCost.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Annual Holding Cost</TableCell>
                  <TableCell className="text-right">${result.annualHoldingCost.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow className="font-bold">
                  <TableCell>Total Annual Cost</TableCell>
                  <TableCell className="text-right">${result.totalAnnualCost.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
      
      <Card className="p-6 bg-muted/50">
        <div className="flex items-start space-x-3">
          <Package className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="text-lg font-medium">About EOQ Model</h3>
            <p className="text-sm text-muted-foreground mt-1">
              The Economic Order Quantity (EOQ) model, developed by Ford W. Harris in 1913, determines the optimal order 
              quantity that minimizes total inventory costs, balancing ordering costs and holding costs. This implementation 
              uses the Wilson formula and extends it with safety stock calculation based on service level requirements.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h4 className="text-sm font-medium mb-2">Mathematical Formulations:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>EOQ:</strong> √(2DS/H) where D = annual demand, S = ordering cost, H = annual holding cost per unit</li>
                <li><strong>Safety Stock:</strong> Z × σL where Z = service level factor, σL = standard deviation of lead time demand</li>
                <li><strong>Reorder Point:</strong> Average lead time demand + Safety stock</li>
                <li><strong>Total Annual Cost:</strong> (D/Q)S + (Q/2)H</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
