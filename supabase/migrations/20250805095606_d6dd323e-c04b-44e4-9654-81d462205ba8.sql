-- Fix security issues: Enable RLS on missing tables and update function search paths
ALTER TABLE public.kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_modes ENABLE ROW LEVEL SECURITY;

-- Create policies for KPI definitions (public read)
CREATE POLICY "Everyone can view KPI definitions" 
ON public.kpi_definitions 
FOR SELECT 
USING (true);

-- Create policies for transport modes (public read)
CREATE POLICY "Everyone can view transport modes" 
ON public.transport_modes 
FOR SELECT 
USING (true);

-- Fix function search paths to prevent security warnings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.calculate_center_of_gravity(project_uuid uuid)
RETURNS TABLE(latitude numeric, longitude numeric, total_weight numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    SUM(n.latitude * COALESCE(n.demand, 1)) / SUM(COALESCE(n.demand, 1)) as latitude,
    SUM(n.longitude * COALESCE(n.demand, 1)) / SUM(COALESCE(n.demand, 1)) as longitude,
    SUM(COALESCE(n.demand, 1)) as total_weight
  FROM public.supply_nodes n
  WHERE n.project_id = project_uuid 
  AND n.node_type IN ('customer', 'demand_point');
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_distance(lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 6371 * acos(
    cos(radians(lat1)) * 
    cos(radians(lat2)) * 
    cos(radians(lon2) - radians(lon1)) + 
    sin(radians(lat1)) * 
    sin(radians(lat2))
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.check_feature_access(feature_name text, current_usage integer DEFAULT 0)
RETURNS TABLE(has_access boolean, current_plan text, usage_limit integer, current_usage_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.create_daily_backup()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert backup records for all active models
  INSERT INTO public.model_backups (user_id, model_type, model_data, backup_type)
  SELECT 
    user_id,
    'route_optimization' as model_type,
    jsonb_build_object(
      'routes', route_data,
      'params', input_parameters,
      'results', optimization_results,
      'created_at', created_at
    ) as model_data,
    'auto' as backup_type
  FROM public.route_optimization_results
  WHERE created_at >= CURRENT_DATE - INTERVAL '1 day';

  -- Backup facility location data
  INSERT INTO public.model_backups (user_id, model_type, model_data, backup_type)
  SELECT 
    user_id,
    'facility_location' as model_type,
    jsonb_build_object(
      'facilities', facilities,
      'demand_points', demand_points,
      'optimization_params', optimization_params,
      'optimization_results', optimization_results,
      'created_at', created_at
    ) as model_data,
    'auto' as backup_type
  FROM public.facility_locations
  WHERE updated_at >= CURRENT_DATE - INTERVAL '1 day';

  -- Backup inventory scenarios
  INSERT INTO public.model_backups (user_id, model_type, model_data, backup_type)
  SELECT 
    user_id,
    'inventory_management' as model_type,
    jsonb_build_object(
      'parameters', parameters,
      'results', results,
      'scenario_name', scenario_name,
      'scenario_type', scenario_type,
      'created_at', created_at
    ) as model_data,
    'auto' as backup_type
  FROM public.inventory_scenarios
  WHERE created_at >= CURRENT_DATE - INTERVAL '1 day';
END;
$$;

CREATE OR REPLACE FUNCTION public.restore_model_backup(backup_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  backup_record RECORD;
  result JSONB;
BEGIN
  -- Get backup record
  SELECT * INTO backup_record 
  FROM public.model_backups 
  WHERE id = backup_id AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Backup not found or access denied';
  END IF;
  
  -- Return the backup data for restoration
  result := jsonb_build_object(
    'model_type', backup_record.model_type,
    'model_data', backup_record.model_data,
    'created_at', backup_record.created_at
  );
  
  RETURN result;
END;
$$;