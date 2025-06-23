-- Upsert all KPIs from views into the kpis table
create or replace function upsert_all_kpis()
returns void as $$
declare
  rec record;
begin
  -- 1. Inventory Turnover (kpi_id = 1)
  for rec in select * from v_inventory_turnover loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'inventory', 1, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 2. Stockout Rate (kpi_id = 2)
  for rec in select * from v_stockout_rate loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'inventory', 2, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 3. Order Fill Rate (kpi_id = 3)
  for rec in select * from v_order_fill_rate loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'orders', 3, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 4. On-Time Delivery (kpi_id = 4)
  for rec in select * from v_on_time_delivery loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'deliveries', 4, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 5. Lead Time (kpi_id = 5)
  for rec in select * from v_lead_time loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'orders', 5, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 6. Perfect Order Rate (kpi_id = 6)
  for rec in select * from v_perfect_order_rate loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'orders', 6, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 7. Supplier Lead Time (kpi_id = 7)
  for rec in select * from v_supplier_lead_time loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'suppliers', 7, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 8. Supplier On-Time Delivery (kpi_id = 8)
  for rec in select * from v_supplier_on_time_delivery loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'suppliers', 8, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 9. Procurement Cost per Order (kpi_id = 9)
  for rec in select * from v_procurement_cost_per_order loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'procurements', 9, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 10. Freight Cost per Unit (kpi_id = 10)
  for rec in select * from v_freight_cost_per_unit loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'routes', 10, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 11. Warehouse Utilization (kpi_id = 11)
  for rec in select * from v_warehouse_utilization loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'warehouse', 11, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 12. Customer Satisfaction (kpi_id = 12)
  for rec in select * from v_customer_satisfaction loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'customer', 12, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 13. CO2 Emissions per Shipment (kpi_id = 13)
  for rec in select * from v_co2_emissions_per_shipment loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'routes', 13, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 14. Carrying Cost of Inventory (kpi_id = 14)
  for rec in select * from v_carrying_cost_of_inventory loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'inventory', 14, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 15. Inventory Accuracy (kpi_id = 15)
  for rec in select * from v_inventory_accuracy loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'inventory', 15, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 16. Backorder Rate (kpi_id = 16)
  for rec in select * from v_backorder_rate loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'orders', 16, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 17. Dead Stock Percentage (kpi_id = 17)
  for rec in select * from v_dead_stock_percentage loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'inventory', 17, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 18. Order Lead Time (kpi_id = 18)
  for rec in select * from v_order_lead_time loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'orders', 18, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 19. Return Rate (kpi_id = 19)
  for rec in select * from v_return_rate loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'orders', 19, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 20. GMROII (kpi_id = 20)
  for rec in select * from v_gmroii loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'sales', 20, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
  -- 21. Cash-to-Cash Cycle Time (kpi_id = 21)
  for rec in select * from v_cash_to_cash_cycle_time loop
    insert into kpis (project_id, model_id, kpi_id, value, recorded_at)
    values (rec.project_id, 'finance', 21, rec.value, now())
    on conflict (project_id, model_id, kpi_id) do update set value = excluded.value, recorded_at = now();
  end loop;
end;
$$ language plpgsql; 