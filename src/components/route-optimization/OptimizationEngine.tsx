import { useState, useCallback } from "react";
import { Vehicle } from "./VehicleFleetConfig";
import { OptimizationService } from "@/services/OptimizationService";
import { ErrorHandlingService } from "@/services/ErrorHandlingService";
import { OptimizationMonitoringService } from "@/services/OptimizationMonitoringService";
import { OptimizationValidationService } from "@/services/OptimizationValidationService";
import { PerformanceMonitoringService } from "@/services/PerformanceMonitoringService";
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
  performanceMetrics?: {
    optimizationTime: number;
    convergenceRate: number;
    solutionQuality: number;
  };
  validationResults?: any;
}

export const useOptimizationEngine = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [optimizationProgress, setOptimizationProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<string>('');

  const errorHandler = ErrorHandlingService.getInstance();
  const monitor = OptimizationMonitoringService.getInstance();
  const validator = OptimizationValidationService.getInstance();
  const performance = PerformanceMonitoringService.getInstance();

  const optimizeRoutes = useCallback(async (
    nodes: Node[],
    currentRoutes: Route[],
    params: OptimizationParams,
    projectId: string = "route-optimization-project"
  ): Promise<OptimizationResult | null> => {
    const optimizationId = `opt_${Date.now()}`;
    
    try {
      setIsOptimizing(true);
      setError(null);
      setOptimizationProgress(0);
      setCurrentStage('Validating input data...');

      // Step 1: Comprehensive validation
      const validationResult = validator.validateOptimizationInput(
        nodes, currentRoutes, params.vehicles, params.constraints
      );

      if (!validationResult.isValid) {
        const errorMessages = validationResult.errors
          .filter(e => e.severity === 'error')
          .map(e => e.message);
        throw new Error(`Validation failed: ${errorMessages.join('; ')}`);
      }

      // Step 2: Start monitoring
      monitor.startOptimization(optimizationId, projectId);
      monitor.subscribeToProgress(optimizationId, (progress) => {
        setOptimizationProgress(progress.progress);
        setCurrentStage(progress.stage);
      });

      // Step 3: Start performance tracking
      performance.startPerformanceTimer(optimizationId);
      setCurrentStage('Preparing optimization parameters...');
      
      monitor.updateProgress(optimizationId, {
        status: 'running',
        progress: 10,
        stage: 'Preparing optimization parameters'
      });

      // Step 4: Prepare optimization parameters
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

      monitor.updateProgress(optimizationId, {
        progress: 25,
        stage: 'Executing optimization algorithm'
      });

      // Step 5: Call optimization service with retry logic
      let result;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          result = await OptimizationService.getInstance().optimizeRoute(
            projectId,
            optimizationParams
          );
          break;
        } catch (optimizationError) {
          attempts++;
          const handledError = errorHandler.handleOptimizationError(optimizationError, {
            attempt: attempts,
            algorithm: params.algorithm,
            nodeCount: nodes.length
          });

          if (attempts >= maxAttempts || !errorHandler.shouldRetry(optimizationId)) {
            throw optimizationError;
          }

          console.warn(`Optimization attempt ${attempts} failed, retrying...`, handledError);
          errorHandler.incrementRetry(optimizationId);
          
          monitor.updateProgress(optimizationId, {
            progress: 30 + (attempts * 10),
            stage: `Retrying optimization (attempt ${attempts + 1})`
          });

          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }

      monitor.updateProgress(optimizationId, {
        progress: 70,
        stage: 'Processing optimization results'
      });

      if (result?.success && result.results) {
        // Step 6: Transform and validate results
        const optimizedRoutes = generateOptimizedRoutes(
          nodes,
          result.results,
          params.vehicles
        );

        monitor.updateProgress(optimizationId, {
          progress: 90,
          stage: 'Finalizing results'
        });

        // Step 7: Record performance metrics
        const optimizationTime = performance.endPerformanceTimer(optimizationId);
        performance.recordOptimizationBenchmark(
          params.algorithm,
          {
            optimizationTime,
            convergenceRate: result.results.convergenceRate || 0,
            solutionQuality: result.results.efficiency || 0,
            networkLatency: result.results.networkLatency || 0
          },
          {
            nodes: nodes.length,
            vehicles: params.vehicles.length,
            constraints: Object.keys(params.constraints).length
          }
        );

        // Step 8: Prepare final result
        const optimizationResult: OptimizationResult = {
          optimizedRoutes,
          totalCost: result.results.totalCost || 0,
          totalDistance: result.results.totalDistance || 0,
          totalTime: result.results.totalTime || 0,
          efficiency: result.results.metrics?.efficiency || 85,
          costSavings: result.costSavings || 0,
          recommendations: [
            ...result.recommendations || [],
            ...validationResult.suggestions
          ],
          performanceMetrics: {
            optimizationTime,
            convergenceRate: result.results.convergenceRate || 0,
            solutionQuality: result.results.efficiency || 0
          },
          validationResults: validationResult
        };

        monitor.completeOptimization(optimizationId, true, {
          totalCost: optimizationResult.totalCost,
          efficiency: optimizationResult.efficiency,
          costSavings: optimizationResult.costSavings
        });

        errorHandler.clearRetries(optimizationId);
        setOptimizationResult(optimizationResult);
        return optimizationResult;
      } else {
        throw new Error('Optimization failed to produce valid results');
      }
    } catch (err) {
      const handledError = errorHandler.handleOptimizationError(err, {
        algorithm: params.algorithm,
        nodeCount: nodes.length,
        vehicleCount: params.vehicles.length
      });

      monitor.completeOptimization(optimizationId, false);
      setError(handledError.message);
      return null;
    } finally {
      setIsOptimizing(false);
      monitor.unsubscribeFromProgress(optimizationId);
    }
  }, []);

  const generateOptimizedRoutes = (
    nodes: Node[],
    backendResults: any,
    vehicles: Vehicle[]
  ): Route[] => {
    const routes: Route[] = [];
    
    if (backendResults.optimizedRoute && Array.isArray(backendResults.optimizedRoute)) {
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
            transitTime: distance / 50,
            isOptimized: true,
            ownership: 'owned'
          });
        }
      }
    }

    return routes;
  };

  const calculateDistance = (node1: Node, node2: Node): number => {
    const R = 6371;
    const dLat = (node2.latitude - node1.latitude) * Math.PI / 180;
    const dLon = (node2.longitude - node1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(node1.latitude * Math.PI / 180) * Math.cos(node2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const cancelOptimization = useCallback(() => {
    const activeOpts = monitor.getActiveOptimizations();
    activeOpts.forEach(opt => monitor.cancelOptimization(opt.id));
    setIsOptimizing(false);
  }, []);

  return {
    optimizeRoutes,
    cancelOptimization,
    isOptimizing,
    optimizationResult,
    error,
    optimizationProgress,
    currentStage,
    clearResult: () => setOptimizationResult(null),
    clearError: () => setError(null),
    getPerformanceReport: () => performance.getPerformanceReport(),
    getErrorHistory: () => errorHandler.getErrorHistory()
  };
};
