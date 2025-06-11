import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingTable } from "@/components/pricing/PricingTable";
import { Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";
// import { calculateDynamicPricing, calculateROI } from "@/components/pricing/PricingUtils";

const pricingModel = modelFormulaRegistry.find(m => m.id === "pricing");

// Dynamic dispatcher for backend functions
const formulaDispatcher: Record<string, Function> = {
  // calculateDynamicPricing: (values: any) => calculateDynamicPricing(values),
  // calculateROI: (values: any) => calculateROI(values),
};

const Pricing = () => {
  const [selectedFormulaId, setSelectedFormulaId] = useState(pricingModel?.formulas[0]?.id || "");
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);

  if (!pricingModel) return <div>Model not found.</div>;
  const selectedFormula = pricingModel.formulas.find(f => f.id === selectedFormulaId);

  const handleInputChange = (name: string, value: any) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleCalculate = () => {
    if (selectedFormula && selectedFormula.backendFunction && formulaDispatcher[selectedFormula.backendFunction]) {
      const output = formulaDispatcher[selectedFormula.backendFunction](inputValues);
      setResult(output);
    } else {
      setResult({ message: `Calculated using ${selectedFormula?.name}` });
    }
  };

  const pricingTiers = [
    {
      name: "Starter",
      price: "Ksh 25,000",
      period: "month",
      description: "Perfect for small businesses getting started with supply chain optimization.",
      features: [
        "Route optimization (up to 20 stops)",
        "Basic analytics and reporting",
        "M-Pesa payment integration",
        "Email support",
        "Up to 500 data points",
        "Basic optimization algorithms"
      ],
      paymentIntegrated: true
    },
    {
      name: "Business",
      price: "Ksh 75,000",
      period: "month",
      description: "For growing companies needing advanced features and analytics.",
      features: [
        "Route optimization (unlimited stops)",
        "Network optimization",
        "Center of gravity analysis",
        "Advanced analytics and forecasting",
        "M-Pesa payment integration",
        "Priority email and chat support",
        "Up to 5,000 data points",
        "Multi-echelon inventory optimization"
      ],
      popular: true,
      paymentIntegrated: true
    },
    {
      name: "Enterprise",
      price: "Ksh 200,000",
      period: "month",
      description: "For large enterprises requiring comprehensive supply chain solutions.",
      features: [
        "All features included",
        "Simulation modeling",
        "Disruption analysis",
        "Custom integrations",
        "Dedicated support manager",
        "Unlimited data points",
        "Custom optimization algorithms",
        "24/7 priority support",
        "Advanced AI and machine learning"
      ],
      paymentIntegrated: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Perfect Plan</h2>
        <p className="text-muted-foreground">
          Start optimizing your supply chain today with our flexible pricing plans designed for the Kenyan market.
        </p>
      </div>

      <PricingTable tiers={pricingTiers} region="kenya" />

      <div className="mt-12 bg-muted p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">International vs. Local Pricing Comparison</h3>
        <p className="text-muted-foreground mb-4">
          Our pricing is optimized for the Kenyan market. Similar services internationally would cost:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="font-semibold">Starter International</p>
            <p className="text-2xl">Ksh 90,000</p>
            <p className="text-sm text-muted-foreground">(USD 705.88)</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Business International</p>
            <p className="text-2xl">Ksh 250,000</p>
            <p className="text-sm text-muted-foreground">(USD 1960.78)</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Enterprise International</p>
            <p className="text-2xl">Ksh 600,000</p>
            <p className="text-sm text-muted-foreground">(USD 4705.88)</p>
          </div>
        </div>
        <p className="text-sm mt-4 text-muted-foreground">
          Our local pricing represents a 60-75% discount compared to international rates, 
          making enterprise-grade supply chain optimization accessible to Kenyan businesses.
        </p>
      </div>

      <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="font-semibold mb-2 flex items-center text-green-800">
          <Check className="h-5 w-5 mr-2" />
          PayPal Integration Active
        </h3>
        <p className="text-sm text-green-700">
          All plans now include integrated PayPal payment processing for seamless international 
          and local payments. M-Pesa integration is coming soon for even more convenient local payments.
        </p>
      </div>

      <div className="mt-6">
        <label className="block font-medium mb-2">Select Formula</label>
        <select
          className="border rounded px-3 py-2"
          value={selectedFormulaId}
          onChange={e => setSelectedFormulaId(e.target.value)}
        >
          {pricingModel.formulas.map(formula => (
            <option key={formula.id} value={formula.id}>{formula.name}</option>
          ))}
        </select>
      </div>
      {selectedFormula && (
        <Card className="p-4 mt-4">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">{selectedFormula.name}</h2>
            <p className="text-muted-foreground mb-4">{selectedFormula.description}</p>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleCalculate(); }}>
              {selectedFormula.inputs.map(input => (
                <div key={input.name}>
                  <label className="block mb-1 font-medium">{input.label}</label>
                  <Input
                    type={input.type === "number" ? "number" : "text"}
                    value={inputValues[input.name] || ""}
                    onChange={e => handleInputChange(input.name, e.target.value)}
                  />
                </div>
              ))}
              <Button type="submit" className="mt-4">Calculate</Button>
            </form>
            {result && (
              <div className="mt-6 p-4 bg-muted rounded">
                <strong>Result:</strong> <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Pricing;
