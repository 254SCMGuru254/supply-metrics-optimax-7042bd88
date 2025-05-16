
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";

interface ROICalculatorProps {
  selectedModel: string;
}

export const ROICalculator = ({ selectedModel }: ROICalculatorProps) => {
  // Investment inputs
  const [initialInvestment, setInitialInvestment] = useState(25000);
  const [ongoingCostPercentage, setOngoingCostPercentage] = useState(15);
  const [implementationMonths, setImplementationMonths] = useState(3);
  
  // Benefit inputs
  const [annualBenefit, setAnnualBenefit] = useState(100000);
  const [benefitRampupPercentage, setBenefitRampupPercentage] = useState(20);
  
  // Calculated values
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [cumulativeROI, setCumulativeROI] = useState(0);
  const [breakEvenMonth, setBreakEvenMonth] = useState(0);
  const [fiveYearROI, setFiveYearROI] = useState(0);
  
  // Get model specific default values
  useEffect(() => {
    switch(selectedModel) {
      case 'route-optimization':
        setInitialInvestment(30000);
        setOngoingCostPercentage(20);
        setImplementationMonths(3);
        setAnnualBenefit(120000);
        setBenefitRampupPercentage(25);
        break;
      case 'inventory-management':
        setInitialInvestment(25000);
        setOngoingCostPercentage(15);
        setImplementationMonths(2);
        setAnnualBenefit(150000);
        setBenefitRampupPercentage(35);
        break;
      case 'network-optimization':
        setInitialInvestment(80000);
        setOngoingCostPercentage(10);
        setImplementationMonths(6);
        setAnnualBenefit(250000);
        setBenefitRampupPercentage(10);
        break;
      case 'center-of-gravity':
        setInitialInvestment(15000);
        setOngoingCostPercentage(5);
        setImplementationMonths(1);
        setAnnualBenefit(80000);
        setBenefitRampupPercentage(50);
        break;
      case 'heuristic':
        setInitialInvestment(45000);
        setOngoingCostPercentage(25);
        setImplementationMonths(4);
        setAnnualBenefit(175000);
        setBenefitRampupPercentage(20);
        break;
      default:
        break;
    }
  }, [selectedModel]);
  
  // Calculate ROI when inputs change
  useEffect(() => {
    calculateROI();
  }, [initialInvestment, ongoingCostPercentage, implementationMonths, annualBenefit, benefitRampupPercentage]);
  
  const calculateROI = () => {
    const monthlyBenefit = annualBenefit / 12;
    const monthlyOngoingCost = (initialInvestment * (ongoingCostPercentage / 100)) / 12;
    
    let cumulativeCost = initialInvestment;
    let cumulativeBenefit = 0;
    let breakEvenReached = false;
    let breakEvenMonth = 0;
    
    // Calculate for 5 years (60 months)
    const data = [];
    
    for (let month = 1; month <= 60; month++) {
      // No benefits during implementation
      let monthlyBenefitActual = month <= implementationMonths ? 0 : monthlyBenefit;
      
      // Apply ramp-up factor for benefits
      if (month > implementationMonths && month <= implementationMonths + 12) {
        const rampupMonths = month - implementationMonths;
        const rampupFactor = Math.min(benefitRampupPercentage * rampupMonths / 100, 1);
        monthlyBenefitActual *= rampupFactor;
      }
      
      cumulativeCost += monthlyOngoingCost;
      cumulativeBenefit += monthlyBenefitActual;
      
      const netValue = cumulativeBenefit - cumulativeCost;
      const roi = cumulativeBenefit > 0 ? (netValue / cumulativeCost) * 100 : -100;
      
      // Check for break-even point
      if (!breakEvenReached && netValue >= 0) {
        breakEvenReached = true;
        breakEvenMonth = month;
      }
      
      data.push({
        month,
        cumulativeCost: Math.round(cumulativeCost),
        cumulativeBenefit: Math.round(cumulativeBenefit),
        netValue: Math.round(netValue),
        roi: Math.round(roi * 10) / 10
      });
    }
    
    setMonthlyData(data);
    setCumulativeROI(data[data.length - 1].roi);
    setFiveYearROI(data[data.length - 1].roi);
    setBreakEvenMonth(breakEvenMonth);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Investment Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="initialInvestment">Initial Investment (USD)</Label>
                <span className="text-sm text-muted-foreground">${initialInvestment.toLocaleString()}</span>
              </div>
              <Input
                id="initialInvestment"
                type="number"
                value={initialInvestment}
                onChange={e => setInitialInvestment(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="ongoingCost">Annual Ongoing Cost (% of Initial)</Label>
                <span className="text-sm text-muted-foreground">{ongoingCostPercentage}%</span>
              </div>
              <Slider 
                id="ongoingCost"
                min={0} 
                max={50}
                step={1}
                value={[ongoingCostPercentage]}
                onValueChange={(vals) => setOngoingCostPercentage(vals[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="implementationTime">Implementation Time (months)</Label>
                <span className="text-sm text-muted-foreground">{implementationMonths}</span>
              </div>
              <Slider 
                id="implementationTime"
                min={1} 
                max={12}
                step={1}
                value={[implementationMonths]}
                onValueChange={(vals) => setImplementationMonths(vals[0])}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Benefit Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="annualBenefit">Annual Benefit (USD)</Label>
                <span className="text-sm text-muted-foreground">${annualBenefit.toLocaleString()}</span>
              </div>
              <Input
                id="annualBenefit"
                type="number"
                value={annualBenefit}
                onChange={e => setAnnualBenefit(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="benefitRampup">Monthly Benefit Ramp-up (%)</Label>
                <span className="text-sm text-muted-foreground">{benefitRampupPercentage}%</span>
              </div>
              <Slider 
                id="benefitRampup"
                min={5} 
                max={100}
                step={5}
                value={[benefitRampupPercentage]}
                onValueChange={(vals) => setBenefitRampupPercentage(vals[0])}
              />
              <p className="text-xs text-muted-foreground">
                How quickly benefits ramp up after implementation (higher = faster)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>ROI Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-primary/10 p-4 rounded-md text-center">
              <p className="text-sm font-medium">5-Year ROI</p>
              <p className="text-2xl font-bold text-primary">{fiveYearROI.toFixed(1)}%</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-md text-center">
              <p className="text-sm font-medium">Break-even Point</p>
              <p className="text-2xl font-bold text-primary">
                {breakEvenMonth > 0 ? `${breakEvenMonth} months` : "N/A"}
              </p>
            </div>
            <div className="bg-primary/10 p-4 rounded-md text-center">
              <p className="text-sm font-medium">Net 5-Year Value</p>
              <p className="text-2xl font-bold text-primary">
                ${monthlyData.length > 0 ? Math.round(monthlyData[monthlyData.length - 1].netValue).toLocaleString() : 0}
              </p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData.filter((_, idx) => idx % 3 === 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                label={{ value: "Month", position: "insideBottomRight", offset: -5 }}
                tickFormatter={(val) => (val % 12 === 0) ? val.toString() : ''}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => ['$' + value.toLocaleString(), '']}
                labelFormatter={(label) => `Month ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cumulativeCost" 
                name="Cumulative Cost" 
                stroke="#ef4444" 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="cumulativeBenefit" 
                name="Cumulative Benefit" 
                stroke="#10b981" 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="netValue" 
                name="Net Value" 
                stroke="#3b82f6" 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={calculateROI} variant="outline">Recalculate</Button>
          <ExportPdfButton
            networkName={selectedModel}
            optimizationType="ROI Analysis"
            results={{
              initialInvestment,
              ongoingCostPercentage,
              implementationMonths,
              annualBenefit,
              benefitRampupPercentage,
              fiveYearROI,
              breakEvenMonth,
              netValue: monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].netValue : 0
            }}
            fileName={`${selectedModel}-roi-analysis`}
            isOptimized={true}
          />
        </CardFooter>
      </Card>
    </div>
  );
};
