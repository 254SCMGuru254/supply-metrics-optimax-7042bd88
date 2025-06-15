
// Enterprise-grade Inventory Scenario Model
export type InventoryScenarioRow = {
  id: string;
  project_id: string | null;
  user_id: string | null;
  scenario_name: string;
  scenario_type: string | null; // e.g., base, disruption, demand_spike, supply_delay
  parameters: any | null; // Extend for param schema
  results: any | null;    // Extend for output typings
  created_at: string | null;
};
export type InventoryScenarioInsert = Partial<Omit<InventoryScenarioRow, 'id' | 'scenario_name'>> & { scenario_name: string };
export type InventoryScenarioUpdate = Partial<InventoryScenarioRow>;
