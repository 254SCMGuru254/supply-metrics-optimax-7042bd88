
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const ROICalculator = () => {
  const [annualSpend, setAnnualSpend] = useState(1000000);
  const [implementationCost, setImplementationCost] = useState(125000);
  const [expectedSavings, setExpectedSavings] = useState(22);
  const [timeframe, setTimeframe] = useState(36);

  // Calculate ROI metrics
  const monthlySpend = annualSpend / 12;
  const monthlySavings = (monthlySpend * expectedSavings) / 100;
  const paybackPeriod = implementationCost / monthlySavings;
  const threeYearSavings = monthlySavings * timeframe - implementationCost;
  const threeYearROI = (threeYearSavings / implementationCost) * 100;

  // Generate chart data
  const generateChartData = () => {
    const data = [];
    let cumulativeSavings = -implementationCost;

    for (let month = 0; month <= timeframe; month++) {
      if (month === 0) {
        data.push({
          month,
          savings: cumulativeSavings,
          implementation: -implementationCost,
        });
      } else {
        cumulativeSavings += monthlySavings;
        data.push({
          month,
          savings: cumulativeSavings,
          implementation: 0,
        });
      }
    }
    return data;
  };

  const chartData = generateChartData();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>ROI Calculator</CardTitle>
        <CardDescription>
          Calculate the return on investment for implementing our supply chain optimization solutions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Annual Supply Chain Spend</Label>
                <span className="text-sm font-medium">${annualSpend.toLocaleString()}</span>
              </div>
              <Slider 
                value={[annualSpend]} 
                min={100000} 
                max={10000000} 
                step={100000} 
                onValueChange={values => setAnnualSpend(values[0])} 
              />
              <Input 
                type="number" 
                value={annualSpend} 
                onChange={e => setAnnualSpend(Number(e.target.value))} 
                className="mt-1"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Implementation Cost</Label>
                <span className="text-sm font-medium">${implementationCost.toLocaleString()}</span>
              </div>
              <Slider 
                value={[implementationCost]} 
                min={10000} 
                max={500000} 
                step={10000} 
                onValueChange={values => setImplementationCost(values[0])} 
              />
              <Input 
                type="number" 
                value={implementationCost} 
                onChange={e => setImplementationCost(Number(e.target.value))} 
                className="mt-1"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Expected Savings Percentage</Label>
                <span className="text-sm font-medium">{expectedSavings}%</span>
              </div>
              <Slider 
                value={[expectedSavings]} 
                min={5} 
                max={40} 
                step={1} 
                onValueChange={values => setExpectedSavings(values[0])} 
              />
            </div>

            <div className="space-y-2">
              <Label>Analysis Timeframe</Label>
              <Select defaultValue="36" onValueChange={(v) => setTimeframe(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">1 Year</SelectItem>
                  <SelectItem value="24">2 Years</SelectItem>
                  <SelectItem value="36">3 Years</SelectItem>
                  <SelectItem value="60">5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Payback Period</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{paybackPeriod.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">months</span></p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Monthly Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">${monthlySavings.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Total Savings</CardTitle>
                  <CardDescription className="text-xs">Over {timeframe/12} years</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">${threeYearSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">ROI</CardTitle>
                  <CardDescription className="text-xs">Over {timeframe/12} years</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">{threeYearROI.toFixed(0)}%</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="h-[300px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                label={{ value: 'Months', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                label={{ value: 'Cumulative Value ($)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="implementation" 
                name="Implementation Cost" 
                stroke="#ef4444" 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                name="Cumulative Savings" 
                stroke="#10b981" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">Results are based on industry averages and your inputs</p>
        <Button>Generate PDF Report</Button>
      </CardFooter>
    </Card>
  );
};
