
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, Package, AlertCircle } from "lucide-react";

interface EOQResult {
  optimalOrderQuantity: number;
  totalCost: number;
  orderingCost: number;
  holdingCost: number;
  ordersPerYear: number;
  cycleTime: number;
}

interface QuantityDiscountTier {
  minQuantity: number;
  unitPrice: number;
}

interface NewsvendorResult {
  optimalOrder: number;
  expectedProfit: number;
  serviceLevel: number;
  fillRate: number;
}

export const EnterpriseEOQCalculators = () => {
  const [activeTab, setActiveTab] = useState("basic-eoq");
  
  // Basic EOQ State
  const [demand, setDemand] = useState<number>(1000);
  const [setupCost, setSetupCost] = useState<number>(50);
  const [holdingCost, setHoldingCost] = useState<number>(2);
  const [unitCost, setUnitCost] = useState<number>(10);
  const [leadTime, setLeadTime] = useState<number>(7);
  const [eoqResult, setEoqResult] = useState<EOQResult | null>(null);

  // Quantity Discounts State
  const [discountTiers, setDiscountTiers] = useState<QuantityDiscountTier[]>([
    { minQuantity: 0, unitPrice: 10 },
    { minQuantity: 500, unitPrice: 9.5 },
    { minQuantity: 1000, unitPrice: 9 }
  ]);
  const [discountResult, setDiscountResult] = useState<any>(null);

  // Newsvendor Model State
  const [demandMean, setDemandMean] = useState<number>(100);
  const [demandStd, setDemandStd] = useState<number>(20);
  const [sellingPrice, setSellingPrice] = useState<number>(15);
  const [salvageValue, setSalvageValue] = useState<number>(3);
  const [newsvendorResult, setNewsvendorResult] = useState<NewsvendorResult | null>(null);

  // Base Stock Policy State
  const [demandRate, setDemandRate] = useState<number>(10);
  const [serviceLevel, setServiceLevel] = useState<number>(95);
  const [baseStockResult, setBaseStockResult] = useState<number | null>(null);

  // Calculate Basic EOQ
  const calculateEOQ = () => {
    const eoq = Math.sqrt((2 * demand * setupCost) / holdingCost);
    const ordersPerYear = demand / eoq;
    const orderingCostTotal = ordersPerYear * setupCost;
    const holdingCostTotal = (eoq / 2) * holdingCost;
    const totalCost = orderingCostTotal + holdingCostTotal + (demand * unitCost);
    const cycleTime = eoq / demand * 365;

    setEoqResult({
      optimalOrderQuantity: eoq,
      totalCost,
      orderingCost: orderingCostTotal,
      holdingCost: holdingCostTotal,
      ordersPerYear,
      cycleTime
    });
  };

  // Calculate EOQ with Quantity Discounts
  const calculateDiscountEOQ = () => {
    let bestOption = null;
    let lowestCost = Infinity;

    discountTiers.forEach(tier => {
      const eoq = Math.sqrt((2 * demand * setupCost) / (holdingCost * tier.unitPrice / unitCost));
      const orderQuantity = Math.max(eoq, tier.minQuantity);
      const ordersPerYear = demand / orderQuantity;
      const totalCost = (demand * tier.unitPrice) + (ordersPerYear * setupCost) + ((orderQuantity / 2) * holdingCost);

      if (totalCost < lowestCost) {
        lowestCost = totalCost;
        bestOption = {
          orderQuantity,
          unitPrice: tier.unitPrice,
          totalCost,
          ordersPerYear
        };
      }
    });

    setDiscountResult(bestOption);
  };

  // Calculate Newsvendor Model
  const calculateNewsvendor = () => {
    const criticalRatio = (sellingPrice - unitCost) / (sellingPrice - salvageValue);
    
    // Using normal distribution inverse CDF approximation
    const zScore = normalInverse(criticalRatio);
    const optimalOrder = demandMean + (zScore * demandStd);
    
    // Expected profit calculation
    const expectedProfit = (sellingPrice - unitCost) * demandMean - 
                          (sellingPrice - salvageValue) * demandStd * 
                          Math.exp(-0.5 * zScore * zScore) / Math.sqrt(2 * Math.PI);

    setNewsvendorResult({
      optimalOrder: Math.max(0, optimalOrder),
      expectedProfit,
      serviceLevel: criticalRatio * 100,
      fillRate: criticalRatio * 100
    });
  };

  // Calculate Base Stock Policy
  const calculateBaseStock = () => {
    const zScore = normalInverse(serviceLevel / 100);
    const leadTimeDemand = demandRate * leadTime;
    const leadTimeStd = Math.sqrt(leadTime) * demandStd;
    const baseStock = leadTimeDemand + (zScore * leadTimeStd);
    
    setBaseStockResult(baseStock);
  };

  // Normal distribution inverse CDF approximation
  const normalInverse = (p: number): number => {
    const a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969;
    const a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;
    const b1 = -54.4760987982241, b2 = 161.585836858041, b3 = -155.698979859887;
    const b4 = 66.8013118877197, b5 = -13.2806815528857, c1 = -7.78489400243029e-3;
    const c2 = -0.322396458041136, c3 = -2.40075827716184, c4 = -2.54973253934373;
    const c5 = 4.37466414146497, c6 = 2.93816398269878, d1 = 7.78469570904146e-3;
    const d2 = 0.32246712907004, d3 = 2.445134137143, d4 = 3.75440866190742;
    const p_low = 0.02425, p_high = 1 - p_low;
    let q, r;
    if ((0 < p) && (p < p_low)) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
    if ((p_low <= p) && (p <= p_high)) {
      q = p - 0.5;
      r = q * q;
      return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    }
    if ((p_high < p) && (p < 1)) {
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Enterprise Inventory Optimization Calculators</h2>
          <p className="text-muted-foreground">Complete suite of inventory management formulas and calculators</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="basic-eoq">Basic EOQ</TabsTrigger>
          <TabsTrigger value="quantity-discounts">Quantity Discounts</TabsTrigger>
          <TabsTrigger value="newsvendor">Newsvendor Model</TabsTrigger>
          <TabsTrigger value="base-stock">Base Stock Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-eoq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Economic Order Quantity (EOQ) Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="demand">Annual Demand (D)</Label>
                  <Input
                    id="demand"
                    type="number"
                    value={demand}
                    onChange={(e) => setDemand(Number(e.target.value))}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="setupCost">Setup/Ordering Cost (S)</Label>
                  <Input
                    id="setupCost"
                    type="number"
                    value={setupCost}
                    onChange={(e) => setSetupCost(Number(e.target.value))}
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label htmlFor="holdingCost">Holding Cost per Unit (H)</Label>
                  <Input
                    id="holdingCost"
                    type="number"
                    value={holdingCost}
                    onChange={(e) => setHoldingCost(Number(e.target.value))}
                    placeholder="2"
                  />
                </div>
                <div>
                  <Label htmlFor="unitCost">Unit Cost (C)</Label>
                  <Input
                    id="unitCost"
                    type="number"
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label htmlFor="leadTime">Lead Time (days)</Label>
                  <Input
                    id="leadTime"
                    type="number"
                    value={leadTime}
                    onChange={(e) => setLeadTime(Number(e.target.value))}
                    placeholder="7"
                  />
                </div>
              </div>

              <Button onClick={calculateEOQ} className="w-full">
                Calculate EOQ
              </Button>

              {eoqResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <Card className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Optimal Order Quantity</h3>
                      <p className="text-2xl font-bold text-primary">{eoqResult.optimalOrderQuantity.toFixed(0)} units</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Total Annual Cost</h3>
                      <p className="text-2xl font-bold text-green-600">KES {eoqResult.totalCost.toLocaleString()}</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Orders per Year</h3>
                      <p className="text-2xl font-bold text-blue-600">{eoqResult.ordersPerYear.toFixed(1)}</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Cycle Time</h3>
                      <p className="text-2xl font-bold text-purple-600">{eoqResult.cycleTime.toFixed(1)} days</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Ordering Cost</h3>
                      <p className="text-2xl font-bold text-orange-600">KES {eoqResult.orderingCost.toLocaleString()}</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Holding Cost</h3>
                      <p className="text-2xl font-bold text-red-600">KES {eoqResult.holdingCost.toLocaleString()}</p>
                    </div>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quantity-discounts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                EOQ with Quantity Discounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="discountDemand">Annual Demand</Label>
                  <Input
                    id="discountDemand"
                    type="number"
                    value={demand}
                    onChange={(e) => setDemand(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="discountSetup">Setup Cost</Label>
                  <Input
                    id="discountSetup"
                    type="number"
                    value={setupCost}
                    onChange={(e) => setSetupCost(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="discountHolding">Holding Cost Rate</Label>
                  <Input
                    id="discountHolding"
                    type="number"
                    value={holdingCost}
                    onChange={(e) => setHoldingCost(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Price Break Points</h3>
                {discountTiers.map((tier, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Minimum Quantity</Label>
                      <Input
                        type="number"
                        value={tier.minQuantity}
                        onChange={(e) => {
                          const newTiers = [...discountTiers];
                          newTiers[index].minQuantity = Number(e.target.value);
                          setDiscountTiers(newTiers);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Unit Price</Label>
                      <Input
                        type="number"
                        value={tier.unitPrice}
                        onChange={(e) => {
                          const newTiers = [...discountTiers];
                          newTiers[index].unitPrice = Number(e.target.value);
                          setDiscountTiers(newTiers);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={calculateDiscountEOQ} className="w-full">
                Calculate Optimal Order with Discounts
              </Button>

              {discountResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Optimal Order Quantity</h3>
                      <p className="text-2xl font-bold text-primary">{discountResult.orderQuantity.toFixed(0)} units</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Best Unit Price</h3>
                      <p className="text-2xl font-bold text-green-600">KES {discountResult.unitPrice}</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Total Annual Cost</h3>
                      <p className="text-2xl font-bold text-blue-600">KES {discountResult.totalCost.toLocaleString()}</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Orders per Year</h3>
                      <p className="text-2xl font-bold text-purple-600">{discountResult.ordersPerYear.toFixed(1)}</p>
                    </div>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsvendor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Newsvendor Model (Single-Period Inventory)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="demandMean">Mean Demand</Label>
                  <Input
                    id="demandMean"
                    type="number"
                    value={demandMean}
                    onChange={(e) => setDemandMean(Number(e.target.value))}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="demandStd">Demand Std Deviation</Label>
                  <Input
                    id="demandStd"
                    type="number"
                    value={demandStd}
                    onChange={(e) => setDemandStd(Number(e.target.value))}
                    placeholder="20"
                  />
                </div>
                <div>
                  <Label htmlFor="unitCostNews">Unit Cost</Label>
                  <Input
                    id="unitCostNews"
                    type="number"
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label htmlFor="sellingPrice">Selling Price</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    placeholder="15"
                  />
                </div>
                <div>
                  <Label htmlFor="salvageValue">Salvage Value</Label>
                  <Input
                    id="salvageValue"
                    type="number"
                    value={salvageValue}
                    onChange={(e) => setSalvageValue(Number(e.target.value))}
                    placeholder="3"
                  />
                </div>
              </div>

              <Button onClick={calculateNewsvendor} className="w-full">
                Calculate Optimal Order (Newsvendor)
              </Button>

              {newsvendorResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Optimal Order Quantity</h3>
                      <p className="text-2xl font-bold text-primary">{newsvendorResult.optimalOrder.toFixed(0)} units</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Expected Profit</h3>
                      <p className="text-2xl font-bold text-green-600">KES {newsvendorResult.expectedProfit.toFixed(2)}</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Service Level</h3>
                      <p className="text-2xl font-bold text-blue-600">{newsvendorResult.serviceLevel.toFixed(1)}%</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Fill Rate</h3>
                      <p className="text-2xl font-bold text-purple-600">{newsvendorResult.fillRate.toFixed(1)}%</p>
                    </div>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="base-stock" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Base Stock Policy Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="demandRateBase">Daily Demand Rate</Label>
                  <Input
                    id="demandRateBase"
                    type="number"
                    value={demandRate}
                    onChange={(e) => setDemandRate(Number(e.target.value))}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label htmlFor="leadTimeBase">Lead Time (days)</Label>
                  <Input
                    id="leadTimeBase"
                    type="number"
                    value={leadTime}
                    onChange={(e) => setLeadTime(Number(e.target.value))}
                    placeholder="7"
                  />
                </div>
                <div>
                  <Label htmlFor="serviceLevelBase">Target Service Level (%)</Label>
                  <Input
                    id="serviceLevelBase"
                    type="number"
                    value={serviceLevel}
                    onChange={(e) => setServiceLevel(Number(e.target.value))}
                    placeholder="95"
                  />
                </div>
              </div>

              <Button onClick={calculateBaseStock} className="w-full">
                Calculate Base Stock Level
              </Button>

              {baseStockResult !== null && (
                <Card className="p-6 mt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Base Stock Level</h3>
                    <p className="text-3xl font-bold text-primary">{baseStockResult.toFixed(0)} units</p>
                    <Badge variant="outline" className="mt-2">
                      {serviceLevel}% Service Level
                    </Badge>
                  </div>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
