import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Link } from "react-router-dom";

const PricingTier = ({
  name,
  price,
  priceId,
  description,
  features,
  mostPopular = false,
  buttonVariant = "outline",
}) => (
  <Card className={`flex flex-col h-full ${mostPopular ? 'border-primary' : ''}`}>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        {name}
        {mostPopular && (
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-md font-medium">
            Most Popular
          </span>
        )}
      </CardTitle>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold">{price}</span>
        {price !== "Free" && <span className="text-muted-foreground">/month</span>}
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Link to="/introduction" className="w-full">
        <Button className="w-full" variant={buttonVariant}>
          Get Started
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const pricingModels = {
    standard: {
      monthly: [
        {
          name: "Community",
          price: "Free",
          priceId: "price_community_free",
          description: "Perfect for open source projects and individual developers",
          features: [
            "Cutting-edge optimization algorithms",
            "Local machine learning models",
            "Basic data management",
            "Community support",
            "Supply chain chatbot",
            "Route optimization",
            "Up to 3 concurrent projects"
          ],
        },
        {
          name: "Professional",
          price: "$49",
          priceId: "price_professional_monthly",
          description: "Ideal for small to medium businesses",
          mostPopular: true,
          buttonVariant: "default",
          features: [
            "All Community features",
            "Premium algorithms",
            "Advanced data analytics",
            "Priority support",
            "Custom model training",
            "Unlimited projects",
            "API access",
            "Team collaboration"
          ],
        },
        {
          name: "Enterprise",
          price: "Custom",
          priceId: "price_enterprise_custom",
          description: "For organizations needing advanced features and support",
          features: [
            "All Professional features",
            "Dedicated support",
            "Custom development",
            "SLA guarantee",
            "On-premise deployment",
            "Advanced security",
            "Training & workshops",
            "Custom integrations"
          ],
        },
      ],
      annual: [
        {
          name: "Community",
          price: "Free",
          priceId: "price_community_free",
          description: "Perfect for open source projects and individual developers",
          features: [
            "Cutting-edge optimization algorithms",
            "Local machine learning models",
            "Basic data management",
            "Community support",
            "Supply chain chatbot",
            "Route optimization",
            "Up to 3 concurrent projects"
          ],
        },
        {
          name: "Professional",
          price: "$39",
          priceId: "price_professional_annual",
          description: "Ideal for small to medium businesses (20% savings)",
          mostPopular: true,
          buttonVariant: "default",
          features: [
            "All Community features",
            "Premium algorithms",
            "Advanced data analytics",
            "Priority support",
            "Custom model training",
            "Unlimited projects",
            "API access",
            "Team collaboration"
          ],
        },
        {
          name: "Enterprise",
          price: "Custom",
          priceId: "price_enterprise_custom",
          description: "For organizations needing advanced features and support",
          features: [
            "All Professional features",
            "Dedicated support",
            "Custom development",
            "SLA guarantee",
            "On-premise deployment",
            "Advanced security",
            "Training & workshops",
            "Custom integrations"
          ],
        },
      ]
    },
    kenya: {
      monthly: [
        {
          name: "Starter",
          price: "KES 25,000",
          priceId: "price_kenya_starter_monthly",
          description: "Perfect for small businesses in Kenya",
          features: [
            "Route optimization (up to 20 stops)",
            "Basic analytics",
            "M-Pesa integration",
            "Email support",
            "Local knowledge base",
            "Standard SLA",
            "1 user account"
          ],
        },
        {
          name: "Business",
          price: "KES 75,000",
          priceId: "price_kenya_business_monthly",
          description: "For growing companies in East Africa",
          mostPopular: true,
          buttonVariant: "default",
          features: [
            "Route optimization (unlimited stops)",
            "Network optimization",
            "Center of gravity analysis",
            "Advanced analytics",
            "M-Pesa integration",
            "Priority support",
            "Regional customization",
            "5 user accounts"
          ],
        },
        {
          name: "Enterprise",
          price: "KES 200,000",
          priceId: "price_kenya_enterprise_monthly",
          description: "For large operations across East Africa",
          features: [
            "All Business features",
            "Simulation modeling",
            "Disruption analysis",
            "Custom integrations",
            "Dedicated support",
            "On-site training",
            "Custom SLA",
            "Unlimited users"
          ],
        },
      ],
      annual: [
        {
          name: "Starter",
          price: "KES 20,000",
          priceId: "price_kenya_starter_annual",
          description: "Perfect for small businesses in Kenya (20% savings)",
          features: [
            "Route optimization (up to 20 stops)",
            "Basic analytics",
            "M-Pesa integration",
            "Email support",
            "Local knowledge base",
            "Standard SLA",
            "1 user account"
          ],
        },
        {
          name: "Business",
          price: "KES 60,000",
          priceId: "price_kenya_business_annual",
          description: "For growing companies in East Africa (20% savings)",
          mostPopular: true,
          buttonVariant: "default",
          features: [
            "Route optimization (unlimited stops)",
            "Network optimization",
            "Center of gravity analysis",
            "Advanced analytics",
            "M-Pesa integration",
            "Priority support",
            "Regional customization",
            "5 user accounts"
          ],
        },
        {
          name: "Enterprise",
          price: "KES 160,000",
          priceId: "price_kenya_enterprise_annual",
          description: "For large operations across East Africa (20% savings)",
          features: [
            "All Business features",
            "Simulation modeling",
            "Disruption analysis",
            "Custom integrations",
            "Dedicated support",
            "On-site training",
            "Custom SLA",
            "Unlimited users"
          ],
        },
      ]
    }
  };

  return (
    <div className="container py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that best fits your needs. All plans include our core optimization features.
        </p>
      </div>
      
      <Tabs defaultValue="standard" className="mb-8">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="standard">Standard Pricing</TabsTrigger>
            <TabsTrigger value="kenya">Kenya Pricing</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="standard">
          <div className="flex justify-center mb-8">
            <div className="bg-muted inline-flex items-center p-1 rounded-lg">
              <button 
                className={`px-4 py-2 rounded-md ${billingCycle === 'monthly' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${billingCycle === 'annual' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setBillingCycle("annual")}
              >
                Annual (20% off)
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingModels.standard[billingCycle].map((tier) => (
              <PricingTier key={tier.name} {...tier} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kenya">
          <div className="flex justify-center mb-8">
            <div className="bg-muted inline-flex items-center p-1 rounded-lg">
              <button 
                className={`px-4 py-2 rounded-md ${billingCycle === 'monthly' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${billingCycle === 'annual' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setBillingCycle("annual")}
              >
                Annual (20% off)
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingModels.kenya[billingCycle].map((tier) => (
              <PricingTier key={tier.name} {...tier} />
            ))}
          </div>
          
          <div className="mt-12 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-lg mb-2">M-Pesa Integration Coming Soon</h3>
            <p className="text-sm">
              We're working on integrating M-Pesa for seamless payments directly within the platform. 
              This will allow businesses to pay for services and manage subscription plans using Kenya's 
              most popular mobile payment system.
            </p>
          </div>
          
          <div className="mt-8 p-6 border rounded-lg">
            <h3 className="font-semibold text-lg mb-2">International vs. Local Pricing Comparison</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our pricing is optimized for the Kenyan market. Similar services internationally would cost:
            </p>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Starter tier international equivalent:</span>
                <span>KES 90,000 (~$705)</span>
              </li>
              <li className="flex justify-between">
                <span>Business tier international equivalent:</span>
                <span>KES 250,000 (~$1,960)</span>
              </li>
              <li className="flex justify-between">
                <span>Enterprise tier international equivalent:</span>
                <span>KES 600,000 (~$4,700)</span>
              </li>
            </ul>
            <p className="text-sm mt-4">
              Our local pricing represents a 60-75% discount compared to international rates, 
              making enterprise-grade supply chain optimization accessible to Kenyan businesses.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Can I switch between plans?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Is there a free trial?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Yes, all paid plans come with a 14-day free trial. No credit card required to start.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We accept major credit cards, bank transfers, and will soon support M-Pesa for local payments in Kenya.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Do you offer custom plans?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Yes, we can create custom plans for enterprises with specific requirements. Please contact us for more information.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
