-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for user_roles - only admins can manage roles
CREATE POLICY "Admin can manage user roles" 
ON public.user_roles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Enable RLS on analytics_data table
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;

-- Create policy for analytics_data - users can view own analytics
CREATE POLICY "Users can view own analytics" 
ON public.analytics_data 
FOR ALL 
USING (auth.uid() = user_id);

-- Enable RLS on route_optimization_results table  
ALTER TABLE public.route_optimization_results ENABLE ROW LEVEL SECURITY;

-- Create policy for route_optimization_results - users can manage own results
CREATE POLICY "Users can manage own route results" 
ON public.route_optimization_results 
FOR ALL 
USING (auth.uid() = user_id);

-- Insert sample analytics data for testing
INSERT INTO public.analytics_data (project_id, user_id, metric_name, metric_value, metric_data, time_period) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'cost_reduction', 15.5, '{"baseline_cost": 10000, "optimized_cost": 8450}', 'daily'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'delivery_time', 24.5, '{"avg_hours": 24.5, "improvement": 12}', 'daily'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'fuel_efficiency', 8.2, '{"km_per_liter": 8.2, "improvement": 15}', 'weekly');