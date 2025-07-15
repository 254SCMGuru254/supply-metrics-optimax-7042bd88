import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  TrendingUp, 
  Package, 
  Settings, 
  FileText, 
  Download 
} from 'lucide-react';

interface AdvancedEOQCalculatorsProps {
  projectId: string;
}

interface EOQInputs {
  annualDemand: number;
  orderingCost: number;
  holdingCost: number;
  unitCost: number;
  leadTime: number;
  serviceLevel: number;
}

interface EOQResults {
  eoq: number;
  totalCost: number;
  orderingCost: number;
  holdingCost: number;
  numberOfOrders: number;
  timeBetweenOrders: number;
  safetyStock: number;
  reorderPoint: number;
}

export const AdvancedEOQCalculators: React.FC<AdvancedEOQCalculatorsProps> = ({ projectId }) => {
  const [inputs, setInputs] = useState<EOQInputs>({
    annualDemand: 1000,
    orderingCost: 50,
    holdingCost: 5,
    unitCost: 10,
    leadTime: 7,
    serviceLevel: 95
  });

  const [results, setResults] = useState<EOQResults | null>(null);

  const calculateEOQ = () => {
    const { annualDemand, orderingCost, holdingCost, unitCost, leadTime, serviceLevel } = inputs;
    
    // Basic EOQ calculation
    const eoq = Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);
    
    // Total cost calculation
    const orderingCostTotal = (annualDemand / eoq) * orderingCost;
    const holdingCostTotal = (eoq / 2) * holdingCost;
    const totalCost = orderingCostTotal + holdingCostTotal + (annualDemand * unitCost);
    
    // Additional calculations
    const numberOfOrders = annualDemand / eoq;
    const timeBetweenOrders = 365 / numberOfOrders;
    
    // Safety stock calculation (simplified)
    const zScore = serviceLevel === 95 ? 1.645 : serviceLevel === 99 ? 2.326 : 1.282;
    const leadTimeDemand = (annualDemand / 365) * leadTime;
    const leadTimeVariance = leadTimeDemand * 0.1; // Assume 10% variance
    const safetyStock = zScore * Math.sqrt(leadTimeVariance);
    const reorderPoint = leadTimeDemand + safetyStock;

    setResults({
      eoq: Math.round(eoq),
      totalCost: Math.round(totalCost),
      orderingCost: Math.round(orderingCostTotal),
      holdingCost: Math.round(holdingCostTotal),
      numberOfOrders: Math.round(numberOfOrders * 10) / 10,
      timeBetweenOrders: Math.round(timeBetweenOrders),
      safetyStock: Math.round(safetyStock),
      reorderPoint: Math.round(reorderPoint)
    });
  };

  const handleInputChange = (field: keyof EOQInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Advanced EOQ Calculators</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic-eoq" className="space-y-4">
            <TabsList>
              <TabsTrigger value="basic-eoq">Basic EOQ</TabsTrigger>
              <TabsTrigger value="quantity-discounts">Quantity Discounts</TabsTrigger>
              <TabsTrigger value="production-eoq">Production EOQ</TabsTrigger>
            </TabsList>

            <TabsContent value="basic-eoq" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Input Parameters</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="annualDemand">Annual Demand</Label>
                      <Input
                        id="annualDemand"
                        type="number"
                        value={inputs.annualDemand}
                        onChange={(e) => handleInputChange('annualDemand', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="orderingCost">Ordering Cost (KES)</Label>
                      <Input
                        id="orderingCost"
                        type="number"
                        value={inputs.orderingCost}
                        onChange={(e) => handleInputChange('orderingCost', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="holdingCost">Holding Cost (KES/unit/year)</Label>
                      <Input
                        id="holdingCost"
                        type="number"
                        value={inputs.holdingCost}
                        onChange={(e) => handleInputChange('holdingCost', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="unitCost">Unit Cost (KES)</Label>
                      <Input
                        id="unitCost"
                        type="number"
                        value={inputs.unitCost}
                        onChange={(e) => handleInputChange('unitCost', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="leadTime">Lead Time (days)</Label>
                      <Input
                        id="leadTime"
                        type="number"
                        value={inputs.leadTime}
                        onChange={(e) => handleInputChange('leadTime', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="serviceLevel">Service Level (%)</Label>
                      <Input
                        id="serviceLevel"
                        type="number"
                        value={inputs.serviceLevel}
                        onChange={(e) => handleInputChange('serviceLevel', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <Button onClick={calculateEOQ} className="w-full">
                    Calculate EOQ
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Results</h3>
                  
                  {results ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <Badge className="bg-blue-100 text-blue-800 mb-2">EOQ</Badge>
                              <p className="text-2xl font-bold">{results.eoq}</p>
                              <p className="text-sm text-muted-foreground">Units</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <Badge className="bg-green-100 text-green-800 mb-2">Total Cost</Badge>
                              <p className="text-2xl font-bold">KES {results.totalCost.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">Annual</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Number of Orders:</span>
                          <span className="font-medium">{results.numberOfOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time Between Orders:</span>
                          <span className="font-medium">{results.timeBetweenOrders} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ordering Cost:</span>
                          <span className="font-medium">KES {results.orderingCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Holding Cost:</span>
                          <span className="font-medium">KES {results.holdingCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Safety Stock:</span>
                          <span className="font-medium">{results.safetyStock} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reorder Point:</span>
                          <span className="font-medium">{results.reorderPoint} units</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Click "Calculate EOQ" to see results</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quantity-discounts">
              <Card>
                <CardHeader>
                  <CardTitle>Quantity Discount EOQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Quantity discount EOQ calculator coming soon. This will help you determine optimal order quantities when suppliers offer volume discounts.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="production-eoq">
              <Card>
                <CardHeader>
                  <CardTitle>Production EOQ (EPQ)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Economic Production Quantity calculator coming soon. This will help you determine optimal production batch sizes.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedEOQCalculators;
