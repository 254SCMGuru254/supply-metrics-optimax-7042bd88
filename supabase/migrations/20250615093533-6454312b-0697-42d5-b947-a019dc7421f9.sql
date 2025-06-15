
-- 1. Demand event logging for demand sensing and disruptions
CREATE TABLE IF NOT EXISTS public.demand_event_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id uuid REFERENCES public.supply_nodes(id) ON DELETE CASCADE,
  timestamp timestamp with time zone DEFAULT now(),
  event_type text,                      -- observed, predicted, anomaly, stockout, demand_spike
  event_data jsonb,
  severity text DEFAULT 'info',         -- info, warning, critical
  handled boolean DEFAULT false
);

-- 2. Perishables inventory management
CREATE TABLE IF NOT EXISTS public.perishable_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  batch_code text,
  received_date timestamp with time zone DEFAULT now(),
  expiry_date timestamp with time zone,
  quantity numeric NOT NULL,
  status text DEFAULT 'in_stock',       -- in_stock, expired, at_risk, used, destroyed
  alert boolean DEFAULT false
);

-- 3. Inventory scenario modeling (for stochastic/what-if simulation)
CREATE TABLE IF NOT EXISTS public.inventory_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid,
  scenario_name text NOT NULL,
  scenario_type text,                   -- base, disruption, demand_spike, supply_delay
  parameters jsonb,
  results jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_demand_event_node_id ON public.demand_event_logs(node_id);
CREATE INDEX IF NOT EXISTS idx_perishable_inventory_item_id ON public.perishable_inventory(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_scenarios_project_id ON public.inventory_scenarios(project_id);

-- 5. Enable RLS for user isolation where relevant
ALTER TABLE public.demand_event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perishable_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_scenarios ENABLE ROW LEVEL SECURITY;

-- 6. Default permissive policies (update after app code links user_id)
CREATE POLICY "user can view demand events"
  ON public.demand_event_logs FOR SELECT
  USING (true); -- tie to node/project as needed
CREATE POLICY "user can view perishables"
  ON public.perishable_inventory FOR SELECT
  USING (true); -- tie to item/project as needed
CREATE POLICY "user can view inventory scenarios"
  ON public.inventory_scenarios FOR SELECT
  USING (true); -- tie to user_id/project as needed
