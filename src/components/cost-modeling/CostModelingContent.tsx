import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Calculator, 
  TrendingUp,
  BarChart3,
  AlertCircle
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface CostInput {
  name: string;
  value: number;
}

export const CostModelingContent = () => {
  const { toast } = useToast();
  const [fixedCosts, setFixedCosts] = useState<CostInput[]>([
    { name: "Rent", value: 5000 },
    { name: "Salaries", value: 60000 },
    { name: "Utilities", value: 2000 }
  ]);
  const [variableCosts, setVariableCosts] = useState<CostInput[]>([
    { name: "Materials", value: 10 },
    { name: "Labor", value: 15 },
    { name: "Shipping", value: 5 }
  ]);
  const [sellingPrice, setSellingPrice] = useState<number>(50);
  const [unitsSold, setUnitsSold] = useState<number>(1000);

  const addCost = (type: "fixed" | "variable") => {
    const newCost: CostInput = { name: "New Cost", value: 0 };
    if (type === "fixed") {
      setFixedCosts([...fixedCosts, newCost]);
    } else {
      setVariableCosts([...variableCosts, newCost]);
    }
  };

  const updateCost = (type: "fixed" | "variable", index: number, field: "name" | "value", value: any) => {
    if (type === "fixed") {
      const updatedCosts = [...fixedCosts];
      updatedCosts[index][field] = field === "value" ? parseFloat(value) : value;
      setFixedCosts(updatedCosts);
    } else {
      const updatedCosts = [...variableCosts];
      updatedCosts[index][field] = field === "value" ? parseFloat(value) : value;
      setVariableCosts(updatedCosts);
    }
  };

  const deleteCost = (type: "fixed" | "variable", index: number) => {
    if (type === "fixed") {
      const updatedCosts = [...fixedCosts];
      updatedCosts.splice(index, 1);
      setFixedCosts(updatedCosts);
    } else {
      const updatedCosts = [...variableCosts];
      updatedCosts.splice(index, 1);
      setVariableCosts(updatedCosts);
    }
  };

  const calculateTotals = () => {
    const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + cost.value, 0);
    const totalVariableCosts = variableCosts.reduce((sum, cost) => sum + cost.value, 0);
    const totalRevenue = sellingPrice * unitsSold;
    const totalCostOfSales = totalVariableCosts * unitsSold;
    const grossProfit = totalRevenue - totalCostOfSales;
    const netProfit = grossProfit - totalFixedCosts;
    const breakEvenPoint = totalFixedCosts / (sellingPrice - totalVariableCosts);

    return {
      totalFixedCosts,
      totalVariableCosts,
      totalRevenue,
      totalCostOfSales,
      grossProfit,
      netProfit,
      breakEvenPoint
    };
  };

  const {
    totalFixedCosts,
    totalVariableCosts,
    totalRevenue,
    totalCostOfSales,
    grossProfit,
    netProfit,
    breakEvenPoint
  } = calculateTotals();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cost Inputs</CardTitle>
          <CardDescription>Enter your fixed and variable costs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Fixed Costs</h4>
              {fixedCosts.map((cost, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Cost Name"
                    value={cost.name}
                    onChange={(e) => updateCost("fixed", index, "name", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Cost Value"
                    value={cost.value}
                    onChange={(e) => updateCost("fixed", index, "value", e.target.value)}
                  />
                  <Button variant="outline" size="icon" onClick={() => deleteCost("fixed", index)}>
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => addCost("fixed")}>
                Add Fixed Cost
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Variable Costs</h4>
              {variableCosts.map((cost, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Cost Name"
                    value={cost.name}
                    onChange={(e) => updateCost("variable", index, "name", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Cost Value"
                    value={cost.value}
                    onChange={(e) => updateCost("variable", index, "value", e.target.value)}
                  />
                  <Button variant="outline" size="icon" onClick={() => deleteCost("variable", index)}>
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => addCost("variable")}>
                Add Variable Cost
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sellingPrice">Selling Price per Unit</Label>
              <Input
                type="number"
                id="sellingPrice"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="unitsSold">Units Sold</Label>
              <Input
                type="number"
                id="unitsSold"
                value={unitsSold}
                onChange={(e) => setUnitsSold(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
          <CardDescription>Key financial metrics and break-even analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Total Fixed Costs</TableCell>
                <TableCell className="text-right">${totalFixedCosts.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Variable Costs</TableCell>
                <TableCell className="text-right">${totalVariableCosts.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Revenue</TableCell>
                <TableCell className="text-right">${totalRevenue.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cost of Sales</TableCell>
                <TableCell className="text-right">${totalCostOfSales.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Gross Profit</TableCell>
                <TableCell className="text-right">${grossProfit.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Net Profit</TableCell>
                <TableCell className="text-right">${netProfit.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Break-Even Point (Units)</TableCell>
                <TableCell className="text-right">{breakEvenPoint.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
