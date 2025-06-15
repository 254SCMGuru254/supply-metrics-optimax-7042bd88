
// Enterprise-grade Fleet Management Model
export type FleetManagementRow = {
  id: string;
  project_id: string;
  user_id: string;
  fleet_config: any; // Vehicle list, types, capacities, properties
  routing_solution: any | null; // Current or recent routes/assignments
  maintenance_schedule: any | null; // {vehicle_id, schedule, logs}
  fuel_metrics: any | null; // {usage, cost, efficiency, emissions}
  telematics: any | null; // {locations, status, alerts, telemetry}
  optimization_params: any | null; // Routing, scheduling options
  optimization_results: any | null; // KPIs, costs, summary, violations
  created_at: string | null;
  updated_at: string | null;
};

export type FleetManagementInsert = Partial<Omit<FleetManagementRow, 'id' | 'project_id' | 'user_id' | 'fleet_config'>> & {
  project_id: string;
  user_id: string;
  fleet_config: any;
};
export type FleetManagementUpdate = Partial<FleetManagementRow>;
