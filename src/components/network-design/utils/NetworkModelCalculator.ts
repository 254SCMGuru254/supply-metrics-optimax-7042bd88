
import { 
  Factory, 
  Depot, 
  Customer, 
  NetworkModel, 
  CostAnalysis 
} from '../types/NetworkTypes';
import { 
  calculateDistance, 
  calculateTrunkingCost, 
  calculateLocalDeliveryCost, 
  calculateDepotCost, 
  calculateStockHoldingCost 
} from './CostUtils';

/**
 * Calculate throughput for each depot based on customers it serves
 */
export const calculateDepotThroughputs = (model: NetworkModel): NetworkModel => {
  const updatedDepots = model.depots.map(depot => {
    const servedCustomers = model.customers.filter(
      customer => depot.servesCustomerIds.includes(customer.id)
    );
    
    const throughput = servedCustomers.reduce(
      (sum, customer) => sum + customer.demand, 
      0
    );
    
    return { ...depot, throughput };
  });
  
  return {
    ...model,
    depots: updatedDepots
  };
};

/**
 * Calculate cost analysis for the entire network
 */
export const calculateNetworkCosts = (model: NetworkModel): CostAnalysis => {
  // Ensure depot throughputs are calculated
  const updatedModel = calculateDepotThroughputs(model);
  
  // Initialize cost tracking
  let totalTrunkingCost = 0;
  let totalDeliveryCost = 0;
  let totalDepotCost = 0;
  let totalStockHoldingCost = 0;
  
  const depotCostBreakdown: Record<string, {
    trunkingCost: number;
    deliveryCost: number;
    depotCost: number;
    stockHoldingCost: number;
    totalCost: number;
  }> = {};
  
  // Calculate costs for each depot
  updatedModel.depots.forEach(depot => {
    // Find associated factory
    const factory = depot.factoryId 
      ? updatedModel.factories.find(f => f.id === depot.factoryId)
      : undefined;
    
    // Trunking cost (factory to depot)
    let depotTrunkingCost = 0;
    if (factory) {
      const distance = calculateDistance(
        factory.latitude,
        factory.longitude,
        depot.latitude,
        depot.longitude
      );
      depotTrunkingCost = calculateTrunkingCost(depot.throughput, distance);
    }
    totalTrunkingCost += depotTrunkingCost;
    
    // Local delivery costs (depot to customers)
    let depotDeliveryCost = 0;
    const servedCustomers = updatedModel.customers.filter(
      customer => depot.servesCustomerIds.includes(customer.id)
    );
    
    servedCustomers.forEach(customer => {
      const distance = calculateDistance(
        depot.latitude,
        depot.longitude,
        customer.latitude,
        customer.longitude
      );
      depotDeliveryCost += calculateLocalDeliveryCost(customer.demand, distance);
    });
    totalDeliveryCost += depotDeliveryCost;
    
    // Depot operating cost
    const depotOperatingCost = calculateDepotCost(depot.throughput, depot.fixedCost);
    totalDepotCost += depotOperatingCost;
    
    // Stock holding cost
    let depotStockHoldingCost = 0;
    if (factory) {
      depotStockHoldingCost = calculateStockHoldingCost(
        factory.productionCost,
        model.settings.stockLevelDays,
        model.settings.transitTimeDays,
        model.settings.monthlyHoldingRate
      ) * depot.throughput;
    }
    totalStockHoldingCost += depotStockHoldingCost;
    
    // Store breakdown by depot
    depotCostBreakdown[depot.id] = {
      trunkingCost: depotTrunkingCost,
      deliveryCost: depotDeliveryCost,
      depotCost: depotOperatingCost,
      stockHoldingCost: depotStockHoldingCost,
      totalCost: depotTrunkingCost + depotDeliveryCost + depotOperatingCost + depotStockHoldingCost
    };
  });
  
  const totalCost = totalTrunkingCost + totalDeliveryCost + totalDepotCost + totalStockHoldingCost;
  
  return {
    totalCost,
    trunkingCost: totalTrunkingCost,
    deliveryCost: totalDeliveryCost,
    depotCost: totalDepotCost,
    stockHoldingCost: totalStockHoldingCost,
    breakdown: {
      byDepot: depotCostBreakdown
    }
  };
};
