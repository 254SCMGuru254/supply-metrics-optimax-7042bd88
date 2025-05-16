
/**
 * Network design cost calculation utilities
 */

// Constants
const TRUNKING_BASE_COST = 4.70; // Base cost per unit throughput
const TRUNKING_DISTANCE_COST = 0.06; // Cost per unit throughput per km
const LOCAL_DELIVERY_BASE_COST = 7.5; // Base cost per unit throughput
const LOCAL_DELIVERY_DISTANCE_COST = 0.2; // Cost per unit throughput per km
const VARIABLE_DEPOT_COST_FACTOR = 4.9; // Cost per unit throughput
const EARTH_RADIUS_KM = 6371; // Earth radius in kilometers

/**
 * Calculate distance between two points using Pythagoras Theorem with Earth curvature adjustment
 * 
 * H = (longA - longB) × cos(latB)
 * V = (latA - latB)
 * D = √(H² + V²)
 * D_km = D × (2π × 6371 / 360)
 */
export const calculateDistance = (
  latA: number, 
  longA: number, 
  latB: number, 
  longB: number
): number => {
  // Convert latitude to radians for cos calculation
  const latBRad = (latB * Math.PI) / 180;
  
  // Horizontal component
  const H = (longA - longB) * Math.cos(latBRad);
  
  // Vertical component
  const V = latA - latB;
  
  // Distance in degrees
  const D = Math.sqrt(H * H + V * V);
  
  // Convert to kilometers
  const D_km = D * (2 * Math.PI * EARTH_RADIUS_KM / 360);
  
  return D_km;
};

/**
 * Calculate trunking cost between factory and depot
 * Trunking cost = 4.70 × throughput + 0.06 × throughput × distance
 */
export const calculateTrunkingCost = (throughput: number, distanceKm: number): number => {
  return TRUNKING_BASE_COST * throughput + TRUNKING_DISTANCE_COST * throughput * distanceKm;
};

/**
 * Calculate local delivery cost between depot and customer
 * Local delivery cost = 7.5 × throughput + 0.2 × throughput × distance
 */
export const calculateLocalDeliveryCost = (throughput: number, distanceKm: number): number => {
  return LOCAL_DELIVERY_BASE_COST * throughput + LOCAL_DELIVERY_DISTANCE_COST * throughput * distanceKm;
};

/**
 * Calculate depot cost
 * Depot cost = fixed cost + variable cost
 * Variable depot cost = 4.9 × throughput
 */
export const calculateDepotCost = (throughput: number, fixedCost: number): number => {
  const variableDepotCost = VARIABLE_DEPOT_COST_FACTOR * throughput;
  return fixedCost + variableDepotCost;
};

/**
 * Calculate stock holding cost
 * Stock holding cost = production cost × stock level × monthly holding rate
 */
export const calculateStockHoldingCost = (
  productionCost: number, 
  stockLevelDays: number, 
  transitTimeDays: number,
  monthlyHoldingRate: number
): number => {
  // Convert days to months (assuming 30 days per month)
  const totalStockLevelMonths = (stockLevelDays + transitTimeDays) / 30;
  return productionCost * totalStockLevelMonths * monthlyHoldingRate;
};

/**
 * Calculate total network cost
 */
export const calculateTotalNetworkCost = (
  trunkingCost: number,
  deliveryCost: number,
  depotCost: number,
  stockHoldingCost: number
): number => {
  return trunkingCost + deliveryCost + depotCost + stockHoldingCost;
};
