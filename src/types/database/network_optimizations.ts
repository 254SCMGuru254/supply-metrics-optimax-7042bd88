
// Enterprise-grade Network Optimization Model
export type NetworkOptimizationRow = {
  id: string;
  project_id: string;
  user_id: string;
  network_graph: any; // Node & link graph (structure, attributes, etc.)
  optimization_params: any | null; // All solver/algorithm options, constraints
  metrics: any | null; // {cost, bottlenecks, throughput, savings, kpis...}
  resilience_metrics: any | null; // {redundancy, connectivity, disruption_response, risk_scores, ...}
  multi_echelon_settings: any | null; // Configs or links to multi-tier setups
  as_is_snapshot: any | null; // Input config before optimization
  optimized_snapshot: any | null; // Optimized solution graph/settings
  created_at: string | null;
  updated_at: string | null;
};

export type NetworkOptimizationInsert = Partial<Omit<NetworkOptimizationRow, 'id' | 'network_graph' | 'project_id' | 'user_id'>> & {
  project_id: string;
  user_id: string;
  network_graph: any;
};
export type NetworkOptimizationUpdate = Partial<NetworkOptimizationRow>;
