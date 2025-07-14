import type { Node, Route } from "@/components/map/MapTypes";

// Network flow optimization utility functions
export const createInitialNetwork = (nodes: Node[]): Route[] => {
  const routes: Route[] = [];
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].latitude - nodes[j].latitude;
      const dy = nodes[i].longitude - nodes[j].longitude;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      routes.push({
        id: crypto.randomUUID(),
        from: nodes[i].id,
        to: nodes[j].id,
        volume: 0,
        cost: Math.round(distance * 100),
        ownership: 'owned'
      });
    }
  }
  
  return routes;
};

export const optimizeNetworkFlow = (nodes: Node[], routes: Route[]): Route[] => {
  if (nodes.length < 2) return routes;
  
  const optimizedRoutes = [...routes];
  optimizedRoutes.sort((a, b) => (a.cost || 0) - (b.cost || 0));
  
  optimizedRoutes.forEach(route => {
    const baseCost = route.cost || 1;
    const maxPossibleFlow = Math.round(10000 / baseCost);
    route.volume = Math.min(Math.floor(Math.random() * maxPossibleFlow) + 50, 1000);
    route.isOptimized = true;
  });
  
  return optimizedRoutes;
};

export const calculateFlowEfficiency = (optimizedRoutes: Route[]): number => {
  const totalFlow = optimizedRoutes.reduce((sum, route) => sum + (route.volume || 0), 0);
  const averageFlow = totalFlow / Math.max(optimizedRoutes.length, 1);
  
  const flowVariance = optimizedRoutes.reduce((sum, route) => {
    const diff = (route.volume || 0) - averageFlow;
    return sum + (diff * diff);
  }, 0) / Math.max(optimizedRoutes.length, 1);
  
  const flowStdDev = Math.sqrt(flowVariance);
  
  return Math.min(100, Math.max(0, 100 * (1 - flowStdDev / Math.max(averageFlow, 1))));
};
