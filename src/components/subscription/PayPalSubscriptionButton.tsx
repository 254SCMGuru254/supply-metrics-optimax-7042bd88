
import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PayPalSubscriptionButtonProps {
  planTier: 'starter' | 'business' | 'enterprise';
  planPrice: number;
  planName: string;
  onSuccess?: () => void;
}

// PayPal Plan IDs - REPLACE THESE WITH YOUR ACTUAL PAYPAL PLAN WEB LINKS
const PAYPAL_PLAN_IDS = {
  starter: 'YOUR_STARTER_PLAN_WEB_LINK_HERE', // Replace with your PayPal starter plan web link
  business: 'YOUR_BUSINESS_PLAN_WEB_LINK_HERE', // Replace with your PayPal business plan web link
  enterprise: 'YOUR_ENTERPRISE_PLAN_WEB_LINK_HERE' // Replace with your PayPal enterprise plan web link
};

export const PayPalSubscriptionButton: React.FC<PayPalSubscriptionButtonProps> = ({
  planTier,
  planPrice,
  planName,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const initialOptions = {
    clientId: "YOUR_PAYPAL_CLIENT_ID", // This should be set as a Supabase secret
    currency: "USD",
    intent: "subscription",
    vault: true
  };

  const createSubscription = (data: any, actions: any) => {
    return actions.subscription.create({
      plan_id: PAYPAL_PLAN_IDS[planTier]
    });
  };

  const onApprove = async (data: any, actions: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a plan.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Save subscription to database
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_tier: planTier,
          paypal_subscription_id: data.subscriptionID,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          monthly_price: planPrice
        });

      if (error) {
        console.error('Error saving subscription:', error);
        toast({
          title: "Subscription Error",
          description: "Failed to activate subscription. Please contact support.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Subscription Activated!",
        description: `Welcome to the ${planName} plan. Your subscription is now active.`
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const onError = (err: any) => {
    console.error('PayPal error:', err);
    toast({
      title: "Payment Error",
      description: "There was an error processing your payment. Please try again.",
      variant: "destructive"
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Subscribe to {planName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-2xl font-bold">Ksh {planPrice.toLocaleString()}/month</p>
          <p className="text-sm text-muted-foreground">Billed monthly via PayPal</p>
        </div>
        
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            createSubscription={createSubscription}
            onApprove={onApprove}
            onError={onError}
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'subscribe'
            }}
          />
        </PayPalScriptProvider>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>• Secure payment processing by PayPal</p>
          <p>• Cancel anytime from your account settings</p>
          <p>• 30-day money-back guarantee</p>
        </div>
      </CardContent>
    </Card>
  );
};
