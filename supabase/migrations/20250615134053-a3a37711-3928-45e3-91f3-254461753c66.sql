
-- Create subscription management table
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_tier TEXT NOT NULL CHECK (plan_tier IN ('starter', 'business', 'enterprise')),
  paypal_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'expired', 'suspended')),
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE,
  monthly_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create usage tracking table
CREATE TABLE public.usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature_type TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  reset_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscriptions
CREATE POLICY "Users can view own subscription" 
  ON public.subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" 
  ON public.subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for usage tracking
CREATE POLICY "Users can view own usage" 
  ON public.usage_tracking 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" 
  ON public.usage_tracking 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create function to check user's plan and limits
CREATE OR REPLACE FUNCTION public.check_feature_access(
  feature_name TEXT,
  current_usage INTEGER DEFAULT 0
)
RETURNS TABLE(
  has_access BOOLEAN,
  current_plan TEXT,
  usage_limit INTEGER,
  current_usage_count INTEGER
) AS $$
DECLARE
  user_plan TEXT;
  plan_limits JSONB;
BEGIN
  -- Get user's current active subscription
  SELECT plan_tier INTO user_plan
  FROM public.subscriptions 
  WHERE user_id = auth.uid() 
    AND status = 'active' 
    AND current_period_end > now()
  ORDER BY created_at DESC 
  LIMIT 1;
  
  -- Default to starter if no active subscription
  user_plan := COALESCE(user_plan, 'starter');
  
  -- Define plan limits
  plan_limits := CASE user_plan
    WHEN 'starter' THEN '{"route_stops": 20, "data_points": 500, "optimizations": 10, "advanced_features": false}'::jsonb
    WHEN 'business' THEN '{"route_stops": -1, "data_points": 5000, "optimizations": 100, "advanced_features": true}'::jsonb
    WHEN 'enterprise' THEN '{"route_stops": -1, "data_points": -1, "optimizations": -1, "advanced_features": true}'::jsonb
    ELSE '{"route_stops": 20, "data_points": 500, "optimizations": 10, "advanced_features": false}'::jsonb
  END;
  
  -- Return access information
  RETURN QUERY SELECT 
    CASE 
      WHEN (plan_limits->feature_name)::INTEGER = -1 THEN TRUE
      WHEN (plan_limits->feature_name)::INTEGER > current_usage THEN TRUE
      ELSE FALSE
    END as has_access,
    user_plan as current_plan,
    (plan_limits->feature_name)::INTEGER as usage_limit,
    current_usage as current_usage_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update updated_at columns
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON public.usage_tracking
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
