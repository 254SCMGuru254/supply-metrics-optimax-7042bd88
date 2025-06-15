
// Enterprise-grade Facility Location Model
export type FacilityLocationRow = {
  id: string;
  project_id: string;
  user_id: string;
  scenario_name: string;
  scenario_type: string | null; // base, expansion, relocation, etc.
  facilities: any | null; // Facilities/centers and candidates
  demand_points: any | null; // Paints to demand points
  optimization_params: any | null; // Optimization/solver params
  optimization_results: any | null; // {allocation, costs, etc.}
  risk_factors: any | null; // {risk, disruption, etc.}
  dynamic_plan: any | null; // {timeline of moves, phased expansions}
  created_at: string | null;
  updated_at: string | null;
};

export type FacilityLocationInsert = Partial<Omit<FacilityLocationRow, 'id' | 'project_id' | 'user_id' | 'scenario_name'>> & {
  project_id: string;
  user_id: string;
  scenario_name: string;
};
export type FacilityLocationUpdate = Partial<FacilityLocationRow>;
