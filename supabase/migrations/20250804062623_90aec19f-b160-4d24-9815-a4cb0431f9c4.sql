-- Create automatic backup system for model configurations
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create model_backups table for version control
CREATE TABLE public.model_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  model_type TEXT NOT NULL,
  model_data JSONB NOT NULL,
  backup_type TEXT NOT NULL DEFAULT 'manual', -- 'auto', 'manual', 'scheduled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  backup_path TEXT,
  file_size INTEGER,
  checksum TEXT
);

-- Enable RLS
ALTER TABLE public.model_backups ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage own model backups" 
ON public.model_backups 
FOR ALL 
USING (auth.uid() = user_id);

-- Create backup storage bucket policy
INSERT INTO storage.buckets (id, name, public) 
VALUES ('model-backups', 'model-backups', false);

-- Storage policies for model backups
CREATE POLICY "Users can upload their own backups" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'model-backups' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own backups" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'model-backups' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own backups" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'model-backups' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own backups" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'model-backups' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function for automatic daily backups
CREATE OR REPLACE FUNCTION public.create_daily_backup()
RETURNS void
LANGUAGE plpgsql
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

-- Schedule daily backup at 2 AM
SELECT cron.schedule(
  'daily-model-backup',
  '0 2 * * *',
  'SELECT public.create_daily_backup();'
);

-- Create function to restore model configuration
CREATE OR REPLACE FUNCTION public.restore_model_backup(backup_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
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