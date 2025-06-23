-- 1. Inventory Turnover
create or replace view v_inventory_turnover as
select
  project_id,
  sum(sales_quantity)::float / nullif(avg(inventory_level), 0) as value
from inventory_items
group by project_id;

-- 2. Stockout Rate
create or replace view v_stockout_rate as
select
  project_id,
  sum(case when stockout = true then 1 else 0 end)::float / count(*) as value
from inventory_transactions
group by project_id;

-- 3. Order Fill Rate
create or replace view v_order_fill_rate as
select
  project_id,
  sum(case when fulfilled = true then 1 else 0 end)::float / count(*) as value
from orders
group by project_id;

-- 4. On-Time Delivery
create or replace view v_on_time_delivery as
select
  project_id,
  sum(case when delivered_on_time = true then 1 else 0 end)::float / count(*) as value
from deliveries
group by project_id;

-- 5. Lead Time (average days between order and fulfillment)
create or replace view v_lead_time as
select
  project_id,
  avg(extract(day from (fulfilled_date - order_date))) as value
from orders
where fulfilled = true
group by project_id;

-- 6. Perfect Order Rate
create or replace view v_perfect_order_rate as
select
  project_id,
  sum(case when fulfilled = true and returned = false then 1 else 0 end)::float / count(*) as value
from orders
group by project_id;

-- 7. Supplier Lead Time
create or replace view v_supplier_lead_time as
select
  project_id,
  avg(lead_time) as value
from suppliers
group by project_id;

-- 8. Supplier On-Time Delivery
create or replace view v_supplier_on_time_delivery as
select
  project_id,
  sum(case when on_time_delivery = true then 1 else 0 end)::float / count(*) as value
from suppliers
group by project_id;

-- 9. Procurement Cost per Order
create or replace view v_procurement_cost_per_order as
select
  project_id,
  avg(cost) as value
from procurements
group by project_id;

-- 10. Freight Cost per Unit
create or replace view v_freight_cost_per_unit as
select
  project_id,
  avg(freight_cost) as value
from routes
group by project_id;

-- 11. Warehouse Utilization
create or replace view v_warehouse_utilization as
select
  project_id,
  avg(used_space / nullif(total_space,0)) * 100 as value
from warehouse_snapshots
group by project_id;

-- 12. Customer Satisfaction (assume a survey table)
create or replace view v_customer_satisfaction as
select
  project_id,
  avg(score) as value
from customer_surveys
group by project_id;

-- 13. CO2 Emissions per Shipment
create or replace view v_co2_emissions_per_shipment as
select
  project_id,
  avg(co2_emissions) as value
from routes
group by project_id;

-- 14. Carrying Cost of Inventory (assume annual_cost column)
create or replace view v_carrying_cost_of_inventory as
select
  project_id,
  avg(annual_cost) as value
from inventory_items
group by project_id;

-- 15. Inventory Accuracy (assume physical_count and system_count columns)
create or replace view v_inventory_accuracy as
select
  project_id,
  avg(case when physical_count = system_count then 1 else 0 end)::float * 100 as value
from inventory_items
group by project_id;

-- 16. Backorder Rate
create or replace view v_backorder_rate as
select
  project_id,
  sum(case when backordered = true then 1 else 0 end)::float / count(*) as value
from orders
group by project_id;

-- 17. Dead Stock Percentage (assume last_movement_date)
create or replace view v_dead_stock_percentage as
select
  project_id,
  sum(case when last_movement_date < now() - interval '180 days' then 1 else 0 end)::float / count(*) * 100 as value
from inventory_items
group by project_id;

-- 18. Order Lead Time (days)
create or replace view v_order_lead_time as
select
  project_id,
  avg(extract(day from (fulfilled_date - order_date))) as value
from orders
where fulfilled = true
group by project_id;

-- 19. Return Rate
create or replace view v_return_rate as
select
  project_id,
  sum(case when returned = true then 1 else 0 end)::float / count(*) as value
from orders
group by project_id;

-- 20. Gross Margin Return on Inventory Investment (GMROII)
create or replace view v_gmroii as
select
  project_id,
  sum(gross_margin) / nullif(sum(inventory_investment),0) as value
from sales
group by project_id;

-- 21. Cash-to-Cash Cycle Time
create or replace view v_cash_to_cash_cycle_time as
select
  project_id,
  avg(cash_to_cash_days) as value
from cash_flows
group by project_id; 