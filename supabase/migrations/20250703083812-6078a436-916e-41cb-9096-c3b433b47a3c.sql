
-- Create cost_model_inputs table
CREATE TABLE public.cost_model_inputs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    model_type TEXT NOT NULL,
    inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'draft'::text,
    CONSTRAINT unique_user_project_model UNIQUE (user_id, project_id, model_type)
);

-- Create cost_model_results table  
CREATE TABLE public.cost_model_results (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    model_type TEXT NOT NULL,
    inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
    results JSONB NOT NULL DEFAULT '{}'::jsonb,
    recommendations TEXT[],
    formula TEXT,
    performance_metrics JSONB DEFAULT '{}'::jsonb,
    execution_time_ms INTEGER,
    cost_savings_percentage NUMERIC,
    status TEXT DEFAULT 'completed'::text
);

-- Create vehicles table for comprehensive data
CREATE TABLE public.vehicles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'truck',
    ownership TEXT NOT NULL DEFAULT 'owned' CHECK (ownership IN ('owned', 'outsourced')),
    capacity NUMERIC NOT NULL DEFAULT 0,
    capacity_unit TEXT NOT NULL DEFAULT 'tons' CHECK (capacity_unit IN ('tons', 'kg', 'pallets', 'cbm')),
    fuel_consumption NUMERIC DEFAULT 0,
    maintenance_cost NUMERIC DEFAULT 0,
    driver_cost_per_day NUMERIC DEFAULT 0,
    max_speed NUMERIC DEFAULT 80,
    weight_limit NUMERIC DEFAULT 0,
    height_limit NUMERIC DEFAULT 0,
    width_limit NUMERIC DEFAULT 0,
    misc_expenses NUMERIC DEFAULT 0
);

-- Create warehouses table
CREATE TABLE public.warehouses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    address TEXT,
    ownership TEXT NOT NULL DEFAULT 'owned' CHECK (ownership IN ('owned', 'outsourced')),
    size NUMERIC DEFAULT 0,
    size_unit TEXT DEFAULT 'sqm' CHECK (size_unit IN ('sqm', 'sqft')),
    functions TEXT[] DEFAULT ARRAY[]::TEXT[],
    automation_level TEXT DEFAULT 'manual' CHECK (automation_level IN ('automated', 'semi-automated', 'manual')),
    cold_chain BOOLEAN DEFAULT false,
    cold_chain_temperature NUMERIC,
    monthly_cost NUMERIC DEFAULT 0,
    handling_cost_per_unit NUMERIC DEFAULT 0,
    labor_cost NUMERIC DEFAULT 0
);

-- Create route_constraints table
CREATE TABLE public.route_constraints (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('checkpoint', 'toll', 'weight-restriction', 'time-window', 'environmental-zone')),
    latitude NUMERIC,
    longitude NUMERIC,
    cost NUMERIC DEFAULT 0,
    time_delay NUMERIC DEFAULT 0,
    restrictions TEXT[] DEFAULT ARRAY[]::TEXT[],
    notes TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.cost_model_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_model_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_constraints ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cost_model_inputs
CREATE POLICY "Users can manage their own cost model inputs"
ON public.cost_model_inputs
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for cost_model_results
CREATE POLICY "Users can manage their own cost model results"
ON public.cost_model_results
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for vehicles
CREATE POLICY "Users can manage their own vehicles"
ON public.vehicles
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for warehouses
CREATE POLICY "Users can manage their own warehouses"
ON public.warehouses
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for route_constraints
CREATE POLICY "Users can manage their own route constraints"
ON public.route_constraints
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_cost_model_inputs_updated_at
    BEFORE UPDATE ON public.cost_model_inputs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cost_model_results_updated_at
    BEFORE UPDATE ON public.cost_model_results
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at
    BEFORE UPDATE ON public.warehouses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_route_constraints_updated_at
    BEFORE UPDATE ON public.route_constraints
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
