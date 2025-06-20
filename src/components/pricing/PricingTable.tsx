import { Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PayPalSubscriptionButton } from "@/components/subscription/PayPalSubscriptionButton";

interface PricingTier {
  name: string;
  price: string;
  usdPrice?: string;
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
      // PayPal integration for Kenya-friendly payments
      console.log(`Initiating PayPal payment for ${tier.name} - ${tier.price}`);
      // TODO: Implement PayPal payment flow
      window.open('https://www.paypal.com', '_blank');
    } else {
      console.log(`Payment integration in progress for ${tier.name}`);
      alert(`PayPal payment gateway integration is being finalized for ${tier.name} plan`);
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
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.period && <span className="text-muted-foreground">/{tier.period}</span>}
              </div>
              {tier.usdPrice && (
                <span className="text-sm text-muted-foreground">({tier.usdPrice})</span>
              )}
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
            <PayPalSubscriptionButton
              planTier={tier.name.toLowerCase() as 'starter' | 'business' | 'enterprise'}
              planName={tier.name}
              planPrice={parseInt(tier.price.replace(/[^\d]/g, ""))}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
