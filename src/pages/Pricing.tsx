
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingTable } from "@/components/pricing/PricingTable";
import { PricingEngine } from "@/components/pricing/PricingEngine";
import { PayPalSubscriptionButton } from "@/components/subscription/PayPalSubscriptionButton";
import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/components/auth/AuthProvider";

const Pricing = () => {
  const [projectId] = useState('demo-project-pricing');
  const { subscription, loading } = useSubscription();
  const { user } = useAuth();

  const pricingTiers = [
    {
      name: "Starter",
      price: "Ksh 3,000",
      usdPrice: "USD 23.53",
      period: "month",
      description: "Perfect for small businesses getting started with supply chain optimization.",
      features: [
        "Route optimization (up to 20 stops)",
        "Basic analytics and reporting",
        "Email support",
        "Up to 500 data points",
        "Basic optimization algorithms"
      ],
      planTier: "starter" as const,
      monthlyPrice: 3000
    },
    {
      name: "Business",
      price: "Ksh 7,500",
      usdPrice: "USD 58.82",
      period: "month",
      description: "For growing companies needing advanced features and analytics.",
      features: [
        "Route optimization (unlimited stops)",
        "Network optimization",
        "Center of gravity analysis",
        "Advanced analytics and forecasting",
        "Priority email and chat support",
        "Up to 5,000 data points",
        "Multi-echelon inventory optimization"
      ],
      popular: true,
      planTier: "business" as const,
      monthlyPrice: 7500
    },
    {
      name: "Enterprise",
      price: "Ksh 15,000",
      usdPrice: "USD 117.65",
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
      planTier: "enterprise" as const,
      monthlyPrice: 15000
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
          <TabsTrigger value="calculator">Pricing Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <PricingTable tiers={pricingTiers} region="kenya" />

          {subscription && (
            <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold mb-2 flex items-center text-green-800">
                <Check className="h-5 w-5 mr-2" />
                Current Subscription: {subscription.plan_tier.charAt(0).toUpperCase() + subscription.plan_tier.slice(1)}
              </h3>
              <p className="text-sm text-green-700">
                Your subscription is active and all features are available according to your plan.
              </p>
            </div>
          )}

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
              Our local pricing represents a 90-98% discount compared to international rates, 
              making enterprise-grade supply chain optimization accessible to Kenyan businesses.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="subscribe">
          {!user ? (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Authentication Required</CardTitle>
                <CardDescription>Please log in to subscribe to a plan</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <a href="/auth">Sign In / Register</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingTiers.map((tier) => (
                <PayPalSubscriptionButton
                  key={tier.planTier}
                  planTier={tier.planTier}
                  planPrice={tier.monthlyPrice}
                  planName={tier.name}
                  onSuccess={() => window.location.reload()}
                />
              ))}
            </div>
          )}
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
