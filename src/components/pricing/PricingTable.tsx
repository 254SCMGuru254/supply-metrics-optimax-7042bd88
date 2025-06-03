
import { Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  popular?: boolean;
  paymentIntegrated?: boolean;
}

interface PricingTableProps {
  tiers: PricingTier[];
  region?: 'standard' | 'kenya';
}

export const PricingTable = ({ tiers, region = 'standard' }: PricingTableProps) => {
  const handlePayment = (tier: PricingTier) => {
    if (tier.paymentIntegrated) {
      // TODO: Integrate with Stripe payment gateway
      console.log(`Payment integration for ${tier.name} - ${tier.price}`);
      alert(`Payment gateway integration needed for ${tier.name} plan`);
    } else {
      console.log(`Payment not yet integrated for ${tier.name}`);
      alert(`Payment gateway not yet integrated for ${tier.name} plan`);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {tiers.map((tier) => (
        <Card key={tier.name} className={`flex flex-col h-full ${tier.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {tier.name}
              {tier.popular && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-md font-medium">
                  Most Popular
                </span>
              )}
            </CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{tier.price}</span>
              {tier.period && <span className="text-muted-foreground">/{tier.period}</span>}
            </div>
            <CardDescription>{tier.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-3">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant={tier.popular ? "default" : "outline"}
              onClick={() => handlePayment(tier)}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {tier.paymentIntegrated ? 'Get Started' : 'Coming Soon'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
