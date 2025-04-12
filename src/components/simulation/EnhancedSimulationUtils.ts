import { Node, Route } from "@/components/map/MapTypes";

// Simulation Parameters
export interface SimulationParams {
  duration: number; // Simulation duration in days
  timeStep: number; // Time step in hours
  demandVolatility: number; // Percentage
  supplyDisruptionRisk: number; // Percentage
  transportDelayRisk: number; // Percentage
  leadTimeVariability: number; // Percentage
  initialInventoryLevels: number; // Percentage
  reorderQuantity: number;
  reorderPoint: number;
  holdingCost: number;
  shortageCost: number;
  transportCostPerUnit: number;
  productionCapacity: number;
  storageCapacity: number;
}

// Simulation State
export interface SimulationState {
  time: number;
  nodes: {
    [nodeId: string]: {
      inventoryLevel: number;
      demand: number;
      supply: number;
      production: number;
      storage: number;
      backlog: number;
    };
  };
  routes: {
    [routeId: string]: {
      shipmentSize: number;
      transitTimeRemaining: number;
      status: "inTransit" | "idle";
    };
  };
  events: SimulationEvent[];
}

// Simulation Event
export interface SimulationEvent {
  time: number;
  type: "demandSurge" | "supplyDisruption" | "transportDelay" | "inventoryShortage";
  nodeId?: string;
  routeId?: string;
  severity?: number;
  description: string;
}

// Utility function to generate initial simulation state
export const createInitialSimulationState = (
  nodes: Node[],
  routes: Route[],
  params: SimulationParams
): SimulationState => {
  const initialState: SimulationState = {
    time: 0,
    nodes: {},
    routes: {},
    events: [],
  };

  // Initialize node states
  nodes.forEach((node) => {
    initialState.nodes[node.id] = {
      inventoryLevel: (node.capacity || 1000) * (params.initialInventoryLevels / 100),
      demand: 0,
      supply: 0,
      production: 0,
      storage: node.capacity || 1000,
      backlog: 0,
    };
  });

  // Initialize route states
  routes.forEach((route) => {
    initialState.routes[route.id] = {
      shipmentSize: 0,
      transitTimeRemaining: 0,
      status: "idle",
    };
  });

  return initialState;
};

// Function to calculate demand based on historical data and volatility
export const calculateDemand = (
  node: Node,
  time: number,
  params: SimulationParams
): number => {
  // Base demand (you can replace this with actual historical data)
  let baseDemand = node.metadata?.demand || 100;

  // Apply seasonal fluctuations (example: higher demand in summer)
  if (time % 365 > 150 && time % 365 < 250) {
    baseDemand *= 1.2; // 20% increase in summer
  }

  // Apply random volatility
  const volatilityFactor = 1 + (Math.random() - 0.5) * (params.demandVolatility / 100);
  const demand = baseDemand * volatilityFactor;

  return demand;
};

// Function to simulate supply disruptions
export const simulateSupplyDisruptions = (
  nodes: Node[],
  routes: Route[],
  time: number,
  params: SimulationParams
): SimulationEvent[] => {
  const events: SimulationEvent[] = [];

  // Check for supply disruptions at each node
  nodes.forEach((node) => {
    if (Math.random() < params.supplyDisruptionRisk / 100) {
      const severity = Math.random() * 0.5 + 0.5; // Severity between 50% and 100%
      events.push({
        time,
        type: "supplyDisruption",
        nodeId: node.id,
        severity,
        description: `Supply disruption at ${node.name} (Severity: ${(severity * 100).toFixed(0)}%)`,
      });
    }
  });

  // Check for transport delays on each route
  routes.forEach((route) => {
    if (Math.random() < params.transportDelayRisk / 100) {
      const delay = Math.floor(Math.random() * 7) + 1; // Delay between 1 and 7 days
      events.push({
        time,
        type: "transportDelay",
        routeId: route.id,
        severity: delay,
        description: `Transport delay on route from ${route.from} to ${route.to} (Delay: ${delay} days)`,
      });
    }
  });

  return events;
};

// Function to update simulation state based on events
export const updateStateWithEvents = (
  state: SimulationState,
  events: SimulationEvent[]
): void => {
  events.forEach((event) => {
    switch (event.type) {
      case "supplyDisruption":
        if (event.nodeId) {
          // Reduce supply at the affected node
          state.nodes[event.nodeId].supply *= (1 - (event.severity || 0));
        }
        break;
      case "transportDelay":
        // Implement transport delay logic here
        break;
      // Handle other event types as needed
    }
  });
};

// Function to simulate the passage of time and update the simulation state
export const simulateTimeStep = (
  state: SimulationState,
  nodes: Node[],
  routes: Route[],
  params: SimulationParams
): SimulationEvent[] => {
  const events: SimulationEvent[] = [];

  // Increment time
  state.time += params.timeStep / 24;

  // Calculate demand for each node
  nodes.forEach((node) => {
    state.nodes[node.id].demand = calculateDemand(node, state.time, params);
  });

  // Simulate supply disruptions and transport delays
  const disruptionEvents = simulateSupplyDisruptions(nodes, routes, state.time, params);
  events.push(...disruptionEvents);

  // Update state with events
  updateStateWithEvents(state, events);

  // Simulate inventory management and transportation
  simulateInventoryManagement(state, nodes, routes, params);

  return events;
};

// Function to simulate inventory management and transportation
export const simulateInventoryManagement = (
  state: SimulationState,
  nodes: Node[],
  routes: Route[],
  params: SimulationParams
): void => {
  // Node-level logic
  nodes.forEach((node) => {
    const nodeId = node.id;
    const nodeState = state.nodes[nodeId];

    // Meet demand from inventory
    const demandToMeet = Math.min(nodeState.inventoryLevel, nodeState.demand);
    nodeState.inventoryLevel -= demandToMeet;
    nodeState.backlog += nodeState.demand - demandToMeet;

    // Check if reorder is needed
    if (nodeState.inventoryLevel < params.reorderPoint) {
      // Find a route to replenish inventory (simplified: assume one route)
      const incomingRoute = routes.find((route) => route.to === nodeId);
      if (incomingRoute) {
        // Start a shipment if the route is idle
        if (state.routes[incomingRoute.id].status === "idle") {
          state.routes[incomingRoute.id].shipmentSize = params.reorderQuantity;
          state.routes[incomingRoute.id].transitTimeRemaining = (incomingRoute.transitTime || 1) * 24; // Convert days to hours
          state.routes[incomingRoute.id].status = "inTransit";
        }
      } else {
        console.warn(`No incoming route found for node ${nodeId}`);
      }
    }

    // Production (if applicable)
    if (node.type === "warehouse") {
      const production = Math.min(params.productionCapacity, nodeState.storage - nodeState.inventoryLevel);
      nodeState.inventoryLevel += production;
      nodeState.production = production;
    }
  });

  // Route-level logic
  routes.forEach((route) => {
    const routeState = state.routes[route.id];

    if (routeState.status === "inTransit") {
      routeState.transitTimeRemaining -= params.timeStep;

      if (routeState.transitTimeRemaining <= 0) {
        // Shipment arrives
        const destinationNodeId = route.to;
        state.nodes[destinationNodeId].inventoryLevel += routeState.shipmentSize;
        routeState.shipmentSize = 0;
        routeState.status = "idle";
      }
    }
  });
};

// Function to calculate key performance indicators (KPIs)
export const calculateKPIs = (
  state: SimulationState,
  nodes: Node[],
  params: SimulationParams
): {
  serviceLevel: number;
  inventoryTurnover: number;
  totalCost: number;
} => {
  let totalDemand = 0;
  let metDemand = 0;
  let totalInventoryValue = 0;
  let totalHoldingCost = 0;
  let totalShortageCost = 0;
  let totalTransportCost = 0;

  nodes.forEach((node) => {
    const nodeId = node.id;
    const nodeState = state.nodes[nodeId];

    totalDemand += nodeState.demand;
    metDemand += nodeState.demand - nodeState.backlog;
    totalInventoryValue += nodeState.inventoryLevel;
    totalHoldingCost += nodeState.inventoryLevel * params.holdingCost;
    totalShortageCost += nodeState.backlog * params.shortageCost;
  });

  state.routes && Object.values(state.routes).forEach((routeState) => {
    totalTransportCost += routeState.shipmentSize * params.transportCostPerUnit;
  });

  const serviceLevel = totalDemand > 0 ? metDemand / totalDemand : 1;
  const inventoryTurnover = totalDemand > 0 ? totalDemand / totalInventoryValue : 0;
  const totalCost = totalHoldingCost + totalShortageCost + totalTransportCost;

  return {
    serviceLevel,
    inventoryTurnover,
    totalCost,
  };
};

// Enhanced Simulation Logic
export const runEnhancedSimulation = (
  nodes: Node[],
  routes: Route[],
  params: SimulationParams,
  initialState?: SimulationState
): {
  simulationStates: SimulationState[];
  events: SimulationEvent[];
  kpis: {
    serviceLevel: number;
    inventoryTurnover: number;
    totalCost: number;
  }[];
} => {
  // Initialize simulation state
  let currentState: SimulationState = initialState || createInitialSimulationState(nodes, routes, params);
  const simulationStates: SimulationState[] = [currentState];
  const allEvents: SimulationEvent[] = [];
  const kpis: {
    serviceLevel: number;
    inventoryTurnover: number;
    totalCost: number;
  }[] = [];

  // Run simulation for the specified duration
  for (let day = 0; day < params.duration; day++) {
    for (let hour = 0; hour < 24; hour += params.timeStep) {
      // Simulate time step and get events
      const events = simulateTimeStep(currentState, nodes, routes, params);
      allEvents.push(...events);

      // Calculate KPIs
      const currentKPIs = calculateKPIs(currentState, nodes, params);
      kpis.push(currentKPIs);

      // Clone the state for the next iteration
      currentState = JSON.parse(JSON.stringify(currentState));
      simulationStates.push(currentState);
    }
  }

  return {
    simulationStates,
    events: allEvents,
    kpis,
  };
};

// Function to generate a summary of the simulation results
export const generateSimulationSummary = (
  simulationStates: SimulationState[],
  events: SimulationEvent[],
  kpis: {
    serviceLevel: number;
    inventoryTurnover: number;
    totalCost: number;
  }[],
  params: SimulationParams
): string => {
  // Calculate average KPIs
  const avgServiceLevel = kpis.reduce((sum, kpi) => sum + kpi.serviceLevel, 0) / kpis.length;
  const avgInventoryTurnover = kpis.reduce((sum, kpi) => sum + kpi.inventoryTurnover, 0) / kpis.length;
  const avgTotalCost = kpis.reduce((sum, kpi) => sum + kpi.totalCost, 0) / kpis.length;

  // Count event types
  const supplyDisruptions = events.filter((event) => event.type === "supplyDisruption").length;
  const transportDelays = events.filter((event) => event.type === "transportDelay").length;
  const inventoryShortages = events.filter((event) => event.type === "inventoryShortage").length;

  // Generate summary string
  let summary = `
    Simulation Summary:
    --------------------
    Duration: ${params.duration} days
    Time Step: ${params.timeStep} hours
    
    Average KPIs:
    Service Level: ${(avgServiceLevel * 100).toFixed(2)}%
    Inventory Turnover: ${avgInventoryTurnover.toFixed(2)}
    Total Cost: ${avgTotalCost.toFixed(2)}
    
    Events:
    Supply Disruptions: ${supplyDisruptions}
    Transport Delays: ${transportDelays}
    Inventory Shortages: ${inventoryShortages}
  `;

  return summary;
};

// Enhanced disruption analysis
export const assessDisruptionImpact = (
  nodes: Node[],
  routes: Route[],
  params: SimulationParams,
  disruption: SimulationEvent,
  initialState?: SimulationState
): {
  impactedNodes: {
    nodeId: string;
    inventoryLevelChange: number;
    demandChange: number;
  }[];
  impactedRoutes: {
    routeId: string;
    statusChange: "delayed" | "normal";
  }[];
  kpiChanges: {
    serviceLevelChange: number;
    costChange: number;
  };
} => {
  // Clone the initial state to avoid modifying it directly
  let currentState: SimulationState = initialState || createInitialSimulationState(nodes, routes, params);

  // Apply the disruption to the simulation state
  switch (disruption.type) {
    case "supplyDisruption":
      if (disruption.nodeId) {
        // Reduce supply at the affected node
        currentState.nodes[disruption.nodeId].supply *= (1 - (disruption.severity || 0));
      }
      break;
    case "transportDelay":
      // Implement transport delay logic here
      break;
    // Handle other disruption types as needed
  }

  // Run the simulation for a limited number of time steps to assess the impact
  const timeStepsToAssess = 10; // Adjust as needed
  for (let i = 0; i < timeStepsToAssess; i++) {
    simulateTimeStep(currentState, nodes, routes, params);
  }

  // Assess the impact on nodes
  const impactedNodes: {
    nodeId: string;
    inventoryLevelChange: number;
    demandChange: number;
  }[] = [];

  nodes.forEach((node) => {
    const nodeId = node.id;
    const initialNodeState = initialState?.nodes[nodeId];
    const currentNodeState = currentState.nodes[nodeId];

    if (initialNodeState && currentNodeState) {
      const inventoryLevelChange = currentNodeState.inventoryLevel - initialNodeState.inventoryLevel;
      const demandChange = currentNodeState.demand - initialNodeState.demand;

      impactedNodes.push({
        nodeId,
        inventoryLevelChange,
        demandChange,
      });
    }
  });

  // Assess the impact on routes
  const impactedRoutes: {
    routeId: string;
    statusChange: "delayed" | "normal";
  }[] = [];

  routes.forEach((route) => {
    const routeId = route.id;
    const initialRouteState = initialState?.routes[routeId];
    const currentRouteState = currentState.routes[routeId];

    if (initialRouteState && currentRouteState) {
      let statusChange: "delayed" | "normal" = "normal";
      if (disruption.type === "transportDelay" && disruption.routeId === routeId) {
        statusChange = "delayed";
      }

      impactedRoutes.push({
        routeId,
        statusChange,
      });
    }
  });

  // Calculate KPI changes
  const initialKPIs = initialState ? calculateKPIs(initialState, nodes, params) : {
    serviceLevel: 0,
    inventoryTurnover: 0,
    totalCost: 0,
  };
  const currentKPIs = calculateKPIs(currentState, nodes, params);

  const kpiChanges: {
    serviceLevelChange: number;
    costChange: number;
  } = {
    serviceLevelChange: currentKPIs.serviceLevel - initialKPIs.serviceLevel,
    costChange: currentKPIs.totalCost - initialKPIs.totalCost,
  };

  return {
    impactedNodes,
    impactedRoutes,
    kpiChanges,
  };
};

// Enhanced resilience strategies
export const evaluateResilienceStrategies = (
  nodes: Node[],
  routes: Route[],
  params: SimulationParams,
  disruption: SimulationEvent,
  strategy: "increaseInventory" | "diversifySuppliers" | "improveTransport",
  initialState?: SimulationState
): {
  kpiChanges: {
    serviceLevelChange: number;
    costChange: number;
  };
  strategyDescription: string;
} => {
  // Clone the initial state to avoid modifying it directly
  let currentState: SimulationState = initialState || createInitialSimulationState(nodes, routes, params);

  // Apply the resilience strategy
  switch (strategy) {
    case "increaseInventory":
      // Increase inventory levels at all nodes
      nodes.forEach((node) => {
        currentState.nodes[node.id].inventoryLevel *= 1.2; // 20% increase
      });
      break;
    case "diversifySuppliers":
      // Implement supplier diversification logic here
      break;
    case "improveTransport":
      // Implement transport improvement logic here
      break;
  }

  // Apply the disruption to the simulation state
  switch (disruption.type) {
    case "supplyDisruption":
      if (disruption.nodeId) {
        // Reduce supply at the affected node
        currentState.nodes[disruption.nodeId].supply *= (1 - (disruption.severity || 0));
      }
      break;
    case "transportDelay":
      // Implement transport delay logic here
      break;
    // Handle other disruption types as needed
  }

  // Run the simulation for a limited number of time steps to assess the impact
  const timeStepsToAssess = 10; // Adjust as needed
  for (let i = 0; i < timeStepsToAssess; i++) {
    simulateTimeStep(currentState, nodes, routes, params);
  }

  // Calculate KPI changes
  const initialKPIs = initialState ? calculateKPIs(initialState, nodes, params) : {
    serviceLevel: 0,
    inventoryTurnover: 0,
    totalCost: 0,
  };
  const currentKPIs = calculateKPIs(currentState, nodes, params);

  const kpiChanges: {
    serviceLevelChange: number;
    costChange: number;
  } = {
    serviceLevelChange: currentKPIs.serviceLevel - initialKPIs.serviceLevel,
    costChange: currentKPIs.totalCost - initialKPIs.totalCost,
  };

  let strategyDescription = "";
  switch (strategy) {
    case "increaseInventory":
      strategyDescription = "Increased inventory levels by 20% at all nodes.";
      break;
    case "diversifySuppliers":
      strategyDescription = "Implemented supplier diversification strategy.";
      break;
    case "improveTransport":
      strategyDescription = "Improved transport infrastructure and reduced delays.";
      break;
  }

  return {
    kpiChanges,
    strategyDescription,
  };
};
