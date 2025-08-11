-- Security hardening for new functions: set immutable search_path
CREATE OR REPLACE FUNCTION public.calculate_eoq(
  annual_demand NUMERIC,
  ordering_cost NUMERIC,
  holding_cost_rate NUMERIC,
  unit_cost NUMERIC
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  eoq NUMERIC;
  total_cost NUMERIC;
  orders_per_year NUMERIC;
BEGIN
  IF holding_cost_rate > 0 AND annual_demand > 0 THEN
    eoq := SQRT(2 * annual_demand * ordering_cost / (holding_cost_rate * unit_cost));
    orders_per_year := annual_demand / eoq;
    total_cost := (annual_demand / eoq) * ordering_cost + (eoq / 2) * holding_cost_rate * unit_cost;
  ELSE
    eoq := 0;
    orders_per_year := 0;
    total_cost := 0;
  END IF;
  RETURN jsonb_build_object(
    'eoq', eoq,
    'orders_per_year', orders_per_year,
    'total_annual_cost', total_cost,
    'time_between_orders', CASE WHEN orders_per_year > 0 THEN 365.0 / orders_per_year ELSE 0 END
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_safety_stock(
  service_level NUMERIC,
  demand_std_dev NUMERIC,
  lead_time_days INTEGER
) RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  z_score NUMERIC;
BEGIN
  CASE 
    WHEN service_level >= 0.99 THEN z_score := 2.33;
    WHEN service_level >= 0.95 THEN z_score := 1.65;
    WHEN service_level >= 0.90 THEN z_score := 1.28;
    ELSE z_score := 1.00;
  END CASE;
  RETURN z_score * demand_std_dev * SQRT(lead_time_days / 365.0);
END;
$$;

CREATE OR REPLACE FUNCTION public.optimize_inventory_multi_echelon(
  inventory_data JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  facility JSONB;
  result JSONB := '{}'::jsonb;
  facility_id TEXT;
  optimized JSONB;
BEGIN
  FOR facility_id, facility IN SELECT * FROM jsonb_each(inventory_data->'facilities') LOOP
    SELECT public.calculate_eoq(
      (facility->>'annual_demand')::NUMERIC,
      (facility->>'ordering_cost')::NUMERIC,
      (facility->>'holding_cost_rate')::NUMERIC,
      (facility->>'unit_cost')::NUMERIC
    ) INTO optimized;

    optimized := optimized || jsonb_build_object(
      'safety_stock', public.calculate_safety_stock(
        (facility->>'service_level')::NUMERIC,
        (facility->>'demand_std_dev')::NUMERIC,
        (facility->>'lead_time_days')::INTEGER
      )
    );

    optimized := optimized || jsonb_build_object(
      'reorder_point', 
      ((facility->>'annual_demand')::NUMERIC / 365.0) * (facility->>'lead_time_days')::INTEGER + 
      ((optimized->>'safety_stock')::NUMERIC)
    );

    result := result || jsonb_build_object(facility_id, optimized);
  END LOOP;
  RETURN result;
END;
$$;