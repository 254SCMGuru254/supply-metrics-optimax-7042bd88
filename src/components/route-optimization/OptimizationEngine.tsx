
import { useState, useCallback } from "react";
import { Vehicle } from "./VehicleFleetConfig";
import { OptimizationService } from "@/services/OptimizationService";
import type { Node, Route } from "@/components/map/MapTypes";

interface OptimizationParams {
  algorithm: 'nearest_neighbor' | 'genetic_algorithm' | 'simulated_annealing' | 'or_tools';
  vehicles: Vehicle[];
  constraints: {
    maxDistance?: number;
    maxDuration?: number;
    timeWindows?: boolean;
    capacityConstraints?: boolean;
  };
}

interface OptimizationResult {
  optimizedRoutes: Route[];
  totalCost: number;
  totalDistance: number;
  totalTime: number;
  efficiency: number;
  costSavings: number;
  recommendations: string[];
}

export const useOptimizationEngine = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const optimizeRoutes = useCallback(async (
    nodes: Node[],
    currentRoutes: Route[],
    params: OptimizationParams,
    projectId: string = "route-optimization-project"
  ): Promise<OptimizationResult | null> => {
    setIsOptimizing(true);
    setError(null);

    try {
      // Prepare optimization parameters
      const optimizationParams = {
        algorithm: params.algorithm,
        nodes: nodes.map(node => ({
          id: node.id,
          name: node.name,
          latitude: node.latitude,
          longitude: node.longitude,
          demand: node.metadata?.demand || 0,
          capacity: node.metadata?.capacity || 0,
          type: node.type
        })),
        vehicles: params.vehicles,
        constraints: params.constraints,
        costPerKm: params.vehicles[0]?.costPerKm || 2.5,
        maxDistance: params.constraints.maxDistance || 1000,
        timeWindows: params.constraints.timeWindows || false
      };

      // Call optimization service
      const result = await OptimizationService.getInstance().optimizeRoute(
        projectId,
        optimizationParams
      );

      if (result.success && result.results) {
        // Transform backend results to frontend format
        const optimizedRoutes = generateOptimizedRoutes(
          nodes,
          result.results,
          params.vehicles
        );

        const optimizationResult: OptimizationResult = {
          optimizedRoutes,
          totalCost: result.results.totalCost || 0,
          totalDistance: result.results.totalDistance || 0,
          totalTime: result.results.totalTime || 0,
          efficiency: result.results.metrics?.efficiency || 85,
          costSavings: result.costSavings || 0,
          recommendations: result.recommendations || []
        };

        setOptimizationResult(optimizationResult);
        return optimizationResult;
      } else {
        throw new Error('Optimization failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown optimization error';
      setError(errorMessage);
      return null;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  const generateOptimizedRoutes = (
    nodes: Node[],
    backendResults: any,
    vehicles: Vehicle[]
  ): Route[] => {
    const routes: Route[] = [];
    
    if (backendResults.optimizedRoute && Array.isArray(backendResults.optimizedRoute)) {
      // Generate routes from optimized sequence
      for (let i = 0; i < backendResults.optimizedRoute.length - 1; i++) {
        const fromNodeId = backendResults.optimizedRoute[i];
        const toNodeId = backendResults.optimizedRoute[i + 1];
        
        const fromNode = nodes.find(n => n.id === fromNodeId);
        const toNode = nodes.find(n => n.id === toNodeId);
        
        if (fromNode && toNode) {
          const distance = calculateDistance(fromNode, toNode);
          const vehicle = vehicles[0] || { costPerKm: 2.5 };
          
          routes.push({
            id: `optimized-route-${i}`,
            from: fromNodeId,
            to: toNodeId,
            type: 'road',
            volume: toNode.metadata?.demand || 50,
            cost: distance * vehicle.costPerKm,
            transitTime: distance / 50, // Assume 50 km/h average speed
            isOptimized: true,
            ownership: 'owned'
          });
        }
      }
    }

    return routes;
  };

  const calculateDistance = (node1: Node, node2: Node): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (node2.latitude - node1.latitude) * Math.PI / 180;
    const dLon = (node2.longitude - node1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(node1.latitude * Math.PI / 180) * Math.cos(node2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return {
    optimizeRoutes,
    isOptimizing,
    optimizationResult,
    error,
    clearResult: () => setOptimizationResult(null),
    clearError: () => setError(null)
  };
};
