
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingTable } from "@/components/pricing/PricingTable";
import { PricingEngine } from "@/components/pricing/PricingEngine";
import { Check, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Pricing = () => {
  const [projectId] = useState('demo-project-pricing');

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
        <h2 className="text-3xl font-bold mb-4">Supply Chain Optimization Pricing</h2>
        <p className="text-muted-foreground">
          Enterprise-grade pricing solutions and subscription plans designed for the Kenyan market.
        </p>
      </div>

      <Tabs defaultValue="plans" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="calculator">Pricing Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
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
              Advanced Pricing Models Available
            </h3>
            <p className="text-sm text-green-700">
              Our platform now includes sophisticated pricing optimization models including cost-plus, 
              value-based, competitive, dynamic, penetration, and skimming strategies with real-time 
              market analysis and recommendations.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="calculator">
          <PricingEngine projectId={projectId} />
          
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Strategy Consultation</CardTitle>
                <CardDescription>
                  Need help implementing the right pricing strategy for your business?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our pricing experts can help you implement optimal pricing strategies tailored 
                  to your specific market conditions, competitive landscape, and business objectives.
                </p>
                <Button>Schedule Consultation</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pricing;
