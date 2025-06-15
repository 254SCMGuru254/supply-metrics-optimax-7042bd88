
// Enterprise-grade Demand Event Log Schema
export type DemandEventLogRow = {
  id: string;
  node_id: string | null;
  timestamp: string | null;
  event_type: string | null; // e.g., observed, predicted, anomaly, stockout, demand_spike
  event_data: any | null;
  severity: string | null; // info, warning, critical
  handled: boolean | null;
};
export type DemandEventLogInsert = Partial<Omit<DemandEventLogRow, 'id'>>;
export type DemandEventLogUpdate = Partial<DemandEventLogRow>;
