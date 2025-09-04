-- Create risk_assessments table for Risk Management data collection
CREATE TABLE public.risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  user_id UUID NOT NULL,
  risk_type TEXT NOT NULL,
  input_parameters JSONB NOT NULL DEFAULT '{}',
  assessment_results JSONB NOT NULL DEFAULT '{}',
  var_calculations JSONB,
  supplier_risks JSONB,
  scenario_analysis JSONB,
  monte_carlo_results JSONB,
  confidence_level NUMERIC DEFAULT 95,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on risk_assessments
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for users to manage their own risk assessments
CREATE POLICY "Users can manage own risk assessments" 
ON public.risk_assessments 
FOR ALL 
USING (auth.uid() = user_id);

-- Create facility_location_results table for Facility Location data collection
CREATE TABLE public.facility_location_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  user_id UUID NOT NULL,
  model_type TEXT NOT NULL,
  facilities JSONB NOT NULL DEFAULT '{}',
  demand_points JSONB NOT NULL DEFAULT '{}',
  optimization_parameters JSONB NOT NULL DEFAULT '{}',
  optimization_results JSONB NOT NULL DEFAULT '{}',
  selected_facilities JSONB,
  cost_analysis JSONB,
  p_median_results JSONB,
  capacitated_results JSONB,
  hub_location_results JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on facility_location_results
ALTER TABLE public.facility_location_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for users to manage their own facility location results
CREATE POLICY "Users can manage own facility location results" 
ON public.facility_location_results 
FOR ALL 
USING (auth.uid() = user_id);

-- Add updated_at trigger to both tables
CREATE TRIGGER update_risk_assessments_updated_at
  BEFORE UPDATE ON public.risk_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facility_location_results_updated_at
  BEFORE UPDATE ON public.facility_location_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();