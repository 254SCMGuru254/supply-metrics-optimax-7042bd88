
import { InventoryItem, EOQResult, ABCAnalysisResult } from "@/components/map/MapTypes";

export const calculateEOQ = (item: InventoryItem): EOQResult => {
  const annualDemand = item.annualDemand || item.demandRate * 12;
  const holdingCost = item.unitCost * item.holdingCostRate;
  
  // EOQ Formula: √(2DS/H)
  const eoq = Math.sqrt((2 * annualDemand * item.orderingCost) / holdingCost);
  
  // Calculate costs
  const orderingCost = (annualDemand / eoq) * item.orderingCost;
  const holdingCostTotal = (eoq / 2) * holdingCost;
  const totalCost = orderingCost + holdingCostTotal;
  
  // Calculate other metrics
  const ordersPerYear = annualDemand / eoq;
  const cycleTime = eoq / item.demandRate;
  
  return {
    eoq: Math.round(eoq),
    economicOrderQuantity: Math.round(eoq),
    totalCost: Math.round(totalCost),
    totalAnnualCost: Math.round(totalCost),
    orderingCost: Math.round(orderingCost),
    holdingCost: Math.round(holdingCostTotal),
    reorderPoint: item.reorderPoint,
    safetyStock: item.safetyStock,
    ordersPerYear: Math.round(ordersPerYear * 100) / 100,
    cycleTime: Math.round(cycleTime * 100) / 100
  };
};

export const calculateSafetyStock = (
  leadTimeDemand: number,
  leadTimeStdDev: number,
  serviceLevel: number = 95
): number => {
  // Z-score for service level
  const zScores: { [key: number]: number } = {
    90: 1.28,
    95: 1.65,
    99: 2.33,
    99.9: 3.09
  };
  
  const zScore = zScores[serviceLevel] || 1.65;
  return Math.ceil(zScore * leadTimeStdDev);
};

export const performABCAnalysis = (items: InventoryItem[]): ABCAnalysisResult => {
  if (items.length === 0) {
    return {
      item: items[0],
      annualValue: 0,
      percentage: 0,
      cumulativePercentage: 0,
      classification: 'C',
      classA: [],
      classB: [],
      classC: [],
      metrics: {
        totalItems: 0,
        totalValue: 0,
        aItems: 0,
        bItems: 0,
        cItems: 0,
        classAValuePercentage: 0
      }
    };
  }

  // Calculate annual value for each item
  const itemsWithValue = items.map(item => ({
    ...item,
    annualValue: (item.annualDemand || item.demandRate * 12) * item.unitCost
  }));

  // Sort by annual value descending
  itemsWithValue.sort((a, b) => b.annualValue - a.annualValue);

  const totalValue = itemsWithValue.reduce((sum, item) => sum + item.annualValue, 0);
  let cumulativeValue = 0;

  // Classify items
  const classifiedItems = itemsWithValue.map((item, index) => {
    cumulativeValue += item.annualValue;
    const percentage = (item.annualValue / totalValue) * 100;
    const cumulativePercentage = (cumulativeValue / totalValue) * 100;
    
    let classification: 'A' | 'B' | 'C';
    if (cumulativePercentage <= 80) {
      classification = 'A';
    } else if (cumulativePercentage <= 95) {
      classification = 'B';
    } else {
      classification = 'C';
    }

    return {
      item,
      annualValue: item.annualValue,
      percentage,
      cumulativePercentage,
      classification
    };
  });

  // Group by classification
  const classA = classifiedItems.filter(item => item.classification === 'A');
  const classB = classifiedItems.filter(item => item.classification === 'B');
  const classC = classifiedItems.filter(item => item.classification === 'C');

  const classAValue = classA.reduce((sum, item) => sum + item.annualValue, 0);

  return {
    item: classifiedItems[0]?.item || items[0],
    annualValue: classifiedItems[0]?.annualValue || 0,
    percentage: classifiedItems[0]?.percentage || 0,
    cumulativePercentage: classifiedItems[0]?.cumulativePercentage || 0,
    classification: classifiedItems[0]?.classification || 'C',
    classA: classA.map(c => c.item),
    classB: classB.map(c => c.item),
    classC: classC.map(c => c.item),
    metrics: {
      totalItems: items.length,
      totalValue,
      aItems: classA.length,
      bItems: classB.length,
      cItems: classC.length,
      classAValuePercentage: (classAValue / totalValue) * 100
    }
  };
};

export const calculateReorderPoint = (
  averageDemand: number,
  leadTime: number,
  safetyStock: number
): number => {
  return Math.ceil((averageDemand * leadTime) + safetyStock);
};

export const optimizeInventoryPolicy = (
  items: InventoryItem[],
  constraints?: {
    maxInvestment?: number;
    minServiceLevel?: number;
    maxOrderFrequency?: number;
  }
): InventoryItem[] => {
  return items.map(item => {
    const eoqResult = calculateEOQ(item);
    const safetyStock = calculateSafetyStock(
      item.demandRate * item.leadTime,
      item.demandRate * 0.2, // Assuming 20% demand variability
      item.serviceLevel || 95
    );
    
    const reorderPoint = calculateReorderPoint(
      item.demandRate,
      item.leadTime,
      safetyStock
    );

    return {
      ...item,
      economicOrderQuantity: eoqResult.eoq,
      safetyStock,
      reorderPoint
    };
  });
};
