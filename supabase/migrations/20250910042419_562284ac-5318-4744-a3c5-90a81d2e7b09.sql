-- Secure RLS policies for exposed tables
-- 1) vehicle_locations: restrict SELECT to owners of the related vehicle
DROP POLICY IF EXISTS "owner can view vehicle locations" ON public.vehicle_locations;
CREATE POLICY "Users can view their vehicle locations"
ON public.vehicle_locations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.vehicles v
    WHERE v.id::text = vehicle_locations.vehicle_id
      AND v.user_id = auth.uid()
  )
);

-- 2) route_exceptions: restrict SELECT to owners of the related route
DROP POLICY IF EXISTS "owner can view exceptions" ON public.route_exceptions;
CREATE POLICY "Users can view their route exceptions"
ON public.route_exceptions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.routes r
    WHERE r.id = route_exceptions.route_id
      AND r.user_id = auth.uid()
  )
);

-- 3) demand_event_logs: restrict SELECT to owners of the related node
DROP POLICY IF EXISTS "user can view demand events" ON public.demand_event_logs;
CREATE POLICY "Users can view own demand events"
ON public.demand_event_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.supply_nodes n
    WHERE n.id = demand_event_logs.node_id
      AND n.user_id = auth.uid()
  )
);

-- 4) route_event_logs: restrict SELECT to owners of the related route
DROP POLICY IF EXISTS "owner can view events" ON public.route_event_logs;
CREATE POLICY "Users can view their route events"
ON public.route_event_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.routes r
    WHERE r.id = route_event_logs.route_id
      AND r.user_id = auth.uid()
  )
);

-- 5) perishable_inventory: restrict SELECT to owners of the related inventory item
DROP POLICY IF EXISTS "user can view perishables" ON public.perishable_inventory;
CREATE POLICY "Users can view own perishable inventory"
ON public.perishable_inventory
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.inventory_items i
    WHERE i.id = perishable_inventory.item_id
      AND i.user_id = auth.uid()
  )
);

-- 6) inventory_scenarios: restrict SELECT to record owner
DROP POLICY IF EXISTS "user can view inventory scenarios" ON public.inventory_scenarios;
CREATE POLICY "Users can view own inventory scenarios"
ON public.inventory_scenarios
FOR SELECT
USING (auth.uid() = user_id);
