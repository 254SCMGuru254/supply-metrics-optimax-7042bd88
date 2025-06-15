
-- 1. Network Optimization Table (enterprise-grade)
CREATE TABLE IF NOT EXISTS public.network_optimizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  network_graph jsonb NOT NULL, -- node/link structure
  optimization_params jsonb,
  metrics jsonb, -- as_is/optimized/cost/bottleneck/throughput
  resilience_metrics jsonb, -- redundancy, connectivity, disruption_response
  multi_echelon_settings jsonb,
  as_is_snapshot jsonb,
  optimized_snapshot jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Facility Location Table (enterprise-grade)
CREATE TABLE IF NOT EXISTS public.facility_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  scenario_name text not null,
  scenario_type text, -- base, expansion, relocation, disaster, growth
  facilities jsonb, -- array of facilities with properties, candidates
  demand_points jsonb,
  optimization_params jsonb,
  optimization_results jsonb,
  risk_factors jsonb, -- risk, cost, disruption scores
  dynamic_plan jsonb, -- time-phased expansions/closures
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Fleet Management Table (enterprise-grade)
CREATE TABLE IF NOT EXISTS public.fleet_management (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  fleet_config jsonb NOT NULL, -- { vehicles: [{type, capacity, status, ...}] }
  routing_solution jsonb, -- latest routing/dispatch results
  maintenance_schedule jsonb, -- by vehicle, planned vs. actual
  fuel_metrics jsonb, -- efficiency, consumption history
  telematics jsonb, -- real-time locations, status, alerts
  optimization_params jsonb,
  optimization_results jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Indexes for querying by project/user
CREATE INDEX IF NOT EXISTS idx_netopt_project ON public.network_optimizations(project_id);
CREATE INDEX IF NOT EXISTS idx_facloc_project ON public.facility_locations(project_id);
CREATE INDEX IF NOT EXISTS idx_fleetmgmt_project ON public.fleet_management(project_id);

-- RLS for user-level isolation (adjust policies as needed for your app's authentication)
ALTER TABLE public.network_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_management ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user can view own network optimizations"
  ON public.network_optimizations FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user can view own facility locations"
  ON public.facility_locations FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user can view own fleet management data"
  ON public.fleet_management FOR SELECT USING (user_id = auth.uid());

-- Expand with INSERT/UPDATE/DELETE policies as you roll out those features.
