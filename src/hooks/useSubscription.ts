
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface Subscription {
  id: string;
  plan_tier: 'starter' | 'business' | 'enterprise';
  status: 'pending' | 'active' | 'cancelled' | 'expired' | 'suspended';
  current_period_end: string;
  paypal_subscription_id?: string;
}

export interface PlanLimits {
  route_stops: number;
  data_points: number;
  optimizations: number;
  advanced_features: boolean;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFeatureAccess = async (featureName: string, currentUsage: number = 0) => {
    if (!user) return { hasAccess: false, currentPlan: 'starter', usageLimit: 0 };

    try {
      const { data, error } = await supabase.rpc('check_feature_access', {
        feature_name: featureName,
        current_usage: currentUsage
      });

      if (error) {
        console.error('Error checking feature access:', error);
        return { hasAccess: false, currentPlan: 'starter', usageLimit: 0 };
      }

      return {
        hasAccess: data[0]?.has_access || false,
        currentPlan: data[0]?.current_plan || 'starter',
        usageLimit: data[0]?.usage_limit || 0
      };
    } catch (error) {
      console.error('Error:', error);
      return { hasAccess: false, currentPlan: 'starter', usageLimit: 0 };
    }
  };

  const getPlanLimits = (planTier: string): PlanLimits => {
    switch (planTier) {
      case 'starter':
        return { route_stops: 20, data_points: 500, optimizations: 10, advanced_features: false };
      case 'business':
        return { route_stops: -1, data_points: 5000, optimizations: 100, advanced_features: true };
      case 'enterprise':
        return { route_stops: -1, data_points: -1, optimizations: -1, advanced_features: true };
      default:
        return { route_stops: 20, data_points: 500, optimizations: 10, advanced_features: false };
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  return {
    subscription,
    loading,
    checkFeatureAccess,
    getPlanLimits,
    refetchSubscription: fetchSubscription
  };
};
