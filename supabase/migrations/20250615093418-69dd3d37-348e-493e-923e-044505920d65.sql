
-- 1. Extend supply_routes for multi-modal/mode options, CO2/risk/ETA
ALTER TABLE public.supply_routes
  ADD COLUMN IF NOT EXISTS transport_mode text DEFAULT 'road',           -- e.g., road, rail, sea, air, multimodal
  ADD COLUMN IF NOT EXISTS co2_emissions numeric DEFAULT 0,              -- estimated CO2 per route
  ADD COLUMN IF NOT EXISTS risk_score numeric DEFAULT 0,                 -- risk (theft, delay, etc.)
  ADD COLUMN IF NOT EXISTS estimated_arrival timestamp with time zone,   -- predicted ETA
  ADD COLUMN IF NOT EXISTS live_status text DEFAULT 'inactive';          -- e.g., active, delayed, disrupted

-- 2. Create transport_modes reference table for allowed modes/types
CREATE TABLE IF NOT EXISTS public.transport_modes (
  id serial PRIMARY KEY,
  mode_name text UNIQUE NOT NULL,          -- road, rail, air, sea, multimodal
  description text,
  co2_factor numeric,                      -- tCO2 per km reference
  speed_avg numeric                        -- km/h (reference)
);

-- 3. Create route_event_logs for traffic/incidents/real-time events
CREATE TABLE IF NOT EXISTS public.route_event_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES public.supply_routes(id) ON DELETE CASCADE,
  vehicle_id text,
  timestamp timestamp with time zone DEFAULT now(),
  event_type text,                        -- e.g., traffic, incident, risk_alert, reroute
  event_data jsonb,
  severity text DEFAULT 'info',           -- info, warning, critical
  handled boolean DEFAULT false
);

-- 4. Create vehicle_locations for real-time/fleet tracking
CREATE TABLE IF NOT EXISTS public.vehicle_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  timestamp timestamp with time zone DEFAULT now(),
  status text DEFAULT 'on_route',         -- e.g., on_route, delayed, stopped, arrived
  event jsonb
);

-- 5. Create route_exceptions for tracking disruption/severe events
CREATE TABLE IF NOT EXISTS public.route_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES public.supply_routes(id) ON DELETE CASCADE,
  exception_type text,                    -- accident, breakdown, weather, strike, etc.
  start_time timestamp with time zone DEFAULT now(),
  end_time timestamp with time zone,
  severity text DEFAULT 'critical',
  notes text
);

-- 6. Add indexes for performance on new event tables
CREATE INDEX IF NOT EXISTS idx_route_event_route_id ON public.route_event_logs(route_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_locations_vehicle_id ON public.vehicle_locations(vehicle_id);

-- 7. Enable RLS where appropriate for user-level isolation
ALTER TABLE public.route_event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_exceptions ENABLE ROW LEVEL SECURITY;

-- 8. Policies: only allow access to owner's data
CREATE POLICY "owner can view events"
  ON public.route_event_logs FOR SELECT
  USING (true); -- (Adjust to tie vehicle/route/owner to user_id as needed)
CREATE POLICY "owner can view vehicle locations"
  ON public.vehicle_locations FOR SELECT
  USING (true); -- (Adjust as above)
CREATE POLICY "owner can view exceptions"
  ON public.route_exceptions FOR SELECT
  USING (true); -- (Adjust as above)
