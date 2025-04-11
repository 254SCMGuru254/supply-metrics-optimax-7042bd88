
import { Node, Route } from "@/components/map/MapTypes";

// Define an event-based simulation system
export interface SimulationEvent {
  time: number; // Time when event occurs
  type: string; // Type of event
  entityId: string; // ID of entity involved
  data: any; // Additional data
}

// Simulation parameters
export interface SimulationParams {
  durationDays: number;
  timeStep: number; // hours
  demandVariability: number; // 0-1 scale
  leadTimeVariability: number; // 0-1 scale
  serviceLevel: number; // target service level, 0-1
  initialInventory: number; // starting inventory for warehouses
  randomSeed?: number; // optional seed for reproducibility
}

// Result metrics from simulation
export interface SimulationResults {
  serviceLevel: number; // % of demand fulfilled on time
  inventoryTurns: number; // inventory turnover rate
  averageLeadTime: number; // in days
  stockoutRate: number; // % of time with zero inventory
  totalCost: number; // total logistics cost
  costBreakdown: {
    transportation: number;
    inventory: number;
    stockout: number;
  };
  events: SimulationEvent[]; // record of key events
  nodeMetrics: Map<string, NodeMetrics>; // metrics for each node
  scenarioComparison?: { // used when comparing scenarios
    baselineMetrics: any;
    improvement: number;
  };
}

// Metrics for each node
interface NodeMetrics {
  averageInventory: number;
  maxInventory: number;
  minInventory: number;
  stockoutDays: number;
  serviceLevel: number;
  inventoryProfile: {time: number, level: number}[];
}

// Random number generation with seed support
class SeededRandom {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed || Math.floor(Math.random() * 1000000);
  }

  // Simple random number generator with seed
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  // Generate a random number between min and max
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Generate a normal distribution using Box-Muller transform
  normal(mean: number, stdDev: number): number {
    const u1 = this.next();
    const u2 = this.next();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z;
  }

  // Generate a poisson distribution
  poisson(lambda: number): number {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    
    do {
      k++;
      p *= this.next();
    } while (p > L);
    
    return k - 1;
  }

  // Generate an exponential distribution
  exponential(rate: number): number {
    return -Math.log(this.next()) / rate;
  }
}

// Discrete event simulation for supply chain
export const runSupplyChainSimulation = (
  nodes: Node[], 
  routes: Route[], 
  params: SimulationParams
): SimulationResults => {
  // Initialize random number generator
  const random = new SeededRandom(params.randomSeed);
  
  // Initialize event queue
  const eventQueue: SimulationEvent[] = [];
  const processedEvents: SimulationEvent[] = [];
  
  // Initialize node states
  const nodeStates = new Map<string, {
    inventory: number;
    inTransit: number;
    backorders: number;
    lastOrderTime: number;
    nextReviewTime: number;
    inventoryProfile: {time: number, level: number}[];
    totalDemand: number;
    metDemand: number;
    stockoutDays: number;
  }>();
  
  // Create a lookup of nodes by ID
  const nodesById = new Map<string, Node>();
  nodes.forEach(node => nodesById.set(node.id, node));
  
  // Create a lookup of routes by fromId->toId
  const routeMap = new Map<string, Route>();
  routes.forEach(route => {
    const key = `${route.from}->${route.to}`;
    routeMap.set(key, route);
  });
  
  // Categorize nodes by type
  const warehouses = nodes.filter(n => n.type === "warehouse" || n.type === "distribution");
  const retailers = nodes.filter(n => n.type === "retail");
  
  if (warehouses.length === 0 || retailers.length === 0) {
    throw new Error("At least one warehouse and one retailer are required for simulation");
  }
  
  // Initialize node states
  nodes.forEach(node => {
    // Determine initial inventory based on node type
    let initialInventory = params.initialInventory;
    if (node.type === "warehouse") {
      initialInventory *= 2; // Warehouses start with more inventory
    } else if (node.type === "distribution") {
      initialInventory *= 1.5; // Distribution centers have intermediate inventory
    } else if (node.type === "retail") {
      initialInventory *= 0.8; // Retailers start with less inventory
    }
    
    nodeStates.set(node.id, {
      inventory: initialInventory,
      inTransit: 0,
      backorders: 0,
      lastOrderTime: 0,
      nextReviewTime: random.range(0, 24), // Stagger review times
      inventoryProfile: [{time: 0, level: initialInventory}],
      totalDemand: 0,
      metDemand: 0,
      stockoutDays: 0
    });
  });
  
  // Schedule initial events
  
  // Schedule demand events at retailers
  retailers.forEach(retailer => {
    // Schedule daily demand for the entire simulation period
    for (let day = 0; day < params.durationDays; day++) {
      // Generate several demand events throughout the day
      const demandEvents = random.range(1, 5);
      
      for (let i = 0; i < demandEvents; i++) {
        const hourOffset = random.range(0, 24);
        const time = day * 24 + hourOffset;
        
        // Determine base demand
        const baseDemand = retailer.capacity ? retailer.capacity / 30 : 100; // Monthly capacity ÷ 30 days
        
        // Apply variability
        const actualDemand = Math.max(1, Math.round(
          random.normal(baseDemand, baseDemand * params.demandVariability)
        ));
        
        eventQueue.push({
          time,
          type: "demand",
          entityId: retailer.id,
          data: {
            quantity: actualDemand
          }
        });
      }
    }
  });
  
  // Schedule periodic inventory review for all nodes
  nodes.forEach(node => {
    const nodeState = nodeStates.get(node.id);
    if (!nodeState) return;
    
    // Schedule reviews every 24 hours (daily)
    let reviewTime = nodeState.nextReviewTime;
    while (reviewTime < params.durationDays * 24) {
      eventQueue.push({
        time: reviewTime,
        type: "inventory_review",
        entityId: node.id,
        data: {}
      });
      
      reviewTime += 24; // Next review in 24 hours
    }
  });
  
  // Sort events by time
  eventQueue.sort((a, b) => a.time - b.time);
  
  // Process events in chronological order
  let currentTime = 0;
  
  while (eventQueue.length > 0) {
    const event = eventQueue.shift()!;
    currentTime = event.time;
    
    if (currentTime > params.durationDays * 24) {
      break; // End of simulation period
    }
    
    processedEvents.push(event);
    
    // Process event based on type
    switch (event.type) {
      case "demand":
        processDemandEvent(event, nodeStates, nodesById, routeMap, eventQueue, random, params);
        break;
        
      case "inventory_review":
        processInventoryReviewEvent(event, nodeStates, nodesById, routeMap, eventQueue, random, params);
        break;
        
      case "shipment_arrival":
        processShipmentArrivalEvent(event, nodeStates, nodesById, eventQueue, random);
        break;
    }
  }
  
  // Calculate metrics
  const nodeMetrics = new Map<string, NodeMetrics>();
  let totalServiceLevel = 0;
  let totalInventoryTurns = 0;
  let totalLeadTime = 0;
  let totalLeadTimeCount = 0;
  let totalStockoutDays = 0;
  
  // Transportation cost
  let transportationCost = processedEvents
    .filter(e => e.type === "shipment_arrival")
    .reduce((sum, e) => {
      const route = routeMap.get(`${e.data.fromId}->${e.entityId}`);
      return sum + ((route?.cost || 0) * e.data.quantity);
    }, 0);
  
  // Inventory cost (25% of product value per year)
  let inventoryCost = 0;
  let stockoutCost = 0;
  
  nodes.forEach(node => {
    const state = nodeStates.get(node.id);
    if (!state) return;
    
    // Calculate average inventory
    let sumInventory = 0;
    state.inventoryProfile.forEach(p => {
      sumInventory += p.level;
    });
    const avgInventory = sumInventory / Math.max(1, state.inventoryProfile.length);
    
    // Calculate inventory cost (assume $100 per unit, 25% holding cost per year)
    const inventoryValue = avgInventory * 100; // $100 per unit
    inventoryCost += inventoryValue * 0.25 * (params.durationDays / 365); // 25% annual cost
    
    // Calculate stockout cost ($150 per unit)
    stockoutCost += state.backorders * 150;
    
    // Calculate service level
    const serviceLevel = state.metDemand / Math.max(1, state.totalDemand);
    
    // Calculate inventory turns
    const inventoryTurns = (state.totalDemand / Math.max(1, avgInventory)) * (365 / params.durationDays);
    
    // Store metrics
    nodeMetrics.set(node.id, {
      averageInventory: avgInventory,
      maxInventory: Math.max(...state.inventoryProfile.map(p => p.level)),
      minInventory: Math.min(...state.inventoryProfile.map(p => p.level)),
      stockoutDays: state.stockoutDays,
      serviceLevel: serviceLevel * 100, // Convert to percentage
      inventoryProfile: state.inventoryProfile
    });
    
    // Add to totals for non-warehouses (only measure customer-facing metrics)
    if (node.type === "retail") {
      totalServiceLevel += serviceLevel;
      totalInventoryTurns += inventoryTurns;
      totalStockoutDays += state.stockoutDays;
    }
  });
  
  // Calculate lead time metrics from arrival events
  processedEvents
    .filter(e => e.type === "shipment_arrival")
    .forEach(e => {
      const leadTime = e.time - e.data.orderTime;
      totalLeadTime += leadTime;
      totalLeadTimeCount++;
    });
  
  // Final metrics
  const retailerCount = Math.max(1, retailers.length);
  const results: SimulationResults = {
    serviceLevel: (totalServiceLevel / retailerCount) * 100, // Convert to percentage
    inventoryTurns: totalInventoryTurns / retailerCount,
    averageLeadTime: totalLeadTime / Math.max(1, totalLeadTimeCount) / 24, // Convert to days
    stockoutRate: (totalStockoutDays / (retailerCount * params.durationDays)) * 100, // Convert to percentage
    totalCost: transportationCost + inventoryCost + stockoutCost,
    costBreakdown: {
      transportation: transportationCost,
      inventory: inventoryCost,
      stockout: stockoutCost
    },
    events: processedEvents.filter(e => e.type !== "inventory_review"), // Filter out routine events
    nodeMetrics
  };
  
  return results;
};

// Process a demand event
function processDemandEvent(
  event: SimulationEvent,
  nodeStates: Map<string, any>,
  nodesById: Map<string, Node>,
  routeMap: Map<string, Route>,
  eventQueue: SimulationEvent[],
  random: SeededRandom,
  params: SimulationParams
): void {
  const nodeId = event.entityId;
  const nodeState = nodeStates.get(nodeId);
  if (!nodeState) return;
  
  const quantity = event.data.quantity;
  nodeState.totalDemand += quantity;
  
  // Update inventory profile
  nodeState.inventoryProfile.push({
    time: event.time,
    level: nodeState.inventory
  });
  
  if (nodeState.inventory >= quantity) {
    // Sufficient inventory to meet demand
    nodeState.inventory -= quantity;
    nodeState.metDemand += quantity;
    
    // Update inventory profile after fulfillment
    nodeState.inventoryProfile.push({
      time: event.time,
      level: nodeState.inventory
    });
  } else {
    // Partial or no fulfillment
    nodeState.metDemand += nodeState.inventory;
    const unfulfilled = quantity - nodeState.inventory;
    
    // Handle backorders
    nodeState.backorders += unfulfilled;
    
    // Record stockout
    nodeState.stockoutDays += 1;
    
    // Update inventory profile
    nodeState.inventory = 0;
    nodeState.inventoryProfile.push({
      time: event.time,
      level: 0
    });
    
    // Try to expedite from nearest supplier if backorders exist
    if (nodeState.backorders > 0) {
      const node = nodesById.get(nodeId);
      if (node) {
        scheduleExpediting(node, nodeState, nodesById, routeMap, eventQueue, random, params);
      }
    }
  }
}

// Schedule expediting from supplier
function scheduleExpediting(
  node: Node,
  nodeState: any,
  nodesById: Map<string, Node>,
  routeMap: Map<string, Route>,
  eventQueue: SimulationEvent[],
  random: SeededRandom,
  params: SimulationParams
): void {
  // Find potential suppliers (warehouses or distribution centers)
  const suppliers = Array.from(nodesById.values()).filter(n => 
    n.type === "warehouse" || n.type === "distribution"
  );
  
  if (suppliers.length === 0) return;
  
  // Find closest supplier with inventory
  let closestSupplier: Node | null = null;
  let shortestTime = Infinity;
  
  suppliers.forEach(supplier => {
    const supplierState = nodeStates.get(supplier.id);
    if (!supplierState || supplierState.inventory <= 0) return;
    
    const routeKey = `${supplier.id}->${node.id}`;
    const route = routeMap.get(routeKey);
    
    if (route) {
      // Use transit time to determine closest supplier
      const transitTime = route.transitTime || calculateTransitTime(supplier, node);
      if (transitTime < shortestTime) {
        shortestTime = transitTime;
        closestSupplier = supplier;
      }
    }
  });
  
  if (closestSupplier) {
    const supplierState = nodeStates.get(closestSupplier.id);
    const expediteQuantity = Math.min(nodeState.backorders, supplierState.inventory);
    
    if (expediteQuantity > 0) {
      // Deduct from supplier inventory
      supplierState.inventory -= expediteQuantity;
      
      // Update supplier inventory profile
      supplierState.inventoryProfile.push({
        time: eventQueue[0].time, // Current simulation time
        level: supplierState.inventory
      });
      
      // Apply expedited lead time (25% faster than normal)
      const routeKey = `${closestSupplier.id}->${node.id}`;
      const route = routeMap.get(routeKey);
      let transitTime = route?.transitTime || calculateTransitTime(closestSupplier, node);
      transitTime *= 0.75; // 25% faster for expediting
      
      // Schedule arrival
      eventQueue.push({
        time: eventQueue[0].time + transitTime,
        type: "shipment_arrival",
        entityId: node.id,
        data: {
          quantity: expediteQuantity,
          fromId: closestSupplier.id,
          expedited: true,
          orderTime: eventQueue[0].time
        }
      });
      
      // Sort events by time
      eventQueue.sort((a, b) => a.time - b.time);
    }
  }
}

// Process inventory review event
function processInventoryReviewEvent(
  event: SimulationEvent,
  nodeStates: Map<string, any>,
  nodesById: Map<string, Node>,
  routeMap: Map<string, Route>,
  eventQueue: SimulationEvent[],
  random: SeededRandom,
  params: SimulationParams
): void {
  const nodeId = event.entityId;
  const nodeState = nodeStates.get(nodeId);
  const node = nodesById.get(nodeId);
  
  if (!nodeState || !node) return;
  
  // Update inventory profile
  nodeState.inventoryProfile.push({
    time: event.time,
    level: nodeState.inventory
  });
  
  // Calculate order quantity - only for non-warehouse nodes
  if (node.type !== "warehouse") {
    // Find upstream supplier
    const supplier = findSupplier(node, nodesById);
    
    if (supplier) {
      const supplierState = nodeStates.get(supplier.id);
      
      if (supplierState && supplierState.inventory > 0) {
        // Calculate order-up-to level (base stock policy)
        const targetInventory = calculateTargetInventory(node, nodeState, params);
        const orderQuantity = Math.max(0, targetInventory - nodeState.inventory - nodeState.inTransit);
        
        if (orderQuantity > 0) {
          // Limit order quantity to supplier's available inventory
          const actualQuantity = Math.min(orderQuantity, supplierState.inventory);
          
          // Update supplier's inventory
          supplierState.inventory -= actualQuantity;
          
          // Update supplier's inventory profile
          supplierState.inventoryProfile.push({
            time: event.time,
            level: supplierState.inventory
          });
          
          // Schedule shipment arrival
          const routeKey = `${supplier.id}->${nodeId}`;
          const route = routeMap.get(routeKey);
          
          // Calculate transit time with variability
          let baseTransitTime = route?.transitTime || calculateTransitTime(supplier, node);
          
          // Apply lead time variability
          let actualTransitTime = baseTransitTime * (1 + random.range(-params.leadTimeVariability, params.leadTimeVariability));
          actualTransitTime = Math.max(1, actualTransitTime); // Minimum 1 hour transit time
          
          // Schedule arrival
          const arrivalTime = event.time + actualTransitTime;
          
          eventQueue.push({
            time: arrivalTime,
            type: "shipment_arrival",
            entityId: nodeId,
            data: {
              quantity: actualQuantity,
              fromId: supplier.id,
              expedited: false,
              orderTime: event.time
            }
          });
          
          // Update in-transit inventory
          nodeState.inTransit += actualQuantity;
          
          // Update order time
          nodeState.lastOrderTime = event.time;
        }
      }
    }
  }
  
  // Schedule next review
  nodeState.nextReviewTime = event.time + 24; // Next review in 24 hours
  
  eventQueue.push({
    time: nodeState.nextReviewTime,
    type: "inventory_review",
    entityId: nodeId,
    data: {}
  });
  
  // Sort events by time
  eventQueue.sort((a, b) => a.time - b.time);
}

// Process shipment arrival event
function processShipmentArrivalEvent(
  event: SimulationEvent,
  nodeStates: Map<string, any>,
  nodesById: Map<string, Node>,
  eventQueue: SimulationEvent[],
  random: SeededRandom
): void {
  const nodeId = event.entityId;
  const nodeState = nodeStates.get(nodeId);
  
  if (!nodeState) return;
  
  const quantity = event.data.quantity;
  
  // Update in-transit inventory
  nodeState.inTransit -= quantity;
  
  // Update inventory profile before receiving
  nodeState.inventoryProfile.push({
    time: event.time,
    level: nodeState.inventory
  });
  
  // Handle backorders first
  if (nodeState.backorders > 0) {
    const backordersFulfilled = Math.min(nodeState.backorders, quantity);
    nodeState.backorders -= backordersFulfilled;
    nodeState.metDemand += backordersFulfilled;
    
    // Remaining quantity after fulfilling backorders
    const remaining = quantity - backordersFulfilled;
    nodeState.inventory += remaining;
  } else {
    // No backorders, add to inventory
    nodeState.inventory += quantity;
  }
  
  // Update inventory profile after receiving
  nodeState.inventoryProfile.push({
    time: event.time,
    level: nodeState.inventory
  });
}

// Find a suitable supplier for the node
function findSupplier(node: Node, nodesById: Map<string, Node>): Node | null {
  // If node is retail, look for distribution centers
  if (node.type === "retail") {
    const distributions = Array.from(nodesById.values()).filter(n => n.type === "distribution");
    if (distributions.length > 0) {
      return findClosestNode(node, distributions);
    }
  }
  
  // Default to warehouses
  const warehouses = Array.from(nodesById.values()).filter(n => n.type === "warehouse");
  if (warehouses.length > 0) {
    return findClosestNode(node, warehouses);
  }
  
  return null;
}

// Find closest node by distance
function findClosestNode(node: Node, candidates: Node[]): Node {
  let closestNode = candidates[0];
  let shortestDistance = calculateDistance(node, candidates[0]);
  
  for (let i = 1; i < candidates.length; i++) {
    const distance = calculateDistance(node, candidates[i]);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      closestNode = candidates[i];
    }
  }
  
  return closestNode;
}

// Calculate distance between nodes
function calculateDistance(node1: Node, node2: Node): number {
  const dx = node1.latitude - node2.latitude;
  const dy = node1.longitude - node2.longitude;
  return Math.sqrt(dx * dx + dy * dy);
}

// Calculate transit time between nodes
function calculateTransitTime(fromNode: Node, toNode: Node): number {
  const distance = calculateDistance(fromNode, toNode) * 111; // Rough km conversion
  const speed = 60; // km/h
  return Math.max(1, distance / speed); // hours, minimum 1 hour
}

// Calculate target inventory level
function calculateTargetInventory(node: Node, nodeState: any, params: SimulationParams): number {
  // Base stock policy: cover expected demand during lead time plus safety stock
  
  // Estimate daily demand based on historical demand
  const dailyDemand = Math.max(1, nodeState.totalDemand / Math.max(1, nodeState.inventoryProfile.length / 24));
  
  // Estimate lead time based on node type
  let leadTimeDays: number;
  switch (node.type) {
    case "distribution":
      leadTimeDays = 2;
      break;
    case "retail":
      leadTimeDays = 1;
      break;
    default:
      leadTimeDays = 3;
  }
  
  // Expected demand during lead time
  const expectedDemand = dailyDemand * leadTimeDays;
  
  // Safety stock based on service level, demand variability, and lead time
  const z = normalInv(params.serviceLevel); // z-score for desired service level
  const safetyStock = z * Math.sqrt(expectedDemand) * params.demandVariability;
  
  return Math.round(expectedDemand + safetyStock);
}

// Approximate inverse of standard normal CDF
function normalInv(p: number): number {
  // Rational approximation for standard normal inverse CDF
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  
  const a1 = -3.969683028665376e+01;
  const a2 = 2.209460984245205e+02;
  const a3 = -2.759285104469687e+02;
  const a4 = 1.383577518672690e+02;
  const a5 = -3.066479806614716e+01;
  const a6 = 2.506628277459239e+00;
  
  const b1 = -5.447609879822406e+01;
  const b2 = 1.615858368580409e+02;
  const b3 = -1.556989798598866e+02;
  const b4 = 6.680131188771972e+01;
  const b5 = -1.328068155288572e+01;
  
  const c1 = -7.784894002430293e-03;
  const c2 = -3.223964580411365e-01;
  const c3 = -2.400758277161838e+00;
  const c4 = -2.549732539343734e+00;
  const c5 = 4.374664141464968e+00;
  const c6 = 2.938163982698783e+00;
  
  const d1 = 7.784695709041462e-03;
  const d2 = 3.224671290700398e-01;
  const d3 = 2.445134137142996e+00;
  const d4 = 3.754408661907416e+00;
  
  let q, r;
  
  if (p < 0.02425) {
    // Lower region
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
           ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p < 0.97575) {
    // Central region
    q = p - 0.5;
    r = q * q;
    return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
           (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    // Upper region
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
            ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
}

// Run Monte Carlo simulation for risk analysis
export const runRiskAnalysis = (
  nodes: Node[], 
  routes: Route[],
  params: SimulationParams,
  numScenarios: number,
  disruptionTypes: string[]
): { overall: SimulationResults, scenarios: {[key: string]: SimulationResults} } => {
  // Base case simulation without disruptions
  const baseResults = runSupplyChainSimulation(nodes, routes, params);
  
  // Map to store results for different scenarios
  const scenarioResults: {[key: string]: SimulationResults} = {};
  
  // Run disruption scenarios
  disruptionTypes.forEach(disruptionType => {
    let disruptedNodes = [...nodes];
    let disruptedRoutes = [...routes];
    
    // Apply disruption based on type
    switch (disruptionType) {
      case "port_closure":
        // Simulate port closure by removing port nodes
        disruptedNodes = nodes.filter(n => n.type !== "port");
        disruptedRoutes = routes.filter(r => {
          const fromNode = nodes.find(n => n.id === r.from);
          const toNode = nodes.find(n => n.id === r.to);
          return !(fromNode?.type === "port" || toNode?.type === "port");
        });
        break;
        
      case "demand_spike":
        // Simulate demand spike by increasing demand variability
        const demandSpikeParams = {...params, demandVariability: Math.min(1, params.demandVariability * 3)};
        scenarioResults[disruptionType] = runSupplyChainSimulation(nodes, routes, demandSpikeParams);
        return; // Skip standard simulation for this scenario
        
      case "supplier_failure":
        // Simulate supplier failure by removing a random warehouse
        const warehouseIds = nodes.filter(n => n.type === "warehouse").map(n => n.id);
        if (warehouseIds.length > 0) {
          const failedWarehouseId = warehouseIds[Math.floor(Math.random() * warehouseIds.length)];
          disruptedNodes = nodes.filter(n => n.id !== failedWarehouseId);
          disruptedRoutes = routes.filter(r => r.from !== failedWarehouseId && r.to !== failedWarehouseId);
        }
        break;
        
      case "transportation_delay":
        // Simulate transportation delay by increasing lead time variability
        const delayParams = {...params, leadTimeVariability: Math.min(1, params.leadTimeVariability * 3)};
        scenarioResults[disruptionType] = runSupplyChainSimulation(nodes, routes, delayParams);
        return; // Skip standard simulation for this scenario
        
      case "weather_event":
        // Simulate severe weather by affecting both lead time and reducing inventory
        const weatherParams = {
          ...params, 
          leadTimeVariability: Math.min(1, params.leadTimeVariability * 2),
          initialInventory: params.initialInventory * 0.7
        };
        scenarioResults[disruptionType] = runSupplyChainSimulation(nodes, routes, weatherParams);
        return; // Skip standard simulation for this scenario
    }
    
    // Run simulation with disrupted network
    if (disruptedNodes.length > 0 && disruptedRoutes.length > 0) {
      scenarioResults[disruptionType] = runSupplyChainSimulation(disruptedNodes, disruptedRoutes, params);
      
      // Add comparison to baseline
      scenarioResults[disruptionType].scenarioComparison = {
        baselineMetrics: {
          serviceLevel: baseResults.serviceLevel,
          totalCost: baseResults.totalCost
        },
        improvement: ((scenarioResults[disruptionType].serviceLevel - baseResults.serviceLevel) / baseResults.serviceLevel) * 100
      };
    }
  });
  
  return {
    overall: baseResults,
    scenarios: scenarioResults
  };
};
