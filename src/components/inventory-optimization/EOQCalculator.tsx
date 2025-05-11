
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calculator } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EOQResult {
  eoq: number;
  annualOrderingCost: number;
  annualHoldingCost: number;
  totalCost: number;
  orderCycleTime: number;
  ordersPerYear: number;
}

export const EOQCalculator = () => {
  const [annualDemand, setAnnualDemand] = useState<number>(1000);
  const [orderingCost, setOrderingCost] = useState<number>(50);
  const [holdingCost, setHoldingCost] = useState<number>(5);
  const [unitCost, setUnitCost] = useState<number>(100);
  const [holdingCostType, setHoldingCostType] = useState<'percentage' | 'absolute'>('percentage');
  const [leadTime, setLeadTime] = useState<number>(7);
  const [serviceLevel, setServiceLevel] = useState<number>(95);
  const [result, setResult] = useState<EOQResult | null>(null);
  const { toast } = useToast();

  // Calculate holding cost based on type
  const calculateEffectiveHoldingCost = (): number => {
    if (holdingCostType === 'percentage') {
      return (holdingCost / 100) * unitCost; // Convert percentage to absolute value
    }
    return holdingCost; // Already an absolute value
  };

  // Calculate Economic Order Quantity
  const calculateEOQ = () => {
    try {
      const effectiveHoldingCost = calculateEffectiveHoldingCost();
      
      if (annualDemand <= 0 || orderingCost <= 0 || effectiveHoldingCost <= 0) {
        throw new Error("Input values must be greater than zero");
      }

      // EOQ formula: sqrt(2 * D * S / H)
      // Where D is annual demand, S is ordering cost, H is holding cost
      const eoq = Math.sqrt((2 * annualDemand * orderingCost) / effectiveHoldingCost);
      
      // Number of orders per year = Annual demand / EOQ
      const ordersPerYear = annualDemand / eoq;
      
      // Order cycle time in days = Working days per year / Orders per year
      const orderCycleTime = 365 / ordersPerYear;
      
      // Annual ordering cost = Number of orders per year * Ordering cost
      const annualOrderingCost = ordersPerYear * orderingCost;
      
      // Annual holding cost = Average inventory * Holding cost
      // Average inventory = EOQ / 2
      const annualHoldingCost = (eoq / 2) * effectiveHoldingCost;
      
      // Total annual inventory cost = Annual ordering cost + Annual holding cost
      const totalCost = annualOrderingCost + annualHoldingCost;

      setResult({
        eoq: parseFloat(eoq.toFixed(2)),
        annualOrderingCost: parseFloat(annualOrderingCost.toFixed(2)),
        annualHoldingCost: parseFloat(annualHoldingCost.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2)),
        orderCycleTime: parseFloat(orderCycleTime.toFixed(2)),
        ordersPerYear: parseFloat(ordersPerYear.toFixed(2))
      });

      toast({
        title: "EOQ Calculation Complete",
        description: `The optimal order quantity is ${eoq.toFixed(2)} units.`,
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: error instanceof Error ? error.message : "An error occurred during calculation",
        variant: "destructive"
      });
    }
  };

  // Calculate reorder point
  const calculateReorderPoint = (): number => {
    if (!leadTime || !annualDemand) return 0;
    
    // Daily demand = Annual demand / 365
    const dailyDemand = annualDemand / 365;
    
    // Safety stock calculation using service level
    // For service level, we use the Z-score from normal distribution
    // Common Z-scores: 95% = 1.645, 98% = 2.05, 99% = 2.33
    let zScore = 1.645; // Default for 95%
    if (serviceLevel >= 98) zScore = 2.05;
    if (serviceLevel >= 99) zScore = 2.33;
    
    // Standard deviation of daily demand (assuming 20% of daily demand for demonstration)
    const stdDailyDemand = dailyDemand * 0.2;
    
    // Safety stock = Z-score * Standard deviation of lead time demand
    // Lead time demand standard deviation = sqrt(lead time) * daily demand standard deviation
    const safetyStock = zScore * Math.sqrt(leadTime) * stdDailyDemand;
    
    // Reorder point = Average demand during lead time + Safety stock
    const reorderPoint = (dailyDemand * leadTime) + safetyStock;
    
    return parseFloat(reorderPoint.toFixed(2));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold">Economic Order Quantity (EOQ) Calculator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="annual-demand">Annual Demand (units/year)</Label>
            <Input
              id="annual-demand"
              type="number"
              value={annualDemand}
              onChange={(e) => setAnnualDemand(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Total quantity demanded per year
            </p>
          </div>

          <div>
            <Label htmlFor="ordering-cost">Ordering Cost ($/order)</Label>
            <Input
              id="ordering-cost"
              type="number"
              value={orderingCost}
              onChange={(e) => setOrderingCost(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Cost to place an order (shipping, handling, admin)
            </p>
          </div>

          <div>
            <Label htmlFor="unit-cost">Unit Cost ($/unit)</Label>
            <Input
              id="unit-cost"
              type="number"
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Cost per unit of inventory
            </p>
          </div>

          <div>
            <Label htmlFor="holding-cost">Holding Cost</Label>
            <div className="flex gap-4">
              <Input
                id="holding-cost"
                type="number"
                value={holdingCost}
                onChange={(e) => setHoldingCost(Number(e.target.value))}
                className="flex-1"
              />
              <RadioGroup
                value={holdingCostType}
                onValueChange={(val) => setHoldingCostType(val as 'percentage' | 'absolute')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage">%</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="absolute" id="absolute" />
                  <Label htmlFor="absolute">$/unit</Label>
                </div>
              </RadioGroup>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {holdingCostType === 'percentage' 
                ? 'Holding cost as a percentage of unit cost' 
                : 'Absolute holding cost per unit per year'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="lead-time">Lead Time (days)</Label>
            <Input
              id="lead-time"
              type="number"
              value={leadTime}
              onChange={(e) => setLeadTime(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Time from order placement to receipt
            </p>
          </div>

          <div>
            <Label htmlFor="service-level">Service Level (%)</Label>
            <Input
              id="service-level"
              type="number"
              min="0"
              max="100"
              value={serviceLevel}
              onChange={(e) => setServiceLevel(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Target probability of not stocking out
            </p>
          </div>

          <Button onClick={calculateEOQ} className="w-full mt-6">Calculate EOQ</Button>

          {result && (
            <div className="mt-6 space-y-4 p-4 bg-muted rounded-md">
              <h4 className="font-semibold">EOQ Model Results:</h4>
              <div className="grid grid-cols-2 gap-y-2">
                <div>Optimal Order Quantity:</div>
                <div className="font-semibold text-right">{result.eoq} units</div>
                
                <div>Reorder Point:</div>
                <div className="font-semibold text-right">{calculateReorderPoint()} units</div>
                
                <div>Orders Per Year:</div>
                <div className="font-semibold text-right">{result.ordersPerYear}</div>
                
                <div>Order Cycle Time:</div>
                <div className="font-semibold text-right">{result.orderCycleTime} days</div>
                
                <div>Annual Ordering Cost:</div>
                <div className="font-semibold text-right">${result.annualOrderingCost}</div>
                
                <div>Annual Holding Cost:</div>
                <div className="font-semibold text-right">${result.annualHoldingCost}</div>
                
                <div>Total Annual Cost:</div>
                <div className="font-semibold text-right">${result.totalCost}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-md">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">About the EOQ Model</h4>
        <p className="text-sm text-muted-foreground">
          The Economic Order Quantity (EOQ) model determines the optimal order quantity that minimizes total inventory costs, 
          balancing ordering costs and holding costs. The model was developed by Ford W. Harris in 1913 and has been a 
          foundational tool in inventory management. The formula used is: EOQ = √(2DS/H) where D is annual demand, 
          S is ordering cost, and H is holding cost per unit per year.
        </p>
      </div>
    </Card>
  );
};
