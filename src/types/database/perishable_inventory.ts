
// Enterprise-grade Perishable Inventory Schema
export type PerishableInventoryRow = {
  id: string;
  item_id: string | null;
  batch_code: string | null;
  received_date: string | null;
  expiry_date: string | null;
  quantity: number;
  status: string | null; // e.g., in_stock, expired, at_risk, used, destroyed
  alert: boolean | null;
};
export type PerishableInventoryInsert = Partial<Omit<PerishableInventoryRow, 'id'>> & { quantity: number };
export type PerishableInventoryUpdate = Partial<PerishableInventoryRow>;
