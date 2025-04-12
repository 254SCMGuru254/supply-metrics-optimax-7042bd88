
import { InventoryItem, EOQResult, ABCAnalysisResult } from "@/components/map/MapTypes";

// Calculate Economic Order Quantity (EOQ)
export function calculateEOQ(item: InventoryItem): EOQResult {
  // Economic Order Quantity formula: EOQ = √(2DS/H)
  // Where:
  // D = Annual demand quantity
  // S = Ordering cost (per order)
  // H = Holding cost (as a fraction of unit cost)
  
  const D = item.annualDemand;
  const S = item.orderingCost;
  const H = item.holdingCost * item.unitCost; // Convert percentage to cost
  
  // Calculate EOQ
  const eoq = Math.sqrt((2 * D * S) / H);
  
  // Calculate orders per year
  const ordersPerYear = D / eoq;
  
  // Calculate cycle time in days (assuming 365 days in a year)
  const cycleTime = 365 / ordersPerYear;
  
  // Calculate total annual inventory cost
  // Total cost = Annual ordering cost + Annual holding cost
  const annualOrderingCost = S * ordersPerYear;
  const annualHoldingCost = H * (eoq / 2); // Average inventory = EOQ/2
  const totalAnnualCost = annualOrderingCost + annualHoldingCost + (D * item.unitCost);
  
  // Calculate safety stock (based on service level)
  // Using normal distribution approximation
  const z = getZScoreForServiceLevel(item.serviceLevel / 100);
  const stdDevLeadTimeDemand = Math.sqrt(item.leadTime) * (D / 365) * 0.25; // Assuming demand variation of 25%
  const safetyStock = z * stdDevLeadTimeDemand;
  
  // Calculate reorder point
  const averageDailyDemand = D / 365;
  const leadTimeDemand = averageDailyDemand * item.leadTime;
  const reorderPoint = leadTimeDemand + safetyStock;
  
  return {
    economicOrderQuantity: eoq,
    ordersPerYear,
    cycleTime,
    totalAnnualCost,
    reorderPoint,
    safetyStock
  };
}

// Perform ABC Analysis
export function performABCAnalysis(items: InventoryItem[]): ABCAnalysisResult {
  // Calculate total value for all items
  const itemsWithValue = items.map(item => ({
    ...item,
    annualValue: item.unitCost * item.annualDemand
  }));
  
  // Sort items by annual value in descending order
  const sortedItems = [...itemsWithValue].sort((a, b) => 
    b.annualValue - a.annualValue
  );
  
  const totalValue = sortedItems.reduce((sum, item) => sum + item.annualValue, 0);
  
  // Assign ABC classes
  let accumulatedValue = 0;
  const classA: InventoryItem[] = [];
  const classB: InventoryItem[] = [];
  const classC: InventoryItem[] = [];
  
  for (const item of sortedItems) {
    const itemValuePercentage = (item.annualValue / totalValue) * 100;
    accumulatedValue += itemValuePercentage;
    
    if (accumulatedValue <= 70) {
      // Class A items (approximately 70% of total value)
      classA.push({
        ...item,
        abcClass: "A"
      });
    } else if (accumulatedValue <= 90) {
      // Class B items (next 20% of total value)
      classB.push({
        ...item,
        abcClass: "B"
      });
    } else {
      // Class C items (final 10% of total value)
      classC.push({
        ...item,
        abcClass: "C"
      });
    }
  }
  
  // Calculate metrics
  const classAValue = classA.reduce((sum, item) => sum + item.annualValue, 0);
  const classBValue = classB.reduce((sum, item) => sum + item.annualValue, 0);
  const classCValue = classC.reduce((sum, item) => sum + item.annualValue, 0);
  
  const classAValuePercentage = (classAValue / totalValue) * 100;
  const classBValuePercentage = (classBValue / totalValue) * 100;
  const classCValuePercentage = (classCValue / totalValue) * 100;
  
  const classAItemPercentage = (classA.length / items.length) * 100;
  const classBItemPercentage = (classB.length / items.length) * 100;
  const classCItemPercentage = (classC.length / items.length) * 100;
  
  return {
    classA,
    classB,
    classC,
    metrics: {
      classAValuePercentage,
      classBValuePercentage,
      classCValuePercentage,
      classAItemPercentage,
      classBItemPercentage,
      classCItemPercentage
    }
  };
}

// Helper function to get Z-score for a given service level
function getZScoreForServiceLevel(serviceLevel: number): number {
  // Standard normal distribution Z-scores for common service levels
  // More accurate calculation would use inverse normal CDF
  const serviceZScores: Record<number, number> = {
    0.5: 0,
    0.75: 0.674,
    0.8: 0.84,
    0.85: 1.036,
    0.9: 1.282,
    0.95: 1.645,
    0.975: 1.96,
    0.98: 2.054,
    0.99: 2.326,
    0.995: 2.576,
    0.999: 3.09
  };
  
  // Find the closest service level
  const levels = Object.keys(serviceZScores).map(Number);
  let closestLevel = levels[0];
  let smallestDiff = Math.abs(serviceLevel - closestLevel);
  
  for (const level of levels) {
    const diff = Math.abs(serviceLevel - level);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestLevel = level;
    }
  }
  
  return serviceZScores[closestLevel];
}

// Calculate Safety Stock
export function calculateSafetyStock(
  leadTime: number,
  dailyDemand: number,
  serviceLevel: number,
  demandVariability: number = 0.25 // Default 25% variation
): number {
  const z = getZScoreForServiceLevel(serviceLevel / 100);
  const stdDevLeadTimeDemand = Math.sqrt(leadTime) * dailyDemand * demandVariability;
  return z * stdDevLeadTimeDemand;
}

// Calculate Reorder Point
export function calculateReorderPoint(
  leadTime: number,
  dailyDemand: number,
  serviceLevel: number,
  demandVariability: number = 0.25
): number {
  const leadTimeDemand = dailyDemand * leadTime;
  const safetyStock = calculateSafetyStock(leadTime, dailyDemand, serviceLevel, demandVariability);
  return leadTimeDemand + safetyStock;
}

// Calculate Inventory Turnover Ratio
export function calculateInventoryTurnover(
  annualCogsSales: number,
  averageInventoryValue: number
): number {
  return annualCogsSales / averageInventoryValue;
}
